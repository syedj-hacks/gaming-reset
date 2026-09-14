'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './onboarding.module.css'

// Replacement for the native <select> used by the onboarding steps.
//
// WHY NOT A NATIVE SELECT: the browser owns its popup. It decides the direction,
// and with 17 life-situation options the list is tall enough that the field near
// the bottom of the viewport made it open UPWARD. Nothing in CSS or any select
// attribute changes that, and there is no way to say "show six then scroll"
// either — `size` turns it into an always-open list box instead of a dropdown.
//
// WHY A PORTAL: .card sets overflow:hidden (it clips .cardGlow, a 400px radial
// deliberately positioned outside the card bounds). A menu absolutely positioned
// inside the card would be cut off at the card's edge. Rendering into <body> with
// fixed coordinates from the trigger sidesteps that without touching the card's
// styling, which the glow still depends on.
//
// `options` is [{ value, label }]. `value` is what gets stored and validated
// server-side, so it must keep matching the VALID_* lists in generate-goals.

const MENU_GAP = 6
// Keep in sync with .ddMenu's max-height (16rem at the default root size).
const MENU_MAX = 256
// Below this there is not enough room to be worth opening downward.
const MENU_MIN = 150

// Reposition rather than close on scroll: the menu can outlive a small scroll
// nudge, and closing on any scroll feels broken on a trackpad.
//
// The menu also FLIPS UP when the space below the trigger cannot hold it. The
// two-column onboarding layout is a fixed-height, internally scrolled panel, so
// a field near the bottom of the panel has viewport edge just under it — and a
// `position: fixed` menu anchored to `top: r.bottom` would have run off-screen
// with no way to scroll to it. Returns either `top` or `bottom`, never both.
function useAnchor(triggerRef, open) {
  const [rect, setRect] = useState(null)

  useLayoutEffect(() => {
    if (!open) return
    const measure = () => {
      const r = triggerRef.current?.getBoundingClientRect()
      if (!r) return
      const below = window.innerHeight - r.bottom - MENU_GAP
      const above = r.top - MENU_GAP
      if (below < MENU_MIN && above > below) {
        setRect({
          bottom:    window.innerHeight - r.top + MENU_GAP,
          left:      r.left,
          width:     r.width,
          maxHeight: Math.min(MENU_MAX, above),
        })
      } else {
        setRect({
          top:       r.bottom + MENU_GAP,
          left:      r.left,
          width:     r.width,
          maxHeight: Math.min(MENU_MAX, below),
        })
      }
    }
    measure()
    window.addEventListener('scroll', measure, true) // capture: catches scrolling ancestors
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('resize', measure)
    }
  }, [open, triggerRef])

  return rect
}

export default function Dropdown({ value, onChange, options, placeholder, ariaLabel, invalid }) {
  const [open, setOpen] = useState(false)
  // Which row the keyboard is on. Separate from the selected value, so arrowing
  // through the list does not commit anything until Enter.
  const [active, setActive] = useState(-1)

  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const rect = useAnchor(triggerRef, open)

  const selectedIdx = options.findIndex((o) => o.value === value)
  const label = selectedIdx >= 0 ? options[selectedIdx].label : placeholder

  // Close on a click anywhere outside the trigger AND the menu. The menu lives
  // in a portal, so it is not a DOM descendant of the trigger and has to be
  // checked separately.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (triggerRef.current?.contains(e.target)) return
      if (menuRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [open])

  // Keep the keyboard row in view as it moves past the scroll edge.
  useEffect(() => {
    if (!open || active < 0) return
    menuRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  function openMenu() {
    setActive(selectedIdx >= 0 ? selectedIdx : 0)
    setOpen(true)
  }

  function choose(i) {
    onChange(options[i].value)
    setOpen(false)
    triggerRef.current?.focus()
  }

  function onKeyDown(e) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openMenu()
      }
      return
    }
    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
        break
      case 'Tab':
        // Let focus leave normally, just don't leave an orphaned menu behind.
        setOpen(false)
        break
      case 'ArrowDown':
        e.preventDefault()
        setActive((i) => Math.min(i + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActive((i) => Math.max(i - 1, 0))
        break
      case 'Home':
        e.preventDefault()
        setActive(0)
        break
      case 'End':
        e.preventDefault()
        setActive(options.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (active >= 0) choose(active)
        break
      default:
        break
    }
  }

  return (
    <div className={`${styles.selectWrap} ${open ? styles.selectWrapOpen : ''}`}>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.select} ${styles.ddTrigger} ${invalid ? styles.inputError : ''}`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        // No aria-invalid: the trigger's implicit role is `button`, which does
        // not support it. The error line rendered next to the field carries
        // role="alert", so the message is announced either way.
        aria-label={ariaLabel}
      >
        <span className={selectedIdx >= 0 ? undefined : styles.ddPlaceholder}>{label}</span>
      </button>

      {open && rect && createPortal(
        <div
          ref={menuRef}
          className={styles.ddMenu}
          role="listbox"
          aria-label={ariaLabel}
          style={{
            ...(rect.top != null ? { top: rect.top } : { bottom: rect.bottom }),
            left: rect.left,
            width: rect.width,
            maxHeight: rect.maxHeight,
          }}
          onKeyDown={onKeyDown}
        >
          {options.map((o, i) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={i === selectedIdx}
              className={[
                styles.ddOption,
                i === active ? styles.ddOptionActive : '',
                i === selectedIdx ? styles.ddOptionSelected : '',
              ].filter(Boolean).join(' ')}
              // mousedown would fire before the outside-click handler and race it.
              onClick={() => choose(i)}
              onMouseEnter={() => setActive(i)}
            >
              {o.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}
