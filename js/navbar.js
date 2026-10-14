/* ============================================
   Navigation Bar Module
   ============================================ */

let currentView = 'stream';

/**
 * Initializes the navbar and sets up navigation
 */
function initNavbar() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  navbar.innerHTML = `
    <div class="navbar-inner">
      <div class="navbar-logo">
        <div class="shield-icon">🛡️</div>
        <div class="logo-text">
          <span class="logo-title">حارس الطفولة الذكي</span>
          <span class="logo-subtitle">AI-SHIELD v2.0</span>
        </div>
      </div>

      <div class="navbar-links">
        <button class="nav-link active" data-view="stream" id="navStream">
          <span class="nav-icon">📡</span>
          <span>محاكاة البث</span>
        </button>
        <button class="nav-link" data-view="dashboard" id="navDashboard">
          <span class="nav-icon">📊</span>
          <span>لوحة تحكم الوالدين</span>
        </button>
      </div>

      <div class="navbar-status" id="navbarStatus">
        <div class="pulse-dot green"></div>
        <span>النظام نشط</span>
      </div>
    </div>
  `;

  // Bind navigation events
  const navLinks = navbar.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const view = link.dataset.view;
      navigateTo(view);
    });
  });
}

/**
 * Navigates to a specific view
 * @param {string} viewName - 'stream' or 'dashboard'
 */
function navigateTo(viewName) {
  if (viewName === currentView) return;

  currentView = viewName;

  // Update active nav link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.view === viewName);
  });

  // Switch page views
  const views = document.querySelectorAll('.page-view');
  views.forEach(view => {
    view.classList.toggle('active', view.id === `view-${viewName}`);
  });

  // Notify modules about view change
  if (viewName === 'stream' && typeof window.StreamDemo !== 'undefined') {
    window.StreamDemo.onActivate();
  }
  if (viewName === 'dashboard' && typeof window.Dashboard !== 'undefined') {
    window.Dashboard.onActivate();
  }
}

/**
 * Updates the navbar status indicator
 * @param {'safe'|'danger'|'warning'} status
 * @param {string} text
 */
function updateNavStatus(status, text) {
  const statusEl = document.getElementById('navbarStatus');
  if (!statusEl) return;

  const dotEl = statusEl.querySelector('.pulse-dot');

  dotEl.className = 'pulse-dot';
  if (status === 'safe') {
    dotEl.classList.add('green');
    statusEl.style.background = 'var(--color-safe-bg)';
    statusEl.style.color = 'var(--color-safe)';
    statusEl.style.borderColor = 'rgba(0, 230, 118, 0.25)';
  } else if (status === 'danger') {
    dotEl.classList.add('red');
    statusEl.style.background = 'var(--color-danger-bg)';
    statusEl.style.color = 'var(--color-danger)';
    statusEl.style.borderColor = 'rgba(255, 23, 68, 0.25)';
  } else {
    dotEl.classList.add('red');
    statusEl.style.background = 'var(--color-warning-bg)';
    statusEl.style.color = 'var(--color-warning)';
    statusEl.style.borderColor = 'rgba(255, 171, 64, 0.25)';
  }

  const span = statusEl.querySelector('span');
  if (span) span.textContent = text;
}

// Export
window.Navbar = {
  init: initNavbar,
  navigateTo: navigateTo,
  updateStatus: updateNavStatus
};
