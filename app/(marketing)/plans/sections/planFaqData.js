// Single source of truth for the Plans page FAQ.
// Imported by both PlanFaq.js (the visible accordion) and PlansSchema.js (the
// FAQPage JSON-LD). Google requires structured FAQ data to match the on page
// content exactly, so keeping one array guarantees they never drift apart.
export const PLAN_FAQ = [
  {
    q: 'How does the 3 day free trial work?',
    a: 'You get full access to the whole app for three days: your personalised plan, daily missions, tracking, and rank system. No card up front. If it’s not for you, walk away and you’re never charged.',
  },
  {
    q: 'Can I cancel any time?',
    a: 'Yes. Cancel any time from your billing page in one tap, with no email and no maze of questions. You keep access until the end of the period you already paid for, and you are never charged again.',
  },
  {
    q: 'What happens if I slip or miss days?',
    a: 'That’s expected. Slipping is part of the process, not proof you failed. The app resets your day and helps you pick the next mission, without the shame spiral.',
  },
  // The desktop app was sold nowhere on this page, which made it invisible at
  // exactly the moment someone is deciding whether the subscription is worth it.
  // It is the only part of the product that is present while the behaviour is
  // happening, so it belongs in the answer to "what am I paying for".
  {
    q: 'Is the Windows app included?',
    a: 'Yes, on every plan, at no extra cost. It signs in with the account you already have, sits quietly in your system tray, and steps in the moment a game launcher or a game opens, which is the moment that actually decides your evening. It also measures how long you play for you, so your daily hours stop depending on you remembering to log them. If you want it stricter, you can shut your launchers for a set number of hours, or set a daily limit that shuts them once you pass it. Windows 10 and 11.',
  },
  {
    q: 'Who sees my photos and progress?',
    a: 'Your photos are used only to verify your tasks inside the app so they count toward your rating. Each one is checked by our AI provider, and by a person on our team if the AI cannot confirm it. They are not posted to a feed or shown to other members, and the photo itself is deleted a week after upload once it has been checked.',
  },
]
