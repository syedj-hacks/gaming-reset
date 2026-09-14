import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from './article.module.css'
import {
  SITE_URL,
  DEFAULT_OG_IMAGE,
  AUTHOR,
  authorUrl,
  getPublishedPosts,
  getPublishedPostBySlug,
  postPlainText,
} from '../posts'

// Only published slugs get prerendered; anything else (drafts, typos) 404s
// instead of rendering a blank page, because dynamicParams is off.
export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getPublishedPostBySlug(slug)
  if (!post) return {} // route 404s anyway; nothing to describe

  const url = `${SITE_URL}/writing/${post.slug}`
  const image = post.image || DEFAULT_OG_IMAGE

  return {
    title: post.seoTitle ? { absolute: post.seoTitle } : post.title,
    description: post.description || post.excerpt,
    alternates: { canonical: `/writing/${post.slug}` },
    openGraph: {
      type: 'article',
      siteName: 'Gaming Reset',
      title: post.seoTitle || post.title,
      description: post.description || post.excerpt,
      url,
      locale: 'en_US',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author],
      section: post.category,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.description || post.excerpt,
      images: [image],
    },
  }
}

// Renders a paragraph's inline content. A `segments` array carries plain strings
// and { text, href } link objects, so a paragraph can cite a source or link to
// another article without any raw HTML. Internal links (href starting with "/")
// use next/link and stay in-tab, which also strengthens the internal link graph;
// external links open in a new tab, dofollow to reputable sources (good for
// E-E-A-T) but with rel="noopener noreferrer" for safety.
function renderRich(block) {
  if (Array.isArray(block.segments)) {
    return block.segments.map((seg, k) => {
      if (typeof seg === 'string') return seg
      if (seg.href.startsWith('/')) {
        return (
          <Link key={k} href={seg.href} className={styles.link}>
            {seg.text}
          </Link>
        )
      }
      return (
        <a
          key={k}
          href={seg.href}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {seg.text}
        </a>
      )
    })
  }
  return block.text
}

// Renders the safe block model from posts.js into semantic HTML. No raw HTML,
// so there's no injection surface from body copy.
function ArticleBody({ blocks }) {
  return blocks.map((block, i) => {
    switch (block.type) {
      case 'lede':
        return (
          <p key={i} className={styles.lede}>
            {renderRich(block)}
          </p>
        )
      case 'figure':
        return (
          <figure key={i} className={styles.figure}>
            {/* Local, self-authored SVGs; a plain <img> keeps it simple and the
                onError-free path avoids next/image's SVG optimizer quirks. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.src}
              alt={block.alt || ''}
              className={styles.figureImg}
              width={block.width}
              height={block.height}
              loading={block.eager ? 'eager' : 'lazy'}
            />
            {block.caption && (
              <figcaption className={styles.caption}>{block.caption}</figcaption>
            )}
          </figure>
        )
      case 'h2':
        return (
          <h2 key={i} className={styles.h2}>
            {block.text}
          </h2>
        )
      case 'h3':
        return (
          <h3 key={i} className={styles.h3}>
            {block.text}
          </h3>
        )
      case 'ul':
        return (
          <ul key={i} className={styles.ul}>
            {block.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        )
      case 'ol':
        return (
          <ol key={i} className={styles.ol}>
            {block.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ol>
        )
      case 'quote':
        return (
          <blockquote key={i} className={styles.quote}>
            <p>{block.text}</p>
            {block.cite && <cite className={styles.cite}>{block.cite}</cite>}
          </blockquote>
        )
      case 'p':
      default:
        return (
          <p key={i} className={styles.p}>
            {renderRich(block)}
          </p>
        )
    }
  })
}

export default async function ArticlePage({ params }) {
  const { slug } = await params
  const post = getPublishedPostBySlug(slug)
  if (!post) notFound()

  const url = `${SITE_URL}/writing/${post.slug}`
  const image = post.image || DEFAULT_OG_IMAGE
  const plain = postPlainText(post)

  // BlogPosting + BreadcrumbList (+ FAQPage when the post has FAQs). Publisher/
  // website reference the stable @ids defined on the homepage (SeoSchema.js) —
  // valid cross-page JSON-LD.
  const graph = [
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
      headline: post.title,
      description: post.description || post.excerpt,
      image: `${SITE_URL}${image}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      author: {
        '@type': 'Person',
        '@id': `${authorUrl()}#person`,
        name: post.author,
        url: authorUrl(),
        worksFor: { '@id': `${SITE_URL}/#organization` },
      },
      publisher: { '@id': `${SITE_URL}/#organization` },
      isPartOf: { '@id': `${SITE_URL}/writing#webpage` },
      articleSection: post.category,
      inLanguage: 'en',
      wordCount: plain ? plain.split(' ').length : undefined,
      articleBody: plain || undefined,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Writing', item: `${SITE_URL}/writing` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ]

  // FAQPage is eligible for rich results in search, so emit it when we have FAQs.
  if (Array.isArray(post.faq) && post.faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: post.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }

  const schema = { '@context': 'https://schema.org', '@graph': graph }

  return (
    <article className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* ── Header ── */}
      <header className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroMesh} />
        <div className={styles.heroInner}>
          <Link href="/writing" className={styles.back}>
            ← All writing
          </Link>

          <div className={styles.meta}>
            <span className={styles.category}>{post.category}</span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.metaItem}>{post.dateLabel}</span>
            <span className={styles.metaDot}>·</span>
            <span className={styles.metaItem}>{post.readTime}</span>
          </div>

          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.excerpt}>{post.excerpt}</p>
          <p className={styles.author}>
            By{' '}
            <Link href={`/writing/author/${AUTHOR.slug}`} className={styles.authorLink}>
              {post.author}
            </Link>
          </p>
        </div>
      </header>

      {/* ── Body ── */}
      <div className={styles.body}>
        <div className={styles.prose}>
          <ArticleBody blocks={post.body} />
        </div>

        {/* FAQ — visible accordion, mirrored into FAQPage structured data above */}
        {Array.isArray(post.faq) && post.faq.length > 0 && (
          <section className={styles.faq} aria-labelledby="faq-heading">
            <h2 id="faq-heading" className={styles.faqHeading}>
              Frequently asked questions
            </h2>
            {post.faq.map((item, i) => (
              <details key={i} className={styles.faqItem}>
                <summary className={styles.faqQ}>{item.q}</summary>
                <p className={styles.faqA}>{item.a}</p>
              </details>
            ))}
          </section>
        )}

        {/* Author bio — E-E-A-T signal, mirrors the schema.org Person author */}
        <aside className={styles.authorBox}>
          <div className={styles.authorAvatar} aria-hidden="true">
            {AUTHOR.name.charAt(0)}
          </div>
          <div>
            <p className={styles.authorEyebrow}>Written by</p>
            <p className={styles.authorName}>
              <Link href={`/writing/author/${AUTHOR.slug}`} className={styles.authorNameLink}>
                {AUTHOR.name}
              </Link>
            </p>
            <p className={styles.authorBio}>{AUTHOR.bio}</p>
          </div>
        </aside>

        {/* Contextual end-CTA */}
        <div className={styles.endCard}>
          <div className={styles.endGlow} />
          <div className={styles.endInner}>
            <h2 className={styles.endTitle}>Ready to break the loop?</h2>
            <p className={styles.endText}>
              A simple daily plan built around how these hooks actually work,
              tracked in one app on web and mobile. Start free for 3 days.
            </p>
            {/* /signup, not /onboarding — see the note in CtaStrip.js. */}
            <Link href="/signup" className={styles.endBtn}>
              Start free, 3 days →
            </Link>
          </div>
        </div>

        <Link href="/writing" className={styles.backBottom}>
          ← Back to all writing
        </Link>
      </div>
    </article>
  )
}
