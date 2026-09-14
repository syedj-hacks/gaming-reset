import styles from './RealStories.module.css'

// Composite stories written in-house, inspired by the patterns gamers describe
// over and over when they talk about cutting back. Deliberately NOT verbatim
// quotes of any one person and NOT attributed to a real named individual — this
// keeps us clear of copyright and privacy issues while still carrying the
// emotional weight. The disclaimer below the grid states this plainly.
const STORIES = [
  {
    text: 'I kept telling myself I would study after this match. Then it was midnight, then two. The hours on my profile kept climbing while I fell further behind in class. I knew my rank every day. I could not tell you when I last opened my notes.',
    who: 'Composite story · student'
  },
  {
    text: 'Without classes or a job to structure the day, gaming filled every gap. I would open a job listing, switch to a game, and promise to apply later. Having the whole day free somehow left me with nothing done by the end of it.',
    who: 'Composite story · looking for work'
  },
  {
    text: 'I wasn’t planning to give up my interests. I just kept choosing one more game instead. The project I wanted to make sat untouched for months. Looking at my playtime made it hard to keep saying I didn’t have enough time.',
    who: 'Composite story · putting life on hold'
  }
]

export default function RealStories() {
  return (
    <section className={styles.section} id="real-stories">
      <div className={styles.glow} />
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>Does this sound familiar?</span>
          <h2 className={styles.title}>
            Different lives.{' '}
            <span className={styles.accent}>The same loop.</span>
          </h2>
          <p className={styles.lead}>
            It doesn’t always look like a crisis. Sometimes it looks like
            another day of putting everything else off.
          </p>
        </div>

        <div className={styles.grid}>
          {STORIES.map((s, i) => (
            <article key={i} className={styles.card}>
              <span className={styles.quoteMark} aria-hidden="true">
                &rdquo;
              </span>
              <p className={styles.story}>{s.text}</p>
              <div className={styles.who}>
                <span className={styles.whoDot} />
                {s.who}
              </div>
            </article>
          ))}
        </div>

        <p className={styles.disclaimer}>
          Illustrative composite stories about gaming habits, not customer
          reviews or testimonials.
        </p>
      </div>
    </section>
  )
}
