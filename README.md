 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/app.js b/app.js
index 0fbef2d7ddca939cefb9e9e559abaa44306b5151..52fa32bf37f09ac6c09f8055122cee91277c3718 100644
--- a/app.js
+++ b/app.js
@@ -81,86 +81,99 @@ function renderTrend() {
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
 
+function getViewFromHash() {
+  const hashView = window.location.hash.replace('#', '').trim();
+  return Object.hasOwn(viewTitles, hashView) ? hashView : 'dashboard';
+}
+
 function switchView(nextView) {
   const targetView = document.querySelector(`#${nextView}-view`);
   if (!targetView) {
     return;
   }
 
-  document.querySelectorAll('.nav-item').forEach((button) => {
-    const active = button.dataset.view === nextView;
-    button.classList.toggle('active', active);
-    button.setAttribute('aria-current', active ? 'page' : 'false');
+  document.querySelectorAll('.nav-item').forEach((link) => {
+    const active = link.dataset.view === nextView;
+    link.classList.toggle('active', active);
+    link.setAttribute('aria-current', active ? 'page' : 'false');
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
-    const button = event.target.closest('.nav-item');
-    if (!button) {
+    const link = event.target.closest('.nav-item');
+    if (!link) {
       return;
     }
-    switchView(button.dataset.view);
+    event.preventDefault();
+    const nextView = link.dataset.view;
+    switchView(nextView);
+    window.history.replaceState(null, '', `#${nextView}`);
+  });
+
+  window.addEventListener('hashchange', () => {
+    switchView(getViewFromHash());
   });
 }
 
 function init() {
   renderDashboard();
   renderReports();
   renderHotspots();
   renderTrend();
   renderNotes();
   initEvents();
+  switchView(getViewFromHash());
 }
 
 init();
  (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/index.html b/index.html
index e1e54d6b9ab6adfaf70bbd4dd008e947b65f903e..4cc5c540b49ea4a56af27081b0faf8023136cf8b 100644
--- a/index.html
+++ b/index.html
@@ -1,55 +1,55 @@
 <!DOCTYPE html>
 <html lang="en">
   <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <title>Phramacum | Drug Misuse Intelligence Dashboard</title>
     <link rel="stylesheet" href="styles.css" />
   </head>
   <body>
     <div class="app-layout">
       <aside class="sidebar">
         <div class="brand">
           <span class="brand-dot" aria-hidden="true"></span>
           <h1>Phramacum</h1>
         </div>
 
         <nav class="nav" aria-label="Main">
-          <button class="nav-item active" data-view="dashboard">Dashboard</button>
-          <button class="nav-item" data-view="reports">Reports</button>
-          <button class="nav-item" data-view="map">Geographic Map</button>
-          <button class="nav-item" data-view="analytics">Analytics</button>
-          <button class="nav-item" data-view="notes">Notes</button>
-          <button class="nav-item" data-view="citations">Citations</button>
+          <a class="nav-item active" data-view="dashboard" href="#dashboard">Dashboard</a>
+          <a class="nav-item" data-view="reports" href="#reports">Reports</a>
+          <a class="nav-item" data-view="map" href="#map">Geographic Map</a>
+          <a class="nav-item" data-view="analytics" href="#analytics">Analytics</a>
+          <a class="nav-item" data-view="notes" href="#notes">Notes</a>
+          <a class="nav-item" data-view="citations" href="#citations">Citations</a>
         </nav>
       </aside>
 
       <main class="content">
         <header class="topbar">
           <h2 id="view-title">Drug Misuse Intelligence Dashboard</h2>
-          <button id="refresh-btn" class="btn-primary">Refresh Data</button>
+          <button id="refresh-btn" class="btn-primary" type="button">Refresh Data</button>
         </header>
 
         <section id="dashboard-view" class="view active-view">
           <div id="alert-banner" class="alert-banner" role="status"></div>
 
           <section class="stats-grid" aria-label="Summary Metrics">
             <article class="stat-card">
               <h3>Active Reports</h3>
               <p id="active-reports" class="stat-value">0</p>
             </article>
             <article class="stat-card">
               <h3>High-Risk Areas</h3>
               <p id="high-risk-areas" class="stat-value">0</p>
             </article>
             <article class="stat-card">
               <h3>Critical Substances</h3>
               <p id="critical-substances" class="stat-value">0</p>
             </article>
             <article class="stat-card">
               <h3>Affected Demographics</h3>
               <p id="affected-demo" class="stat-value">0-0</p>
             </article>
           </section>
 
           <section class="panel">
 
EOF
)
 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/styles.css b/styles.css
index 994e5b2000cc27daf62f9ac51fc449dda956efd7..4556f5aa370e91c80ff87f95c044a79898808fc8 100644
--- a/styles.css
+++ b/styles.css
@@ -36,136 +36,138 @@ body {
   display: flex;
   align-items: center;
   gap: 12px;
   margin-bottom: 22px;
 }
 
 .brand h1 {
   margin: 0;
   font-size: 34px;
 }
 
 .brand-dot {
   width: 22px;
   height: 22px;
   border-radius: 50%;
   background: radial-gradient(circle at 30% 30%, #ff7b97, #c5193f);
 }
 
 .nav {
   display: flex;
   flex-direction: column;
   gap: 8px;
 }
 
 .nav-item {
+  display: block;
   border: 0;
   background: transparent;
   text-align: left;
-  font-size: 32px;
+  text-decoration: none;
+  font-size: 22px;
   color: var(--text);
   padding: 12px 14px;
   border-radius: 10px;
   cursor: pointer;
 }
 
 .nav-item.active {
   background: #dce2f5;
   color: #2b33cc;
   font-weight: 700;
 }
 
 .content {
   padding: 26px 30px;
 }
 
 .topbar {
   display: flex;
   justify-content: space-between;
   gap: 12px;
   align-items: center;
   margin-bottom: 18px;
 }
 
 .topbar h2 {
   margin: 0;
-  font-size: 40px;
+  font-size: 34px;
 }
 
 .btn-primary {
   border: 0;
   border-radius: 10px;
   background: var(--danger);
   color: white;
   padding: 10px 16px;
   font-size: 20px;
   cursor: pointer;
 }
 
 .alert-banner {
   background: var(--warn-bg);
   border: 1px solid var(--warn-border);
   border-radius: 10px;
   padding: 14px;
-  font-size: 26px;
+  font-size: 21px;
   margin-bottom: 18px;
 }
 
 .stats-grid {
   display: grid;
   grid-template-columns: repeat(4, minmax(170px, 1fr));
   gap: 14px;
   margin-bottom: 18px;
 }
 
 .stat-card,
 .panel {
   background: var(--panel);
   border: 1px solid var(--border);
   border-radius: 12px;
   padding: 18px 20px;
 }
 
 .stat-card h3,
 .panel h3 {
   margin: 0 0 6px;
   color: var(--muted);
   font-size: 28px;
 }
 
 .stat-value {
   margin: 0;
   font-size: 46px;
   font-weight: 700;
 }
 
 .panel p,
 .list,
 .field-label,
 select,
 textarea {
-  font-size: 24px;
+  font-size: 18px;
 }
 
 .list {
   margin: 12px 0 0;
   padding-left: 24px;
 }
 
 .list li {
   margin-bottom: 10px;
 }
 
 .trend-bars {
   display: flex;
   gap: 12px;
   align-items: flex-end;
   min-height: 200px;
 }
 
 .trend-bar {
   width: 56px;
   background: linear-gradient(to top, #5970f2, #8797ff);
   border-radius: 8px 8px 0 0;
   position: relative;
 }
 
 
EOF
)
 
EOF
)
