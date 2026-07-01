import { useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import GlassCard from '../components/GlassCard'
import { signUp } from '../lib/auth'

export default function Signup() {
  const [form, setForm] = useState({ dealershipName: '', email: '', password: '' })
  const [status, setStatus] = useState('idle') // idle | loading | sent | error
  const [error, setError] = useState('')

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      const result = await signUp(form)
      // Email confirmation is required on this project, so a fresh signup
      // comes back without a session — there's nothing to log in with yet.
      if (result?.access_token) {
        setStatus('confirmed')
      } else {
        setStatus('sent')
      }
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <section className="pt-40 pb-24 px-6 min-h-screen">
      <div className="max-w-md mx-auto">
        <ScrollReveal>
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4">
            Create Your <span className="text-gradient-gold">Account</span>
          </h1>
          <p className="text-white/70 text-center mb-12">
            One account works for both the website and the Jones Vision Media Chrome extension.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <GlassCard hover={false} className="p-10">
            {status === 'sent' || status === 'confirmed' ? (
              <div className="text-center py-10">
                <div className="text-gold text-3xl mb-4">✔</div>
                {status === 'sent' ? (
                  <>
                    <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                    <p className="text-white/70">
                      We sent a confirmation link to <span className="text-white">{form.email}</span>. Confirm your
                      address, then log in here or in the Chrome extension.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-2">You're all set</h2>
                    <p className="text-white/70">Your account is ready. Head to login to get started.</p>
                  </>
                )}
                <Link
                  to="/login"
                  className="inline-block mt-8 bg-gold-gradient text-charcoal font-semibold px-7 py-3 rounded-full shadow-gold hover:scale-105 transition-transform"
                >
                  Go to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  required
                  placeholder="Dealership Name"
                  value={form.dealershipName}
                  onChange={update('dealershipName')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold/60"
                />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={update('email')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold/60"
                />
                <input
                  required
                  type="password"
                  minLength={6}
                  placeholder="Password"
                  value={form.password}
                  onChange={update('password')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold/60"
                />

                {status === 'error' && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-gold-gradient text-charcoal font-semibold px-7 py-4 rounded-full shadow-gold hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:hover:scale-100"
                >
                  {status === 'loading' ? 'Creating account…' : 'Create Account'}
                </button>

                <p className="text-center text-white/50 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-gold hover:underline">
                    Log in
                  </Link>
                </p>
              </form>
            )}
          </GlassCard>
        </ScrollReveal>
      </div>
    </section>
  )
}
