/* ============================================
   App Entry Point
   Main Application Initialization & Routing
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🛡️ AI-Shield — حارس الطفولة الذكي — Initializing...');

  // Initialize all modules
  if (window.Navbar) {
    window.Navbar.init();
  }

  if (window.StreamDemo) {
    window.StreamDemo.init();
  }

  if (window.Dashboard) {
    window.Dashboard.init();
  }

  // Show default view (stream demo)
  const streamView = document.getElementById('view-stream');
  if (streamView) {
    streamView.classList.add('active');
  }

  console.log('✅ AI-Shield initialized successfully');
});
