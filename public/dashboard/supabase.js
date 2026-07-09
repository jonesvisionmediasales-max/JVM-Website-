// Hand-rolled Supabase REST client for the dashboard (browser, no chrome APIs).
const SUPABASE_URL  = 'https://dzmalgsbmxbyaejwfdox.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6bWFsZ3NibXhieWFlandmZG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNTY1NDAsImV4cCI6MjA5NzgzMjU0MH0.CAQxTHkQR3dwWzuG4U6JPrg9YmDtoJPLpgXHcYlUfoc';
const SESSION_KEY   = 'dealersync_dash_session';

// ─── Session storage ──────────────────────────────────────────────────────────

export function getStoredSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}
function storeSession(s) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
function clearStoredSession() { localStorage.removeItem(SESSION_KEY); }

// Parse #access_token=...&refresh_token=... from invite / magic-link redirects
export function parseSessionFromHash() {
  if (!window.location.hash) return false;
  const params = new URLSearchParams(window.location.hash.slice(1));
  const access_token  = params.get('access_token');
  const refresh_token = params.get('refresh_token');
  if (!access_token) return false;
  try {
    const payload = JSON.parse(atob(access_token.split('.')[1]));
    const user = { id: payload.sub, email: payload.email, user_metadata: payload.user_metadata || {} };
    storeSession({ access_token, refresh_token, user });
    window.history.replaceState(null, '', window.location.pathname);
    return true;
  } catch {
    return false;
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function signIn(email, password) {
  const res  = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON },
    body:    JSON.stringify({ email, password }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error_description || body.msg || 'Sign in failed');
  storeSession({ access_token: body.access_token, refresh_token: body.refresh_token, user: body.user });
  return body.user;
}

export async function signOut() {
  const s = getStoredSession();
  if (s) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method:  'POST',
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${s.access_token}` },
    }).catch(() => {});
  }
  clearStoredSession();
}

// ─── Authed fetch ─────────────────────────────────────────────────────────────

async function authedFetch(path, options = {}) {
  const session = getStoredSession();
  if (!session) throw new Error('Not signed in');
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      apikey:         SUPABASE_ANON,
      Authorization:  `Bearer ${session.access_token}`,
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) { clearStoredSession(); throw new Error('Session expired'); }
  return res;
}

// ─── Profile / dealership ─────────────────────────────────────────────────────

export async function getProfile() {
  const session = getStoredSession();
  if (!session) return null;
  const res  = await authedFetch(
    `/rest/v1/profiles?id=eq.${session.user.id}&select=*,dealership:dealerships(id,name,warranty_text,product_benefits,specials)`
  );
  const body = await res.json();
  return body[0] || null;
}

export async function createDealership(name) {
  // The id is generated client-side and the row is NOT read back: RLS only
  // lets members SELECT their dealership, and the caller has no profile yet
  // at bootstrap time — asking for return=representation makes the whole
  // insert fail with an RLS violation (chicken-and-egg).
  const id  = crypto.randomUUID();
  const res = await authedFetch('/rest/v1/dealerships', {
    method: 'POST',
    body:   JSON.stringify({ id, name }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Failed to create dealership');
  }
  return { id, name };
}

export async function createProfile(dealershipId, role, fullName, email) {
  const session = getStoredSession();
  const res  = await authedFetch('/rest/v1/profiles', {
    method:  'POST',
    headers: { Prefer: 'return=representation' },
    body:    JSON.stringify({ id: session.user.id, dealership_id: dealershipId, role, full_name: fullName, email }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || 'Failed to create profile');
  return body[0];
}

// ─── Dealership settings (warranty / benefits / specials) ─────────────────────

export async function saveDealershipSettings(dealershipId, patch) {
  const res  = await authedFetch(`/rest/v1/dealerships?id=eq.${dealershipId}`, {
    method:  'PATCH',
    headers: { Prefer: 'return=representation' },
    body:    JSON.stringify(patch),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || 'Failed to save settings');
  return body[0];
}

// ─── Dashboard data ───────────────────────────────────────────────────────────

export async function getDealershipReps(dealershipId) {
  const res  = await authedFetch(`/rest/v1/profiles?dealership_id=eq.${dealershipId}&select=*&order=created_at.asc`);
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || 'Failed to fetch reps');
  return body;
}

// Managers get every dealership vehicle via RLS; reps get only their own.
export async function getDealershipVehicles() {
  const res  = await authedFetch('/rest/v1/vehicles?select=*&order=scraped_at.desc');
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || 'Failed to fetch vehicles');
  return body;
}

export async function addVehicle(fields) {
  const session = getStoredSession();
  const row = {
    ...fields,
    dealer_id:    session.user.id,
    manual_entry: true,
    scraped_at:   new Date().toISOString(),
  };
  const res  = await authedFetch('/rest/v1/vehicles', {
    method:  'POST',
    headers: { Prefer: 'return=representation' },
    body:    JSON.stringify(row),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || 'Failed to add vehicle');
  return body[0];
}

export async function markVehicleListed(vehicleId) {
  const res  = await authedFetch(`/rest/v1/vehicles?id=eq.${vehicleId}`, {
    method:  'PATCH',
    headers: { Prefer: 'return=representation' },
    body:    JSON.stringify({ listed_at: new Date().toISOString() }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || 'Failed to mark listed');
  return body[0];
}

export async function markVehicleSold(vehicleId) {
  const res  = await authedFetch(`/rest/v1/vehicles?id=eq.${vehicleId}`, {
    method:  'PATCH',
    headers: { Prefer: 'return=representation' },
    body:    JSON.stringify({ sold_at: new Date().toISOString() }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || 'Failed to mark sold');
  return body[0];
}

export async function unmarkVehicleSold(vehicleId) {
  const res = await authedFetch(`/rest/v1/vehicles?id=eq.${vehicleId}`, {
    method: 'PATCH',
    body:   JSON.stringify({ sold_at: null }),
  });
  if (!res.ok) throw new Error('Failed to unmark sold');
}

export async function deleteVehicle(vehicleId) {
  const res = await authedFetch(`/rest/v1/vehicles?id=eq.${vehicleId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete vehicle');
}

export async function inviteRep(email, fullName) {
  const redirectTo = window.location.origin + window.location.pathname;
  const res  = await authedFetch('/functions/v1/invite-rep', {
    method: 'POST',
    body:   JSON.stringify({ email, fullName, redirectTo }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Invite failed');
  return body;
}
