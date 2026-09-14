'use client'

import { useState } from 'react'
import styles from './contact.module.css'
import { postJson } from '@/lib/http'

const TOPICS = [
  'General question',
  'My plan',
  'Billing or subscription',
  'Technical issue',
  'Something else',
]

export default function ContactForm() {
  const [topic, setTopic]       = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending]   = useState(false)
  const [error, setError]       = useState('')
  const [company, setCompany]   = useState('') // honeypot — must stay empty
  const [form, setForm]         = useState({ name: '', email: '', message: '' })

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (sending || !form.name || !form.email || !form.message || !topic) return

    setSending(true)
    setError('')
    try {
      const res = await postJson('/api/contact', { ...form, topic, company })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Could not send your message. Please try again.')
        return
      }
      setSubmitted(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroMesh} />
        <div className={styles.heroInner}>
          <span className={styles.tag}>CONTACT</span>
          <h1 className={styles.title}>
            Real people.<br />
            <span className={styles.gradient}>Real replies.</span>
          </h1>
          <p className={styles.subtitle}>
            No ticket queues, no bots. Send us a message and
            a human on our team will get back to you.
          </p>
          <div className={styles.replyBadge}>
            <span className={styles.pulseDot} />
            Typically replies within a few hours
          </div>
        </div>
      </div>

      {/* ── Form Section ── */}
      <div className={styles.formSectionWrapper}>
      <div className={styles.formSection}>

        {submitted ? (
          <div className={styles.successCard}>
            <div className={styles.successGlow} />
            <span className={styles.successIcon}>◉</span>
            <h2 className={styles.successTitle}>Message received.</h2>
            <p className={styles.successBody}>
              Someone from our team will read this and get back to you personally.
              No auto-replies, no ticket numbers.
            </p>
            <button
              className={styles.successBtn}
              onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); setTopic(null); setError('') }}
            >
              Send another message
            </button>
          </div>
        ) : (
          <form className={styles.card} onSubmit={handleSubmit}>
            <div className={styles.cardGlow} />
            <div className={styles.cardMesh} />

            <div className={styles.formInner}>

              {/* Honeypot — hidden from real users, catches bots */}
              <input
                type="text"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
              />

              {/* Topic pills */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>What is this about?</label>
                <div className={styles.pills}>
                  {TOPICS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`${styles.pill} ${topic === t ? styles.pillActive : ''}`}
                      onClick={() => setTopic(t)}
                      aria-pressed={topic === t}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name + Email row */}
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="name">Your name</label>
                  <input
                    id="name"
                    type="text"
                    className={styles.input}
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="email">Email address</label>
                  <input
                    id="email"
                    type="email"
                    className={styles.input}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Message */}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="message">Your message</label>
                <textarea
                  id="message"
                  className={styles.textarea}
                  placeholder="Tell us what's on your mind..."
                  rows={5}
                  maxLength={1000}
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                  required
                />
                <span className={styles.charCount}>{form.message.length} / 1000</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={sending}
                className={`${styles.submitBtn} ${(sending || !form.name || !form.email || !form.message || !topic) ? styles.submitDisabled : ''}`}
              >
                {sending ? 'Sending…' : 'Send message →'}
              </button>

              {error && (
                <p className={styles.formError} role="alert">{error}</p>
              )}

              <p className={styles.formNote}>
                We read every message personally. No auto-replies.
              </p>

            </div>
          </form>
        )}

        {/* Side info */}
        <div className={styles.sidePanel}>
          {[
            {
              icon: '◉',
              title: 'Human support',
              body: 'Every message lands in a real inbox. A real person reads it and replies.',
            },
            {
              icon: '◈',
              title: 'Questions about your plan',
              body: "Struggling with your plan or not seeing progress? Reach out. That's exactly what we're here for.",
            },
            {
              icon: '⬡',
              title: 'Billing',
              body: 'Questions about your subscription, trial, or charges? We will sort it out, no hassle.',
            },
            {
              icon: '▦',
              title: 'Feedback',
              body: 'Built something you want to see? Spotted something broken? Tell us. We actually act on it.',
            },
          ].map((item) => (
            <div key={item.title} className={styles.infoCard}>
              <span className={styles.infoIcon}>{item.icon}</span>
              <div>
                {/* h2, not h3: the page h1 lives in the hero, and these side
                    cards were the next headings, so h3 skipped a level. The
                    class drives all styling, so the tag change is invisible. */}
                <h2 className={styles.infoTitle}>{item.title}</h2>
                <p className={styles.infoBody}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
    </div>
  )
}
