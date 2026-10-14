/* ============================================
   Parent Dashboard Module
   Smart Parental Control Panel
   ============================================ */

let interestsChartDrawn = false;

// ── Mock Data ──
const SAFETY_SCORE = 98;
const FILTERED_ATTEMPTS = 23;
const ACTIVE_TIME = '6س 42د';
const ALERTS_TODAY = 3;

const INTERESTS_DATA = [
  { label: 'علوم وفلك', percent: 45, color: '#4fc3f7' },
  { label: 'تعليم برمجيات', percent: 25, color: '#00e676' },
  { label: 'رياضيات تفاعلية', percent: 12, color: '#ffab40' },
  { label: 'ترفيه وألعاب', percent: 10, color: '#ce93d8' },
  { label: 'قراءة وقصص', percent: 8, color: '#ef5350' },
];

const RECOMMENDATIONS = [
  {
    icon: '🔭',
    topic: 'الفضاء والكواكب',
    type: 'حوار تعليمي',
    text: 'لاحظنا اهتمام طفلك المتزايد بالفلك! جرّب أن تسأله: "ما الكوكب الذي تود زيارته؟ ولماذا؟" — هذا يعزز التفكير النقدي والخيال العلمي لديه.'
  },
  {
    icon: '💻',
    topic: 'البرمجة للأطفال',
    type: 'نشاط مشترك',
    text: 'طفلك يتابع محتوى تعلّم البرمجة. جرّبا معاً بناء لعبة بسيطة في Scratch — سيعزّز ذلك الترابط الأسري ويحوّل وقت الشاشة إلى إنتاجية.'
  },
  {
    icon: '📚',
    topic: 'تنمية مهارات القراءة',
    type: 'توصية تربوية',
    text: 'خصّصوا 20 دقيقة يومياً للقراءة المشتركة في موضوع يحبّه طفلكم. يمكنكم البدء بكتب عن الفضاء والمغامرات العلمية لربط اهتماماته بالقراءة.'
  }
];

const INCIDENTS = [
  { time: '14:23', date: 'اليوم', severity: 'medium', action: 'تضبيب + كتم', response: '23ms', desc: 'محتوى بصري غير مناسب للفئة العمرية' },
  { time: '11:05', date: 'اليوم', severity: 'high', action: 'قفل الجهاز', response: '12ms', desc: 'محتوى خادش — تم قفل الجهاز فوراً' },
  { time: '09:41', date: 'اليوم', severity: 'low', action: 'تنبيه فقط', response: '45ms', desc: 'كلمات غير لائقة في التعليقات' },
  { time: '20:18', date: 'أمس', severity: 'medium', action: 'تضبيب + كتم', response: '31ms', desc: 'إعلان يحتوي محتوى غير ملائم' },
  { time: '16:55', date: 'أمس', severity: 'low', action: 'تنبيه فقط', response: '52ms', desc: 'رابط خارجي مشبوه في الفيديو' },
  { time: '13:30', date: 'منذ يومين', severity: 'high', action: 'قفل الجهاز', response: '8ms', desc: 'محتوى عنيف — استجابة قصوى' },
];

/**
 * Initializes the Parent Dashboard
 */
function initDashboard() {
  const container = document.getElementById('view-dashboard');
  if (!container) return;

  container.innerHTML = `
    <div class="page-content">
      <div class="dashboard-header">
        <h1>📊 لوحة تحكم الوالدين الذكية</h1>
        <p>رقابة تربوية إرشادية تحوّل المراقبة من عقاب إلى تمكين — دون انتهاك خصوصية المحادثات</p>
      </div>

      <!-- Key Metrics -->
      <div class="metrics-grid">
        ${renderMetricCard('safe', '🛡️', SAFETY_SCORE, '%', 'نسبة الأمان العامة', '↑ 2%', 'up')}
        ${renderMetricCard('warning', '🔍', FILTERED_ATTEMPTS, '', 'محاولات مفلترة', 'هذا الأسبوع', '')}
        ${renderMetricCard('info', '⏱️', ACTIVE_TIME, '', 'وقت المراقبة النشط', 'اليوم', '')}
        ${renderMetricCard('accent', '🔔', ALERTS_TODAY, '', 'تنبيهات اليوم', '↓ 40%', 'up')}
      </div>

      <!-- Main Grid: Charts + Recommendations -->
      <div class="dashboard-grid">
        <!-- Interests Chart -->
        <div class="chart-section glass-card">
          <div class="chart-section-header">
            <div class="chart-icon blue">📊</div>
            <div>
              <h3>خريطة اهتمامات الطفل</h3>
              <p class="chart-subtitle">تحليل المحتوى المتابع خلال آخر 7 أيام</p>
            </div>
          </div>
          <div class="chart-container">
            <div class="chart-canvas-wrap">
              <canvas id="interestsChart" width="200" height="200"></canvas>
            </div>
            <div class="chart-legend" id="interestsLegend"></div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="recommendations-section glass-card">
          <div class="chart-section-header">
            <div class="chart-icon green">💡</div>
            <div>
              <h3>التوصيات التربوية المخصصة</h3>
              <p class="chart-subtitle">اقتراحات ذكية لفتح حوار ودّي مع طفلك</p>
            </div>
          </div>
          <div class="recommendations-list" id="recsList"></div>
        </div>

        <!-- Incident Log -->
        <div class="incident-section glass-card">
          <div class="chart-section-header">
            <div class="chart-icon blue">📋</div>
            <div>
              <h3>سجل الأمان والحوادث</h3>
              <p class="chart-subtitle">أوقات الاستجابة والإجراءات المتخذة — بدون تفاصيل تنتهك الخصوصية</p>
            </div>
          </div>
          <div class="incident-table-wrap">
            <table class="incident-table">
              <thead>
                <tr>
                  <th>الوقت</th>
                  <th>التاريخ</th>
                  <th>الخطورة</th>
                  <th>الإجراء</th>
                  <th>وقت الاستجابة</th>
                  <th>الوصف</th>
                </tr>
              </thead>
              <tbody id="incidentBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  renderInterestsLegend();
  renderRecommendations();
  renderIncidentTable();
}

/**
 * Renders a metric card HTML
 */
function renderMetricCard(type, icon, value, unit, label, trend, trendDir) {
  const trendHTML = trendDir
    ? `<span class="metric-trend ${trendDir}">${trend}</span>`
    : `<span class="metric-trend" style="background:rgba(61,122,237,0.1);color:var(--color-brand-blue)">${trend}</span>`;

  return `
    <div class="metric-card glass-card ${type}">
      <div class="metric-icon">${icon}</div>
      <div class="metric-value">${value}<span class="unit">${unit}</span></div>
      <div class="metric-label">${label}</div>
      ${trendHTML}
    </div>
  `;
}

/**
 * Draws the donut chart for interests
 */
function drawInterestsChart() {
  const chartCanvas = document.getElementById('interestsChart');
  if (!chartCanvas) return;

  const ctx = chartCanvas.getContext('2d');
  const cx = chartCanvas.width / 2;
  const cy = chartCanvas.height / 2;
  const outerR = 85;
  const innerR = 52;

  ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

  let startAngle = -Math.PI / 2;
  const totalPercent = INTERESTS_DATA.reduce((sum, d) => sum + d.percent, 0);

  INTERESTS_DATA.forEach((item, i) => {
    const sliceAngle = (item.percent / totalPercent) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;

    // Draw slice
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle, endAngle);
    ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();

    // Gap between slices
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, endAngle - 0.02, endAngle + 0.02);
    ctx.arc(cx, cy, innerR, endAngle + 0.02, endAngle - 0.02, true);
    ctx.closePath();
    ctx.fillStyle = '#0a1029';
    ctx.fill();

    startAngle = endAngle;
  });

  // Center circle (background)
  ctx.beginPath();
  ctx.arc(cx, cy, innerR - 2, 0, Math.PI * 2);
  ctx.fillStyle = '#0d1630';
  ctx.fill();

  // Center text
  ctx.font = 'bold 28px Tajawal, sans-serif';
  ctx.fillStyle = '#e8ecf8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${SAFETY_SCORE}%`, cx, cy - 6);

  ctx.font = '11px Tajawal, sans-serif';
  ctx.fillStyle = '#9aa3c4';
  ctx.fillText('محتوى آمن', cx, cy + 16);
}

/**
 * Renders the chart legend
 */
function renderInterestsLegend() {
  const legend = document.getElementById('interestsLegend');
  if (!legend) return;

  legend.innerHTML = INTERESTS_DATA.map(item => `
    <div class="legend-item">
      <div class="legend-dot" style="background:${item.color}"></div>
      <span class="legend-label">${item.label}</span>
      <span class="legend-value">${item.percent}%</span>
    </div>
  `).join('');
}

/**
 * Renders recommendation cards
 */
function renderRecommendations() {
  const recsList = document.getElementById('recsList');
  if (!recsList) return;

  recsList.innerHTML = RECOMMENDATIONS.map(rec => `
    <div class="rec-card">
      <div class="rec-card-header">
        <span class="rec-card-icon">${rec.icon}</span>
        <span class="rec-card-topic">${rec.topic}</span>
        <span class="rec-card-type">${rec.type}</span>
      </div>
      <p class="rec-card-text">${rec.text}</p>
    </div>
  `).join('');
}

/**
 * Renders the incident log table
 */
function renderIncidentTable() {
  const tbody = document.getElementById('incidentBody');
  if (!tbody) return;

  const severityLabels = {
    high: { text: 'حرج', class: 'high' },
    medium: { text: 'متوسط', class: 'medium' },
    low: { text: 'منخفض', class: 'low' }
  };

  tbody.innerHTML = INCIDENTS.map(inc => {
    const sev = severityLabels[inc.severity];
    return `
      <tr>
        <td style="font-family:var(--font-mono)">${inc.time}</td>
        <td>${inc.date}</td>
        <td><span class="severity-badge ${sev.class}">● ${sev.text}</span></td>
        <td><span class="action-badge">⚡ ${inc.action}</span></td>
        <td style="font-family:var(--font-mono);color:var(--color-accent)">${inc.response}</td>
        <td>${inc.desc}</td>
      </tr>
    `;
  }).join('');
}

/**
 * Called when dashboard view becomes active
 */
function onDashboardActivate() {
  // Draw chart with slight delay for animation
  if (!interestsChartDrawn) {
    setTimeout(() => {
      drawInterestsChart();
      interestsChartDrawn = true;
    }, 300);
  }
}

// Export
window.Dashboard = {
  init: initDashboard,
  onActivate: onDashboardActivate
};
