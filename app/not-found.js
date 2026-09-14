import Link from 'next/link'
import styles from './not-found.module.css'

// Root not-found: Next renders this for any unmatched URL across the whole app
// (mistyped paths, old/renamed blog links, crawlers hitting dead URLs) as well
// as for explicit notFound() calls. It renders inside the root layout, so the
// Header, cookie banner, and analytics all appear as normal. Next automatically
// serves it with a 404 status and injects <meta name="robots" content="noindex">.
export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.code} aria-hidden="true">
          404
        </div>
        <h1 className={styles.title}>This page took a break</h1>
        <p className={styles.body}>
          The page you&apos;re looking for moved, or it never existed. No
          worries — let&apos;s get you back on track.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.button}>
            Back to home
          </Link>
          <Link href="/plans" className={styles.buttonGhost}>
            See the plans
          </Link>
        </div>

        <p className={styles.help}>
          Think something&apos;s broken?{' '}
          <Link href="/contact" className={styles.helpLink}>
            Let us know
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
