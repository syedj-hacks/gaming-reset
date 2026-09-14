'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './CtaStrip.module.css'
import resetStyles from './ResetExperience.module.css'

export default function CtaStrip() {
  const pathname = usePathname()
  if (pathname === '/') {
    return (
      <section className={resetStyles.closing}>
        <span className={resetStyles.eyebrow}>THE NEXT MOVE IS YOURS.</span>
        <h2>Your time.<br /><em>Take it back.</em></h2>
        <Link href="/signup" prefetch={false} className={resetStyles.primary}>Start your free reset</Link>
        <p>3 days free. No credit card. A little more life.</p>
      </section>
    )
  }
  return (
    <section className={styles.strip}>
      <div className={styles.container}>
        <div className={styles.chassis}>
          <div className={styles.gradientStream} />
          <div className={styles.mesh} />

          <div className={styles.messageHub}>
            <div className={styles.tag}>START TODAY</div>
            <h2 className={styles.title}>
              Your real life is waiting.{' '}
              <span className={styles.gradient}>Start ranking up.</span>
            </h2>
            <p className={styles.lead}>
              Takes 5 minutes to set up. No credit card needed. Your personalised
              daily plan is ready the moment you finish onboarding.
            </p>
            <div className={styles.badges}>
              {['3 day free trial', 'Built for competitive gamers', 'Web & mobile app'].map((b) => (
                <span key={b} className={styles.badge}>
                  <span className={styles.dot} />
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.actionHub}>
            <div className={styles.capsule}>
              <div className={styles.glow} />
              {/* /signup, not /onboarding. Onboarding requires a session and
                  bounces anyone without one to /login — so the site's main CTA
                  used to dump cold visitors on "Welcome back. Sign in to
                  continue your progress." Signup is the correct first step, and
                  it hands off to /onboarding itself once the account exists.
                  prefetch disabled: keeps the auth bundle off every marketing
                  page load. Other CTAs across the site point back at this
                  note. */}
              <Link href="/signup" prefetch={false} className={styles.btn}>Start My Free Trial →</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
