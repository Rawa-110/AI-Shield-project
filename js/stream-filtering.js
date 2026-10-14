/* ============================================
   Stream Filtering Demo Module
   Interactive Video Player + AI Protection Demo
   ============================================ */

let canvas, ctx;
let animationId = null;
let isPlaying = true;
let isMuted = false;
let isBlurred = false;
let frameCount = 0;
let progressPercent = 0;
let stars = [];
let planets = [];
let shootingStars = [];
let particles = [];

const STAR_COUNT = 180;
const PLANET_DATA = [
  { name: 'زحل', radius: 28, orbitRadius: 0, color: '#e8c46c', ringColor: '#c9a84c', x: 0, y: 0 },
  { name: 'الأرض', radius: 12, orbitRadius: 160, color: '#4fc3f7', speed: 0.003, angle: 0 },
  { name: 'المريخ', radius: 9, orbitRadius: 220, color: '#ef5350', speed: 0.002, angle: 2.5 },
  { name: 'المشتري', radius: 18, orbitRadius: 300, color: '#ffb74d', speed: 0.001, angle: 4.2 },
];

/**
 * Initializes the Stream Filtering Demo
 */
function initStreamDemo() {
  const container = document.getElementById('view-stream');
  if (!container) return;

  container.innerHTML = `
    <div class="page-content">
      <div class="stream-header">
        <h1>🛡️ محاكاة ترشيح البث اللحظي والحماية الطرفية</h1>
        <p>عرض تفاعلي لآلية عمل تقنية (GSF) ودمج خوارزميات الرؤية الحاسوبية لحماية الطفل من المحتوى غير المناسب فوراً</p>
      </div>

      <!-- AI Status Bar -->
      <div class="ai-status-bar" id="aiStatusBar">
        <div class="ai-status-badge safe" id="aiStatusBadge">
          <div class="pulse-dot green"></div>
          <span id="aiStatusText">الحماية نشطة — AI-Shield Active</span>
        </div>
        <div class="ai-status-techs">
          <span class="tech-tag">Generative Stream Filtering</span>
          <span class="tech-tag">Frame Capture</span>
          <span class="tech-tag">Computer Vision</span>
          <span class="tech-tag">Real-time NLP</span>
        </div>
      </div>

      <!-- Video Player -->
      <div class="video-player-wrapper" id="videoPlayerWrapper">
        <canvas class="video-canvas" id="videoCanvas"></canvas>
        <div class="video-overlay" id="videoOverlay">
          <div class="overlay-shield-icon">🛡️</div>
          <p class="overlay-title" id="overlayTitle">تم تنفيذ استجابة طرفية فورية</p>
          <p class="overlay-subtitle" id="overlaySubtitle">
            رصدت خوارزميات الرؤية الحاسوبية لقطة غير مناسبة وتم تفعيل الحظر البصري وكتم الصوت تلقائياً
          </p>
          <div class="overlay-tech-label">
            <span>⚡</span>
            <span>Computer Vision — Frame Analysis — Edge Response &lt; 50ms</span>
          </div>
        </div>
      </div>

      <!-- Playback Bar -->
      <div class="playback-bar" id="playbackBar">
        <button class="playback-btn" id="playPauseBtn" title="تشغيل/إيقاف">▶️</button>
        <div class="playback-progress">
          <div class="playback-progress-fill" id="progressFill"></div>
        </div>
        <span class="playback-time" id="playbackTime">00:00</span>
        <span class="volume-icon" id="volumeIcon" title="الصوت">🔊</span>
      </div>

      <!-- Demo Controls -->
      <div class="demo-controls">
        <div class="demo-controls-title">أزرار التحكم بالسيناريو التفاعلي</div>
        <div class="demo-controls-grid">
          <button class="demo-btn demo-btn-blur" id="btnBlur">
            <span class="btn-icon">🔍</span>
            <div class="btn-label">
              محاكاة لقطة غير مناسبة
              <span class="btn-sublabel">تضبيب بصري + كتم صوت + استجابة طرفية</span>
            </div>
          </button>
          <button class="demo-btn demo-btn-lock" id="btnLock">
            <span class="btn-icon">🔒</span>
            <div class="btn-label">
              محاكاة محتوى خطير جداً
              <span class="btn-sublabel">قفل الجهاز بالكامل + شاشة حماية حمراء</span>
            </div>
          </button>
          <button class="demo-btn demo-btn-resume" id="btnResume">
            <span class="btn-icon">✅</span>
            <div class="btn-label">
              استئناف المحتوى الآمن
              <span class="btn-sublabel">إزالة التضبيب + تشغيل الصوت تلقائياً</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Response Log -->
      <div class="response-log">
        <div class="response-log-title">📋 سجل الاستجابة الفورية</div>
        <div class="log-entries" id="logEntries">
          <div class="log-entry">
            <span class="log-icon">🟢</span>
            <span class="log-time">${getCurrentTime()}</span>
            <span class="log-text">تم تشغيل نظام AI-Shield — جميع الطبقات نشطة</span>
          </div>
        </div>
      </div>
    </div>
  `;

  setupCanvas();
  setupDemoControls();
  startAnimation();
}

/**
 * Sets up the canvas and initializes animation elements
 */
function setupCanvas() {
  canvas = document.getElementById('videoCanvas');
  if (!canvas) return;

  const wrapper = document.getElementById('videoPlayerWrapper');
  canvas.width = wrapper.clientWidth * (window.devicePixelRatio > 1 ? 1.5 : 1);
  canvas.height = wrapper.clientHeight * (window.devicePixelRatio > 1 ? 1.5 : 1);
  ctx = canvas.getContext('2d');

  // Initialize stars
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.3,
      brightness: Math.random(),
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2
    });
  }

  // Initialize planets
  planets = PLANET_DATA.map(p => ({ ...p }));
  const cx = canvas.width * 0.45;
  const cy = canvas.height * 0.45;
  planets[0].x = cx;
  planets[0].y = cy;

  // Resize handler
  const resizeHandler = () => {
    if (wrapper) {
      canvas.width = wrapper.clientWidth * (window.devicePixelRatio > 1 ? 1.5 : 1);
      canvas.height = wrapper.clientHeight * (window.devicePixelRatio > 1 ? 1.5 : 1);
      // Reinitialize stars on resize
      stars.forEach(s => {
        s.x = Math.random() * canvas.width;
        s.y = Math.random() * canvas.height;
      });
    }
  };
  window.addEventListener('resize', resizeHandler);
}

/**
 * Draws a single animation frame
 */
function drawFrame() {
  if (!ctx || !canvas) return;

  const w = canvas.width;
  const h = canvas.height;

  // Background gradient - deep space
  const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.5, w * 0.7);
  bgGrad.addColorStop(0, '#0d1b3e');
  bgGrad.addColorStop(0.5, '#060e24');
  bgGrad.addColorStop(1, '#020510');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Nebula glow
  const nebulaGrad = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.3, h * 0.3, w * 0.35);
  nebulaGrad.addColorStop(0, 'rgba(100, 60, 180, 0.07)');
  nebulaGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = nebulaGrad;
  ctx.fillRect(0, 0, w, h);

  const nebulaGrad2 = ctx.createRadialGradient(w * 0.75, h * 0.6, 0, w * 0.75, h * 0.6, w * 0.25);
  nebulaGrad2.addColorStop(0, 'rgba(0, 150, 136, 0.05)');
  nebulaGrad2.addColorStop(1, 'transparent');
  ctx.fillStyle = nebulaGrad2;
  ctx.fillRect(0, 0, w, h);

  // Draw stars
  stars.forEach(star => {
    const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(frameCount * star.twinkleSpeed + star.phase));
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220, 230, 255, ${twinkle * star.brightness})`;
    ctx.fill();

    // Star glow
    if (star.size > 1.2) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 200, 255, ${twinkle * 0.08})`;
      ctx.fill();
    }
  });

  // Draw Saturn (center planet) with rings
  const cx = w * 0.45;
  const cy = h * 0.45;

  // Saturn glow
  const saturnGlow = ctx.createRadialGradient(cx, cy, 20, cx, cy, 70);
  saturnGlow.addColorStop(0, 'rgba(232, 196, 108, 0.15)');
  saturnGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = saturnGlow;
  ctx.fillRect(cx - 80, cy - 80, 160, 160);

  // Saturn ring
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, 0.35);
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.5)';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 58, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.25)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // Saturn body
  const saturnBod = ctx.createRadialGradient(cx - 5, cy - 5, 2, cx, cy, 28);
  saturnBod.addColorStop(0, '#f0d080');
  saturnBod.addColorStop(0.6, '#e8c46c');
  saturnBod.addColorStop(1, '#c9a84c');
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, Math.PI * 2);
  ctx.fillStyle = saturnBod;
  ctx.fill();

  // Saturn bands
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, Math.PI * 2);
  ctx.clip();
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.ellipse(cx, cy + i * 8, 30, 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180, 140, 60, ${0.1 + Math.abs(i) * 0.03})`;
    ctx.fill();
  }
  ctx.restore();

  // Orbiting planets
  for (let i = 1; i < planets.length; i++) {
    const p = planets[i];
    p.angle += p.speed;
    p.x = cx + Math.cos(p.angle) * p.orbitRadius * (w / 900);
    p.y = cy + Math.sin(p.angle) * p.orbitRadius * 0.35 * (h / 500);

    // Orbit path
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, 0.35);
    ctx.beginPath();
    ctx.arc(0, 0, p.orbitRadius * (w / 900), 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // Planet glow
    const pGlow = ctx.createRadialGradient(p.x, p.y, p.radius * 0.5, p.x, p.y, p.radius * 3);
    pGlow.addColorStop(0, p.color.replace(')', ', 0.15)').replace('rgb', 'rgba'));
    pGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = pGlow;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
    ctx.fill();

    // Planet body
    const pGrad = ctx.createRadialGradient(p.x - 2, p.y - 2, 1, p.x, p.y, p.radius);
    pGrad.addColorStop(0, lightenColor(p.color, 30));
    pGrad.addColorStop(1, p.color);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * (w / 900), 0, Math.PI * 2);
    ctx.fillStyle = pGrad;
    ctx.fill();
  }

  // Floating particles (space dust)
  if (frameCount % 3 === 0 && particles.length < 30) {
    particles.push({
      x: Math.random() * w,
      y: h + 5,
      size: Math.random() * 1.5 + 0.5,
      speedY: -(Math.random() * 0.8 + 0.3),
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
      life: 200
    });
  }
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.life--;
    p.opacity *= 0.998;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(100, 200, 255, ${p.opacity})`;
    ctx.fill();
  });

  // UI Overlay - Channel banner (bottom)
  const bannerH = 50;
  const bannerGrad = ctx.createLinearGradient(0, h - bannerH, 0, h);
  bannerGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bannerGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.6)');
  bannerGrad.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
  ctx.fillStyle = bannerGrad;
  ctx.fillRect(0, h - bannerH, w, bannerH);

  ctx.font = `bold ${14 * (w / 800)}px Tajawal, sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.textAlign = 'right';
  ctx.fillText('🔭 قناة المعرفة للأطفال — برنامج: استكشاف الكواكب', w - 15, h - 18);

  // Top left badge - LIVE
  const liveX = 15;
  const liveY = 15;
  ctx.fillStyle = 'rgba(255, 23, 68, 0.85)';
  roundRect(ctx, liveX, liveY, 60, 24, 5);
  ctx.fill();
  ctx.font = `bold ${11 * (w / 800)}px Tajawal, sans-serif`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.fillText('🔴 مباشر', liveX + 30, liveY + 16);

  // Top header - Program title
  const topGrad = ctx.createLinearGradient(0, 0, 0, 60);
  topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  topGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, w, 60);

  ctx.font = `bold ${16 * (w / 800)}px Tajawal, sans-serif`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'right';
  ctx.fillText('🪐 عالم الفضاء والكواكب — الحلقة 12', w - 15, 35);

  // AI Shield watermark (top-right area)
  const shieldX = 15;
  const shieldY = 50;
  ctx.fillStyle = 'rgba(0, 212, 170, 0.08)';
  roundRect(ctx, shieldX, shieldY, 140, 22, 4);
  ctx.fill();
  ctx.font = `${9 * (w / 800)}px 'Courier New', monospace`;
  ctx.fillStyle = 'rgba(0, 212, 170, 0.6)';
  ctx.textAlign = 'left';
  ctx.fillText('🛡️ AI-Shield Frame Capture', shieldX + 5, shieldY + 15);

  // Scanning line effect (subtle)
  const scanY = (frameCount * 1.5) % h;
  ctx.fillStyle = 'rgba(0, 212, 170, 0.03)';
  ctx.fillRect(0, scanY, w, 2);
}

/**
 * Helper to draw rounded rectangles
 */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Lighten a hex color
 */
function lightenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + percent);
  const g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
  const b = Math.min(255, (num & 0x0000FF) + percent);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Main animation loop
 */
function animate() {
  if (isPlaying) {
    frameCount++;
    drawFrame();

    // Update progress bar
    progressPercent = (progressPercent + 0.02) % 100;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) progressFill.style.width = progressPercent + '%';

    // Update time display
    const totalSeconds = Math.floor(frameCount / 60);
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    const timeEl = document.getElementById('playbackTime');
    if (timeEl) timeEl.textContent = `${mins}:${secs}`;
  }

  animationId = requestAnimationFrame(animate);
}

function startAnimation() {
  if (animationId) cancelAnimationFrame(animationId);
  animate();
}

function stopAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

/**
 * Sets up demo control buttons
 */
function setupDemoControls() {
  const btnBlur = document.getElementById('btnBlur');
  const btnLock = document.getElementById('btnLock');
  const btnResume = document.getElementById('btnResume');
  const playPauseBtn = document.getElementById('playPauseBtn');

  if (btnBlur) {
    btnBlur.addEventListener('click', handleBlurDemo);
  }
  if (btnLock) {
    btnLock.addEventListener('click', handleLockDemo);
  }
  if (btnResume) {
    btnResume.addEventListener('click', handleResumeDemo);
  }
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlayPause);
  }
}

/**
 * Handles blur + mute demo scenario
 */
function handleBlurDemo() {
  if (isBlurred) return;

  isBlurred = true;
  isMuted = true;

  // Apply blur to canvas
  const canvasEl = document.getElementById('videoCanvas');
  if (canvasEl) canvasEl.classList.add('blurred');

  // Show overlay
  const overlay = document.getElementById('videoOverlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlaySubtitle = document.getElementById('overlaySubtitle');
  if (overlay) {
    overlayTitle.textContent = 'تم تنفيذ استجابة طرفية فورية';
    overlaySubtitle.textContent = 'رصدت خوارزميات الرؤية الحاسوبية لقطة غير مناسبة وتم تفعيل الحظر البصري وكتم الصوت تلقائياً لحماية الطفل';
    overlay.classList.add('visible');
  }

  // Mute icon
  const volumeIcon = document.getElementById('volumeIcon');
  if (volumeIcon) {
    volumeIcon.textContent = '🔇';
    volumeIcon.classList.add('muted');
  }

  // Update AI status
  updateAIStatus('danger', '⚠️ تم رصد محتوى غير مناسب — الحماية مفعّلة');

  // Update navbar
  if (window.Navbar) {
    window.Navbar.updateStatus('danger', 'تم رصد تهديد');
  }

  // Add log entry
  addLogEntry('🟡', 'تم رصد لقطة غير مناسبة بواسطة Computer Vision — وقت الاستجابة: 23ms');
  addLogEntry('🔴', 'تم تطبيق الحظر البصري (Blur 24px) وكتم الصوت فوراً');
}

/**
 * Handles full device lock demo
 */
function handleLockDemo() {
  // First apply blur
  if (!isBlurred) {
    handleBlurDemo();
  }

  // Show lock screen
  if (window.LockScreen) {
    window.LockScreen.show(() => {
      // On unlock callback
      handleResumeDemo();
      addLogEntry('🟢', 'تم إلغاء قفل الجهاز بواسطة رمز مرور الوالدين');
    });
  }

  // Update status
  updateAIStatus('danger', '🔒 تم قفل الجهاز — بروتوكول الحماية القصوى');

  if (window.Navbar) {
    window.Navbar.updateStatus('danger', 'الجهاز مقفل');
  }

  addLogEntry('🔴', 'تم رصد محتوى خادش وخطير جداً — تفعيل قفل الجهاز الكامل');
  addLogEntry('⚠️', 'تم إرسال تنبيه فوري لولي الأمر — في انتظار رمز المرور');
}

/**
 * Handles resume/reset demo
 */
function handleResumeDemo() {
  isBlurred = false;
  isMuted = false;

  // Remove blur
  const canvasEl = document.getElementById('videoCanvas');
  if (canvasEl) canvasEl.classList.remove('blurred');

  // Hide overlay
  const overlay = document.getElementById('videoOverlay');
  if (overlay) overlay.classList.remove('visible');

  // Restore volume icon
  const volumeIcon = document.getElementById('volumeIcon');
  if (volumeIcon) {
    volumeIcon.textContent = '🔊';
    volumeIcon.classList.remove('muted');
  }

  // Restore status
  updateAIStatus('safe', 'الحماية نشطة — AI-Shield Active');

  if (window.Navbar) {
    window.Navbar.updateStatus('safe', 'النظام نشط');
  }

  // Resume playback if paused
  if (!isPlaying) {
    isPlaying = true;
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) playPauseBtn.textContent = '⏸️';
  }

  addLogEntry('🟢', 'تم استئناف المحتوى الآمن — جميع الأنظمة تعمل بشكل طبيعي');
}

/**
 * Toggle play/pause
 */
function togglePlayPause() {
  isPlaying = !isPlaying;
  const btn = document.getElementById('playPauseBtn');
  if (btn) btn.textContent = isPlaying ? '⏸️' : '▶️';
}

/**
 * Updates the AI status badge
 */
function updateAIStatus(status, text) {
  const badge = document.getElementById('aiStatusBadge');
  const statusText = document.getElementById('aiStatusText');
  if (!badge) return;

  const dot = badge.querySelector('.pulse-dot');

  if (status === 'safe') {
    badge.className = 'ai-status-badge safe';
    dot.className = 'pulse-dot green';
  } else {
    badge.className = 'ai-status-badge danger';
    dot.className = 'pulse-dot red';
  }

  if (statusText) statusText.textContent = text;
}

/**
 * Adds a log entry to the response log
 */
function addLogEntry(icon, text) {
  const logContainer = document.getElementById('logEntries');
  if (!logContainer) return;

  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `
    <span class="log-icon">${icon}</span>
    <span class="log-time">${getCurrentTime()}</span>
    <span class="log-text">${text}</span>
  `;

  logContainer.insertBefore(entry, logContainer.firstChild);

  // Keep max 15 entries
  while (logContainer.children.length > 15) {
    logContainer.removeChild(logContainer.lastChild);
  }
}

/**
 * Gets current time formatted
 */
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/**
 * Called when view becomes active
 */
function onStreamActivate() {
  if (!animationId) {
    startAnimation();
  }
}

/**
 * Called when view becomes inactive
 */
function onStreamDeactivate() {
  // Keep animation running in background for smoothness
}

// Export
window.StreamDemo = {
  init: initStreamDemo,
  onActivate: onStreamActivate,
  onDeactivate: onStreamDeactivate
};
// Also export getCurrentTime for other modules
window.getCurrentTime = getCurrentTime;
