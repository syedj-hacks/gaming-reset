'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import styles from './delete-account.module.css'
import { postJson } from '@/lib/http'

// Public, app-independent account-deletion page (Play / App Store requirement:
// users must be able to request deletion from a browser without the app).
// Logged-out visitors are asked to sign in; logged-in users get the real flow.
export default function DeleteAccountPage() {
  const [supabase] = useState(() => createClient())
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [hasPassword, setHasPassword] = useState(false)

  const [confirmEmail, setConfirmEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let alive = true
    supabase.auth.getUser().then(({ data }) => {
      if (!alive) return
      const user = data?.user
      if (user?.email) {
        setEmail(user.email)
        const providers = [
          ...(Array.isArray(user.app_metadata?.providers) ? user.app_metadata.providers : []),
          ...(Array.isArray(user.identities) ? user.identities.map((i) => i?.provider) : []),
        ]
        setHasPassword(providers.includes('email'))
      }
      setChecking(false)
    })
    return () => { alive = false }
  }, [supabase])

  // Mirror the server rules so the button only enables on a valid attempt.
  const emailMatches = confirmEmail.trim().toLowerCase() === email.toLowerCase() && !!email
  const canSubmit = emailMatches && (!hasPassword || password.length > 0) && !busy

  async function handleDelete() {
    if (!canSubmit) return
    setError('')
    setBusy(true)
    try {
      const res = await postJson('/api/delete-account', {
        confirmEmail: confirmEmail.trim(),
        ...(hasPassword ? { password } : {}),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Could not delete your account. Please try again.')
        setBusy(false)
        return
      }
      // Clear the now-orphaned local session and show the final state.
      await supabase.auth.signOut().catch(() => {})
      setDone(true)
    } catch {
      setError('Network error. Please try again.')
      setBusy(false)
    }
  }

  if (checking) {
    return (
      <main className={styles.page}>
        <div className={styles.card}><p className={styles.muted}>Loading…</p></div>
      </main>
    )
  }

  if (done) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <div className={styles.badgeDone}>✓</div>
          <h1 className={styles.title}>Your account has been deleted</h1>
          <p className={styles.muted}>
            Your account and associated data have been permanently removed. We&apos;re
            sorry to see you go. You&apos;re always welcome back.
          </p>
          <Link href="/" className={styles.secondaryBtn}>Return home</Link>
        </div>
      </main>
    )
  }

  if (!email) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>Delete your account</h1>
          <p className={styles.muted}>
            To delete your Gaming Reset account, please sign in first. You can also
            email <a className={styles.link} href="mailto:support@gamingreset.com">support@gamingreset.com</a> to request deletion.
          </p>
          <Link href="/login?next=/delete-account" className={styles.primaryBtn}>Sign in to continue</Link>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.badgeWarn}>!</div>
        <h1 className={styles.title}>Delete your account</h1>
        <p className={styles.muted}>
          This permanently deletes your account <strong className={styles.email}>{email}</strong> and
          <strong> cannot be undone</strong>. The following are erased:
        </p>
        <ul className={styles.list}>
          <li>Your profile, rating, rank and streaks</li>
          <li>All missions, goals and progress history</li>
          <li>Uploaded proof photos and urge logs</li>
          <li>Your login. You won&apos;t be able to sign back in</li>
        </ul>
        <p className={styles.noteWarn}>
          If you have an auto-renewing subscription, it will be cancelled as part of
          deletion so you aren&apos;t charged again.
        </p>

        <label className={styles.label}>Type your email to confirm</label>
        <input
          className={styles.input}
          type="email"
          autoComplete="off"
          placeholder={email}
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          disabled={busy}
        />

        {hasPassword && (
          <>
            <label className={styles.label}>Enter your password</label>
            <input
              className={styles.input}
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              maxLength={128}
            />
          </>
        )}

        {error ? <p className={styles.error}>{error}</p> : null}

        <button className={styles.dangerBtn} onClick={handleDelete} disabled={!canSubmit}>
          {busy ? 'Deleting…' : 'Permanently delete my account'}
        </button>
        <Link href="/dashboard" className={styles.cancelLink}>Cancel and go back</Link>
      </div>
    </main>
  )
}
