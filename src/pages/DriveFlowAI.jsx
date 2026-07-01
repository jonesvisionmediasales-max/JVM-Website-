import ScrollReveal from '../components/ScrollReveal'
import GlassCard from '../components/GlassCard'
import DashboardMockup from '../components/DashboardMockup'
import CTASection from '../components/CTASection'

const features = [
  'AI Text Messaging',
  'AI Calling',
  'Appointment Scheduling',
  'Email Automation',
  'Review Requests',
  'Reputation Management',
  'Lead Routing',
  'Missed Lead Recovery',
  'Calendar Sync',
  'Sales Pipeline',
  'Dashboard Reporting',
  'Task Automation',
  'CRM Management',
]

export default function DriveFlowAI() {
  return (
    <>
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Every Lead. Every Follow-Up. <span className="text-gradient-gold">Every Appointment.</span>
            </h1>
            <p className="text-white/70 text-lg mb-8">
              Drive Flow AI is an AI-powered automotive CRM that manages customer communication automatically so your team spends less time chasing leads and more time selling vehicles.
            </p>
            <a href="/contact" className="inline-block bg-gold-gradient text-charcoal font-semibold px-7 py-4 rounded-full shadow-gold hover:scale-105 transition-transform">
              Book a Demo
            </a>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <DashboardMockup />
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 px-6 bg-white/[0.02]">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Features</h2>
        </ScrollReveal>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <ScrollReveal key={f} delay={i * 50}>
              <GlassCard className="flex items-center gap-3">
                <span className="text-gold">◆</span>
                <span className="font-medium text-sm">{f}</span>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-24 px-6">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Inside the Dashboard</h2>
        </ScrollReveal>
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <DashboardMockup />
          </ScrollReveal>
          <p className="text-center text-white/40 text-sm mt-6">
            Conversations · Calendar · Pipeline · Analytics · Reports · Reviews · Appointment Calendar
          </p>
        </div>
      </section>

      <CTASection title="See Drive Flow AI In Action" subtitle="Book a personalized walkthrough of your AI-powered CRM." />
    </>
  )
}
