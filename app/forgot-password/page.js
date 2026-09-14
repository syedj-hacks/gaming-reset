'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './forgot-password.module.css'
import { postJson } from '@/lib/http'

export default function ForgotPasswordPage() {
  const [email,     setEmail]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')

async function handleSubmit(e) {
  e.preventDefault()
  setLoading(true)
  setError('')

  const cleanEmail = email.trim().toLowerCase()

  try {
    const res = await postJson('/api/forgot-password', { email: cleanEmail })

    // Even if rate limited, show success — never reveal anything useful to bots
    // Exception: only show an actual error for true network failures
    if (res.status !== 429) {
      setSubmitted(true)
      return
    }

    const result = await res.json()
    setError(result.error || 'Too many requests. Please try again later.')
  } catch {
    // Network failure — still show success to avoid leaking info
    setSubmitted(true)
  } finally {
    setLoading(false)
  }
}

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} />
      <div className={styles.bgMesh} />

      <div className={styles.wrapper}>

        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoGlyph} />
          <span className={styles.logoText}>
            Gaming <span className={styles.logoAccent}>Reset</span>
          </span>
        </Link>

        <div className={styles.card}>
          <div className={styles.cardGlow} />
          <div className={styles.cardMesh} />

          <div className={styles.cardInner}>

            {submitted ? (
              /* Success state */
              <div className={styles.successState}>
                <span className={styles.successIcon}>◉</span>
                <h2 className={styles.successTitle}>Check your inbox.</h2>
                <p className={styles.successBody}>
                  If an account exists for <strong>{email}</strong>, we sent a
                  password reset link. Check your spam folder if you don&apos;t
                  see it within a few minutes.
                </p>
                <Link href="/login" className={styles.backBtn}>
                  ← Back to sign in
                </Link>
              </div>
            ) : (
              /* Form state */
              <>
                <div className={styles.cardHeader}>
                  <h1 className={styles.cardTitle}>Reset your password.</h1>
                  <p className={styles.cardSub}>
                    Enter your email and we&apos;ll send you a reset link.
                  </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">Email address</label>
                    <input
                      id="email"
                      type="email"
                      className={styles.input}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                      disabled={loading}
                      maxLength={254}
                    />
                  </div>

                  {error && (
                    <div className={styles.errorBox} role="alert">
                      <span className={styles.errorIcon}>▲</span>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={loading}
                  >
                    {loading ? <span className={styles.spinner} /> : 'Send reset link →'}
                  </button>
                </form>

                <Link href="/login" className={styles.backLink}>← Back to sign in</Link>
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}