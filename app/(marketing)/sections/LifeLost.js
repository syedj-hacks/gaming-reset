'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './LifeLost.module.css'

const TOTAL = 365
const HOURS_PER_DAY = 4
const LOST = Math.round((HOURS_PER_DAY * TOTAL) / 24)

export default function LifeLost() {
  const ref = useRef(null)
  const [lit, setLit] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      const raf = requestAnimationFrame(() => setLit(LOST))
      return () => cancelAnimationFrame(raf)
    }

    let started = false
    let timer = null

    const start = () => {
      if (started) return
      started = true
      let n = 0
      timer = setInterval(() => {
        n += 1
        setLit(n)
        if (n >= LOST && timer) clearInterval(timer)
      }, 30)
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          start()
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)

    return () => {
      io.disconnect()
      if (timer) clearInterval(timer)
    }
  }, [])

  return (
    <section className={styles.section} ref={ref} id="why-quitting">
      <div className={styles.glow} />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>The math nobody does</span>
          <h2 className={styles.title}>
            <span className={styles.big} aria-hidden="true">
              {lit}
            </span>
            <span className={styles.srOnly}>{LOST}</span> full days a year.
            <br />
            <span className={styles.accent}>Gone.</span>
          </h2>
          <p className={styles.lead}>
            Four hours a day adds up to 1,460 hours a year. That’s about 61 full
            days. Time that could go toward your degree, your next job, or a
            skill you’ve wanted to learn.
          </p>
          <p className={styles.note}>
            365 dots. One year. Blue dots show the equivalent time spent gaming.
          </p>
        </div>

        <div className={styles.gridWrap} aria-hidden="true">
          <div className={styles.grid}>
            {Array.from({ length: TOTAL }).map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i < lit ? styles.dotLost : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
