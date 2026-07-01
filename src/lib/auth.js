const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const SESSION_KEY = 'jvm_session'

async function parseResponse(res) {
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const message = body?.error_description || body?.msg || body?.message || 'Something went wrong. Please try again.'
    throw new Error(message)
  }
  return body
}

// Same Supabase project the Chrome extension uses, so an account created
// here works there too (and vice versa).
export async function signUp({ email, password, dealershipName }) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      email,
      password,
      data: { dealership_name: dealershipName },
    }),
  })
  return parseResponse(res)
}

export async function signIn({ email, password }) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email, password }),
  })
  const session = await parseResponse(res)
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY)
}
