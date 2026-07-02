import * as db from './supabase.js';

// ─── State ────────────────────────────────────────────────────────────────────
let profile   = null;   // current user's profile row (includes .dealership)
let vehicles  = [];     // vehicles visible to this user (all for managers, own for reps)
let reps      = [];     // all profiles in the dealership (managers only)
let isManager = false;
let activeTab = 'overview';

// Tabs available per role
const MANAGER_TABS = [
  { id: 'overview', label: 'Team Overview' },
  { id: 'vehicles', label: 'Inventory' },
  { id: 'team',     label: 'Team' },
  { id: 'settings', label: 'Settings' },
];
const REP_TABS = [
  { id: 'vehicles', label: 'My Inventory' },
  { id: 'settings', label: 'Dealership Info' },
];

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);

const loginSection   = $('login-section');
const dashSection    = $('dashboard-section');
const loginEmail     = $('login-email');
const loginPassword  = $('login-password');
const loginBtn       = $('login-btn');
const loginError     = $('login-error');
const dealershipName = $('dealership-name-display');
const userChip       = $('user-chip');
const metricsBar     = $('metrics-bar');
const tabBar         = $('tab-bar');
const overviewTbody  = $('overview-tbody');
const vehiclesTbody  = $('vehicles-tbody');
const repGrid        = $('rep-grid');
const filterRep      = $('filter-rep');
const filterStatus   = $('filter-status');

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  db.parseSessionFromHash();
  if (!db.getStoredSession()) { showLogin(); return; }
  try { await loadDashboard(); }
  catch (err) { console.error(err); showLogin(); }
}

async function loadDashboard() {
  let p = await db.getProfile();

  if (!p) {
    // First-time manager login — bootstrap dealership + manager profile
    const session = db.getStoredSession();
    const dealerName = session.user.user_metadata?.dealership_name || 'My Dealership';
    const dealership = await db.createDealership(dealerName);
    await db.createProfile(dealership.id, 'manager', dealerName, session.user.email);
    p = await db.getProfile();
  }

  profile   = p;
  isManager = profile?.role === 'manager';
  showDash();
  await refreshData();
}

// ─── Views ────────────────────────────────────────────────────────────────────
function showLogin() {
  loginSection.classList.remove('hidden');
  dashSection.classList.add('hidden');
}

function showDash() {
  loginSection.classList.add('hidden');
  dashSection.classList.remove('hidden');

  dealershipName.textContent = profile?.dealership?.name || '';
  userChip.textContent = `${profile?.full_name || profile?.email || ''} · ${isManager ? 'Manager' : 'Sales Rep'}`;

  // Show/hide manager-only elements
  document.querySelectorAll('.manager-only, .manager-col').forEach(el => {
    el.classList.toggle('hidden', !isManager);
  });

  buildTabs();
}

function buildTabs() {
  const tabs = isManager ? MANAGER_TABS : REP_TABS;
  activeTab = tabs[0].id;
  tabBar.innerHTML = '';
  for (const t of tabs) {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (t.id === activeTab ? ' active' : '');
    btn.textContent = t.label;
    btn.addEventListener('click', () => selectTab(t.id));
    tabBar.appendChild(btn);
  }
  applyTabVisibility();
}

function selectTab(id) {
  activeTab = id;
  [...tabBar.children].forEach((btn, i) => {
    const tabs = isManager ? MANAGER_TABS : REP_TABS;
    btn.classList.toggle('active', tabs[i].id === id);
  });
  applyTabVisibility();
  renderActiveTab();
}

function applyTabVisibility() {
  document.querySelectorAll('.tab-content').forEach(c => {
    c.classList.toggle('active', c.id === `tab-${activeTab}`);
  });
}

// ─── Data loading ─────────────────────────────────────────────────────────────
async function refreshData() {
  const tasks = [db.getDealershipVehicles()];
  if (isManager) tasks.push(db.getDealershipReps(profile.dealership_id));
  const results = await Promise.all(tasks);
  vehicles = results[0];
  reps = isManager ? results[1] : [profile];
  renderMetrics();
  renderActiveTab();
}

// ─── Metrics ──────────────────────────────────────────────────────────────────
function renderMetrics() {
  const total  = vehicles.length;
  const listed = vehicles.filter(v => v.listed_at).length;
  const sold   = vehicles.filter(v => v.sold_at).length;
  const pct    = total ? Math.round((listed / total) * 100) : 0;
  const avg    = calcAvgDaysOnMarket(vehicles);
  const activeReps = isManager
    ? reps.filter(r => vehicles.some(v => v.dealer_id === r.id && v.listed_at)).length
    : null;

  const cards = [
    { value: total,                      label: isManager ? 'Vehicles in Inventory' : 'My Vehicles' },
    { value: listed,                     label: 'Posted to Marketplace' },
    { value: total ? `${pct}%` : '—',    label: 'Compliance Rate' },
    { value: avg !== null ? `${avg}d` : '—', label: 'Avg Days on Market' },
    { value: sold,                       label: 'Sold on Marketplace' },
  ];
  if (isManager) {
    cards.push({ value: `${activeReps}/${reps.length}`, label: 'Reps Actively Posting' });
  }

  metricsBar.innerHTML = cards.map(c => `
    <div class="metric-card">
      <div class="metric-value">${c.value}</div>
      <div class="metric-label">${c.label}</div>
    </div>
  `).join('');
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

// ─── Tab dispatch ─────────────────────────────────────────────────────────────
function renderActiveTab() {
  if (activeTab === 'overview')  renderOverview();
  if (activeTab === 'vehicles')  renderVehiclesTab();
  if (activeTab === 'team')      renderTeam();
  if (activeTab === 'settings')  renderSettings();
}

// ─── Overview tab (manager) ───────────────────────────────────────────────────
function renderOverview() {
  overviewTbody.innerHTML = '';
  if (!reps.length) {
    overviewTbody.innerHTML = `<tr><td colspan="6" class="empty-cell">No reps yet. Invite one from the Team tab.</td></tr>`;
    return;
  }
  for (const rep of reps) {
    const rv     = vehicles.filter(v => v.dealer_id === rep.id);
    const total  = rv.length;
    const listed = rv.filter(v => v.listed_at).length;
    const sold   = rv.filter(v => v.sold_at).length;
    const pct    = total ? Math.round((listed / total) * 100) : 0;
    const avg    = calcAvgDaysOnMarket(rv);
    const cls    = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="font-weight:600">${esc(rep.full_name || '—')}${rep.role === 'manager' ? ' <span class="tag">Manager</span>' : ''}</div>
        <div class="muted" style="font-size:12px">${esc(rep.email || '')}</div>
      </td>
      <td>${total}</td>
      <td>${listed}</td>
      <td>${sold}</td>
      <td>
        <div class="compliance-bar-wrap">
          <div class="compliance-bar-bg"><div class="compliance-bar-fill ${cls}" style="width:${pct}%"></div></div>
          <span class="pct-label">${total ? pct + '%' : '—'}</span>
        </div>
      </td>
      <td>${avg !== null ? avg + ' days' : '—'}</td>
    `;
    overviewTbody.appendChild(tr);
  }
}

// ─── Inventory tab (all roles) ────────────────────────────────────────────────
function renderVehiclesTab() {
  if (isManager) {
    filterRep.innerHTML = '<option value="">All reps</option>';
    for (const rep of reps) {
      const opt = document.createElement('option');
      opt.value = rep.id;
      opt.textContent = rep.full_name || rep.email || rep.id;
      filterRep.appendChild(opt);
    }
  }

  const repId  = isManager ? filterRep.value : '';
  const status = filterStatus.value;

  let filtered = vehicles;
  if (repId)  filtered = filtered.filter(v => v.dealer_id === repId);
  if (status === 'listed')   filtered = filtered.filter(v => v.listed_at && !v.sold_at);
  if (status === 'sold')     filtered = filtered.filter(v => v.sold_at);
  if (status === 'unlisted') filtered = filtered.filter(v => !v.listed_at);

  vehiclesTbody.innerHTML = '';
  if (!filtered.length) {
    vehiclesTbody.innerHTML = `<tr><td colspan="7" class="empty-cell">No vehicles yet. Click "Add Vehicle" or scrape one with the Chrome extension.</td></tr>`;
    return;
  }

  const repsMap = Object.fromEntries(reps.map(r => [r.id, r]));

  for (const v of filtered) {
    const rep    = repsMap[v.dealer_id];
    const title  = [v.year, v.make, v.model, v.trim].filter(Boolean).join(' ') || 'Unknown vehicle';
    const days   = v.listed_at
      ? Math.max(0, Math.round((new Date(v.sold_at || Date.now()) - new Date(v.listed_at)) / 86400000))
      : null;
    const badge  = v.sold_at
      ? `<span class="badge badge-sold">Sold</span>`
      : v.listed_at ? `<span class="badge badge-listed">Listed</span>`
      : `<span class="badge badge-unlisted">Not listed</span>`;

    // Actions differ by state
    let actions = '';
    if (!v.listed_at) actions += `<button class="action-btn" data-id="${v.id}" data-action="list">Mark listed</button>`;
    if (v.listed_at && !v.sold_at) actions += `<button class="action-btn sold-btn" data-id="${v.id}" data-action="sold">Mark sold</button>`;
    if (v.sold_at) actions += `<button class="action-btn" data-id="${v.id}" data-action="unsold">Reopen</button>`;
    actions += `<button class="action-btn danger" data-id="${v.id}" data-action="delete" title="Delete">✕</button>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="font-weight:500">${esc(title)}${v.manual_entry ? ' <span class="tag">Manual</span>' : ''}</div>
        <div class="muted" style="font-size:11px">${[v.price ? '$' + esc(v.price) : '', v.mileage ? esc(v.mileage) + ' mi' : '', v.vin ? 'VIN ' + esc(v.vin) : ''].filter(Boolean).join(' · ')}</div>
      </td>
      <td class="manager-col ${isManager ? '' : 'hidden'}">${esc(rep?.full_name || rep?.email || '—')}</td>
      <td class="muted">${v.scraped_at ? fmtDate(v.scraped_at) : '—'}</td>
      <td class="muted">${v.listed_at ? fmtDate(v.listed_at) : '—'}</td>
      <td>${days !== null ? days + 'd' : '—'}</td>
      <td>${badge}</td>
      <td><div class="row-actions">${actions}</div></td>
    `;
    vehiclesTbody.appendChild(tr);
  }
}

vehiclesTbody.addEventListener('click', async e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { id, action } = btn.dataset;
  if (action === 'delete' && !confirm('Delete this vehicle from inventory?')) return;
  btn.disabled = true;
  try {
    if (action === 'list')   await db.markVehicleListed(id);
    if (action === 'sold')   await db.markVehicleSold(id);
    if (action === 'unsold') await db.unmarkVehicleSold(id);
    if (action === 'delete') await db.deleteVehicle(id);
    await refreshData();
  } catch (err) {
    alert(err.message);
    btn.disabled = false;
  }
});

filterRep.addEventListener('change',    renderVehiclesTab);
filterStatus.addEventListener('change', renderVehiclesTab);

// ─── Team tab (manager) ───────────────────────────────────────────────────────
function renderTeam() {
  repGrid.innerHTML = '';
  if (!reps.length) {
    repGrid.innerHTML = `<div class="empty-state"><p>No reps yet. Click "Invite Sales Rep" to add your first one.</p></div>`;
    return;
  }
  for (const rep of reps) {
    const rv     = vehicles.filter(v => v.dealer_id === rep.id);
    const total  = rv.length;
    const listed = rv.filter(v => v.listed_at).length;
    const sold   = rv.filter(v => v.sold_at).length;
    const pct    = total ? Math.round((listed / total) * 100) : 0;
    const cls    = pct >= 80 ? 'high' : pct >= 50 ? 'mid' : 'low';

    const card = document.createElement('div');
    card.className = 'rep-card';
    card.innerHTML = `
      <div class="rep-card-name">${esc(rep.full_name || '—')}${rep.role === 'manager' ? ' <span class="tag">Manager</span>' : ''}</div>
      <div class="rep-card-email">${esc(rep.email || '')}</div>
      <div class="rep-stats">
        <div><div class="rep-stat-label">Scraped</div><div class="rep-stat-value">${total}</div></div>
        <div><div class="rep-stat-label">Listed</div><div class="rep-stat-value">${listed}</div></div>
        <div><div class="rep-stat-label">Sold</div><div class="rep-stat-value">${sold}</div></div>
      </div>
      <div class="compliance-bar-wrap">
        <div class="compliance-bar-bg"><div class="compliance-bar-fill ${cls}" style="width:${pct}%"></div></div>
        <span class="pct-label">${total ? pct + '%' : '—'}</span>
      </div>
    `;
    repGrid.appendChild(card);
  }
}

// ─── Settings tab ─────────────────────────────────────────────────────────────
function renderSettings() {
  const d = profile?.dealership || {};
  $('set-warranty').value = d.warranty_text || '';
  $('set-benefits').value = d.product_benefits || '';
  $('set-specials').value = d.specials || '';

  const readOnly = !isManager;
  ['set-warranty', 'set-benefits', 'set-specials'].forEach(id => { $(id).disabled = readOnly; });
  $('save-settings-btn').classList.toggle('hidden', readOnly);
  $('settings-intro').textContent = readOnly
    ? 'These settings are managed by your dealership manager. Reps can view them but not edit.'
    : 'Set your dealership-wide warranty, benefits, and specials. These are available to every rep and used in AI-generated listings.';
}

$('save-settings-btn').addEventListener('click', async () => {
  const status = $('settings-status');
  status.textContent = 'Saving…';
  try {
    const patch = {
      warranty_text:    $('set-warranty').value.trim() || null,
      product_benefits: $('set-benefits').value.trim() || null,
      specials:         $('set-specials').value.trim() || null,
    };
    await db.saveDealershipSettings(profile.dealership_id, patch);
    profile.dealership = { ...profile.dealership, ...patch };
    status.textContent = 'Saved.';
    setTimeout(() => { status.textContent = ''; }, 2500);
  } catch (err) {
    status.textContent = err.message;
  }
});

// ─── Add Vehicle modal ────────────────────────────────────────────────────────
$('add-vehicle-btn').addEventListener('click', () => {
  ['v-year','v-make','v-model','v-trim','v-price','v-mileage','v-vin','v-color'].forEach(id => { $(id).value = ''; });
  $('vehicle-error').textContent = '';
  openModal('vehicle-modal');
});

$('vehicle-save-btn').addEventListener('click', async () => {
  const err = $('vehicle-error');
  err.textContent = '';
  const fields = {
    year:  $('v-year').value.trim(),
    make:  $('v-make').value.trim(),
    model: $('v-model').value.trim(),
    trim:  $('v-trim').value.trim(),
    price: $('v-price').value.trim(),
    mileage: $('v-mileage').value.trim(),
    vin:   $('v-vin').value.trim(),
    exterior_color: $('v-color').value.trim(),
  };
  if (!fields.make && !fields.model && !fields.year) {
    err.textContent = 'Enter at least a year, make, or model.';
    return;
  }
  const btn = $('vehicle-save-btn');
  btn.disabled = true; btn.textContent = 'Adding…';
  try {
    await db.addVehicle(fields);
    closeModal('vehicle-modal');
    await refreshData();
  } catch (e) {
    err.textContent = e.message;
  } finally {
    btn.disabled = false; btn.textContent = 'Add Vehicle';
  }
});

// ─── Invite modal ─────────────────────────────────────────────────────────────
$('invite-btn').addEventListener('click', () => {
  $('invite-email').value = '';
  $('invite-name').value  = '';
  $('invite-error').textContent   = '';
  $('invite-success').textContent = '';
  openModal('invite-modal');
});

$('invite-send-btn').addEventListener('click', async () => {
  const errEl = $('invite-error'), okEl = $('invite-success');
  errEl.textContent = ''; okEl.textContent = '';
  const email = $('invite-email').value.trim();
  const name  = $('invite-name').value.trim();
  if (!email) { errEl.textContent = 'Enter an email address.'; return; }
  const btn = $('invite-send-btn');
  btn.disabled = true; btn.textContent = 'Sending…';
  try {
    await db.inviteRep(email, name);
    okEl.textContent = `Invite sent to ${email}. They'll get an email to set their password.`;
    $('invite-email').value = ''; $('invite-name').value = '';
    await refreshData();
  } catch (err) {
    errEl.textContent = err.message;
  } finally {
    btn.disabled = false; btn.textContent = 'Send Invite';
  }
});

// ─── Modal helpers ────────────────────────────────────────────────────────────
function openModal(id)  { $(id).classList.remove('hidden'); }
function closeModal(id) { $(id).classList.add('hidden'); }
document.querySelectorAll('[data-close]').forEach(el => {
  el.addEventListener('click', () => closeModal(el.dataset.close));
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
loginBtn.addEventListener('click', async () => {
  loginError.textContent = '';
  loginBtn.disabled = true; loginBtn.textContent = 'Logging in…';
  try {
    await db.signIn(loginEmail.value.trim(), loginPassword.value);
    await loadDashboard();
  } catch (err) {
    loginError.textContent = err.message;
  } finally {
    loginBtn.disabled = false; loginBtn.textContent = 'Log in';
  }
});
loginPassword.addEventListener('keydown', e => { if (e.key === 'Enter') loginBtn.click(); });
$('signout-btn').addEventListener('click', async () => { await db.signOut(); showLogin(); });

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function esc(str) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
init();
