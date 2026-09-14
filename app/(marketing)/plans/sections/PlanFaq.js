'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './PlanFaq.module.css'
import { PLAN_FAQ as QA } from './planFaqData'

function Item({ q, a, open, onToggle }) {
  const bodyRef = useRef(null)
  // Measure the answer's natural height after mount so we can animate maxHeight
  // without reading the ref during render (refs aren't render-safe values).
  const [bodyHeight, setBodyHeight] = useState(0)
  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const raf = requestAnimationFrame(() => setBodyHeight(el.scrollHeight))
    return () => cancelAnimationFrame(raf)
  }, [a])

  return (
    <div className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
      <button className={styles.q} onClick={onToggle} aria-expanded={open}>
        <span>{q}</span>
        <span className={styles.icon} aria-hidden="true">
          <span className={styles.iconBar} />
          <span className={`${styles.iconBar} ${styles.iconBarV}`} />
        </span>
      </button>
      <div
        className={styles.aWrap}
        style={{ maxHeight: open ? `${bodyHeight}px` : 0 }}
      >
        <p className={styles.a} ref={bodyRef}>{a}</p>
      </div>
    </div>
  )
}

export default function PlanFaq() {
  const [open, setOpen] = useState(0)
  const [shown, setShown] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      const raf = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(raf)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>BEFORE YOU DECIDE</span>
          <h2 className={styles.title}>The honest answers.</h2>
          <p className={styles.sub}>
            No fine print, no catch. Here’s exactly how it works.
          </p>
        </div>

        <div className={`${styles.list} ${shown ? styles.listOn : ''}`}>
          {QA.map((item, i) => (
            <div
              key={item.q}
              className={styles.itemReveal}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <Item
                q={item.q}
                a={item.a}
                open={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
