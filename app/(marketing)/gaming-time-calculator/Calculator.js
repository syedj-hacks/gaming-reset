'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './calculator.module.css'

// One year of days, drawn as a dot grid. Same visual language as the homepage
// LifeLost section, and the same arithmetic: hours per day across 365 days,
// divided into whole 24 hour days.
const DAYS_IN_YEAR = 365
const HOURS_PER_DAY = 24

// Comparison anchors. Every one of these is stated with its assumption in the
// methodology section below, because a calculator that hides its maths is just a
// scare graphic. Deliberately conservative where the research disagrees.
const HOURS_PER_BOOK = 5.5      // ~80,000 words at ~250 words per minute
const HOURS_PER_WORK_YEAR = 2080 // 40 hours x 52 weeks
const HOURS_PER_LANGUAGE = 600   // low end of FSI's easier-language estimate

function round(n) {
  return Math.round(n)
}

// Whole number, or one decimal when the value is small enough that rounding to
// zero would read as "nothing".
function smart(n) {
  if (n >= 10) return round(n).toLocaleString()
  if (n >= 1) return n.toFixed(1)
  return n.toFixed(2)
}

export default function Calculator() {
  const [hoursPerDay, setHoursPerDay] = useState(4)
  const [years, setYears] = useState(5)

  const hoursPerYear = hoursPerDay * DAYS_IN_YEAR
  const daysPerYear = hoursPerYear / HOURS_PER_DAY
  const totalHours = hoursPerYear * years
  const totalDays = totalHours / HOURS_PER_DAY
  const totalYears = totalDays / DAYS_IN_YEAR

  const lit = Math.min(DAYS_IN_YEAR, round(daysPerYear))

  return (
    <>
      {/* ── Inputs ── */}
      <div className={styles.controls}>
        <div className={styles.control}>
          <div className={styles.controlHead}>
            <label htmlFor="hours" className={styles.controlLabel}>
              Hours you play on an average day
            </label>
            <output className={styles.controlValue} htmlFor="hours">
              {hoursPerDay % 1 === 0 ? hoursPerDay : hoursPerDay.toFixed(1)}h
            </output>
          </div>
          <input
            id="hours"
            className={styles.slider}
            type="range"
            min="0.5"
            max="16"
            step="0.5"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(Number(e.target.value))}
          />
          <div className={styles.scale}>
            <span>30 min</span>
            <span>16h</span>
          </div>
        </div>

        <div className={styles.control}>
          <div className={styles.controlHead}>
            <label htmlFor="years" className={styles.controlLabel}>
              How many years it has been like this
            </label>
            <output className={styles.controlValue} htmlFor="years">
              {years} {years === 1 ? 'year' : 'years'}
            </output>
          </div>
          <input
            id="years"
            className={styles.slider}
            type="range"
            min="1"
            max="25"
            step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />
          <div className={styles.scale}>
            <span>1 year</span>
            <span>25 years</span>
          </div>
        </div>
      </div>

      {/* ── Headline result ── */}
      <div className={styles.result} aria-live="polite">
        <div className={styles.resultMain}>
          <span className={styles.resultBig}>{smart(totalDays)}</span>
          <span className={styles.resultUnit}>
            full days, awake and alive, given to a screen
          </span>
        </div>
        <p className={styles.resultSub}>
          That is <strong>{smart(totalYears)}</strong>{' '}
          {totalYears === 1 ? 'year' : 'years'} of your life, and{' '}
          <strong>{round(totalHours).toLocaleString()}</strong> hours in total.
        </p>
      </div>

      {/* ── One year, drawn ── */}
      <div className={styles.yearBlock}>
        <p className={styles.yearLabel}>
          One year at {hoursPerDay % 1 === 0 ? hoursPerDay : hoursPerDay.toFixed(1)}{' '}
          hours a day. Each dot is a day, and the red ones are already spent.
        </p>
        <div className={styles.grid} aria-hidden="true">
          {Array.from({ length: DAYS_IN_YEAR }).map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i < lit ? styles.dotLost : ''}`}
            />
          ))}
        </div>
        <p className={styles.yearCount}>
          <strong>{round(daysPerYear)}</strong> of 365 days, every single year.
        </p>
      </div>

      {/* ── What the same hours buy ── */}
      <div className={styles.swaps}>
        <p className={styles.swapsHead}>The same hours, spent differently</p>
        <div className={styles.swapGrid}>
          <div className={styles.swapCard}>
            <span className={styles.swapNum}>{smart(totalHours / HOURS_PER_BOOK)}</span>
            <span className={styles.swapLabel}>books read cover to cover</span>
          </div>
          <div className={styles.swapCard}>
            <span className={styles.swapNum}>{smart(totalHours / HOURS_PER_LANGUAGE)}</span>
            <span className={styles.swapLabel}>
              new languages, to a conversational level
            </span>
          </div>
          <div className={styles.swapCard}>
            <span className={styles.swapNum}>{smart(totalHours / HOURS_PER_WORK_YEAR)}</span>
            <span className={styles.swapLabel}>
              full time working years, at 40 hours a week
            </span>
          </div>
        </div>
        <p className={styles.swapsNote}>
          These are illustrations, not promises. Nobody converts gaming hours into
          skills one for one. The point is the size of the number, not the trade.
        </p>
      </div>

      {/* ── Soft CTA. Deliberately the only ask on the page, and it sits after
             the value, not in front of it. No email gate, no signup wall: the
             calculator is meant to be useful and shareable on its own. ── */}
      <div className={styles.cta}>
        <p className={styles.ctaText}>
          If that number landed harder than you expected, the useful question is
          what tomorrow looks like. We build you a daily plan around how your day
          actually works, so cutting back stops depending on willpower.
        </p>
        <Link href="/signup" prefetch={false} className={styles.ctaBtn}>
          Start free, 3 days
        </Link>
        <span className={styles.ctaMeta}>No credit card required</span>
      </div>
    </>
  )
}
