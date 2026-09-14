'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { PLAN_PRICING, formatUsd, perDayCents, savingsVsMonthlyPct } from '@/lib/pricing'
import { PLAN_FAQ } from './planFaqData'
import s from '../plans.module.css'

function Icon({ name = 'arrow', className = '' }) {
  const paths = {
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    check: 'm5 12 4 4L19 6',
    spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
    monitor: 'M4 4h16v12H4zM8 21h8m-4-5v5',
    shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6',
    chart: 'M4 4v16h16M8 15l4-5 4 2 4-7',
  }
  return <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}

const included = ['AI personalised plan & daily missions', 'Windows companion & automatic time tracking', 'Optional daily limits & launcher locks', 'Progress, streaks & rank progression', 'Photo check-ins & custom missions', 'One account across Windows & web']
const trialSteps = [
  { label: 'DAY 01', title: 'Make it personal.', copy: 'Tell us about your gaming habits and what you want more time for. Get a plan that starts where you are.', icon: 'spark' },
  { label: 'DAY 02', title: 'Change one evening.', copy: 'Try a daily mission. Install the Windows companion and give yourself a pause before the next session.', icon: 'monitor' },
  { label: 'DAY 03', title: 'Find your rhythm.', copy: 'Explore your progress and decide if Gaming Reset fits your life. Choose a paid plan when you’re ready.', icon: 'chart' },
]

export default function PlansExperience() {
  const root = useRef(null)
  const [cadenceId, setCadenceId] = useState(PLAN_PRICING[0].id)
  const [activeDay, setActiveDay] = useState(0)
  const plan = PLAN_PRICING.find((item) => item.id === cadenceId) || PLAN_PRICING[0]
  const saving = savingsVsMonthlyPct(plan)
  const annual = PLAN_PRICING.find((item) => item.id === 'yearly')
  const annualSaving = annual ? savingsVsMonthlyPct(annual) : null

  useEffect(() => {
    const el = root.current
    if (!el || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-visible', 'true')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    el.querySelectorAll('[data-reveal]').forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <div className={s.page} ref={root}>
      <section className={s.hero} aria-labelledby="plans-title">
        <div className={s.heroGrid} aria-hidden="true" />
        <div className={s.heroInner}>
          <div className={s.heroCopy}>
            <span className={s.eyebrow}><i /> YOUR NEXT CHAPTER STARTS HERE</span>
            <h1 id="plans-title">Invest in your<br /><span>offline life.</span></h1>
            <p className={s.lead}>More time for the person you want to be.<br className={s.desktopBreak} /> A little structure to help you get there.</p>
            <div className={s.heroNote}><span className={s.noteLine} /> One membership. Everything you need to reset.</div>
            <div className={s.orbitScene} aria-hidden="true">
              <div className={s.orbitOuter} /><div className={s.orbitInner} />
              <div className={s.orbitCore}><Icon name="spark" /><span>MAKE ROOM<br /><strong>FOR YOU.</strong></span></div>
              <span className={`${s.orbitTag} ${s.tagFocus}`}><i /> A little more focus</span>
              <span className={`${s.orbitTag} ${s.tagEvening}`}><i /> Your evenings back</span>
              <span className={`${s.orbitTag} ${s.tagLife}`}><i /> Life beyond the screen</span>
              <span className={s.orbitCaption}>LESS AUTOPILOT. MORE INTENTION.</span>
            </div>
          </div>

          <div className={s.planWrap} id="membership">
            <div className={s.cardTopline}><Icon name="spark" /> THE FULL RESET <span>ALL ACCESS</span></div>
            <div className={s.planCard}>
              <div className={s.cardHeading}><h2>Your reset. Your pace.</h2><p>Choose how you pay. Get it all either way.</p></div>
              <div className={s.billingSwitch} role="group" aria-label="Compare billing periods">
                {PLAN_PRICING.map((item) => <button type="button" key={item.id} aria-pressed={item.id === plan.id} onClick={() => setCadenceId(item.id)}>{item.name}{item.id === 'yearly' && annualSaving > 0 && <span>−{annualSaving}%</span>}</button>)}
              </div>
              <div className={s.priceArea} aria-live="polite" aria-atomic="true">
                <div className={s.priceAnimation} key={plan.id}>
                  <div className={s.price}><strong>{formatUsd(plan.amountUsd)}</strong><span>/ {plan.per}</span><span className={s.currency}>USD</span></div>
                  <p className={s.billingNote}>{plan.id === 'yearly' ? 'Billed once a year' : 'Billed monthly'} <span>·</span> about {perDayCents(plan)}¢ a day</p>
                  <span className={s.savings}>{saving > 0 ? `Save ${saving}% compared with paying monthly.` : 'A fresh start, without a yearly commitment.'}</span>
                </div>
              </div>
              <Link href="/signup" prefetch={false} className={s.primary}>Start my 3-day free trial <Icon /></Link>
              <p className={s.ctaNote}>No credit card required. No charge today.</p>
              <div className={s.includedTitle}><span>EVERYTHING IS INCLUDED</span><span>01 MEMBERSHIP</span></div>
              <ul className={s.features}>{included.map((feature) => <li key={feature}><Icon name="check" />{feature}</li>)}</ul>
              <div className={s.cardFooter}><Icon name="shield" /><span>Cancel anytime from your billing page.</span></div>
            </div>
            <p className={s.checkoutNote}>Try it first. Select your paid plan at checkout.</p>
          </div>
        </div>
        <div className={s.trustBar}><span><Icon name="monitor" /> Windows + web</span><span><Icon name="spark" /> 3 days of full access</span><span><Icon name="shield" /> You stay in control</span></div>
      </section>

      <section className={s.toolkit} aria-labelledby="toolkit-title">
        <div className={s.sectionHeading} data-reveal><div><span className={s.eyebrow}>BUILT AROUND REAL LIFE</span><h2 id="toolkit-title">A complete reset.<br /><span>Not another to-do list.</span></h2></div><p>Support before you play, direction when you pause, and progress you can actually see. All in your membership.</p></div>
        <div className={s.bento}>
          <article className={s.companion} data-reveal>
            <div className={s.featureLabel}><Icon name="monitor" /><span>YOUR WINDOWS COMPANION</span><span className={s.includedBadge}>Included</span></div>
            <h3>A pause that changes<br />the rest of your evening.</h3>
            <p>Notice when a game opens. Track your time automatically. Set a boundary while the choice is easy.</p>
            <div className={s.window}>
              <div className={s.windowTop}><span><i /><i /><i /></span><span>Gaming Reset</span><span>Preview</span></div>
              <div className={s.windowContent}><span className={s.smallSpark}><Icon name="spark" /></span><span className={s.windowEyebrow}>GAME LAUNCH DETECTED</span><h4>What about your other plans?</h4><p>Take a breath. This next hour is still yours.</p><div className={s.previewChoice}><span>↗</span> Make time for a real-world mission <Icon /></div><div className={s.windowBottom}><i /> A little space between impulse and action.</div></div>
            </div>
            <span className={s.platformNote}>Windows 10 & 11 · Download from your dashboard</span>
          </article>
          <article className={s.missions} data-reveal><div className={s.featureLabel}><Icon name="spark" /><span>A PLAN THAT KNOWS YOU</span></div><h3>Less “what now?”<br />More getting started.</h3><p>AI personalised missions turn your intentions into a next step.</p><div className={s.missionList}><span className={s.previewLabel}>EXAMPLE MISSIONS</span>{['Get outside for a short walk', 'Give a skill 25 minutes', 'Make a plan for tomorrow'].map((item, index) => <div key={item}><span className={index === 0 ? s.missionDone : s.missionCircle}>{index === 0 && <Icon name="check" />}</span><span>{item}</span><small>0{index + 1}</small></div>)}</div></article>
          <article className={s.progressCard} data-reveal><div className={s.featureLabel}><Icon name="chart" /><span>PROGRESS YOU CAN SEE</span></div><h3>Make real life<br />your next level.</h3><p>Build streaks, complete missions, and watch your rating grow.</p><div className={s.progressVisual} aria-hidden="true"><div className={s.progressBars}>{[24, 42, 34, 59, 52, 75, 96].map((height, index) => <i key={index} style={{ '--bar-height': `${height}%`, '--bar-delay': `${index * 90}ms` }} />)}</div><div className={s.chartLabels}><span>SMALL STEPS</span><span>FORWARD ↗</span></div></div><span className={s.previewLabel}>Illustrative progress, your pace is your own.</span></article>
        </div>
      </section>

      <section className={s.trialSection} aria-labelledby="trial-title" data-reveal>
        <div className={s.trialIntro}><span className={s.eyebrow}>TRY THE RESET, NOT JUST A DEMO</span><h2 id="trial-title">Three days.<br /><em>A different direction.</em></h2><p>Your trial opens the whole app. Start small, explore the tools, and see how they fit your day.</p><Link href="/signup" prefetch={false} className={s.textLink}>Find your starting point <Icon /></Link></div>
        <div className={s.timeline}><div className={s.daySelector} role="group" aria-label="Explore your three-day trial">{trialSteps.map((step, index) => <button type="button" aria-pressed={activeDay === index} key={step.label} onClick={() => setActiveDay(index)}><span>0{index + 1}</span>{['Get your plan', 'Try the tools', 'Keep going'][index]}</button>)}</div><div className={s.dayContent} key={activeDay} aria-live="polite" aria-atomic="true"><span className={s.dayIcon}><Icon name={trialSteps[activeDay].icon} /></span><span className={s.eyebrow}>{trialSteps[activeDay].label} / YOUR FREE TRIAL</span><h3>{trialSteps[activeDay].title}</h3><p>{trialSteps[activeDay].copy}</p></div><div className={s.trialFootnote}><Icon name="shield" /> No card up front. Continue only if it’s right for you.</div></div>
      </section>

      <section className={s.faqSection} aria-labelledby="faq-title" data-reveal><div className={s.faqIntro}><span className={s.eyebrow}>BEFORE YOU BEGIN</span><h2 id="faq-title">Clear plans.<br /><span>Straight answers.</span></h2><p>Something else on your mind?</p><Link href="/contact" className={s.textLink}>Talk to us <Icon /></Link></div><div className={s.faqList}>{PLAN_FAQ.map((item, index) => <details key={item.q}><summary><span className={s.faqNumber}>0{index + 1}</span><span>{item.q}</span><span className={s.faqPlus} aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div></section>
    </div>
  )
}
