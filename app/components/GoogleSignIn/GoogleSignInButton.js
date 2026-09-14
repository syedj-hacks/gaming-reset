'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import styles from './GoogleSignInButton.module.css'

// Public by design — a Google OAuth *client ID* is not a secret (the client
// secret stays in Google/Supabase and is never used by this token flow).
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const GSI_SRC = 'https://accounts.google.com/gsi/client'

// Load the Google Identity Services library once per document.
function loadGsi() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') { reject(new Error('no window')); return }
    if (window.google?.accounts?.id) { resolve(); return }
    let script = document.getElementById('google-gsi-script')
    if (script) {
      script.addEventListener('load', () => resolve())
      script.addEventListener('error', () => reject(new Error('gsi load failed')))
      return
    }
    script = document.createElement('script')
    script.src = GSI_SRC
    script.id = 'google-gsi-script'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('gsi load failed'))
    document.head.appendChild(script)
  })
}

// A random nonce plus its SHA-256 hash (hex). Google embeds the hash in the ID
// token; Supabase re-hashes the raw nonce we hand to signInWithIdToken and
// compares — binding the token to this one request and blocking replay.
async function makeNonce() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  const raw = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))
  const hashed = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
  return { raw, hashed }
}

/**
 * Google sign-in via Google Identity Services + Supabase signInWithIdToken.
 * Replaces the redirect-based signInWithOAuth so Google's consent screen shows
 * our own domain instead of the Supabase project URL, and no auth data ever
 * transits a third-party redirect host.
 *
 * props:
 *  - text: 'signin_with' | 'signup_with' | 'continue_with' (button label)
 *  - onError(message): surface an error string to the parent
 *  - onBusyChange(bool): tell the parent Google auth is in flight
 *  - disabled: block interaction while the parent's email form is submitting
 */
export default function GoogleSignInButton({ text = 'continue_with', onError, onBusyChange, disabled = false }) {
  const containerRef = useRef(null)
  const rawNonceRef = useRef('')
  const [busy, setBusy] = useState(false)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    if (!CLIENT_ID) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[GoogleSignInButton] NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set — Google sign-in is disabled.')
      }
      return
    }

    let cancelled = false

    // Google's rendered button needs an explicit pixel width, so measure the
    // container and re-render on resize to stay responsive.
    function renderButton() {
      const el = containerRef.current
      if (cancelled || !el || !window.google?.accounts?.id) return
      const width = Math.max(200, Math.min(400, Math.floor(el.offsetWidth) || 320))
      el.innerHTML = ''
      window.google.accounts.id.renderButton(el, {
        type: 'standard',
        // White button with the colour Google 'G' and dark text, to match the
        // mobile app's "Continue with Google" button.
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text,
        logo_alignment: 'center',
        width,
      })
    }

    async function handleCredential(response) {
      if (!response?.credential) {
        onError?.('Could not sign in with Google. Please try again.')
        return
      }
      setBusy(true)
      onBusyChange?.(true)
      onError?.('')
      try {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
          nonce: rawNonceRef.current,
        })
        if (error || !data?.user) {
          onError?.('Could not sign in with Google. Please try again.')
          setBusy(false)
          onBusyChange?.(false)
          return
        }
        // Mirror /auth/callback: onboarded users go to the dashboard, everyone
        // else to onboarding. Destinations are hardcoded (no open redirect).
        let destination = '/onboarding'
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_complete')
          .eq('id', data.user.id)
          .single()
        if (profile?.onboarding_complete) destination = '/dashboard'
        // Hard navigation so the root-layout Header re-reads the new auth cookies.
        window.location.assign(destination)
      } catch {
        onError?.('Something went wrong. Please try again.')
        setBusy(false)
        onBusyChange?.(false)
      }
    }

    async function boot() {
      try {
        await loadGsi()
        if (cancelled) return
        const { raw, hashed } = await makeNonce()
        if (cancelled) return
        rawNonceRef.current = raw
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredential,
          nonce: hashed,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true,
        })
        renderButton()
      } catch {
        onError?.('Could not load Google sign-in. Please use email instead.')
      }
    }

    boot()
    window.addEventListener('resize', renderButton)
    return () => {
      cancelled = true
      window.removeEventListener('resize', renderButton)
    }
    // Props are stable setState callbacks; re-running on identity churn would
    // reload GSI and reset the nonce unnecessarily.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // No client ID configured — hide the button entirely; email/password still works.
  if (!CLIENT_ID) return null

  return (
    <div className={styles.wrap}>
      <div ref={containerRef} className={styles.container} />
      {busy && (
        <div className={styles.busy}>
          <span className={styles.spinner} />
        </div>
      )}
      {(disabled || busy) && <div className={styles.block} aria-hidden="true" />}
    </div>
  )
}
