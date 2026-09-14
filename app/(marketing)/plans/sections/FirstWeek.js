'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './FirstWeek.module.css'

const DAYS = [
  { d: 'Mon', mission: 'Set your baseline' },
  { d: 'Tue', mission: 'Swap one hour out' },
  { d: 'Wed', mission: 'Morning walk + photo' },
  { d: 'Thu', mission: 'Call someone real' },
  { d: 'Fri', mission: 'No late night queue' },
  { d: 'Sat', mission: 'Plan tomorrow' },
  { d: 'Sun', mission: 'Reflect & reset' },
]

const CYCLE = 11 // 0..7 fill, 8..10 hold, then loop

export default function FirstWeek() {
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)
  const ref = useRef(null)

  // Only animate once it scrolls into view
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      const raf = requestAnimationFrame(() => setStep(7))
      return () => cancelAnimationFrame(raf)
    }
    const io = new IntersectionObserver(
      ([e]) => setRunning(e.isIntersecting),
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setStep((s) => (s + 1) % CYCLE), 620)
    return () => clearInterval(id)
  }, [running])

  const done = Math.min(step, 7)
  const rating = 1180 + done * 34
  const hours = (5.0 - done * 0.4).toFixed(1)

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.tag}>WHAT WEEK ONE LOOKS LIKE</span>
          <h2 className={styles.title}>
            Seven days. <span className={styles.accent}>Ranked up.</span>
          </h2>
          <p className={styles.lead}>
            You don&apos;t quit cold turkey. You log your hours, beat yesterday,
            and your rating climbs. Here&apos;s a single week. Watch it move.
          </p>
        </div>

        <div className={styles.board}>
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Your rating</span>
              <span className={`${styles.statNum} ${styles.up}`}>
                {rating.toLocaleString()}
                <svg className={styles.trend} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <path d="M23 6l-9.5 9.5-5-5L1 18" />
                  <path d="M17 6h6v6" />
                </svg>
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Hours played / day</span>
              <span className={`${styles.statNum} ${styles.down}`}>
                {hours}
                <span className={styles.statUnit}>h</span>
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Days on plan</span>
              <span className={styles.statNum}>{done}<span className={styles.statUnit}>/7</span></span>
            </div>
          </div>

          <div className={styles.days}>
            {DAYS.map((day, i) => {
              const isDone = i < done
              const isCurrent = i === done && done < 7
              return (
                <div
                  key={day.d}
                  className={`${styles.day} ${isDone ? styles.dayDone : ''} ${isCurrent ? styles.dayCurrent : ''}`}
                >
                  <span className={styles.dayName}>{day.d}</span>
                  <span className={styles.dayCheck}>
                    {isDone ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="14" height="14">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <span className={styles.dayPoint} />
                    )}
                  </span>
                  <span className={styles.dayMission}>{day.mission}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* /signup, not /onboarding — see the note in CtaStrip.js. */}
        <Link href="/signup" prefetch={false} className={styles.cta}>
          Start week one free →
        </Link>
      </div>
    </section>
  )
}
