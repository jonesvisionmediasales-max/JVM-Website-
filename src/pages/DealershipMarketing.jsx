import ScrollReveal from '../components/ScrollReveal'
import GlassCard from '../components/GlassCard'
import DashboardMockup from '../components/DashboardMockup'
import CTASection from '../components/CTASection'

const services = [
  'Facebook Advertising',
  'Instagram Advertising',
  'Google Business Optimization',
  'Reputation Management',
  'Landing Pages',
  'Website Optimization',
  'Social Media Management',
  'Lead Generation Funnels',
  'CRM Integrations',
  'Analytics & Reporting',
]

const steps = [
  'Launch high-converting advertising.',
  'Capture qualified buyers.',
  'Drive Flow AI instantly follows up.',
  'Appointments are booked automatically.',
  'Salespeople focus on closing deals.',
  'Vehicle sales increase.',
]

export default function DealershipMarketing() {
  return (
    <>
      <section className="pt-40 pb-20 px-6 text-center">
        <ScrollReveal>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Grow Your Dealership <span className="text-gradient-gold">Online.</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            We build complete lead generation systems designed specifically for dealerships.
          </p>
        </ScrollReveal>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <ScrollReveal key={s} delay={i * 60}>
              <GlassCard className="flex items-center gap-4">
                <span className="text-gold text-xl">●</span>
                <span className="font-medium">{s}</span>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 bg-white/[0.02]">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">How Our Marketing Works</h2>
        </ScrollReveal>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <ol className="space-y-5">
              {steps.map((s, i) => (
                <li key={s} className="flex items-start gap-4">
                  <span className="w-8 h-8 flex-shrink-0 rounded-full bg-gold-gradient text-charcoal font-bold flex items-center justify-center text-sm">
                    {i + 1}
                  </span>
                  <span className="text-white/80 pt-1">{s}</span>
                </li>
              ))}
            </ol>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <DashboardMockup />
          </ScrollReveal>
        </div>
      </section>

      <CTASection
        title="Ready to Sell More Vehicles?"
        subtitle="Let's build a lead generation system tailored to your dealership."
      />
    </>
  )
}
