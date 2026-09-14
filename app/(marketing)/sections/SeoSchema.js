// Server component — emits JSON-LD structured data for the homepage.
// The FAQ comes from the shared faqData source so the structured data always
// matches the visible accordion in ResetExperience (Google requires the two
// to stay in sync).

import { HOME_FAQ as FAQ } from './faqData'
import { PLAN_PRICING, schemaAmount } from '@/lib/pricing'

const SITE_URL = 'https://gamingreset.com'

// Headline offer = the cheapest cadence, derived rather than named, so retiring
// a cadence can never leave the homepage advertising a plan we do not sell.
const CHEAPEST = PLAN_PRICING.reduce((lowest, plan) =>
  plan.amountUsd < lowest.amountUsd ? plan : lowest
)

export default function SeoSchema() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Gaming Reset',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_URL}/#logo`,
          url: `${SITE_URL}/icon.png`,
        },
        description:
          'A personalized habit-change app that helps people spend less time gaming through simple daily steps and automated daily tracking.',
        sameAs: ['https://www.instagram.com/gamingreset1/'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Gaming Reset',
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: 'Gaming Reset: Take Control of Your Gaming Habits',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#service` },
        description:
          'A personalized habit-change app to spend less time gaming with simple daily steps, automated daily tracking, and a 3 day free trial.',
        inLanguage: 'en',
      },
      {
        '@type': 'Service',
        '@id': `${SITE_URL}/#service`,
        serviceType: 'Gaming habit-change and screen-time app',
        name: 'Gaming Reset',
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: 'Worldwide',
        description:
          'A daily habit-change app for people who game too much. Get an AI personalised daily plan, automated missions, progress and streak tracking, and a gamified rank system to cut back one hour at a time.',
        // Headline offer for the homepage Service node. Derived from the shared
        // price source so this and the /plans offers cannot disagree.
        offers: {
          '@type': 'Offer',
          price: schemaAmount(CHEAPEST.amountUsd),
          priceCurrency: 'USD',
          description: `${CHEAPEST.name} subscription with a 3 day free trial.`,
          url: `${SITE_URL}/plans`,
          availability: 'https://schema.org/InStock',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: FAQ.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
