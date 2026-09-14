'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Stakes.module.css'

const SITUATIONS = [
  'The semester you swore you’d turn around.',
  'The friends who slowly stopped inviting you.',
  'The body you keep meaning to get back to.',
  'The person beside you who needed you present.',
  'The version of yourself you keep putting off.',
]

export default function Stakes() {
  const [active, setActive] = useState(0)
  const [running, setRunning] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      const raf = requestAnimationFrame(() => setRunning(false))
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
    const id = setInterval(() => {
      setActive((a) => (a + 1) % SITUATIONS.length)
    }, 2400)
    return () => clearInterval(id)
  }, [running])

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.glow} />
      <div className={styles.inner}>
        <div className={styles.left}>
          <h2 className={styles.title}>
            You’re not wasting time.<br />
            You’re <span className={styles.accent}>hiding from something.</span>
          </h2>
          <p className={styles.lead}>
            The hours don’t feel lost while you’re in them, until you add them
            up, and notice what they quietly took with them.
          </p>

          <ul className={styles.list}>
            {SITUATIONS.map((s, i) => (
              <li
                key={s}
                className={`${styles.row} ${i === active ? styles.rowActive : ''}`}
              >
                <span className={styles.bar} />
                <span className={styles.text}>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.orbWrap}>
            <span className={styles.ring} />
            <span className={styles.ring} />
            <span className={styles.ring} />
            <span className={styles.orb} />
          </div>
          <p className={styles.visualLabel}>
            It’s still here.<br />Waiting for you to come back.
          </p>
        </div>
      </div>
    </section>
  )
}
