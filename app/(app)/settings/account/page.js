'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './settings.module.css'
import SettingsShell, { SettingsIcon, SettingsPassword, SettingsNotice } from '../SettingsShell'
import { postJson } from '@/lib/http'

// ── Weak password blocklist (mirrors the server-side list) ───────────────────
const WEAK_PASSWORDS = [
  'password', '12345678', '123456789', '1234567890',
  'qwertyui', 'qwerty123', 'qwertyuiop',
  'aaaaaaaa', 'abcdefgh', 'letmein1', 'welcome1',
  'iloveyou', 'monkey12', 'dragon12', 'sunshine',
  'football', 'baseball', 'master12', 'shadow12',
]

const MAX_ATTEMPTS = 5

// ── Password strength helper ─────────────────────────────────────────────────
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

const STRENGTH_COLORS = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e']
const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code,            setCode]            = useState('')
  // 'form' = enter passwords · 'code' = enter the emailed verification code
  const [step,            setStep]            = useState('form')
  const [showCurrent,     setShowCurrent]     = useState(false)
  const [showNew,         setShowNew]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [success,         setSuccess]         = useState(false)
  const [error,           setError]           = useState('')
  const [attempts,        setAttempts]        = useState(0)

  const strength      = getStrength(newPassword)
  const strengthColor = STRENGTH_COLORS[strength]
  const strengthLabel = STRENGTH_LABELS[strength]

  // Client-side new-password validation (UX only — the server re-checks all of it)
  function validateClient() {
    if (newPassword.length < 8) return 'New password must be at least 8 characters.'
    if (newPassword.length > 128) return 'New password is too long.'
    if (newPassword !== confirmPassword) return 'New passwords do not match.'
    if (newPassword === currentPassword) return 'New password must be different from your current password.'
    if (WEAK_PASSWORDS.some((w) => newPassword.toLowerCase().includes(w))) return 'Please choose a stronger password.'
    return null
  }

  // Step 1 — verify current password and request an emailed code
  async function handleRequestCode(e) {
    e.preventDefault()
    setError('')

    if (attempts >= MAX_ATTEMPTS) {
      setError('Too many attempts. Please sign out and sign back in to try again.')
      return
    }
    const invalid = validateClient()
    if (invalid) { setError(invalid); return }

    setLoading(true)
    try {
      const res = await postJson('/api/update-password', { action: 'request', currentPassword, newPassword })
      const result = await res.json().catch(() => ({}))
      if (!res.ok) {
        setAttempts((a) => a + 1)
        setError(result.error || 'Could not start the password change. Please try again.')
        return
      }
      setCode('')
      setStep('code')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2 — submit the emailed code to apply the new password
  async function handleConfirmCode(e) {
    e.preventDefault()
    setError('')

    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code from your email.')
      return
    }

    setLoading(true)
    try {
      const res = await postJson('/api/update-password', { action: 'confirm', newPassword, code })
      const result = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(result.error || 'Could not update password. Please try again.')
        return
      }
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setCode('')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function resetFlow() {
    setStep('form')
    setSuccess(false)
    setError('')
    setCode('')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <SettingsShell active="account">
      <div className={styles.accountGrid}>
        <section className={styles.card} aria-labelledby="password-title">
          <div className={styles.cardHeader}><span className={styles.cardIcon}><SettingsIcon name={success ? 'check' : step === 'code' ? 'mail' : 'lock'} /></span><div><span className={styles.microLabel}>SIGN-IN & SECURITY</span><h2 id="password-title">{success ? 'You’re all set.' : step === 'code' ? 'One last security check.' : 'A stronger password. A safer space.'}</h2></div></div>
          <div className={styles.securitySteps} aria-label="Password change progress"><span data-active="true"><b>{step === 'code' || success ? <SettingsIcon name="check" /> : '1'}</b>New password</span><i /><span data-active={step === 'code' || success}><b>{success ? <SettingsIcon name="check" /> : '2'}</b>Verify by email</span></div>
          {success ? <div className={styles.successState} role="status"><div className={styles.successEmblem}><SettingsIcon name="shield" /></div><h3>Password updated.</h3><p>Your new password is ready to use. Other devices have been signed out to keep your account secure.</p><button type="button" className={styles.secondaryBtn} onClick={resetFlow}>Change password again <SettingsIcon name="arrow" /></button></div> : step === 'code' ? <form className={styles.form} onSubmit={handleConfirmCode} noValidate aria-busy={loading}><p className={styles.formIntro}>We sent a 6-digit code to your email. Enter it below to confirm that this change is yours.</p><div className={styles.field}><label htmlFor="code">Verification code</label><input id="code" inputMode="numeric" autoComplete="one-time-code" className={`${styles.input} ${styles.codeInput}`} placeholder="000000" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} disabled={loading} required autoFocus /><span className={styles.fieldHint}>Check your spam or junk folder if it hasn’t arrived.</span></div>{error && <p className={styles.errorBox} role="alert">{error}</p>}<button type="submit" className={styles.primaryBtn} disabled={loading || code.length !== 6}>{loading ? <><span className={styles.spinner} />Confirming your change…</> : <>Confirm new password <SettingsIcon name="arrow" /></>}</button><div className={styles.codeActions}><button type="button" onClick={handleRequestCode} disabled={loading}>Resend code</button><button type="button" onClick={resetFlow} disabled={loading}>Start over</button></div></form> : <form className={styles.form} onSubmit={handleRequestCode} noValidate aria-busy={loading}>
            <p className={styles.formIntro}>Choose a password you haven’t used before. We’ll confirm the change with a code sent to your email.</p>
            <SettingsPassword id="current" label="Current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} visible={showCurrent} onToggle={() => setShowCurrent((value) => !value)} disabled={loading} autoComplete="current-password" placeholder="Enter your current password" />
            <div className={styles.newPasswordBlock}><SettingsPassword id="newpw" label="New password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} visible={showNew} onToggle={() => setShowNew((value) => !value)} disabled={loading} autoComplete="new-password" placeholder="At least 8 characters" describedBy="password-strength" /><div id="password-strength" className={styles.strengthRow}><div aria-hidden="true">{[1, 2, 3, 4].map((level) => <span key={level} style={{ background: level <= strength ? strengthColor : undefined }} />)}</div><span style={{ color: strength ? strengthColor : undefined }}>{strength ? `${strengthLabel} password` : 'Make it hard to guess'}</span></div></div>
            <div className={styles.newPasswordBlock}><SettingsPassword id="confirm" label="Confirm new password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} visible={showConfirm} onToggle={() => setShowConfirm((value) => !value)} disabled={loading} autoComplete="new-password" placeholder="One more time" invalid={confirmPassword && confirmPassword !== newPassword} describedBy={confirmPassword ? 'password-match' : undefined} />{confirmPassword && <p id="password-match" className={confirmPassword === newPassword ? styles.fieldSuccess : styles.fieldError}>{confirmPassword === newPassword ? 'Passwords match.' : 'Passwords do not match yet.'}</p>}</div>
            {error && <p className={styles.errorBox} role="alert">{error}</p>}
            <button type="submit" className={styles.primaryBtn} disabled={loading || !currentPassword || !newPassword || !confirmPassword}>{loading ? <><span className={styles.spinner} />Sending your verification code…</> : <>Continue to verification <SettingsIcon name="arrow" /></>}</button><p className={styles.buttonNote}><SettingsIcon name="mail" />Your password changes only after email verification.</p>
          </form>}
        </section>
        <aside className={styles.securityAside}><div className={styles.securityArt} aria-hidden="true"><div /><div /><span><SettingsIcon name="shield" /></span><small>YOUR ACCOUNT. YOUR CONTROL.</small></div><div className={styles.asideCopy}><span className={styles.eyebrow}>A LITTLE EXTRA CARE</span><h2>Keep your progress<br /><em>in good hands.</em></h2><p>A few thoughtful choices go a long way toward protecting your account.</p><ul className={styles.securityTips}><li><SettingsIcon name="check" /><span>Use a unique password<small>Keep it different from your other accounts.</small></span></li><li><SettingsIcon name="check" /><span>Make it harder to guess<small>Try a longer mix of words, numbers, and symbols.</small></span></li><li><SettingsIcon name="check" /><span>Keep email access handy<small>You’ll need it to confirm a password change.</small></span></li></ul></div></aside>
      </div>
      <div className={styles.helpRow}><span className={styles.cardIcon}><SettingsIcon name="help" /></span><div><h2>Can’t remember your current password?</h2><p>You can reset it through your email and come back when you’re ready.</p></div><Link href="/forgot-password" className={styles.textLink}>Reset password <SettingsIcon name="arrow" /></Link></div>
      <SettingsNotice title="What happens to my other devices?">After a successful password change, other sessions are signed out. Sign back in with your new password on your Windows companion and any other devices you use.</SettingsNotice>
    </SettingsShell>
  )
}
