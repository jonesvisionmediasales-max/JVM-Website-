import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import GlassCard from '../components/GlassCard'
import { signIn } from '../lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [error, setError] = useState('')

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      await signIn(form)
      navigate('/')
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
            Welcome <span className="text-gradient-gold">Back</span>
          </h1>
          <p className="text-white/70 text-center mb-12">
            Log in with the same account you use on the Chrome extension.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <GlassCard hover={false} className="p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                {status === 'loading' ? 'Logging in…' : 'Log In'}
              </button>

              <p className="text-center text-white/50 text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-gold hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </GlassCard>
        </ScrollReveal>
      </div>
    </section>
  )
}
