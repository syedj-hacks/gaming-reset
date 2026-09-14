'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '@/lib/supabase'
import styles from '../dashboard.module.css'
import { postJson } from '@/lib/http'

// A small floating button (bottom-left) that appears only when there's an
// unanswered message from admin. Tapping it opens a popup to read and reply.
// Read happens client-side under RLS (the user can SELECT only their own row);
// the reply goes through the server route, which enforces the one-reply rule.
export default function AdminMessage() {
  const [msg, setMsg] = useState(null)
  const [open, setOpen] = useState(false)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    const supabase = createClient()
    supabase
      .from('admin_messages')
      .select('message, message_at, reply')
      .is('reply', null)
      .maybeSingle()
      .then(({ data, error }) => {
        // No message, already replied, or table unavailable → render nothing.
        if (!alive || error || !data) return
        setMsg(data)
      })
    return () => { alive = false }
  }, [])

  async function send() {
    const text = reply.trim()
    if (text.length < 1 || sending) return
    setSending(true)
    setError('')
    try {
      const res = await postJson('/api/reply-message', { reply: text })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d.error || 'Could not send. Please try again.')
        return
      }
      setDone(true)
    } catch {
      // Network failure (offline, connection reset) — surface it instead of
      // leaving the button frozen on "Sending…" forever with no way to retry.
      setError('Could not send. Please check your connection and try again.')
    } finally {
      setSending(false)
    }
  }

  if (!msg || typeof document === 'undefined') return null

  return createPortal(
    <>
      <button
        className={styles.msgFab}
        onClick={() => setOpen((o) => !o)}
        aria-label="Message from admin"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        {!open && !done && <span className={styles.msgFabDot} />}
      </button>

      {open && (
        <div className={styles.msgPop} role="dialog" aria-label="Message from admin">
          <div className={styles.msgPopHead}>
            <span className={styles.msgPopTitle}>
              <span className={styles.msgPopDot} />
              Message from admin
            </span>
            <button className={styles.msgPopClose} onClick={() => setOpen(false)} aria-label="Close">×</button>
          </div>
          <p className={styles.msgPopBody}>{msg.message}</p>

          {done ? (
            <p className={styles.adminMsgSent}>✓ Reply sent. Thanks, we&apos;ll be in touch.</p>
          ) : (
            <>
              <textarea
                className={styles.adminMsgInput}
                placeholder="Write a reply…"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                maxLength={1000}
                rows={3}
              />
              {error ? <p className={styles.adminMsgError}>{error}</p> : null}
              <button
                className={styles.adminMsgBtn}
                onClick={send}
                disabled={sending || reply.trim().length < 1}
              >
                {sending ? 'Sending…' : 'Send reply'}
              </button>
            </>
          )}
        </div>
      )}
    </>,
    document.body
  )
}
