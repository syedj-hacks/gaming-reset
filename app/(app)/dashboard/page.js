'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashIcon, MissionBoard, DailyCheckIn } from './components/DashboardPanels'
import { RANKS, getRank } from '@/lib/rank'
import styles from './dashboard.module.css'
import dynamic from 'next/dynamic'
import ConfirmDialog from './components/ConfirmDialog'
// SHELVED — Discord is switched off across the product for now, here and in the
// mobile app. The component is left intact and unreferenced so nothing bundles
// it; /api/save-discord now answers 410. See components/DiscordBanner.js.
// import DiscordBanner from './components/DiscordBanner'
import DesktopBanner from './components/DesktopBanner'
import { postJson } from '@/lib/http'

const CustomTaskForm = dynamic(() => import('./components/CustomTaskForm'), {
  loading: () => null,
  ssr: false,
})
const SuggestionForm = dynamic(() => import('./components/SuggestionForm'), {
  loading: () => null,
  ssr: false,
})
const WatchSection = dynamic(() => import('./components/WatchSection'), {
  loading: () => null,
  ssr: false,
})
const BooksSection = dynamic(() => import('./components/BooksSection'), {
  loading: () => null,
  ssr: false,
})
const AdminMessage = dynamic(() => import('./components/AdminMessage'), {
  loading: () => null,
  ssr: false,
})
const UrgeButton = dynamic(() => import('./components/UrgeButton'), {
  loading: () => null,
  ssr: false,
})
const RealityCheck = dynamic(() => import('./components/RealityCheck'), {
  loading: () => null,
  ssr: false,
})
// Charts pull in recharts (heavy) — load them on demand so they stay out of the
// main dashboard bundle.
const UrgeChart = dynamic(() => import('./components/UrgeChart'), {
  loading: () => null,
  ssr: false,
})


// Rank ladder + getRank live in lib/rank.js (single source of truth, carries the
// full rationale for the tier widths and the migration warning). This file used
// to hold the master copy, with the leaderboard keeping a hand-synced duplicate.
const RANK_NUMERALS = ['I','II','III','IV','V']

// Turn a #rrggbb rank colour into an rgba() string so the ring glow can pick up
// the current rank's hue instead of a hardcoded blue.
function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function getRankInfo(mmr) {
  const rank     = getRank(mmr)
  const idx      = RANKS.indexOf(rank)
  const nextRank = RANKS[idx + 1]
  const progress = nextRank
    ? ((mmr - rank.min) / (nextRank.min - rank.min)) * 100
    : 100
  const span     = nextRank ? nextRank.min - rank.min : 1
  const tier     = Math.min(Math.floor(((mmr - rank.min) / span) * 5), 4)
  return { ...rank, nextRank, progress, tier, idx }
}

// ── Urge / relapse stats ────────────────────────────────────
// Turn raw urge_sessions rows into a resisted-vs-gave-in summary plus weekly
// buckets for the bar chart. "Gave in" == the user logged 'played' (the only
// outcome that spends the day); everything else ('opened'/'accepted') means the
// urge hit and they did NOT play — i.e. they held the line.
function weekStartUTC(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  const dow = (d.getUTCDay() + 6) % 7 // 0 = Monday
  d.setUTCDate(d.getUTCDate() - dow)
  return d.toISOString().slice(0, 10)
}

// Human labels for the one-tap trigger captured by the urge button (ids must
// match VALID_MOODS in the urge API route / MOODS in UrgeButton).
const MOOD_LABELS = {
  bored: 'Boredom', stressed: 'Stress', lonely: 'Loneliness',
  anxious: 'Anxiety', tired: 'Tiredness', habit: 'Pure habit',
}

function buildUrgeStats(rows) {
  let resisted = 0
  let gaveIn = 0
  const weeks = new Map() // weekStart 'YYYY-MM-DD' -> { resisted, gaveIn }
  const moods = {}        // mood id -> count, for the most-common trigger

  for (const r of rows) {
    if (!r?.local_date) continue
    const gave = r.outcome === 'played'
    if (gave) gaveIn++
    else resisted++
    if (r.mood) moods[r.mood] = (moods[r.mood] || 0) + 1
    const ws = weekStartUTC(r.local_date)
    const cur = weeks.get(ws) || { resisted: 0, gaveIn: 0 }
    if (gave) cur.gaveIn++
    else cur.resisted++
    weeks.set(ws, cur)
  }

  const weekData = [...weeks.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .slice(-8) // last 8 weeks keeps the chart readable
    .map(([ws, v]) => ({
      week: new Date(`${ws}T00:00:00Z`).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', timeZone: 'UTC',
      }),
      Resisted: v.resisted,
      'Gave in': v.gaveIn,
    }))

  const topMoodId = Object.entries(moods).sort((a, b) => b[1] - a[1])[0]?.[0] || null

  const total = resisted + gaveIn
  return {
    resisted,
    gaveIn,
    total,
    resistRate: total ? Math.round((resisted / total) * 100) : 0,
    weeks: weekData,
    topTrigger: topMoodId ? (MOOD_LABELS[topMoodId] || topMoodId) : null,
  }
}

// ── MMR Popup ───────────────────────────────────────────────
function MmrPopup({ value }) {
  return <div className={styles.mmrPopup} role="status">{value}</div>
}

// ── Animated count-up number (animates on mount and on every change) ──
function CountUp({ value, className }) {
  const [disp, setDisp] = useState(value)
  const fromRef = useRef(value)
  useEffect(() => {
    const reduce = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const from = fromRef.current
    const to   = value
    if (reduce || from === to) { setDisp(to); fromRef.current = to; return }
    const start = performance.now()
    const dur = 900
    let raf
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisp(Math.round(from + (to - from) * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
      else fromRef.current = to
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <span className={className}>{disp.toLocaleString()}</span>
}

// ── Live ticking clock in the player's own timezone ──
function LiveClock({ timezone }) {
  const [now, setNow] = useState(null)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setNow(new Date()))
    // Only hours+minutes are displayed, so a 15s tick is plenty — a 1s interval
    // re-rendered this subtree every second for no visible benefit.
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => { cancelAnimationFrame(raf); clearInterval(id) }
  }, [])
  // Reserve the row before mount so the hero doesn't shift when the clock appears.
  if (!now) return <div className={styles.clock} aria-hidden />
  const tz = timezone || undefined
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: tz })
  const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: tz })
  return (
    <div className={styles.clock}>
      <span className={styles.clockDot} />
      <span className={styles.clockTime}>{time}</span>
      <span className={styles.clockDate}>{date}</span>
    </div>
  )
}

// Circumference of the rank ring (r = 54)
const RING_C = 2 * Math.PI * 54

// ── Rank progress ring that sweeps from empty to the current progress on load ──
function RankRing({ rankInfo, mmr }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const reduce = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      const rafReduce = requestAnimationFrame(() => setShown(rankInfo.progress))
      return () => cancelAnimationFrame(rafReduce)
    }
    // Two frames: paint the empty ring first, then flip to target so the CSS
    // transition animates the sweep on load.
    let r2
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setShown(rankInfo.progress))
    })
    return () => { cancelAnimationFrame(r1); if (r2) cancelAnimationFrame(r2) }
  }, [rankInfo.progress])

  const offset = RING_C - (RING_C * shown) / 100
  // The ring sweeps from the current rank's colour toward the next rank's colour
  // as the rating climbs, so it visibly warms up instead of sitting on one flat tone.
  const fromColor = rankInfo.color
  const toColor = rankInfo.nextRank ? rankInfo.nextRank.color : rankInfo.color
  return (
    <div className={styles.heroRingWrap}>
      <svg className={styles.ring} viewBox="0 0 120 120">
        <defs>
          <linearGradient id="rankRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={fromColor} />
            <stop offset="100%" stopColor={toColor} />
          </linearGradient>
        </defs>
        <circle className={styles.ringTrack} cx="60" cy="60" r="54" />
        <circle
          className={styles.ringFill}
          cx="60" cy="60" r="54"
          style={{
            stroke: 'url(#rankRingGradient)',
            strokeDasharray: RING_C,
            strokeDashoffset: offset,
            filter: `drop-shadow(0 0 6px ${hexToRgba(rankInfo.color, 0.55)})`,
          }}
        />
      </svg>
      <div className={styles.ringCenter}>
        <CountUp value={mmr} className={styles.ringMmr} />
        <span className={styles.ringLabel}>Rating</span>
        {rankInfo.nextRank && (
          <span className={styles.ringNext}>
            {Math.round(rankInfo.progress)}% → {rankInfo.nextRank.name}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Rank Badge ──────────────────────────────────────────────
function RankBadge({ rankInfo }) {
  return (
    <div className={styles.rankBadge} style={{
      background: rankInfo.bg,
      border: `1px solid ${rankInfo.border}`,
    }}>
      <div className={styles.rankIcon} style={{ color: rankInfo.color }}>
        {rankInfo.idx + 1}
      </div>
      <div>
        <div className={styles.rankName} style={{ color: rankInfo.color }}>
          {rankInfo.name}
        </div>
        <div className={styles.rankNumeral}>
          {RANK_NUMERALS[rankInfo.tier]}
        </div>
      </div>
    </div>
  )
}

// ── Main Dashboard ───────────────────────────────────────────
export default function DashboardPage() {
  const [profile,          setProfile]          = useState(null)
  const [goals,            setGoals]            = useState(null)
  const [todayTasks,       setTodayTasks]       = useState(null)
  const [customTasks,      setCustomTasks]      = useState([])
  const [urgeHistory,      setUrgeHistory]      = useState([])
  const [loading,          setLoading]          = useState(true)
  const [, setUploadingTask] = useState(null)
  const [uploadError,      setUploadError]      = useState('')
  const [tasksError,       setTasksError]       = useState(false)
  const [mmrAnimation,     setMmrAnimation]    = useState(null)
  // Themed popup state (web twin of the mobile ConfirmDialog). null = closed.
  // Shape: { title, message, confirmLabel?, cancelLabel?, onConfirm?, onCancel? }
  const [dialog,           setDialog]           = useState(null)
  const router   = useRouter()
  // Memoise the browser client so it's a stable singleton for this component —
  // createClient() otherwise returns a brand-new client on every render.
  const [supabase] = useState(() => createClient())

  async function popMMR(val) {
    setMmrAnimation(val)
    setTimeout(() => setMmrAnimation(null), 2200)
  }
    async function checkMissedDays(timezone) {
    // Defensive: this runs inside loadDashboard's Promise.all. A network failure
    // or a non-JSON body (gateway 502 HTML) here must NOT reject the whole load —
    // that would abort loadDashboard and strand the user on the loading spinner
    // forever. A missed-day penalty simply gets picked up on the next load.
    try {
      const res = await postJson('/api/check-missed-days', { timezone })
      if (!res.ok) return
      const data = await res.json()
      if (data.penalised && data.newMMR !== undefined) {
        // Update profile state so the UI reflects the penalty immediately
        setProfile((p) => p ? { ...p, current_mmr: data.newMMR } : p)
      }
    } catch {
      /* transient — ignore, next load re-checks */
    }
  }

async function loadDashboard() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { router.push('/login'); return }

  try {
  // Urge history powers the relapse tracker. urge_sessions has the Data API
  // disabled (service-role only), so — unlike the tables below — it can't be read
  // with the browser client; we go through the authed /api/urge endpoint. Kicked
  // off here so it runs in parallel with the Supabase reads.
  const urgePromise = postJson('/api/urge', { action: 'history' }).then((r) => r.json()).catch(() => ({ history: [] }))

  const [profileRes, goalsRes] = await Promise.all([
    // current_rank is deliberately NOT selected: rank is derived from
    // current_mmr via getRankInfo, and the stored column only ever holds the
    // starting rank from onboarding. weekly_message_at is likewise unrendered.
    // discord_username came out with the banner — a string list cannot carry a
    // comment, so it is dropped here rather than commented; add it back when
    // the feature returns. The column and its data are untouched.
    supabase.from('profiles')
      .select('id, full_name, current_mmr, streak_count, subscription_status, trial_ends_at, trial_ends_date, timezone, onboarding_complete, subscription_period_end, paddle_subscription_id, gaming_platforms')
      .eq('id', user.id).single(),
    supabase.from('goals')
      .select('primary_quest_title, primary_quest_description, ai_message, weekly_message')
      .eq('user_id', user.id).single(),
  ])

  if (!profileRes.data?.onboarding_complete) { router.push('/onboarding'); return }

  const profile = profileRes.data

  // Reset must finish BEFORE we read custom_tasks — otherwise on a new day we'd
  // read yesterday's completed_today/proof state and render tasks as already done.
  const tz = profile.timezone || 'UTC'

  // reset-custom-tasks must finish before we read custom_tasks — otherwise on a
  // new day we'd read yesterday's completed_today/proof state. But the missed-day
  // check and the daily-tasks fetch DON'T depend on that reset. So rather than
  // awaiting the reset on its own (a wasted round-trip sitting on the critical
  // path), we chain only the custom_tasks read behind it and let all three run
  // together — the reset→custom_tasks chain overlaps the other two fetches.
  const customPromise = postJson('/api/reset-custom-tasks', { timezone: tz })
    .catch(() => {})
    .then(() =>
      supabase.from('custom_tasks')
        .select('id, task_text, requires_photo, completed_today, approved_today, proof_submitted, proof_url')
        .eq('user_id', user.id).eq('status', 'approved').eq('active', true)
    )

  const [customRes, , tasksResult] = await Promise.all([
    customPromise,
    checkMissedDays(tz),
    postJson('/api/get-daily-tasks', {})
      .then(async (r) => ({ ok: r.ok, data: await r.json().catch(() => ({})) }))
      .catch(() => ({ ok: false, data: {} })),
  ])

  const todayTasksData = tasksResult.data?.tasks || null

  setProfile(profile)
  setGoals(goalsRes.data)
  setTodayTasks(todayTasksData)
  // Distinguish a genuine load failure from "no missions yet" so the UI can show
  // the right message instead of always implying tasks are being prepared.
  setTasksError(!tasksResult.ok && !todayTasksData)
  const urgeData = await urgePromise

  setCustomTasks(customRes.data || [])
  setUrgeHistory(urgeData.history || [])
  } finally {
    // Whatever happens above, never leave the user stuck on the loading spinner.
    setLoading(false)
  }
}

  // Run the data loader once on mount. loadDashboard is async and only touches
  // state after awaits, so the set-state-in-effect rule is a false positive here;
  // and we intentionally run only on mount (empty dep array).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadDashboard() }, [])

  // ── Re-load when the user's local calendar day rolls over ──
  // Everything on this page (missions, trial banner, daily check-in, missed-day
  // penalty) is a one-shot snapshot from loadDashboard() above. A dashboard left
  // open across the user's local midnight would otherwise keep showing the
  // previous day's state. We watch the date string IN THE USER'S OWN TIMEZONE —
  // the same boundary the server uses — and refetch the moment it changes, which
  // re-runs the day reset, missed-day check and trial gating server-side.
  // loadDashboard never sets `loading` back to true, so this refresh is seamless
  // (no full-page spinner flash). We also check on tab focus so a backgrounded
  // tab catches up immediately when the user returns.
  const lastDayRef = useRef(null)
  useEffect(() => {
    const tz = profile?.timezone || 'UTC'
    const currentDay = () =>
      new Date().toLocaleDateString('en-CA', { timeZone: tz })
    // Baseline = the day this data was loaded for. Reset on tz change so we never
    // fire a spurious reload from the pre-profile 'UTC' default.
    lastDayRef.current = currentDay()
    const check = () => {
      const today = currentDay()
      if (today !== lastDayRef.current) {
        lastDayRef.current = today
        loadDashboard()
      }
    }
    const id = setInterval(check, 30000)
    document.addEventListener('visibilitychange', check)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', check)
    }
    // loadDashboard is a stable mount-time loader; re-running this watcher only
    // when the user's timezone changes is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.timezone])

// Surface a completion failure in the themed dialog instead of failing silently.
// The common case is stale cross-device state: the mission was already completed
// on another device (or refreshed since this tab loaded), so the server returns
// "already completed". We explain it and re-sync the board so the mission flips
// to its +25 state. loadDashboard() never re-shows the spinner, so the refresh
// is seamless.
function showCompletionError(res, data) {
  const alreadyDone = res.status === 400 && /already completed/i.test(data?.error || '')
  if (alreadyDone) {
    setDialog({
      title: 'Already completed',
      message: 'Looks like this mission was already completed, probably on another device. We’ll refresh your missions so everything stays in sync.',
      confirmLabel: 'Refresh missions',
      onConfirm: () => loadDashboard(),
      onCancel:  () => loadDashboard(),
    })
  } else {
    setDialog({
      title: 'Couldn’t complete',
      message: data?.error || 'Something went wrong. Please try again.',
      confirmLabel: 'OK',
    })
  }
}

async function completeTask(num) {
  if (!todayTasks || !profile) return
  const res = await postJson('/api/complete-task', { taskId: todayTasks.id, taskNum: num })
  const data = await res.json()
  if (!res.ok) { showCompletionError(res, data); return }
  setTodayTasks((p) => ({ ...p, [`task_${num}_complete`]: true }))
  setProfile((p) => ({ ...p, current_mmr: data.newMMR }))
  popMMR('+25 Rating')
  await checkStreak()
}

  async function submitDotaHours(hours) {
    if (!todayTasks || !profile) return
    // Hours can only be logged once per day — the server rejects resubmission,
    // so don't fire a request the UI can't act on.
    if (todayTasks.dota_hours_submitted) return
    const res = await postJson('/api/submit-dota-hours', { taskId: todayTasks.id, hours })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Could not save your check-in.')
    setTodayTasks((p) => ({ ...p, dota_hours_today: hours, dota_hours_submitted: true }))
    setProfile((p) => ({ ...p, current_mmr: data.newMMR }))
    if (data.change !== 0) popMMR(`${data.change > 0 ? '+' : ''}${data.change} Rating`)
  }

async function checkStreak() {
  const res = await postJson('/api/check-streak')
  const data = await res.json()
  if (data.bonusAwarded) {
    setProfile((p) => ({ ...p, current_mmr: data.newMMR, streak_count: data.streak }))
    popMMR('+25 Rating 🔥')
  } else if (typeof data.streak === 'number') {
    // Keep the displayed streak in sync even when no bonus fired this time.
    setProfile((p) => (p && p.streak_count !== data.streak ? { ...p, streak_count: data.streak } : p))
  }
}

  async function validateFileHeader(file) {
  const buffer = await file.slice(0, 4).arrayBuffer()
  const bytes  = new Uint8Array(buffer)

  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return true
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return true
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) return true
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return true

  return false
}

  async function uploadPhoto(taskNum, file) {
    if (!file || !profile) return
    setUploadError('')

    // Keep client-side validation as a fast first check
    const isValidImage = await validateFileHeader(file)
    if (!isValidImage) {
      setUploadError('Invalid file. Only real JPEG, PNG, WebP, or GIF images are accepted.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File too large. Maximum 5MB.')
      return
    }

    setUploadingTask(taskNum)

    // Send as multipart form data — file + metadata
    const formData = new FormData()
    formData.append('file', file)
    formData.append('taskId', todayTasks.id)
    formData.append('taskNum', String(taskNum))

    const res = await fetch('/api/upload-photo', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()

    if (!res.ok) {
      setUploadError(data.error || 'Upload failed')
      setUploadingTask(null)
      return
    }

    setTodayTasks((p) => ({
      ...p,
      [`task_${taskNum}_photo_url`]: data.publicUrl,
      [`task_${taskNum}_complete`]:  true,
    }))
    setUploadingTask(null)
    // A photo task counts as completed on upload, so re-evaluate the streak —
    // previously only the plain "Done" button did this, so a day of all-photo
    // missions never triggered the streak check.
    await checkStreak()
  }

  async function completeCustomTask(task) {
    if (!profile) return
    const res = await postJson('/api/complete-custom-task', { taskId: task.id })
    const data = await res.json()
    if (!res.ok) { showCompletionError(res, data); return }
    setCustomTasks((p) => p.map((t) => t.id === task.id ? { ...t, completed_today: true } : t))
    setProfile((p) => ({ ...p, current_mmr: data.newMMR }))
    popMMR('+25 Rating')
  }

async function uploadCustomPhoto(task, file) {
  if (!file || !profile) return
  setUploadError('')

  // Validate by magic bytes, same as daily photo uploads (the old MIME-type
  // check could pass/fail differently for the same file).
  const isValidImage = await validateFileHeader(file)
  if (!isValidImage) {
    setUploadError('Invalid file. Only real JPEG, PNG, WebP, or GIF images are accepted.')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    setUploadError('File too large. Maximum 5MB.')
    return
  }

  setUploadingTask(`c_${task.id}`)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('taskId', task.id)

  const res = await fetch('/api/upload-custom-photo', {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()

  if (!res.ok) {
    setUploadError(data.error || 'Upload failed')
    setUploadingTask(null)
    return
  }

  setCustomTasks((p) => p.map((t) =>
    t.id === task.id
      ? { ...t, proof_submitted: true, proof_url: data.publicUrl }
      : t
  ))
  setUploadingTask(null)
}

  // Missing profile/goals means one of two things: we're still resolving, or —
  // far more commonly — the onboarding guard in loadDashboard has just fired
  // router.push('/onboarding') and we're waiting on that route to mount. Both
  // want this same dark screen.
  //
  // This used to `return null` on the second case, which renders an EMPTY
  // DOCUMENT. Every dark background in this app sits on a page-level div, never
  // on html/body (see the deliberate note in globals.css — the marketing, blog
  // and legal pages are light), so an empty document has nothing painting a
  // background and the browser falls back to its default white. router.push is
  // async, so that white canvas was held for the whole ~1s it took the
  // onboarding route to load: a mid-onboarding user who clicked Dashboard in the
  // header got a full-screen white flash before landing back where they started.
  //
  // Note the redirect path reaches here with `loading` already false: the guard
  // returns out of loadDashboard's try, which runs its finally and clears the
  // flag. Keeping the spinner up is exactly right while a redirect is in flight.
  if (loading || !profile || !goals) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.loadingGlow} />
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Getting your day ready…</p>
      </div>
    )
  }

  const mmr       = profile.current_mmr ?? 0
  const rankInfo  = getRankInfo(mmr)

  const urgeStats = buildUrgeStats(urgeHistory)

  const trialEndDate = profile.trial_ends_date
    || (profile.trial_ends_at
      ? new Date(profile.trial_ends_at).toLocaleDateString('en-CA', {
          timeZone: profile.timezone || 'UTC'
        })
      : null)

  const todayDate = new Date().toLocaleDateString('en-CA', {
    timeZone: profile.timezone || 'UTC'
  })

  const isOnTrial = profile.subscription_status === 'trial' && trialEndDate
  const isInactive = profile.subscription_status === 'inactive'
  // Days of trial remaining, measured the SAME way the server gates missions:
  // by calendar day in the user's own timezone (todayDate vs trialEndDate), NOT
  // by absolute trial_ends_at timestamp math. This keeps the banner and the
  // mission-freeze in get-daily-tasks in lockstep — the banner reads "Trial
  // expired" exactly when todayDate > trialEndDate, which is the precise moment
  // the server stops serving new missions. The last trial day counts inclusively
  // (todayDate === trialEndDate → 1 day left → "Last day of trial").
  // Both dates are 'YYYY-MM-DD'; parse at UTC midnight so the subtraction is a
  // clean whole-day count free of any local-offset drift. Capped at TRIAL_DAYS,
  // floored at 0 so a misconfigured end date can't advertise more than we offer.
  const TRIAL_DAYS = 3
  const dayDiff = Math.round(
    (new Date(`${trialEndDate}T00:00:00Z`).getTime()
      - new Date(`${todayDate}T00:00:00Z`).getTime()) / 86400000
  )
  const daysLeft = !isOnTrial ? null : Math.max(0, Math.min(TRIAL_DAYS, dayDiff + 1))

  // ── Crypto subscription renewal reminder ──
  // Crypto payers don't auto-renew (no paddle_subscription_id) — they hold a
  // fixed paid window ending at subscription_period_end. Access runs through that
  // date inclusively, so days-remaining = period_end − today (0 = last day). We
  // surface a "pay to continue" banner only in the final stretch (≤ 7 days). Once
  // the window lapses, get-daily-tasks flips them to 'inactive' and the inactive
  // banner above takes over — so this only ever shows while still active.
  const isCryptoPaid =
    profile.subscription_status === 'paid' &&
    !!profile.subscription_period_end &&
    !profile.paddle_subscription_id

  const cryptoDaysLeft = isCryptoPaid
    ? Math.round(
        (new Date(`${profile.subscription_period_end}T00:00:00Z`).getTime()
          - new Date(`${todayDate}T00:00:00Z`).getTime()) / 86400000
      )
    : null

  const showCryptoRenewal =
    isCryptoPaid && cryptoDaysLeft !== null && cryptoDaysLeft <= 7

  // A mission counts as "done" once the user has done their part: for photo
  // tasks that means proof is submitted (even if approval is still pending),
  // matching how daily photo tasks already count on upload (task_n_complete).
  const completedToday =
    [1,2,3,4,5,6,7].filter((n) =>
      todayTasks?.[`task_${n}_complete`] && todayTasks?.[`task_${n}_text`]
    ).length +
    customTasks.filter((t) => t.completed_today || t.approved_today || t.proof_submitted).length

  const totalToday =
    [1,2,3,4,5,6,7].filter((n) => todayTasks?.[`task_${n}_text`]).length +
    customTasks.length

  const progressPct = totalToday > 0 ? (completedToday / totalToday) * 100 : 0
  const allDone = totalToday > 0 && completedToday >= totalToday

  // ── Access lock ──────────────────────────────────────────
  // Trial lapsed, subscription inactive, or a crypto window that's expired. The
  // server already freezes earning + missions for these users (isAccessLocked),
  // so the whole dashboard collapses to a single paywall — the only thing a
  // locked user can do is upgrade. Mirrors the same date math the banners use.
  const cryptoExpired = isCryptoPaid && cryptoDaysLeft !== null && cryptoDaysLeft < 0
  const accessLocked = isInactive || (isOnTrial && daysLeft <= 0) || cryptoExpired

  if (accessLocked) {
    return (
      <div className={styles.page}>
        <div className={styles.pageBg} />
        <div className={styles.pageMesh} />
        <div className={styles.container}>
          <div className={styles.lockWrap}>
            <div className={styles.lockCard}>
              <span className={styles.lockBadge}>
                {isOnTrial ? 'Trial expired' : 'Access ended'}
              </span>
              <h1 className={styles.lockTitle}>Your access has ended</h1>
              <p className={styles.lockText}>
                Upgrade to unlock your daily missions, keep your Rating and streak, and pick up
                right where you left off.
              </p>
              <button className={styles.lockBtn} onClick={() => router.push('/checkout')}>
                Upgrade to continue →
              </button>
              <button className={styles.lockSecondary} onClick={() => router.push('/settings/billing')}>
                View billing
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.pageBg} aria-hidden="true" /><div className={styles.pageMesh} aria-hidden="true" />
      {mmrAnimation && <MmrPopup value={mmrAnimation} />}
      <div className={styles.container}>
        <div className={styles.dashboardTopline}><span><DashIcon name="grid" />YOUR DAILY RESET</span><LiveClock timezone={profile.timezone} /><Link href="/settings/account">Your settings <DashIcon name="arrow" /></Link></div>
        <div className={styles.dashboardLayout}>
          <aside className={styles.dashboardNav}><div className={styles.navIdentity}><span>{(profile.full_name || 'Y').slice(0, 1).toUpperCase()}</span><div><strong>{profile.full_name || 'Your space'}</strong><small>Your next chapter</small></div></div><nav aria-label="Dashboard sections"><a href="#today"><DashIcon name="grid" />Overview</a><a href="#missions"><DashIcon name="check" />Daily missions<span>{Math.max(0, totalToday - completedToday)}</span></a><a href="#check-in"><DashIcon name="clock" />Check-in</a><a href="#progress"><DashIcon name="chart" />Your progress</a><a href="#discover"><DashIcon name="book" />Explore</a></nav><div className={styles.navSecondary}><Link href="/leaderboard"><DashIcon name="chart" />Leaderboard ↗</Link><Link href="/settings/billing"><DashIcon name="shield" />Membership ↗</Link></div><div className={styles.navNote}><DashIcon name="spark" /><p>The next small step<br /><em>is still yours.</em></p></div></aside>
          <div className={styles.dashboardMain}>
            <header className={styles.dayHeader} id="today"><div><span className={styles.eyebrow}>A LITTLE LESS GAMING. A LOT MORE YOU.</span><h1>Make today <em>yours.</em></h1><p>Welcome back, {profile.full_name || 'friend'}. {allDone ? 'You’ve done your part. Enjoy the space you made.' : 'A few small actions. A little more room for real life.'}</p></div><a href="#missions" className={styles.dayCta}>{allDone ? 'See today’s wins' : 'Find your next move'}<DashIcon name="arrow" /></a></header>
            {isOnTrial && <div className={`${styles.trialBanner} ${daysLeft <= 1 ? styles.trialBannerUrgent : ''}`}><span className={styles.trialSymbol}><DashIcon name="spark" /></span><div><span className={styles.trialLabel}>{daysLeft === 1 ? 'The last day of your free trial.' : `${daysLeft} days to explore your reset.`}</span><p className={styles.trialSub}>Keep your missions and progress tools with full access.</p></div><Link href="/checkout" className={styles.trialBtn}>View plans ↗</Link></div>}
            {showCryptoRenewal && <div className={styles.trialBanner}><span className={styles.trialSymbol}><DashIcon name="clock" /></span><div><span className={styles.trialLabel}>{cryptoDaysLeft === 0 ? 'Your last day of access.' : `${cryptoDaysLeft} days of access remaining.`}</span><p className={styles.trialSub}>Crypto doesn’t auto-renew. Renew to continue beyond your current access period.</p></div><Link href="/checkout" className={styles.trialBtn}>Renew access ↗</Link></div>}
            <div className={styles.overviewGrid}>
              <section className={styles.todayCard} aria-labelledby="today-title"><div className={styles.todayCardTop}><span className={styles.eyebrow}>YOUR DAY, IN MOTION</span><span className={styles.todayStatus}><i />{allDone ? 'All clear' : 'One step at a time'}</span></div><div className={styles.todayCardBody}><div><h2 id="today-title">{allDone ? <>Small steps.<br />Real progress.</> : <>Start small.<br /><span>Keep moving.</span></>}</h2><p>{allDone ? 'Your missions are complete or awaiting review.' : 'Your daily missions bring your bigger goal a little closer.'}</p></div><div className={styles.dayOrbit} aria-hidden="true"><div /><div /><span><DashIcon name={allDone ? 'check' : 'spark'} /></span></div></div><div className={styles.todayProgressLabel}><span>{completedToday} of {totalToday} missions handled</span><strong>{Math.round(progressPct)}%</strong></div><div className={styles.heroProgressTrack} role="progressbar" aria-label="Daily mission progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progressPct)}><div className={styles.heroProgressFill} style={{ width: `${progressPct}%` }} /></div></section>
              <section className={styles.ratingCard} id="progress" aria-labelledby="rating-title"><div className={styles.ratingHeading}><span className={styles.eyebrow} id="rating-title">YOUR REAL-LIFE RATING</span><Link href="/leaderboard" aria-label="View leaderboard">↗</Link></div><div className={styles.ratingBody}><RankRing rankInfo={rankInfo} mmr={mmr} /><div><RankBadge rankInfo={rankInfo} /><p>{rankInfo.nextRank ? `${Math.max(0, rankInfo.nextRank.min - mmr)} rating to ${rankInfo.nextRank.name}` : 'You’ve reached the top rank.'}</p></div></div><div className={styles.streakDetail}><span><DashIcon name="spark" /><strong>{profile.streak_count || 0}</strong> day streak</span><span>Keep showing up.</span></div></section>
            </div>
            <div className={styles.workGrid}><div className={styles.mainColumn}><MissionBoard todayTasks={todayTasks} customTasks={customTasks} tasksError={tasksError} uploadError={uploadError} onComplete={completeTask} onCustomComplete={completeCustomTask} onUpload={uploadPhoto} onCustomUpload={uploadCustomPhoto} onError={setUploadError} /><section className={`${styles.section} ${styles.customSection}`} id="custom-missions"><div className={styles.customHead}><span className={styles.eyebrow}><DashIcon name="plus" />MAKE IT PERSONAL</span><h2 className={styles.customTitle}>A mission of your own.</h2><p className={styles.customLede}>You know what you want to make time for. Add a small, specific action and choose how long to keep it going.</p></div><CustomTaskForm userId={profile.id} supabase={supabase} /></section></div><div className={styles.sideColumn}><DailyCheckIn key={todayTasks?.id || 'waiting'} todayTasks={todayTasks} onSubmit={submitDotaHours} /><section className={`${styles.section} ${styles.directionCard}`} aria-labelledby="quest-title"><span className={styles.eyebrow}><DashIcon name="target" />YOUR BIGGER PICTURE</span><span className={styles.questEyebrow}>THE THING YOU’RE WORKING TOWARD</span><h2 id="quest-title">{goals.primary_quest_title}</h2><p>{goals.primary_quest_description}</p><div className={styles.questFoot}><span />One mission brings it closer.</div></section>{(goals.ai_message || goals.weekly_message) && <section className={`${styles.section} ${styles.coachCard}`}><span className={styles.eyebrow}>A NOTE FOR YOUR JOURNEY</span>{goals.weekly_message && <div><h2 className={styles.noteTitle}>This week, for you.</h2><blockquote className={styles.weeklyQuote}>{goals.weekly_message}</blockquote></div>}{goals.ai_message && <details className={styles.personalNote} open={!goals.weekly_message}><summary>Remember why you started.<span aria-hidden="true">+</span></summary><blockquote className={styles.coachQuote}>{goals.ai_message}</blockquote></details>}</section>}</div></div>
            <div className={styles.companionSection}><DesktopBanner platforms={profile.gaming_platforms} /></div>
            <section className={`${styles.section} ${styles.patternSection}`} aria-labelledby="patterns-title"><div className={styles.patternHeading}><div><span className={styles.eyebrow}>A LITTLE MORE SELF-AWARENESS</span><h2 id="patterns-title">Notice your patterns.</h2><p className={styles.sectionSub}>The moments you notice can become the moments you change.</p></div><span className={styles.panelIcon}><DashIcon name="chart" /></span></div>{urgeStats.total > 0 ? <div className={styles.patternGrid}><div className={styles.urgeStats}><div className={styles.urgeStat}><span className={styles.urgeStatNum}>{urgeStats.resisted}</span><span className={styles.urgeStatLabel}>Resisted</span></div><div className={styles.urgeStat}><span className={styles.urgeStatNum}>{urgeStats.gaveIn}</span><span className={styles.urgeStatLabel}>Played</span></div><div className={styles.urgeStat}><span className={styles.urgeStatNum}>{urgeStats.resistRate}%</span><span className={styles.urgeStatLabel}>Resist rate</span></div>{urgeStats.topTrigger && <p className={styles.urgeTrigger}>Most common trigger <strong>{urgeStats.topTrigger}</strong></p>}</div><div>{urgeStats.weeks.length > 0 && <UrgeChart weeks={urgeStats.weeks} />}</div></div> : <div className={styles.patternEmpty}><div className={styles.patternSketch} aria-hidden="true">{[28, 45, 37, 63, 52, 78, 92].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><div><h3>Your story will take shape here.</h3><p>Use the urge button when you feel the pull to play. Your logged moments will help you understand your patterns.</p><span>No urge history yet.</span></div></div>}</section>
            <div className={styles.discoveryHeading} id="discover"><span className={styles.eyebrow}>LIFE BEYOND THE NEXT SESSION</span><h2>Give your attention<br /><em>somewhere new.</em></h2><p>Something to read, something to watch, a different way to unwind.</p></div><div className={styles.discoveryShelf}><RealityCheck /><WatchSection /><BooksSection /></div><details className={styles.feedbackDisclosure}><summary><span><DashIcon name="spark" />Help shape Gaming Reset</span><span aria-hidden="true">+</span></summary><SuggestionForm /></details><footer className={styles.dashboardFooter}><span>SMALL STEPS. REAL LIFE.</span><div><Link href="/settings/account">Account</Link><Link href="/settings/billing">Billing</Link><Link href="/contact">Need a hand?</Link></div></footer>
          </div>
        </div>
      </div>
      <AdminMessage /><UrgeButton /><ConfirmDialog open={!!dialog} title={dialog?.title} message={dialog?.message} confirmLabel={dialog?.confirmLabel} cancelLabel={dialog?.cancelLabel} destructive={dialog?.destructive} onConfirm={() => { const fn = dialog?.onConfirm; setDialog(null); if (fn) fn() }} onCancel={() => { const fn = dialog?.onCancel; setDialog(null); if (fn) fn() }} />
    </main>
  )
}


