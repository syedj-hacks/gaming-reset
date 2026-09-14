import PlansExperience from './sections/PlansExperience'
import PlansSchema from './sections/PlansSchema'
import { PLAN_PRICING, formatUsd } from '@/lib/pricing'

const SITE_URL = 'https://gamingreset.com'

// The cheapest cadence drives every "from $X" claim on this page, including the
// title and social cards. Derived rather than typed so a price change cannot
// leave the search snippet advertising an amount we no longer charge.
const CHEAPEST = PLAN_PRICING.reduce((lowest, plan) =>
  plan.amountUsd < lowest.amountUsd ? plan : lowest
)
const FROM = formatUsd(CHEAPEST.amountUsd)
// The cadence word too, not just the amount. Hardcoding "week" here is exactly
// how the title outlived the plan it described when weekly was retired.
const PER = CHEAPEST.per                                  // 'month'
const PER_TITLE = PER[0].toUpperCase() + PER.slice(1)     // 'Month'

export const metadata = {
  title: `Pricing: From ${FROM}/${PER_TITLE} to Spend Less Time Gaming`,
  description: `Gaming Reset starts at ${FROM} a ${PER}, with an annual option and a 3 day free trial. A personalised plan, automated daily missions, cancel anytime.`,
  keywords: [
    'gaming habit app cost',
    'spend less time gaming price',
    'screen time app pricing',
    'gaming habit subscription',
    'quit gaming program price',
    'how much to cut back on gaming',
  ],
  alternates: { canonical: '/plans' },
  openGraph: {
    type: 'website',
    siteName: 'Gaming Reset',
    title: `Pricing: From ${FROM}/${PER_TITLE} to Spend Less Time Gaming | Gaming Reset`,
    description: `From ${FROM} a ${PER} with a 3 day free trial. An AI personalised plan and automated daily missions to build better gaming habits.`,
    url: `${SITE_URL}/plans`,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Gaming Reset pricing ${FROM} a ${PER}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Pricing: From ${FROM}/${PER_TITLE} to Spend Less Time Gaming | Gaming Reset`,
    description: `From ${FROM} a ${PER} with a 3 day free trial. An AI personalised plan and automated daily missions.`,
    images: ['/og-image.png'],
  },
}

export default function PlansPage() {
  return (
    <>
      <PlansSchema />
      <PlansExperience />
    </>
  )
}

