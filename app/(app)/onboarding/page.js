
'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './onboarding.module.css'
import IntakePreview, { IntakeIcon, STEP_ICONS } from './IntakePreview'
import { PLATFORMS } from '@/lib/platforms'
import { postJson } from '@/lib/http'
import {
  STEPS,
  TOTAL_STEPS,
  FIELD_STEPS,
  SESSION_SHAPES,
  LIFE_SITUATIONS,
  MIN_WORDS_REPLACEMENT,
  MIN_WORDS_TYPICAL_DAY,
  stepErrors,
  lowEffort,
  wordCount,
} from './steps'

// Reassurance while /api/generate-goals runs; these are not server progress.
// The last message holds when generation takes longer.
const LOADING_MESSAGES = [
  'Your goals give your plan a direction.',
  'Your routine helps us find the right moments.',
  'Small, practical missions are the starting point.',
  'A little structure. A little more room for real life.',
  'Still working on your plan. Keep this page open.',
]

export default function OnboardingPage() {
  const [step,           setStep]           = useState(1)
  const [direction,      setDirection]      = useState(1)   // 1 forward, -1 back — drives the pane transition
  const [loading,        setLoading]        = useState(false)
  const [checking,       setChecking]       = useState(false)
  const [done,           setDone]           = useState(false)
  const [consent,        setConsent]        = useState(false)
  const [loadingMsgIdx,  setLoadingMsgIdx]  = useState(0)
  const [error,          setError]          = useState('')
  // Field-level errors are hidden until the user has either tried to continue
  // or left the field, so a half-filled form is not a wall of red.
  const [attempted,      setAttempted]      = useState(false)
  const [touched,        setTouched]        = useState({})
  const [nudge,          setNudge]          = useState(false)
  const router   = useRouter()
  // Stable browser-client singleton (createClient() returns a new client each render).
  const [supabase] = useState(() => createClient())

  // Registered per field so a blocked Continue can put the cursor on the answer
  // that blocked it. Values are either the control itself or its wrapper (for
  // the button groups and the custom Dropdown, which own several elements).
  const fieldRefs = useRef({})
  const headingRef = useRef(null)
  const previousStep = useRef(step)

  useEffect(() => {
    if (previousStep.current !== step) {
      headingRef.current?.focus({ preventScroll: true })
      headingRef.current?.scrollIntoView({ block: 'nearest' })
      previousStep.current = step
    }
  }, [step])

const [answers, setAnswers] = useState({
  full_name: '', age: '', hours_daily: '',
  session_shape: '', gaming_platforms: [],
  plays_with_friends: null, friend_call_time: '',
  typical_day: '',
  life_situation: '',
  replacement_activity: ''
})

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data, error }) => {
      // /signup, not /login. Someone with no session who lands here is almost
      // always a new visitor (a bookmarked link, or a CTA we missed), not a
      // returning user — sending them to "Welcome back. Sign in to continue
      // your progress." asks them to recall an account they never made. Signup
      // still routes to /login for anyone who does have one.
      if (error || !data.user) { router.replace('/signup'); return }
      // Already onboarded? Don't let them redo it (and waste an AI generation).
      const { data: profile } = await supabase
        .from('profiles').select('onboarding_complete').eq('id', data.user.id).single()
      if (profile?.onboarding_complete) { router.replace('/dashboard'); return }
    })
  }, [router, supabase])

  // Rotate explanatory copy while the request runs. This is not a simulated
  // checklist: only the server response can mark the plan as ready.
  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setLoadingMsgIdx((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1))
    }, 4000)
    return () => clearInterval(interval)
  }, [loading])

  // Hold the finished state for a beat before handing over to the dashboard, so
  // the last thing the user sees is their plan being ready rather than a spinner
  // cutting out mid-frame.
  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => router.push('/dashboard'), 1100)
    return () => clearTimeout(t)
  }, [done, router])

  function set(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  function markTouched(key) {
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }))
  }

  // Multi-select: platforms is the only answer that holds more than one value.
  function togglePlatform(value) {
    setAnswers((prev) => ({
      ...prev,
      gaming_platforms: prev.gaming_platforms.includes(value)
        ? prev.gaming_platforms.filter((v) => v !== value)
        : [...prev.gaming_platforms, value],
    }))
  }

  const errors     = stepErrors(step, answers, consent)
  const canProceed = Object.keys(errors).length === 0
  const current    = STEPS[step - 1]

  // Show a field's error once the user has tried to move on, or once they have
  // left that field. Everything else stays quiet.
  function errorFor(field) {
    return (attempted || touched[field]) ? errors[field] : undefined
  }

  function focusField(field) {
    const el = fieldRefs.current[field]
    if (!el) return
    const target = /^(INPUT|TEXTAREA|BUTTON|SELECT)$/.test(el.tagName)
      ? el
      : el.querySelector('input, textarea, button, select')
    el.scrollIntoView?.({ block: 'nearest' })
    target?.focus?.()
  }

  function goToStep(target, dir) {
    setError('')
    setDirection(dir)
    setStep(target)
    setAttempted(false)
    setTouched({})
  }

  function nextStep() {
    if (!canProceed) {
      // Say WHICH answer is missing rather than just greying the button out.
      setAttempted(true)
      setNudge(true)
      focusField(Object.keys(errors)[0])
      return
    }
    setError('')
    goToStep(Math.min(step + 1, TOTAL_STEPS), 1)
  }

  function prevStep() {
    setError('')
    goToStep(Math.max(step - 1, 1), -1)
  }

  // A server rejection names the answer it rejected; send the user to the step
  // that owns it with the message attached.
  function rejectField(field, message) {
    const target = FIELD_STEPS[field] ?? TOTAL_STEPS
    setDirection(target < step ? -1 : 1)
    setStep(target)
    setTouched({})
    setAttempted(true)
    setError(message)
  }

  // Final step: (1) instant client heuristics, (2) server AI quality gate, then
  // (3) the expensive generation. Each gate sends the user back to the weaker
  // answer with a specific message instead of a generic "too short".
  async function handleFinalSubmit() {
    // Explicit consent is required before any sensitive data is processed, and
    // the last step's own answers have to clear the same bar as every other.
    if (!canProceed) {
      setAttempted(true)
      setNudge(true)
      setError(errors.consent || '')
      focusField(Object.keys(errors)[0])
      return
    }

    // ── Layer 2: free client heuristics (no network) ──
    if (lowEffort(answers.replacement_activity, MIN_WORDS_REPLACEMENT)) {
      rejectField('replacement_activity', 'Add a bit more detail about what you would actually do with that time.')
      return
    }
    if (lowEffort(answers.typical_day, MIN_WORDS_TYPICAL_DAY)) {
      rejectField('typical_day', 'Walk us through your real day: wake-up, when gaming starts and ends, sleep.')
      return
    }

    setError('')
    setChecking(true)

    // ── Layer 3: server-side AI quality gate, before spending a generation ──
    try {
      const res = await postJson('/api/validate-intake', {
        replacement_activity: answers.replacement_activity,
        typical_day:          answers.typical_day,
      })

      if (res.status === 429) {
        setError('You are going a bit fast. Please wait a moment and try again.')
        setChecking(false)
        return
      }

      const result = await res.json().catch(() => ({}))

      // Only block on an explicit, successful rejection. If the validator is
      // unavailable (5xx / network) we fail OPEN and let generation proceed.
      if (res.ok && result.valid === false) {
        rejectField(
          result.field,
          result.reason || 'Please add more genuine detail so we can build your plan.'
        )
        setChecking(false)
        return
      }
    } catch {
      // Couldn't reach the validator — fail open and continue.
    }

    setChecking(false)
    await runGeneration()
  }

  async function runGeneration() {
    setLoadingMsgIdx(0)
    setLoading(true)
    try {
      const intakeData = {
        full_name:            answers.full_name,
        age:                  answers.age,
        hours_daily:          parseInt(answers.hours_daily)  || 0,
        session_shape:        answers.session_shape,
        gaming_platforms:     answers.gaming_platforms,
        plays_with_friends:   answers.plays_with_friends === true,
        friend_call_time:     answers.friend_call_time || null,
        life_situation:       answers.life_situation,
        replacement_activity: answers.replacement_activity,
        typical_day:          answers.typical_day,
      }

      const saveResponse = await postJson('/api/generate-goals', {
        intakeData,
        timezone:  Intl.DateTimeFormat().resolvedOptions().timeZone,
        localDate: new Date().toLocaleDateString('en-CA'),
      })

      const result = await saveResponse.json().catch(() => ({}))
      if (result.success) {
        // Navigation happens on a short timer — see the `done` effect above.
        setDone(true)
        return
      }

      // A 4xx is the server rejecting a specific answer (or rate-limiting), and
      // it says which one. Surface its message and jump back to that step —
      // these are user-fixable, so the generic catch below would be a dead end.
      // 5xx stays generic on purpose: an AI or DB failure is transient and
      // there is nothing for the user to correct.
      if (saveResponse.status >= 400 && saveResponse.status < 500 && result.error) {
        setLoading(false)
        if (FIELD_STEPS[result.field]) rejectField(result.field, result.error)
        else setError(result.error)
        return
      }

      throw new Error(result.error || 'Save failed')
    } catch (err) {
      console.error('Onboarding error:', err)
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loadingGrid} aria-hidden="true" />
        <section className={styles.loadingCard} aria-labelledby="building-title">
          <span className={styles.eyebrow}>YOUR NEXT CHAPTER</span>
          <div className={`${styles.buildVisual} ${done ? styles.buildDone : ''}`} aria-hidden="true"><div /><div /><div /><span><IntakeIcon name={done ? 'check' : 'spark'} /></span></div>
          <h1 id="building-title">{done ? <>Your reset.<br /><em>Ready when you are.</em></> : <>A little structure.<br /><em>Built around you.</em></>}</h1>
          <p className={styles.loadingLead}>{done ? 'Your personal plan and first missions are ready. Let’s take the next step.' : 'We’re using your answers to create your personal plan and first daily missions.'}</p>
          <div className={styles.buildStatus} role="status">{!done && <span className={styles.btnSpinner} aria-hidden="true" />}{done ? 'Your plan is ready. Opening your dashboard…' : 'Creating your personal plan…'}</div>
          <p className={styles.loadingMessage} key={loadingMsgIdx}>{!done && LOADING_MESSAGES[loadingMsgIdx]}</p>
          <div className={styles.buildIncludes}><span><IntakeIcon name="person" />Your profile</span><span><IntakeIcon name="spark" />Daily missions</span><span><IntakeIcon name="clock" />Your routine</span></div>
          {done && <Link href="/dashboard" className={styles.dashboardLink}>Go to my dashboard <IntakeIcon name="arrow" /></Link>}
        </section>
      </main>
    )
  }

  function fieldProps(key) {
    return {
      ref: (el) => { fieldRefs.current[key] = el },
      onBlur: () => markTouched(key),
      'aria-invalid': Boolean(errorFor(key)),
      'aria-describedby': errorFor(key) ? `${key}-error` : undefined,
    }
  }

  function renderStep() {
    switch (step) {
      case 1: return <>
        <div className={styles.welcomeNote}><span><IntakeIcon name="spark" /></span><p>No perfect answers needed.<br /><strong>Just a little about the real you.</strong></p></div>
        <div className={styles.field}><label className={styles.label} htmlFor="name">What should we call you?</label><input {...fieldProps('full_name')} id="name" type="text" className={styles.input} placeholder="Your first name or preferred name" value={answers.full_name} autoComplete="given-name" maxLength={80} onChange={(e) => set('full_name', e.target.value)} /><FieldError field="full_name" message={errorFor('full_name')} /></div>
        <div className={styles.field}><label className={styles.label} htmlFor="age">And how old are you?</label><div className={styles.ageRow}><input {...fieldProps('age')} id="age" type="number" inputMode="numeric" className={`${styles.input} ${styles.ageInput}`} placeholder="Age" value={answers.age} min="13" max="80" onChange={(e) => set('age', e.target.value)} /><p>So your missions fit<br />your stage of life.</p></div><FieldError field="age" message={errorFor('age')} /></div>
      </>
      case 2: return <>
        <div className={styles.field}><label className={styles.label} htmlFor="daily">How many hours do you play on a typical day?</label><div className={styles.hoursBox}><div className={styles.hoursNumber}><input {...fieldProps('hours_daily')} id="daily" type="number" inputMode="numeric" placeholder="0" min="2" max="15" step="1" value={answers.hours_daily} onChange={(e) => { markTouched('hours_daily'); set('hours_daily', e.target.value) }} /><span>hours / day</span></div><div className={styles.hourPresets} role="group" aria-label="Common daily gaming hours">{[2, 4, 6, 8].map((hours) => <button key={hours} type="button" aria-pressed={answers.hours_daily !== '' && Number(answers.hours_daily) === hours} onClick={() => { markTouched('hours_daily'); set('hours_daily', String(hours)) }}>{hours}h</button>)}</div></div><span className={styles.fieldHint}>Choose a starting point or enter your own number.</span><FieldError field="hours_daily" message={errorFor('hours_daily')} /></div>
        <div className={styles.field}><span className={styles.label} id="session-label">What do your sessions usually look like?</span><div {...fieldProps('session_shape')} className={styles.choiceGrid} role="group" aria-labelledby="session-label">{SESSION_SHAPES.map((option, index) => <button type="button" key={option.value} className={styles.choice} aria-pressed={answers.session_shape === option.value} onClick={() => { markTouched('session_shape'); set('session_shape', option.value) }}><span className={styles.choiceGlyph} aria-hidden="true">{['☾', '◷', '⁙', '≋'][index]}</span><span>{option.label}</span><i aria-hidden="true"><IntakeIcon name="check" /></i></button>)}</div><FieldError field="session_shape" message={errorFor('session_shape')} /></div>
        <div className={styles.field}><div className={styles.labelLine}><span className={styles.label} id="platform-label">Where do you play?</span><span>Select all that apply</span></div><div {...fieldProps('gaming_platforms')} className={styles.platformGrid} role="group" aria-labelledby="platform-label">{PLATFORMS.map((platform) => <button type="button" key={platform.value} aria-pressed={answers.gaming_platforms.includes(platform.value)} className={styles.platform} onClick={() => { markTouched('gaming_platforms'); togglePlatform(platform.value) }}><IntakeIcon name={platform.value} /><strong>{platform.label}</strong><small>{platform.note}</small><i aria-hidden="true"><IntakeIcon name="check" /></i></button>)}</div><FieldError field="gaming_platforms" message={errorFor('gaming_platforms')} /></div>
      </>
      case 3: return <>
        <div className={styles.field}><span className={styles.label} id="friends-label">Do you usually play with friends?</span><div {...fieldProps('plays_with_friends')} className={styles.friendsGrid} role="group" aria-labelledby="friends-label">{[{ value: true, title: 'With my people', copy: 'Friends are part of the session.', icon: 'world' }, { value: false, title: 'Mostly solo', copy: 'It’s usually my own time.', icon: 'person' }].map((option) => <button type="button" key={String(option.value)} className={styles.friendCard} aria-pressed={answers.plays_with_friends === option.value} onClick={() => { markTouched('plays_with_friends'); set('plays_with_friends', option.value) }}><IntakeIcon name={option.icon} /><strong>{option.title}</strong><span>{option.copy}</span><i aria-hidden="true"><IntakeIcon name="check" /></i></button>)}</div><FieldError field="plays_with_friends" message={errorFor('plays_with_friends')} /></div>
        {answers.plays_with_friends === true && <div className={`${styles.field} ${styles.reveal}`}><div className={styles.labelLine}><label className={styles.label} htmlFor="calltime">When does the invite usually arrive?</label><span>Optional</span></div><input {...fieldProps('friend_call_time')} id="calltime" type="text" className={styles.input} placeholder="Around 9pm, after dinner…" maxLength={50} value={answers.friend_call_time} onChange={(e) => set('friend_call_time', e.target.value)} /><p className={styles.fieldHint}>This helps us find a moment before you join the call.</p></div>}
        <div className={styles.field}><label className={styles.label} htmlFor="situation">What best describes your life right now?</label><div className={styles.selectWrap}><select {...fieldProps('life_situation')} id="situation" className={styles.input} value={answers.life_situation} onChange={(e) => { markTouched('life_situation'); set('life_situation', e.target.value) }}><option value="" disabled>Choose your current situation</option>{LIFE_SITUATIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><span aria-hidden="true">⌄</span></div><p className={styles.fieldHint}>Pick the closest fit. We’ll build around your real commitments.</p><FieldError field="life_situation" message={errorFor('life_situation')} /></div>
      </>
      case 4: return <>
        <div className={styles.promptCards} aria-label="Things to think about"><span><b>01</b>What would you do?</span><span><b>02</b>Why does it matter?</span><span><b>03</b>What gets in the way?</span></div>
        <div className={styles.field}><label className={styles.label} htmlFor="replacement">What would you like more time for?</label><div className={styles.writingArea}><textarea {...fieldProps('replacement_activity')} id="replacement" className={styles.textarea} placeholder="I’d like to get back into running and learn to build websites. I keep putting both off when an evening of gaming goes longer than I planned…" value={answers.replacement_activity} maxLength={500} onChange={(e) => set('replacement_activity', e.target.value)} /><div className={styles.writingFooter}><span>YOUR WORDS. YOUR DIRECTION.</span><span>{answers.replacement_activity.length} / 500</span></div></div><WordMeter count={wordCount(answers.replacement_activity)} min={MIN_WORDS_REPLACEMENT} /><FieldError field="replacement_activity" message={errorFor('replacement_activity')} /></div>
        <div className={styles.gentleNote}><IntakeIcon name="spark" /><p>It doesn’t have to be a big ambition. A better evening is a good place to start.</p></div>
      </>
      case 5: return <>
        <div className={styles.routinePrompts}><span><IntakeIcon name="sun" />Wake up</span><i /><span><IntakeIcon name="world" />Work & play</span><i /><span><IntakeIcon name="clock" />Wind down</span></div>
        <div className={styles.field}><label className={styles.label} htmlFor="typicalday">Walk us through a normal day.</label><p className={styles.fieldHint}>Include when you wake up, work or study, start gaming, eat, and go to sleep.</p><div className={styles.writingArea}><textarea {...fieldProps('typical_day')} id="typicalday" className={styles.textarea} placeholder="I wake up around 8, go to work until 5, and usually start gaming after dinner. I plan to stop at 10 but often keep playing until midnight…" value={answers.typical_day} maxLength={1000} onChange={(e) => set('typical_day', e.target.value)} /><div className={styles.writingFooter}><span>A REAL DAY, NOT AN IDEAL ONE.</span><span>{answers.typical_day.length} / 1000</span></div></div><WordMeter count={wordCount(answers.typical_day)} min={MIN_WORDS_TYPICAL_DAY} /><FieldError field="typical_day" message={errorFor('typical_day')} /></div>
        <div className={styles.summary}><div className={styles.summaryHead}><IntakeIcon name="person" /><span>YOUR STARTING POINT</span></div><div><span>{answers.full_name}, {answers.age}</span><button type="button" onClick={() => goToStep(1, -1)}>Edit profile</button></div><div><span>{answers.hours_daily}h of gaming / day · {PLATFORMS.filter((platform) => answers.gaming_platforms.includes(platform.value)).map((platform) => platform.label).join(', ')}</span><button type="button" onClick={() => goToStep(2, -1)}>Edit habits</button></div></div>
        <div className={styles.field} ref={(el) => { fieldRefs.current.consent = el }}><label className={`${styles.consentRow} ${errorFor('consent') ? styles.consentError : ''}`}><input type="checkbox" checked={consent} onChange={(e) => { markTouched('consent'); setConsent(e.target.checked) }} aria-invalid={Boolean(errorFor('consent'))} aria-describedby={errorFor('consent') ? 'consent-error' : undefined} /><span>I consent to Gaming Reset processing the personal and sensitive information I have shared (including details about my gaming, my circumstances, and my goals) to build my personalised daily plan. I can withdraw this at any time by deleting my account. See the <Link href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>.</span></label><FieldError field="consent" message={errorFor('consent')} /></div>
      </>
      default: return null
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.topline}><Link href="/" className={styles.homeLink}><span aria-hidden="true">←</span> Gaming Reset</Link><span><IntakeIcon name="spark" /> LET’S MAKE THIS PERSONAL</span><Link href="/contact">Need a hand? ↗</Link></div>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeading}><span className={styles.eyebrow}>THE START OF SOMETHING</span><h2>Your life.<br /><em>Your reset.</em></h2><p>Five small steps.<br />A plan that feels like you.</p></div>
          <nav aria-label="Onboarding steps"><ol className={styles.steps}>{STEPS.map((item, index) => { const number = index + 1; return <li key={item.name} className={number === step ? styles.stepActive : number < step ? styles.stepDone : ''}><button type="button" disabled={number >= step || checking} onClick={() => goToStep(number, -1)} aria-current={number === step ? 'step' : undefined}><span className={styles.stepIcon}><IntakeIcon name={number < step ? 'check' : STEP_ICONS[index]} /></span><span><strong>{item.name}</strong><small>{item.rail}</small></span><span className={styles.stepNumber}>0{number}</span></button></li> })}</ol></nav>
          <div className={styles.sidebarFoot}><IntakeIcon name="shield" /><p>A little honesty.<br />A useful starting point.</p></div>
        </aside>
        <section className={styles.panel} aria-labelledby="step-title">
          <div className={styles.progressHeader}><span>YOUR PERSONAL PLAN</span><span>0{step} <i>/ 0{TOTAL_STEPS}</i></span></div>
          <div className={styles.progressTrack} role="progressbar" aria-label="Onboarding step" aria-valuemin={1} aria-valuemax={TOTAL_STEPS} aria-valuenow={step} aria-valuetext={`Step ${step} of ${TOTAL_STEPS}: ${current.name}`}>{STEPS.map((item, index) => <span key={item.name} className={index < step ? styles.progressFilled : ''} />)}</div>
          <form onSubmit={(event) => { event.preventDefault(); if (checking) return; if (step === TOTAL_STEPS) handleFinalSubmit(); else nextStep() }} noValidate aria-busy={checking}>
            <fieldset className={styles.formFields} disabled={checking}>
              <div key={step} className={`${styles.pane} ${direction < 0 ? styles.paneBack : ''}`}>
                <header className={styles.paneHead}><span className={styles.eyebrow}><IntakeIcon name={STEP_ICONS[step - 1]} />{current.name}</span><h1 id="step-title" ref={headingRef} tabIndex={-1}>{current.title}</h1><p>{current.sub}</p></header>
                {renderStep()}
              </div>
              {error && <div className={styles.errorBox} role="alert"><span aria-hidden="true">!</span>{error}</div>}
              <div className={styles.navRow}>{step > 1 ? <button type="button" className={styles.backBtn} onClick={prevStep}><span aria-hidden="true">←</span> Back</button> : <span className={styles.firstStepNote}>A fresh start begins here.</span>}<button type="submit" className={`${styles.nextBtn} ${nudge ? styles.btnNudge : ''}`} onAnimationEnd={() => setNudge(false)} aria-describedby={!canProceed && attempted ? 'step-incomplete' : undefined}>{checking ? <><span className={styles.btnSpinner} />Making sure it fits…</> : <>{step === TOTAL_STEPS ? 'Create my personal plan' : 'Continue'}<IntakeIcon name="arrow" /></>}</button></div>
              {!canProceed && attempted && <p id="step-incomplete" className={styles.navHint}>Finish the highlighted answer to continue.</p>}
            </fieldset>
          </form>
          <div className={styles.panelFoot}><span>PERSONALISED, ONE ANSWER AT A TIME.</span><span>{step === TOTAL_STEPS ? 'The next step is your first mission.' : `Up next: ${STEPS[step].name}`}</span></div>
        </section>
        <IntakePreview step={step} answers={answers} />
      </div>
    </main>
  )
}

function FieldError({ field, message }) {
  if (!message) return null
  return <p id={`${field}-error`} className={styles.fieldError} role="alert">{message}</p>
}

function WordMeter({ count, min }) {
  return <div className={styles.wordMeter}><div aria-hidden="true"><span style={{ transform: `scaleX(${Math.min(count / min, 1)})` }} /></div><span>{count >= min ? `${count} words · thank you for the detail` : `${count} / ${min} words to get us started`}</span></div>
}
