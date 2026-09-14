import Link from 'next/link'
import styles from './FeaturedPost.module.css'
import { getFeaturedPost } from '../posts'

export default function FeaturedPost() {
  const post = getFeaturedPost()
  if (!post) return null

  const isLive = post.status === 'published'

  const inner = (
    <>
      <div className={styles.cardGlow} />
      <div className={styles.cardMesh} />

      <div className={styles.cardInner}>
        <div className={styles.meta}>
          <span className={styles.featuredBadge}>
            <span className={styles.featuredDot} />
            Featured
          </span>
          <span className={styles.metaDivider}>·</span>
          <span className={styles.metaItem}>{post.dateLabel}</span>
          <span className={styles.metaDivider}>·</span>
          <span className={styles.metaItem}>{post.readTime}</span>
        </div>

        <h2 className={styles.title}>{post.title}</h2>
        <p className={styles.excerpt}>{post.excerpt}</p>

        <div className={styles.cardFooter}>
          <span className={styles.author}>By {post.author}</span>
          {isLive ? (
            <span className={styles.readMore}>Read article →</span>
          ) : (
            <span className={styles.comingSoon}>Coming soon</span>
          )}
        </div>
      </div>
    </>
  )

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {isLive ? (
          <Link href={`/writing/${post.slug}`} className={`${styles.card} ${styles.cardLink}`}>
            {inner}
          </Link>
        ) : (
          <div className={styles.card}>{inner}</div>
        )}
      </div>
    </section>
  )
}
