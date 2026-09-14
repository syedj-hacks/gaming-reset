'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './reset-password.module.css'

// ── Weak password blocklist ──────────────────────────────────────────────────
const WEAK_PASSWORDS = [
  'password', '12345678', '123456789', '1234567890',
  'qwertyui', 'qwerty123', 'qwertyuiop',
  'aaaaaaaa', 'abcdefgh', 'letmein1', 'welcome1',
  'iloveyou', 'monkey12', 'dragon12', 'sunshine',
  'football', 'baseball', 'master12', 'shadow12',
]

const MAX_ATTEMPTS = 5

export default function ResetPasswordPage() {
  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass,        setShowPass]        = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [success,         setSuccess]         = useState(false)
  const [error,           setError]           = useState('')
  const [sessionReady,    setSessionReady]    = useState(false)
  const [sessionError,    setSessionError]    = useState(false)
  const [attempts,        setAttempts]        = useState(0)

  // Fix 1: ref so the setTimeout closure always sees the latest value
  const sessionReadyRef = useRef(false)

  const router   = useRouter()
  // Stable browser-client singleton (createClient() returns a new client each render).
  const [supabase] = useState(() => createClient())

  function markSessionReady() {
    sessionReadyRef.current = true
    setSessionReady(true)
  }

  useEffect(() => {
    // Only a genuine recovery link may unlock the form. Supabase fires
    // PASSWORD_RECOVERY (and ONLY that event) when it processes a reset link —
    // for both the PKCE `?code=` flow and the implicit `#...&type=recovery` flow
    // (auth-js keys it off `type=recovery`, which resetPasswordForEmail sets).
    //
    // We deliberately do NOT accept a plain SIGNED_IN event or an already-present
    // getSession() here: this page changes the password directly via
    // updateUser() with no current-password / OTP challenge, so accepting any
    // logged-in session would let anyone holding a victim's session take over the
    // account from /reset-password. Recovery context is the only key.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          markSessionReady()
        }
      }
    )

    // Timeout — if no recovery event after 5s, the link is invalid or expired
    // Fix 1: uses ref instead of stale state closure
    const timeout = setTimeout(() => {
      if (!sessionReadyRef.current) setSessionError(true)
    }, 5000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [supabase])

  function getStrength(pw) {
    if (pw.length === 0) return 0
    if (pw.length < 8)   return 1
    const hasUpper   = /[A-Z]/.test(pw)
    const hasNum     = /[0-9]/.test(pw)
    const hasSpecial = /[^A-Za-z0-9]/.test(pw)
    if (pw.length >= 12 && hasUpper && hasNum && hasSpecial) return 4
    if (pw.length >= 10 && (hasUpper || hasNum))              return 3
    return 2
  }

  const strength      = getStrength(password)
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'][strength]
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Fix 2: rate limit post-auth attempts
    if (attempts >= MAX_ATTEMPTS) {
      setError('Too many attempts. Please request a new reset link.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password.length > 128) {
      setError('Password is too long.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // Fix 3: weak password blocklist
    if (WEAK_PASSWORDS.some((w) => password.toLowerCase().includes(w))) {
      setError('Please choose a stronger password.')
      return
    }

    setLoading(true)

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setAttempts((a) => a + 1)  // Fix 2: increment on failure
      setError(updateError.message || 'Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    // Security: a forgotten-password reset should also boot any OTHER active
    // sessions (e.g. an attacker who still holds a stolen session). Best-effort —
    // never block the success path on it. This recovery session stays signed in.
    try { await supabase.auth.signOut({ scope: 'others' }) } catch {}

    setSuccess(true)
    // Redirect to dashboard after 2 seconds
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  // ── Invalid / expired link ──────────────────────────────────────────────────
  if (sessionError && !sessionReady) {
    return (
      <div className={styles.page}>
        <div className={styles.bgGlow} />
        <div className={styles.bgMesh} />
        <div className={styles.wrapper}>
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
              <div className={styles.expiredState}>
                <span className={styles.expiredIcon}>▲</span>
                <h2 className={styles.expiredTitle}>Link expired.</h2>
                <p className={styles.expiredBody}>
                  This password reset link has expired or already been used.
                  Reset links are only valid for one hour.
                </p>
                <Link href="/forgot-password" className={styles.expiredBtn}>
                  Request a new link →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Loading — waiting for Supabase to exchange token ───────────────────────
  if (!sessionReady && !sessionError) {
    return (
      <div className={styles.page}>
        <div className={styles.bgGlow} />
        <div className={styles.bgMesh} />
        <div className={styles.wrapper}>
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
              <div className={styles.waitingState}>
                <div className={styles.waitingSpinner} />
                <p className={styles.waitingText}>Verifying your reset link...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} />
      <div className={styles.bgMesh} />

      <div className={styles.wrapper}>

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

            {success ? (
              <div className={styles.successState}>
                <span className={styles.successIcon}>◉</span>
                <h2 className={styles.successTitle}>Password updated.</h2>
                <p className={styles.successBody}>
                  Your password has been changed. Redirecting you to the dashboard...
                </p>
                <div className={styles.successSpinner} />
              </div>
            ) : (
              <>
                <div className={styles.cardHeader}>
                  <h1 className={styles.cardTitle}>Set new password.</h1>
                  <p className={styles.cardSub}>
                    Choose a strong password you haven&apos;t used before.
                  </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit} noValidate>

                  {/* New Password */}
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="password">
                      New password
                    </label>
                    <div className={styles.inputWrap}>
                      <input
                        id="password"
                        type={showPass ? 'text' : 'password'}
                        className={styles.input}
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        disabled={loading}
                        maxLength={128}
                      />
                      <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowPass((s) => !s)}
                        tabIndex={-1}
                      >
                        {showPass ? '◉' : '○'}
                      </button>
                    </div>

                    {/* Strength bar */}
                    {password.length > 0 && (
                      <div className={styles.strengthRow}>
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={styles.strengthBar}
                            style={{
                              background: level <= strength
                                ? strengthColor
                                : 'rgba(255,255,255,0.06)',
                            }}
                          />
                        ))}
                        <span className={styles.strengthLabel}
                          style={{ color: strengthColor }}>
                          {strengthLabel}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm */}
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="confirm">
                      Confirm password
                    </label>
                    <input
                      id="confirm"
                      type="password"
                      className={`${styles.input} ${
                        confirmPassword && confirmPassword !== password
                          ? styles.inputError : ''
                      }`}
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      disabled={loading}
                      maxLength={128}
                    />
                    {confirmPassword && confirmPassword !== password && (
                      <span className={styles.fieldError}>
                        Passwords do not match
                      </span>
                    )}
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
                    disabled={loading || !password || !confirmPassword}
                  >
                    {loading
                      ? <span className={styles.spinner} />
                      : 'Update password →'}
                  </button>

                </form>
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}