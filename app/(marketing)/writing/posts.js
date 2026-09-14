// Single source of truth for the /writing blog.
//
// Every post lives here. Published posts (`status: 'published'`) get a real
// /writing/[slug] page, a clickable card, an entry in sitemap.xml, and
// BlogPosting structured data. Drafts (`status: 'draft'`) render as
// "Coming soon" cards only — no route, no link, no sitemap entry — so we never
// ship an empty, indexable page (which would hurt SEO, not help it).
//
// To publish a new article: add `body` blocks and flip `status` to 'published'.
// Swap this file for a CMS/MDX source later without touching the page or sitemap.

export const SITE_URL = 'https://gamingreset.com'
export const DEFAULT_OG_IMAGE = '/og-image.png'

// Named author for the blog. This is the real founder, not a persona: the byline
// was previously a fabricated name, which is a liability on a site that takes
// payment and gives behavioural advice. Every claim below is true and checkable.
//
// The hour counts are rounded DOWN from the real Steam figures on purpose. They
// only ever go up, so a rounded-down number cannot become false later, and being
// caught inflating the one number a reader can verify would cost more than the
// number is worth.
//
// The bio stays deliberately non-clinical: this is self-improvement writing about
// habits and game design, not health, medical, or clinical content.
export const AUTHOR = {
  name: 'Saad',
  slug: 'saad',
  role: 'Founder of Gaming Reset',
  bio: 'Saad is the founder of Gaming Reset. He put more than 4,500 hours into Dota 2 and Counter-Strike before he got it under control. He still plays occasionally, and writes about the loops that make games hard to put down and what it took to stop losing his evenings to them.',
  longBio: [
    'Saad is the founder of Gaming Reset. He started playing seriously at 19 and put over 3,100 hours into Dota 2 and more than 1,300 into Counter-Strike, alongside everything else. It took time out of his education first, then out of his working life: home from the job, straight into a game to unwind, and that was the whole evening, most evenings, for years.',
    'He writes here about what he actually did about it. Uninstalling was the first thing he tried, more than once, and the games were always back within a few weeks. What eventually worked was structure rather than willpower, and Gaming Reset is the version of that he wishes had existed at the time.',
    'He still plays now and then. The point was never zero hours, it was getting the rest of his life back off the shelf.',
    'Nothing here is professional advice. The goal is plainer than that: honest, practical writing for people who already know they play too much and want a way out that does not lean entirely on willpower. When gaming is tangled up with something heavier, talk to someone you trust.',
  ],
}

// Canonical URL for the author profile page.
export function authorUrl() {
  return `${SITE_URL}/writing/author/${AUTHOR.slug}`
}

// Body block model — a small, safe subset of content types the article renderer
// understands. No raw HTML, so there's no dangerouslySetInnerHTML for body copy.
//   { type: 'lede',   text | segments }     → intro paragraph (larger)
//   { type: 'p',      text | segments }     → paragraph
//   { type: 'h2',     text }                → section heading
//   { type: 'h3',     text }                → sub-heading
//   { type: 'ul',     items: [] }           → bulleted list
//   { type: 'ol',     items: [] }           → numbered list
//   { type: 'quote',  text, cite? }         → pull quote
//   { type: 'figure', src, alt, caption?, width, height, eager? } → image
//
// `segments` lets a paragraph carry inline links without raw HTML: an array of
// plain strings and { text, href } link objects.
//
// `faq` (post-level, optional) renders an accessible FAQ section AND emits
// FAQPage structured data, which is eligible for rich results in search.
//
// `navLabel` is a short version of the title for tight spaces, currently the
// sitewide footer. Full titles run to 60 characters and wrap badly in a footer
// column. The footer builds its list from getPublishedPosts(), so every new post
// needs one; without it the footer falls back to the full title.

export const POSTS = [
  {
    slug: 'why-dota-is-engineered-to-keep-you-hooked',
    navLabel: 'Why Dota Is Hard to Quit',
    status: 'published',
    featured: false,
    category: 'Habits',
    title:
      'Why Dota 2 Is Engineered to Make You Feel Like Quitting Is Impossible',
    seoTitle: 'Why Dota 2 Feels Impossible to Quit (And How to Break Free)',
    description:
      'Quitting Dota feels harder than starting for a reason. Learn the four mechanics engineered to keep you hooked, and what actually breaks the loop.',
    excerpt:
      'It is not a coincidence that stopping feels harder than starting. The game is built around variable reward loops, social obligation, and identity attachment. Here is exactly how it works, and why understanding it is the first step to breaking free.',
    author: 'Saad',
    publishedAt: '2026-05-12',
    updatedAt: '2026-07-31',
    dateLabel: 'May 2026',
    readTime: '7 min read',
    body: [
      {
        type: 'figure',
        src: '/writing/dota-reward-loop.svg',
        alt: 'Diagram of the Dota reward loop: play one more game, get an uncertain result, feel the pull, chase the unmet urge, and repeat.',
        caption: 'The variable reward loop: every match leaves the reward unresolved, and that is what fuels "one more".',
        width: 1200,
        height: 630,
        eager: true,
      },
      {
        type: 'lede',
        text: 'You have probably told yourself "just one more game" more times than you can count. You meant it every time. So why does closing the client feel like fighting gravity? The honest answer is uncomfortable: it\'s not a willpower problem. The game is doing exactly what it was designed to do, and you are responding exactly the way anyone would respond to that design.',
      },
      {
        type: 'p',
        text: 'Understanding the machine does not instantly free you from it. But you cannot dismantle something you cannot see. So let us look at the four mechanisms that make Dota 2, and games built like it, feel impossible to walk away from.',
      },
      {
        type: 'p',
        text: 'This is not a personal failing. Studios employ whole teams whose job is to make their game as hard to put down as possible, and they are very good at it. The pull you feel is engineered, not invented by you.',
      },
      {
        type: 'h2',
        text: '1. The variable reward loop',
      },
      {
        type: 'p',
        text: 'Slot machines and Dota share a core mechanic: unpredictable rewards. If every match gave you the same, predictable outcome, you would get bored and log off. Instead, you never quite know what the next game holds: a smurf who ruins it, a comeback that feels heroic, a teammate who flames you, a perfect team fight. That uncertainty is the point.',
      },
      {
        type: 'p',
        text: 'You feel the strongest pull not when you win, but in anticipation of a reward that might come. Unpredictable rewards drive far more of that anticipation than reliable ones. So the "one more game" urge is strongest right after a loss, because you are chasing the win you did not get. The loop is self-refueling.',
      },
      {
        type: 'quote',
        text: "The urge to play one more is not a sign you enjoyed the last one. It's a sign the last one left the reward unresolved.",
      },
      {
        type: 'p',
        text: 'That is not just a nice line, it is close to how the underlying system actually works. Decades of research from Kent Berridge and Terry Robinson at the University of Michigan draw a hard line between wanting and liking. Wanting, the pull toward a reward, is a large, robust system triggered hardest by cues. Liking, the actual pleasure you get when the reward arrives, runs on smaller, more fragile machinery entirely.',
      },
      {
        type: 'p',
        segments: [
          'The two can come apart completely. You can want something intensely and enjoy it very little, which is the single best description of a 2am Dota session most people will ever read. If you have ever finished a night of gaming feeling worse than when you started, and queued again anyway, you were not being irrational. You were feeling wanting without liking, exactly as the system is built to produce it. That split is also the reason ',
          {
            text: 'games stop being fun long before you stop playing them',
            href: '/writing/why-video-games-are-not-fun-anymore',
          },
          '.',
        ],
      },
      {
        type: 'h2',
        text: '2. Sunk cost, built into your account',
      },
      {
        type: 'p',
        text: 'Every hour you have played is stored and displayed back to you. Your MMR, your behavior score, your hero mastery, your rare items, your rank at the end of the season. The game quietly turns time into a possession, and people do not walk away from possessions.',
      },
      {
        type: 'p',
        segments: [
          'This is the sunk cost fallacy wearing a progress bar. "I have put thousands of hours in, I can\'t stop now" feels like logic. It is not. Hal Arkes and Catherine Blumer named this effect in ',
          {
            text: 'a 1985 paper in Organizational Behavior and Human Decision Processes',
            href: 'https://www.sciencedirect.com/science/article/abs/pii/0749597885900494',
          },
          ', running experiment after experiment showing the same thing: once people have sunk money or effort into something, they keep going even when carrying on is clearly the worse choice. Not because they are bad at maths, but because abandoning it means admitting the investment was wasted.',
        ],
      },
      {
        type: 'p',
        text: 'Dota did not invent that bias. It just built an interface for it. The hours are already gone whether you keep playing or not. The rank does not pay rent, repair a relationship, or move your life forward. But it is displayed to you like an asset, and quitting feels like throwing it away.',
      },
      {
        type: 'h2',
        text: '3. Social obligation: the queue that waits for you',
      },
      {
        type: 'p',
        text: 'Single-player games end. Dota does not, because your friends are online and the party invite is already blinking. Leaving is no longer a decision about a game. It is a decision to let people down. That reframing is deliberate and powerful.',
      },
      {
        type: 'ul',
        items: [
          'The stack needs a fifth, and you are the reliable one.',
          'Someone is mid-climb and you promised to duo.',
          'Logging off feels like abandoning the group mid-conversation.',
        ],
      },
      {
        type: 'p',
        text: 'None of these are really about Dota. They are about belonging, one of the strongest drives we have. The game borrows that drive and points it back at the queue. For a lot of people, the friendships inside the game are real, which makes this the hardest hook of all to name out loud.',
      },
      {
        type: 'p',
        segments: [
          'Some games formalise this hook instead of leaving it to chance. In an MMO the obligation is a calendar entry with nineteen other names on it, which is why ',
          { text: 'quitting World of Warcraft', href: '/writing/how-to-quit-world-of-warcraft' },
          ' turns out to be less about the game than about cancelling a set of appointments. The mechanism is the same one described here, just written down and given a start time.',
        ],
      },
      {
        type: 'h2',
        text: '4. Identity: when the game becomes who you are',
      },
      {
        type: 'p',
        text: 'The deepest hook is not on your screen. It is in how you describe yourself. Somewhere along the way, "I play Dota" quietly became "I am a Dota player." Your rank became a measure of you. Your hero pool became a personality. Quitting stops feeling like changing a habit and starts feeling like erasing a part of yourself.',
      },
      {
        type: 'p',
        text: 'This is why advice like "just uninstall it" bounces off. You are not only removing a program. You are being asked to become a different person, with no clear picture of who that person is yet. Of course you resist. Anyone would.',
      },
      {
        type: 'h2',
        text: 'Why willpower keeps losing',
      },
      {
        type: 'p',
        text: 'Now stack them: an unpredictable reward that spikes hardest after a loss, a stored record of your invested time, a social group that expects you online, and an identity built around the game. That is four systems pulling in the same direction, engineered by people whose job is to maximize the time you spend playing.',
      },
      {
        type: 'figure',
        src: '/writing/four-hooks.svg',
        alt: 'The four hooks that keep players in Dota: variable reward, sunk cost, social obligation, and identity.',
        caption: 'Four systems, all pulling in the same direction at once.',
        width: 1040,
        height: 560,
      },
      {
        type: 'p',
        text: 'Against all of that, willpower is a single, exhaustible resource. Trying to out-willpower a system built by a team of designers is like trying to empty a bathtub with a spoon while the tap runs full. You are not weak. You are outnumbered.',
      },
      {
        type: 'p',
        segments: [
          'There is a deeper reason willpower is the wrong tool, though. The USC psychologist Wendy Wood has spent her career measuring how much of daily life is actually decided in the moment, and the answer is: much less than we assume. Her diary studies found that ',
          {
            text: 'roughly 43 percent of what people do each day',
            href: 'https://dornsife.usc.edu/wendy-wood/wp-content/uploads/sites/183/2023/10/Wood.Quinn_.Kashy_.2002_Habits_in_everyday_life.pdf',
          },
          ' is repeated in the same context, usually while they are thinking about something else entirely.',
        ],
      },
      {
        type: 'p',
        text: 'That is the part people miss. Opening the client after work is not a decision you are losing an argument about. Most nights it is not a decision at all. It is a cue firing in a familiar place at a familiar time, and your reasoning arrives afterwards to explain what you were already doing. Willpower is aimed at a choice point that, on most evenings, never actually happens.',
      },
      {
        type: 'h2',
        text: 'What actually works',
      },
      {
        type: 'p',
        text: 'If willpower is the wrong tool, what is the right one? Changing the environment and the loop, not just white-knuckling the urge. A few principles that hold up:',
      },
      {
        type: 'ol',
        items: [
          'Break the loop, not the willpower. Add friction between you and the client: log out fully, remove it from the launch bar, make starting a game a five-step decision instead of one click.',
          'Replace the reward, do not just remove it. The loop leaves a hole. Fill the evening with something that also gives feedback and progress: training, a project, anything that moves a needle you can see.',
          'Rebuild identity on purpose. Decide who you are becoming and give it a name before you quit, so stopping is a step toward something, not just a loss.',
          'Make progress visible. The social pull that keeps you in the queue can work in reverse when your streak, rating, and daily step are tracked somewhere you actually see them.',
        ],
      },
      {
        type: 'p',
        segments: [
          'These principles are general on purpose, because the same machine runs in every competitive game. If you want to see them made concrete for one specific title, we walked through the revenge queue and the reinstall trap in a ',
          {
            text: 'step by step guide to quitting Valorant',
            href: '/writing/how-to-quit-valorant',
          },
          ', the endless ranked ladder in ',
          {
            text: 'how to quit League of Legends',
            href: '/writing/how-to-quit-league-of-legends',
          },
          ', the case economy and inventory that make ',
          {
            text: 'quitting CS2 a three-part problem',
            href: '/writing/how-to-quit-cs2',
          },
          ', and the packs and annual wipe behind ',
          {
            text: 'quitting EA FC and Ultimate Team',
            href: '/writing/how-to-quit-ea-fc-ultimate-team',
          },
          '.',
        ],
      },
      {
        type: 'p',
        text: 'That last point is what Gaming Reset is built to do. You answer questions about your own habit, it turns those answers into one small step a day, and it keeps a record you can actually see. It does not make the four hooks go away. It means you are no longer the only thing standing against them.',
      },
      {
        type: 'p',
        text: "None of this means Dota is a bad game, or that the years you gave it were wasted. It's a genuinely brilliant piece of design, and that is precisely the problem: brilliant design is hard to leave. The people who built these systems were not careless about it. They were extremely good at their jobs.",
      },
      {
        type: 'p',
        text: "So stop asking why you can't just stop. You already have the answer, and it was never about your character. The better question is the one the machine is built to keep you from asking: if the next thousand hours went the same way as the last thousand, would that be a life you'd choose on purpose?",
      },
    ],
    faq: [
      {
        q: 'Why is Dota 2 so hard to quit?',
        a: 'Because it stacks four reinforcing systems at once: variable rewards that spike hardest after a loss, the sunk cost of your stored hours and MMR, the social pull of friends waiting in the queue, and an identity built around being a player. Willpower alone is fighting all four at the same time.',
      },
      {
        q: 'Is it normal to find a game this hard to put down?',
        a: 'Yes. Competitive games are deliberately designed to be hard to stop playing, by teams whose job is to maximise your time in them. Finding it hard to walk away is the design working as intended, not a flaw in you.',
      },
      {
        q: 'Does willpower work for cutting back on gaming?',
        a: 'On its own, rarely. Willpower is a single, exhaustible resource, and it is up against a system built by professional designers. What works better is changing your environment and breaking the reward loop, so stopping does not depend on willpower you have already spent.',
      },
      {
        q: 'How do I actually stop playing Dota?',
        a: 'Add friction so starting a game is a five-step decision instead of one click, replace the reward with something that also gives visible progress, rebuild your identity around who you want to become, and track your daily step somewhere you actually see it.',
      },
    ],
  },

  {
    slug: 'how-many-hours-of-gaming-is-too-much',
    navLabel: 'How Much Gaming Is Too Much?',
    status: 'published',
    featured: false,
    category: 'Habits',
    title: 'How Many Hours of Gaming Is Too Much? An Honest Answer',
    seoTitle: 'How Many Hours of Gaming Is Too Much? An Honest Answer',
    description:
      'How many hours of gaming is too much? The answer is less about a number and more about impact. Here is a better test than the clock.',
    excerpt:
      'Two hours? Four? The honest answer is that the number matters less than what the hours are costing you. Here is a simpler test than counting hours.',
    author: 'Saad',
    publishedAt: '2026-07-11',
    updatedAt: '2026-07-24',
    dateLabel: 'Jul 2026',
    readTime: '7 min read',
    body: [
      {
        type: 'figure',
        src: '/writing/gaming-hours-question.svg',
        alt: 'How many hours of gaming is too much? It is not the number, it is the cost to your sleep, work, relationships, and mood.',
        caption: 'The number everyone asks about turns out to be the wrong question.',
        width: 1200,
        height: 630,
        eager: true,
      },
      {
        type: 'lede',
        text: "You counted your hours this week, the total was higher than you wanted it to be, and now you're here looking for a line in the sand. A number that tells you whether you're fine or whether you have a problem. It's a fair question, and you deserve a real answer instead of a comforting one. So here it is: the number matters far less than almost everyone thinks.",
      },
      {
        type: 'p',
        text: 'You have probably seen "two hours a day" thrown around as the limit. It is a tidy figure, and it is close to useless on its own. Two hours can be a problem for one person and a non-issue for another, and pretending a single number fits everyone does you a disservice when you are actually trying to work out where you stand. So let us do this properly.',
      },
      {
        type: 'h2',
        text: 'The short answer: there is no magic number',
      },
      {
        type: 'p',
        text: 'Two people can play the same four hours and be in completely different situations: one is unwinding after a good day, the other is hiding from one. Same number on the clock, opposite meaning. That is why a flat hour limit falls apart the moment you apply it to a real life.',
      },
      {
        type: 'p',
        text: 'A student gaming five hours on a free weekend is not the same as someone gaming five hours by skipping work and sleep to do it. The clock cannot tell those two apart. You can.',
      },
      {
        type: 'p',
        text: 'It is worth knowing that the researchers who study this most closely have pointedly refused to name a number. The criteria they actually use contain no hour threshold at all. Instead they describe three things: impaired control over your gaming, gaming taking increasing priority over other interests and daily activities, and continuing or escalating despite clear negative consequences.',
      },
      {
        type: 'p',
        text: 'Read those again, because none of them is a quantity. They are all about control, priority, and consequences. That pattern also has to hold for a long stretch, typically around a year, before anyone treats it as anything more than a rough patch, and only a small minority of people who play games are affected at all. So if the people with the most reason to answer your question with a number refuse to, that should tell you something about the question.',
      },
      {
        type: 'h2',
        text: 'What actually matters more than the total',
      },
      {
        type: 'p',
        text: 'None of this means hours are irrelevant, and we will get to the extreme end in a moment. But the thing that consistently separates healthy play from harmful play is not the total, it is displacement: what the hours are pushing out of your life. When gaming starts eating your sleep, your movement, your work, and the people around you, the harm shows up regardless of whether you hit some magic threshold.',
      },
      {
        type: 'p',
        segments: [
          'Which is why when you play tells you more than how long. Three hours on a Saturday afternoon costs you an afternoon. Three hours starting at 11pm costs you an afternoon and the next day, because it comes directly out of your sleep and you pay for it until Tuesday. Identical totals, completely different bills. If the late session is the one you can never get out of, that has a mechanism of its own, which we went through in ',
          {
            text: 'how to stop playing video games at night',
            href: '/writing/how-to-stop-playing-video-games-at-night',
          },
          '.',
        ],
      },
      {
        type: 'p',
        segments: [
          'This is the most measurable cost of the lot. In a survey of 963 gamers presented at a 2016 sleep research conference, players ',
          {
            text: 'delayed their bedtime on 36 percent of the nights they played',
            href: 'https://www.sciencedaily.com/releases/2016/06/160613144656.htm',
          },
          ', and when they did, the average delay was 101 minutes. More than two thirds said gaming had cost them sleep. Nobody in that survey set out to lose an hour and forty minutes of their night. It just went, one match at a time.',
        ],
      },
      {
        type: 'p',
        text: "There's a second question hiding in there too: what are the hours for? Playing because you want to and playing because you'd rather not sit with your own evening are two different activities that happen to look identical from outside. Only one of them is really a hobby.",
      },
      {
        type: 'p',
        segments: [
          'That distinction turns out to carry real weight. A study of roughly 4,300 recreational and esports players tested which motivations actually predict gaming getting out of hand, and found that ',
          {
            text: 'escapism was the standout predictor in both groups',
            href: 'https://www.sciencedaily.com/releases/2019/10/191022121123.htm',
          },
          '. Competition, fantasy, and skill development showed weak or even negative associations. In other words, playing to win or to get good is not the risky motive. Playing to be somewhere else is.',
        ],
      },
      {
        type: 'p',
        text: 'That is a genuinely useful thing to know about yourself, and it costs nothing to check. Think about the last few times you loaded up a game. Were you moving toward something you wanted, or away from something you did not want to deal with? Nobody else can see the difference. You always can.',
      },
      {
        type: 'quote',
        text: "The question is not how many hours you play. It's whether you could stop if your life needed you to.",
      },
      {
        type: 'h2',
        text: 'A better test than counting hours',
      },
      {
        type: 'p',
        text: 'So put the stopwatch down for a second and ask these instead. They tell you far more than a weekly total ever could.',
      },
      {
        type: 'ol',
        items: [
          'Have you tried to cut back and failed? Not "meant to", but actually decided on a limit and then blown past it. One slip is nothing. A pattern of broken limits is the clearest signal on this list.',
          'Does gaming come before sleep and people? Look at what gets sacrificed when there is a conflict. If the answer is consistently your sleep, or someone who wanted your time, gaming is not competing for the leftover hours any more. It is taking them first.',
          'Do you keep playing when you can see it is hurting you? Missed deadlines, a tired week, an argument you keep having. Knowing the cost and playing anyway is different from not noticing the cost.',
          'How do you feel on a night you cannot play? Mild disappointment is normal. Genuine restlessness, irritability, or a hollow evening you do not know how to fill is worth paying attention to.',
          'Do you round the number down when someone asks? Shading the truth about how long you played usually means part of you already knows the real figure is a problem.',
          'Is the rest of your life getting smaller? The hobbies, the friends outside the game, the plans you used to make. Gaming rarely announces that it is taking over. It just quietly becomes the only thing left on the calendar.',
        ],
      },
      {
        type: 'figure',
        src: '/writing/signs-gaming-too-much.svg',
        alt: 'Six signs gaming has crossed the line: you cannot cut back, gaming comes before sleep and people, you keep playing despite harm, you feel restless when you cannot play, you hide how much you play, and the rest of your life is shrinking.',
        caption: 'A few of these landing is a louder signal than any hour count.',
        width: 1040,
        height: 680,
      },
      {
        type: 'p',
        segments: [
          'If several of those hit home, the issue was never really the raw hours. It is that gaming has more control over your time than you want it to, and that is a genuinely hard thing to admit. It is also engineered to be that way, which is a big part of ',
          {
            text: 'why quitting feels so much harder than it should',
            href: '/writing/why-dota-is-engineered-to-keep-you-hooked',
          },
          '.',
        ],
      },
      {
        type: 'h2',
        text: 'Hours still matter at the extremes',
      },
      {
        type: 'p',
        text: 'To be honest in the other direction too: past a certain point, the number does start to matter on its own, because time is finite. If gaming is taking six, eight, ten hours of your day, it is mathematically eating the hours you would otherwise spend sleeping, earning, moving, or connecting with people. At that level you already know it is costing you. Eight hours a day simply does not leave enough room for a life.',
      },
      {
        type: 'h2',
        text: 'So what do you actually do about it?',
      },
      {
        type: 'p',
        text: 'If reading this left you a little uneasy, that discomfort is useful information, not something to argue away. Here is what actually helps you get a clear answer, in order.',
      },
      {
        type: 'ol',
        items: [
          'Track one honest week. Not to judge yourself, just to see the real number instead of the one you assume. Almost everyone undercounts, often badly, and the gap itself is worth seeing.',
          'Look at what it is displacing, not just the total. Ask where the hours are coming from. If they are coming out of sleep, work, and the people you care about, that tells you more than the total ever will.',
          'Try a short, full break. A single clean week off tells you more than any hour count. If you find you genuinely cannot do it, that is your answer, and it is a far more useful one than a number.',
        ],
      },
      {
        type: 'p',
        segments: [
          'That last step is where most people get stuck, because stopping is not a willpower problem, it is a design problem. If one game in particular is the one you cannot put down, we wrote a ',
          {
            text: 'step by step guide to taking a real break from it',
            href: '/writing/how-to-quit-valorant',
          },
          ' that works with how the habit actually operates.',
        ],
      },
      {
        type: 'p',
        text: 'Step one is the part almost everyone means to do and never quite does, which is roughly what Gaming Reset automates. It keeps the count for you instead of asking you to remember it, and turns what it finds into one small step a day. You end up with the honest number and something to do about it, rather than just the number.',
      },
      {
        type: 'p',
        text: "The number was never really the point. The question worth answering is simpler, and harder: is gaming adding to your life right now, or quietly replacing it? If you already know the answer, you didn't need the stopwatch to tell you.",
      },
    ],
    faq: [
      {
        q: 'How many hours of gaming per day is healthy?',
        a: 'There is no single healthy number that fits everyone, and notably the researchers who study this refuse to name an hour threshold at all. The criteria they use are about impaired control, gaming taking priority over other activities, and continuing despite negative consequences. The better test is impact: gaming is generally fine as long as it does not crowd out sleep, work, movement, and relationships.',
      },
      {
        q: 'Is 4 hours of gaming a day too much?',
        a: 'It depends entirely on what those four hours are displacing. Four hours on a day off with everything else handled is very different from four hours that eat into your sleep and responsibilities. Ask what the hours are costing you, not just how many there are.',
      },
      {
        q: 'Is gaming 8 hours a day bad?',
        a: 'At that level the number itself starts to matter, because time is finite. Eight hours a day leaves very little room for sleep, work, and relationships, so it is very likely costing you things you care about.',
      },
      {
        q: 'How do I know if I game too much?',
        a: 'The clearest signal is not hours, it is control. Have you tried to cut back and failed, do you keep playing despite clear downsides, and does gaming come before sleep, work, and people? Those markers matter far more than a weekly total.',
      },
    ],
  },

  {
    slug: 'what-to-do-instead-of-gaming',
    navLabel: 'What to Do Instead of Gaming',
    status: 'published',
    featured: false,
    category: 'Habits',
    title: 'What to Do Instead of Gaming (When Nothing Else Sounds Fun)',
    seoTitle: 'What to Do Instead of Gaming: A Method, Not a Hobby List',
    description:
      'Every list of hobbies to replace gaming misses the point. Work out which need the game was meeting, then match the replacement to it. Here is how.',
    excerpt:
      'You have read the lists. Running, reading, learning guitar. None of it sounds remotely appealing, and that is not because you are broken. It is because a hobby list is the wrong tool. Here is the question to ask first.',
    author: 'Saad',
    publishedAt: '2026-07-20',
    updatedAt: '2026-07-24',
    dateLabel: 'Jul 2026',
    readTime: '9 min read',
    body: [
      {
        type: 'figure',
        src: '/writing/replace-the-need.svg',
        alt: 'Match the replacement to the need the game was meeting: competence gave you a rank that moved, autonomy gave you hours that were yours, relatedness gave you a team who noticed when you did not show up.',
        caption: 'The useful question is not which hobby. It is which need.',
        width: 1040,
        height: 560,
        eager: true,
      },
      {
        type: 'lede',
        text: "You've read the lists. Take up running. Learn guitar. Read more. Try painting. And every single suggestion lands with the same dull thud, because none of it sounds remotely like something you want to do on a Tuesday night. So you conclude that you're the problem, that gaming broke your ability to enjoy things. That is not what happened.",
      },
      {
        type: 'p',
        text: 'The hobby lists fail for a structural reason: they are answering the wrong question. They tell you what other people enjoy. They never ask what the game was actually doing for you, which is the only thing that determines whether a replacement has a chance of sticking.',
      },
      {
        type: 'h2',
        text: 'Why hobby lists do not work',
      },
      {
        type: 'p',
        text: 'A game is not one activity. It is a bundle of several things delivered at once, reliably, on demand, with no travel and no scheduling. Competitive gaming hands you measurable progress, social contact, total control over your own time, and a difficulty level tuned to sit just past your current ability. Very few things in ordinary life bundle all of that together, which is why swapping in one generic hobby feels so thin by comparison.',
      },
      {
        type: 'p',
        text: 'When someone tells you to take up reading, they are offering you one thread from a rope. Of course it feels inadequate. It is inadequate, at least as a straight swap, and noticing that is a sign your judgement is working rather than a sign you are past saving.',
      },
      {
        type: 'h2',
        text: 'What games are actually giving you',
      },
      {
        type: 'p',
        segments: [
          'The most useful research here has nothing to do with quitting at all. In 2006, Richard Ryan, Scott Rigby and Andrew Przybylski published ',
          {
            text: 'four studies on why games are motivating at all',
            href: 'https://link.springer.com/article/10.1007/s11031-006-9051-8',
          },
          ', using self-determination theory. They found that games hold people through three basic psychological needs, and that satisfying those needs predicted both enjoyment and how much players kept playing.',
        ],
      },
      {
        type: 'p',
        text: 'The three are competence, the feeling of getting better at something difficult; autonomy, the feeling that your choices are genuinely your own; and relatedness, the feeling of being connected to other people. Notably, the same research linked need satisfaction to higher vitality, self-esteem and positive mood. Games were not making people worse. They were meeting real needs, efficiently, which is precisely why they are hard to give up.',
      },
      {
        type: 'quote',
        text: 'The game was not a waste of time. It was doing a job. Fire it without a replacement and the job does not disappear, it just goes unfilled.',
      },
      {
        type: 'p',
        text: 'This reframes the whole problem. You are not looking for something fun. You are looking for something that fills whichever of those three the game was carrying hardest for you. And they are not equally weighted for everyone, which is exactly why one person quits into the gym and thrives while another tries the same thing and is back on ranked within a fortnight.',
      },
      {
        type: 'h2',
        text: 'Work out which need you are actually replacing',
      },
      {
        type: 'p',
        text: 'Think about your last few months of playing, and be honest about which of these hits hardest.',
      },
      {
        type: 'ol',
        items: [
          'Competence. The rank mattered. You watched replays, thought about improving, felt genuinely good when the number moved. If the game had no progression at all you would have played far less. What you are missing is the sense of getting measurably better at something hard.',
          'Autonomy. The appeal was that those hours were yours. No boss, no obligations, nobody needing anything. You often played after the most demanding parts of your day, and the point was less the game than that nobody could reach you inside it.',
          'Relatedness. You mostly played with the same people. Solo queue was tolerable at best. If the group stopped playing tomorrow you would probably stop too, because the game was mainly the venue where you saw your friends.',
        ],
      },
      {
        type: 'p',
        text: 'Most people find one dominant and one secondary. That pairing is your actual brief. It is also why generic advice misfires so badly: telling a relatedness player to take up solo running is asking them to replace their friends with cardio, and then blaming them when it does not take.',
      },
      {
        type: 'h2',
        text: 'Matching the replacement to the need',
      },
      {
        type: 'p',
        text: 'Once you know which need you are filling, the options narrow usefully.',
      },
      {
        type: 'p',
        text: 'If it is competence, you need something with a visible curve. Not a pleasant pastime, an actual measurable one: strength training, an instrument, a language, a craft where this month\'s work is plainly better than last month\'s. The critical feature is feedback you cannot argue with. Reading rarely works for competence players, because there is no scoreboard, which is also why it is the most commonly recommended and most commonly abandoned suggestion on every list.',
      },
      {
        type: 'p',
        text: 'If it is autonomy, the trap is replacing a game with an obligation. A rigid new schedule of self-improvement is not a substitute for the one part of your day nobody could claim. You need something genuinely chosen and genuinely yours, and it is allowed to be unproductive. Walking with no route, cooking something slowly, building something pointless. The need is unclaimed time, not achievement, and stacking achievements into it recreates the exact pressure you were escaping.',
      },
      {
        type: 'p',
        text: 'If it is relatedness, the replacement has to have people in it, and the evidence here is unusually direct. A controlled trial of 96 college students who were on their phones too much compared group basketball against a solo exercise practice. Both helped, but the group activity produced the larger drop in phone use and in loneliness. The researchers put it down to the social element rather than the exercise itself.',
      },
      {
        type: 'p',
        text: 'That was smartphone use rather than gaming, so hold it loosely. But it points the same way as common sense: a team sport, a class, a climbing gym, anything with a fixed time and other humans expecting you, will beat the solo equivalent for a relatedness player almost every time. The mechanism that kept you queuing, other people counting on you, is the same one that will keep you turning up.',
      },
      {
        type: 'p',
        segments: [
          'This matters most if your gaming came with a roster attached. Leaving a raid team frees two or three fixed evenings a week and removes the group you saw most reliably, both at once, which is why ',
          { text: 'quitting an MMO like World of Warcraft', href: '/writing/how-to-quit-world-of-warcraft' },
          ' fails so often when the plan is only subtraction. Put people into one of those evenings before it arrives empty.',
        ],
      },
      {
        type: 'h2',
        text: 'The one case where no hobby will fix it',
      },
      {
        type: 'p',
        segments: [
          'There is a fourth motive that does not belong on that list, because it is not a need any replacement can meet. When thousands of recreational and esports players were asked why they played, the answer that ',
          {
            text: 'tracked hardest with gaming getting out of hand was escape',
            href: 'https://www.sciencedaily.com/releases/2019/10/191022121123.htm',
          },
          '. Competing, immersion and chasing skill did not. Those either barely registered or pointed the other way entirely.',
        ],
      },
      {
        type: 'p',
        text: 'If you were playing mainly to be somewhere other than your own life, no hobby will hold. You will start the gym, or the guitar, or the course, and drop it in three weeks, and conclude that you lack discipline. What actually happened is that you swapped the escape hatch without touching what you were escaping. The new activity does not fail because it was the wrong hobby. It fails because it was never the problem being solved.',
      },
      {
        type: 'p',
        text: 'That is not a reason to skip the replacement. It is a reason to be honest that the replacement is the smaller half of the job, and that the other half is whatever you would rather not look at directly. Naming that to one person you trust does more than any activity on any list.',
      },
      {
        type: 'h2',
        text: 'How long before it stops feeling forced',
      },
      {
        type: 'p',
        segments: [
          'Expect it to feel like effort for a while, and do not read that as failure. Researchers at UCL tracked 96 people building a new daily habit and found the median time to reach near-automatic behaviour was ',
          {
            text: '66 days, with a range from 18 to 254',
            href: 'https://www.ucl.ac.uk/news/2009/aug/how-long-does-it-take-form-habit',
          },
          '. The twenty one day figure everyone repeats is not in the data.',
        ],
      },
      {
        type: 'p',
        text: 'The more useful finding from the same study is this: missing a single day did not measurably damage the habit forming process. One skipped session is not a failure and does not reset anything. Almost everyone who abandons a replacement does it on the back of one missed day plus the story they tell themselves about what that missed day proves.',
      },
      {
        type: 'p',
        text: 'So the comparison to avoid is the one your brain will keep offering: new hobby on day four versus gaming at year six. Of course the game wins, it has a six year head start on being good at holding you. The honest comparison is against the same activity a few months in, and you cannot make it until you get there.',
      },
      {
        type: 'h2',
        text: 'A realistic way to start',
      },
      {
        type: 'ol',
        items: [
          'Pick for the need, not the virtue. Run your shortlist against whichever need came out dominant. If a suggestion does not serve it, it does not matter how good it is for you, it will not survive contact with a bad Tuesday.',
          'Put it in the slot the game occupied. Same hours, same trigger point. The cue that used to launch the client needs somewhere to go, and an unscheduled intention loses to a familiar cue every time.',
          'Choose something with people in it if you can. It is the strongest single predictor of turning up, and it covers the friendships the game was quietly providing.',
          'Give it eight weeks before you judge it. That is roughly what the habit research suggests, and it is far longer than the three weeks most people allow before deciding they are just not a gym person.',
          'Expect boredom early and plan for it, not against it. The flatness in week one is normal and is not evidence you picked wrong. It is what the absence of a highly optimised reward loop feels like from the inside.',
        ],
      },
      {
        type: 'p',
        segments: [
          'If you have not stopped yet and are trying to work out whether you need to, the more useful question is what the hours are displacing, which we covered in ',
          {
            text: 'how many hours of gaming is too much',
            href: '/writing/how-many-hours-of-gaming-is-too-much',
          },
          '. And if you have just stopped and the evenings are the hard part, that is the expected shape rather than a bad sign, as we set out in ',
          {
            text: 'what happens when you stop playing video games',
            href: '/writing/what-happens-when-you-stop-playing-video-games',
          },
          '.',
        ],
      },
      {
        type: 'p',
        text: 'This is the part Gaming Reset was built for. The plan comes out of your own answers about what you played for and what you want back, not a list of activities that are good for people in general, and it holds the thread through the weeks where none of it has started to feel natural yet. That stretch is normal. It is also where nearly everyone gives up.',
      },
      {
        type: 'p',
        text: 'The question was never what to do instead of gaming. It was what gaming was doing for you, and where else that can honestly come from. Answer that and the list writes itself. Skip it and no list ever helps, no matter how many times you read one.',
      },
    ],
    faq: [
      {
        q: 'What should I do instead of gaming?',
        a: 'Start by identifying which need the game was meeting rather than picking from a hobby list. Research on games and self-determination theory points to three: competence (getting visibly better at something hard), autonomy (time that is genuinely your own), and relatedness (connection with other people). Match the replacement to whichever was dominant for you, because a replacement that serves the wrong need rarely survives more than a few weeks.',
      },
      {
        q: 'Why does nothing seem fun after quitting gaming?',
        a: 'Because a game bundles several rewards at once, on demand, tuned to your skill level, and almost nothing in ordinary life matches that bundle immediately. Comparing a new activity on day four with a game you have played for years is not a fair comparison, and the flatness in the first week or two is the expected result of removing a highly optimised reward loop rather than evidence that you chose wrong. It is worth knowing that the same flatness often shows up inside gaming itself, well before anyone stops.',
      },
      {
        q: 'What hobbies actually replace video games?',
        a: 'It depends on the need. For competence, something with visible progress works best: strength training, an instrument, a language, or a craft where improvement is measurable. For autonomy, something genuinely self-chosen and allowed to be unproductive. For relatedness, anything involving other people at a fixed time, such as a team sport or a class. Group activities tend to outperform solo ones.',
      },
      {
        q: 'How long until a new hobby feels natural?',
        a: 'Longer than most people expect. A UCL study tracking people forming new daily habits found a median of 66 days to reach near-automatic behaviour, with a range from 18 to 254 days. The popular 21 day figure is not supported by that data. The same study found that missing a single day did not measurably harm habit formation.',
      },
      {
        q: 'Why do I keep quitting new hobbies after a few weeks?',
        a: 'Two common reasons. The first is judging too early, since habits typically take a couple of months rather than a couple of weeks to feel automatic. The second is that the hobby is serving the wrong need. If you played mainly to escape something, the replacement will not hold, because it never touched the thing you were escaping. Research on gaming motives points the same way: escape is the motive most associated with gaming getting out of hand.',
      },
    ],
  },
  {
    slug: 'what-happens-when-you-stop-playing-video-games',
    navLabel: 'What Happens When You Stop',
    status: 'published',
    featured: true,
    category: 'Habits',
    title: 'What Happens When You Stop Playing Video Games: An Honest Timeline',
    // 56 chars. The previous "(Real Timeline)" version ran to 62 and truncated
    // in results, cutting the hook off mid-word.
    seoTitle: 'What Happens When You Stop Playing Video Games (Timeline)',
    description:
      'What actually happens when you stop gaming, day by day. What the research shows, what it does not, and why the dopamine detox story you have read is wrong.',
    excerpt:
      'Restlessness, boredom, and evenings you do not know what to do with. Here is what the research actually says about stopping, what nobody has measured yet, and why the dopamine detox version is wrong.',
    author: 'Saad',
    publishedAt: '2026-07-20',
    updatedAt: '2026-07-24',
    dateLabel: 'Jul 2026',
    readTime: '9 min read',
    body: [
      {
        type: 'figure',
        src: '/writing/quit-gaming-timeline.svg',
        alt: 'Craving intensity after you stop playing: cravings rise to a peak within the first few days, then fade noticeably across the following weeks.',
        caption: 'The shape people consistently describe. How precisely it holds up is a more interesting question than most articles admit.',
        width: 1040,
        height: 560,
        eager: true,
      },
      {
        type: 'lede',
        text: "You're thinking about stopping, and before you commit you want to know what you're actually in for. That is a reasonable thing to want, and it is weirdly hard to find an honest answer. Most of what is written about this is either a horror story designed to scare you straight, or a fantasy where you quit on Monday and wake up on Friday with a six pack and a business.",
      },
      {
        type: 'p',
        text: 'So here is the real version, built on what the research has actually established, with the parts nobody has properly measured labelled as such. It is less dramatic than the horror story and less magical than the fantasy, and it is a lot more useful than either.',
      },
      {
        type: 'h2',
        text: 'The first 48 hours: the urge shows up fast',
      },
      {
        type: 'p',
        text: 'The single most consistent finding is that the hard part arrives early. In a 2022 study, researchers followed 69 heavy players through a break from gaming and asked when the pull first showed up. Most who felt an urge to play felt it within the first day or two, and only around seven percent reported it first appearing after day three.',
      },
      {
        type: 'p',
        text: 'This is worth internalising before you start, because it inverts how most people brace themselves. You are not walking into something that builds slowly over weeks. You are walking into something that hits almost immediately and then has nowhere to go but down. Day two is not a preview of what is coming. Day two is close to the worst of it.',
      },
      {
        type: 'h2',
        text: 'What it actually feels like',
      },
      {
        type: 'p',
        text: 'It is far less exotic than people expect. Researchers reviewing 34 separate studies found the effects of stopping are most consistently just irritability and restlessness. Not tremors. Not anything cinematic. Mostly you are annoyed, twitchy, and unable to settle.',
      },
      {
        type: 'p',
        text: 'What people describe alongside that is a specific kind of boredom that has a physical quality to it. Evenings feel long in a way they did not before. You pick up your phone without deciding to. You open the folder where the game used to be. Nothing is exactly wrong, and nothing is interesting either, and that flatness is the thing most people find hardest to sit with.',
      },
      {
        type: 'quote',
        text: 'Nobody reinstalls because the cravings were unbearable. They reinstall because Tuesday evening was boring and they had nothing else to put in it.',
      },
      {
        type: 'h2',
        text: 'The dopamine detox story is wrong',
      },
      {
        type: 'p',
        text: 'Almost every article on this topic tells you the same thing: gaming floods your brain with dopamine, quitting leaves you in a dopamine deficit, and after a few weeks off your receptors reset and normal life feels good again. It is a tidy story. It is also not how any of this works, and believing it will actively mislead you about what you are experiencing.',
      },
      {
        type: 'p',
        text: 'The clearest correction comes from decades of work by Kent Berridge and Terry Robinson at the University of Michigan, who separated two things everyone else was treating as one: wanting and liking. They found that dopamine drives wanting, the pull toward a reward, especially when triggered by cues. It does not produce liking, the actual pleasure of the reward itself, which runs on entirely different and much smaller systems.',
      },
      {
        type: 'p',
        segments: [
          'Dopamine is not your happiness supply, so quitting does not drain a tank you then have to refill. What is actually happening is more specific and more manageable: you built a very strong wanting response to a very reliable set of cues. The chair, the time of day, the friend coming online, the end of a work session. Those cues are still firing, and the thing they point at is gone. The same split explains something you may have noticed well before you stopped, which is ',
          {
            text: 'why the games had stopped being fun while you kept playing anyway',
            href: '/writing/why-video-games-are-not-fun-anymore',
          },
          '.',
        ],
      },
      {
        type: 'p',
        text: 'This matters practically, not just pedantically. If you believe you are in a chemical deficit, the only thing to do is wait it out and hope your brain repairs itself on schedule. If you understand it as cues firing at a missing target, the job becomes obvious: change the cues, and give them something else to point at. One of those framings hands you something to do tonight. The other hands you a countdown.',
      },
      {
        type: 'h2',
        text: 'Week one: the hole where the evenings were',
      },
      {
        type: 'p',
        text: 'By the end of the first week the sharp edge usually dulls and a different problem takes over: time. Gaming was not only occupying your evenings, it was structuring them. It told you when the night started, what you were doing, and when it ended. Remove it and you do not get a tidy block of free time. You get several hours of unshaped nothing, every single night, which is far more disorienting than people expect.',
      },
      {
        type: 'p',
        text: 'This is the stretch where the reinstall happens, and it is almost never a dramatic collapse. It is a quiet Tuesday, a mild bad mood, and no particular reason not to. The people who get through it are rarely the ones with more resolve. They are the ones who decided in advance what the evenings were for.',
      },
      {
        type: 'h2',
        text: 'Weeks two to four: sleep first, then everything else',
      },
      {
        type: 'p',
        segments: [
          'The first clear improvement most people notice is sleep, and it is worth seeing the size of what was being taken. A 2016 survey of 963 gamers found that on more than a third of the nights they played, ',
          {
            text: 'they went to bed later than they had meant to',
            href: 'https://www.sciencedaily.com/releases/2016/06/160613144656.htm',
          },
          ', by an average of 101 minutes. Two thirds of them said gaming had cost them sleep outright.',
        ],
      },
      {
        type: 'p',
        segments: [
          'Stop, and that time comes back immediately, without any effort or virtue on your part. It is the one benefit that is close to automatic, and it is usually what people report first: not that they feel transformed, but that they are less tired, and that everything else is slightly easier from there. If the nights are the specific part you want back rather than gaming as a whole, that is a narrower problem with its own fix, set out in ',
          {
            text: 'how to stop playing video games at night',
            href: '/writing/how-to-stop-playing-video-games-at-night',
          },
          '.',
        ],
      },
      {
        type: 'p',
        text: 'What does not happen is a personality transplant. Somewhere in the second or third week a lot of people hit a quiet disappointment, because the hours came back and they turned out to be ordinary hours. Quitting removes a problem. It does not install a life. If you were unhappy before and gaming was covering it, you will now be unhappy with better sleep and more free time, which is genuinely a better position to solve it from, but it is not the same thing as being solved.',
      },
      {
        type: 'h2',
        text: 'What the research honestly does not know',
      },
      {
        type: 'p',
        text: 'Here is the part most articles on this subject leave out. The same review that pinned down irritability and restlessness also concluded that the evidence base here is very underdeveloped, and specifically that studies have not tracked how those effects progress or fade over time.',
      },
      {
        type: 'p',
        text: 'So when you read a confident day by day breakdown promising that day four is the peak and day fourteen is freedom, including the curve at the top of this page, understand what you are looking at. That is the shape people commonly describe, and it is a reasonable expectation. It is not something science has measured and confirmed. Anyone presenting it as established fact is telling you more about their content strategy than about your brain.',
      },
      {
        type: 'p',
        text: 'What does hold up across both the studies and the anecdotes is the direction: it starts hard, and it gets easier sooner than it feels like it will on day two.',
      },
      {
        type: 'h2',
        text: 'What actually predicts whether it sticks',
      },
      {
        type: 'p',
        segments: [
          'One thing tells you more about how your break will go than any timeline can, and it is not how many hours you were putting in. It is what you were playing for. Asked exactly that, thousands of recreational and esports players gave answers in which ',
          {
            text: 'a single motive lined up with gaming getting out of hand',
            href: 'https://www.sciencedaily.com/releases/2019/10/191022121123.htm',
          },
          ', and it was escape. Competing, immersion and improving were weak signals, and in places ran the other way.',
        ],
      },
      {
        type: 'p',
        text: 'Read that as a diagnostic. If you played mainly to compete or to get good at something, stopping is largely a scheduling problem, and it tends to go about as well as you would expect. If you played mainly to be somewhere other than your own life, then the game was doing a job, and removing it without addressing the job is why attempts fail and keep failing. The urge you feel on day nine is not really about the game. It is about whatever the game was covering.',
      },
      {
        type: 'p',
        text: 'Which points at the thing that actually determines the outcome:',
      },
      {
        type: 'ol',
        items: [
          'Decide what the evenings are for before you stop, not after. The empty time is the real difficulty, and it arrives on schedule whether you have a plan or not. Any specific plan beats a vague intention to do something better.',
          'Change the cues, not just the game. Same chair, same hours, same Discord open in the background is the environment that built the habit. Leaving it intact and relying on resolve is the most common way this fails.',
          'Replace visible progress with visible progress. Ranked gave you a number that moved. Something else needs to move: a log, a streak, a skill you can see improving. Nothing formal, just something that answers the question of whether today counted.',
          'Be honest about what the game was for. If it was escape, the break buys you room to deal with what you were escaping. It does not deal with it for you, and pretending otherwise is how month three goes wrong.',
        ],
      },
      {
        type: 'p',
        segments: [
          'If you are still working out whether you need a full break at all, the more useful question is not the raw total but what the hours are displacing, which we went through in ',
          {
            text: 'how many hours of gaming is too much',
            href: '/writing/how-many-hours-of-gaming-is-too-much',
          },
          '. And if one specific game is the one you keep coming back to, the mechanics matter, so it is worth reading ',
          {
            text: 'why competitive games are engineered to keep you hooked',
            href: '/writing/why-dota-is-engineered-to-keep-you-hooked',
          },
          ' before you try again.',
        ],
      },
      {
        type: 'h2',
        text: 'When it is more than a break',
      },
      {
        type: 'p',
        text: 'One thing worth keeping in proportion. Researchers who study this are clear that only a small proportion of people who play games ever reach the point where it is genuinely out of their control, and that the pattern has to hold for a long stretch, normally around a year, before it counts as anything more than an oversized habit.',
      },
      {
        type: 'p',
        text: 'Most people reading this are nowhere near that. They have a habit that got large and started taking things they wanted back. That is a normal problem with a practical solution. But if stopping repeatedly proves impossible, or if what surfaces when the game is gone is heavier than boredom, that is worth talking to someone you trust about, and it is not a failure of the plan.',
      },
      {
        type: 'p',
        text: 'For the ordinary version, deciding what the evenings are for is the entire job, and it is far easier to do on a calm Sunday than at 9pm on the Tuesday itself. That is the part Gaming Reset does in advance. Your answers become one small, specific thing to do each day, already sitting there when the empty evening arrives.',
      },
      {
        type: 'p',
        text: 'The honest summary is this. The first two days are the worst and they are survivable. The first week is boring and that is the real risk. The sleep comes back on its own. Nothing else does, and what you build in the space is entirely up to you, which is the difficult part and also the whole point.',
      },
    ],
    faq: [
      {
        q: 'What happens when you stop playing video games?',
        a: 'The urge to play usually appears fast. In a 2022 study following people through a break from gaming, most who felt an urge felt it within the first day or two. The most consistently reported effects are irritability and restlessness, followed by a period of boredom as the evenings gaming used to fill open up. Sleep is typically the first thing to improve.',
      },
      {
        q: 'How long does it stay hard after you stop gaming?',
        a: 'Be cautious with precise timelines. A review of 34 studies found the evidence here is underdeveloped and that research has not properly tracked how the effects fade over time. What is clear is that they tend to appear within the first day or two, and both research and personal accounts agree the difficulty is front-loaded rather than building over weeks.',
      },
      {
        q: 'Do you need a dopamine detox to quit gaming?',
        a: 'No, and the underlying idea is mistaken. Research separating wanting from liking shows dopamine drives the pull toward a reward rather than the pleasure of it, so quitting does not drain a supply that needs refilling. What you are actually dealing with is a strong cue-driven wanting response with its target removed. Changing your environment and cues does far more than waiting for a reset that is not happening.',
      },
      {
        q: 'Why do I feel bored and restless after quitting gaming?',
        a: 'Because gaming was structuring your evenings as well as filling them, and restlessness is one of the two most consistently reported effects alongside irritability. The boredom is not a sign something is wrong. It is the predictable result of removing several hours of reliable stimulation without deciding in advance what replaces it.',
      },
      {
        q: 'Will quitting video games make me happier?',
        a: 'It reliably gives you back time and sleep. It does not automatically make you happier. Quitting removes a problem rather than installing a life, and many people hit a flat patch in week two or three when the hours return but turn out to be ordinary hours. If gaming was covering something heavier, that becomes more visible once it is gone, which is uncomfortable but is also the point at which it can be dealt with.',
      },
      {
        q: 'What is the hardest part of quitting gaming?',
        a: 'Not the cravings. Most people go back on an unremarkable evening with nothing planned, rather than during an intense urge. The empty, unstructured time in the first week or two is the real difficulty, which is why deciding what the evenings are for before you stop matters more than resolve.',
      },
    ],
  },
  {
    slug: 'how-to-quit-valorant',
    navLabel: 'How to Quit Valorant',
    status: 'published',
    featured: false,
    category: 'Habits',
    title: 'How to Quit Valorant When "Just Uninstall" Has Never Worked',
    seoTitle: 'How to Quit Valorant for Good: A Plan That Actually Works',
    description:
      'How to quit Valorant when uninstalling never sticks. The ranked mechanics that keep you queuing, and a step by step plan to actually stop for good.',
    excerpt:
      'You have uninstalled Valorant a dozen times and reinstalled by midnight. That is not weakness. The ranked grind is built to punish stopping. Here is why it holds on, and a real plan to quit for good.',
    author: 'Saad',
    publishedAt: '2026-07-11',
    updatedAt: '2026-07-24',
    dateLabel: 'Jul 2026',
    readTime: '8 min read',
    body: [
      {
        type: 'figure',
        src: '/writing/valorant-revenge-queue.svg',
        alt: 'The revenge queue loop in Valorant: lose a close match, lose RR, feel the urge to run it back, queue again, and repeat.',
        caption: 'The revenge queue: a loss leaves a number to chase, and chasing it is how one more game becomes five.',
        width: 1200,
        height: 630,
        eager: true,
      },
      {
        type: 'lede',
        text: "You have probably uninstalled Valorant before. Maybe a dozen times. You deleted it after a tilting loss, felt clean for about a day, and reinstalled it by midnight because the queue was calling. If that loop sounds familiar, here's the first thing to understand: you're not weak, and you're not the problem. Valorant is a competitive ranked game engineered to make stopping feel like a mistake.",
      },
      {
        type: 'p',
        text: 'This is a practical guide, not a lecture. First we will look at why Valorant is so hard to put down, because you cannot beat a system you cannot see. Then we will get into an actual step by step plan to quit for good, and what the first two weeks really feel like.',
      },
      {
        type: 'p',
        segments: [
          'This is not a small habit to shake. Third party trackers estimate that ',
          {
            text: 'tens of millions of people play Valorant every month',
            href: 'https://activeplayer.io/valorant/',
          },
          ', and for a competitive slice of them it stops being fun and starts being a reflex. That is not a character flaw. The game is built to pull you back, and the pull you feel is real.',
        ],
      },
      {
        type: 'h2',
        text: 'Why Valorant is so hard to quit',
      },
      {
        type: 'p',
        text: 'Every mechanic that makes ranked exciting is the same mechanic that makes it sticky. The rank rating you chase, the five stack that queues without you, the aim you have spent months sharpening: each one quietly raises the cost of walking away.',
      },
      {
        type: 'p',
        segments: [
          'These are the same four hooks that make any competitive game hard to leave: variable rewards, sunk cost, social obligation, and identity. We broke them down in detail in ',
          {
            text: 'why competitive games are engineered to keep you hooked',
            href: '/writing/why-dota-is-engineered-to-keep-you-hooked',
          },
          '. Valorant simply wires all four of them straight into its ranked ladder.',
        ],
      },
      {
        type: 'h2',
        text: 'The ranked grind is built to punish stopping',
      },
      {
        type: 'p',
        text: 'Ranked is a variable reward machine. You never know exactly how a game will go, or how much RR the result will move, and unpredictable rewards are far more compelling than predictable ones. It is the same schedule a slot machine runs on, pointed at your rank instead of a jackpot.',
      },
      {
        type: 'p',
        text: 'The uncomfortable part is that this pull is not the same thing as fun. Research separating wanting from liking finds that the systems driving the urge toward a reward are separate from the ones that produce enjoyment when you get it. The two can come apart entirely, which is why you can queue for six hours, not enjoy a single game, and still feel the pull to run one more.',
      },
      {
        type: 'p',
        segments: [
          'It is worth being precise about the losses, because the popular version of this is wrong. Riot has explained ',
          {
            text: 'how Rank Rating actually moves',
            href: 'https://playvalorant.com/en-us/news/dev/ask-valorant-rank-rating-edition/',
          },
          ': your visible rank is tied to a hidden matchmaking rating, and the system is always dragging one toward the other. In Riot\'s own words, "If your MMR is higher than your rank, you\'ll gain more RR on wins than you lose on losses," and if it is lower, "you\'ll gain less RR on wins and lose more on losses."',
        ],
      },
      {
        type: 'p',
        text: 'So the game is not simply rigged to punish you. But the practical effect on a bad night is worse than if it were. Once you have climbed slightly past where the system thinks you belong, every defeat costs more than a win pays, and no amount of queuing fixes that, because the gap is the whole point. You are grinding against a correction that is designed to win.',
      },
      {
        type: 'p',
        segments: [
          'That is what turns a loss into a debt. The number went down, repaying it feels urgent, and the fastest repayment looks like queuing again right now. That is the revenge queue, and it arrives at exactly the moment you should be logging off. Riot runs the same hidden-rating machine in League, where it drives the LP grind and the elo hell myth, which we cover in ',
          {
            text: 'how to quit League of Legends',
            href: '/writing/how-to-quit-league-of-legends',
          },
          '. Valve runs its own version behind Premier, which is part of ',
          {
            text: 'why quitting CS2 is harder than it looks',
            href: '/writing/how-to-quit-cs2',
          },
          '.',
        ],
      },
      {
        type: 'quote',
        text: "The urge to queue again is loudest right after a loss. That's not you wanting to play. That's the game asking you to chase a number back.",
      },
      {
        type: 'h2',
        text: 'Why "just uninstall it" never works',
      },
      {
        type: 'p',
        text: "Uninstalling deletes the files, not the habit. The client is a two minute download, and your account, your rank, and your friends are all still sitting there waiting. So the game is never really gone, which is why deleting it in a rage at 2am almost never sticks past breakfast. You didn't quit. You added a loading screen.",
      },
      {
        type: 'p',
        segments: [
          'Playing in moderation usually does not work either, at least not early on. For most people deep in the ranked grind, one game becomes five, because the loop is built to pull you back in. If you could already play just one game and stop, you would not be reading this. In the beginning, a clean break is far easier to hold than a fuzzy limit you renegotiate every night. Moderation is a perfectly reasonable end goal, and the evidence suggests a short break is the most reliable route to it, which we cover in ',
          {
            text: 'how to play video games in moderation',
            href: '/writing/how-to-play-video-games-in-moderation',
          },
          '.',
        ],
      },
      {
        type: 'h2',
        text: 'How to quit Valorant, step by step',
      },
      {
        type: 'p',
        text: 'Here is a plan that works with how the hooks actually operate, instead of relying on willpower you have already spent by the end of the day.',
      },
      {
        type: 'ol',
        items: [
          'Pick a real quit date and say it out loud. Tell your duo or your stack that you are stopping, and when. Naming it to other people turns a private wish into a commitment you are far less willing to quietly break.',
          'Make starting a five step decision. Uninstall the client, log out of your Riot account, and remove it from your startup apps. Then put something between you and the reinstall, so it is not one frictionless click at your lowest moment. Our Windows app does this: you set a block yourself, for as many hours as you want, and it closes your launchers as soon as they open. Any launcher blocker will do the job, but pick one before the bad night, not during it.',
          'Kill the revenge queue rule. Decide in advance that a loss ends the session, it does not justify one more. The RR is already gone. Chasing it back is exactly how a bad night turns into a five hour one.',
          'Replace the progress bar, do not just delete it. Ranked hands you a number that goes up, and you will miss it. Put something in its place that also shows visible progress: the gym, a skill, a side project, anything with a curve you can watch climb.',
          'Handle the social hole honestly. If your friends are the reason you queue, tell them what you are doing and ask them not to invite you for a while. Real friends will understand. If a friendship only exists inside the game, that is painful but useful to know.',
          'Rebuild who you are without the rank. If Valorant has quietly become part of your identity, decide who you are becoming before you quit, so stopping feels like a step toward something instead of only a loss.',
          'Plan for the hardest day in advance. The urge does not fade in a straight line, it spikes first. Decide now what you will do when it hits, while you are calm, instead of trying to out argue yourself in the moment.',
        ],
      },
      {
        type: 'figure',
        src: '/writing/quit-gaming-timeline.svg',
        alt: 'Craving intensity after you stop playing: cravings rise to a peak within the first few days, then fade noticeably across the following weeks.',
        caption: 'The craving curve most people describe: a sharp spike in the first few days, then a steady drop. It is the shape people report, not a measured result.',
        width: 1040,
        height: 560,
      },
      {
        type: 'h2',
        text: 'What the first two weeks feel like',
      },
      {
        type: 'p',
        text: 'Stopping a game you played every day is a genuine adjustment, and the research here is more consistent about the what than the how long. Researchers reviewing 34 separate studies found the effects are most consistently described as irritability and restlessness. That matches what almost everyone reports: a short, sharp stretch of being annoyed at nothing, bored in a way that feels physical, and thinking about queuing constantly.',
      },
      {
        type: 'p',
        text: 'On timing, the clearest data comes from a 2022 study which followed 69 heavy players through a break from gaming. Most who felt an urge felt it within the first day or two, with only around seven percent reporting it first appearing beyond day three. The hard part shows up fast. That is the bad news and the good news at once, because it means the worst of it is front-loaded rather than lurking somewhere ahead of you.',
      },
      {
        type: 'p',
        text: 'One honest caveat, since most articles on this will not give you one: the same review also concluded the evidence here is very underdeveloped, and that studies have not properly tracked how those effects fade over time. So treat any confident "day four is the peak, two weeks and you are clear" timeline, including the shape of the curve above, as the pattern people commonly describe rather than something science has actually nailed down.',
      },
      {
        type: 'p',
        text: 'What holds up across both the research and the anecdotes is the direction. It gets easier, and it gets easier sooner than it feels like it will on day two. Knowing the spike is coming, and that it is front-loaded, is often the whole difference between getting through day four and reinstalling on day four.',
      },
      {
        type: 'h2',
        text: 'When it is about more than the game',
      },
      {
        type: 'p',
        text: 'If your gaming is tangled up with using the game to escape something heavier, then quitting Valorant is only part of the work. There is no shame in that, and you do not have to do it alone. Talking to someone you trust about what the game is helping you avoid is often the real first step.',
      },
      {
        type: 'p',
        text: 'The seven steps above are a plan, and plans are easy to write and hard to keep. Closing that gap is what Gaming Reset is for. It turns your answers into one specific thing to do each day and keeps your streak in front of you, so week three does not depend on you still remembering why week one mattered.',
      },
      {
        type: 'p',
        text: 'You do not need to hate Valorant to admit it was built to hold onto you. Seeing the ranked machine clearly is the first honest step. The next one is deciding that your evenings are worth more than a number you have to keep defending.',
      },
    ],
    faq: [
      {
        q: 'Why is Valorant so hard to put down?',
        a: 'Valorant is a competitive ranked game built on a variable reward system, the same schedule that makes slot machines compelling. Combine that with the sunk cost of your rank, the pull of a five stack, and an identity tied to how you perform, and it becomes very hard to put down for a lot of players.',
      },
      {
        q: 'How long does it take to quit Valorant?',
        a: 'The hardest part arrives early. In a 2022 study following people through a break from gaming, most who felt an urge felt it within the first day or two, and only around seven percent first felt it after day three. Beyond that, be sceptical of precise timelines: a review of the research found the evidence on how those effects fade over time is still underdeveloped. What people consistently report is that the daily struggle drops off noticeably within the first couple of weeks.',
      },
      {
        q: 'Can I just play Valorant less instead of quitting?',
        a: 'Eventually, maybe. Early on, moderation usually fails, because the ranked loop is designed to turn one game into five. A clean break for a set period is far easier to hold than a vague limit, and you can revisit moderation later from a much stronger position.',
      },
      {
        q: 'Why do I keep reinstalling Valorant?',
        a: 'Because uninstalling removes the files, not the account, the rank, the friends, or the habit. The client is a two minute download, so reinstalling is nearly frictionless. Add real friction while you are calm: log out, tell your friends, and set a block on your launchers for the hours you know are dangerous. Our Windows app has one built in. The point is that your lowest moment should not be one click away from a queue.',
      },
      {
        q: 'What should I do instead of playing Valorant?',
        a: 'Replace what Valorant gave you, not just the time it filled. If it was visible progress, pick something with a clear curve like fitness or a skill. If it was your friends, find a shared activity off the game. The goal is to meet the same need a healthier way.',
      },
    ],
  },
  {
    slug: 'why-video-games-are-not-fun-anymore',
    navLabel: 'Why Games Are Not Fun Anymore',
    status: 'published',
    featured: false,
    category: 'Habits',
    title: 'Why Video Games Are Not Fun Anymore (And Why You Still Play)',
    seoTitle: 'Why Video Games Are Not Fun Anymore, And You Still Play',
    description:
      'Games stopped being fun but you still play daily. That is not a contradiction: wanting and enjoying run on different systems, and only one kept you here.',
    excerpt:
      'Everyone tells you games got worse, or that you grew up. Maybe. Neither explains the actual puzzle, which is why you are still playing four hours a night of something you would not describe as fun.',
    author: 'Saad',
    publishedAt: '2026-07-24',
    updatedAt: '2026-07-24',
    dateLabel: 'Jul 2026',
    readTime: '8 min read',
    body: [
      {
        type: 'figure',
        src: '/writing/wanting-outlives-liking.svg',
        alt: 'Over years of playing, the pull to play one more rises and stays high while how much you actually enjoy playing steadily declines, leaving a widening gap between them.',
        caption: 'Two different systems, and only one of them has been getting exercised.',
        width: 1200,
        height: 630,
        eager: true,
      },
      {
        type: 'lede',
        text: 'You loaded up the game you have played for years, sat there for three hours, and felt almost nothing. Not bad exactly. Just flat. Then you did the same thing the following night. That second part is the one worth explaining, and it is the part almost nobody explains.',
      },
      {
        type: 'p',
        text: 'There are two standard answers to this and both are comfortable. The first is that games got worse, which puts the cause safely outside you. The second is that you grew up and your taste moved on, which is gentle and sometimes true. Neither is completely wrong. Neither accounts for the strange bit, which is that the hours did not go anywhere.',
      },
      {
        type: 'h2',
        text: 'The question has a false assumption buried in it',
      },
      {
        type: 'p',
        text: 'When you type why are games not fun anymore into a search bar, you are carrying an assumption you probably have not examined: that enjoyment is what was keeping you in the chair. It is a reasonable thing to assume. It is also, for a lot of people reading this, not what has been happening for quite a long time.',
      },
      {
        type: 'h2',
        text: 'Wanting and liking are not the same system',
      },
      {
        type: 'p',
        segments: [
          'The most useful research here is not about games at all. Kent Berridge and Morten Kringelbach, reviewing decades of work on how reward actually operates, describe ',
          {
            text: 'two separable systems rather than one',
            href: 'https://sites.lsa.umich.edu/berridge-lab/wp-content/uploads/sites/743/2019/09/Pleasure-Systems-in-the-Brain.pdf',
          },
          '. Wanting, the pull toward a reward, is produced by a large and widely distributed network. Liking, the pleasure you get when the reward actually arrives, is generated by a much smaller set of what they call hedonic hotspots.',
        ],
      },
      {
        type: 'p',
        text: 'The two normally travel together, which is why we treat them as one thing in ordinary speech. They do not have to. A big, robust wanting system and a small, fragile liking system can come apart, and when they do you get the exact experience you came here to ask about: a strong pull toward something you are not especially enjoying.',
      },
      {
        type: 'p',
        text: 'So the sentence that has been bothering you, I do not really enjoy it and I still play every day, is not a contradiction and it is not evidence that something is wrong with you. It is the predictable output of a system where the pull and the pleasure are handled separately, and only one of them has been getting trained for the last several years.',
      },
      {
        type: 'p',
        text: 'There is a consequence to that worth sitting with for a second. If some part of you has been quietly waiting to stop until you stopped enjoying it, that day has already been and gone. It arrived at some point you cannot name, and nothing happened. Enjoyment was never the brake.',
      },
      {
        type: 'quote',
        text: 'If you were waiting for the fun to run out before you stopped, it already has. That is the thing you came here to ask about.',
      },
      {
        type: 'h2',
        text: 'The part where the games genuinely did change',
      },
      {
        type: 'p',
        text: 'In fairness to the games got worse camp, something real did change. It is just more specific, and better documented, than nostalgia usually allows.',
      },
      {
        type: 'p',
        segments: [
          'In 1999, Edward Deci, Richard Koestner and Richard Ryan published a ',
          {
            text: 'meta-analysis of 128 experiments',
            href: 'https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf',
          },
          ' on what happens when you attach an expected, tangible reward to something people were already doing for its own sake. The reward reliably reduced how much they wanted to do it for its own sake afterwards. The effects were moderate rather than enormous, but they held across the whole set.',
        ],
      },
      {
        type: 'p',
        text: 'Now look at what has been bolted onto games over the last decade or so. Daily quests. Login streaks. Weekly challenges. Battle passes that expire. Seasonal ranks that wipe. Every one of those is an expected, tangible, schedule-driven reward attached to an activity you originally did because you liked it.',
      },
      {
        type: 'p',
        segments: [
          'That is not a theoretical concern. In 2022, Julian Frommel and Regan Mandryk surveyed 231 players about ',
          {
            text: 'these exact reward systems',
            href: 'https://dl.acm.org/doi/abs/10.1145/3549489',
          },
          ' and found the experience genuinely split. Some players found them motivating. Others described them as a source of missing-out anxiety, or plainly as an obligation and a chore. Playing in order to collect the rewards, rather than because you wanted to play, went with more externally driven motivation and with a state the researchers describe as having no real motivation left at all.',
        ],
      },
      {
        type: 'p',
        text: 'That is the shape of what happened to you. Nobody took the fun out. They added a schedule on top of it, and a schedule quietly converts a thing you chose into a thing you owe. It also explains why this bites hardest in the game you play most, which is exactly the one you would expect to enjoy the most.',
      },
      {
        type: 'h2',
        text: 'Why a different game does not fix it',
      },
      {
        type: 'p',
        text: 'The advice you will find everywhere is to try a new genre. It does work, for about two weeks, and then it stops working, and most people read that as proof that the problem is worse than they thought.',
      },
      {
        type: 'p',
        text: 'What is actually happening is simpler. Novelty is an input to wanting, not to liking. A new game hands you a fresh, unexhausted pull, which feels like enthusiasm returning. Then the pull settles back to roughly where the last one left it, because the thing that changed was never really the game.',
      },
      {
        type: 'p',
        text: 'This is also the mechanism behind the backlog. You buy the thing, feel the spike at the store page and again on the download bar, play four hours and stop. If buying games were the fix, the forty unplayed ones already in your library would have fixed it. What you are chasing is not a game, it is a state: no obligations, no schedule, plenty of unclaimed time, and a tolerance you had not built up yet. Only one of those four is available for purchase.',
      },
      {
        type: 'h2',
        text: 'Sometimes you have simply outgrown it',
      },
      {
        type: 'p',
        text: 'Now the honest branch, because not everything is a problem waiting to be solved. Some people reading this have had their taste move, which is a thing that happens with every hobby anyone has ever had, and there is no deeper explanation required.',
      },
      {
        type: 'p',
        text: 'There is a clean way to tell which one you are, and it is a single question. Are you playing less than you used to, or the same amount?',
      },
      {
        type: 'figure',
        src: '/writing/outgrown-or-stuck.svg',
        alt: 'If you are playing less and enjoying it less, you have moved on and nothing needs fixing. If you are playing the same amount or more while enjoying it less, the hours did not follow the enjoyment down, and that gap is the one worth acting on.',
        caption: 'Boredom on its own is not the signal. Boredom that did not reduce the hours is.',
        width: 1040,
        height: 560,
      },
      {
        type: 'p',
        text: 'If you are playing less and enjoying it less, those are the same fact described twice, and the word for it is moving on. It does not need a plan. The only real mistake available to you there is treating an ordinary change of taste as evidence that something is wrong with you.',
      },
      {
        type: 'p',
        segments: [
          'If you are playing the same amount or more while enjoying it less, that is a different situation and it is the one this article is really about. The hours did not follow the enjoyment down. Something other than fun is holding them in place, and it is worth knowing what, which is roughly the question we worked through in ',
          {
            text: 'how many hours of gaming is too much',
            href: '/writing/how-many-hours-of-gaming-is-too-much',
          },
          '.',
        ],
      },
      {
        type: 'h2',
        text: 'What actually helps',
      },
      {
        type: 'ol',
        items: [
          'Stop waiting for enjoyment to make the decision for you. It already stopped and it did not stop you, so it is not going to arrive later as a signal. Whatever you decide here, you will have to decide on purpose.',
          'Skip the dailies for one week, before you change anything else. Not the game, just the schedule. If a week of ignoring the quests feels like nothing, the rewards were never the problem. If it produces a genuine flicker of anxiety, you have learned more in seven days than any amount of thinking about it would have told you.',
          'Take a short break instead of switching games. Switching resets novelty, which was never the part that was broken. A break is the thing that actually lowers the tolerance you have built up.',
          'Ask what you would play if nothing expired. No season, no streak, no battle pass, nobody waiting. If a clear answer comes back, your problem is the schedule rather than the medium. If nothing comes back at all, that is worth knowing plainly rather than testing it against another twenty hours.',
          'Work out which need it was actually meeting, because that is what will need somewhere else to go if you do step back.',
        ],
      },
      {
        type: 'p',
        segments: [
          'On that third point, a short clean break has better evidence behind it than most of the advice in this area, and it is not the same thing as quitting forever. We went through what the research actually supports in ',
          {
            text: 'how to play video games in moderation',
            href: '/writing/how-to-play-video-games-in-moderation',
          },
          '. And on the last point, the three needs games tend to be meeting, and how to tell which one is yours, are set out in ',
          {
            text: 'what to do instead of gaming',
            href: '/writing/what-to-do-instead-of-gaming',
          },
          '.',
        ],
      },
      {
        type: 'p',
        segments: [
          'One more thing worth naming. If the flatness is not really about games, and things you used to like across the board have gone quiet too, then this article is aimed at the wrong problem and no amount of adjusting your quest log will reach it. That is worth saying to someone you trust rather than working out alone. If it is specific to gaming, though, it is an ordinary situation with an ordinary explanation, and the pull you are still feeling has a design behind it that we pulled apart in ',
          {
            text: 'why competitive games are engineered to keep you hooked',
            href: '/writing/why-dota-is-engineered-to-keep-you-hooked',
          },
          '.',
        ],
      },
      {
        type: 'p',
        text: 'Gaming Reset is built for the version of this where the hours stayed and the enjoyment did not. Your own answers about what you play and what you want back become one small step a day, with the tracking handled for you, so the decision is not left to a version of you sitting in front of the game at eleven at night feeling nothing much either way.',
      },
      {
        type: 'p',
        text: 'The honest summary is that you probably have not lost your ability to enjoy things, and games probably have not been ruined for you permanently. You have a well-trained pull, a schedule that turned a hobby into a set of obligations, and a tolerance built over years. None of those are fun, and none of them are what you were promised when you started playing. It is worth finding out what is under there, and the only way to find out is to take the schedule away for long enough to see.',
      },
    ],
    faq: [
      {
        q: 'Why are video games not fun anymore?',
        a: 'Usually a combination of three things rather than one. Tolerance builds over years of play, so the same game delivers less than it used to. Modern progression systems add expected, schedule-driven rewards on top of an activity you originally chose freely, and a large body of research shows that reliably reduces motivation to do something for its own sake. And in some cases your taste has genuinely moved on, which is normal and needs no fixing.',
      },
      {
        q: 'Why do I keep playing games I do not enjoy?',
        a: 'Because wanting and liking are handled by different systems. Research on how reward works describes wanting as a large, widely distributed system and liking as a much smaller one, and the two can come apart. That means a strong pull toward something you get little pleasure from is not a contradiction. It is what you would expect after years of training one system and not the other.',
      },
      {
        q: 'Is it normal to lose interest in gaming as you get older?',
        a: 'Yes, and it is worth separating from the other thing. If you are playing less and enjoying it less, those are the same fact and the word for it is moving on. Every hobby does this eventually. The situation worth paying attention to is playing the same amount or more while enjoying it less, because that means the hours are being held in place by something other than enjoyment.',
      },
      {
        q: 'Do daily quests and battle passes ruin games?',
        a: 'For some players, yes. A 2022 survey of 231 players found the experience genuinely split: some found engagement rewards motivating, while others described them as an obligation, a chore, or a source of missing-out anxiety. Playing to collect rewards rather than because you wanted to play was linked to more externally driven motivation. A useful test is to skip the dailies for one week and see whether it feels like relief or like anxiety.',
      },
      {
        q: 'Will taking a break make games fun again?',
        a: 'Often it helps more than switching games does, because a break lowers built-up tolerance while a new game only supplies novelty, which fades in a couple of weeks. A short break is also better supported by evidence than most advice in this area, and it is not the same as quitting permanently. What a break cannot do is restore enjoyment to a game whose appeal was mostly its reward schedule.',
      },
      {
        q: 'Should I be worried that games are boring me?',
        a: 'Boredom on its own is not a warning sign, and treating an ordinary change of taste as a problem does more harm than good. The thing worth noticing is a gap: enjoyment falling while the hours stay the same. And if the flatness is not specific to games, and things you used to like generally have gone quiet, that is worth talking about with someone you trust rather than solving through your gaming habits.',
      },
    ],
  },
  {
    slug: 'how-to-stop-playing-video-games-at-night',
    navLabel: 'How to Stop Gaming at Night',
    status: 'published',
    featured: false,
    category: 'Habits',
    title: 'How to Stop Playing Video Games at Night (It Is Not the Blue Light)',
    seoTitle: 'How to Stop Playing Video Games at Night: What Works',
    description:
      'Why one more game wins at 1am, and how to stop playing video games at night. The real mechanism is not blue light, and the fix is not more willpower.',
    excerpt:
      'It is 12:40, you have work in seven hours, you are not even enjoying this one, and you queue again. Blue light did not do that. Here is the mechanism the sleep advice misses, and the two rules that actually hold.',
    author: 'Saad',
    publishedAt: '2026-07-24',
    updatedAt: '2026-07-24',
    dateLabel: 'Jul 2026',
    readTime: '9 min read',
    body: [
      {
        type: 'figure',
        src: '/writing/two-bedtime-problems.svg',
        alt: 'Two different problems on a late gaming night: why you cannot fall asleep, which every guide answers with amber glasses and caffeine rules, and why you did not stop playing, which almost none of them answer.',
        caption: 'Two problems, and the advice only ever addresses the cheaper one.',
        width: 1200,
        height: 630,
        eager: true,
      },
      {
        type: 'lede',
        text: 'It is 12:40 on a Tuesday. You have work in seven hours. You are not even enjoying this particular game, and you queue again anyway. Nothing is stopping you. That last sentence is not a figure of speech, it is the most important detail in this entire article, and it is the one every guide on late night gaming manages to skip.',
      },
      {
        type: 'p',
        text: 'The advice you have already found tells you to wear amber glasses, cut caffeine after four, keep the console out of the bedroom, and take a warm shower. None of it is exactly wrong. It is simply aimed at a different problem from the one you actually have.',
      },
      {
        type: 'h2',
        text: 'Every guide answers the wrong question',
      },
      {
        type: 'p',
        text: 'There are two separate problems on a late gaming night, and almost nobody pulls them apart. The first is why you cannot fall asleep once you finally do stop. That one is real enough. You are wired, your heart rate is still somewhere in the last fight, and a bright screen has been sitting an arm\'s length from your face for four hours.',
      },
      {
        type: 'p',
        text: 'The second problem is why you did not stop at eleven. Nothing in the standard advice touches that, and it is the one that costs you the night. If you had logged off at eleven, a slightly slow wind-down would have cost you fifteen minutes. Instead you logged off at one, so it cost you two hours and the fifteen minutes.',
      },
      {
        type: 'p',
        segments: [
          'It is also worth knowing how thin the most recommended fix on that list actually is. A 2023 systematic review of blue-light filtering lenses concluded that they ',
          {
            text: 'probably make no meaningful difference to sleep quality',
            href: 'https://www.cochrane.org/about-us/news/blue-light-filtering-spectacles-probably-make-no-difference-eye-strain-eye-health-or-sleep',
          },
          '. It is the item that appears in almost every article written on this subject, and the evidence behind it is close to nothing.',
        ],
      },
      {
        type: 'h2',
        text: 'What is actually happening at 12:40',
      },
      {
        type: 'p',
        segments: [
          'Psychologists have a name for what you are doing, and the definition is unusually blunt. In 2014, Floor Kroese and colleagues introduced ',
          {
            text: 'bedtime procrastination',
            href: 'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2014.00611/full',
          },
          ' and defined it as failing to go to bed at the intended time, while no external circumstances prevent a person from doing so.',
        ],
      },
      {
        type: 'p',
        text: 'Read the second half of that again. No external circumstances prevent a person from doing so. Nobody is keeping you up. There is no deadline, no emergency, no crying baby. The entire phenomenon is defined by the absence of a reason, which is exactly what makes it impossible to argue yourself out of in the moment. There is nothing there to argue with.',
      },
      {
        type: 'p',
        text: 'In their sample of 177 adults, bedtime procrastination tracked strongly with low self-regulation and predicted short sleep on its own. Thirty percent were getting six hours or less on a weeknight, and 84 percent said they felt tired or short of sleep at least once a week.',
      },
      {
        type: 'p',
        text: 'Notice what is missing from that description: games. Bedtime procrastination is an ordinary human problem that games happen to be exceptionally good at exploiting. That is mildly reassuring and slightly worse news than you were hoping for, because it means uninstalling the game does not automatically fix the hour.',
      },
      {
        type: 'quote',
        text: 'Nothing is keeping you up. That is not a detail around the edge of the problem. That is the definition of it.',
      },
      {
        type: 'h2',
        text: 'Why it is always the evening and never the morning',
      },
      {
        type: 'p',
        text: 'Here is the part that makes it click. You have never once woken at six and thought, I will steal an extra hour for myself before work. The reclaiming only ever happens at night. Whatever this is, it is not a general shortage of self-control, because the same person exercises plenty of it at 8am.',
      },
      {
        type: 'p',
        segments: [
          'A 2018 study offers the first half of the answer. Researchers asked 218 people how many desires they had resisted across the day and how badly they delayed going to bed that night, and found that ',
          {
            text: 'the more people had resisted during the day, the later they went to bed',
            href: 'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.00252/full',
          },
          '. The correlation was modest rather than dramatic, so hold it loosely, but it points exactly where you would expect.',
        ],
      },
      {
        type: 'p',
        text: 'Their own conclusion is worth repeating, because it is the opposite of what you have probably been telling yourself. Simply buckling down and exerting more self-control, they wrote, is unlikely to succeed. Not because you are weak, but because at midnight you are being asked to pay with a currency you already spent at work.',
      },
      {
        type: 'p',
        segments: [
          'The second half is about what the hour is worth to you. When we looked at ',
          {
            text: 'what games are actually giving you',
            href: '/writing/what-to-do-instead-of-gaming',
          },
          ', one of the three needs was autonomy: the sense that this time is genuinely yours, with nobody needing anything from you. For a lot of adults, the only stretch of the day that clears that bar is the one after everybody else has gone to bed.',
        ],
      },
      {
        type: 'p',
        text: 'Which changes what going to sleep actually feels like. You are not choosing between a game and rest. You are being asked to hand back the only part of the day that belonged to you, and go unconscious, so you can start the next one. Put that way, one more game is not irrational at all. It is the most understandable thing in the world, and it will still cost you Wednesday.',
      },
      {
        type: 'h2',
        text: 'What games add to an ordinary bedtime problem',
      },
      {
        type: 'p',
        text: 'Everything you might do late at night has some version of this pull. Gaming has three features that make it considerably worse.',
      },
      {
        type: 'p',
        text: 'The first is that a session has no natural end. A film has credits. An episode runs out. A book has a chapter break that gives you a clean place to stop. A match ends and puts a queue button exactly where the ending should be. Nothing in the activity ever tells you it is over, so the stopping has to be generated entirely by you, every single time, at the hour you are least equipped to generate it.',
      },
      {
        type: 'p',
        segments: [
          'The second is that losing is the hook rather than the deterrent. The urge to play again is loudest immediately after a bad game, which is also the version of you least interested in going to bed. We went through that mechanism in detail in ',
          {
            text: 'the guide to quitting Valorant',
            href: '/writing/how-to-quit-valorant',
          },
          ', and it is at its most effective after eleven.',
        ],
      },
      {
        type: 'p',
        text: 'The third is that other people are still online, so logging off stops being a decision about sleep and becomes a decision about leaving. That one is hardest to argue with, because it is not really about the game at all.',
      },
      {
        type: 'p',
        segments: [
          'Together they produce a very specific and very measurable pattern. In a 2016 survey of 963 gamers, bedtime moved on 36 percent of the nights they played, and when it moved, ',
          {
            text: 'it moved by an average of 101 minutes',
            href: 'https://www.sciencedaily.com/releases/2016/06/160613144656.htm',
          },
          '. Not occasionally. On more than a third of the nights they played. More than two thirds said gaming had cost them sleep.',
        ],
      },
      {
        type: 'h2',
        text: 'Two rules, not ten',
      },
      {
        type: 'p',
        text: 'You do not need a bedtime routine. You need two decisions, made once, in daylight, by the version of you who is not currently mid-session.',
      },
      {
        type: 'ol',
        items: [
          'Set a last-queue time, not an hours budget. Not "about two hours a night". Last queue at eleven. One of those requires a judgement call at midnight and the other does not.',
          'Decide in advance how the session ends. A loss ends the night, or the queue that would finish after your cut-off does not get started. Pick one and make it mechanical, so the end of the evening is not something you have to talk yourself into.',
        ],
      },
      {
        type: 'figure',
        src: '/writing/clock-beats-budget.svg',
        alt: 'An hours budget needs a judgement call at midnight and ends with you still playing at 1am. A fixed last-queue time needs no decision and ends with you in bed by 11:30.',
        caption: 'The difference is not strictness. It is whether the rule needs you to decide anything.',
        width: 1040,
        height: 560,
      },
      {
        type: 'p',
        segments: [
          'The reason to prefer a clock time is that it cannot be reinterpreted. An hours budget is a running negotiation, and by midnight you can always locate fifteen minutes that were not really playing. Eleven o\'clock is eleven o\'clock. We made the same case in ',
          {
            text: 'how to play video games in moderation',
            href: '/writing/how-to-play-video-games-in-moderation',
          },
          ', and it holds harder at night, because the thing an hours cap fails to protect is precisely the thing that late sessions take.',
        ],
      },
      {
        type: 'p',
        segments: [
          'Phrase both rules as if-then, because that phrasing has better evidence behind it than almost anything else in behaviour change. Peter Gollwitzer and Paschal Sheeran\'s ',
          {
            text: 'meta-analysis of 94 studies',
            href: 'https://kops.uni-konstanz.de/handle/123456789/10973',
          },
          ', covering more than 8,000 people, found that turning an intention into a specific if-then plan produced a medium-to-large effect, with a d of 0.65.',
        ],
      },
      {
        type: 'p',
        text: 'That is also, not coincidentally, what the bedtime procrastination researchers landed on. Having concluded that more willpower will not work for someone who is already depleted, they pointed at pre-planned responses to specific cues instead. The people studying why you are still awake and the people studying how to make a rule stick arrived at the same tool from opposite directions.',
      },
      {
        type: 'h2',
        text: 'The part the sleep advice always misses',
      },
      {
        type: 'p',
        text: 'There is one more move, and skipping it is why the rules quietly collapse in week two. If the reason you stay up is that the night is the only time that belongs to you, then a rule that simply deletes the night is not a solution. It is a pay cut, and you will find a way to take the money back.',
      },
      {
        type: 'p',
        text: 'So do not only end the evening earlier. Move something you actually chose into the hour you just freed up. It does not have to be productive and it is allowed to be completely pointless. It only has to be yours, and it has to not be the game. The need was never for gaming specifically. It was for one part of the day nobody else had a claim on.',
      },
      {
        type: 'p',
        text: 'That is the structural reason the standard list fails. It is made entirely of removals. Take the device out. Cut the caffeine. No screens for an hour before bed. Every item is something taken away from you, written for someone whose problem is that they have too much. Your problem is that you have too little, and midnight is the only place left to take it from.',
      },
      {
        type: 'h2',
        text: 'What the first week is like',
      },
      {
        type: 'p',
        segments: [
          'Expect the first three or four nights to be the hardest, and expect the pull to arrive at almost exactly the same time each night, because it is a cue firing on schedule rather than a fresh decision. That front-loading is the same shape a full break takes, which we set out in ',
          {
            text: 'what happens when you stop playing video games',
            href: '/writing/what-happens-when-you-stop-playing-video-games',
          },
          '. Knowing the spike is coming, and that it is early, is most of the difference between holding the rule and renegotiating it.',
        ],
      },
      {
        type: 'p',
        text: 'One honest caveat. If the late nights are less about the game and more about not wanting the day to end, or about what gets loud in the quiet once the screen is off, a cut-off time is not going to reach that. It is still worth setting, but it is worth saying out loud to someone you trust rather than solving alone at 1am.',
      },
      {
        type: 'p',
        text: 'The two rules are easy to write down and hard to still be following on a Thursday. Closing that gap is what Gaming Reset does. Your answers about your own evenings turn into one specific step a day with the record kept for you, so the rule you set in daylight is still doing its job at the hour you would most like to renegotiate it.',
      },
      {
        type: 'p',
        text: 'You are not staying up because you lack discipline. You are staying up because the night is the only part of the day that asks nothing of you, and a game is very good at holding onto anyone who wants that. The fix is not to want it less. It is to take that hour somewhere that does not charge you the next day for it.',
      },
    ],
    faq: [
      {
        q: 'How do I stop playing video games at night?',
        a: 'Set a last-queue time rather than an hours budget, and decide in advance how the session ends, for example that a loss ends the night. A fixed clock time works better because it cannot be reinterpreted at midnight, while an hours cap needs a judgement call at the moment you are least able to make one. Then put something you actually chose into the hour you free up, because the late hour was serving a purpose and removing it without a replacement rarely holds.',
      },
      {
        q: 'Why do I keep gaming until 2am even when I am tired?',
        a: 'Because it is bedtime procrastination, defined in the research as failing to go to bed at the intended time when nothing external is preventing you. One study found that the more desires people resisted during the day, the later they went to bed, and the authors concluded that exerting more self-control is unlikely to work for someone already depleted. For most adults the late hours are also the only part of the day nobody else has a claim on, so going to bed feels like giving that up.',
      },
      {
        q: 'Do blue light glasses help gamers sleep?',
        a: 'Probably not much. A 2023 systematic review of blue-light filtering lenses concluded they likely make no meaningful difference to sleep quality. They are the most commonly recommended fix in articles on late night gaming and among the least supported. They also address the wrong problem, since they target how quickly you fall asleep after you stop rather than why you did not stop two hours earlier.',
      },
      {
        q: 'Is it better to limit gaming hours or set a cut-off time?',
        a: 'A cut-off time. An hours budget is a running negotiation, and late in the evening you can always find time that did not really count. A clock time cannot be reinterpreted, and it protects sleep specifically, which is what late sessions actually take. In one survey of 963 gamers, bedtime moved on 36 percent of the nights they played, by an average of 101 minutes.',
      },
      {
        q: 'Why is it so hard to stop after just one more game?',
        a: 'Partly because a session has no natural end. A film has credits and a book has a chapter break, but a match finishes and puts a queue button where the ending should be, so stopping has to come entirely from you every time. The urge is also loudest right after a loss, which tends to be the version of you least interested in going to bed.',
      },
      {
        q: 'Does late night gaming actually matter, or is it just lost sleep?',
        a: 'The lost sleep is the main cost, and it is larger than most people assume. Survey data puts the average delay at 101 minutes on the nights it happens, which is not a rounding error across a working week. The more useful question is not whether one night matters but whether the pattern is taking tomorrow as well, since the hours come directly out of the following day rather than out of your free time.',
      },
    ],
  },
  {
    slug: 'how-to-quit-league-of-legends',
    navLabel: 'How to Quit League of Legends',
    status: 'published',
    featured: false,
    category: 'Habits',
    title: 'How to Quit League of Legends (When the Climb Will Not Let Go)',
    seoTitle: 'How to Quit League of Legends for Good: A Real Plan',
    description:
      'How to quit League of Legends when you keep climbing back. The ranked ladder is built to never let you arrive, and here is a plan that works with that.',
    excerpt:
      'You have quit League before. You hit the rank, told yourself one more season, and were back in ranked by the weekend. That is not weakness. The ladder is built so you never quite arrive. Here is why, and how to actually stop.',
    author: 'Saad',
    publishedAt: '2026-07-27',
    updatedAt: '2026-07-27',
    dateLabel: 'Jul 2026',
    readTime: '9 min read',
    body: [
      {
        type: 'figure',
        src: '/writing/moving-finish-line.svg',
        alt: 'The ranked ladder as a finish line that keeps moving: you swear you will quit at Gold, then it becomes Platinum, then just Diamond, and the target keeps stepping one rank ahead of you.',
        caption: 'The rank you swear you will stop at has a way of becoming the next one down.',
        width: 1200,
        height: 630,
        eager: true,
      },
      {
        type: 'lede',
        text: "You have quit League before. You hit the rank you were chasing, or you lost the promo and rage-uninstalled, and either way you told yourself that was it. Then a patch dropped, or a friend asked for a duo, or the new season started with a clean slate, and you were back in ranked by the weekend. If that loop is familiar, here is the first thing to understand: you are not weak, and the problem is not really the game. It is the ladder.",
      },
      {
        type: 'p',
        text: 'This is a practical guide, not a lecture. First we will look at why League specifically is so hard to leave, because you cannot beat a system you cannot see clearly. Then we will get into an actual plan to stop, and what the first couple of weeks really feel like.',
      },
      {
        type: 'p',
        segments: [
          'You are also not alone in this by a wide margin. Third-party trackers estimate that ',
          {
            text: 'well over a hundred million people play League every month',
            href: 'https://prioridata.com/data/league-of-legends/',
          },
          ', and for a competitive slice of them it long ago stopped being about fun and became about the number next to their name.',
        ],
      },
      {
        type: 'h2',
        text: 'You are not hooked on League. You are hooked on the climb',
      },
      {
        type: 'p',
        text: 'A single-player game ends. You beat it, credits roll, and the thing is complete. Ranked has no such thing as complete, and that is not an accident. Every rank has a rank above it. Every season wipes the ladder and asks you to prove it again. The one structure guaranteed to keep you playing is a goal you can never finish reaching, and that is exactly what a competitive ladder is.',
      },
      {
        type: 'p',
        segments: [
          'Underneath the rank you see is a hidden number. Riot is explicit that your ',
          {
            text: 'matchmaking rating is a secret, and your visible rank is just a translation of it',
            href: 'https://support.riotgames.com/en-us/league-of-legends/gameplay/mmr-rank-and-lp',
          },
          ': win and it goes up, lose and it goes down. The point of that design is that there is always another number to chase, and the chase is the product.',
        ],
      },
      {
        type: 'p',
        text: 'This is why "I will quit when I hit Gold" never works. You hit Gold and Gold immediately feels like the floor, not the finish, because the ladder has already shown you Platinum. The finish line was never fixed. It moves up to meet you every time you reach it, and a target that moves is a target you can chase forever.',
      },
      {
        type: 'quote',
        text: 'A rank is not a finish line. It is the next starting line, dressed up to look like an ending.',
      },
      {
        type: 'h2',
        text: 'The elo hell trap, and why it keeps you queuing',
      },
      {
        type: 'p',
        text: 'Somewhere in a bad session you have probably decided the system is against you. Your teammates are the problem, the matchmaking is rigged, you are stuck in elo hell or forced into a losers queue after a win streak. It feels true, especially at 1am after a fourth loss. It is worth knowing that Riot has addressed this directly, because the belief is doing more damage than any of your teammates.',
      },
      {
        type: 'p',
        segments: [
          'In an official developer post on matchmaking, Riot states that ',
          {
            text: 'most teams have an expected win rate of 50 give or take 1 percent',
            href: 'https://www.leagueoflegends.com/en-us/news/dev/dev-matchmaking-real-talk/',
          },
          ', calls the idea of a punishing losers queue "pretty much an urban myth", and says plainly that there is nothing in the system forcing you to have lower-skill teammates or stronger opponents. The game is trying, imperfectly, to hand you a coin-flip every time you queue.',
        ],
      },
      {
        type: 'p',
        text: 'Here is why that matters for quitting rather than for climbing. The elo hell story is not just wrong, it is the engine of the trap. You decide the game is rigged, so you tilt and blame the team and maybe flame in chat, so you play worse and chase the loss instead of stopping, so you drop LP, which feels like proof the game was rigged all along. The belief manufactures the evidence for itself, and every lap around that loop is another hour you did not mean to spend.',
      },
      {
        type: 'figure',
        src: '/writing/elo-hell-loop.svg',
        alt: 'The elo hell loop: deciding the game is rigged leads to tilt and blaming teammates, which leads to worse play and chasing losses, which loses LP, which feels like proof the game was rigged, and the belief confirms itself. Riot says most teams have an expected win rate of 50 give or take 1 percent and there is no losers queue.',
        caption: 'The loop is real. The rigging is not. That is an uncomfortable combination.',
        width: 1040,
        height: 560,
      },
      {
        type: 'p',
        text: 'None of this means every game is winnable or that you never get a genuinely rough team. It means the pattern you are stuck in is a pattern you are running, not a cage the game built around you, and that is oddly good news, because a loop you run is a loop you can step out of.',
      },
      {
        type: 'h2',
        text: 'The revenge queue arrives exactly when you should log off',
      },
      {
        type: 'p',
        text: 'Losing LP stings more than gaining the same LP feels good, so a loss leaves a debt, and the fastest-looking way to repay it is to queue again right now. That is the revenge queue, and it shows up at precisely the moment you should be closing the client. One more game to end on a win is how a bad night becomes a five-hour one.',
      },
      {
        type: 'p',
        segments: [
          'There is a nastier version of this once you have climbed slightly past where your hidden rating says you belong. Because LP gains and losses track that hidden number, every defeat then costs a little more than a win pays, and no amount of grinding fixes it, because the gap is the whole point. It is the same ranked machine we pulled apart for another Riot game in ',
          {
            text: 'the guide to quitting Valorant',
            href: '/writing/how-to-quit-valorant',
          },
          ', and the same four hooks that make any competitive game hard to leave, which we broke down in ',
          {
            text: 'why competitive games are engineered to keep you hooked',
            href: '/writing/why-dota-is-engineered-to-keep-you-hooked',
          },
          '.',
        ],
      },
      {
        type: 'h2',
        text: 'Why "just uninstall it" never sticks',
      },
      {
        type: 'p',
        text: 'Uninstalling deletes the client, not the account. Your rank, your champion mastery, your skins, and your friends list are all still sitting on Riot\'s servers, and the client is a fifteen-minute download away. So the game is never actually gone, which is why deleting it in a tilt at 2am almost never survives past the weekend. You did not quit. You added a loading screen, and the season is still running without you.',
      },
      {
        type: 'p',
        segments: [
          'Trying to just play less usually fails too, at least early on. For most people deep in the ranked grind, one game becomes five, because the loop is built to pull you back. Moderation is a perfectly reasonable end goal, and the evidence actually favours taking a clean break first and moderating from there, which we go through in ',
          {
            text: 'how to play video games in moderation',
            href: '/writing/how-to-play-video-games-in-moderation',
          },
          '. In the beginning, a firm break is far easier to hold than a fuzzy limit you renegotiate after every loss.',
        ],
      },
      {
        type: 'h2',
        text: 'How to quit League, step by step',
      },
      {
        type: 'p',
        text: 'This is a plan built around how the ladder actually works, instead of relying on willpower you have already spent by the end of a ranked session.',
      },
      {
        type: 'ol',
        items: [
          'Set your own finish line, because the ladder will not. Pick a date you stop, not a rank you stop at. A rank is a target that moves the moment you reach it; a date on the calendar does not. "I am done on the 30th" beats "I am done at Diamond" every time.',
          'Make a loss end the session, and decide it now. Write the rule in advance, while you are calm: if I lose a ranked game, the night is over. Pre-deciding the exact response to the exact situation is the single best-evidenced tool for making a limit hold, so use it here.',
          'Drop the elo hell story on purpose. Whether you are quitting or just cutting back, telling yourself the game is rigged is what fuels the tilt and the revenge queue. Retiring that belief removes the "let me just climb out of this bad patch first" excuse that keeps the account open.',
          'Add real friction to starting. Uninstall the client, log out of your Riot account, and take it off your startup apps. Then put a block on your launchers for the hours you already know are dangerous, so reinstalling at your lowest moment is a five-step decision instead of one click. Our Windows app has this built in: you choose the hours while you are calm, and it closes the launcher every time it opens until they are up.',
          'Tell your duo and your premades. If your friends are the reason you queue, say what you are doing and ask them not to invite you for a while. Real friends understand. If a friendship only exists inside the client, that is painful but useful to learn.',
          'Rebuild who you are without the rank. If your rank had quietly become a measure of you, decide who you are becoming before you stop, so quitting reads as a step toward something rather than only the loss of a number.',
          'Plan the hardest day before it arrives. The urge spikes early and hits at a predictable time of night. Decide now what you will do when it comes, while you are thinking clearly, instead of trying to out-argue yourself mid-tilt.',
        ],
      },
      {
        type: 'h2',
        text: 'What the first two weeks feel like',
      },
      {
        type: 'p',
        segments: [
          'Stopping a game you played every day is a real adjustment, and it is mostly a boring one rather than a dramatic one: a stretch of restlessness, irritability, and evenings that feel oddly long. The urge tends to arrive fast and then fade sooner than it feels like it will on the worst day. We laid out what the research does and does not actually establish about that timeline in ',
          {
            text: 'what happens when you stop playing video games',
            href: '/writing/what-happens-when-you-stop-playing-video-games',
          },
          ', including why the confident day-by-day detox timelines you will find elsewhere are not as solid as they look.',
        ],
      },
      {
        type: 'p',
        text: 'The reinstall almost never happens during an intense craving. It happens on a flat Tuesday with nothing else planned, when the client is one download away and the evening is empty. That is the moment to prepare for, and it is beaten with a plan for the evening, not with more resolve.',
      },
      {
        type: 'h2',
        text: 'When it is about more than the climb',
      },
      {
        type: 'p',
        segments: [
          'One honest branch. If League is mostly the place you go to be somewhere other than your own life, quitting the game is only part of the work. When thousands of players were asked why they played, the motive that ',
          {
            text: 'lined up most strongly with gaming getting out of hand was escape',
            href: 'https://www.sciencedaily.com/releases/2019/10/191022121123.htm',
          },
          ', not competition or improvement. If that is you, the ranked ladder is doing a job, and pulling it away without addressing the job is why attempts fail and keep failing.',
        ],
      },
      {
        type: 'p',
        text: 'That is not a reason to skip the break. It is a reason to be honest that the break buys you room to deal with what you were escaping, rather than dealing with it for you, and that naming it to someone you trust does more than any amount of willpower aimed at the client.',
      },
      {
        type: 'p',
        text: 'For the day-to-day of it, structure carries the weight that willpower gets blamed for. That is what Gaming Reset is built to do: it turns your own answers about your habit into one small step a day and keeps your progress visible, so staying out of the queue does not depend on the resolve of someone who just lost a promo at midnight. The ladder is very good at asking you for one more game. This is a system that answers for you.',
      },
      {
        type: 'p',
        text: 'You do not have to hate League to admit it was built to keep you climbing. It is a brilliant piece of design, and that is exactly the problem, because brilliant design is hard to walk away from. Seeing the ladder clearly is the first honest step. The second is deciding, on purpose, where your finish line is, because the game is never going to draw one for you.',
      },
    ],
    faq: [
      {
        q: 'Why is League of Legends so hard to quit?',
        a: 'Mostly because the ranked ladder is designed never to finish. Every rank has one above it, every season resets your progress, and a hidden matchmaking rating means there is always another number to chase. On top of that, the belief that the game is rigged against you fuels tilt and revenge queuing, which keeps you playing far longer than you intended. It is less about being hooked on League itself and more about being attached to a climb that has no end built into it.',
      },
      {
        q: 'Is elo hell real?',
        a: 'Not in the way most players mean. In an official post on matchmaking, Riot says most teams have an expected win rate of about 50 percent, calls the punishing "losers queue" pretty much an urban myth, and states there is nothing forcing you to get weaker teammates. Individual games can genuinely be rough, but there is no system trapping you at a rank. The real effect of believing in elo hell is that it makes you tilt and play worse, which lowers your rank on its own.',
      },
      {
        q: 'How long does it take to quit League of Legends?',
        a: 'The hard part is front-loaded. The urge to play tends to show up within the first day or two and then eases over the following weeks, and the most common effects are simply irritability and restlessness rather than anything dramatic. Be sceptical of confident day-by-day timelines, since the research on how these effects fade is genuinely underdeveloped. What people consistently report is that the daily pull drops off noticeably within the first couple of weeks.',
      },
      {
        q: 'Can I just play League less instead of quitting?',
        a: 'Eventually, often yes. Early on, moderation usually fails, because the ranked loop is built to turn one game into five, especially after a loss. A clean break for a set period is far easier to hold than a vague limit, and the evidence suggests a short break is actually the most reliable route to moderating later from a stronger position.',
      },
      {
        q: 'Why do I keep reinstalling League after I quit?',
        a: 'Because uninstalling removes the client, not the account, the rank, the friends, or the habit, and the client is a short download away. Reinstalls also tend to happen on empty evenings rather than during intense cravings, which is useful: it means the fix is deciding what those evenings are for before they arrive. Log out of your Riot account, take it off startup, and set a block on your launchers for the hours you know are risky. Our Windows app has one built in. Then your lowest moment is not one click from a queue.',
      },
      {
        q: 'What should I do instead of playing ranked?',
        a: 'Replace what the climb was giving you, not just the hours it filled. If it was the feeling of measurable progress, pick something else with a visible curve, such as training or a skill you can track. If it was your friends, find a shared activity off the client. Setting a fixed stop date and a rule that a loss ends the session also removes the two mechanics, the moving finish line and the revenge queue, that do most of the work of keeping you in the queue.',
      },
    ],
  },
  {
    slug: 'how-to-play-video-games-in-moderation',
    navLabel: 'Gaming in Moderation',
    status: 'published',
    featured: false,
    category: 'Habits',
    title: 'How to Play Video Games in Moderation (And When It Will Not Work)',
    seoTitle: 'How to Play Video Games in Moderation: What Actually Works',
    description:
      'You do not want to quit gaming, you want it to stop eating your life. What the evidence says about moderation, and when a short break has to come first.',
    excerpt:
      'Most advice treats wanting to cut back rather than quit as denial. It is not. Moderation is a legitimate goal, it just fails for predictable reasons. Here is what the research actually supports.',
    author: 'Saad',
    publishedAt: '2026-07-20',
    updatedAt: '2026-07-24',
    dateLabel: 'Jul 2026',
    readTime: '9 min read',
    body: [
      {
        type: 'figure',
        src: '/writing/moderation-starting-point.svg',
        alt: 'Which starting point is yours: moderate from here if limits have sometimes held, you play mainly to compete or socialise, and you can stop mid-session; take two weeks off first if limits collapse the same night, you play mainly to escape, and one more game wins most nights.',
        caption: 'Moderation is a real goal. It is just not always the right first move.',
        width: 1040,
        height: 560,
        eager: true,
      },
      {
        type: 'lede',
        text: "You don't want to quit. You want gaming to stop quietly eating hours you meant to spend on something else, and you would like to keep playing the thing you actually enjoy. That is a completely reasonable position, and most of the internet will treat it as denial.",
      },
      {
        type: 'p',
        text: 'The two loudest camps are both unhelpful here. One sells moderation as a matter of setting a timer and having a bit of discipline. The other insists that if you are asking the question at all, you are kidding yourself and the only answer is to quit forever. Neither is what the evidence actually shows.',
      },
      {
        type: 'h2',
        text: 'Moderation is a legitimate goal',
      },
      {
        type: 'p',
        text: 'Start with the thing the quit-forever camp tends to skip. The criteria researchers actually use turn on impaired control, gaming taking priority over other activities, and continuing despite clear negative consequences, normally sustained for around twelve months. They are also explicit that this describes only a small proportion of people who play games.',
      },
      {
        type: 'p',
        text: 'Most people who feel gaming has got out of hand are nowhere near that. They have a habit that grew, in a medium engineered to encourage exactly that, and it started taking things they wanted back. Treating an oversized habit as though it demanded quitting forever is not caution. It is a category error, and it pushes people into an all-or-nothing frame where the first slip means total failure.',
      },
      {
        type: 'h2',
        text: 'Why "just play less" fails on its own',
      },
      {
        type: 'p',
        segments: [
          'That said, the intention to play less almost never survives on its own, and there is a good reason. Wendy Wood\'s diary research at USC found that ',
          {
            text: 'roughly 43 percent of daily behaviour',
            href: 'https://dornsife.usc.edu/wendy-wood/wp-content/uploads/sites/183/2023/10/Wood.Quinn_.Kashy_.2002_Habits_in_everyday_life.pdf',
          },
          ' is repeated in the same context, usually while the person is thinking about something else.',
        ],
      },
      {
        type: 'p',
        text: 'Loading the game after work is not usually a decision you are losing an argument about. It is a cue firing in a familiar place at a familiar time. A vague intention to "cut back this week" has to win an argument that never actually takes place, which is why you can genuinely mean it on Monday and still be five hours deep on Thursday without ever consciously choosing to be.',
      },
      {
        type: 'h2',
        text: 'The evidence says start with a short break',
      },
      {
        type: 'p',
        segments: [
          'This is the part almost no moderation guide mentions, and it is the most useful finding of the lot. A 2022 study by Julia Brailovskaia and colleagues in Computers in Human Behavior took 131 gamers, had them stop for just two weeks, and compared them against 140 controls across five time points running out to three months. The two week break ',
          {
            text: 'reduced their gaming time, their daily stress, and left them feeling better overall',
            href: 'https://www.sciencedirect.com/science/article/abs/pii/S074756322200156X',
          },
          '.',
        ],
      },
      {
        type: 'p',
        text: 'The detail that matters is what happened next. Those effects were still holding three months later, and this was not a quit-forever intervention. People went back to gaming. They just went back to less of it, and felt better, off the back of a fortnight.',
      },
      {
        type: 'quote',
        text: 'A short break is not the opposite of moderation. On the current evidence, it is the most reliable way to get to it.',
      },
      {
        type: 'p',
        text: 'This makes sense given how the habit works. Two weeks is long enough to break the cue-and-response chain, get one clean look at what your evenings are like without the game in them, and reset the baseline you are moderating from. Trying to negotiate a limit while playing daily means negotiating with a habit at full strength, every single night, which is a fight you will occasionally win and mostly lose.',
      },
      {
        type: 'h2',
        text: 'Who moderation works for, and who it does not',
      },
      {
        type: 'p',
        segments: [
          'The single best predictor of whether a limit holds is not how many hours you currently play. It is what you are playing for. A survey of thousands of recreational and esports players found ',
          {
            text: 'one motive standing well clear of the rest',
            href: 'https://www.sciencedaily.com/releases/2019/10/191022121123.htm',
          },
          ' when it came to gaming getting out of hand: playing to be somewhere other than where you are. Competition, immersion and skill development were weak signals, or ran in the opposite direction.',
        ],
      },
      {
        type: 'p',
        text: 'If you play mainly to compete or to see your friends, moderation is largely a scheduling problem and tends to work. If you play mainly to be somewhere other than your own life, a limit is a rule about how long you are allowed to keep using your main coping tool, which is why it collapses on precisely the evenings you most needed it to hold. That is not a discipline failure. It is the limit being aimed at the wrong thing.',
      },
      {
        type: 'p',
        text: 'The other honest marker is control itself. If every limit you have set has died the same night you set it, that pattern is information, and the useful response is a break rather than a stricter version of the rule that keeps failing.',
      },
      {
        type: 'h2',
        text: 'The one technique with real evidence behind it',
      },
      {
        type: 'p',
        segments: [
          'When you do set a limit, how you phrase it matters more than most people would believe. Peter Gollwitzer and Paschal Sheeran\'s ',
          {
            text: 'meta-analysis of 94 independent studies',
            href: 'https://kops.uni-konstanz.de/handle/123456789/10973',
          },
          ', covering more than 8,000 people, found that turning a goal into a specific if-then plan produced a medium-to-large effect on actually achieving it, with a d of 0.65. Very little in behaviour change research is that well supported.',
        ],
      },
      {
        type: 'p',
        text: 'A goal intention is "I will play less this week." An implementation intention names the situation and the response in advance: if it is a weeknight, then I do not open the game. If I lose a ranked match, then the session is over. If my friends invite me after 10pm, then I say I am out and log off. The mechanism is that you decide once, while calm, so that the moment itself does not require a decision at all.',
      },
      {
        type: 'p',
        text: 'This is why "I will cut down to about two hours" reliably fails while "no games until Friday, and never after 11" reliably does better. The first needs a judgement call every single night, made by someone tired and already sitting at their desk. The second is a rule you either kept or did not, and you always know which.',
      },
      {
        type: 'h2',
        text: 'Set the limit on when, not how long',
      },
      {
        type: 'p',
        segments: [
          'Most people cap total hours. Capping the clock works better, and sleep is the reason. When 963 gamers were surveyed about it, the nights they played turned out to be ',
          {
            text: 'the nights their bedtime quietly slipped',
            href: 'https://www.sciencedaily.com/releases/2016/06/160613144656.htm',
          },
          ': 36 percent of them, by an average of 101 minutes. Two thirds said gaming had cost them sleep.',
        ],
      },
      {
        type: 'p',
        segments: [
          'Three hours on a Saturday afternoon costs you an afternoon. Three hours starting at 11pm costs you the next day as well. A hard stop time protects the thing gaming actually damages, and it has the useful property of being unarguable. You cannot slightly reinterpret whether it is past eleven. If the cut-off is the one rule that keeps collapsing on you, there is more on why in ',
          {
            text: 'how to stop playing video games at night',
            href: '/writing/how-to-stop-playing-video-games-at-night',
          },
          '.',
        ],
      },
      {
        type: 'p',
        text: 'The second rule worth having is one about how sessions end. Deciding in advance that a loss ends the night, rather than justifying one more, removes the exact mechanism that turns a bad game into a five hour evening.',
      },
      {
        type: 'h2',
        text: 'Advice worth ignoring',
      },
      {
        type: 'p',
        text: 'Three things appear on nearly every moderation list and are worse than useless. The first is using gaming as a reward for finishing your responsibilities. That makes the game the payoff your whole day points at, which strengthens the pull rather than weakening it, and quietly reframes the rest of your life as the tax you pay for it.',
      },
      {
        type: 'p',
        text: 'The second is breaking gaming into timed intervals with short breaks. It is a study technique, it does nothing about the loop that makes stopping hard, and nobody in the history of ranked has ever paused for five minutes between rounds. The third is "just do your responsibilities first", which is not a strategy, it is a restatement of the problem.',
      },
      {
        type: 'h2',
        text: 'A plan that actually holds',
      },
      {
        type: 'ol',
        items: [
          'Take two weeks off before you set any limit. This is the step people skip and it has the best evidence behind it. You are trying to moderate from a calmer baseline, not negotiate with the habit at full strength.',
          'Write the rule as if-then, not as a number. "If it is a weeknight, then I do not open the game" beats "about two hours a day", because it never requires a judgement call at the moment you are least able to make one.',
          'Cap the clock, not the hours. A hard stop time protects your sleep and cannot be argued with. Pick it now, not at 10:55pm.',
          'Decide in advance how sessions end. A loss ends the night. That single rule kills the revenge queue, which is what turns a bad game into a lost evening.',
          'Add friction to the start, not just the finish. Log out fully, take it off the launch bar, keep it off startup. The cue still fires. Make it land on something that takes five steps.',
          'Judge it over a month, not a night. One broken rule is not evidence that moderation cannot work for you. Four weeks of the same rule breaking the same way is.',
        ],
      },
      {
        type: 'p',
        segments: [
          'If you are still unsure whether you need to change anything at all, the more useful question is what the hours are displacing rather than the total, which we went through in ',
          {
            text: 'how many hours of gaming is too much',
            href: '/writing/how-many-hours-of-gaming-is-too-much',
          },
          '. And if the two week break is the part you cannot get through, that difficulty has a predictable shape, which we set out in ',
          {
            text: 'what happens when you stop playing video games',
            href: '/writing/what-happens-when-you-stop-playing-video-games',
          },
          '.',
        ],
      },
      {
        type: 'h2',
        text: 'If moderation keeps failing',
      },
      {
        type: 'p',
        text: 'Some people find that every honest attempt at a limit collapses, over and over, and the useful thing is to stop reading that as a character verdict. It usually means one of two things: the break never happened, so the rule was always fighting a habit at full strength, or the game is doing a job that a rule cannot touch. If what shows up when the game is gone is heavier than boredom, that is worth talking to someone you trust about.',
      },
      {
        type: 'p',
        text: 'For the ordinary version, deciding once while it is easy is something software is genuinely better at than memory. Gaming Reset builds the daily plan from your own answers and tracks it automatically, so you see the real pattern rather than the one you assume, and the rule you set on Sunday is still there on Thursday.',
      },
      {
        type: 'p',
        text: 'You do not have to quit forever to get your evenings back. You do have to stop relying on a version of yourself who is tired, mid-session, and being asked to make a fresh decision every night. Decide once, while it is easy, and let the rule do the arguing.',
      },
    ],
    faq: [
      {
        q: 'Can you play video games in moderation?',
        a: 'For most people, yes. Researchers are clear that only a small proportion of people who play games ever lose control of it, and the criteria they use turn on impaired control, priority over other activities, and continuing despite harm rather than on hours played. Moderation tends to work well for people who play mainly to compete, improve, or socialise, and tends to fail for people who play mainly to escape.',
      },
      {
        q: 'Should I quit gaming or just cut back?',
        a: 'The evidence supports a middle path that most advice misses: take a short break first, then moderate. A 2022 study found that a two week gaming break reduced gaming time and daily stress, with effects still holding three months later. Participants returned to gaming, just less of it. If limits you set collapse the same night, a break is the more realistic first step than a stricter limit.',
      },
      {
        q: 'How do I set a gaming limit that actually works?',
        a: 'Phrase it as a specific if-then rule rather than a target number. A meta-analysis of 94 studies covering over 8,000 people found that if-then plans produced a medium-to-large improvement in goal achievement. "If it is a weeknight, then I do not open the game" works better than "about two hours a day", because it does not require a judgement call at the moment you are least able to make one.',
      },
      {
        q: 'Is it better to limit hours or set a cut-off time?',
        a: 'A cut-off time generally works better. It protects sleep, which is what late gaming most reliably damages, and it cannot be reinterpreted in the moment. One survey of 963 gamers found their bedtime slipped on 36 percent of the nights they played, by an average of 101 minutes. A total-hours cap still leaves you deciding when those hours happen.',
      },
      {
        q: 'Why do I keep breaking my own gaming limits?',
        a: 'Usually one of three reasons. The limit was vague, so it needed a fresh decision every night. The habit was never interrupted, so the rule was fighting a cue-driven pattern at full strength. Or the game is meeting a need a rule cannot reach, most often escape. That last one matters most: across surveys of gaming motives, escape is the one that lines up with gaming getting out of hand, and a time limit does nothing about what you were escaping.',
      },
    ],
  },
  {
    slug: 'how-to-quit-cs2',
    navLabel: 'How to Quit CS2',
    status: 'published',
    featured: false,
    category: 'Habits',
    title: 'How to Quit CS2 When You Have an Inventory and a Decade In',
    seoTitle: 'How to Quit CS2 for Good, Even With a Full Inventory',
    description:
      'How to quit CS2 when the rating resets, the cases keep dropping, and the inventory is worth real money. Why uninstalling fails, and a plan for all three.',
    excerpt:
      'You have quit Counter-Strike before. Then a friend queued, or a case dropped, and the muscle memory did the rest. CS is three habits stacked into one game, and uninstalling only interrupts one of them. Here is what each one is doing, and a plan that deals with all three.',
    author: 'Saad',
    publishedAt: '2026-07-31',
    updatedAt: '2026-07-31',
    dateLabel: 'Jul 2026',
    readTime: '9 min read',
    body: [
      {
        type: 'figure',
        src: '/writing/cs2-three-loops.svg',
        alt: 'The three habits inside Counter-Strike: the rating, which soft resets every season; the cases, a paid lottery that drops for free; and the inventory, which holds real money. Uninstalling interrupts only the rating.',
        caption: 'Pull the game off your drive and you have addressed roughly one third of the problem.',
        width: 1200,
        height: 630,
        eager: true,
      },
      {
        type: 'lede',
        text: 'You have quit Counter-Strike before. Maybe after a Premier season that ended worse than it started, maybe after a night that finished at four in the morning on a work day. Then a friend queued, or a case dropped, or you just wanted one before bed, and the muscle memory did the rest.',
      },
      {
        type: 'p',
        text: 'That is not a willpower problem. Counter-Strike is harder to leave than most games for a structural reason: it is three separate habits stacked into one game, and uninstalling only interrupts one of them. This is a guide to stopping properly, which means dealing with all three rather than the one that is easiest to see.',
      },

      { type: 'h2', text: 'CS2 is not one habit. It is three.' },
      {
        type: 'p',
        text: 'Most quitting advice treats a game as a single thing you either play or do not play. That works for games that are only a game. Counter-Strike stopped being only a game in 2013, when the first weapon case arrived and the whole thing quietly became three overlapping loops.',
      },
      {
        type: 'p',
        text: 'There is the rating, which resets every season so the climb never finishes. There is the case economy, a small paid lottery running in the background of every match you play. And there is the inventory, which for a lot of players is worth real money and functions as the most literal sunk cost in gaming. Each one hooks differently. Each one needs a different answer. Pull the game off your drive and you have addressed roughly one third of the problem, which is why the reinstall usually arrives within a fortnight.',
      },

      { type: 'h2', text: 'The rating resets, so you never actually arrive' },
      {
        type: 'p',
        text: 'Premier gives you a single number. Win ten placement matches and you get a CS Rating, which then moves after every game based on whether you won and how strong the opposition was. The best players in the world sit above 30,000. Most people are somewhere in the middle, watching it move.',
      },
      {
        type: 'p',
        text: 'The number is not the problem. The reset is. Every season does a soft recalibration: last season becomes a starting point and you play ten fresh placements to be sorted again. Whatever you achieved is now a suggestion. If you finished at 15,000 and told yourself you would stop once you got there, the game has already moved the line, and it will keep moving it for as long as the game exists.',
      },
      {
        type: 'p',
        segments: [
          'This is the same structure that keeps players on the League ladder, and it works for the same reason: a target you can reach is a target you can walk away from, while a target that resets is a subscription to the chase. If you have read ',
          { text: 'how to quit League of Legends', href: '/writing/how-to-quit-league-of-legends' },
          ', the shape will be familiar. What CS adds is that the rating is only the first of three.',
        ],
      },
      {
        type: 'p',
        text: 'There is a second layer worth knowing about. Valve runs a hidden rating alongside the one you can see, and the gap between the two affects how much you gain or lose per match. So a losing run that feels like it is not tracking your actual play often genuinely is not tracking the number you are watching. You are chasing a figure that sits downstream of a figure you cannot see, which is an efficient way to keep someone queueing to find out.',
      },

      { type: 'h2', text: 'The cases are a slot machine you already own' },
      {
        type: 'p',
        text: 'A case drops at the end of a match. You did not buy it, you did not ask for it, and it costs money to open. That is the entire design, and it is extremely good at what it does.',
      },
      {
        type: 'p',
        text: 'The odds are at least published, which is more than most games manage. They were disclosed in 2017 after Chinese regulators required loot box probabilities to be made public. Across standard cases the split is roughly 79.92 percent Mil-Spec, 15.98 percent Restricted, 3.20 percent Classified, 0.64 percent Covert, and 0.26 percent for a knife or gloves. That last figure is about one in 385.',
      },
      {
        type: 'figure',
        src: '/writing/cs2-case-odds.svg',
        alt: 'The published CS2 case odds drawn to scale: 79.92 percent Mil-Spec, 15.98 percent Restricted, 3.20 percent Classified, 0.64 percent Covert, and 0.26 percent for a knife or gloves, roughly one in 385 cases.',
        caption: 'Drawn to scale, the tier everyone opens for is a sliver you can barely see.',
        width: 1200,
        height: 630,
      },
      {
        type: 'p',
        text: 'One in 385 is not a scam. It is disclosed, it is consistent across cases, and it is precisely the point. An uncertain reward on an unpredictable schedule is the most durable way anyone has found to keep a behaviour running, which is why the case interface has a spinning animation rather than a results screen. The animation is not decoration. It is the product.',
      },
      {
        type: 'p',
        segments: [
          'There is research on this specifically. ',
          {
            text: 'Zendle and Cairns surveyed 7,422 players in 2018',
            href: 'https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0206767',
          },
          ' and found that the more someone spent on loot boxes, the more severe their problem gambling score tended to be, with the effect substantially stronger for loot boxes than for ordinary in-game purchases. ',
          {
            text: 'A replication the following year',
            href: 'https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0213194',
          },
          ' found non-problem gamblers spent around 11 dollars a month on loot boxes against roughly 38 dollars for problem gamblers. Neither study shows that cases cause anything, and the authors are careful about that. What they establish is that the overlap is real and it is not small.',
        ],
      },

      { type: 'h2', text: 'The inventory is a sunk cost with a price tag on it' },
      {
        type: 'p',
        text: 'Here is where Counter-Strike is genuinely different from Valorant or League. Your Valorant skins are yours and worth nothing to anyone else. Your CS inventory has a market value you can look up, and plenty of players have more money sitting in it than they ever spent on games.',
      },
      {
        type: 'p',
        segments: [
          'That turns an ordinary psychological trap into a financial one. Sunk cost is the tendency to keep investing in something because of what you have already put in, even when carrying on is the worse choice. It has been studied since at least ',
          {
            text: 'a 1985 paper in Organizational Behavior and Human Decision Processes',
            href: 'https://www.sciencedirect.com/science/article/abs/pii/0749597885900494',
          },
          ', and it does not need money to work. Hours alone are enough. But money makes it louder, and a number you can refresh on a market page makes it louder still.',
        ],
      },
      {
        type: 'p',
        text: 'The thought usually runs: if I stop playing, all of that was a waste. It is worth noticing that this is backwards. The money is spent either way. The skins hold whatever value they hold whether you queue tonight or not. Playing more does not recover anything, it only adds hours to the pile you will feel bad about leaving next time you try.',
      },
      {
        type: 'p',
        segments: [
          'It is worth seeing the opposite arrangement to understand this one. In ',
          {
            text: 'EA FC, Ultimate Team deletes your entire club every September',
            href: '/writing/how-to-quit-ea-fc-ultimate-team',
          },
          ' and carries forward only the currency you paid for. The asset is destroyed on a known date, and people rebuild it anyway. Which is a useful thing to know while you are staring at an inventory page, because it suggests the attachment was never really about what the items were worth.',
        ],
      },

      { type: 'h2', text: 'Why "just uninstall it" does almost nothing' },
      {
        type: 'p',
        text: 'The uninstall is about ninety seconds of friction. Steam stays on the machine, your friends list still lights up, and the download will finish while you make food. Meanwhile the two habits that actually run you are untouched: the rating is waiting exactly where you left it, and the inventory never went anywhere.',
      },
      {
        type: 'p',
        segments: [
          'There is also the ordinary habit problem underneath. Research on daily behaviour suggests ',
          {
            text: 'roughly 43 percent of what people do each day',
            href: 'https://dornsife.usc.edu/wendy-wood/wp-content/uploads/sites/183/2023/10/Wood.Quinn_.Kashy_.2002_Habits_in_everyday_life.pdf',
          },
          ' is performed habitually, in a stable context, with very little deliberation. The context here is not the desktop icon. It is the chair, the hour, the friend who messages "queue?", and the specific dead half hour after dinner when you have always opened Steam. Remove the game and leave all of that in place and you have removed a symptom.',
        ],
      },

      { type: 'h2', text: 'How to quit CS2, step by step' },
      {
        type: 'ol',
        items: [
          'Decide whether you are stopping entirely or cutting back, and pick one before you do anything else. Both are legitimate. What does not work is starting without knowing, because every hard moment then becomes a negotiation you have to win again.',
          'Close the season deliberately rather than drifting out of it. Either finish the placements you have started or accept out loud that this season is done. An open season is an unfinished task, and unfinished tasks are the thing your brain keeps handing back to you at eleven at night.',
          'Deal with the inventory before you deal with the game. Not necessarily by selling it. Moving it to a second account, or simply deciding in writing that you are not touching it for ninety days, removes the daily price check. If you do sell, do it once and deliberately, not in pieces on bad evenings.',
          'Leave the cases unopened. You cannot turn off the drops, but you can decide that unopened is the default. The pull is in the spin, not in the skin, and an unopened case in a stash tab is inert in a way an opened one never is.',
          'Tell the two or three people who actually queue with you. Not an announcement, just a message. The social pull in CS is specific and personal, and it is much easier to decline a queue invite that already knows the answer.',
          'Book the hours before you free them. Three or four evenings a week suddenly have a hole in them, and an empty evening at nine is when reinstalls happen. Put something in the slot in advance, even something small.',
          'Decide now what you will do the first time you want to reinstall, because you will. Write down the actual sentence you will use on yourself, and where you will be sitting when you use it. A decision made in advance is worth ten made at midnight.',
        ],
      },
      {
        type: 'p',
        segments: [
          'If cutting back is what you actually want rather than stopping, the mechanics are different and the evidence points somewhere specific: ',
          { text: 'how to play video games in moderation', href: '/writing/how-to-play-video-games-in-moderation' },
          ' covers what tends to work and who it tends to fail for.',
        ],
      },

      { type: 'h2', text: 'What the first two weeks actually feel like' },
      {
        type: 'p',
        segments: [
          'The first few days are usually easier than expected and the second week is usually harder. The urge arrives on a schedule rather than continuously, and it is tied to the times you used to play, which is why evenings are the test and mornings are not. ',
          {
            text: 'What happens when you stop playing video games',
            href: '/writing/what-happens-when-you-stop-playing-video-games',
          },
          ' goes through the timeline in more detail, but the short version is that the discomfort is real, it is not medical, and it fades on a scale of weeks rather than months.',
        ],
      },
      {
        type: 'p',
        text: 'The CS-specific part is the tab. You will open the market page, or check what a skin is going for, and tell yourself it is not the same as playing. It is not the same, but it is the same habit loop with the game removed, and it is the single most common route back in. Treat the market page as part of the thing you are stopping.',
      },

      { type: 'h2', text: 'When it is about more than the game' },
      {
        type: 'p',
        segments: [
          'Sometimes the game is the problem and removing it is enough. Sometimes it is the place you go when the rest of the day has been too much, and then a plan built around uninstalls and inventory decisions will not hold, because none of it touches the reason. Across surveys of why people play, ',
          {
            text: 'escape is the motive that lines up most closely with gaming getting out of hand',
            href: 'https://www.sciencedaily.com/releases/2019/10/191022121123.htm',
          },
          ', more so than competition or achievement.',
        ],
      },
      {
        type: 'p',
        segments: [
          'That is worth being honest with yourself about before you start, because it changes what you are actually doing. If the honest answer is that CS is where you go to not think about something else, the game is not really the project. Nothing here is professional advice, and when gaming is tangled up with something heavier, talk to someone you trust. If you want the version of this that applies to any game rather than this one, ',
          {
            text: 'why competitive games are engineered to keep you hooked',
            href: '/writing/why-dota-is-engineered-to-keep-you-hooked',
          },
          ' is the place to start.',
        ],
      },
    ],
    faq: [
      {
        q: 'Why is CS2 so hard to quit?',
        a: 'Because it is three habits rather than one. The Premier rating soft resets every season, so the climb never finishes and there is no natural point at which you have arrived. The cases are an uncertain reward on an unpredictable schedule, which is the most durable pattern for keeping a behaviour going. And the inventory holds real money you can look up, which turns ordinary sunk cost into a financial one. Uninstalling interrupts the first and leaves the other two running.',
      },
      {
        q: 'Should I sell my CS2 skins if I want to quit?',
        a: 'Not necessarily, and not in a hurry. The useful thing is removing the daily price check rather than the skins themselves, so moving the inventory to a second account or committing in writing to not touching it for ninety days often does the same job. If you do decide to sell, do it once and deliberately. Selling in pieces on bad evenings tends to keep you on the market page, which is the habit you are trying to leave.',
      },
      {
        q: 'How long does it take to stop wanting to play CS2?',
        a: 'Most people find the first few days easier than expected and the second week harder. Urges arrive tied to the hours you used to play rather than continuously, so evenings are the difficult part and mornings usually are not. The discomfort tends to fade on a scale of weeks rather than months. It is uncomfortable, not dangerous, and it is not a withdrawal syndrome in any clinical sense.',
      },
      {
        q: 'Can I just play CS2 casually instead of quitting?',
        a: 'For plenty of people, yes. Moderation tends to work for players whose pull is competition or socialising, and tends to fail for players whose pull is escape. The practical catch in CS is that casual play still drops cases and Premier still resets, so the two loops that are not the game itself carry on regardless. If you want to moderate, it usually helps to take a short break first and set a rule about when you play rather than how long.',
      },
      {
        q: 'Why do I keep reinstalling CS2 after I quit?',
        a: 'Because uninstalling removes about ninety seconds of friction and nothing else. Steam is still installed, the friends list still lights up, and roughly 43 percent of daily behaviour runs habitually off context rather than decisions. The cue is not the desktop icon, it is the chair, the hour and the message asking if you are queueing. Unless those change, the reinstall is only a matter of when.',
      },
      {
        q: 'Is opening CS2 cases gambling?',
        a: 'Legally it depends on the jurisdiction and the answer keeps changing. What the research shows is that the overlap is real: a 2018 survey of 7,422 players found that heavier loot box spending tracked with more severe problem gambling scores, and a replication the next year found non-problem gamblers spent about 11 dollars a month against roughly 38 for problem gamblers. That is a correlation rather than proof of cause, but it is a consistent one, and the mechanic is designed around uncertainty in the same way.',
      },
    ],
  },

  {
    slug: 'how-to-quit-ea-fc-ultimate-team',
    navLabel: 'How to Quit EA FC',
    status: 'published',
    featured: false,
    category: 'Habits',
    title: 'How to Quit EA FC When Ultimate Team Wipes Your Club Anyway',
    seoTitle: 'How to Quit EA FC Ultimate Team (and the FIFA Habit)',
    description:
      'Ultimate Team deletes your club every year and keeps only what you paid. How to quit EA FC when the packs, the Web App and the FIFA habit all pull back.',
    excerpt:
      'Every September, EA deletes your entire Ultimate Team club. Every card, every coin, every unopened pack. The only thing that carries over is the money you gave it. You have already quit this game several times without meaning to. Here is how to do it once and have it hold.',
    author: 'Saad',
    publishedAt: '2026-07-31',
    updatedAt: '2026-07-31',
    dateLabel: 'Jul 2026',
    readTime: '9 min read',
    body: [
      {
        type: 'figure',
        src: '/writing/ea-fc-carryover.svg',
        alt: 'What carries over between EA Sports FC releases in Ultimate Team: only the FC Points you paid for, your club name and your Rivals division rank. Every player card, every coin, every unopened pack and all season XP are deleted.',
        caption: 'The only thing Ultimate Team carries into the next game is the money you gave it.',
        width: 1200,
        height: 630,
        eager: true,
      },
      {
        type: 'lede',
        text: 'You have quit EA FC before, and you did not have to decide anything. Every September the new game arrives, your club is gone, your coins are gone, and every card you spent a season chasing has been deleted. Then you buy it again, open the first pack, and the whole thing restarts on the same evening it always did.',
      },
      {
        type: 'p',
        text: 'That is the strange thing about Ultimate Team. It is the only habit in this series where the game itself does the quitting for you once a year, on schedule, without asking. And it still does not stick. Working out why is most of the job, because the reason turns out not to be willpower, and it is definitely not football.',
      },
      {
        type: 'p',
        text: 'One note before any of it, since half the people reading this searched for the old name. The series was called FIFA until 2023, when the licensing deal with football\'s governing body ended and EA renamed it EA Sports FC. Nothing about the habit changed with the badge. Ultimate Team is the same mode it was under FIFA, the packs work the same way, and everything below applies whether you still say FIFA or you have got used to saying FC.',
      },

      { type: 'h2', text: 'Ultimate Team is not really a football game' },
      {
        type: 'p',
        text: 'Career Mode is a football game. Clubs is a football game. Ultimate Team is a card economy with football attached, and that distinction matters far more than it sounds when you are trying to leave.',
      },
      {
        type: 'p',
        text: 'The loop has almost nothing to do with playing well. You want a better squad. A better squad needs better cards. Cards come from coins or from packs. Coins come from grinding matches, trading the market, or completing objectives on a timer. Packs come from rewards, from Squad Building Challenges, or from money. So the football is the part that generates currency, and the currency is what you are actually playing for. Notice how many of your recent sessions ended with you checking prices rather than checking your record.',
      },
      {
        type: 'p',
        text: 'This is why "I will just play less" tends to fail here in a way it does not in other games. Cutting your matches in half does not cut the habit in half, because the habit is not sitting in the matches. It is sitting in the market, the pack animation, and the reward timers, and all three of those are still running whether you played today or not.',
      },

      { type: 'h2', text: 'You have already quit. Every September, EA does it for you.' },
      {
        type: 'p',
        text: 'When the next game arrives, here is what comes with you: your FC Points balance, your club name, and your Rivals division rank. That is the whole list. Everything else is deleted.',
      },
      {
        type: 'p',
        text: 'Every player card goes. Every coin goes back to zero. Unopened packs do not transfer. Unassigned items do not transfer. Your season XP resets. A year of evenings, a year of weekend leagues, a year of pack luck, all of it wiped in one release. The single thing the game is careful to preserve is the currency you paid real money for.',
      },
      {
        type: 'quote',
        text: 'Ultimate Team destroys everything you earned and protects everything you bought. That is not an accident, and it tells you exactly what the product is.',
      },
      {
        type: 'p',
        segments: [
          'Now sit with what that means. In most games, the thing that keeps you playing is sunk cost: the hours are stored, displayed, and impossible to walk away from. It is the effect Hal Arkes and Catherine Blumer documented in ',
          {
            text: 'a 1985 paper in Organizational Behavior and Human Decision Processes',
            href: 'https://www.sciencedirect.com/science/article/abs/pii/0749597885900494',
          },
          ', and it is the reason a CS inventory or a Dota account is so hard to abandon.',
        ],
      },
      {
        type: 'p',
        segments: [
          'Ultimate Team removes that asset annually, and you come back anyway. So the cards were never really what held you. Compare it with ',
          { text: 'the way a CS2 inventory works', href: '/writing/how-to-quit-cs2' },
          ', where the skins have a price you can look up and the sunk cost is genuinely financial, or with ',
          { text: 'an MMO account like World of Warcraft', href: '/writing/how-to-quit-world-of-warcraft' },
          ', where nothing is ever deleted and a decade of characters waits for you indefinitely. In FUT the club is worth nothing to anyone, expires on a known date, and people still grind it for a year. Something else is doing the work, and it is not the squad.',
        ],
      },

      { type: 'h2', text: 'The packs are the product, and the fine print says so' },
      {
        type: 'p',
        segments: [
          'Open the store and every pack you can buy with FC Points has a ',
          {
            text: 'Show Pack Probabilities option published by EA',
            href: 'https://www.ea.com/games/ea-sports-fc/news/fc-pack-probabilities',
          },
          '. That page is worth reading once, all the way through, because EA is unusually direct in it. The percentages you see are for a category, not a player, and EA states plainly that because of the number of items in the game, the chance of getting a particular individual item is often less than one percent.',
        ],
      },
      {
        type: 'p',
        text: 'So the walkout you are opening for is not a five percent chance. Five percent is the odds of something in that band. The specific card you actually want sits somewhere under one in a hundred, and the game does not have to hide that, because disclosure has never been what makes this mechanic work.',
      },
      {
        type: 'p',
        text: 'What makes it work is the wait. The pack opens with a slow reveal, a colour, a light, a pause before the rating. None of that is required to hand you a card. It exists because an uncertain reward delivered on an unpredictable schedule is the single most durable way anyone has found to keep a behaviour running. The animation is not presentation. It is the mechanism.',
      },
      {
        type: 'p',
        segments: [
          'Regulators noticed a long time ago, back when this was still FIFA Ultimate Team. In 2018 the Belgian Gaming Commission ruled that ',
          {
            text: 'paid loot boxes amount to gambling under Belgian law',
            href: 'https://www.bbc.com/news/technology-43906306',
          },
          '. EA resisted for most of a year and then gave up, pulling the sale of points in Belgium at the start of 2019. The Netherlands went further and then reversed: the gambling authority moved to fine EA up to ten million euros, and in 2022 the highest administrative court ',
          {
            text: 'threw the penalty out, ruling the packs were part of a broader game of skill',
            href: 'https://cms-lawnow.com/en/ealerts/2022/03/dutch-court-rules-fifa-loot-boxes-not-a-game-of-chance-revokes-ea-penalty',
          },
          '. Two regulators looked at the same mechanic and could not agree on what it was. That is not a fact about EA. It is a description of how close to a line this sits.',
        ],
      },

      { type: 'h2', text: 'What 1,144 Ultimate Team players actually reported' },
      {
        type: 'p',
        segments: [
          'There is one large study aimed at exactly this mode. Jeroen Lemmens surveyed 1,144 Ultimate Team players and published the results in ',
          {
            text: 'Telematics and Informatics Reports in 2022',
            href: 'https://doi.org/10.1016/j.teler.2022.100023',
          },
          '. The survey ran while the game was still called FIFA, so its questions all name FIFA rather than FC, but the mode it is describing is the one you are playing now. The numbers are worth reading slowly, because most people quietly assume they are the extreme case.',
        ],
      },
      {
        type: 'ul',
        items: [
          'Players in the sample averaged just under 17 hours a week in Ultimate Team alone.',
          'Thirty nine percent said they could not stop themselves starting the game even when they knew they should be doing something else.',
          'Thirty one percent said they felt bad when they could not play.',
          'Twenty two percent reported problems with work, studies or a relationship because of the time it took.',
          'Fifteen percent reported serious conflicts with family or a partner over it.',
          'Fourteen percent had got into trouble over how much money they had spent.',
          'About a third had spent nothing at all on packs, while roughly one in five had spent more than two hundred dollars in a single year.',
        ],
      },
      {
        type: 'p',
        segments: [
          'Read that honestly. These are self-reports from people who volunteered for a survey about FIFA, so the sample leans toward the engaged end and none of it is a population estimate or a diagnosis. What it is good for is scale. If you have had the argument about how much you play, or quietly stopped mentioning what you spent, you are not an outlier, you are in a very large and very ordinary group. Seventeen hours a week is close to a part time job, which is easier to see when you ',
          { text: 'put your own weekly hours through a calculator', href: '/gaming-time-calculator' },
          ' than when you estimate it in your head.',
        ],
      },

      { type: 'h2', text: 'Why uninstalling the game does almost nothing' },
      {
        type: 'figure',
        src: '/writing/ea-fc-three-doors.svg',
        alt: 'Ultimate Team runs on three surfaces: the game on console or PC, the Companion app on your phone, and the Web App in any browser. Uninstalling the game closes only the first and leaves packs, the transfer market and Squad Building Challenges open on the other two.',
        caption: 'Delete the game and the market, the packs and the rewards are still one tab away.',
        width: 1200,
        height: 630,
      },
      {
        type: 'p',
        segments: [
          'This is where EA FC is genuinely different from every other game in this series. Ultimate Team does not need the game to be installed. ',
          {
            text: 'The official Web App runs in any browser',
            href: 'https://www.ea.com/games/ea-sports-fc/ultimate-team/web-app',
          },
          ', and the Companion app does the same job from your phone. Between them you can open packs, buy and sell on the transfer market, complete Squad Building Challenges, run Evolutions, and claim your Rivals and Champions rewards, with the console switched off and the disc in a drawer.',
        ],
      },
      {
        type: 'p',
        text: 'So the uninstall you were planning removes the one surface you use least often. The transfer market unlocks on the Web App once you have played three Ultimate Team matches in a day, and after that it simply lives there. Plenty of people spend more time in Ultimate Team on a phone at a bus stop than they ever do with a controller, and never once counted it as playing.',
      },
      {
        type: 'p',
        segments: [
          'Underneath that sits the ordinary habit problem. Research on daily behaviour suggests ',
          {
            text: 'roughly 43 percent of what people do each day',
            href: 'https://dornsife.usc.edu/wendy-wood/wp-content/uploads/sites/183/2023/10/Wood.Quinn_.Kashy_.2002_Habits_in_everyday_life.pdf',
          },
          ' is repeated in a stable context with very little deliberation. The cue here is not a console. It is the phone in your hand during a dead five minutes, which is a cue that follows you into every room you own.',
        ],
      },

      { type: 'h2', text: 'Why "just play Career Mode" does not work either' },
      {
        type: 'p',
        text: 'It is the most common substitution, and it almost always fails within a fortnight. Career Mode has no market, no weekend league, no reward timer and no pack. Which is precisely why it feels flat: you removed the football you were not really playing for and kept the football you were.',
      },
      {
        type: 'p',
        segments: [
          'If Career Mode feels boring after Ultimate Team, that is not a verdict on Career Mode. It is information about what you had been getting from the game, and it is the same signal that shows up when a game you loved for years stops landing. ',
          {
            text: 'Why video games are not fun anymore',
            href: '/writing/why-video-games-are-not-fun-anymore',
          },
          ' goes through that gap between wanting something and enjoying it, which is the whole distance between a pack animation and a match.',
        ],
      },

      { type: 'h2', text: 'How to quit EA FC Ultimate Team, step by step' },
      {
        type: 'ol',
        items: [
          'Decide whether you are stopping Ultimate Team or stopping EA FC, and say which one out loud. They are different projects. Plenty of people keep Career Mode or Clubs and lose nothing. What does not work is starting without deciding, because every hard evening then becomes an argument you have to win again.',
          'Pick the date now instead of waiting for a quiet week. There is no quiet week. Team of the Year, Team of the Season, Futties, Black Friday, the promo calendar is built with no gap in it on purpose. If you are waiting for a natural stopping point, the game is specifically designed never to give you one.',
          'Delete the Companion app from your phone first, before you touch the game. It is the surface you use most and the one nobody thinks to remove. Doing it in this order matters, because deleting the game first just moves all of your usage onto the phone and hides it from you.',
          'Sign out of the Web App and delete the bookmark, including on the work machine. Sign out of the EA account in that browser so getting back in takes a password and a code rather than a click. The point is not that this is impossible to undo. The point is that it takes ninety seconds you can notice yourself spending.',
          'Deal with the FC Points balance deliberately. A leftover balance is an open loop, and open loops get closed at eleven at night. Spend it once and be done, or write down that you are treating it as gone. Do not leave it sitting there to be used up sensibly later.',
          'Say the thing about the club that is already true. You are not selling it and you are not losing it, because it is being deleted this September either way. Naming that removes the one argument sunk cost still has, and it is a lot easier to let go of something on a schedule you can already see.',
          'Tell the two or three people you actually play with, and be specific that this includes the group chat where the pack videos land. The social pull in FUT is not really the queue. It is somebody sending you a screenshot of what they packed.',
          'Book the weekend before you free it. This is the Ultimate Team specific one. Champions runs across the weekend, so quitting does not leave you with a spare evening, it leaves you with a spare weekend, which is a much bigger hole and a much worse one to face empty.',
        ],
      },
      {
        type: 'p',
        segments: [
          'If cutting back rather than stopping is what you actually want, that is a legitimate goal and the mechanics are different. ',
          {
            text: 'How to play video games in moderation',
            href: '/writing/how-to-play-video-games-in-moderation',
          },
          ' covers what the evidence supports and, more usefully, who it tends to fail for.',
        ],
      },

      { type: 'h2', text: 'What the first two weeks actually feel like' },
      {
        type: 'p',
        segments: [
          'The first few days are usually easier than people expect and the second week is usually harder. Urges arrive on a schedule rather than continuously, tied to the times you used to play. ',
          {
            text: 'What happens when you stop playing video games',
            href: '/writing/what-happens-when-you-stop-playing-video-games',
          },
          ' walks through that timeline properly. The short version is that the discomfort is real, it is not medical, and it fades on a scale of weeks.',
        ],
      },
      {
        type: 'p',
        text: 'Two parts are specific to this game. The first is the phone. You will reach for a Companion app that is no longer installed, in a queue or a lift, and the reach itself will surprise you, because you never thought of that as gaming. The second is the weekend. Every other habit in this series is an evening problem. This one takes the weekend, because that is when Champions runs, and the first free Saturday is the real test rather than the first free Tuesday.',
      },
      {
        type: 'p',
        segments: [
          'There is also a version of the market tab that people underestimate. Watching price videos, reading squad content, or checking what a card is going for is not playing, but it is the same loop with the match removed, and it is the most common route back in. If you are unsure how much of your week this quietly accounts for, ',
          {
            text: 'how many hours of gaming is too much',
            href: '/writing/how-many-hours-of-gaming-is-too-much',
          },
          ' makes the case that the total matters less than what it is displacing.',
        ],
      },

      { type: 'h2', text: 'When it is about more than the game' },
      {
        type: 'p',
        segments: [
          'Sometimes the game is the problem and taking it away is enough. Sometimes it is where you go when the rest of the day has been too much, and then a plan built out of uninstalls and sign outs will not hold, because none of it touches the reason. Across surveys of why people play, ',
          {
            text: 'escape is the motive that lines up most closely with gaming getting out of hand',
            href: 'https://www.sciencedaily.com/releases/2019/10/191022121123.htm',
          },
          ', more so than competition or achievement.',
        ],
      },
      {
        type: 'p',
        text: 'There is a second version of that here, and it is about money rather than time. If the honest problem is what you have spent, rather than what you have played, then this is not really a gaming article you need. Say the number out loud to one person you trust. It is almost always smaller than the version you have been carrying around alone, and it stops being a secret the moment it is said.',
      },
      {
        type: 'p',
        segments: [
          'Nothing here is professional advice, and when gaming is tangled up with something heavier, talk to someone you trust. If you want the general version of all of this rather than the EA FC one, ',
          {
            text: 'why competitive games are engineered to keep you hooked',
            href: '/writing/why-dota-is-engineered-to-keep-you-hooked',
          },
          ' is the place to start, and the machinery is the same in every game that has one.',
        ],
      },
    ],
    faq: [
      {
        q: 'Why is EA FC Ultimate Team so hard to quit?',
        a: 'Because the habit is not in the football. Ultimate Team, in EA FC and in FIFA before it, is a card economy, and the loop runs on packs, the transfer market and reward timers rather than on matches. Cutting your playing time in half does not halve any of that. It also runs on three surfaces, so the game, the Companion app and the browser Web App all have to be dealt with rather than just the one you can uninstall.',
      },
      {
        q: 'Does anything carry over from one EA FC to the next?',
        a: 'Very little, and the pattern is telling. Your FC Points balance, your club name and your Rivals division rank carry forward. Every player card, every coin, every unopened pack, every unassigned item and all of your season XP are deleted. In other words the game preserves what you paid for and destroys what you earned, which is worth knowing before you spend another year building a squad with an expiry date on it.',
      },
      {
        q: 'Is opening Ultimate Team packs gambling?',
        a: 'It depends who you ask and where you are, which is itself the answer. Belgium ruled in 2018 that paid loot boxes amount to gambling and EA stopped selling the points there. The Dutch gambling authority moved to fine EA up to ten million euros, and in 2022 the highest administrative court overturned it, ruling the packs formed part of a broader game of skill. Two regulators, the same mechanic, opposite conclusions.',
      },
      {
        q: 'Should I switch to Career Mode instead of Ultimate Team?',
        a: 'You can, and for some people it works, but expect it to feel flat for a while. Career Mode has no market, no packs, no weekend league and no reward timers, which is exactly what made Ultimate Team compelling. If Career Mode feels boring afterwards, that is useful information rather than a problem: it tells you what you had actually been playing for, and it is usually not the football.',
      },
      {
        q: 'How do I stop spending money on FC Points?',
        a: 'Remove the payment method from the console and store account rather than relying on a rule, and clear any existing FC Points balance deliberately instead of leaving it to be used up later, because a leftover balance is an open loop that gets closed on a bad evening. If the amount you have spent is the part that worries you most, say the number out loud to one person you trust. It is almost always smaller than the version you carry around privately.',
      },
      {
        q: 'How long does it take to stop wanting to play Ultimate Team?',
        a: 'Most people find the first few days easier than expected and the second week harder, with urges arriving tied to the hours they used to play rather than continuously. The discomfort tends to fade on a scale of weeks rather than months. The difference with this game is that the hard slot is the weekend rather than the evening, because Champions occupied two full days, so the first free Saturday is the real test.',
      },
    ],
  },

  {
    slug: 'how-to-quit-world-of-warcraft',
    navLabel: 'How to Quit WoW',
    status: 'published',
    featured: false,
    category: 'Habits',
    title: 'How to Quit World of Warcraft When You Never Really Left',
    seoTitle: 'How to Quit World of Warcraft and Actually Stay Quit',
    description:
      'You have quit World of Warcraft before and it did not hold. Here is what is really keeping you: the subscription, the raid calendar and the weekly reset.',
    excerpt:
      'You have cancelled the subscription before, probably more than once. Then an expansion was announced, the old guild chat woke up, and you were back inside a week. The client was never the thing holding you, which is why deleting it has never been enough.',
    author: 'Saad',
    publishedAt: '2026-07-31',
    updatedAt: '2026-07-31',
    dateLabel: 'Jul 2026',
    readTime: '9 min read',
    body: [
      {
        type: 'figure',
        src: '/writing/wow-three-locks.svg',
        alt: 'Uninstalling World of Warcraft removes the client and nothing else. The recurring subscription keeps billing, the guild raid calendar still has your name on it, and the weekly reset still turns a week away into an empty Great Vault.',
        caption: 'The client is the only one of the four that lives on your hard drive.',
        width: 1200,
        height: 630,
        eager: true,
      },
      {
        type: 'lede',
        text: 'You have quit World of Warcraft before. Probably more than once. You cancelled the subscription, told the guild you were done, maybe even deleted the folder, and for a few months it held. Then a new patch got announced, the old chat woke up, and you were standing in a capital city at eleven at night wondering how that happened again.',
      },
      {
        type: 'p',
        text: 'Here is the thing almost no quitting guide says out loud. Every other game you leave by walking away from it. This one you leave by ending a billing relationship, a set of appointments with other people, and a weekly schedule that keeps running whether you are there or not. An uninstall touches none of the three. That is why the game has collected you back every time, and why it is set up to do it again on a date you could go and look up right now.',
      },
      {
        type: 'p',
        text: 'One note before the rest of it. All of this applies to retail World of Warcraft and to Classic, and to whichever seasonal version is current when you read it. The content differs. The parts that actually hold you are the parts every version shares, which is most of the point.',
      },

      { type: 'h2', text: 'It is the only game you pay rent on' },
      {
        type: 'p',
        segments: [
          'A subscription is a strange thing to defend, and worth looking at directly. In most games the money is spent once, or spent on items. In WoW it buys access by the month, and Blizzard describes the arrangement plainly in its own support pages: a ',
          {
            text: 'subscription recurs at the rate you chose',
            href: 'https://us.support.blizzard.com/en/article/32539',
          },
          ', monthly or every three, six or twelve months, using your saved payment method, until you pause or cancel it.',
        ],
      },
      {
        type: 'p',
        text: 'Which means there is a number you already know and have probably never said. How many months in the last three years did you pay for and barely log into? That money did not buy playing. It bought the option to play, and the option is the actual product. A game you are still paying for is a game you have not finished arguing with.',
      },
      {
        type: 'p',
        segments: [
          'Then there is the token, which is worth understanding even if you have never bought one. Blizzard\'s own announcement sets it out: you buy a ',
          {
            text: 'WoW Token with real money and sell it for gold',
            href: 'https://worldofwarcraft.blizzard.com/en-us/news/18141101',
          },
          ' through the Auction House, and whoever buys it with gold redeems it for 30 days of game time. Two players, one bill, no cash leaving the second one\'s account.',
        ],
      },
      {
        type: 'p',
        text: 'The version people say out loud is "I play for free, I pay for it with gold." Read that sentence again with fresh eyes. You are farming to cover a bill. The game did not stop charging you when you started using tokens. It started taking the payment in evenings instead of pounds, which is the more expensive currency and the one you cannot earn more of.',
      },
      {
        type: 'quote',
        text: 'A subscription you keep paying through the months you do not play is not the cost of a hobby. It is a retainer on an identity you have not decided to give up yet.',
      },

      { type: 'h2', text: 'You have never quit. You have unsubscribed.' },
      {
        type: 'p',
        segments: [
          'This is the structural difference between this game and every other one people write quit guides about. Nothing you built is ever destroyed. Your characters sit there at the level you left them, in the gear you left them in, for as many years as you like. Compare that with ',
          { text: 'the way Ultimate Team wipes your entire club every September', href: '/writing/how-to-quit-ea-fc-ultimate-team' },
          ', deletes the cards and the coins, and keeps only what you paid for. Warcraft does the opposite. It keeps everything and asks nothing while you are gone.',
        ],
      },
      {
        type: 'p',
        segments: [
          'The game is also comfortable telling you this. Blizzard periodically runs a promotion where, in its own words, it gives ',
          {
            text: 'all players with inactive accounts full access to the game and all your characters',
            href: 'https://worldofwarcraft.blizzard.com/en-us/news/24115321',
          },
          ' without a subscription for a few days. You have to have had a subscription before to qualify. It is not aimed at new players. It is aimed at you.',
        ],
      },
      {
        type: 'p',
        text: 'So every time you have quit, what you actually did was end a payment. The account did not close. The characters did not go anywhere. There was never a moment where the door shut, only a month where the card was not charged. Naming that is not a criticism of you. It is the most useful sentence on this page, because it means you have never once run the experiment you thought you were running.',
      },

      { type: 'h2', text: 'The raid night is the lock, and it is not made of loot' },
      {
        type: 'p',
        text: 'Ask someone why they cannot stop and they will talk about the gear, or the alt they are levelling, or how much time they have put in. Watch what actually pulls them back on a Wednesday and it is none of those. It is that nineteen other people have Wednesday in a calendar, and one of them will notice.',
      },
      {
        type: 'p',
        segments: [
          'There is decent evidence that the social layer is where the grip is. Joel Billieux and colleagues recruited 690 players and, in a study published in ',
          {
            text: 'Computers in Human Behavior in 2013',
            href: 'https://doi.org/10.1016/j.chb.2012.07.021',
          },
          ', matched their stated reasons for playing against eight months of what their characters actually did, pulled from the game\'s own armory database rather than from self report. Teamwork and competition motives turned out to be the sharpest predictors of fast progression through the game.',
        ],
      },
      {
        type: 'p',
        text: 'The same work is worth citing for the part that cuts the other way, because it is the honest half. Playing a great deal was not, by itself, reliably tied to a negative effect on daily life. Certain motives were, escapism and advancement among them, but sheer hours were not the dividing line. If you play a lot and the rest of your life is genuinely fine, this article is not describing you, and you are allowed to close it.',
      },
      {
        type: 'p',
        segments: [
          'For everyone else, the mechanism is worth being precise about. You are not choosing between playing and not playing. You are choosing between showing up and letting nine or nineteen people down, which is a completely different decision and a much harder one. ',
          {
            text: 'The way competitive games manufacture that obligation',
            href: '/writing/why-dota-is-engineered-to-keep-you-hooked',
          },
          ' is deliberate design, not an accident of playing with friends, and knowing that makes it much easier to cancel a commitment without treating it as a betrayal.',
        ],
      },

      { type: 'h2', text: 'The weekly reset turns a week off into a loss' },
      {
        type: 'p',
        segments: [
          'Underneath the raid sits the quieter machinery, and it runs on a clock. The Great Vault fills according to what you completed in a given week, and Blizzard\'s support pages are blunt about the consequence: if you ',
          {
            text: 'did not complete any objectives before the weekly reset',
            href: 'https://us.support.blizzard.com/en/article/281317',
          },
          ', there is nothing there to claim, and that is intended behaviour rather than a bug.',
        ],
      },
      {
        type: 'p',
        text: 'Sit with what that does to a week. Skipping a night of a normal game costs you nothing at all. Skipping a week here produces a visible, itemised zero, in a chest that opens on a day you can name. It is the difference between not going to the gym and not filing your timesheet. One is a hobby you did not do, the other is a task you failed to complete, and your nervous system does not treat those the same way.',
      },
      {
        type: 'p',
        segments: [
          'That is how a game becomes a payroll cycle. You stop playing because you want to and start playing because it is Tuesday, and the two feel almost identical from inside. If your evenings have quietly turned into a list of things to get done before a deadline, ',
          {
            text: 'the reason games stop being fun while you keep playing them',
            href: '/writing/why-video-games-are-not-fun-anymore',
          },
          ' covers exactly that gap, and it is worth reading before you decide the problem is that you have got bored of this one.',
        ],
      },

      { type: 'h2', text: 'Seasons and expansions are a collection schedule' },
      {
        type: 'figure',
        src: '/writing/wow-return-cycle.svg',
        alt: 'The World of Warcraft return cycle: you burn out and cancel the subscription, the account waits with every character intact, a new season or expansion is announced, the guild chat wakes up, a free welcome back weekend opens the door, and you resubscribe for launch, on roughly a two year loop.',
        caption: 'You did not fail to quit five times. You unsubscribed five times, which is a different thing.',
        width: 1200,
        height: 600,
      },
      {
        type: 'p',
        segments: [
          'Every season, the ladder empties. When Blizzard laid out the schedule for ',
          {
            text: 'the second season of its current expansion',
            href: 'https://news.blizzard.com/en-us/article/24294369/the-shadows-deepen-midnight-season-2-begins-august-18',
          },
          ', the pattern was the usual one: Mythic Plus ratings reset, arena and rated PvP standings reset, a new tier of Great Vault gear becomes available, and the difficulties and raid wings unlock across several weeks rather than all at once.',
        ],
      },
      {
        type: 'p',
        text: 'Read that as a returning World of Warcraft player and it is close to irresistible. Everyone is level again. Nobody is ahead. The thing that made coming back feel hopeless, being a year behind people who never stopped, is deleted on a schedule, and the staggered unlocks mean the first month has a reason to log in every single week. This is a very good way to run a live game. It is also a machine for collecting lapsed players, and you are a lapsed player.',
      },
      {
        type: 'p',
        text: 'The expansion cycle is the same trick with a longer arm. You leave burnt out, eighteen months pass, an announcement lands, the old chat wakes up, someone says the new one is different, and it genuinely is different, because the content is new. What is never different is the shape of your week afterwards. Three good months, then the same Wednesday, then the same burnout, roughly every two years, for as long as you have had the account.',
      },

      { type: 'h2', text: 'Why Classic, or "I will just go casual", does not hold' },
      {
        type: 'p',
        text: 'The two most common half measures both fail for the same reason, and it is worth knowing which one you are about to try. Moving to another version keeps the account, the friends, the reset and the ladder, and changes only the scenery. Going casual on retail keeps every single one of them and just removes the part you were best at.',
      },
      {
        type: 'p',
        segments: [
          'That does not make cutting down the wrong goal. It makes it a goal that needs a different plan from the one you have been using. ',
          {
            text: 'What the evidence says about playing in moderation',
            href: '/writing/how-to-play-video-games-in-moderation',
          },
          ' is more encouraging than most quitting content admits, with one consistent caveat: a clean break first, then a limit, works far more often than a limit applied to a habit that is still running at full speed.',
        ],
      },

      { type: 'h2', text: 'How to quit World of Warcraft, step by step' },
      {
        type: 'ol',
        items: [
          'Decide whether you are leaving the game or leaving the raid team, and say which one out loud before you do anything else. They are different projects with different costs, and half the failed attempts are people who never picked. Plenty of people keep a character and lose nothing. Nobody keeps a raid spot and plays casually.',
          'Cancel the recurring subscription today, and do not pause it. Pausing is a supported, sensible looking option, which is exactly why it is the wrong one here. A pause is a return date you have already agreed to. Cancel it, and let the remaining paid time run out without renewing.',
          'Tell the guild before you tell yourself, and give the date. Name your last raid night, post it where the roster can see it, and let them fill the spot. Disappearing feels easier and costs more, because an unfinished exit leaves an apology owed, and going back to apologise is a login.',
          'Leave the guild chat and the Discord servers, not just the game. This is the surface that outlives the client. You can be out of the game for a month and still be reading raid logs, patch notes and roster drama every day, which keeps the whole thing warm and ready.',
          'Deal with banked game time and tokens deliberately rather than leaving them. Thirty days sitting in the account is an open loop, and open loops get closed on bad evenings. Either use it and be done on a date you set, or write off the value now, out loud, as the price of leaving.',
          'Uninstall last, and be honest about what it does. It reclaims disk space and adds twenty minutes of friction. It does not close the account, delete a character, or stop a single one of the things above. Treat it as the full stop on the sentence, not the sentence.',
          'Put something in the raid nights before they arrive. This is the step people skip and it is the one that decides the outcome. Two or three fixed evenings a week are about to come free, at the same time, with the same people missing from them, and an empty Wednesday is the most reliable route back in.',
          'Write down what you will do when the next expansion is announced, while you are clear-headed and it is still hypothetical. You already know roughly when it is coming. Deciding in advance is not pessimism, it is the one moment where the decision is cheap.',
        ],
      },

      { type: 'h2', text: 'What the first month actually feels like' },
      {
        type: 'p',
        segments: [
          'The first day is usually fine, which surprises people. The first reset day is not, and neither is the first raid night, because those are the moments the calendar reaches for you rather than the other way round. ',
          {
            text: 'The honest timeline of what happens when you stop',
            href: '/writing/what-happens-when-you-stop-playing-video-games',
          },
          ' covers the general shape: the discomfort is real, it arrives in waves tied to the hours you used to play, and it fades on a scale of weeks rather than months.',
        ],
      },
      {
        type: 'p',
        segments: [
          'Two things are specific to WoW. The first is that your free time arrives in the wrong shape. A raid block is three or four hours, late, twice a week, and an evening that size is genuinely hard to fill with anything that is not another screen. If most of your gaming was already running past midnight, ',
          {
            text: 'why late night play is so hard to stop',
            href: '/writing/how-to-stop-playing-video-games-at-night',
          },
          ' is the piece of this that has almost nothing to do with the game itself.',
        ],
      },
      {
        type: 'p',
        segments: [
          'The second is that a decade of characters does not stop existing, and you will feel that as loss rather than relief for a while. It helps to be specific about what you are actually giving up, which is a schedule rather than a collection. Running your real weekly hours through ',
          { text: 'a calculator that turns them into days and weeks', href: '/gaming-time-calculator' },
          ' makes the trade concrete, and the number is usually the thing that settles the argument. Then put something with other people in it into one of the freed evenings, because ',
          { text: 'replacing the need rather than the activity', href: '/writing/what-to-do-instead-of-gaming' },
          ' is what makes the gap close instead of sitting open.',
        ],
      },

      { type: 'h2', text: 'When it is not really about the game' },
      {
        type: 'p',
        segments: [
          'Sometimes the game is the problem and removing it is enough. Sometimes it is where you go when the day has been too much, and then a plan made of cancellations will not hold, because none of it touches the reason. Across surveys of why people play, ',
          {
            text: 'escape is the motive that lines up most closely with gaming getting out of hand',
            href: 'https://www.sciencedaily.com/releases/2019/10/191022121123.htm',
          },
          ', more so than competition or achievement, and that pattern shows up in the Warcraft-specific research too.',
        ],
      },
      {
        type: 'p',
        text: 'There is a version of this that is specific to long-running online games and worth saying plainly. For some people the guild is not a hook, it is the main place they see other people all week. If that is true for you, then quitting without replacing it is not a plan, it is a subtraction, and it will not survive a bad month. Leave the raid, keep the friendships, and move them somewhere that does not bill you monthly.',
      },
      {
        type: 'p',
        text: 'Nothing here is professional advice, and when gaming is tangled up with something heavier, talk to someone you trust. But if you have cancelled this subscription three times already and it keeps coming back, the missing piece was probably never willpower. It was that you kept cancelling a payment and calling it a decision.',
      },
    ],
    faq: [
      {
        q: 'Why is World of Warcraft so hard to quit compared to other games?',
        a: 'Because three of the four things holding you are outside the game client. The subscription keeps billing until you cancel it, the raid roster is other people planning their week around you, and the weekly reset means a week away produces a visible empty Great Vault rather than nothing at all. Uninstalling removes the files and leaves all three of those running, which is why it has never been enough on its own.',
      },
      {
        q: 'Do my characters get deleted if I stop paying the subscription?',
        a: 'No, and this is the detail that quietly makes quitting harder. An inactive account keeps its characters at the level and in the gear you left them, indefinitely. Blizzard also runs occasional Welcome Back Weekends that give inactive accounts full access to the game and all their characters without a subscription. Nothing you built is ever at risk, so there is no deadline forcing the decision and no penalty for coming back.',
      },
      {
        q: 'Should I pause my subscription or cancel it?',
        a: 'Cancel it. Pausing looks like the responsible middle option and it is the one most likely to fail, because a pause is a return date you have already agreed to and a decision you have deferred rather than made. Cancel the recurring payment, let any remaining paid time run out without renewing it, and treat any banked game time or tokens as spent rather than leaving them sitting in the account as an open loop.',
      },
      {
        q: 'Is switching to Classic instead of retail a good way to cut down?',
        a: 'It rarely works, because it changes the content and keeps the structure. You still have the account, the friends, the guild, a weekly lockout and a ladder to climb, so the shape of your week barely moves. Some people genuinely do want less of the game rather than none of it, which is a legitimate goal, but it needs a clean break first and then a limit, not a sideways move into a different version.',
      },
      {
        q: 'Does playing a lot of WoW mean I have a problem?',
        a: 'Not by itself. In one study of 690 players whose in-game behaviour was tracked for eight months, high involvement was not reliably tied to a negative impact on daily life, while particular motives such as escapism and advancement were. Hours are a poor test on their own. The more useful question is what the hours are displacing, and whether you would be comfortable if the people close to you knew the real total.',
      },
      {
        q: 'How do I handle my guild when I quit World of Warcraft?',
        a: 'Give a date and a last raid night rather than disappearing. Ghosting feels easier in the moment and is the more expensive option, because it leaves an apology owed and going back to make it is a login. Post the date where the roster can see it so your spot gets filled, then leave the guild chat and any Discord servers, since reading raid logs and patch notes every day keeps the habit warm without you noticing.',
      },
    ],
  },
]

// ── Backlog ──────────────────────────────────────────────────────────────────
// Ideas, not drafts. Three empty stubs used to sit in POSTS as `status: 'draft'`
// and rendered "Coming soon" cards. They had been sitting there for months, so a
// third of the grid read as abandoned. Parked here instead: a post only enters
// POSTS once it has a body.
//
//   identity-and-the-game
//     "The hardest part of quitting is not the habit. It is realising you built
//      your whole personality around it."
//     Note: the Dota post already covers identity as hook #4, so this needs its
//     own angle or it cannibalises that page.
//
//   member-story-ancient-to-business  (category: Stories)
//     "He was Ancient 3, jobless, and playing until 5am. Twelve weeks later,
//      things looked very different."
//     Note: this is the one that would fix the blog's missing lived experience,
//     but it needs a real member who agrees to it. Do not invent one.
//
//   social-obligation-hook
//     "Your friends are online. They're waiting. You can't just leave. This
//      feeling is manufactured, and it's deliberate."
//     Note: same cannibalisation risk, it is hook #3 in the Dota post.

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getPublishedPosts() {
  return POSTS.filter((p) => p.status === 'published')
}

export function getPostBySlug(slug) {
  return POSTS.find((p) => p.slug === slug)
}

// Only returns a post if it's actually published — the route uses this so draft
// slugs resolve to a 404 instead of a blank page.
export function getPublishedPostBySlug(slug) {
  const post = getPostBySlug(slug)
  return post && post.status === 'published' ? post : null
}

export function getFeaturedPost() {
  return POSTS.find((p) => p.featured) ?? null
}

// Published posts by a given author, newest first — for the author profile page.
export function getPostsByAuthor(name) {
  return getPublishedPosts()
    .filter((p) => p.author === name)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
}

// Cards for the grid: everything except the featured post, newest first.
export function getGridPosts() {
  return POSTS.filter((p) => !p.featured).sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  )
}

// Flattens body blocks into plain text for BlogPosting.articleBody / wordCount.
// Figures contribute no words; segment paragraphs flatten their text/link parts.
export function postPlainText(post) {
  if (!Array.isArray(post.body)) return ''
  return post.body
    .map((block) => {
      if (block.type === 'figure') return ''
      if (Array.isArray(block.segments))
        return block.segments.map((s) => (typeof s === 'string' ? s : s.text)).join('')
      if (block.items) return block.items.join(' ')
      return block.text || ''
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
