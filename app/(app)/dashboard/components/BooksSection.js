'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from '../dashboard.module.css'

function BookCard({ item, onOpen }) {
  const [broken, setBroken] = useState(false)
  return (
    <button className={styles.bookItem} onClick={() => onOpen(item)} type="button">
      <div className={styles.bookCover}>
        {!broken && item.image ? (
          // Covers come from Google's books CDN. A plain <img> with onError lets
          // us fall back gracefully instead of breaking the rail.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.bookCoverImg}
            src={item.image}
            alt={item.title}
            loading="lazy"
            onError={() => setBroken(true)}
          />
        ) : (
          <div className={styles.bookCoverFallback}>{item.title?.[0] || '?'}</div>
        )}
        {item.rating && <span className={styles.bookRating}>★ {item.rating}</span>}
      </div>
      <div className={styles.watchInfo}>
        <span className={styles.watchTitle}>{item.title}</span>
        <span className={styles.watchSub}>{item.authors || 'Unknown author'}</span>
      </div>
    </button>
  )
}

function BookSheet({ item, onClose }) {
  // Close on Escape; lock background scroll while the sheet is open.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!item || typeof document === 'undefined') return null
  const meta = [item.year, ...(item.categories || [])].filter(Boolean).join(' · ')

  // Render at the document root so the overlay escapes the dashboard section's
  // `overflow: hidden` / positioned context and is fixed to the viewport — it
  // opens centered on screen wherever you scrolled, and a click anywhere on the
  // backdrop closes it.
  return createPortal(
    <div className={styles.bookBackdrop} onClick={onClose}>
      <div
        className={styles.bookSheet}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
      >
        <button className={styles.bookSheetClose} onClick={onClose} aria-label="Close">×</button>
        <div className={styles.bookSheetTop}>
          {item.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className={styles.bookSheetCover} src={item.image} alt={item.title} />
          )}
          <div className={styles.bookSheetHead}>
            <h3 className={styles.bookSheetTitle}>{item.title}</h3>
            <p className={styles.bookSheetAuthor}>{item.authors || 'Unknown author'}</p>
            <div className={styles.bookSheetMetaRow}>
              {item.rating && (
                <span className={styles.bookSheetRating}>
                  ★ {item.rating}
                  {item.ratingsCount ? <span className={styles.bookSheetCount}> ({item.ratingsCount})</span> : null}
                </span>
              )}
              {meta && <span className={styles.bookSheetMeta}>{meta}</span>}
            </div>
          </div>
        </div>
        <p className={styles.bookSheetDesc}>{item.description}</p>
      </div>
    </div>,
    document.body
  )
}

export default function BooksSection() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [active, setActive] = useState(null)
  const railRef = useRef(null)

  useEffect(() => {
    let alive = true
    fetch('/api/books')
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return
        setBooks(d.books || [])
        setLoading(false)
      })
      .catch(() => {
        if (!alive) return
        setFailed(true)
        setLoading(false)
      })
    return () => { alive = false }
  }, [])

  // Hide the section if there's no key / nothing came back — same graceful
  // degrade as the other live sections.
  if (!loading && (failed || books.length === 0)) return null

  function scrollRail(dir) {
    railRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  return (
    <div className={styles.section}>
      <div className={styles.watchHead}>
        <div>
          <div className={styles.sectionLabel}>Read Instead of Gaming</div>
          <p className={styles.sectionSub}>Get lost in a story instead of booting up a game.</p>
        </div>
        <span className={styles.watchLive}>
          <span className={styles.watchLiveDot} />
          Fresh picks
        </span>
      </div>

      {!loading && books.length > 0 && (
        <div className={styles.watchControls}>
          <span className={styles.railHint}>Tap a cover to see what it&apos;s about</span>
          <div className={styles.watchArrows}>
            <button className={styles.watchArrow} onClick={() => scrollRail(-1)} aria-label="Scroll left">‹</button>
            <button className={styles.watchArrow} onClick={() => scrollRail(1)} aria-label="Scroll right">›</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.watchRail}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`${styles.bookItem} ${styles.watchSkel}`}>
              <div className={styles.bookCover} />
              <div className={styles.watchInfo}>
                <span className={styles.watchSkelLine} />
                <span className={`${styles.watchSkelLine} ${styles.watchSkelLineSm}`} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.watchRail} ref={railRef}>
          {books.map((item) => (
            <BookCard key={item.id} item={item} onOpen={setActive} />
          ))}
        </div>
      )}

      {active && <BookSheet item={active} onClose={() => setActive(null)} />}
    </div>
  )
}
