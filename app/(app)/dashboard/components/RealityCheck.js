'use client'

import { useState } from 'react'
import styles from './RealityCheck.module.css'

// Hard, memorable one-liners — pattern interrupts. The goal is that one of these
// lodges in the user's head and resurfaces on a loading screen, or the second
// before they launch "one more game". Short, sharp, no lecture.
//
// KEEP THESE PLAYABLE BY EVERYONE. The set used to assume competitive multiplayer
// (enemy team, GG, server, queue), which meant a single-player or casual mobile
// player, and the intake now has options for both, saw copy written for someone
// else in almost every draw. References to RANK and LADDER are deliberately kept:
// those point at this app's own Real Life Rating, which every user has whatever
// they play. What was cut is anything that assumes OTHER PLAYERS or multiplayer
// infrastructure. Keep this file in sync with the mobile app's
// components/RealityCheck.tsx.
const LINES = [
  // Universal
  'You can be Immortal rank and Bronze at your own life.',
  'The game forgets you the moment you close it. The years do not give themselves back.',
  'The game will never visit you in hospital.',
  'The game was built by adults to keep you playing. You were built for more.',
  'You will not remember tonight’s game next week. You’ll remember the year.',
  'Game over. Now what did you actually win?',
  'The grind is real. You’re just grinding the wrong account.',
  'Your real-life rank never resets at the end of a season. It compounds.',
  '10,000 hours of mastery, over a game you don’t even own.',
  'The high lasts an evening. The regret stays up all night.',
  'You’re not bad at life. You just gave your best hours to a screen.',
  '“One more game” is how five years quietly disappear.',
  'Rank up in the only ladder that follows you out of the room.',
  'Somewhere your potential is waiting for you to log off.',
  // Single player — story and completion framing, no opponents.
  'You finished the story. Yours is still unwritten.',
  'Nobody reaches the end of their life proud of their save file.',
  'You know every corner of that map. When did you last explore your own city?',
  // Casual and mobile — endless-level loops, the Candy Crush shape of the habit.
  'The levels never run out. That is the point. That is the trap.',
  'Five minutes on a puzzle became three hours. It always does.',
  'It was designed to feel like progress. Nothing actually moved.',
  // Environment design — make the next launch a decision, not a reflex.
  'Log out of every game account right now. Make the next launch a choice, not a reflex.',
  'Put the device you play on in another room tonight. Distance buys you back ten minutes of thinking.',
  'Delete the shortcut. If you have to go looking for the game, you have time to change your mind.',
  'Install a blocker on your peak hour today. Future you will not have to fight the urge alone.',
  'Mute every notification from the game. Silence the call before it comes.',
  'Make playing harder than not playing. Unplug it, log out, hide the controller.',
]

function randomIndex(exclude) {
  if (LINES.length < 2) return 0
  let i = exclude
  while (i === exclude) i = Math.floor(Math.random() * LINES.length)
  return i
}

export default function RealityCheck() {
  // Component is mounted client-only (ssr:false), so a random start is safe.
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * LINES.length))
  const [pulse, setPulse] = useState(0)

  function next() {
    setIdx((cur) => randomIndex(cur))
    setPulse((p) => p + 1)
  }

  return (
    <div className={styles.section}>
      <div className={styles.card} onClick={next} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next() } }}>
        <div className={styles.glow} />
        <span className={styles.label}>
          <span className={styles.labelDot} />
          Reality Check
        </span>
        <p key={pulse} className={styles.line}>{LINES[idx]}</p>
        <span className={styles.tapHint}>Tap for another →</span>
      </div>
    </div>
  )
}
