// The onboarding intake: what is asked, on which screen, and what counts as a
// valid answer.
//
// WHY THIS IS NOT IN page.js. page.js is a client component full of JSX, which
// the test runner cannot load (there is no JSX transform in `npm test`). Keeping
// the question table and the validation rules in a plain module makes them
// testable, and steps.test.mjs uses that to enforce the two invariants that
// actually matter when this flow is regrouped:
//
//   1. every field the intake sends to /api/generate-goals is still asked, and
//      is owned by exactly one step
//   2. every answer the server can reject maps back to a step that exists
//
// Both were previously kept true by hand and by comment. (2) has been broken
// before: hardcoded step numbers survived a step being deleted and sent a
// rejected answer to a screen that no longer existed.

// Option lists for the two dropdowns. `value` is what gets stored, so these must
// keep matching VALID_SESSION_SHAPES / VALID_LIFE_SITUATIONS in the
// generate-goals route (it 400s anything else) and the mobile app's own lists.
// steps.test.mjs reads the route and fails if any value here is not in it.
export const SESSION_SHAPES = [
  { value: 'Long sessions, mostly evenings or nights', label: 'Long sessions, mostly evenings or nights' },
  { value: 'Long sessions at random times',            label: 'Long sessions, but at random times' },
  { value: 'Short bursts through the whole day',       label: 'Short bursts through the whole day' },
  { value: 'A mix of both',                            label: 'A mix of both' },
]

// Grouped study → work → home → not working.
export const LIFE_SITUATIONS = [
  'High school student',
  'High school dropout',
  'University or college student',
  'University dropout',
  'Apprentice or in trade training',
  'Studying and working',
  'Working a full-time job',
  'Working part-time',
  'Working night shifts',
  'Running my own business',
  'Freelancer or self-employed',
  'Stay-at-home parent or homemaker',
  'Caring for a family member full-time',
  'Unemployed and looking for work',
  'Unemployed and not looking',
  'Unable to work right now',
  'Retired',
].map((v) => ({ value: v, label: v }))

// The two free-text answers drive the whole AI plan, so we gate them on
// word count + quality — NOT character count (which "aaaa aaaa..." passes).
// The server (/api/validate-intake) enforces its own floor of 10/20; these are
// the client-side minimums and may be STRICTER, never looser, or the user would
// clear this step only to be bounced back by the server gate. Kept in step with
// the mobile app's onboarding screen.
export const MIN_WORDS_REPLACEMENT = 15
export const MIN_WORDS_TYPICAL_DAY = 20

// ─────────────────────────────────────────────────────────────────────────────
// THE STEP TABLE. One source of truth for the flow: the order, the copy, the
// left-rail labels, AND which answers live on which screen.
//
// Every question the intake has ever asked is still here — this GROUPS them, it
// does not drop any. The seven screens this replaced asked the same ten
// questions one or two at a time; related answers now share a screen, so the
// funnel is five screens instead of seven.
//
// `fields` is load-bearing, not documentation: FIELD_STEPS below is derived from
// it, and the test asserts it against the payload the API is actually sent.
// ─────────────────────────────────────────────────────────────────────────────
export const STEPS = [
  {
    name:   'Profile',
    rail:   'Who you are',
    title:  'First, a little about you.',
    sub:    'Every reset starts somewhere. Let’s make this one yours.',
    aside:  'Nothing here is public. Your name is only ever used inside your own plan.',
    fields: ['full_name', 'age'],
  },
  {
    name:   'Your gaming',
    rail:   'How you play',
    title:  'Let’s understand your gaming.',
    sub:    'No judgement, no perfect number. Tell us what a normal day looks like.',
    aside:  'Your hours set the daily target. The shape of your sessions decides when missions land.',
    fields: ['hours_daily', 'session_shape', 'gaming_platforms'],
  },
  {
    name:   'Your world',
    rail:   'Who and what',
    title:  'There’s a whole life around it.',
    sub:    'Your people and your commitments help us make a plan that fits.',
    aside:  'If friends call you at a set time, we put something real in the 15 minutes before it.',
    fields: ['plays_with_friends', 'friend_call_time', 'life_situation'],
  },
  {
    name:   'Your direction',
    rail:   'What you want',
    title:  'What would you make room for?',
    sub:    'Think about something you’ve been meaning to do. Big or small, it counts.',
    aside:  'Dopamine replacement, not removal. We need something real to point you at.',
    fields: ['replacement_activity'],
  },
  {
    name:   'Your day',
    rail:   'Your routine',
    title:  'Let’s find your everyday rhythm.',
    sub:    'One last piece of the picture, then we’ll put your plan together.',
    aside:  'Last one. Then we set your rank, your quest, and your first day.',
    fields: ['typical_day'],
  },
]

export const TOTAL_STEPS = STEPS.length

// Which step owns each answer the server can reject, so a rejection sends the
// user to the question they need to fix rather than stranding them on the final
// screen. Keys are the `field` values /api/generate-goals and /api/validate-intake
// return alongside their error message.
//
// DERIVED, never written by hand — see the note at the top of this file.
export const FIELD_STEPS = Object.fromEntries(
  STEPS.flatMap((s, i) => s.fields.map((f) => [f, i + 1]))
)

// Whole-answer junk (exact match after trim). Mirrors the server.
const JUNK_RE =
  /^(idk|i\s*don'?t\s*know|no\s*idea|none|n\/?a|nothing|no|nope|nil|null|test+|asdf+|-+|\.+|\?+)$/i

export function wordCount(text) {
  const t = (text || '').trim()
  return t ? t.split(/\s+/).length : 0
}

// Cheap, language-agnostic low-effort check (Layer 2). The server re-runs this
// plus an AI semantic check, so this is purely instant UX feedback.
export function lowEffort(text, minWords) {
  const t = (text || '').trim()
  if (!t) return true
  if (JUNK_RE.test(t)) return true
  const words = t.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length < minWords) return true
  if (new Set(words).size / words.length < 0.5) return true // repetition padding
  return false
}

// Every rule the old one-question-per-screen flow enforced, unchanged, but keyed
// by FIELD instead of by step — because a screen now holds up to three answers,
// and "Continue is greyed out" is not an acceptable explanation of which of the
// three is wrong.
//
// Returns {} when the step is complete, so "can proceed" is just "no keys".
// Insertion order matters: the first key is the field the page focuses.
export function stepErrors(step, a, consent) {
  const e = {}

  switch (step) {
    case 1: {
      if (a.full_name.trim().length < 2) {
        e.full_name = 'Enter the name you want us to use (two characters or more).'
      }
      const age = parseInt(a.age)
      if (a.age === '') e.age = 'Enter your age.'
      else if (isNaN(age) || age < 13 || age > 80) {
        e.age = 'Gaming Reset is for ages 13 to 80. Enter your real age.'
      }
      break
    }

    case 2: {
      // 2–15 hrs is accepted, anything else blocks. Checked most-severe first
      // (over 24 → over 15 → under 2), same as the old step 2. The server
      // re-checks the same range.
      const daily = parseInt(a.hours_daily)
      if (a.hours_daily === '') e.hours_daily = 'Enter how many hours you game on a normal day.'
      else if (isNaN(daily)) e.hours_daily = 'Enter a whole number of hours.'
      else if (daily > 24) e.hours_daily = 'That is more hours than exist in a day. Enter your real number.'
      else if (daily > 15) e.hours_daily = 'Nobody plays this much in a day. This only works if you are honest.'
      else if (daily < 2) e.hours_daily = 'Hours must be at least 2. Enter your honest number.'

      // How the gaming happens decides the whole mission strategy server-side,
      // so it is required, not optional.
      if (!a.session_shape) e.session_shape = 'Pick how your gaming usually happens.'

      // At least one platform. The server accepts an empty list (older clients
      // never send the field at all), but here it is a single tap and the answer
      // decides which surface their friction missions are aimed at, so an
      // optional question this far into the funnel would just get skipped.
      if (a.gaming_platforms.length === 0) e.gaming_platforms = 'Pick at least one place you play.'
      break
    }

    case 3: {
      if (a.plays_with_friends === null) e.plays_with_friends = 'Pick one so we know whether friends are part of this.'
      // friend_call_time is deliberately absent: it is optional, and only shown
      // at all when plays_with_friends is true.
      if (!a.life_situation) e.life_situation = 'Pick the option that fits you best.'
      break
    }

    case 4: {
      if (lowEffort(a.replacement_activity, MIN_WORDS_REPLACEMENT)) {
        e.replacement_activity = `Add a bit more detail — at least ${MIN_WORDS_REPLACEMENT} words about what you would actually do.`
      }
      break
    }

    case 5: {
      if (lowEffort(a.typical_day, MIN_WORDS_TYPICAL_DAY)) {
        e.typical_day = `Walk us through the real day in at least ${MIN_WORDS_TYPICAL_DAY} words: wake-up, gaming, sleep.`
      }
      if (!consent) e.consent = 'Please tick the consent box so we can build your plan.'
      break
    }

    default: break
  }

  return e
}
