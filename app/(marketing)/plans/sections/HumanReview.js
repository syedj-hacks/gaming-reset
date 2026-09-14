'use client'

import { useEffect, useState } from 'react'
import styles from './HumanReview.module.css'
import { pricingById, formatUsd } from '@/lib/pricing'

// Entry cadence, derived. This section is currently unpublished (see the import
// note in plans/page.js) but still compiles, so it must never name a retired
// plan — reading pricingById('weekly') here would have thrown once weekly went.
const MONTHLY = pricingById('monthly')

// One looped conversation: you submit proof → a real coach reviews → approves.
const STEPS = 5 // 0 mission · 1 submitted · 2 typing · 3 reply · 4 hold

export default function HumanReview() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      const raf = requestAnimationFrame(() => setStep(3))
      return () => cancelAnimationFrame(raf)
    }
    const id = setInterval(() => {
      setStep((s) => (s + 1) % STEPS)
    }, 1500)
    return () => clearInterval(id)
  }, [])

  return (
    <section className={styles.section}>
      <div className={styles.glow} />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.tag}>NOT AN ALGORITHM</span>
          <h2 className={styles.title}>
            On the other side of your screen is{' '}
            <span className={styles.accent}>a real person.</span>
          </h2>
          <p className={styles.lead}>
            Most apps fire a notification into the void and hope you tap it.
            Here, a real coach actually checks your proof, notices your streaks,
            and reaches out when you go quiet. That human is what your {formatUsd(MONTHLY.amountUsd)} a
            {' '}{MONTHLY.per} pays for, and it&apos;s the thing that makes people stick.
          </p>
          <ul className={styles.points}>
            <li><span className={styles.dot} /> Every photo task is reviewed by hand</li>
            <li><span className={styles.dot} /> They notice patterns a bot never would</li>
            <li><span className={styles.dot} /> Slip up, and a real message lands, not an auto email</li>
          </ul>
        </div>

        <div className={styles.phone} aria-hidden="true">
          <div className={styles.phoneHead}>
            <span className={styles.liveDot} />
            Task review · live
          </div>

          <div className={styles.chat}>
            {/* Mission card */}
            <div className={`${styles.mission} ${step >= 0 ? styles.on : ''}`}>
              <span className={styles.missionLabel}>Day 3 mission</span>
              <span className={styles.missionText}>Walk 20 minutes outside, submit a photo</span>
            </div>

            {/* User submits proof */}
            <div className={`${styles.bubbleRow} ${styles.right} ${step >= 1 ? styles.on : ''}`}>
              <div className={`${styles.bubble} ${styles.userBubble}`}>
                <span className={styles.thumb}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </span>
                Proof submitted
              </div>
            </div>

            {/* Coach typing */}
            {step === 2 && (
              <div className={`${styles.bubbleRow} ${styles.left} ${styles.on}`}>
                <span className={styles.avatar}>A</span>
                <div className={`${styles.bubble} ${styles.typing}`}>
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            {/* Coach approval */}
            <div className={`${styles.bubbleRow} ${styles.left} ${step >= 3 ? styles.on : ''}`}>
              <span className={styles.avatar}>A</span>
              <div className={`${styles.bubble} ${styles.coachBubble}`}>
                Three days straight now. This is exactly how it starts to stick. Approved.
                <span className={styles.approved}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="12" height="12">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Approved by Aisha
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
