'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Mirror.module.css'

const LINES = [
  { t: 'You said “one more” at nine.', dim: false },
  { t: 'Now it’s 2am. The assignment is still there.', dim: false },
  { t: 'The application. The thing you wanted to learn.', dim: true },
  { t: 'Another evening became “I’ll start tomorrow.”', dim: true }
]

const START = 21 * 60 // 9:00 PM
const END = 26 * 60 // 2:00 AM (next day)

function format(mins) {
  let h = Math.floor(mins / 60) % 24
  const m = mins % 60
  const ampm = h >= 12 && h < 24 ? 'PM' : 'AM'
  let h12 = h % 12
  if (h12 === 0) h12 = 12
  return { time: `${h12}:${String(m).padStart(2, '0')}`, ampm }
}

export default function Mirror() {
  const ref = useRef(null)
  const [mins, setMins] = useState(START)
  const [run, setRun] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const lines = Array.from(el.querySelectorAll('[data-line]'))

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      lines.forEach((l) => (l.dataset.on = 'true'))
      const raf = requestAnimationFrame(() => setMins(END))
      return () => cancelAnimationFrame(raf)
    }

    el.dataset.animate = 'true'
    const lineIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.dataset.on = 'true'
            lineIo.unobserve(e.target)
          }
        })
      },
      { threshold: 0.6 }
    )
    lines.forEach((l) => lineIo.observe(l))

    const clockIo = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun(true)
          clockIo.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    clockIo.observe(el)

    return () => {
      lineIo.disconnect()
      clockIo.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!run) return
    const id = setInterval(() => {
      setMins((m) => {
        if (m >= END) {
          clearInterval(id)
          return END
        }
        return m + 6
      })
    }, 55)
    return () => clearInterval(id)
  }, [run])

  const { time, ampm } = format(mins)
  const late = mins >= 24 * 60 // past midnight

  return (
    <section
      className={styles.section}
      ref={ref}
      aria-labelledby="mirror-heading"
    >
      <div className={styles.glow} />
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.eyebrow}>Be honest for a second</p>
          <h2 id="mirror-heading" className={styles.heading}>
            The late night <span className={styles.accent}>gaming loop.</span>
          </h2>

          <div className={styles.lines}>
            {LINES.map((l, i) => (
              <span
                key={i}
                data-line
                data-on="false"
                className={`${styles.line} ${l.dim ? styles.dim : ''}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {l.t}
              </span>
            ))}
          </div>

          <p className={styles.turn}>
            Recognize the loop. Give tomorrow a different start.
          </p>
        </div>

        <div className={styles.right} aria-hidden="true">
          <div className={`${styles.clock} ${late ? styles.clockLate : ''}`}>
            <div className={styles.clockFace}>
              <span className={styles.clockTime}>{time}</span>
              <span className={styles.clockAmpm}>{ampm}</span>
            </div>
            <div className={styles.clockMeta}>
              <span className={styles.clockDot} />
              <span className={styles.clockNote}>
                {late ? 'still playing' : 'one more game'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
