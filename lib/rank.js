// ── Rank ladder — the single source of truth for the web app ──
//
// Tiers WIDEN as you climb, so the ladder lasts as long as the habit takes to
// form. The old evenly-spaced ladder topped out at 3000, which a consistent
// user (6 missions x 25 + the daily hours check-in ~ 175/day) cleared in under
// three weeks — the progression signal died at day 20, right when the habit
// still needed months and right when the user was deciding whether to keep
// paying. These widths put Elite at roughly day 63 for someone completing
// everything, and ~90 days at a realistic ~70% completion rate.
// Bronze is deliberately narrow so a strong first day still promotes.
//
// Rank is always DERIVED from profiles.current_mmr, never read from the stored
// profiles.current_rank column — that column is written once at onboarding as
// the STARTING rank and is never updated as MMR moves, so reading it shows a
// user's day-one rank forever. Derive here instead and it can never go stale.
//
// Moving these thresholds without rescaling current_mmr in the same deploy
// demotes every existing user at once. Any future change needs a migration that
// maps each old tier onto its new one, preserving both rank and position within
// it. KEEP IN SYNC with the mobile app's lib/rank.ts.
export const RANKS = [
  { name: 'Bronze',      min: 0,     max: 149,    color: '#cd7f32', bg: 'rgba(205,127,50,0.1)',   border: 'rgba(205,127,50,0.3)'   },
  { name: 'Silver',      min: 150,   max: 649,    color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  border: 'rgba(148,163,184,0.3)'  },
  { name: 'Gold',        min: 650,   max: 1499,   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.3)'   },
  { name: 'Platinum',    min: 1500,  max: 2799,   color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',    border: 'rgba(6,182,212,0.3)'    },
  { name: 'Diamond',     min: 2800,  max: 4649,   color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',   border: 'rgba(59,130,246,0.3)'   },
  { name: 'Master',      min: 4650,  max: 7149,   color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',   border: 'rgba(139,92,246,0.3)'   },
  { name: 'Grandmaster', min: 7150,  max: 10999,  color: '#ef4444', bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.3)'    },
  { name: 'Elite',       min: 11000, max: 999999, color: '#f97316', bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.4)'   },
]

// The rank a rating currently sits in. Anything below the floor (or a null/NaN
// mmr) falls back to Bronze rather than returning undefined.
export function getRank(mmr) {
  const n = Number(mmr) || 0
  return RANKS.find((r) => n >= r.min && n <= r.max) || RANKS[0]
}
