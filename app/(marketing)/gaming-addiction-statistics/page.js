import Link from 'next/link'
import styles from './stats.module.css'

const SITE_URL = 'https://gamingreset.com'
const PAGE_URL = `${SITE_URL}/gaming-addiction-statistics`
const PUBLISHED = '2026-07-22'

export const metadata = {
  title: 'Gaming Addiction Statistics 2026',
  description:
    'How common is gaming addiction? Clear, sourced statistics for 2026: prevalence, who it affects most, when it became official, and why it is so hard to stop.',
  keywords: [
    'gaming addiction statistics',
    'gaming disorder statistics',
    'how common is gaming addiction',
    'video game addiction statistics',
    'gaming disorder prevalence',
    'internet gaming disorder',
  ],
  alternates: { canonical: '/gaming-addiction-statistics' },
  openGraph: {
    type: 'article',
    siteName: 'Gaming Reset',
    title: 'Gaming Addiction Statistics 2026',
    description:
      'Clear, sourced statistics on gaming disorder in 2026: how common it is, who it affects most, and why it is so hard to stop.',
    url: PAGE_URL,
    locale: 'en_US',
    publishedTime: PUBLISHED,
    modifiedTime: PUBLISHED,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Gaming addiction statistics 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaming Addiction Statistics 2026',
    description:
      'Clear, sourced statistics on gaming disorder: prevalence, who it affects, and why it is so hard to stop.',
    images: ['/og-image.png'],
  },
}

// Headline figures. Every number is anchored to an authoritative source in the
// body and the Sources block below, and hedged where the research disagrees.
const STATS = [
  { num: '3B+', label: 'People who play video games worldwide' },
  { num: '~3%', label: 'Estimated share of players with disordered gaming' },
  { num: '2022', label: 'Gaming disorder in effect as an official WHO diagnosis' },
  { num: '5 of 9', label: 'DSM-5 signs that flag internet gaming disorder' },
]

// One source of truth for the FAQ, rendered both as the visible accordion and
// the FAQPage structured data so the two never drift (Google requires a match).
const FAQ = [
  {
    q: 'Is gaming addiction a real disorder?',
    a: 'Yes. The World Health Organization added gaming disorder to the ICD-11, its official diagnostic manual, and it has been in effect worldwide since January 2022. The American Psychiatric Association also lists internet gaming disorder in the DSM-5 as a condition that needs further study.',
  },
  {
    q: 'How many people have a gaming addiction?',
    a: 'Estimates vary with how each study defines the problem, but meta-analyses tend to put disordered or problematic gaming at roughly 3 percent of players, with individual studies ranging from about 1 percent to more than 3 percent. Rates run higher among adolescents and young men.',
  },
  {
    q: 'What counts as gaming disorder?',
    a: 'The DSM-5 lists nine signs of internet gaming disorder, such as loss of control over play, neglecting other activities, and continuing despite clear negative consequences. Endorsing five or more of them over a 12 month period is the proposed threshold.',
  },
]

export default function GamingAddictionStatisticsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: 'Gaming Addiction Statistics 2026',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#service` },
        description:
          'Sourced statistics on gaming disorder in 2026: prevalence, who it affects most, when the WHO recognized it, and why it is so hard to stop.',
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
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Gaming Addiction Statistics',
            item: PAGE_URL,
          },
        ],
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

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroMesh} />
        <div className={styles.heroInner}>
          <span className={styles.tag}>Gaming Addiction</span>
          <h1 className={styles.title}>Gaming Addiction Statistics 2026</h1>
          <p className={styles.subtitle}>
            What the research actually says about gaming addiction: how common it
            is, who it affects most, when it became a recognized disorder, and why
            it is so hard to stop.
          </p>
          <p className={styles.updated}>Last updated July 2026</p>
        </div>

        {/* Headline figures */}
        <div className={styles.statGrid}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.statCard}>
              <p className={styles.statNum}>{s.num}</p>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>
        <p className={styles.lede}>
          Video games are played by more than 3 billion people, and for the vast
          majority that is simply a hobby. For a smaller group it stops feeling
          like a choice. This page collects what the evidence says about that
          group, kept to figures that are actually established rather than scary
          headlines.
        </p>

        <h2 className={styles.h2}>How common is gaming addiction?</h2>
        <p className={styles.p}>
          There is no single agreed number, because studies define the problem in
          different ways and measure different populations. Across the research,
          meta-analyses tend to land around 3 percent of players who show signs of
          disordered gaming, with individual studies ranging from roughly 1
          percent to more than 3 percent. Set against a global player base above 3
          billion, even the low end describes tens of millions of people.
        </p>
        <p className={styles.p}>
          The figure climbs in younger groups. Adolescents and young adults, and
          young men in particular, show consistently higher rates than the general
          population.
        </p>
        <p className={styles.p}>
          Prevalence figures describe a population, which makes them easy to read
          and still feel unaffected by. If you want the number for your own
          situation instead, our{' '}
          <Link href="/gaming-time-calculator" className={styles.link}>
            gaming time calculator
          </Link>{' '}
          turns your hours a day into days and years. It is free and takes no
          signup.
        </p>

        <h2 className={styles.h2}>When gaming addiction became official</h2>
        <p className={styles.p}>
          For years the open question was whether excessive gaming was a real
          condition at all. That question is now settled in the two manuals
          clinicians rely on.
        </p>
        <ul className={styles.ul}>
          <li>
            2013: The American Psychiatric Association added internet gaming
            disorder to the DSM-5 as a condition for further study, with nine
            proposed criteria.
          </li>
          <li>
            2019: The World Health Organization voted to include gaming disorder
            in the ICD-11, its global classification of diseases.
          </li>
          <li>
            2022: The ICD-11 came into effect, making gaming disorder a recognized
            diagnosis worldwide.
          </li>
        </ul>

        <h2 className={styles.h2}>Who it affects most</h2>
        <p className={styles.p}>
          Gaming addiction is not spread evenly. It concentrates among adolescents
          and young men, the same group that logs the most hours playing. It also
          rarely travels alone. Problematic gaming frequently overlaps with
          anxiety, depression, ADHD, and social isolation, and researchers still
          debate how much each one drives the others.
        </p>

        <h2 className={styles.h2}>Why gaming addiction is so hard to break</h2>
        <p className={styles.p}>
          The hard part is not that people do not want to cut back. Most of them
          do. The difficulty is that modern games are engineered to hold
          attention. Ranked ladders, daily rewards, loot mechanics, and pressure
          from teammates all pull on the same loop that makes any behavior hard to
          quit: an unpredictable reward that keeps you reaching for one more
          match.
        </p>
        <p className={styles.p}>
          That is also why willpower alone tends to fail, and why steadily cutting
          back usually holds up better than one dramatic attempt to quit forever.
          Small, repeatable changes to the daily routine survive where cold turkey
          does not.
        </p>

        <div className={styles.note}>
          <p className={styles.noteHeading}>A note on getting help</p>
          <p className={styles.noteText}>
            Gaming Reset is a self-improvement and habit-building tool for people
            who want to spend less time gaming on their own terms. It is not a
            medical or therapeutic service. If gaming is seriously affecting your
            health, work, studies, or relationships, please reach out to a
            qualified professional.
          </p>
        </div>

        {/* FAQ, mirrored into FAQPage structured data above */}
        <section className={styles.faq} aria-labelledby="faq-heading">
          <h2 id="faq-heading" className={styles.faqHeading}>
            Frequently asked questions
          </h2>
          {FAQ.map((item, i) => (
            <details key={i} className={styles.faqItem}>
              <summary className={styles.faqQ}>{item.q}</summary>
              <p className={styles.faqA}>{item.a}</p>
            </details>
          ))}
        </section>

        {/* Sources, kept short and pointed at primary authorities */}
        <div className={styles.sources}>
          <p className={styles.sourcesHeading}>Sources</p>
          <ul className={styles.sourcesList}>
            <li>
              World Health Organization, ICD-11: gaming disorder.{' '}
              <a
                href="https://icd.who.int/"
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                icd.who.int
              </a>
            </li>
            <li>
              American Psychiatric Association, DSM-5: internet gaming disorder.{' '}
              <a
                href="https://www.psychiatry.org/"
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                psychiatry.org
              </a>
            </li>
            <li>
              Prevalence figures reflect published meta-analyses of gaming
              disorder studies; estimates vary with methodology and population.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
