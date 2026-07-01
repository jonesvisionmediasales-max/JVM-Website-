import * as db from './supabase.js';

// ─── State ────────────────────────────────────────────────────────────────────
let profile  = null;   // current user's profile row (includes .dealership)
let vehicles = [];     // all dealership vehicles
let reps     = [];     // all profiles in the dealership

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const loginSection     = document.getElementById('login-section');
const repSection       = document.getElementById('rep-section');
const dashSection      = document.getElementById('dashboard-section');

const loginEmail       = document.getElementById('login-email');
const loginPassword    = document.getElementById('login-password');
const loginBtn         = document.getElementById('login-btn');
const loginError       = document.getElementById('login-error');

const dealershipName   = document.getElementById('dealership-name-display');

const mTotal           = document.getElementById('m-total');
const mListed          = document.getElementById('m-listed');
const mCompliance      = document.getElementById('m-compliance');
const mAvgDays         = document.getElementById('m-avg-days');
const mSold            = document.getElementById('m-sold');

const overviewTbody    = document.getElementById('overview-tbody');
const vehiclesTbody    = document.getElementById('vehicles-tbody');
const repGrid          = document.getElementById('rep-grid');

const filterRep        = document.getElementById('filter-rep');
const filterStatus     = document.getElementById('filter-status');

const inviteModal      = document.getElementById('invite-modal');
const inviteEmail      = document.getElementById('invite-email');
const inviteName       = document.getElementById('invite-name');
const inviteError      = document.getElementById('invite-error');
const inviteSuccess    = document.getElementById('invite-success');
const inviteSendBtn    = document.getElementById('invite-send-btn');

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  db.parseSessionFromHash();   // handle invite / magic-link redirects

  const session = db.getStoredSession();
  if (!session) { showLogin(); return; }

  try {
    await loadDashboard();
  } catch (err) {
    console.error(err);
    showLogin();
  }
}

async function loadDashboard() {
  let p = await db.getProfile();

  if (!p) {
    // First-time manager login — bootstrap dealership + profile from extension signup metadata
    const session = db.getStoredSession();
    const dealerName = session.user.user_metadata?.dealership_name || 'My Dealership';
    const dealership = await db.createDealership(dealerName);
    p = await db.createProfile(dealership.id, 'manager', dealerName, session.user.email);
    p = await db.getProfile();  // re-fetch to get embedded dealership object
  }

  profile = p;

  if (profile?.role === 'rep') {
    showRep();
    return;
  }

  showDash();
  dealershipName.textContent = profile?.dealership?.name || '';
  await refreshData();
}

// ─── Views ────────────────────────────────────────────────────────────────────
function showLogin() {
  loginSection.classList.remove('hidden');
  repSection.classList.add('hidden');
  dashSection.classList.add('hidden');
}

function showRep() {
  loginSection.classList.add('hidden');
  repSection.classList.remove('hidden');
  dashSection.classList.add('hidden');
}

function showDash() {
  loginSection.classList.add('hidden');
  repSection.classList.add('hidden');
  dashSection.classList.remove('hidden');
}

// ─── Data loading ─────────────────────────────────────────────────────────────
async function refreshData() {
  [vehicles, reps] = await Promise.all([
    db.getDealershipVehicles(),
    db.getDealershipReps(profile.dealership_id),
  ]);
  renderMetrics();
  renderActiveTab();
}

// ─── Metrics ──────────────────────────────────────────────────────────────────
function renderMetrics() {
  const total    = vehicles.length;
  const listed   = vehicles.filter(v => v.listed_at).length;
  const sold     = vehicles.filter(v => v.sold_at).length;
  const pct      = total ? Math.round((listed / total) * 100) : 0;
  const avgDays  = calcAvgDaysOnMarket(vehicles);

  mTotal.textContent      = total;
  mListed.textContent     = listed;
  mCompliance.textContent = total ? `${pct}%` : '—';
  mAvgDays.textContent    = avgDays !== null ? `${avgDays}d` : '—';
  mSold.textContent       = sold;
}

function calcAvgDaysOnMarket(vList) {
  const listed = vList.filter(v => v.listed_at);
  if (!listed.length) return null;
  const days = listed.map(v => {
    const start = new Date(v.listed_at);
    const end   = v.sold_at ? new Date(v.sold_at) : new Date();
    return Math.max(0, Math.round((end - start) / 86400000));
  });
  return Math.round(days.reduce((a, b) => a + b, 0) / days.length);
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
let activeTab = 'overview';

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    activeTab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === `tab-${activeTab}`));
    renderActiveTab();
  });
});

function renderActiveTab() {
  if (activeTab === 'overview')  renderOverview();
  if (activeTab === 'vehicles')  renderVehiclesTab();
  if (activeTab === 'team')      renderTeam();
}

// ─── Overview tab ─────────────────────────────────────────────────────────────
function renderOverview() {
  const repsMap = buildRepsMap();
  overviewTbody.innerHTML = '';

  if (!reps.length) {
    overviewTbody.innerHTML = `<tr><td colspan="6" class="empty-state">No reps yet. Invite one from the Team tab.</td></tr>`;
    return;
  }

  for (const rep of reps) {
    const repVehicles = vehicles.filter(v => v.dealer_id === rep.id);
    const total    = repVehicles.length;
    const listed   = repVehicles.filter(v => v.listed_at).length;
    const sold     = repVehicles.filter(v => v.sold_at).length;
    const pct      = total ? Math.round((listed / total) * 100) : 0;
    const avgDays  = calcAvgDaysOnMarket(repVehicles);

    const fillClass = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="font-weight:600">${esc(rep.full_name || '—')}</div>
        <div class="muted" style="font-size:12px">${esc(rep.email || '')}</div>
      </td>
      <td>${total}</td>
      <td>${listed}</td>
      <td>${sold}</td>
      <td>
        <div class="compliance-bar-wrap">
          <div class="compliance-bar-bg">
            <div class="compliance-bar-fill ${fillClass}" style="width:${pct}%"></div>
          </div>
          <span style="font-size:12px;white-space:nowrap;min-width:36px;text-align:right">${total ? pct + '%' : '—'}</span>
        </div>
      </td>
      <td>${avgDays !== null ? avgDays + ' days' : '—'}</td>
    `;
    overviewTbody.appendChild(tr);
  }
}

// ─── Vehicles tab ─────────────────────────────────────────────────────────────
function renderVehiclesTab() {
  // Rebuild rep filter options
  filterRep.innerHTML = '<option value="">All reps</option>';
  for (const rep of reps) {
    const opt = document.createElement('option');
    opt.value = rep.id;
    opt.textContent = rep.full_name || rep.email || rep.id;
    filterRep.appendChild(opt);
  }

  const repId   = filterRep.value;
  const status  = filterStatus.value;

  let filtered = vehicles;
  if (repId)  filtered = filtered.filter(v => v.dealer_id === repId);
  if (status === 'listed')   filtered = filtered.filter(v => v.listed_at && !v.sold_at);
  if (status === 'sold')     filtered = filtered.filter(v => v.sold_at);
  if (status === 'unlisted') filtered = filtered.filter(v => !v.listed_at);

  vehiclesTbody.innerHTML = '';

  if (!filtered.length) {
    vehiclesTbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:#6b6b67">No vehicles match the current filters.</td></tr>`;
    return;
  }

  const repsMap = buildRepsMap();

  for (const v of filtered) {
    const rep       = repsMap[v.dealer_id];
    const title     = [v.year, v.make, v.model, v.trim].filter(Boolean).join(' ') || 'Unknown vehicle';
    const scrapedAt = v.scraped_at ? fmtDate(v.scraped_at) : '—';
    const listedAt  = v.listed_at  ? fmtDate(v.listed_at)  : '—';
    const daysOnMkt = v.listed_at
      ? Math.max(0, Math.round((new Date(v.sold_at || Date.now()) - new Date(v.listed_at)) / 86400000))
      : null;

    const badge = v.sold_at
      ? `<span class="badge badge-sold">Sold</span>`
      : v.listed_at
        ? `<span class="badge badge-listed">Listed</span>`
        : `<span class="badge badge-unlisted">Not listed</span>`;

    const action = v.sold_at
      ? `<button class="action-btn sold-btn" data-id="${v.id}" data-action="unsold">Unmark sold</button>`
      : `<button class="action-btn" data-id="${v.id}" data-action="sold">Mark sold</button>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="font-weight:500">${esc(title)}</div>
        ${v.vin ? `<div class="muted" style="font-size:11px">VIN ${esc(v.vin)}</div>` : ''}
      </td>
      <td>${esc(rep?.full_name || rep?.email || '—')}</td>
      <td class="muted">${scrapedAt}</td>
      <td class="muted">${listedAt}</td>
      <td>${daysOnMkt !== null ? daysOnMkt + 'd' : '—'}</td>
      <td>${badge}</td>
      <td>${action}</td>
    `;
    vehiclesTbody.appendChild(tr);
  }
}

vehiclesTbody.addEventListener('click', async e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  btn.disabled = true;
  try {
    if (btn.dataset.action === 'sold') {
      await db.markVehicleSold(btn.dataset.id);
    } else {
      await db.unmarkVehicleSold(btn.dataset.id);
    }
    await refreshData();
  } catch (err) {
    alert(err.message);
    btn.disabled = false;
  }
});

filterRep.addEventListener('change',    renderVehiclesTab);
filterStatus.addEventListener('change', renderVehiclesTab);

// ─── Team tab ─────────────────────────────────────────────────────────────────
function renderTeam() {
  repGrid.innerHTML = '';

  if (!reps.length) {
    repGrid.innerHTML = `<div class="empty-state"><div style="font-size:32px">👥</div><p>No reps yet. Click "Invite Sales Rep" to add your first one.</p></div>`;
    return;
  }

  for (const rep of reps) {
    const repVehicles = vehicles.filter(v => v.dealer_id === rep.id);
    const total   = repVehicles.length;
    const listed  = repVehicles.filter(v => v.listed_at).length;
    const sold    = repVehicles.filter(v => v.sold_at).length;
    const pct     = total ? Math.round((listed / total) * 100) : 0;
    const fillClass = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';
    const roleLabel = rep.role === 'manager' ? ' · Manager' : '';

    const card = document.createElement('div');
    card.className = 'rep-card';
    card.innerHTML = `
      <div class="rep-card-name">${esc(rep.full_name || '—')}${roleLabel}</div>
      <div class="rep-card-email">${esc(rep.email || '')}</div>
      <div class="rep-stats">
        <div>
          <div class="rep-stat-label">Scraped</div>
          <div class="rep-stat-value">${total}</div>
        </div>
        <div>
          <div class="rep-stat-label">Listed</div>
          <div class="rep-stat-value">${listed}</div>
        </div>
        <div>
          <div class="rep-stat-label">Sold</div>
          <div class="rep-stat-value">${sold}</div>
        </div>
      </div>
      <div class="compliance-bar-wrap">
        <div class="compliance-bar-bg" style="flex:1">
          <div class="compliance-bar-fill ${fillClass}" style="width:${pct}%"></div>
        </div>
        <span style="font-size:12px;min-width:40px;text-align:right">${total ? pct + '% compliance' : 'No vehicles'}</span>
      </div>
    `;
    repGrid.appendChild(card);
  }
}

// ─── Invite modal ─────────────────────────────────────────────────────────────
document.getElementById('invite-btn').addEventListener('click', () => {
  inviteEmail.value    = '';
  inviteName.value     = '';
  inviteError.textContent   = '';
  inviteSuccess.textContent = '';
  inviteModal.classList.remove('hidden');
});

document.getElementById('invite-cancel-btn').addEventListener('click', () => {
  inviteModal.classList.add('hidden');
});

document.getElementById('modal-backdrop').addEventListener('click', () => {
  inviteModal.classList.add('hidden');
});

inviteSendBtn.addEventListener('click', async () => {
  inviteError.textContent   = '';
  inviteSuccess.textContent = '';
  const email    = inviteEmail.value.trim();
  const fullName = inviteName.value.trim();
  if (!email) { inviteError.textContent = 'Enter an email address.'; return; }
  inviteSendBtn.disabled    = true;
  inviteSendBtn.textContent = 'Sending…';
  try {
    await db.inviteRep(email, fullName);
    inviteSuccess.textContent = `Invite sent to ${email}. They'll get an email with a link to set their password.`;
    inviteEmail.value = '';
    inviteName.value  = '';
    await refreshData();
  } catch (err) {
    inviteError.textContent = err.message;
  } finally {
    inviteSendBtn.disabled    = false;
    inviteSendBtn.textContent = 'Send Invite';
  }
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
loginBtn.addEventListener('click', async () => {
  loginError.textContent = '';
  loginBtn.disabled      = true;
  loginBtn.textContent   = 'Logging in…';
  try {
    await db.signIn(loginEmail.value.trim(), loginPassword.value);
    await loadDashboard();
  } catch (err) {
    loginError.textContent = err.message;
  } finally {
    loginBtn.disabled    = false;
    loginBtn.textContent = 'Log in';
  }
});

loginPassword.addEventListener('keydown', e => {
  if (e.key === 'Enter') loginBtn.click();
});

document.getElementById('signout-btn').addEventListener('click', async () => {
  await db.signOut();
  showLogin();
});

document.getElementById('rep-signout-btn').addEventListener('click', async () => {
  await db.signOut();
  showLogin();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildRepsMap() {
  return Object.fromEntries(reps.map(r => [r.id, r]));
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function esc(str) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
init();
