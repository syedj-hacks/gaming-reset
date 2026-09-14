'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import s from './TimeReclaimed.module.css'

const paths = {
  study: {
    label: 'Study',
    title: 'Close the game. Open the next chapter.',
    actions: [
      'Review a difficult topic',
      'Start the assignment',
      'Prepare for tomorrow'
    ]
  },
  career: {
    label: 'Find work',
    title: 'Give your next opportunity a little time.',
    actions: [
      'Improve your CV',
      'Send a thoughtful application',
      'Build a portfolio project'
    ]
  },
  skill: {
    label: 'Build a skill',
    title: 'Let your practice count somewhere new.',
    actions: [
      'Follow a short lesson',
      'Make something of your own',
      'Practice again tomorrow'
    ]
  },
  body: {
    label: 'Get moving',
    title: 'Leave the chair before the night does.',
    actions: ['Walk for twenty minutes', 'Train at home', 'Sleep on time']
  },
  people: {
    label: 'Reconnect',
    title: 'The people around you have evenings too.',
    actions: [
      'Message someone you miss',
      'Make a plan for the weekend',
      'Eat dinner away from the screen'
    ]
  }
}

export function HoursVisual() {
  const counter = useRef(null)
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let start
    const finish = () => {
      cancelAnimationFrame(frame)
      counter.current.textContent = '1,248'
    }
    const tick = (now) => {
      start ??= now
      const progress = Math.min(1, (now - start) / 2200)
      counter.current.textContent = Math.round(
        1200 + 48 * (1 - (1 - progress) ** 3)
      ).toLocaleString('en-US')
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    if (!motion.matches) frame = requestAnimationFrame(tick)
    motion.addEventListener('change', finish)
    return () => {
      cancelAnimationFrame(frame)
      motion.removeEventListener('change', finish)
    }
  }, [])

  return (
    <div className={s.heroVisual}>
      <Image
        src="/home/late-night.webp"
        alt="A student gaming late at night beside an open textbook and unfinished coursework"
        fill
        preload
        sizes="(max-width: 800px) 100vw, 50vw"
        className={s.heroImage}
      />
      <div className={s.imageShade} />
      <div className={s.visualLabel}>
        <span /> ANOTHER NIGHT ONLINE
      </div>
      <div className={s.library}>
        <div className={s.libraryTop}>
          <span>YOUR GAME LIBRARY</span>
          <span>ILLUSTRATIVE</span>
        </div>
        <div className={s.hours}>
          <strong ref={counter} aria-hidden="true">
            1,248
          </strong>
          <span className={s.srOnly}>1,248</span>
          <span>hours played</span>
        </div>
        <div className={s.bars} aria-hidden="true">
          {[18, 26, 22, 37, 43, 39, 55, 63, 70, 85, 90, 100].map(
            (height, i) => (
              <i
                key={i}
                style={{ height: `${height}%`, animationDelay: `${i * 55}ms` }}
              />
            )
          )}
        </div>
        <div className={s.libraryBottom}>
          <span>The number goes up.</span>
          <b>What’s moving forward?</b>
        </div>
      </div>
      <span className={s.photoNote}>Your assignment is still on page one.</span>
    </div>
  )
}

export function TimeReclaimed() {
  const [hours, setHours] = useState(1)
  const [path, setPath] = useState('study')
  const selection = paths[path]

  return (
    <section
      className={s.reclaimed}
      id="your-time"
      aria-labelledby="reclaimed-title"
    >
      <div className={s.heading}>
        <span>YOUR TIME HAS OTHER PLANS.</span>
        <h2 id="reclaimed-title">
          The hours are already there.
          <br />
          <em>Give them somewhere to go.</em>
        </h2>
        <p>
          You don’t need to change everything. Start with one hour you usually
          give to gaming.
        </p>
      </div>
      <div className={s.timeGrid}>
        <div className={s.planner}>
          <div className={s.tabs} aria-label="Choose where to spend your time">
            {Object.entries(paths).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setPath(key)}
                aria-pressed={path === key}
              >
                {item.label}
              </button>
            ))}
          </div>
          <h3>{selection.title}</h3>
          <label className={s.rangeLabel} htmlFor="reclaim-hours">
            Take back each day{' '}
            <strong>
              {hours} {hours === 1 ? 'hour' : 'hours'}
            </strong>
          </label>
          <input
            id="reclaim-hours"
            type="range"
            min="1"
            max="4"
            step="1"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
          />
          <div className={s.timeTotal} role="status">
            <strong>
              {hours * 7}
              <span>hours / week</span>
            </strong>
            <span>
              That’s <b>{hours * 365} hours</b> over a year.
            </span>
          </div>
          <ul>
            {selection.actions.map((action, i) => (
              <li key={action}>
                <span>0{i + 1}</span>
                {action}
              </li>
            ))}
          </ul>
          <Link href="/signup" prefetch={false}>
            Build a plan for my time
          </Link>
          <p className={s.note}>Ideas for your time, not promised outcomes.</p>
        </div>
      </div>
    </section>
  )
}
