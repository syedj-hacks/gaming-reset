import Link from 'next/link'
import styles from './PostGrid.module.css'
import { getGridPosts } from '../posts'

export default function PostGrid() {
  const POSTS = getGridPosts()

  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        {/* Grid */}
        <div className={styles.grid}>
          {POSTS.map((post) => {
            const isLive = post.status === 'published'
            return (
              <article
                key={post.slug}
                className={`${styles.card} ${isLive ? styles.cardLive : ''}`}
              >
                <div className={styles.cardTop}>
                  <span className={styles.category}>{post.category}</span>
                  <div className={styles.cardMeta}>
                    <span>{post.dateLabel}</span>
                    <span className={styles.dot}>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postExcerpt}>{post.excerpt}</p>
                <div className={styles.cardFooter}>
                  {isLive ? (
                    <Link href={`/writing/${post.slug}`} className={styles.readMore}>
                      Read article →
                      <span className={styles.stretch} aria-hidden="true" />
                    </Link>
                  ) : (
                    <span className={styles.comingSoon}>Coming soon</span>
                  )}
                </div>
              </article>
            )
          })}
        </div>

      </div>
    </section>
  )
}