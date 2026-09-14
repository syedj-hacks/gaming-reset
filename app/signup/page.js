'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from '../components/Auth/Auth.module.css'
import AuthShell, { AuthIcon, AuthDivider, PasswordToggle } from '../components/Auth/AuthShell'
import GoogleSignInButton from '../components/GoogleSignIn/GoogleSignInButton'
import { postJson } from '@/lib/http'
const WEAK_PASSWORDS = [
  'password', '12345678', '123456789', '1234567890',
  'qwertyui', 'qwerty123', 'qwertyuiop',
  'aaaaaaaa', 'abcdefgh', 'letmein1', 'welcome1',
  'iloveyou', 'monkey12', 'dragon12', 'sunshine',
  'football', 'baseball', 'master12', 'shadow12',
]

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
if (!SITE_URL && process.env.NODE_ENV === 'development') {
  console.error(
    '[signup] NEXT_PUBLIC_SITE_URL is not set. ' +
    'Email confirmation redirects will be broken.'
  )
}
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

export default function SignupPage() {
  const [email,           setEmail]           = useState('')
  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass,        setShowPass]        = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [googleBusy,      setGoogleBusy]      = useState(false)
  const [error,           setError]           = useState('')
  const [success,         setSuccess]         = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })

  function validate() {
    const mail = email.trim().toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))
      return 'Please enter a valid email address.'
    if (mail.length > 254)
      return 'Email address is too long.'
    if (password.length < 8)
      return 'Password must be at least 8 characters.'
    if (password.length > 128)
      return 'Password is too long.'
    if (password !== confirmPassword)
      return 'Passwords do not match.'
    // FIX: Expanded blocklist check
    if (WEAK_PASSWORDS.some((w) => password.toLowerCase().includes(w)))
      return 'Please choose a stronger password.'
    return null
  }

  function fieldError(field) {
    if (!touched[field]) return null
    switch (field) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase()))
          return 'Please enter a valid email address.'
        return null
      case 'password':
        if (password.length > 0 && password.length < 8)
          return 'Password must be at least 8 characters.'
        return null
      default:
        return null
    }
  }

  function markTouched(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setLoading(true)
    try {
      const res = await postJson('/api/signup', {
        email,
        password,
        _hp_name: document.querySelector('input[name="_hp_name"]')?.value ?? '',
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || 'Could not create account. Please try again.')
        return
      }

      if (result.session) {
        // Full-document navigation (not router.push): signup creates the session
        // on the SERVER, so the persistent root-layout <Header> never hears the
        // auth change on its own browser Supabase client and would keep showing
        // the logged-out actions until a tab refocus. A hard navigation remounts
        // the Header so it reads the freshly-set auth cookies.
        window.location.assign('/onboarding')
      } else {
        setSuccess(true)
      }
    } catch (err) {
      console.error('[signup] unexpected error', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const strength      = getStrength(password)
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'][strength]
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]

  // ── Success state ──────────────────────────────────────────────────────────

  if (success) {
    return (
      <AuthShell mode="signup" success>
        <div className={styles.successState} role="status">
          <div className={styles.successArt}><span /><span /><div><AuthIcon name="mail" /></div></div>
          <span className={styles.formEyebrow}>ONE LAST LITTLE STEP</span>
          <h1 id="auth-title" className={styles.title}>Your reset is<br />in your inbox.</h1>
          <p className={styles.successBody}>We sent a confirmation link to<strong>{email.trim().toLowerCase()}</strong>Open it to activate your account and start your free 3-day trial.</p>
          <div className={styles.inboxNote}><AuthIcon name="mail" /><p>Can’t see it yet? Give it a moment and check your spam or junk folder.</p></div>
          <Link href="/login" className={styles.submitBtn}>Continue to sign in <AuthIcon /></Link>
          <Link href="/contact" className={styles.successHelp}>Need a hand? Get in touch <span aria-hidden="true">↗</span></Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell mode="signup">
      <GoogleSignInButton text="signup_with" onError={setError} onBusyChange={setGoogleBusy} disabled={loading} />
      <AuthDivider />
      <form className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={loading || googleBusy}>
        <input type="text" name="_hp_name" aria-hidden="true" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email address</label>
          <div className={styles.inputWrap}>
            <AuthIcon name="mail" className={styles.fieldIcon} />
            <input id="email" type="email" className={`${styles.input} ${fieldError('email') ? styles.inputError : ''}`} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => markTouched('email')} autoComplete="email" autoCapitalize="none" spellCheck={false} required disabled={loading || googleBusy} maxLength={254} aria-invalid={Boolean(fieldError('email'))} aria-describedby={fieldError('email') ? 'email-error' : undefined} />
          </div>
          {fieldError('email') && <span id="email-error" className={styles.fieldError}>{fieldError('email')}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">Create a password</label>
          <div className={styles.inputWrap}>
            <AuthIcon name="lock" className={styles.fieldIcon} />
            <input id="password" type={showPass ? 'text' : 'password'} className={`${styles.input} ${fieldError('password') ? styles.inputError : ''}`} placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => markTouched('password')} autoComplete="new-password" required disabled={loading || googleBusy} maxLength={128} aria-invalid={Boolean(fieldError('password'))} aria-describedby={fieldError('password') ? 'password-error password-strength' : 'password-strength'} />
            <PasswordToggle visible={showPass} onClick={() => setShowPass((value) => !value)} disabled={loading || googleBusy} />
          </div>
          {fieldError('password') && <span id="password-error" className={styles.fieldError}>{fieldError('password')}</span>}
          <div className={styles.strengthRow} id="password-strength">
            <div className={styles.strengthBars} aria-hidden="true">{[1, 2, 3, 4].map((level) => <span key={level} style={{ background: level <= strength ? strengthColor : undefined }} />)}</div>
            <span style={{ color: strength ? strengthColor : undefined }}>{strength ? `${strengthLabel} password` : 'Make it hard to guess'}</span>
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="confirm">Confirm password</label>
          <div className={styles.inputWrap}>
            <AuthIcon name="lock" className={styles.fieldIcon} />
            <input id="confirm" type={showConfirmPass ? 'text' : 'password'} className={`${styles.input} ${confirmPassword && confirmPassword !== password ? styles.inputError : ''}`} placeholder="One more time" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" required disabled={loading || googleBusy} maxLength={128} aria-invalid={Boolean(confirmPassword && confirmPassword !== password)} aria-describedby={confirmPassword ? 'confirm-feedback' : undefined} />
            <PasswordToggle visible={showConfirmPass} onClick={() => setShowConfirmPass((value) => !value)} disabled={loading || googleBusy} label="confirmation password" />
          </div>
          {confirmPassword && <span id="confirm-feedback" className={confirmPassword !== password ? styles.fieldError : styles.fieldSuccess}>{confirmPassword !== password ? 'Passwords do not match yet.' : <><AuthIcon name="check" />Passwords match</>}</span>}
        </div>
        {error && <div className={styles.errorBox} role="alert"><span aria-hidden="true">!</span><p>{error}</p></div>}
        <p className={styles.terms}>By creating an account, you agree to our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.</p>
        <button type="submit" className={styles.submitBtn} disabled={loading || googleBusy}>{loading ? <><span className={styles.spinner} />Creating your account…</> : googleBusy ? 'Connecting with Google…' : <>Start my free trial <AuthIcon /></>}</button>
        <p className={styles.formNote}><AuthIcon name="shield" />No credit card. No charge today. Just a fresh start.</p>
      </form>
    </AuthShell>
  )
}
