import ScrollReveal from '../components/ScrollReveal'
import GlassCard from '../components/GlassCard'

const sections = [
  {
    heading: 'Who this applies to',
    body: [
      'DealerSync is intended for use by dealership staff who have created a DealerSync account. It is not intended for use by, and does not knowingly collect data from, the general public or consumers browsing a dealer’s website or Facebook Marketplace.',
    ],
  },
  {
    heading: 'What data we collect',
    list: [
      'Account information: the email address and dealership name you provide when creating a DealerSync account.',
      'Vehicle data: when you click "Scrape this page" on your own dealership’s website, DealerSync reads publicly visible vehicle details already shown on that page — year, make, model, trim, price, mileage, VIN, color, and photo URLs — and saves them to your DealerSync account.',
      'AI-generated descriptions: vehicle details you scrape are sent to Anthropic’s Claude API to generate a listing description, which is stored in your account.',
      'Dealer settings: optional settings you configure, such as a default warranty disclosure for buy-here-pay-here listings.',
      'Lead form submissions: if you submit the "work with us" form on Jones Vision Media’s marketing site, the information you provide (dealership name, contact name, email, phone, message) is stored so we can follow up.',
    ],
  },
  {
    heading: 'What we do not collect',
    body: [
      'DealerSync does not collect or transmit your Facebook account credentials, Facebook session data, or information about other people’s Facebook activity. It does not track your browsing activity outside of the specific pages where you actively click "Scrape this page" or "Use on Marketplace." It does not sell or share your data with third parties for advertising purposes.',
    ],
  },
  {
    heading: 'How data is used',
    body: [
      'Vehicle data and photos you scrape are used solely to: (1) save a record you can review in the extension, (2) generate an AI description via the Claude API, and (3) fill in that same data into a Facebook Marketplace listing form when you click "Use on Marketplace." Photo URLs are fetched, temporarily held in memory, and inserted into the Marketplace upload widget — they are not stored anywhere beyond your DealerSync account record.',
    ],
  },
  {
    heading: 'Where data is stored',
    body: [
      'Account and vehicle data is stored in a Supabase-hosted PostgreSQL database operated for Jones Vision Media, secured with row-level security so that each dealership can only access its own data. AI description generation is processed by Anthropic’s Claude API under Anthropic’s own data handling terms.',
    ],
  },
  {
    heading: 'Permissions DealerSync requests, and why',
    list: [
      'Read and change data on websites you visit: required to scrape vehicle details from your own dealership’s pages, and to fill in form fields on Facebook Marketplace’s listing creation pages.',
      'Storage: used to keep you signed in between browser sessions.',
      'Optional access to a specific website (requested at the moment you click "Upload Photos"): required to fetch your vehicle’s photo files from wherever your dealership hosts them, so they can be attached to the Marketplace listing. This permission is requested per-domain, only when needed, and you can decline it.',
    ],
  },
  {
    heading: 'Data deletion',
    body: [
      'You can delete any saved vehicle from within the extension at any time. To delete your entire account and all associated data, contact us at the email below.',
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <section className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            DealerSync <span className="text-gradient-gold">Privacy Policy</span>
          </h1>
          <p className="text-white/50 text-sm mb-12">Last updated: June 27, 2026</p>
          <p className="text-white/70 mb-12">
            DealerSync ("the extension") is a Chrome extension built by Jones Vision Media for car dealerships. This
            page explains what data DealerSync collects, how it's used, and how it's stored.
          </p>
        </ScrollReveal>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <ScrollReveal key={section.heading} delay={i * 60}>
              <GlassCard hover={false} className="text-left">
                <h2 className="text-xl font-bold text-gold mb-4">{section.heading}</h2>
                {section.body?.map((p, idx) => (
                  <p key={idx} className="text-white/70 text-sm leading-relaxed mb-3 last:mb-0">
                    {p}
                  </p>
                ))}
                {section.list && (
                  <ul className="space-y-3">
                    {section.list.map((item, idx) => (
                      <li key={idx} className="text-white/70 text-sm leading-relaxed flex gap-3">
                        <span className="text-gold flex-shrink-0">◆</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </GlassCard>
            </ScrollReveal>
          ))}

          <ScrollReveal delay={sections.length * 60}>
            <GlassCard hover={false} className="text-left">
              <h2 className="text-xl font-bold text-gold mb-4">Contact</h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Jones Vision Media
                <br />
                Email:{' '}
                <a href="mailto:jonesvisionmedia.sales@gmail.com" className="text-gold hover:underline">
                  jonesvisionmedia.sales@gmail.com
                </a>
                <br />
                Website:{' '}
                <a href="https://jvm-systems.com" className="text-gold hover:underline">
                  jvm-systems.com
                </a>
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
