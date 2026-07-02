import { useState } from 'react'
import ScrollReveal from '../components/ScrollReveal'
import GlassCard from '../components/GlassCard'

const products = [
  {
    id: 'driveflow',
    name: 'Drive Flow AI',
    description: 'AI-powered CRM — leads, follow-ups, appointments',
    faqs: [
      { q: 'How do I connect my phone number?', a: 'Go to Settings → Phone in your Drive Flow AI dashboard and follow the number provisioning steps. If you run into issues, contact us below.' },
      { q: 'Can I import my existing leads?', a: 'Yes. Drive Flow AI supports CSV imports from most CRM platforms. Use the Import tool in your dashboard under Contacts.' },
      { q: 'How does the AI calling work?', a: 'The AI calls your leads automatically based on the workflow you configure. It speaks naturally, qualifies leads, and books appointments directly into your calendar.' },
      { q: 'How do I cancel or pause my account?', a: 'Email us at jonesvisionmedia.sales@gmail.com with your account email and we\'ll handle it within 1 business day.' },
    ],
  },
  {
    id: 'dealersync',
    name: 'Dealer Sync',
    description: 'Chrome extension — scrape inventory, post to Marketplace',
    faqs: [
      { q: 'How do I install the extension?', a: 'Search "DealerSync" in the Chrome Web Store and click Add to Chrome. Then log in with the email you used to sign up.' },
      { q: 'The scraper isn\'t picking up my vehicles.', a: 'Make sure you\'re on your dealership\'s own inventory page (not a third-party site). Click the DealerSync icon and then click "Scrape this page."' },
      { q: 'Photos aren\'t uploading to Marketplace.', a: 'When prompted, grant DealerSync permission to access your photo host domain. This permission is required to fetch and attach images to the listing.' },
      { q: 'How do I invite a sales rep?', a: 'Log into the Manager Dashboard and go to the Team tab. Click "Invite Sales Rep," enter their email, and they\'ll receive a link to set their password.' },
      { q: 'How do I delete my account?', a: 'Email us at jonesvisionmedia.sales@gmail.com from your account email and we\'ll delete all your data within 1 business day.' },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing Services',
    description: 'Dealership & car rental agency marketing campaigns',
    faqs: [
      { q: 'How long before I see results?', a: 'Most clients see measurable lead increases within the first 30 days. Full campaign optimization typically takes 60–90 days.' },
      { q: 'What platforms do you run ads on?', a: 'We run campaigns on Facebook, Instagram, and Google depending on your package. We\'ll recommend the right mix for your market.' },
      { q: 'Can I pause my campaign?', a: 'Yes. Give us at least 48 hours notice and we\'ll pause everything. Reach out to jonesvisionmedia.sales@gmail.com.' },
      { q: 'Do you provide reporting?', a: 'Yes — you\'ll receive weekly performance reports covering impressions, clicks, leads, and cost-per-lead.' },
    ],
  },
]

export default function Support() {
  const [selected, setSelected] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const product = products.find(p => p.id === selected)

  return (
    <section className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
            Support <span className="text-gradient-gold">Center</span>
          </h1>
          <p className="text-white/60 text-center mb-12">
            Select your product to find answers or contact us directly.
          </p>
        </ScrollReveal>

        {/* Product selector */}
        <ScrollReveal delay={100}>
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {products.map(p => (
              <button
                key={p.id}
                onClick={() => { setSelected(p.id); setOpenFaq(null); setSubmitted(false) }}
                className={`text-left p-5 rounded-2xl border transition-all ${
                  selected === p.id
                    ? 'border-gold/60 bg-gold/5 shadow-gold'
                    : 'border-white/10 glass hover:border-white/30'
                }`}
              >
                <div className="font-bold mb-1">{p.name}</div>
                <div className="text-xs text-white/50">{p.description}</div>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* FAQs */}
        {product && (
          <ScrollReveal>
            <GlassCard hover={false} className="mb-8">
              <h2 className="text-xl font-bold text-gold mb-6">{product.name} — Common Questions</h2>
              <div className="space-y-3">
                {product.faqs.map((faq, i) => (
                  <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
                    <button
                      className="w-full text-left px-5 py-4 font-medium text-sm flex justify-between items-center gap-4 hover:text-gold transition-colors"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span>{faq.q}</span>
                      <span className="text-gold flex-shrink-0 text-lg">{openFaq === i ? '−' : '+'}</span>
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4 text-sm text-white/60 leading-relaxed border-t border-white/10 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Contact form */}
            <GlassCard hover={false}>
              <h2 className="text-xl font-bold mb-2">Still need help?</h2>
              <p className="text-white/50 text-sm mb-6">Send us a message and we'll get back to you within 1 business day.</p>
              {submitted ? (
                <div className="text-center py-6">
                  <div className="text-gold text-3xl mb-3">✔</div>
                  <p className="text-white/70 font-medium">Message received! We'll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input required placeholder="Your Name" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold/60" />
                    <input required type="email" placeholder="Email Address" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold/60" />
                  </div>
                  <input
                    readOnly
                    value={product.name}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gold/80 focus:outline-none cursor-default"
                  />
                  <textarea required placeholder="Describe your issue..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold/60" />
                  <button type="submit" className="w-full bg-gold-gradient text-charcoal font-semibold px-7 py-4 rounded-full shadow-gold hover:scale-[1.02] transition-transform">
                    Send Message
                  </button>
                </form>
              )}
            </GlassCard>
          </ScrollReveal>
        )}

        {/* Default state — no product selected yet */}
        {!product && (
          <ScrollReveal delay={200}>
            <div className="text-center text-white/30 text-sm mt-4">
              Select a product above to see FAQs and contact support.
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
