import Link from 'next/link'
import styles from './author.module.css'
import { SITE_URL, AUTHOR, authorUrl, getPostsByAuthor } from '../../posts'

const url = authorUrl()

// AUTHOR.role is "Founder of Gaming Reset", and the root layout's title template
// already appends "| Gaming Reset", so putting the role in `title` would render
// "Saad: Founder of Gaming Reset | Gaming Reset". AUTHOR.bio is also well past
// what search results display, so both the meta description and the social cards
// get a purpose-written short version instead.
const SHORT_BIO =
  'Saad is the founder of Gaming Reset. He spent over 4,500 hours on Dota 2 and Counter-Strike, and writes about what it took to get the habit under control.'

export const metadata = {
  title: `${AUTHOR.name}: Founder and Writer`,
  description: SHORT_BIO,
  alternates: { canonical: `/writing/author/${AUTHOR.slug}` },
  openGraph: {
    type: 'profile',
    siteName: 'Gaming Reset',
    title: `${AUTHOR.name}, ${AUTHOR.role}`,
    description: SHORT_BIO,
    url,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${AUTHOR.name}, ${AUTHOR.role}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${AUTHOR.name}, ${AUTHOR.role}`,
    description: SHORT_BIO,
    images: ['/og-image.png'],
  },
}

// ProfilePage + Person. The Person @id here is the SAME id each article's author
// references, so the byline, the article schema, and this profile all resolve to
// one entity — which is exactly the author identity signal search engines look
// for on a health-adjacent topic.
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfilePage',
      '@id': `${url}#profilepage`,
      url,
      name: `${AUTHOR.name}, ${AUTHOR.role}`,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${url}#person` },
      inLanguage: 'en',
    },
    {
      '@type': 'Person',
      '@id': `${url}#person`,
      name: AUTHOR.name,
      url,
      description: AUTHOR.bio,
      jobTitle: 'Founder',
      knowsAbout: ['Gaming habits', 'Digital wellbeing', 'Behavioral game design'],
      worksFor: { '@id': `${SITE_URL}/#organization` },
      // TODO(sameAs): add Saad's public profiles (X, LinkedIn, GitHub) here as a
      // string array. This is the field that lets a search engine resolve the
      // byline to a real, external identity rather than a name that exists only
      // on this domain, so it is the single highest-value addition left on this
      // page. Left out for now rather than filled with a guess.
    },
  ],
}

export default function AuthorPage() {
  const posts = getPostsByAuthor(AUTHOR.name)

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroMesh} />
        <div className={styles.heroInner}>
          <Link href="/writing" className={styles.back}>
            ← All writing
          </Link>

          <div className={styles.identity}>
            <div className={styles.avatar} aria-hidden="true">
              {AUTHOR.name.charAt(0)}
            </div>
            <div>
              <p className={styles.eyebrow}>Author</p>
              <h1 className={styles.name}>{AUTHOR.name}</h1>
              <p className={styles.role}>{AUTHOR.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className={styles.body}>
        <div className={styles.bio}>
          {AUTHOR.longBio.map((para, i) => (
            <p key={i} className={styles.bioP}>
              {para}
            </p>
          ))}
        </div>

        {posts.length > 0 && (
          <section className={styles.articles}>
            <h2 className={styles.articlesTitle}>Articles by {AUTHOR.name}</h2>
            <div className={styles.list}>
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/writing/${post.slug}`}
                  className={styles.card}
                >
                  <div className={styles.cardMeta}>
                    <span className={styles.cardCat}>{post.category}</span>
                    <span className={styles.dot}>·</span>
                    <span>{post.dateLabel}</span>
                    <span className={styles.dot}>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  <span className={styles.readMore}>Read article →</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <Link href="/writing" className={styles.backBottom}>
          ← Back to all writing
        </Link>
      </div>
    </div>
  )
}
