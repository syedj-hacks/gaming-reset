'use client'

import { useRef, useState } from 'react'
import s from '../dashboard.module.css'

export function DashIcon({ name = 'spark', ...props }) {
  const paths = {
    spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z',
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    check: 'm5 12 4 4L19 6',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-5v5l3 2',
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    target: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-5 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
    chart: 'M4 4v16h16M8 15l4-5 4 2 4-7',
    shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z',
    book: 'M12 5C8 2 3 3 3 3v16s5-1 9 2c4-3 9-2 9-2V3s-5-1-9 2Zm0 0v16',
    camera: 'M3 7h4l2-3h6l2 3h4v13H3Zm13 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
    plus: 'M12 5v14M5 12h14',
  }
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>
}

export function MissionBoard({ todayTasks, customTasks, tasksError, uploadError, onComplete, onCustomComplete, onUpload, onCustomUpload, onError }) {
  const [filter, setFilter] = useState('all')
  const [busyId, setBusyId] = useState(null)
  const busyRef = useRef(false)
  const daily = [1, 2, 3, 4, 5, 6, 7].filter((n) => todayTasks?.[`task_${n}_text`]).map((n) => ({
    id: `daily-${n}`, num: n, text: todayTasks[`task_${n}_text`], photo: todayTasks[`task_${n}_needs_photo`],
    status: todayTasks[`task_${n}_approved`] ? 'done' : todayTasks[`task_${n}_complete`] ? (todayTasks[`task_${n}_needs_photo`] ? 'review' : 'done') : 'open',
  }))
  const missions = [...daily, ...customTasks.map((task) => ({ id: `custom-${task.id}`, task, text: task.task_text, photo: task.requires_photo, custom: true, status: task.approved_today ? 'done' : task.proof_submitted && task.requires_photo ? 'review' : task.completed_today ? 'done' : 'open' }))]
  const filtered = missions.filter((mission) => filter === 'all' || mission.status === filter)
  const doneCount = missions.filter((mission) => mission.status !== 'open').length

  async function act(mission, file) {
    if (busyRef.current || (mission.photo && !file)) return
    busyRef.current = true
    setBusyId(mission.id)
    onError('')
    try {
      if (mission.photo) await (mission.custom ? onCustomUpload(mission.task, file) : onUpload(mission.num, file))
      else await (mission.custom ? onCustomComplete(mission.task) : onComplete(mission.num))
    } catch {
      onError('That action couldn’t finish. Please check your connection and try again.')
    } finally {
      busyRef.current = false
      setBusyId(null)
    }
  }

  return <section className={`${s.section} ${s.missionsPanel}`} id="missions" aria-labelledby="missions-heading"><div className={s.boardHeader}><div><span className={s.eyebrow}>SMALL ACTIONS. A DIFFERENT DAY.</span><h2 id="missions-heading">Your next moves.</h2></div><span className={s.boardCount}>{doneCount}<small> / {missions.length}</small></span></div><div className={s.missionFilters} role="group" aria-label="Filter missions">{[['all', 'All missions'], ['open', 'To do'], ['review', 'In review'], ['done', 'Completed']].map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}<span>{value === 'all' ? missions.length : missions.filter((mission) => mission.status === value).length}</span></button>)}</div>{uploadError && <p className={s.actionError} role="alert">{uploadError}</p>}{tasksError && <div className={s.missionLoadNotice} role="alert">Today’s daily missions couldn’t load. <button type="button" onClick={() => window.location.reload()}>Reload the dashboard</button></div>}{!todayTasks && !tasksError && <p className={s.sectionSub}>Your daily missions are being prepared. Check back soon, or contact us if they’re still missing after 24 hours.</p>}<div className={s.missionList}>{filtered.map((mission, index) => <article key={mission.id} className={`${s.mission} ${mission.status === 'done' ? s.missionDone : ''} ${mission.status === 'review' ? s.missionReview : ''}`}><span className={s.missionNumber}>{mission.status === 'done' ? <DashIcon name="check" /> : String(index + 1).padStart(2, '0')}</span><div className={s.missionBody}><div className={s.missionMeta}><span>{mission.custom ? 'YOUR MISSION' : 'DAILY MISSION'}</span><span>{mission.photo ? <><DashIcon name="camera" />Photo check-in</> : '+25 rating'}</span></div><p className={s.missionText}>{mission.text}</p></div><div className={s.missionAction}>{mission.status === 'done' ? <span className={s.tagDone}><DashIcon name="check" />Completed</span> : mission.status === 'review' ? <span className={s.tagPending}><DashIcon name="clock" />In review</span> : mission.photo ? <label className={`${s.uploadBtn} ${busyId ? s.uploadBtnLoading : ''}`}><DashIcon name="camera" />{busyId === mission.id ? 'Uploading…' : 'Add photo'}<input type="file" accept="image/*" className={s.fileInput} aria-label={`Upload proof for ${mission.text}`} disabled={Boolean(busyId)} onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; act(mission, file) }} /></label> : <button type="button" className={s.doneBtn} disabled={Boolean(busyId)} onClick={() => act(mission)} aria-label={`Complete mission: ${mission.text}`}>{busyId === mission.id ? 'Saving…' : 'Complete'}<DashIcon name="check" /></button>}</div></article>)}</div>{filtered.length === 0 && <div className={s.boardEmpty}><DashIcon name={filter === 'open' && missions.length > 0 ? 'check' : 'spark'} /><h3>{filter === 'open' && missions.length > 0 ? 'You’ve done your part today.' : filter === 'review' ? 'No photos waiting for review.' : filter === 'done' ? 'Your first win is waiting.' : 'A little space for your next step.'}</h3><p>{filter === 'done' ? 'Complete a mission and you’ll see it here.' : filter === 'open' && missions.length > 0 ? 'Make room for something offline. Your next day is a fresh start.' : 'Your missions and their latest status will appear here.'}</p></div>}<div className={s.boardFooter}><DashIcon name="shield" /><span>Photo check-ins earn rating after approval.</span><a href="#custom-missions">Add your own <DashIcon name="plus" /></a></div></section>
}

export function DailyCheckIn({ todayTasks, onSubmit }) {
  const [selected, setSelected] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const busyRef = useRef(false)
  const submitted = todayTasks?.dota_hours_submitted
  const logged = todayTasks?.dota_hours_today
  async function save() {
    if (selected === null || busyRef.current || submitted || !todayTasks) return
    busyRef.current = true
    setBusy(true)
    setError('')
    try { await onSubmit(selected) } catch { setError('We couldn’t save your hours. Please try again.') } finally { busyRef.current = false; setBusy(false) }
  }
  return <section className={`${s.section} ${s.checkinPanel}`} id="check-in" aria-labelledby="checkin-title"><div className={s.smallSectionHead}><span className={s.panelIcon}><DashIcon name="clock" /></span><div><span className={s.eyebrow}>NOTICE YOUR TIME</span><h2 id="checkin-title">Your daily check-in.</h2></div></div>{submitted ? <div className={s.checkinSaved} role="status"><strong>{logged === 11 ? '10+' : logged}<span>hours</span></strong><span><DashIcon name="check" />Logged for today</span><p>Thanks for checking in. Your next check-in opens tomorrow.</p></div> : <><p className={s.sectionSub}>How many hours did you game today? Choose your total, then save when your day is done.</p><div className={s.hoursRow} role="group" aria-label="Hours spent gaming today">{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hours) => <button key={hours} type="button" className={`${s.hourBtn} ${selected === hours ? s.hourBtnActive : ''}`} aria-pressed={selected === hours} onClick={() => setSelected(hours)} disabled={busy || !todayTasks}>{hours === 11 ? '10+' : hours}</button>)}</div>{error && <p className={s.actionError} role="alert">{error}</p>}<button type="button" className={s.checkinSave} onClick={save} disabled={busy || selected === null || !todayTasks}>{busy ? 'Saving your check-in…' : selected === null ? 'Choose your hours' : `Log ${selected === 11 ? '10+' : selected} ${selected === 1 ? 'hour' : 'hours'}`}<DashIcon name="arrow" /></button><p className={s.checkinNote}>One check-in per day. This can’t be changed after saving.</p></>}</section>
}
