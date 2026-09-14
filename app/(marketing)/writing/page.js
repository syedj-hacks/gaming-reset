import dynamic from 'next/dynamic'
import styles from './writing.module.css'

const FeaturedPost = dynamic(() => import('./sections/FeaturedPost'))
const PostGrid     = dynamic(() => import('./sections/PostGrid'))

const SITE_URL = 'https://gamingreset.com'

export const metadata = {
  title: 'Gaming Habits Blog',
  description:
    'Honest writing on gaming habits, why some games are so hard to put down, and what actually works to spend less time gaming. Essays from Gaming Reset.',
  keywords: [
    'gaming habits blog',
    'spend less time gaming',
    'how to quit gaming',
    'game design psychology',
    'gaming self improvement',
    'cutting back on gaming',
  ],
  alternates: { canonical: '/writing' },
  openGraph: {
    type: 'website',
    siteName: 'Gaming Reset',
    title: 'Gaming Habits Blog | Gaming Reset',
    description:
      'Honest writing about gaming habits, why some games are so hard to put down, and what actually works to spend less time gaming.',
    url: `${SITE_URL}/writing`,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Gaming Reset: writing on gaming habits',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaming Habits Blog | Gaming Reset',
    description:
      'Honest writing about gaming habits and spending less time gaming.',
    images: ['/og-image.png'],
  },
}

const writingSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/writing#webpage`,
      url: `${SITE_URL}/writing`,
      name: 'Writing | Gaming Reset',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#service` },
      description:
        'Honest essays on gaming habits, the design behind why some games are so hard to put down, and what actually works to cut back.',
      inLanguage: 'en',
      breadcrumb: { '@id': `${SITE_URL}/writing#breadcrumb` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/writing#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Writing', item: `${SITE_URL}/writing` },
      ],
    },
  ],
}

export default function WritingPage() {
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(writingSchema) }}
      />

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroMesh} />
        <div className={styles.heroInner}>
          <span className={styles.tag}>WRITING</span>
          <h1 className={styles.title}>
            The truth about<br />
            <span className={styles.gradient}>gaming habits.</span>
          </h1>
          <p className={styles.subtitle}>
            No fluff, no filler, no theory you can&apos;t use. Just the honest
            truth about gaming habits, why some games are so hard to put down,
            and what actually works when willpower on its own has not.
          </p>
        </div>
      </div>

      {/* ── Sections ── */}
      <FeaturedPost />
      <PostGrid />

    </div>
  )
}