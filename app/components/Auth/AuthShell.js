import Link from 'next/link'
import s from './Auth.module.css'

export function AuthIcon({ name = 'arrow', ...props }) {
  const paths = {
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    check: 'm5 12 4 4L19 6',
    mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
    lock: 'M6 10h12v11H6zM8 10V7a4 4 0 0 1 8 0v3m-4 5v2',
    eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    eyeOff: 'm3 3 18 18M10 5c7-1 12 7 12 7a19 19 0 0 1-4 5M6 6a20 20 0 0 0-4 6s3.5 7 10 7c2 0 3.5-.5 5-1.5M10 10a3 3 0 0 0 4 4',
    spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
    shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6',
  }
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>
}

export function PasswordToggle({ visible, onClick, disabled, label = 'password' }) {
  return <button type="button" className={s.eyeBtn} onClick={onClick} disabled={disabled} aria-label={`${visible ? 'Hide' : 'Show'} ${label}`} aria-pressed={visible}><AuthIcon name={visible ? 'eyeOff' : 'eye'} /></button>
}

export function AuthDivider() {
  return <div className={s.divider}><span />or continue with email<span /></div>
}

export default function AuthShell({ mode, success = false, children }) {
  const signup = mode === 'signup'
  return (
    <main className={s.page}>
      <div className={s.shell}>
        <aside className={`${s.story} ${signup ? s.signupStory : s.loginStory}`} aria-label={signup ? 'Your fresh start' : 'Your next step'}>
          <div className={s.storyGrid} aria-hidden="true" />
          <div className={s.storyTop}><span className={s.eyebrow}><i /> {signup ? 'A LITTLE LESS GAMING. A LOT MORE YOU.' : 'YOUR RESET IS RIGHT HERE.'}</span><span className={s.edition}>GR / {signup ? '01' : '02'}</span></div>
          <div className={s.storyCopy}>
            <h2>{signup ? <>Your next level<br />is <em>out there.</em></> : <>A new day.<br /><em>Your next move.</em></>}</h2>
            <p>{signup ? 'Make room for the things you keep putting off. Your first small step starts here.' : 'You don’t need a perfect streak. Just a little intention, and a place to pick up again.'}</p>
          </div>
          <div className={s.artwork} aria-hidden="true">
            <div className={s.horizon} /><div className={s.floor} />
            <div className={s.portal}><div className={s.portalInner} /><div className={s.portalLight} /><span className={s.portalStar}>✧</span></div>
            <div className={s.floatingNote}><span className={s.noteIcon}><AuthIcon name={signup ? 'spark' : 'check'} /></span><div><small>{signup ? 'YOUR OFFLINE LIFE' : 'ONE STEP AT A TIME'}</small><strong>{signup ? 'There’s more waiting for you.' : 'Progress starts with showing up.'}</strong></div></div>
            <span className={s.artCaption}>{signup ? 'LESS AUTOPILOT. MORE POSSIBILITY.' : 'PICK UP WHERE YOU LEFT OFF.'}</span>
          </div>
          <div className={s.storyFooter}>
            {signup ? <><span><AuthIcon name="check" />3 days free</span><span><AuthIcon name="check" />No credit card</span><span><AuthIcon name="check" />Full access</span></> : <><span><AuthIcon name="shield" />Your pace. Your progress.</span><span>WINDOWS + WEB</span></>}
          </div>
        </aside>
        <section className={s.formPanel} aria-labelledby="auth-title">
          <div className={s.panelTop}><Link href="/" className={s.backLink}><span aria-hidden="true">←</span> Back to home</Link><span className={s.panelMark}><AuthIcon name="shield" /> YOUR SPACE TO RESET</span></div>
          <div className={s.formContent}>
            {!success && <><div className={s.formEyebrow}><span className={s.tinyDiamond} />{signup ? 'START SOMETHING GOOD' : 'MAKE TODAY YOURS'}</div><h1 id="auth-title" className={s.title}>{signup ? 'Find your fresh start.' : 'Good to have you back.'}</h1><p className={s.subtitle}>{signup ? 'Create your account. Your 3-day free trial is on us.' : 'Sign in and make a little more room for real life.'}</p>{signup && <div className={s.onboardingSteps} aria-label="Getting started"><span aria-current="step"><b>1</b> Create account</span><i /><span><b>2</b> Make it yours</span></div>}</>}
            {children}
            {!success && <p className={s.accountSwitch}>{signup ? 'Already started your reset?' : 'New to Gaming Reset?'} <Link href={signup ? '/login' : '/signup'}>{signup ? 'Sign in' : 'Try 3 days free'} <span aria-hidden="true">↗</span></Link></p>}
          </div>
          <div className={s.panelFooter}><span>SMALL STEPS. REAL LIFE.</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/contact">Need help?</Link></div></div>
        </section>
      </div>
    </main>
  )
}
