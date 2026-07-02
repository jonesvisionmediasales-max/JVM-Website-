import { useEffect } from 'react'

// The dealer login lives in the standalone dashboard app at /dashboard/,
// which has its own auth form and session. This route just funnels any old
// /login (or /signup) links there so there's a single place to log in.
export default function Login() {
  useEffect(() => {
    window.location.replace('/dashboard/')
  }, [])

  return (
    <section className="pt-40 pb-24 px-6 min-h-screen flex items-center justify-center">
      <p className="text-white/60">Redirecting to your dashboard…</p>
    </section>
  )
}
