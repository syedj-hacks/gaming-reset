'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from '../dashboard.module.css'
import { postJson } from '@/lib/http'

// Preset run-lengths offered to the user. The server accepts any whole number of
// days 1–30; these are just the quick picks.
const DURATIONS = [3, 7, 14, 30]
const MAX_CUSTOM = 4

// Whole days between today and an expires_on date (UTC calendar days). null when
// the mission has no end date yet (e.g. still pending / no duration set).
function daysLeft(expiresOn) {
  if (!expiresOn) return null
  const now = new Date()
  const start = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const end = new Date(`${expiresOn}T00:00:00Z`).getTime()
  return Math.round((end - start) / 86400000)
}

// A mission still holds a slot unless it was rejected or has already expired.
function isLive(t) {
  if (t.status === 'rejected') return false
  const dl = daysLeft(t.expires_on)
  return dl === null || dl >= 0
}

export default function CustomTaskForm({ userId, supabase }) {
  const [taskText,   setTaskText]   = useState('')
  const [duration,   setDuration]   = useState(7)
  const [submitted,  setSubmitted]  = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [tasks,      setTasks]      = useState([])

  const loadTasks = useCallback(async () => {
    const { data } = await supabase
      .from('custom_tasks').select('*').eq('user_id', userId)
      .order('submitted_at', { ascending: false })
    setTasks(data || [])
  }, [supabase, userId])

  // Initial load. The setState inside loadTasks runs after an await (it's async),
  // so it isn't a synchronous in-effect set — the rule is a false positive here.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadTasks() }, [loadTasks])

  // Slots taken = anything not rejected and not expired. Mirrors the server cap.
  const activeCount = tasks.filter(isLive).length
  const atCap = activeCount >= MAX_CUSTOM
  const slotsLeft = Math.max(0, MAX_CUSTOM - activeCount)

  // Submit goes through the server route — it forces status:'pending' (so a task
  // can't be self-approved), enforces the cap, and records the run length.
  async function submitTask() {
    // `submitting` guard is load-bearing: the Add button is disabled while a
    // submit is in flight, but the input's Enter handler isn't — without this a
    // fast double-Enter fires two identical POSTs (duplicate pending tasks, and
    // both can slip past the server's count-then-insert cap).
    if (!taskText.trim() || atCap || submitting) return
    setSubmitting(true)
    setError('')
    try {
      const res = await postJson('/api/submit-custom-task', { taskText: taskText.trim(), durationDays: duration })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not submit. Try again.')
        return
      }
      setTaskText('')
      setSubmitted(true)
      await loadTasks()
      setTimeout(() => setSubmitted(false), 3000)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const statusMeta = {
    pending:  { label: 'Under review', color: '#f59e0b' },
    approved: { label: 'Live',         color: '#22c55e' },
    rejected: { label: 'Not approved', color: '#ef4444' },
  }

  // Show pending + rejected (feedback) + live approved; hide expired ones.
  const visible = tasks.filter((t) => t.status !== 'approved' || isLive(t))

  return (
    <div className={styles.customTaskInner}>
      {/* Duration */}
      <div className={styles.customField}>
        <span className={styles.customFieldLabel}>Run it for</span>
        <div className={styles.durationRow}>
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={duration === d}
              className={`${styles.durationChip} ${duration === d ? styles.durationChipActive : ''}`}
              onClick={() => setDuration(d)}
            >
              {d} days
            </button>
          ))}
        </div>
      </div>

      {/* Input + submit */}
      {submitted ? (
        <p className={styles.customSuccess}>Sent for review. It&apos;ll appear in your missions once approved.</p>
      ) : (
        <>
          {error && <p className={styles.customError}>{error}</p>}
          <div className={styles.taskInputRow}>
            <input
              type="text"
              aria-label="Your custom mission"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="e.g. Go for a 20 min walk after dinner"
              maxLength={100}
              className={styles.taskInput}
              disabled={atCap}
              onKeyDown={(e) => e.key === 'Enter' && submitTask()}
            />
            <button
              onClick={submitTask}
              disabled={submitting || !taskText.trim() || atCap}
              className={`${styles.taskSubmitBtn} ${(!taskText.trim() || atCap) ? styles.btnOff : ''}`}
            >
              {submitting ? '...' : 'Add'}
            </button>
          </div>
          <p className={styles.customHint}>
            {atCap
              ? 'You have hit the 4-mission limit. Let one run its course, then add another.'
              : `Up to ${MAX_CUSTOM} custom missions at a time · ${slotsLeft} left`}
          </p>
        </>
      )}

      {/* Existing custom missions */}
      {visible.length > 0 && (
        <div className={styles.pendingList}>
          {visible.map((t) => {
            const meta = statusMeta[t.status] || { label: t.status, color: '#64748b' }
            const dl = daysLeft(t.expires_on)
            let suffix = ''
            if (t.status === 'approved' && dl !== null)
              suffix = dl <= 0 ? ' · last day' : ` · ${dl}d left`
            else if (t.status === 'pending' && t.duration_days)
              suffix = ` · ${t.duration_days}d`
            return (
              <div key={t.id} className={styles.pendingItem}>
                <span className={styles.pendingText}>{t.task_text}</span>
                <span className={styles.pendingStatus} style={{ color: meta.color }}>
                  {meta.label}{suffix}
                  {t.requires_photo && t.status === 'approved' ? ' · Photo' : ''}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
