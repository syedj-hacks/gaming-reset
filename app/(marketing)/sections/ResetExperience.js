'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { HOME_FAQ } from './faqData'
import s from './ResetExperience.module.css'
import { HoursVisual, TimeReclaimed } from './TimeReclaimed'

const steps = [
  {
    label: 'Notice the moment',
    title: 'Before “one more”\nbecomes all night.',
    copy: 'The Windows app notices when a game or launcher opens. A small pause gives you room to choose.',
    tag: '01 / AWARENESS'
  },
  {
    label: 'Choose something better',
    title: 'A different kind\nof next level.',
    copy: 'Turn the urge to play into a real-world action. Your personal plan gives you somewhere else to start.',
    tag: '02 / ALTERNATIVES'
  },
  {
    label: 'Keep your promise',
    title: 'Your limit.\nYour evening.',
    copy: 'Set your own daily hours or lock your launchers for a while. Optional boundaries, chosen by you.',
    tag: '03 / BOUNDARIES'
  }
]

function DesktopPreview({ active, setActive }) {
  const [choice, setChoice] = useState('Study for 25 minutes')
  const [limit, setLimit] = useState(2)
  return (
    <div className={s.desktop}>
      <div className={s.windowBar}>
        <span className={s.windowDots}>● ● ●</span>
        <span>Gaming Reset</span>
        <span className={s.live}>
          <i /> Desktop companion
        </span>
      </div>
      <div className={s.appBody}>
        <div className={s.appRail} aria-hidden="true">
          <b>◆</b>
          <span>◫</span>
          <span>◎</span>
          <span>◷</span>
          <span className={s.railBottom}>GR</span>
        </div>
        <div className={s.appMain}>
          <div className={s.appTop}>
            <span>YOUR EVENING, RECLAIMED</span>
            <span className={s.example}>Interactive preview</span>
          </div>
          <div className={s.previewContent} key={active}>
            {active === 0 && (
              <>
                <div className={s.radar}>
                  <div />
                  <div />
                  <span>◆</span>
                </div>
                <span className={s.appEyebrow}>GAME LAUNCH DETECTED</span>
                <h3>A moment for yourself.</h3>
                <p>
                  You opened a game. What would you like this next hour to look
                  like?
                </p>
                <button className={s.appButton} onClick={() => setActive(1)}>
                  Find something else to do
                </button>
                <span className={s.appFootnote}>
                  A little space between impulse and action.
                </span>
              </>
            )}
            {active === 1 && (
              <>
                <div className={s.choiceIcon}>☀</div>
                <span className={s.appEyebrow}>MAKE ROOM FOR REAL LIFE</span>
                <h3>Start somewhere small.</h3>
                <p>One choice. A different direction.</p>
                <div className={s.choices}>
                  {[
                    'Study for 25 minutes',
                    'Work on your CV',
                    'Practice a skill'
                  ].map((item, i) => (
                    <button
                      aria-pressed={choice === item}
                      key={item}
                      onClick={() => setChoice(item)}
                    >
                      <span>{['▣', '▤', '◎'][i]}</span>
                      {item}
                      <span>{choice === item ? '✓' : '+'}</span>
                    </button>
                  ))}
                </div>
                <span className={s.appFootnote} role="status">
                  Selected: {choice}. Make this hour yours.
                </span>
              </>
            )}
            {active === 2 && (
              <>
                <div className={s.limitRing}>
                  <strong>
                    {limit}
                    <small>hours / day</small>
                  </strong>
                </div>
                <span className={s.appEyebrow}>YOU SET THE BOUNDARY</span>
                <h3>Decide before you play.</h3>
                <p>Choose a limit while the choice is easy.</p>
                <label className={s.rangeLabel} htmlFor="preview-limit">
                  Daily gaming limit <span>{limit}h</span>
                </label>
                <input
                  id="preview-limit"
                  className={s.range}
                  type="range"
                  min="1"
                  max="6"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                />
                <span className={s.appFootnote}>
                  Preview only. Your settings stay unchanged.
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={s.appTabs} aria-label="Explore the desktop app">
        {steps.map((step, i) => (
          <button
            key={step.tag}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
          >
            <span>0{i + 1}</span>
            {['Detect', 'Redirect', 'Protect'][i]}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ResetExperience({ mirror, lifeLost, stories }) {
  const root = useRef(null)
  const story = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = root.current
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      frame = 0
      const rect = story.current.getBoundingClientRect()
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight))
      )
      el.style.setProperty('--journey', progress)
      if (
        window.innerWidth > 800 &&
        rect.top < window.innerHeight * 0.2 &&
        rect.bottom > window.innerHeight * 0.7
      )
        setActive(Math.min(2, Math.floor(progress * 3)))
    }
    const onScroll = () => {
      if (!frame && !motion.matches) frame = requestAnimationFrame(update)
    }
    const syncMotion = () => {
      el.dataset.motion = motion.matches ? 'reduced' : 'full'
    }
    syncMotion()
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(s.visible)
            observer.unobserve(entry.target)
          }
        }),
      { threshold: 0.12 }
    )
    el.querySelectorAll('[data-reveal]').forEach((node) =>
      observer.observe(node)
    )
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    motion.addEventListener('change', syncMotion)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      motion.removeEventListener('change', syncMotion)
    }
  }, [])

  return (
    <div className={s.experience} ref={root}>
      <section className={s.hero}>
        <div className={s.heroGrid} aria-hidden="true" />
        <div className={s.heroContent}>
          <div className={s.eyebrow}>
            <span className={s.statusDot} /> A RESET FOR YOUR GAMING HABITS
          </div>
          <h1>
            Less grind.
            <br />
            <span>More life.</span>
          </h1>
          <p>
            Your hours keep climbing. Your plans keep waiting.
            <br />
            Notice the time, set a boundary, and make room for what comes next.
          </p>
          <div className={s.heroActions}>
            <Link className={s.primary} href="/signup" prefetch={false}>
              Find your reset
            </Link>
          </div>
          <div className={s.trialNote}>
            3 days free <span>·</span> No credit card <span>·</span> Windows +
            web
          </div>
        </div>
        <HoursVisual />
        <div className={s.heroFooter}>
          <span>BUILT FOR THE MOMENT YOU SAY “ONE MORE.”</span>
          <span>
            SCROLL TO RESET <span aria-hidden="true">↓</span>
          </span>
        </div>
      </section>

      {mirror}
      {lifeLost}
      <TimeReclaimed />

      <section
        className={s.journey}
        ref={story}
        id="how-it-works"
        aria-label="How Gaming Reset works"
      >
        <div className={s.journeySticky}>
          <div className={s.journeyCopy}>
            <span className={s.eyebrow}>A LITTLE SUPPORT. RIGHT ON TIME.</span>
            <div className={s.stepCopy} key={active}>
              <span className={s.stepTag}>{steps[active].tag}</span>
              <h2>{steps[active].title}</h2>
              <p>{steps[active].copy}</p>
            </div>
            <div className={s.steps}>
              {steps.map((step, i) => (
                <button
                  key={step.tag}
                  aria-pressed={active === i}
                  onClick={() => setActive(i)}
                >
                  <span>0{i + 1}</span>
                  {step.label}
                </button>
              ))}
            </div>
            <span className={s.downloadNote}>
              Windows app included. Download from your dashboard.
            </span>
          </div>
          <DesktopPreview active={active} setActive={setActive} />
        </div>
      </section>

      {stories}

      <section className={s.faq} id="faq" data-reveal>
        <div>
          <span className={s.eyebrow}>A FEW THINGS TO KNOW</span>
          <h2>
            Good questions.
            <br />
            <em>Straight answers.</em>
          </h2>
          <Link className={s.textLink} href="/contact">
            Let’s talk
          </Link>
        </div>
        <div className={s.faqItems}>
          {HOME_FAQ.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
