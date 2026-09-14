'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import styles from './leaderboard.module.css'
// Rank ladder + getRank live in lib/rank.js (single source of truth, carries the
// full rationale). This file used to keep its own copy alongside the dashboard's.
import { getRank } from '@/lib/rank'

function getDaysSince(dateStr) {
  return Math.floor((new Date() - new Date(dateStr)) / 86400000)
}

function RankPip({ mmr }) {
  const rank = getRank(mmr)
  return (
    <span
      className={styles.rankPip}
      style={{ color: rank.color, background: rank.bg, borderColor: `${rank.color}40` }}
    >
      {rank.name}
    </span>
  )
}

export default function LeaderboardPage() {
  const [players,    setPlayers]    = useState([])
  const [myProfile,  setMyProfile]  = useState(null)
  const [myPosition, setMyPosition] = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [tab,        setTab]        = useState('all') 
  const router   = useRouter()
  const supabase = createClient()

  async function load() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const [boardRes, myRes] = await Promise.all([
        supabase.from('leaderboard_view').select(
          'id, display_name, current_mmr, streak_count, created_at'
        )
          .order('current_mmr', { ascending: false })
          .order('streak_count', { ascending: false })
          .order('created_at',   { ascending: true })
          .limit(100),
        supabase.from('profiles').select(
          'id, full_name, current_mmr, streak_count'
        ).eq('id', user.id).single(),
      ])

      if (boardRes.error) throw boardRes.error

      const board = boardRes.data || []
      setPlayers(board)
      setMyProfile(myRes.data)

      if (myRes.data) {
        const pos = board.findIndex((p) => p.id === user.id)
        setMyPosition(pos >= 0 ? pos + 1 : null)
      }
    } catch (err) {
      console.error('Leaderboard load error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Run once on mount. `load` only sets state after awaits and we intentionally
  // run mount-only, so these rules are false positives here.
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => { load() }, [])

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.loadingGlow} />
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading leaderboard...</p>
      </div>
    )
  }

  const top3  = players.slice(0, 3)
  const rest  = players.slice(3)
  const myRank = myProfile ? getRank(myProfile.current_mmr) : null

  // "Near me" tab — 3 above and 3 below current position
  const nearMe = myPosition
    ? players.slice(Math.max(0, myPosition - 4), myPosition + 3)
    : []

  // Gap to player above
  const playerAbove = myPosition && myPosition > 1 ? players[myPosition - 2] : null
  const gapAbove    = playerAbove
    ? playerAbove.current_mmr - (myProfile?.current_mmr || 0)
    : 0

  const PODIUM_ORDER = top3.length === 3
    ? [
        { player: top3[1], pos: 2, height: 72,  medal: '2' },
        { player: top3[0], pos: 1, height: 100, medal: '1' },
        { player: top3[2], pos: 3, height: 52,  medal: '3' },
      ]
    : top3.map((p, i) => ({
        player: p, pos: i + 1,
        height: 100 - i * 24, medal: String(i + 1),
      }))

  return (
    <div className={styles.page}>
      <div className={styles.pageBg} />
      <div className={styles.pageMesh} />

      <div className={styles.container}>

        {/* ── Page Header ── */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>Global Rankings</h1>
            <p className={styles.pageSub}>
              {players.length} players ranked by Real Life Rating
            </p>
          </div>
        </div>

        {/* ── My Position Banner ── */}
        {myProfile && myPosition && (
          <div className={`${styles.myBanner} ${myPosition <= 3 ? styles.myBannerTop : ''}`}>
            <div className={styles.myBannerGlow}
              style={{ background: `radial-gradient(circle, ${myRank?.color}18 0%, transparent 65%)` }}
            />
            <div className={styles.myBannerLeft}>
              <div className={styles.myPos}>#{myPosition}</div>
              <div className={styles.myInfo}>
                <span className={styles.myName}>{myProfile.full_name}</span>
                <div className={styles.myMeta}>
                  <RankPip mmr={myProfile.current_mmr ?? 0} />
                  <span className={styles.myMmr}>
                    {(myProfile.current_mmr ?? 0).toLocaleString()} Rating
                  </span>
                  {myProfile.streak_count > 0 && (
                    <span className={styles.myStreak}>
                      🔥 {myProfile.streak_count}d streak
                    </span>
                  )}
                </div>
              </div>
            </div>

            {playerAbove && gapAbove > 0 && (
              <div className={styles.myGap}>
                <span className={styles.myGapLabel}>to #{myPosition - 1}</span>
                <span className={styles.myGapValue}>+{gapAbove} Rating</span>
                <span className={styles.myGapTasks}>
                  ≈ {Math.ceil(gapAbove / 25)} tasks
                </span>
              </div>
            )}

            {myPosition === 1 && (
              <div className={styles.myFirst}>
                <span className={styles.myFirstIcon}>◈</span>
                <span className={styles.myFirstText}>Rank 1</span>
              </div>
            )}
          </div>
        )}

        {/* ── Podium ── */}
        {top3.length > 0 && (
          <div className={styles.podiumSection}>
            <p className={styles.podiumLabel}>Top Players</p>
            <div className={styles.podium}>
              {PODIUM_ORDER.map(({ player, pos, height, medal }) => {
                const rank = getRank(player.current_mmr)
                const isMe = myProfile?.id === player.id
                return (
                  <div key={player.id} className={styles.podiumCol}
                    style={{ animationDelay: `${pos * 0.08}s` }}>

                    {/* Card */}
                    <div
                      className={`${styles.podiumCard} ${isMe ? styles.podiumCardMe : ''} ${pos === 1 ? styles.podiumCardFirst : ''}`}
                      style={{ borderColor: pos === 1 ? `${rank.color}50` : undefined }}
                    >
                      {pos === 1 && (
                        <div className={styles.podiumCardGlow}
                          style={{ background: `radial-gradient(circle, ${rank.color}14 0%, transparent 65%)` }}
                        />
                      )}

                      <div className={styles.podiumMedalNum}
                        style={{ color: ['#f59e0b','#94a3b8','#b45309'][pos - 1] }}>
                        {medal}
                      </div>

                      <div className={styles.podiumAvatar}
                        style={{ background: rank.bg, borderColor: rank.color }}>
                        <span style={{ color: rank.color, fontSize: '0.9rem', fontWeight: 800 }}>
                          {player.display_name?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>

                      <div className={styles.podiumName}>
                        {player.display_name || 'Player'}
                        {isMe && <span className={styles.youTag}>you</span>}
                      </div>

                      <RankPip mmr={player.current_mmr} />

                      <div className={styles.podiumMmr}
                        style={{ color: pos === 1 ? rank.color : '#f1f5f9' }}>
                        {player.current_mmr.toLocaleString()}
                      </div>
                      <div className={styles.podiumMmrLabel}>Rating</div>

                      {player.streak_count > 0 && (
                        <div className={styles.podiumStreak}>
                          🔥 {player.streak_count}d
                        </div>
                      )}
                    </div>

                    {/* Podium block */}
                    <div
                      className={`${styles.podiumBlock} ${pos === 1 ? styles.podiumBlockFirst : ''}`}
                      style={{ height: `${height}px`, borderColor: pos === 1 ? `${rank.color}30` : undefined }}
                    >
                      <span className={styles.podiumBlockNum}
                        style={{ color: pos === 1 ? rank.color : '#1e293b' }}>
                        #{pos}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className={styles.podiumBase} />
          </div>
        )}

        {/* ── Tabs + List ── */}
        {rest.length > 0 && (
          <div className={styles.listSection}>

            <div className={styles.listHeader}>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${tab === 'all' ? styles.tabActive : ''}`}
                  onClick={() => setTab('all')}
                >All players</button>
                {myPosition && myPosition > 3 && (
                  <button
                    className={`${styles.tab} ${tab === 'near' ? styles.tabActive : ''}`}
                    onClick={() => setTab('near')}
                  >Near me</button>
                )}
              </div>
              <span className={styles.listCount}>
                {tab === 'near' ? nearMe.filter((p) => players.indexOf(p) >= 3).length : rest.length} players
              </span>
            </div>

            {/* Column headers */}
            <div className={styles.colHeaders}>
              <span>Rank</span>
              <span>Player</span>
              <span>Rating</span>
              <span>Streak</span>
              <span>Days</span>
            </div>

            {/* Rows */}
            <div className={styles.rowList}>
              {(tab === 'near' ? nearMe : rest).map((player, i) => {
                const globalPos = players.indexOf(player) + 1
                if (globalPos <= 3 && tab !== 'near') return null

                const rank  = getRank(player.current_mmr)
                const isMe  = myProfile?.id === player.id
                const prev  = players[globalPos - 2]
                const gap   = prev ? prev.current_mmr - player.current_mmr : 0
                const days  = getDaysSince(player.created_at)

                return (
                  <div
                    key={player.id}
                    className={`${styles.row} ${isMe ? styles.rowMe : ''}`}
                    style={{ animationDelay: `${Math.min(i, 15) * 0.03}s` }}
                  >
                    <div className={styles.rowPos}>
                      <span className={`${styles.rowPosNum} ${isMe ? styles.rowPosNumMe : ''}`}>
                        #{globalPos}
                      </span>
                    </div>

                    <div className={styles.rowPlayer}>
                      <div className={styles.rowAvatar}
                        style={{ background: rank.bg, borderColor: `${rank.color}60` }}>
                        <span style={{ color: rank.color, fontSize: '0.7rem', fontWeight: 800 }}>
                          {player.display_name?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className={styles.rowPlayerInfo}>
                        <span className={`${styles.rowName} ${isMe ? styles.rowNameMe : ''}`}>
                          {player.display_name || 'Player'}
                          {isMe && <span className={styles.youTag}>you</span>}
                        </span>
                        <RankPip mmr={player.current_mmr} />
                      </div>
                    </div>

                    <div className={styles.rowMmr}>
                      <span className={styles.rowMmrVal}>{player.current_mmr.toLocaleString()}</span>
                      {gap > 0 && (
                        <span className={styles.rowGap}>+{gap} to #{globalPos - 1}</span>
                      )}
                    </div>

                    <div className={styles.rowStreak}>
                      {player.streak_count > 0
                        ? <span className={styles.rowStreakVal}>🔥 {player.streak_count}d</span>
                        : <span className={styles.rowStreakNone}>—</span>
                      }
                    </div>

                    <div className={styles.rowDays}>{days}d</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Bottom motivator ── */}
        {myPosition && myPosition > 1 && playerAbove && (
          <div className={styles.motivator}>
            <div className={styles.motivatorGlow} />
            <div className={styles.motivatorInner}>
              <span className={styles.motivatorTag}>Your next target</span>
              <div className={styles.motivatorTarget}>
                <div className={styles.motivatorPlayer}>
                  <div className={styles.motivatorAvatar}
                    style={{
                      background: getRank(playerAbove.current_mmr).bg,
                      borderColor: `${getRank(playerAbove.current_mmr).color}60`,
                    }}>
                    <span style={{ color: getRank(playerAbove.current_mmr).color, fontSize: '0.8rem', fontWeight: 800 }}>
                      {playerAbove.display_name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className={styles.motivatorName}>{playerAbove.display_name || 'Player'}</span>
                    <div className={styles.motivatorMeta}>
                      <RankPip mmr={playerAbove.current_mmr} />
                      <span className={styles.motivatorPos}>#{myPosition - 1}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.motivatorStats}>
                  <div className={styles.motivatorStat}>
                    <span className={styles.motivatorStatVal}>{gapAbove}</span>
                    <span className={styles.motivatorStatLabel}>Rating gap</span>
                  </div>
                  <div className={styles.motivatorDivider} />
                  <div className={styles.motivatorStat}>
                    <span className={styles.motivatorStatVal}>{Math.ceil(gapAbove / 25)}</span>
                    <span className={styles.motivatorStatLabel}>tasks to close it</span>
                  </div>
                  <div className={styles.motivatorDivider} />
                  <div className={styles.motivatorStat}>
                    <span className={styles.motivatorStatVal}>{Math.ceil(gapAbove / 25)}</span>
                    <span className={styles.motivatorStatLabel}>photo proofs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {players.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>◈</span>
            <p className={styles.emptyText}>No players ranked yet. Be the first.</p>
          </div>
        )}

      </div>
    </div>
  )
}