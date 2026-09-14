// Server component — emits JSON-LD structured data for the /plans page.
// Organization, WebSite and Service are defined on the homepage and referenced
// here by their stable @id URLs (valid cross-page JSON-LD). The FAQ comes from
// the shared PLAN_FAQ source so it always matches the visible accordion.

import { PLAN_FAQ } from './planFaqData'
import { PLAN_PRICING, formatUsd, schemaAmount } from '@/lib/pricing'

const SITE_URL = 'https://gamingreset.com'

// Offers are derived from the shared price source, so the structured data Google
// reads can never advertise a price the visible card does not show. `price` is
// the schema.org decimal form ("69.00"); the blurb uses the display form ("$69").
const PRICING = PLAN_PRICING.map((plan) => ({
  id: plan.id,
  price: schemaAmount(plan.amountUsd),
  unitCode: plan.unitCode,
  blurb: `${formatUsd(plan.amountUsd)} per ${plan.per} with a 3 day free trial. Cancel anytime.`,
}))

// The "starts at" figure is the cheapest cadence, derived rather than named, so
// retiring or adding a cadence can never leave this pointing at a plan we no
// longer sell.
const CHEAPEST = PLAN_PRICING.reduce((lowest, plan) =>
  plan.amountUsd < lowest.amountUsd ? plan : lowest
)

export default function PlansSchema() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/plans#webpage`,
        url: `${SITE_URL}/plans`,
        name: 'Plans & Pricing | Gaming Reset',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#service` },
        primaryImageOfPage: { '@id': `${SITE_URL}/#logo` },
        description: `Gaming Reset pricing starts at ${formatUsd(CHEAPEST.amountUsd)} per ${CHEAPEST.per} with a 3 day free trial. An AI personalised plan, automated daily missions, and cancel anytime.`,
        inLanguage: 'en',
        breadcrumb: { '@id': `${SITE_URL}/plans#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/plans#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Plans', item: `${SITE_URL}/plans` },
        ],
      },
      {
        '@type': 'Product',
        '@id': `${SITE_URL}/plans#product`,
        name: 'Gaming Reset Full Access',
        description:
          'Full access to the Gaming Reset app on web and mobile: an AI personalised daily plan, automated daily missions, progress and streak tracking, rank progression, and a leaderboard.',
        brand: { '@id': `${SITE_URL}/#organization` },
        category: 'Gaming habit-change and screen-time app',
        image: `${SITE_URL}/og-image.png`,
        // Every cadence the page (and checkout) actually sells. This used to be
        // a single Offer, which under-described the product and no longer
        // matched the visible card.
        offers: PRICING.map(({ id, price, unitCode, blurb }) => ({
          '@type': 'Offer',
          '@id': `${SITE_URL}/plans#offer-${id}`,
          price,
          priceCurrency: 'USD',
          url: `${SITE_URL}/plans`,
          availability: 'https://schema.org/InStock',
          priceValidUntil: '2027-12-31',
          description: blurb,
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price,
            priceCurrency: 'USD',
            referenceQuantity: {
              '@type': 'QuantitativeValue',
              value: 1,
              unitCode, // UN/CEFACT codes: MON = month, ANN = year
            },
          },
          seller: { '@id': `${SITE_URL}/#organization` },
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/plans#faq`,
        mainEntity: PLAN_FAQ.map((item) => ({
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
