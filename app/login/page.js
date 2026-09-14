'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from '../components/Auth/Auth.module.css'
import AuthShell, { AuthIcon, AuthDivider, PasswordToggle } from '../components/Auth/AuthShell'
import GoogleSignInButton from '../components/GoogleSignIn/GoogleSignInButton'
import { postJson } from '@/lib/http'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [googleBusy, setGoogleBusy] = useState(false)
  const [error,    setError]    = useState('')

  // Surface a failed OAuth / email-confirmation callback. /auth/callback
  // redirects here with ?error=oauth when a code exchange fails (e.g. an expired
  // or already-used confirmation link); without this the user lands on a pristine
  // form with no clue anything went wrong. Read from location rather than
  // useSearchParams to avoid forcing a Suspense boundary on this page.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('error') === 'oauth') {
      // Reading a URL param on mount is a legitimate external-state sync; the
      // effect runs post-hydration so there's no mismatch. Same disable the
      // dashboard mount effect uses for this rule.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("That sign-in or confirmation link didn't work or has expired. Please sign in below, or request a new link.")
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await postJson('/api/login', { email, password })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      // Full-document navigation (not router.push): login signs the user in on
      // the SERVER, so the persistent root-layout <Header> never hears the auth
      // change on its own browser Supabase client and would keep showing the
      // logged-out actions until a tab refocus. A hard navigation remounts the
      // Header so it reads the freshly-set auth cookies. Keep `loading` true so
      // the button stays disabled until the new page takes over.
      window.location.assign(result.redirect)
      return
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <AuthShell mode="login">
      <GoogleSignInButton text="signin_with" onError={setError} onBusyChange={setGoogleBusy} disabled={loading} />
      <AuthDivider />
      <form className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={loading || googleBusy}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email address</label>
          <div className={styles.inputWrap}>
            <AuthIcon name="mail" className={styles.fieldIcon} />
            <input id="email" type="email" className={styles.input} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoCapitalize="none" spellCheck={false} required disabled={loading || googleBusy} maxLength={254} />
          </div>
        </div>
        <div className={styles.field}>
          <div className={styles.labelRow}><label className={styles.label} htmlFor="password">Password</label><Link href="/forgot-password" className={styles.forgotLink}>Forgot password?</Link></div>
          <div className={styles.inputWrap}>
            <AuthIcon name="lock" className={styles.fieldIcon} />
            <input id="password" type={showPass ? 'text' : 'password'} className={styles.input} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required disabled={loading || googleBusy} maxLength={128} />
            <PasswordToggle visible={showPass} onClick={() => setShowPass((value) => !value)} disabled={loading || googleBusy} />
          </div>
        </div>
        {error && <div className={styles.errorBox} role="alert"><span aria-hidden="true">!</span><p>{error}</p></div>}
        <button type="submit" className={styles.submitBtn} disabled={loading || googleBusy}>{loading ? <><span className={styles.spinner} />Signing you in…</> : googleBusy ? 'Connecting with Google…' : <>Let’s keep going <AuthIcon /></>}</button>
        <p className={styles.formNote}><AuthIcon name="shield" />One account for your Windows app and the web.</p>
      </form>
    </AuthShell>
  )
}
