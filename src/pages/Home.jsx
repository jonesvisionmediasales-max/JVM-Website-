import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import AnimatedCounter from '../components/AnimatedCounter'
import GlassCard from '../components/GlassCard'
import DashboardMockup from '../components/DashboardMockup'
import TestimonialCard from '../components/TestimonialCard'
import CTASection from '../components/CTASection'

const solutions = [
  {
    title: 'Dealership Marketing',
    desc: 'Generate qualified vehicle buyers through high-converting Facebook advertising, online branding, and lead generation systems.',
    to: '/dealership-marketing',
  },
  {
    title: 'Car Rental Agency Marketing',
    desc: 'Generate qualified vehicle renters through high-converting Facebook advertising, online branding, and lead generation systems.',
    to: '/car-rental-marketing',
  },
  {
    title: 'Drive Flow AI',
    desc: 'AI automatically follows up with every lead, books appointments, sends texts and emails, recovers lost opportunities, and manages your CRM.',
    to: '/drive-flow-ai',
  },
  {
    title: 'Dealer Sync',
    desc: 'Automatically scrape your inventory and publish professional Facebook Marketplace listings in approximately 60 seconds.',
    to: '/dealer-sync',
  },
]

const whyJVM = [
  'AI follows up instantly',
  'More appointments',
  'More sold vehicles',
  'Better online reputation',
  'Increased Marketplace visibility',
  'More qualified Facebook leads',
  'Automated customer communication',
  'Real-time reporting dashboards',
  'Less manual work',
]

const testimonials = [
  { quote: 'Drive Flow AI changed how fast we respond to leads. We are booking appointments we used to lose.', name: 'Mark R.', role: 'Dealer Owner' },
  { quote: 'Dealer Sync took our Marketplace listings from a chore to a non-issue. Compliance is finally consistent.', name: 'Janet P.', role: 'General Manager' },
  { quote: 'Our team spends time closing deals instead of chasing leads. The ROI was obvious within a month.', name: 'Carlos D.', role: 'Sales Manager' },
  { quote: 'Bookings are up and our online reputation has never looked better.', name: 'Aisha T.', role: 'Rental Company Owner' },
]

export default function Home() {
  return (
    <>
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              AI That Grows Automotive Businesses <span className="text-gradient-gold">While You Sleep.</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-xl">
              Jones Vision Media helps dealerships and rental companies generate more leads, automate every customer follow-up, increase appointments, and eliminate repetitive work through powerful AI automation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="bg-gold-gradient text-charcoal font-semibold px-7 py-4 rounded-full shadow-gold hover:scale-105 transition-transform">
                Book a Demo
              </Link>
              <button className="border border-white/20 text-white font-semibold px-7 py-4 rounded-full hover:border-gold/50 hover:text-gold transition-colors">
                Watch Demo
              </button>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <DashboardMockup />
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 px-6 border-y border-white/10">
        <ScrollReveal>
          <p className="text-center text-white/40 text-sm uppercase tracking-widest mb-8">
            Helping Automotive Businesses Modernize Sales
          </p>
          <div className="flex flex-wrap justify-center gap-10 opacity-60">
            {['AutoMax Motors', 'Coastal Rentals', 'Prime Auto Group', 'Sunbelt Car Rentals', 'Heritage Motors'].map((b) => (
              <span key={b} className="text-white/50 font-semibold text-lg">{b}</span>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="py-24 px-6">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Our Solutions</h2>
        </ScrollReveal>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          {solutions.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 100}>
              <Link to={s.to}>
                <GlassCard className="h-full">
                  <h3 className="text-xl font-bold mb-3 text-gold">{s.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{s.desc}</p>
                </GlassCard>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 bg-white/[0.02]">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Proven Results</h2>
          <p className="text-center text-white/50 mb-14">Dealer Sync Results</p>
        </ScrollReveal>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { from: 8, to: 47, label: 'Avg. Facebook Marketplace Listings' },
            { from: 11, to: 142, label: 'Marketplace Leads Per Month' },
            { from: 14, to: 92, suffix: '%', label: 'Compliance: Before → After' },
            { from: 15, to: 1, label: 'Minutes Saved Per Listing (15 → 1)' },
          ].map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 100}>
              <GlassCard>
                <div className="text-4xl mb-2">
                  <AnimatedCounter to={stat.to} suffix={stat.suffix || ''} />
                </div>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <DashboardMockup />
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Why Jones Vision Media</h2>
            <ul className="space-y-3">
              {whyJVM.map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/80">
                  <span className="text-gold">✔</span> {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 px-6 bg-white/[0.02]">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">What Our Clients Say</h2>
        </ScrollReveal>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 100}>
              <TestimonialCard {...t} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      <CTASection
        title="Ready to Grow Your Automotive Business?"
        subtitle="See how Jones Vision Media combines AI, automation, and proven marketing systems to help dealerships and rental agencies increase revenue while reducing workload."
        buttonText="Schedule Your Demo"
      />
    </>
  )
}
