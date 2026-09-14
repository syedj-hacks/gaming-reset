// Where the user actually plays.
//
// ONE list, imported by every surface that needs it: the web intake renders it,
// /api/generate-goals validates against it, and the dashboard reads it to decide
// whether to offer the Windows app. VALID_LIFE_SITUATIONS and VALID_SESSION_SHAPES
// are each duplicated across three files with a comment begging future editors to
// keep them in sync; this one is a module so they cannot drift.
//
// THREE OPTIONS, NOT NINE. This started as a launcher-level list (Steam, Epic,
// Riot, Battle.net, other PC, PlayStation, Xbox, Switch, phone). That granularity
// only ever served one consumer — deciding whether the desktop watcher could see
// the user's games — and it cost every single person a nine-way decision at step
// 3 of 7. The AI prompt never needed it: a friction mission turns on whether the
// game lives behind a launcher, on a console, or on a phone, and never on which
// storefront sold it. So the question asks the three things that change an answer
// and the examples carry the rest.
//
// MULTI-SELECT ON PURPOSE: plenty of people play on a PC and on a console or a
// phone. Forcing one answer would make it wrong for them, and the whole point of
// the field is knowing which surfaces to design friction for.
//
// WHY SLUGS, NOT THE LABELS: every other intake answer stores the human string,
// which is why generate-goals warns that renaming an option orphans existing rows.
// A slug separates identity from display, so "Phone or tablet" can be reworded
// tomorrow without a migration. The labels are mapped back for the AI prompt,
// which wants the readable name.
export const PLATFORMS = [
  { value: 'pc',      label: 'PC',              note: 'Steam, Epic, Riot, Battle.net' },
  { value: 'console', label: 'Console',         note: 'PlayStation, Xbox, Switch' },
  { value: 'mobile',  label: 'Phone or tablet', note: 'iOS or Android' },
]

// Day one setup missions, one per platform the user actually plays on.
//
// WHY THESE ARE FIXED RATHER THAN WRITTEN BY THE AI. Day 1 is environment
// design: put distance between the user and the cue before any habit work
// begins. These have to land on day one for everyone, and every one of them has
// to be provable with a screenshot taken on the device they are already holding,
// which is not something a generated mission can be relied on to be.
//
// WHY THEY ARE KEYED BY PLATFORM. They used to be three hardcoded missions given
// to every user regardless of what they play, and two of the three were simply
// wrong for most people. "Unsubscribe from the gaming channels you watch most"
// assumes a YouTube habit plenty of players do not have, and "turn off every
// notification from the games you play" is a phone behaviour: PC games do not
// push OS notifications when they are closed. A mission a user cannot honestly
// complete on their first day teaches them that lying to this app is normal.
//
// APPEARING OFFLINE IS THE STRONGEST ONE, and not for the obvious reason. It
// does not remove a notification, it removes the INVITE. The friends are the
// reason most people queue, which our own League and Valorant articles say at
// length, and an invite is a decision made on your behalf.
//
// NEVER NAME A SPECIFIC LAUNCHER HERE. The intake only knows pc/console/mobile,
// never Steam or Battle.net, so "your game launcher" is the most specific this
// can honestly be. Naming Steam is dead copy for a Battle.net player and for
// anyone running a game with no launcher at all. This is the same mistake the
// old missions made with "Windows startup via Task Manager".
//
// Keyed off PLATFORMS above so adding a platform without giving it a day-one
// mission is a visible hole rather than a silently empty first day.
export const DAY_ONE_SETUP = {
  pc: 'Set yourself to appear offline on your game launcher, then screenshot it',
  console: 'Set your console profile to appear offline, then screenshot it',
  mobile: 'Turn off notifications for the games you play, then screenshot the settings screen',
}

const BY_VALUE = new Map(PLATFORMS.map((p) => [p.value, p]))

export const PLATFORM_VALUES = PLATFORMS.map((p) => p.value)

// Launcher-level slugs written by the first version of this question, mapped
// forward so those answers survive the simplification instead of silently
// reading as "never asked". Only accounts onboarded between the two deploys can
// hold these; the map can go once none remain.
//
// A Map, not an object literal. This is looked up with a user-supplied string,
// and `{}['constructor']` or `{}['__proto__']` returns an inherited value that
// is truthy, so a plain object would let those through the translate step. The
// whitelist filter below happens to drop them anyway, but a sanitiser must not
// depend on a later stage to cover an earlier one. Map has no such inheritance.
const LEGACY_SLUGS = new Map([
  ['steam', 'pc'], ['epic', 'pc'], ['riot', 'pc'],
  ['battlenet', 'pc'], ['pc-other', 'pc'],
  ['playstation', 'console'], ['xbox', 'console'], ['switch', 'console'],
])

// Nothing honest ever posts more entries than there are options, even counting
// legacy slugs. The body is already size-limited by the platform and the route
// is authed and rate-limited, so this is not the last line of defence — it just
// keeps an absurd array from being walked at all.
const MAX_INPUT = 32

// Keep only known slugs, translate retired ones, drop duplicates, and preserve
// the display order above so the stored array reads the same for everyone.
// Anything that is not an array of strings collapses to [] rather than throwing:
// the mobile intake posts no gaming_platforms at all, and an answer that predates
// this question must still be able to complete onboarding.
//
// The return value is built by filtering PLATFORM_VALUES, never by passing input
// through. That is what makes this a whitelist: whatever arrives, the output can
// only ever be a subset of the options declared above, in that order.
export function sanitisePlatforms(raw) {
  if (!Array.isArray(raw)) return []
  const wanted = new Set(
    raw
      .slice(0, MAX_INPUT)
      .filter((v) => typeof v === 'string')
      .map((v) => LEGACY_SLUGS.get(v) ?? v)
  )
  return PLATFORM_VALUES.filter((v) => wanted.has(v))
}

// Readable names for the AI prompt. Unknown slugs are already gone by the time
// this runs, but it stays defensive because it also renders stored rows, and a
// slug retired in a later release would otherwise print as "undefined".
export function platformLabels(list) {
  return sanitisePlatforms(list).map((v) => BY_VALUE.get(v).label)
}

// Whether to offer the Windows desktop app.
//
// TRUE FOR PC. The watcher covers Steam and Riot today and keeps widening, which
// is most PC players and very nearly all of the ones with a problem. The old
// nine-option list could exclude an Epic-only or Battle.net-only player from this
// card; three cannot, so a small number of PC players will now see an app that
// cannot yet watch their launcher. That is a dismissable card against a nine-way
// question every user had to answer, and it shrinks every time the watcher grows.
//
// ALSO TRUE FOR UNKNOWN. Every account created before this question existed has
// no platforms recorded, and that is most of the user base right now. Silence
// would hide the app from exactly the people already using the product. A
// console-only player who sees it can dismiss it, and it stays dismissed.
export function offersDesktopApp(list) {
  const clean = sanitisePlatforms(list)
  if (clean.length === 0) return true
  return clean.includes('pc')
}
