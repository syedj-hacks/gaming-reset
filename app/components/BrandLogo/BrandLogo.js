import styles from './BrandLogo.module.css'

/**
 * The Gaming Reset wordmark — a rotated, glowing blue diamond next to
 * "Gaming Reset" (Reset in blue). Pure CSS (no image request, crisp at any
 * size), matching the mobile app's Logo. `size` is the diamond's box in px;
 * pass `withText={false}` for the mark on its own.
 */
export default function BrandLogo({ size = 22, withText = true }) {
  return (
    <span className={styles.wrap}>
      <span
        className={styles.diamond}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      {withText && (
        <span className={styles.text}>
          Gaming&nbsp;<span className={styles.accent}>Reset</span>
        </span>
      )}
    </span>
  )
}
