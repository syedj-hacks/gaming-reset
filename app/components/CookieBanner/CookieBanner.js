'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './CookieBanner.module.css'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    // Only show if user hasn't already made a choice
    const consent = localStorage.getItem('mmr_cookie_consent')
    if (!consent) {
      // Small delay so it doesn't flash immediately on load
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss(choice) {
    setLeaving(true)
    localStorage.setItem('mmr_cookie_consent', choice)
    setTimeout(() => setVisible(false), 350)
  }

  if (!visible) return null

  return (
    <div className={`${styles.banner} ${leaving ? styles.bannerLeaving : styles.bannerEntering}`}>
      <div className={styles.bannerGlow} />

      <div className={styles.bannerInner}>
        <div className={styles.left}>
          <div className={styles.iconRow}>
            <span className={styles.icon}>◈</span>
            <span className={styles.label}>Your privacy matters</span>
          </div>
          <p className={styles.text}>
            We collect personal information during onboarding. This data is used exclusively
            to build your personalised daily plan. We do not sell it or use it for
            advertising. By continuing, you agree to our{' '}
            <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
            {' '}and{' '}
            <Link href="/terms" className={styles.link}>Terms of Service</Link>.
          </p>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.btnAccept}
            onClick={() => dismiss('accepted')}
          >
            Accept and continue
          </button>
          <Link href="/privacy" className={styles.btnLearn}>
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}