'use client'

import { useEffect, useRef, useState } from 'react'
import styles from '../dashboard.module.css'

const TAB_LABELS = { anime: 'Anime', movies: 'Movies', series: 'Series' }

function PosterCard({ item }) {
  const [broken, setBroken] = useState(false)
  return (
    <a
      className={styles.watchItem}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.watchPoster}>
        {!broken ? (
          // Posters come from arbitrary third-party CDNs (Jikan/OMDb). next/image
          // hard-errors on non-allowlisted hosts; a plain <img> with onError lets
          // us degrade to the fallback gracefully instead of crashing the widget.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.watchPosterImg}
            src={item.image}
            alt={item.title}
            loading="lazy"
            onError={() => setBroken(true)}
          />
        ) : (
          <div className={styles.watchPosterFallback}>{item.title?.[0] || '?'}</div>
        )}
        {item.score && <span className={styles.watchScore}>★ {item.score}</span>}
        <span className={styles.watchType}>{item.type}</span>
      </div>
      <div className={styles.watchInfo}>
        <span className={styles.watchTitle}>{item.title}</span>
        <span className={styles.watchSub}>
          {[item.year, ...(item.genres || [])].filter(Boolean).join(' · ') || 'Highly rated'}
        </span>
      </div>
    </a>
  )
}

export default function WatchSection() {
  const [data, setData] = useState({ anime: [], movies: [], series: [] })
  const [tab, setTab] = useState('movies')
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const railRef = useRef(null)

  useEffect(() => {
    let alive = true
    fetch('/api/watch')
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return
        setData({ anime: d.anime || [], movies: d.movies || [], series: d.series || [] })
        setLoading(false)
      })
      .catch(() => {
        if (!alive) return
        setFailed(true)
        setLoading(false)
      })
    return () => { alive = false }
  }, [])

  // Only surface tabs that actually have content (Movies/Series need server keys).
  const tabs = ['movies', 'series', 'anime'].filter((t) => loading || data[t].length > 0)
  const activeTab = tabs.includes(tab) ? tab : tabs[0] || 'movies'
  const items = data[activeTab] || []

  function scrollRail(dir) {
    railRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  return (
    <div className={styles.section}>
      <div className={styles.watchHead}>
        <div>
          <div className={styles.sectionLabel}>Watch Instead of Gaming</div>
          <p className={styles.sectionSub}>When the urge hits, open one of these instead.</p>
        </div>
        <span className={styles.watchLive}>
          <span className={styles.watchLiveDot} />
          {activeTab === 'anime' ? 'Top rated' : 'Trending now'}
        </span>
      </div>

      <div className={styles.watchControls}>
        <div className={styles.watchTabs}>
          {(loading ? ['movies', 'series'] : tabs).map((t) => (
            <button
              key={t}
              className={`${styles.watchTab} ${activeTab === t ? styles.watchTabActive : ''}`}
              onClick={() => setTab(t)}
            >{TAB_LABELS[t]}</button>
          ))}
        </div>
        {!loading && items.length > 0 && (
          <div className={styles.watchArrows}>
            <button className={styles.watchArrow} onClick={() => scrollRail(-1)} aria-label="Scroll left">‹</button>
            <button className={styles.watchArrow} onClick={() => scrollRail(1)} aria-label="Scroll right">›</button>
          </div>
        )}
      </div>

      {loading ? (
        <div className={styles.watchRail}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`${styles.watchItem} ${styles.watchSkel}`}>
              <div className={styles.watchPoster} />
              <div className={styles.watchInfo}>
                <span className={styles.watchSkelLine} />
                <span className={`${styles.watchSkelLine} ${styles.watchSkelLineSm}`} />
              </div>
            </div>
          ))}
        </div>
      ) : failed || items.length === 0 ? (
        <p className={styles.watchEmpty}>
          Couldn&apos;t load recommendations right now. Try refreshing in a bit.
        </p>
      ) : (
        <div className={styles.watchRail} ref={railRef} key={activeTab}>
          {items.map((item) => (
            <PosterCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
