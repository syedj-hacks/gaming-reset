'use client'

// ┌──────────────────────────────────────────────────────────────────────────┐
// │ SHELVED — NOTHING IMPORTS THIS FILE.                                     │
// │                                                                          │
// │ Discord is switched off across the product for now and may come back.    │
// │ The file is kept whole and simply disconnected rather than commented out  │
// │ line by line: an unimported module is not bundled, so none of this ships, │
// │ and a block comment around the whole component would be far harder to     │
// │ revive than uncommenting one import.                                      │
// │                                                                          │
// │ 'use client' stays on line 1 deliberately. Nothing imports this file, so  │
// │ the build cannot tell you if the directive stopped being the first        │
// │ statement — you would only find out on the day you switched it back on.   │
// │                                                                          │
// │ To bring it back: uncomment the import and the element in                │
// │ app/(app)/dashboard/page.js, restore discord_username to the profile      │
// │ select there, restore the implementation in /api/save-discord (which      │
// │ currently answers 410), and do the same on the mobile side.               │
// └──────────────────────────────────────────────────────────────────────────┘

import { useState } from 'react'
import styles from './DiscordBanner.module.css'
import { postJson } from '@/lib/http'

// Set NEXT_PUBLIC_DISCORD_INVITE_URL in Vercel once the server exists.
// Until then the banner collects usernames and shows "you're on the list".
const INVITE_URL = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || ''

// Mirrors the server-side rules in /api/save-discord so typos bounce
// instantly instead of after a round-trip.
const DISCORD_REGEX = /^[a-z0-9_.]{2,32}$/

const DISMISS_KEY = 'discordBannerDismissed'

function normalize(raw) {
  return raw.trim().toLowerCase().replace(/^@/, '')
}

function readDismissed() {
  try {
    return typeof window !== 'undefined' && localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

export default function DiscordBanner({ initialUsername }) {
  const [savedName, setSavedName] = useState(initialUsername || '')
  const [editing,   setEditing]   = useState(false)
  const [username,  setUsername]  = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [dismissed, setDismissed] = useState(readDismissed)

  const linked = !!savedName && !editing

  // Dismissal only hides the pitch — once linked, the compact card stays
  // so the server link is always one click away.
  if (dismissed && !savedName) return null

  function dismiss() {
    setDismissed(true)
    try { localStorage.setItem(DISMISS_KEY, '1') } catch {}
  }

  function startEdit() {
    setUsername(savedName)
    setError('')
    setEditing(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const clean = normalize(username)
    if (!clean) return

    if (!DISCORD_REGEX.test(clean)) {
      setError('2–32 characters: lowercase letters, numbers, underscores, periods.')
      return
    }
    if (clean === savedName) {
      // Nothing changed — just close the edit form.
      setEditing(false)
      return
    }

    setError('')
    setLoading(true)
    try {
      const res = await postJson('/api/save-discord', { discordUsername: clean })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not save. Try again.')
        return
      }

      setSavedName(data.discordUsername)
      setEditing(false)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Linked: compact card with the server link ──────────────
  if (linked) {
    return (
      <div className={styles.banner}>
        <div className={styles.bannerGlow} />
        <div className={styles.confirmedRow}>
          <div className={styles.discordIconWrap}>
            <DiscordIcon />
          </div>
          <div className={styles.confirmedText}>
            <span className={styles.confirmedLabel}>Discord linked</span>
            <span className={styles.confirmedName}>@{savedName}</span>
          </div>
          <div className={styles.linkedActions}>
            {INVITE_URL ? (
              <a
                className={styles.joinBtn}
                href={INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open server ↗
              </a>
            ) : (
              <span className={styles.inviteHint}>
                You&apos;re on the list. Invite coming soon.
              </span>
            )}
            <button type="button" className={styles.changeBtn} onClick={startEdit}>
              Change
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Pitch + username form (also reused for editing) ────────
  return (
    <div className={styles.banner}>
      <div className={styles.bannerGlow} />

      <div className={styles.bannerInner}>
        <div className={styles.bannerLeft}>
          <div className={styles.discordIconWrap}>
            <DiscordIcon />
          </div>
          <div className={styles.bannerText}>
            <div className={styles.bannerTitle}>
              {editing ? 'Update your username' : 'Join the server'}
              {!editing && <span className={styles.optionalTag}>optional</span>}
            </div>
            <p className={styles.bannerSub}>
              Daily wins, leaderboard updates, and a community of people doing
              the same thing as you.
            </p>
          </div>
        </div>

        <form className={styles.bannerForm} onSubmit={handleSubmit}>
          <div className={styles.inputWrap}>
            <span className={styles.atSign}>@</span>
            <input
              type="text"
              className={styles.input}
              placeholder="your_username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError('') }}
              disabled={loading}
              maxLength={32}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
            />
          </div>
          {error && <span className={styles.errorText}>{error}</span>}
          <div className={styles.formRow}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !normalize(username)}
            >
              {loading
                ? <span className={styles.spinner} />
                : editing ? 'Save' : INVITE_URL ? 'Join server →' : 'Get invite →'
              }
            </button>
            <button
              type="button"
              className={styles.dismissBtn}
              onClick={editing ? () => setEditing(false) : dismiss}
            >
              {editing ? 'Cancel' : 'Maybe later'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Inline Discord SVG — no external dependency needed
function DiscordIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.613 1.33C17.178 0.66 15.642 0.17 14.04 0C13.84 0.36 13.61 0.84 13.45 1.22C11.75 0.97 10.07 0.97 8.39 1.22C8.23 0.84 7.99 0.36 7.79 0C6.19 0.17 4.65 0.66 3.21 1.33C0.46 5.45 -0.28 9.46 0.09 13.41C2 14.82 3.85 15.68 5.67 16C6.13 15.36 6.54 14.68 6.89 13.96C6.19 13.7 5.52 13.38 4.89 13C5.05 12.88 5.2 12.75 5.35 12.63C8.76 14.24 12.48 14.24 15.85 12.63C16 12.76 16.16 12.88 16.31 13C15.68 13.38 15 13.7 14.31 13.96C14.66 14.68 15.07 15.36 15.53 16C17.35 15.68 19.21 14.82 21.11 13.41C21.55 8.83 20.35 4.86 18.613 1.33ZM7.35 10.98C6.33 10.98 5.49 10.04 5.49 8.89C5.49 7.74 6.31 6.8 7.35 6.8C8.39 6.8 9.23 7.74 9.21 8.89C9.21 10.04 8.38 10.98 7.35 10.98ZM14.85 10.98C13.83 10.98 12.99 10.04 12.99 8.89C12.99 7.74 13.81 6.8 14.85 6.8C15.89 6.8 16.73 7.74 16.71 8.89C16.71 10.04 15.89 10.98 14.85 10.98Z" fill="#5865F2"/>
    </svg>
  )
}
