'use client'

import Link from 'next/link'
import styles from './DesktopBanner.module.css'
import { offersDesktopApp } from '@/lib/platforms'

// Set NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL in Vercel once the installer is hosted.
// Until then the card still renders and pitches the app, with the button in a
// "coming soon" state — the same shape DiscordBanner uses for its invite link.
// Hosting is deliberately not decided here: a ~100 MB .exe must NOT live in
// /public (it would ship inside every Vercel deploy), so this points at wherever
// the release actually lands, GitHub Releases or object storage.
const DOWNLOAD_URL = process.env.NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL || ''

// THIS CARD IS NOT DISMISSABLE. It used to carry a "Not now" button and a
// localStorage key scoped to the phase it was dismissed in, so that waving away
// "Coming very soon" did not also bury the download the day it shipped. All of
// that is gone: the desktop app is the only surface present at the moment of the
// behaviour, and a card people can permanently hide is a card the users who most
// need it hide first.
//
// Note for anyone watching analytics: everyone who tapped Not now under the old
// build sees this again now, because the key is no longer read. That is the
// intent, not a regression.
//
// NO LAUNCHER IS NAMED ANYWHERE IN THIS CARD, on purpose. The watcher covers
// Steam and Riot today and the list will keep growing, so naming one would date
// the copy on the day the next one lands and would read as "not for me" to
// everybody else. Which launchers are actually watched is decided once, in
// lib/platforms.js, and only decides WHO sees this — never what it says.
//
// `platforms` is profiles.gaming_platforms — the multi-select from onboarding,
// or null for every account created before that question existed.
export default function DesktopBanner({ platforms }) {
  if (!offersDesktopApp(platforms)) return null

  return (
    <section className={styles.banner}>
      <div className={styles.accentBar} aria-hidden="true" />
      <div className={styles.bannerGlow} />

      <div className={styles.bannerInner}>
        <div className={styles.bannerLeft}>
          <div className={styles.label}>
            <span className={styles.iconWrap}>
              <MonitorIcon />
            </span>
            Desktop app
            <span className={styles.tag}>Windows</span>
          </div>

          <h2 className={styles.title}>
            A little support, right when you need it.
          </h2>

          {/* What it actually does, under the headline that only says why.
              Three lines, in the order they matter: it shows up on its own, it
              takes the daily log off your hands, and it can hold the door shut
              if you ask it to. Still no launcher named, per the note above. */}
          <ul className={styles.points}>
            <li>Opens the second your launcher does, before the session starts</li>
            <li>Measures your hours for you, so you stop logging them by hand</li>
            <li>Shuts your launchers for as long as you ask, if you want it strict</li>
          </ul>
        </div>

        <div className={styles.bannerRight}>
          {DOWNLOAD_URL ? (
            <a className={styles.downloadBtn} href={DOWNLOAD_URL}>
              Download for Windows
            </a>
          ) : (
            <span className={`${styles.downloadBtn} ${styles.downloadBtnSoon}`} aria-disabled="true">
              Coming very soon
            </span>
          )}

          <p className={styles.meta}>
            {DOWNLOAD_URL
              ? 'Windows 10 and 11. Sign in with the account you already have.'
              : 'Windows 10 and 11. The link lands here the day it ships.'}
          </p>

          {/* Said up front rather than discovered on the SmartScreen prompt. For
              an app that asks to watch your processes, that warning confirms the
              exact fear the user already has, so naming it first is worth more
              than the space it costs. */}
          {DOWNLOAD_URL && (
            <p className={styles.note}>
              Windows may flag an unknown publisher while our code signing is
              still going through. That is expected.
            </p>
          )}

          {/* Before the download, not only inside the installer. The app starts
              with Windows, reads which programs are running, and closes games on
              request; someone deciding whether to install deserves that link at
              the moment of the decision, not after 100 MB has already landed. */}
          {DOWNLOAD_URL && (
            <p className={styles.note}>
              <Link href="/terms#desktop" className={styles.noteLink}>
                What it does on your PC
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

// Plain monitor glyph. Inline because the CSP blocks remote images, and
// deliberately generic — a launcher's logo would contradict the note above.
function MonitorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2.75" y="3.75" width="18.5" height="13" rx="2.25" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.5 20.25h7M12 16.75v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

