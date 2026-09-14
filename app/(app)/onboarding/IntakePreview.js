import s from './onboarding.module.css'

export function IntakeIcon({ name = 'spark', ...props }) {
  const paths = {
    spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
    person: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-5v5l3 2',
    world: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18Z',
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    check: 'm5 12 4 4L19 6',
    shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6',
    pc: 'M3 4h18v12H3zM8 21h8m-4-5v5',
    console: 'M7 7h10c3 0 6 12 3 13-2 1-5-4-5-4H9s-3 5-5 4C1 19 4 7 7 7Zm-1 5h4m-2-2v4m7-3h.01M18 13h.01',
    mobile: 'M7 2h10v20H7zM11 18h2',
    sun: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5',
  }
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>
}

export const STEP_ICONS = ['person', 'clock', 'world', 'spark', 'sun']

const NOTES = [
  ['A plan with your name on it.', 'A few details help us shape missions around your stage of life.'],
  ['Understand the pattern.', 'Your time, your sessions, your devices. A useful reset starts with the way you actually play.'],
  ['Real life comes first.', 'Work, study, friends, and family all belong in the picture. Your plan should fit around them.'],
  ['Give that time a purpose.', 'Something you want to move toward makes a small change feel worth making.'],
  ['Find room in your day.', 'Your routine helps us find realistic moments for your first missions.'],
]

export default function IntakePreview({ step, answers }) {
  const hours = Number(answers.hours_daily)
  const validHours = answers.hours_daily !== '' && Number.isFinite(hours) && hours >= 0 && hours <= 24
  return (
    <aside className={s.preview} aria-label="How your answers shape your plan">
      <div className={s.previewTop}><span className={s.liveDot} />YOUR RESET, TAKING SHAPE<span>0{step}</span></div>
      <div className={s.previewScene} key={step}>
        {step === 1 && <div className={s.identityVisual}><div className={s.identityHalo} /><div className={s.identityCard}><div className={s.identityHeader}><IntakeIcon /><span>GAMING RESET</span></div><div className={s.avatar}>{answers.full_name.trim().slice(0, 1).toUpperCase() || <IntakeIcon name="person" />}</div><strong>{answers.full_name.trim() || 'Your next chapter'}</strong><span>ONE PERSON. A WORLD OF POSSIBILITY.</span><div className={s.identityLines}><i /><i /><i /></div><div className={s.identityBottom}>PERSONAL PLAN<span>YOURS TO BUILD ↗</span></div></div></div>}
        {step === 2 && <div className={s.timeVisual}><div className={s.timeRing} style={{ '--hours-angle': `${validHours ? hours / 24 * 360 : 0}deg` }}><div><IntakeIcon name="clock" /><strong>{validHours ? hours : '—'}<small>h</small></strong><span>GAMING / DAY</span></div></div><div className={s.timeLegend}><span><i /> Gaming time</span><span><i /> The rest of your day</span></div><p>A starting point, not a score.</p></div>}
        {step === 3 && <div className={s.worldVisual}><div className={s.worldOrbit} /><div className={s.worldCenter}><IntakeIcon name="person" /><span>YOU</span></div><span className={s.worldNode}>Your people</span><span className={s.worldNode}>Your routine</span><span className={s.worldNode}>Your priorities</span></div>}
        {step === 4 && <div className={s.goalVisual}><div className={s.goalGlow} /><span className={s.goalStar}>✧</span><span className={s.goalLabel}>MAKE ROOM FOR</span><strong>Something<br /><em>that matters.</em></strong><div className={s.goalTags}><span>Learn</span><span>Create</span><span>Connect</span></div></div>}
        {step === 5 && <div className={s.dayVisual}><span className={s.dayCaption}>LITTLE OPENINGS. REAL POSSIBILITIES.</span>{[['Morning', 'Start with intention', 'sun'], ['Your day', 'Make space for a mission', 'spark'], ['Evening', 'Choose how you unwind', 'clock']].map(([time, label, icon]) => <div key={time}><span><IntakeIcon name={icon} /></span><section><small>{time}</small><strong>{label}</strong></section></div>)}</div>}
      </div>
      <div className={s.previewCopy} key={`copy-${step}`}><h2>{NOTES[step - 1][0]}</h2><p>{NOTES[step - 1][1]}</p></div>
      <div className={s.previewFooter}><IntakeIcon name="shield" />Built around your answers.</div>
    </aside>
  )
}
