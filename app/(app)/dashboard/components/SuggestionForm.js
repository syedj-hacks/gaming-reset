'use client'

import { useState } from 'react'
import styles from '../dashboard.module.css'
import { postJson } from '@/lib/http'

const CATS = [
  { value: 'general',  label: 'General'          },
  { value: 'task',     label: 'Task Feedback'     },
  { value: 'feature',  label: 'Feature Request'   },
  { value: 'bug',      label: 'Something Broken'  },
]

export default function SuggestionForm() {
  const [text,       setText]       = useState('')
  const [category,   setCategory]   = useState('general')
  const [submitted,  setSubmitted]  = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')

  // Goes through the server route (auth + rate limit + validation + sanitize +
  // server-set user_id) instead of a direct client insert.
  async function submit() {
    if (!text.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await postJson('/api/submit-suggestion', { suggestion: text.trim(), category })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Could not send. Please try again.')
        return
      }
      setText('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 4000)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionLabel}>Leave a Suggestion</div>
      <p className={styles.sectionSub}>
        Something not working? A task that doesn&apos;t fit? An idea? Tell us, we read every one.
      </p>
      <div className={styles.catRow}>
        {CATS.map((c) => (
          <button key={c.value}
            className={`${styles.catBtn} ${category === c.value ? styles.catBtnActive : ''}`}
            onClick={() => setCategory(c.value)}
          >{c.label}</button>
        ))}
      </div>
      {submitted ? (
        <p className={styles.successMsg}>Received. We read every one.</p>
      ) : (
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your suggestion here..."
            maxLength={500}
            className={styles.textarea}
          />
          {error && <p className={styles.successMsg} style={{ color: '#ef4444', marginTop: 8 }}>{error}</p>}
          <div className={styles.textareaFooter}>
            <span className={styles.charCount}>{text.length} / 500</span>
            <button
              onClick={submit}
              disabled={submitting || !text.trim()}
              className={`${styles.taskSubmitBtn} ${!text.trim() ? styles.btnOff : ''}`}
            >
              {submitting ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}