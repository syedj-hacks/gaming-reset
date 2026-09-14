'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './PlanCard.module.css'
import {
  PLAN_PRICING,
  formatUsd,
  perDayCents,
  savingsVsMonthlyPct,
} from '@/lib/pricing'

const FEATURES = [
  'AI personalised daily plan',
  'Automated daily missions tailored to you',
  'Progress, streak and rating tracking',
  'Rank progression and leaderboard',
  'Web and mobile app, one account',
  'Custom mission submissions',
  'Photo task check-ins',
]

// The billing cadences checkout actually sells: monthly and annual. This page
// used to show a single price under the line "One plan", which was not true, so
// visitors either never learned the cheaper option existed or met it as a
// surprise after deciding.
//
// Everything numeric is now DERIVED from lib/pricing.js rather than typed out:
// the price, the per-day figure and the "Save N%" line are all price facts that
// used to be hand-written here, so changing a price left them quietly lying.
// The USDT badge follows the same `crypto` flag checkout uses, so this card can
// no longer promise a payment method checkout will not offer.
//
// Only genuinely non-derivable wording is kept below.
const CADENCE_COPY = {
  monthly: { billed: 'Billed monthly',     lockIn: 'Billed monthly, no lock in' },
  yearly:  { billed: 'Billed once a year', lockIn: 'Billed once, then yearly' },
}

const BASE_PAY = ['Apple Pay', 'Google Pay', 'PayPal']
const TOP_TIER = Math.max(...PLAN_PRICING.map((plan) => plan.tier))

const CADENCES = PLAN_PRICING.map((plan) => {
  const copy = CADENCE_COPY[plan.id]
  const saving = savingsVsMonthlyPct(plan)
  return {
    id: plan.id,
    label: plan.name,
    price: formatUsd(plan.amountUsd),
    per: `/ ${plan.per}`,
    sub: `${copy.billed} · about ${perDayCents(plan)}¢ a day`,
    pay: plan.crypto ? [...BASE_PAY, 'USDT'] : BASE_PAY,
    assurance: [
      'Cancel any time',
      copy.lockIn,
      // Monthly is the baseline and cannot save against itself, so it gets a
      // reassurance instead.
      saving === null ? 'Only pay while it works' : `Save ${saving}% against monthly`,
    ],
    best: plan.tier === TOP_TIER,
  }
})

export default function PlanCard() {
  const [shown, setShown] = useState(false)
  const [cadenceId, setCadenceId] = useState(CADENCES[0].id)
  const ref = useRef(null)

  const cadence = CADENCES.find((c) => c.id === cadenceId) || CADENCES[0]

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
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.card}>
        <div className={styles.glow} />

        <div className={styles.top}>
          <span className={styles.badge}>PRO · Everything included</span>

          {/* Cadence switcher. Purely presentational: it changes the price on
              display, not what the CTA does. Every cadence starts the same
              3 day trial and the actual plan is chosen at checkout. */}
          <div className={styles.cadenceRow} role="tablist" aria-label="Billing period">
            {CADENCES.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={c.id === cadenceId}
                className={`${styles.cadenceBtn} ${c.id === cadenceId ? styles.cadenceBtnOn : ''}`}
                onClick={() => setCadenceId(c.id)}
              >
                {c.label}
                {c.best && <span className={styles.cadenceTag}>Best value</span>}
              </button>
            ))}
          </div>

          <div className={styles.priceBlock}>
            <span className={styles.price}>{cadence.price}</span>
            <span className={styles.per}>{cadence.per}</span>
          </div>
          <p className={styles.priceSub}>{cadence.sub}</p>

          {/* /signup, not /onboarding — see the note in CtaStrip.js. */}
          <Link href="/signup" prefetch={false} className={styles.cta}>
            Start 3 day free trial →
          </Link>
          <p className={styles.ctaMeta}>No credit card required</p>

          <div className={styles.payMethods}>
            <span className={styles.payLabel}>Pay with</span>
            {cadence.pay.map((m) => (
              <span key={m} className={styles.payBadge}>{m}</span>
            ))}
          </div>

          <div className={styles.assurance}>
            {cadence.assurance.map((a) => (
              <span key={a} className={styles.assureItem}>
                <span className={styles.assureDot} />
                {a}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.included}>
          <p className={styles.includedHead}>What you get, on every plan</p>
          <ul className={styles.list}>
            {FEATURES.map((f, i) => (
              <li
                key={f}
                className={`${styles.item} ${shown ? styles.itemOn : ''}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className={styles.check}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="13" height="13">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
