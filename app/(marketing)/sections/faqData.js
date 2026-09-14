// Single source of truth for the homepage FAQ.
// Imported by both FAQ.js (the visible accordion) and SeoSchema.js (the
// FAQPage JSON-LD). Google requires structured FAQ data to match the on-page
// content exactly — keeping one array guarantees they never drift apart.
export const HOME_FAQ = [
  {
    q: 'Is this just another productivity app?',
    a: 'No. This is built specifically for heavy competitive gaming habits. If productivity apps never worked for you before, it is because they were not designed for how competitive gamers think.',
  },
  {
    q: 'Do I have to quit gaming completely?',
    a: 'No. We never tell you to quit cold turkey. The system works by reducing one hour at a time. You log how many hours you played each day. Playing less than yesterday improves your rating and progress.',
  },
  // The objection this section was missing. Blockers are the obvious comparison
  // and our own articles keep recommending one, so a visitor arrives already
  // wondering.
  //
  // This answer used to open with a flat "No". That stopped being true the day
  // the desktop app shipped a block, and a promise the product breaks the moment
  // someone installs it is worse than no promise. The distinction it draws now
  // is the real one and the one worth selling: a blocker imposed on you by
  // default, versus a block you set for yourself while calm.
  //
  // Deliberately dateless on availability. "On your dashboard" is true whether
  // the card there is the download or the coming-soon state, so this line does
  // not need editing on the day the URL goes live.
  {
    q: 'Does it block my games?',
    a: 'Only if you tell it to, and never by default. A blocker that is imposed on you treats you as the enemy and turns recovery into a contest against your own password, which is a contest you eventually win. So the heart of Gaming Reset works on the decision instead. It learns the hour you usually start playing and gets in front of it with something better to do. Our Windows app goes further at the moment it matters: it notices your game launcher opening and steps in right then, while stopping is still easy. It also lets you shut your launchers yourself for a few hours, or set a daily limit that closes them once you pass the hours you chose. That is a promise you make to yourself while you are calm, not a rule we impose on you, and it stays off until you switch it on. You will find the app on your dashboard.',
  },
  {
    q: 'Is there a Windows app?',
    a: 'Yes, and it is included in your subscription at no extra cost. It signs in with the account you already have, runs quietly in the system tray, and notices the moment a game launcher or a game opens. It steps in right then, before the session has really started, and holds the play anyway button for a few seconds so the moment does not slip past unnoticed. It also measures how long you actually play without you logging a thing, which keeps your daily hours honest. If you want it stricter, you can shut your launchers for a set number of hours, or set a daily limit that shuts them for you once you pass it. It reads the names of running programs and nothing else: not your files, not your screen, not your keystrokes.',
  },
  {
    q: 'What happens during the free trial?',
    a: 'You get full access for 3 days. No credit card required to start. If it clicks for you, you subscribe. If it does not, you walk away having lost nothing.',
  },
  {
    q: 'How do photo tasks work?',
    a: 'For tasks that need proof, you snap a photo in the app. Every night our AI checks each photo against its task, and anything it cannot confirm goes to a person on our team. Approved photos count toward your rating within a day, and each photo can only be used once. It is one small feature that keeps your progress honest, alongside the automated tracking, daily missions, and rank system the app runs on.',
  },
  {
    q: 'What if my missions do not fit my life?',
    a: 'You can submit your own missions directly from your dashboard. Type in something you actually want to work on, submit it, and it goes for review. If it makes sense for your goals it gets added to your daily missions. The system is not rigid.',
  },
]
