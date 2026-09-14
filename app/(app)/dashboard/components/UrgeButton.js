'use client'

import { useState, useEffect } from 'react'
import styles from './UrgeButton.module.css'
import { postJson } from '@/lib/http'

// One-tap trigger capture shown the instant the urge hits. Naming the feeling
// blunts it, and over time it builds the user's trigger map (see the relapse
// tracker). IDs must match VALID_MOODS in the urge API route.
const MOODS = [
  { id: 'bored',    emoji: '😐', label: 'Bored' },
  { id: 'stressed', emoji: '😤', label: 'Stressed' },
  { id: 'lonely',   emoji: '🫥', label: 'Lonely' },
  { id: 'anxious',  emoji: '😰', label: 'Anxious' },
  { id: 'tired',    emoji: '😮‍💨', label: 'Tired' },
  { id: 'habit',    emoji: '🔁', label: 'Just habit' },
]

// phase:
//   'loading'  — checking the server whether today is already spent
//   'hidden'   — render nothing for the rest of this view. Either the day is
//                spent (they chose to play) OR they just accepted a suggestion;
//                in the latter case the server did NOT spend the day, so the FAB
//                returns on the next dashboard load for the next urge.
//   'fab'      — the floating trigger is shown
//   'mood'     — one-tap "what is pulling you" trigger capture, before diversions
//   'flow'     — cycling through diversion suggestions
//   'accepted' — they committed to a real-life suggestion. The day is NOT spent
//                server-side; dismissing hides the button for now and it
//                reappears on the next dashboard load. Only playing spends it.
//   'play'     — they rejected everything; play, but minimally (day spent)
export default function UrgeButton() {
  const [phase, setPhase]   = useState('loading')
  const [busy, setBusy]     = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [idx, setIdx]       = useState(0)

  // Server decides if today's one use is already spent. Render nothing until we
  // know, so the button never flashes in for an already-used day.
  useEffect(() => {
    let alive = true
    postJson('/api/urge', { action: 'status' })
      .then((r) => r.json())
      .then((d) => { if (alive) setPhase(d.usedToday ? 'hidden' : 'fab') })
      .catch(() => { if (alive) setPhase('hidden') })
    return () => { alive = false }
  }, [])

  // Lock background scroll while the overlay is open.
  useEffect(() => {
    const open = phase === 'mood' || phase === 'flow' || phase === 'accepted' || phase === 'play'
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [phase])

  // Called from the mood step. `mood` is one of MOODS ids, or null if skipped.
  async function start(mood) {
    if (busy) return
    setBusy(true)
    try {
      const res = await postJson('/api/urge', { action: 'start', mood: mood || null })
      const data = await res.json()
      // Race: another tab already opened it today.
      if (data.usedToday || !Array.isArray(data.suggestions) || data.suggestions.length === 0) {
        setPhase('hidden')
        return
      }
      setSuggestions(data.suggestions)
      setIdx(0)
      setPhase('flow')
    } catch {
      // Network failed — let them try again rather than silently eating the tap.
      setPhase('fab')
    } finally {
      setBusy(false)
    }
  }

  // Fire-and-forget; the outcome is analytics, not something the UI waits on.
  function resolve(outcome, suggestionId) {
    postJson('/api/urge', { action: 'resolve', outcome, suggestionId }).catch(() => {})
  }

  function accept() {
    resolve('accepted', suggestions[idx]?.id)
    setPhase('accepted')
  }

  function reject() {
    if (idx + 1 < suggestions.length) {
      setIdx(idx + 1)
    } else {
      resolve('played')
      setPhase('play')
    }
  }

  if (phase === 'loading' || phase === 'hidden') return null

  const current = suggestions[idx]

  return (
    <>
      {/* ── Critical floating trigger — stays until they choose to play ── */}
      {phase === 'fab' && (
        <button className={styles.fab} onClick={() => setPhase('mood')} aria-label="About to play">
          <span className={styles.fabPulse} />
          <span className={styles.fabIcon}>⚠</span>
          <span className={styles.fabText}>Only tap if you’re about to play</span>
        </button>
      )}

      {(phase === 'mood' || phase === 'flow' || phase === 'accepted' || phase === 'play') && (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          <div className={styles.backdrop} />
          <div className={styles.panel}>

            {/* ── One-tap trigger capture ── */}
            {phase === 'mood' && (
              <div className={styles.stepBody}>
                <span className={styles.kicker}>Before you do, one tap</span>
                <h2 className={styles.title}>What’s pulling you to play?</h2>
                <p className={styles.sub}>
                  Be honest. Naming the trigger takes some of its power away, and
                  it helps us spot the pattern behind your urges.
                </p>
                <div className={styles.moodGrid}>
                  {MOODS.map((m) => (
                    <button key={m.id} className={styles.moodBtn}
                      onClick={() => start(m.id)} disabled={busy}>
                      <span className={styles.moodEmoji}>{m.emoji}</span>
                      <span className={styles.moodLabel}>{m.label}</span>
                    </button>
                  ))}
                </div>
                <button className={styles.moodSkip} onClick={() => start(null)} disabled={busy}>
                  Skip this
                </button>
              </div>
            )}

            {/* ── Cycling diversion suggestions ── */}
            {phase === 'flow' && current && (
              <div className={styles.stepBody}>
                <div className={styles.flowTop}>
                  <span className={styles.kicker}>Before you do, try this</span>
                  <span className={styles.counter}>{idx + 1} / {suggestions.length}</span>
                </div>

                <div className={styles.suggestion}>
                  <span className={styles.suggestionEmoji}>{current.emoji}</span>
                  <h2 className={styles.suggestionTitle}>{current.title}</h2>
                  <p className={styles.suggestionText}>{current.text}</p>
                </div>

                <div className={styles.choiceRow}>
                  <button className={styles.yesBtn} onClick={accept}>
                    Yeah, I’ll do this
                  </button>
                  <button className={styles.noBtn} onClick={reject}>
                    {idx + 1 < suggestions.length ? 'No, I’ll play' : 'No, I really want to play'}
                  </button>
                </div>
              </div>
            )}

            {/* ── They committed to something real ── */}
            {phase === 'accepted' && (
              <div className={styles.stepBody}>
                <span className={styles.winMark}>✓</span>
                <h2 className={styles.title}>That’s the win.</h2>
                <p className={styles.sub}>
                  Every time you choose this over the game, the pull gets a little
                  weaker. Go do it now, while you’ve got the momentum.
                </p>
                <button className={styles.primaryBtn} onClick={() => setPhase('hidden')}>
                  I’m on it
                </button>
              </div>
            )}

            {/* ── They chose to play — keep it minimal ── */}
            {phase === 'play' && (
              <div className={styles.stepBody}>
                <span className={styles.kicker}>Okay. Then play smart.</span>
                <h2 className={styles.title}>One game. Or one hour. That’s the deal.</h2>
                <p className={styles.sub}>
                  You’re choosing to play, and that’s on you. So make it small.
                  Set a timer right now for one hour, or commit to a single match,
                  then stop. The person who stops on time is still winning.
                </p>
                <div className={styles.dealCard}>
                  <span className={styles.dealIcon}>⏱️</span>
                  <span>Set your timer before you launch the game.</span>
                </div>
                <button className={styles.primaryBtn} onClick={() => setPhase('hidden')}>
                  Got it, one hour max
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
