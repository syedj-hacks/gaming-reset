'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import BrandLogo from '../BrandLogo/BrandLogo'
import styles from './Header.module.css'

const NAV_LINKS = [
  { label: 'Home',       href: '/'                        },
  { label: 'Plans',      href: '/plans'                   },
  { label: 'Calculator', href: '/gaming-time-calculator'  },
  { label: 'Writing',    href: '/writing'                 },
  { label: 'Contact',    href: '/contact'                 },
]

export default function Header() {
  const [scrolled,     setScrolled]     = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [user,         setUser]         = useState(null)
  const [authReady,    setAuthReady]    = useState(false)
  const pathname  = usePathname()
  const router    = useRouter()
  // Loaded lazily below, so it starts as null rather than a client instance.
  const [supabase, setSupabase] = useState(null)
  const settingsRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Supabase is ~230 KB of JS and this header sits in the ROOT layout, so a
  // static import shipped the whole auth stack to every marketing and blog
  // page, none of which need it to render. Importing it lazily keeps it out of
  // those pages' initial bundle. Nothing visible changes: the auth buttons were
  // already gated behind `authReady`, so they simply resolve a tick later.
  useEffect(() => {
    let cancelled = false
    import('@/lib/supabase').then(({ createClient }) => {
      if (!cancelled) setSupabase(createClient())
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return
      setUser(session?.user ?? null)
      setAuthReady(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setAuthReady(true)
      }
    )
    return () => { active = false; subscription.unsubscribe() }
  }, [supabase])

  useEffect(() => {
    const raf = requestAnimationFrame(() => { setMenuOpen(false); setSettingsOpen(false) })
    return () => cancelAnimationFrame(raf)
  }, [pathname])

  // Close settings dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLogout() {
    // Unreachable in practice: the logout controls only render once `authReady`
    // is true, which requires the client to have loaded. Guarded anyway.
    if (!supabase) return

    // `scope: 'local'` is load-bearing, and the default is the bug it fixes.
    //
    // signOut() defaults to scope:'global', which revokes EVERY refresh token on
    // the account — not just this browser's. One user, three clients: closing
    // the tab here also signed out the phone and, worse, the desktop app, whose
    // whole job is to sit in the tray and catch a game launch. The watcher stops
    // on sign-out (see maybeInterrupt in the desktop repo's src/main/index.ts),
    // so "log out of the website" silently disarmed the thing the user is paying
    // for, on a machine they were not looking at, with no notification.
    //
    // Signing out of a browser means this browser. The places that genuinely
    // must reach other devices already say so explicitly and stay unchanged:
    // /api/update-password and /reset-password both pass scope:'others', because
    // a credential change SHOULD kick every other session.
    await supabase.auth.signOut({ scope: 'local' })
    router.push('/')
  }

  const renderActions = () => {
    if (!authReady) return <div className={styles.authPlaceholder} />

    if (user) {
      return (
        <div className={styles.actions}>
          <Link href="/dashboard"   className={styles.btnGhost}>Dashboard</Link>
          <Link href="/leaderboard" className={styles.btnGhost}>Leaderboard</Link>

          {/* Settings dropdown */}
          <div className={styles.settingsWrap} ref={settingsRef}>
            <button
              className={`${styles.btnGhost} ${styles.settingsBtn} ${settingsOpen ? styles.settingsBtnOpen : ''}`}
              onClick={() => setSettingsOpen((s) => !s)}
              aria-haspopup="true"
              aria-expanded={settingsOpen}
            >
              Settings
              <svg className={`${styles.chevron} ${settingsOpen ? styles.chevronOpen : ''}`}
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {settingsOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownSection}>
                  <span className={styles.dropdownLabel}>Account</span>
                  <Link href="/settings/account" className={styles.dropdownItem} onClick={() => setSettingsOpen(false)}>
                    <span className={styles.dropdownIcon}>◈</span>
                    Account settings
                    <span className={styles.dropdownHint}>Password & security</span>
                  </Link>
                  <Link href="/settings/billing" className={styles.dropdownItem} onClick={() => setSettingsOpen(false)}>
                    <span className={styles.dropdownIcon}>◆</span>
                    Billing
                    <span className={styles.dropdownHint}>Subscription & payments</span>
                  </Link>
                </div>
                <div className={styles.dropdownDivider} />
                <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>
                  <span className={styles.dropdownIcon}>→</span>
                  Log out
                  <span className={styles.dropdownHint}>{user.email}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className={styles.actions}>
        <Link href="/login"  className={styles.btnGhost}>Log in</Link>
        <Link href="/signup" className={styles.btnPrime}>Start Free Trial</Link>
      </div>
    )
  }

  const renderMobileActions = () => {
    if (!authReady) return null

    if (user) {
      return (
        <>
          <div className={styles.mobileDivider} />
          <Link href="/dashboard"        className={styles.mobileNavLink}>Dashboard</Link>
          <Link href="/leaderboard"      className={styles.mobileNavLink}>Leaderboard</Link>
          <Link href="/settings/account" className={styles.mobileNavLink}>Account settings</Link>
          <Link href="/settings/billing" className={styles.mobileNavLink}>Billing</Link>
          <button onClick={handleLogout} className={styles.mobileLogout}>Log out</button>
        </>
      )
    }

    return (
      <>
        <div className={styles.mobileDivider} />
        <Link href="/login"  className={styles.mobileGhost}>Log in</Link>
        <Link href="/signup" className={styles.mobilePrime}>Start Free Trial →</Link>
      </>
    )
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuOpen : ''}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Gaming Reset home">
          <BrandLogo size={24} />
        </Link>

        <nav className={styles.nav}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href}
              className={`${styles.navLink} ${pathname === href ? styles.navLinkActive : ''}`}>
              {label}
            </Link>
          ))}
        </nav>

        {renderActions()}

        <button
          type="button"
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          style={{ touchAction: 'manipulation' }}
        >
          <span /><span /><span />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        inert={!menuOpen ? true : undefined}
      >
        <nav className={styles.mobileNav}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} className={styles.mobileNavLink}>{label}</Link>
          ))}
          {renderMobileActions()}
        </nav>
      </div>
    </header>
  )
}