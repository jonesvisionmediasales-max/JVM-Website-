import ScrollReveal from '../components/ScrollReveal'
import GlassCard from '../components/GlassCard'
import AnimatedCounter from '../components/AnimatedCounter'
import CTASection from '../components/CTASection'

const audiences = ['Airport arrivals', 'Vacation travelers', 'Business travelers', 'Insurance replacement customers', 'Families', 'College students', 'Long-term renters']

const services = [
  {
    title: 'Facebook & Instagram Advertising',
    desc: 'Generate consistent rental inquiries from high-intent customers.',
  },
  {
    title: 'Airport Visitor Marketing',
    desc: 'Target incoming travelers before they book with the national rental brands.',
  },
  {
    title: 'Brand Management',
    desc: 'Build a professional online presence that earns trust before customers even call. Includes Google Business Profile Optimization, Reputation Management, Review Generation, Social Media Management, Website Optimization, and Local SEO.',
  },
  {
    title: 'AI Lead Follow-Up',
    desc: 'Drive Flow AI automatically responds instantly, answers questions, books reservations, sends reminders, re-engages missed leads, and maximizes booking opportunities.',
  },
]

const why = [
  'More direct reservations',
  'Attract incoming airport visitors',
  'Increase fleet utilization',
  'Build a premium online brand',
  'Automate customer communication',
  'Increase repeat customers',
  'Improve online visibility',
  'Professional marketing built specifically for rental agencies',
]

const steps = [
  'We launch targeted advertising.',
  'We attract qualified renters.',
  'AI follows up immediately.',
  'Customers reserve their vehicle.',
  'Your fleet stays booked and generates more revenue.',
]

export default function CarRentalMarketing() {
  return (
    <>
      <section className="pt-40 pb-20 px-6 text-center">
        <ScrollReveal>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            More Bookings. Less Downtime. <span className="text-gradient-gold">More Revenue.</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Jones Vision Media helps independent car rental agencies generate 20–40 additional bookings every month through targeted advertising, AI-powered follow-up, and premium brand management.
          </p>
          <a href="/contact" className="inline-block bg-gold-gradient text-charcoal font-semibold px-7 py-4 rounded-full shadow-gold hover:scale-105 transition-transform">
            Book a Demo
          </a>
        </ScrollReveal>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 100}>
              <GlassCard className="h-full">
                <h3 className="text-lg font-bold mb-3 text-gold">{s.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{s.desc}</p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delay={400}>
          <p className="text-center text-white/50 mt-10 mb-4">Campaigns specifically built for:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {audiences.map((a) => (
              <span key={a} className="glass px-4 py-2 rounded-full text-sm text-white/80">{a}</span>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="py-24 px-6 bg-white/[0.02]">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Rental Agency Results</h2>
        </ScrollReveal>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
          <ScrollReveal>
            <GlassCard>
              <div className="text-4xl mb-2">
                <AnimatedCounter from={20} to={40} prefix="" suffix="" />
              </div>
              <p className="text-white/60 text-sm">Additional Rental Bookings Per Month</p>
            </GlassCard>
          </ScrollReveal>
          {['Higher Fleet Utilization', 'More Direct Bookings', 'More Five-Star Reviews', 'Less Time Managing Leads', 'Higher Monthly Revenue'].map((s, i) => (
            <ScrollReveal key={s} delay={(i + 1) * 100}>
              <GlassCard>
                <div className="text-gold text-3xl mb-2">↑</div>
                <p className="text-white/60 text-sm">{s}</p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Why Rental Companies Choose Jones Vision Media</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-4">
            {why.map((item, i) => (
              <ScrollReveal key={item} delay={i * 60}>
                <div className="flex items-center gap-3 text-white/80">
                  <span className="text-gold">✔</span> {item}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white/[0.02]">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">How It Works</h2>
        </ScrollReveal>
        <ol className="max-w-3xl mx-auto space-y-5">
          {steps.map((s, i) => (
            <ScrollReveal key={s} delay={i * 100}>
              <li className="flex items-start gap-4">
                <span className="w-8 h-8 flex-shrink-0 rounded-full bg-gold-gradient text-charcoal font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </span>
                <span className="text-white/80 pt-1">{s}</span>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </section>

      <CTASection
        title="Ready to Book More Rentals Every Month?"
        subtitle="Let's build your AI-powered booking system."
        buttonText="Book Your Free Strategy Call"
      />
    </>
  )
}
