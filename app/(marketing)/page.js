import ResetExperience from './sections/ResetExperience'
import SeoSchema from './sections/SeoSchema'
import Mirror from './sections/Mirror'
import LifeLost from './sections/LifeLost'
import RealStories from './sections/RealStories'

export const metadata = {
  title: { absolute: 'Gaming Reset: Take Control of Your Gaming Habits' },
  description:
    'Spend less time gaming with a personalized daily plan: simple daily steps and automated progress tracking. Start a 3-day free trial.',
  alternates: { canonical: '/' }
}

export default function HomePage() {
  return (
    <>
      <SeoSchema />
      <ResetExperience
        mirror={<Mirror />}
        lifeLost={<LifeLost />}
        stories={<RealStories />}
      />
    </>
  )
}
