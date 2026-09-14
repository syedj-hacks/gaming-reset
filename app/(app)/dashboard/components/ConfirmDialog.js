'use client'

import { useEffect } from 'react'
import styles from '../dashboard.module.css'

// On-theme confirm/alert dialog — the web counterpart of the mobile app's
// ConfirmDialog (the one behind the logout prompt). Replaces bare window.alert /
// silent console.error so dashboard prompts match the dark-glass look.
//
// Renders nothing when closed. Backdrop click and Escape both cancel; the card
// swallows clicks so they don't bubble to the backdrop. `cancelLabel` is
// optional — omit it for a single-button info popup.
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Got it',
  cancelLabel,
  destructive = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onCancel?.() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className={styles.dialogBackdrop} onClick={onCancel}>
      <div
        className={styles.dialogCard}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.dialogTitle}>{title}</h2>
        {message && <p className={styles.dialogMessage}>{message}</p>}
        <div className={styles.dialogActions}>
          {cancelLabel && (
            <button type="button" className={styles.dialogCancel} onClick={onCancel}>
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            className={`${styles.dialogConfirm} ${destructive ? styles.dialogConfirmDanger : ''}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
