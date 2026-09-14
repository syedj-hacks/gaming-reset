import { redirect } from 'next/navigation'
import styles from './confirmed.module.css'

// Landing page for MOBILE-app signups' email confirmation link. The mobile
// confirmation email points here (a normal web URL) instead of the
// gamingreset:// deep link, so opening it on a desktop shows this page instead
// of a blank one. On success the email is already confirmed by the time the
// browser lands here, so the only job is to tell the user to open the app and
// sign in. Expired/invalid links land here too (Supabase sends ?error=…) and
// get a clear "link expired" message instead of a misleading "confirmed".
export const metadata = {
  title: 'Email confirmed | Gaming Reset',
  robots: { index: false, follow: false },
}

export default async function EmailConfirmedPage({ searchParams }) {
  const params = (await searchParams) ?? {}

  // Expired / invalid link: Supabase redirects here with ?error=…&error_code=…
  // instead of a code. Collapse those verbose params into one clean ?expired=1
  // flag (replace, so nothing lingers in history) and render the expired state.
  if ('error' in params || 'error_code' in params) {
    redirect('/auth/confirmed?expired=1')
  }

  // Success: Supabase appends a one-time ?code=. It's inert (not exchangeable
  // without the PKCE verifier, which isn't on this device; single-use; short-
  // lived) and we never touch it — strip it to a clean URL. The ?expired=1 flag
  // is the one param we keep (it drives the expired state below).
  if (!('expired' in params) && Object.keys(params).length > 0) {
    redirect('/auth/confirmed')
  }

  if ('expired' in params) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={`${styles.badge} ${styles.badgeError}`}>!</div>
          <h1 className={styles.title}>Link expired</h1>
          <p className={styles.body}>
            This confirmation link is invalid or has expired. Open the{' '}
            <strong>Gaming Reset</strong> app on your phone and sign up again to get
            a fresh link, or sign in if you&apos;ve already confirmed.
          </p>
          <a href="gamingreset://" className={styles.button}>
            Open the app
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.badge}>✓</div>
        <h1 className={styles.title}>Email confirmed</h1>
        <p className={styles.body}>
          Your account is all set. Open the <strong>Gaming Reset</strong> app on
          your phone and sign in to start your free 3-day trial.
        </p>
        <a href="gamingreset://" className={styles.button}>
          Open the app
        </a>
      </div>
    </div>
  )
}
