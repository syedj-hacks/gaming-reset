import Link from 'next/link'
import Calculator from './Calculator'
import styles from './calculator.module.css'

const SITE_URL = 'https://gamingreset.com'
const PAGE_URL = `${SITE_URL}/gaming-time-calculator`
const PUBLISHED = '2026-07-28'

export const metadata = {
  // `absolute` skips the "| Gaming Reset" template. With the suffix this ran to
  // 67 characters, past the ~60 Google renders before truncating, and on a tool
  // page the keyword earns that space more than the brand does.
  title: { absolute: 'Gaming Time Calculator: How Much Time Have You Lost?' },
  description:
    'Work out how much of your life gaming has actually taken. Enter your hours a day and see the days, years and hours, plus what the same time could have been.',
  keywords: [
    'gaming time calculator',
    'how much time have i wasted gaming',
    'time wasted gaming calculator',
    'how many hours have i spent gaming',
    'hours spent gaming calculator',
    'gaming hours tracker',
  ],
  alternates: { canonical: '/gaming-time-calculator' },
  openGraph: {
    type: 'website',
    siteName: 'Gaming Reset',
    title: 'Gaming Time Calculator: How Much Time Have You Lost?',
    description:
      'Enter your hours a day and see how many full days and years of your life gaming has taken.',
    url: PAGE_URL,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Gaming time calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaming Time Calculator: How Much Time Have You Lost?',
    description:
      'See how many full days and years of your life gaming has taken.',
    images: ['/og-image.png'],
  },
}

// One source of truth for the FAQ: rendered visibly below AND emitted as
// FAQPage structured data, so the two can never drift (Google requires a match).
const FAQ = [
  {
    q: 'How is the time calculated?',
    a: 'Your hours a day are multiplied by 365 to get hours a year, then multiplied by the number of years. To convert that into full days the total hours are divided by 24, so a day here means a whole 24 hour day, not a waking day. Four hours a day for one year is 1,460 hours, which is roughly 61 full days.',
  },
  {
    q: 'Why count 24 hour days instead of waking hours?',
    a: 'Because it is the honest unit. Saying 1,460 hours is easy to wave away. Saying two months of continuous time is harder, and it is the same number. If you prefer waking days, divide the hours by 16 instead of 24, which makes the figure roughly 50 percent larger.',
  },
  {
    q: 'Is gaming for a few hours a day actually a problem?',
    a: 'Not automatically. Hours alone do not decide it. What matters is whether play is displacing sleep, work, study or relationships, and whether stopping feels like a choice. The World Health Organization criteria for gaming disorder are about loss of control and consequences, not a specific number of hours. Our gaming addiction statistics page covers what the research says.',
  },
  {
    q: 'Where do the book and language comparisons come from?',
    a: 'A book is estimated at 5.5 hours, based on an average of roughly 80,000 words read at about 250 words per minute. A language is estimated at 600 hours, the low end of the Foreign Service Institute range for languages that are easier for English speakers. A working year is 2,080 hours, which is 40 hours across 52 weeks. They are illustrations of scale, not predictions.',
  },
  {
    q: 'Do I have to quit gaming completely?',
    a: 'No. Gaming Reset is built around reducing rather than quitting cold turkey. You log your hours, and playing less than the day before moves your rating up. Most people who cut back successfully do it gradually rather than all at once.',
  },
]

export default function GamingTimeCalculatorPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: 'Gaming Time Calculator',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#service` },
        description:
          'Calculate how many full days, years and hours of your life gaming has taken, and what the same time could have been.',
        inLanguage: 'en',
        datePublished: PUBLISHED,
        dateModified: PUBLISHED,
        breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Gaming Time Calculator', item: PAGE_URL },
        ],
      },
      // A free interactive tool, which is what makes this page linkable. Marked
      // up as a WebApplication so search engines read it as a tool rather than
      // another article.
      {
        '@type': 'WebApplication',
        '@id': `${PAGE_URL}#app`,
        name: 'Gaming Time Calculator',
        url: PAGE_URL,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        '@id': `${PAGE_URL}#faq`,
        mainEntity: FAQ.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  }

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ── Dark hero holds the whole tool. Matches the statistics page's
             dark-hero / light-body split, and a result screenshotted off a dark
             background travels better when someone shares it. ── */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroMesh} />
        <div className={styles.heroInner}>
          <h1 className={styles.title}>How much of your life has gaming taken?</h1>
          <p className={styles.subtitle}>
            Move the two sliders. No signup, no email, nothing to install. The
            number is usually larger than people expect, which is the point.
          </p>

          <Calculator />
        </div>
      </div>

      {/* ── Light body: the maths, the caveats, the FAQ ── */}
      <div className={styles.body}>
        <p className={styles.lede}>
          Four hours an evening does not feel like much while you are in it. That
          is what makes it so easy to keep doing. Stretched across a year it is
          around two months of continuous time, and across five years it starts to
          look like a decade of evenings.
        </p>

        <h2 className={styles.h2}>How the number is worked out</h2>
        <p className={styles.p}>
          Hours a day times 365 gives hours a year. Multiply by the number of
          years, then divide the total by 24 to turn it into whole days. A day
          here is a full 24 hour day rather than a waking day, which is the
          stricter and more honest reading. Four hours a day for a single year
          comes to 1,460 hours, or roughly 61 full days.
        </p>
        <p className={styles.p}>
          Nothing is stored and nothing is sent anywhere. The calculation happens
          in your browser, and closing the tab is the end of it.
        </p>

        <h2 className={styles.h2}>What the number does and does not mean</h2>
        <p className={styles.p}>
          A large figure here is not a diagnosis. Plenty of people play a lot and
          are genuinely fine, because hours alone were never the measure. What
          actually matters is whether play is pushing out sleep, work, study or
          the people around you, and whether stopping still feels like something
          you choose. The{' '}
          <Link href="/gaming-addiction-statistics" className={styles.link}>
            research on gaming disorder
          </Link>{' '}
          is built on loss of control and consequences, not on a threshold of hours.
        </p>
        <p className={styles.p}>
          If the number did land hard, the useful thing is not guilt about the
          time already spent. That time is gone regardless. The only part still
          available to you is what tomorrow evening looks like.
        </p>

        <h2 className={styles.h2}>Common questions</h2>
        <div className={styles.faq}>
          {FAQ.map((item) => (
            <details key={item.q} className={styles.faqItem}>
              <summary className={styles.faqQ}>{item.q}</summary>
              <p className={styles.faqA}>{item.a}</p>
            </details>
          ))}
        </div>

        <p className={styles.footNote}>
          Related reading:{' '}
          <Link href="/writing/how-many-hours-of-gaming-is-too-much" className={styles.link}>
            how many hours of gaming is too much
          </Link>{' '}
          and{' '}
          <Link href="/writing/what-happens-when-you-stop-playing-video-games" className={styles.link}>
            what happens when you stop playing
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
