const state = {
  metrics: {
    activeReports: 15,
    highRiskAreas: 13,
    criticalSubstances: 5,
    affectedDemographics: '18-35',
    level: 'Elevated',
    countyCount: 23,
  },
  reports: [
    { county: 'Franklin', severity: 'High', substance: 'Fentanyl' },
    { county: 'Mercer', severity: 'Medium', substance: 'Methamphetamine' },
    { county: 'Riverside', severity: 'Low', substance: 'Prescription Opioids' },
    { county: 'Greene', severity: 'High', substance: 'Xylazine Mix' },
  ],
  hotspots: ['Franklin', 'Greene', 'Mercer', 'Oakridge', 'Riverside'],
  notes: ['Coordinate naloxone shipment for Franklin by Friday.'],
  trend: [38, 42, 40, 52, 56, 49, 61],
};

const viewTitles = {
  dashboard: 'Drug Misuse Intelligence Dashboard',
  reports: 'Incident Reporting Center',
  map: 'Geographic Hotspot Summary',
  analytics: 'Trend Analytics',
  notes: 'Coordination Notes',
  citations: 'Reference & Sources',
};

function renderDashboard() {
  const { metrics } = state;
  document.querySelector('#active-reports').textContent = metrics.activeReports;
  document.querySelector('#high-risk-areas').textContent = metrics.highRiskAreas;
  document.querySelector('#critical-substances').textContent = metrics.criticalSubstances;
  document.querySelector('#affected-demo').textContent = metrics.affectedDemographics;
  document.querySelector('#alert-banner').innerHTML = `⚠️ <strong>Current Alert Level:</strong> ${metrics.level} — Increased overdose incidents reported in ${metrics.countyCount} counties.`;
  document.querySelector('#analysis-text').textContent =
    `Recent analyses show a ${metrics.level.toLowerCase()} response posture with concentrated pressure in ${metrics.highRiskAreas} high-risk areas. Public health teams are prioritizing outreach, naloxone deployment, and surveillance updates across ${metrics.countyCount} counties.`;
}

function renderReports() {
  const filter = document.querySelector('#severity-filter').value;
  const reportList = document.querySelector('#report-list');
  reportList.innerHTML = '';

  const visibleItems = state.reports.filter((item) => filter === 'all' || item.severity === filter);
  if (visibleItems.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No reports found for this severity.';
    reportList.appendChild(li);
    return;
  }

  visibleItems.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.county} County — ${item.severity} severity — ${item.substance}`;
    reportList.appendChild(li);
  });
}

function renderHotspots() {
  const list = document.querySelector('#hotspot-list');
  list.innerHTML = '';
  state.hotspots.forEach((county, i) => {
    const li = document.createElement('li');
    li.textContent = `#${i + 1} ${county} County`;
    list.appendChild(li);
  });
}

function renderTrend() {
  const trendBars = document.querySelector('#trend-bars');
  trendBars.innerHTML = '';
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  state.trend.forEach((value, i) => {
    const bar = document.createElement('div');
    bar.className = 'trend-bar';
    bar.style.height = `${value * 2}px`;
    bar.dataset.day = days[i];
    bar.title = `${days[i]}: ${value} incidents`;
    trendBars.appendChild(bar);
  });
}

function renderNotes() {
  const list = document.querySelector('#notes-list');
  list.innerHTML = '';
  state.notes.forEach((note) => {
    const li = document.createElement('li');
    li.textContent = note;
    list.appendChild(li);
  });
}

function randomizeData() {
  const levelOrder = ['Guarded', 'Elevated', 'Severe'];
  state.metrics.activeReports = Math.max(8, state.metrics.activeReports + Math.floor(Math.random() * 5 - 2));
  state.metrics.highRiskAreas = Math.max(6, state.metrics.highRiskAreas + Math.floor(Math.random() * 5 - 2));
  state.metrics.criticalSubstances = Math.max(3, state.metrics.criticalSubstances + Math.floor(Math.random() * 3 - 1));
  state.metrics.countyCount = Math.max(10, state.metrics.countyCount + Math.floor(Math.random() * 7 - 3));
  state.metrics.level = levelOrder[Math.floor(Math.random() * levelOrder.length)];
  state.trend = state.trend.map((n) => Math.max(25, n + Math.floor(Math.random() * 9 - 4)));
}

function getViewFromHash() {
  const hashView = window.location.hash.replace('#', '').trim();
  return Object.hasOwn(viewTitles, hashView) ? hashView : 'dashboard';
}

function switchView(nextView) {
  const targetView = document.querySelector(`#${nextView}-view`);
  if (!targetView) {
    return;
  }

  document.querySelectorAll('.nav-item').forEach((link) => {
    const active = link.dataset.view === nextView;
    link.classList.toggle('active', active);
    link.setAttribute('aria-current', active ? 'page' : 'false');
  });

  document.querySelectorAll('.view').forEach((view) => {
    const isTarget = view.id === `${nextView}-view`;
    view.hidden = !isTarget;
    view.classList.toggle('active-view', isTarget);
  });

  document.querySelector('#view-title').textContent = viewTitles[nextView] ?? viewTitles.dashboard;
}

function initEvents() {
  document.querySelector('#refresh-btn').addEventListener('click', () => {
    randomizeData();
    renderDashboard();
    renderTrend();
  });

  document.querySelector('#severity-filter').addEventListener('change', renderReports);

  document.querySelector('#note-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.querySelector('#note-input');
    const nextNote = input.value.trim();
    if (!nextNote) {
      return;
    }
    state.notes.unshift(nextNote);
    input.value = '';
    renderNotes();
  });

  document.querySelector('.nav').addEventListener('click', (event) => {
    const link = event.target.closest('.nav-item');
    if (!link) {
      return;
    }
    event.preventDefault();
    const nextView = link.dataset.view;
    switchView(nextView);
    window.history.replaceState(null, '', `#${nextView}`);
  });

  window.addEventListener('hashchange', () => {
    switchView(getViewFromHash());
  });
}

function init() {
  renderDashboard();
  renderReports();
  renderHotspots();
  renderTrend();
  renderNotes();
  initEvents();
  switchView(getViewFromHash());
}

init();
