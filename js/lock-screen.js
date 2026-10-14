/* ============================================
   Lock Screen Module
   Full Device Lock Overlay with PIN Unlock
   ============================================ */

const PARENT_PIN = '1234';

let lockScreenEl = null;
let onUnlockCallback = null;

/**
 * Creates the lock screen DOM structure
 */
function createLockScreen() {
  const overlay = document.createElement('div');
  overlay.className = 'lock-screen-overlay';
  overlay.id = 'lockScreenOverlay';

  overlay.innerHTML = `
    <div class="lock-content">
      <div class="lock-shield">
        <div class="ring"></div>
        <div class="ring"></div>
        🔒
      </div>

      <h1 class="lock-title">تم قفل الجهاز فوراً</h1>
      <p class="lock-subtitle">
        رصد نظام AI-Shield محتوى خطير جداً وغير أخلاقي.
        تم تفعيل بروتوكول الحماية القصوى وقفل الجهاز بالكامل لحماية الطفل.
      </p>

      <div class="lock-alert-badge">
        <span>⚠️</span>
        <span>تنبيه حماية قصوى — مستوى الخطورة: حرج</span>
      </div>

      <div class="pin-section">
        <p class="pin-label">أدخل رمز مرور الوالدين لإلغاء القفل</p>
        <div class="pin-inputs">
          <input type="password" class="pin-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" data-index="0" autocomplete="off" />
          <input type="password" class="pin-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" data-index="1" autocomplete="off" />
          <input type="password" class="pin-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" data-index="2" autocomplete="off" />
          <input type="password" class="pin-digit" maxlength="1" inputmode="numeric" pattern="[0-9]" data-index="3" autocomplete="off" />
        </div>
        <p class="pin-error-msg" id="pinErrorMsg"></p>
        <button class="pin-unlock-btn" id="pinUnlockBtn" disabled>
          🔓 إلغاء القفل
        </button>
      </div>

      <div class="lock-footer">
        <span>🛡️</span>
        <span>AI-Shield Device Protection v2.0</span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  lockScreenEl = overlay;

  setupPinListeners();
}

/**
 * Sets up PIN input listeners for auto-focus and validation
 */
function setupPinListeners() {
  const inputs = lockScreenEl.querySelectorAll('.pin-digit');
  const unlockBtn = lockScreenEl.querySelector('#pinUnlockBtn');
  const errorMsg = lockScreenEl.querySelector('#pinErrorMsg');

  inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val;

      if (val && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }

      // Check if all digits are filled
      const pin = Array.from(inputs).map(inp => inp.value).join('');
      unlockBtn.disabled = pin.length < 4;
      errorMsg.textContent = '';

      // Remove error class
      inputs.forEach(inp => inp.classList.remove('error'));
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        inputs[index - 1].focus();
      }
      if (e.key === 'Enter') {
        attemptUnlock();
      }
    });

    input.addEventListener('focus', () => {
      e_target_select(input);
    });
  });

  unlockBtn.addEventListener('click', attemptUnlock);
}

function e_target_select(input) {
  input.select();
}

/**
 * Attempts to unlock with the entered PIN
 */
function attemptUnlock() {
  const inputs = lockScreenEl.querySelectorAll('.pin-digit');
  const errorMsg = lockScreenEl.querySelector('#pinErrorMsg');
  const pin = Array.from(inputs).map(inp => inp.value).join('');

  if (pin.length < 4) return;

  if (pin === PARENT_PIN) {
    // Success
    inputs.forEach(inp => {
      inp.classList.add('success');
      inp.classList.remove('error');
    });

    setTimeout(() => {
      hideLockScreen();
      if (typeof onUnlockCallback === 'function') {
        onUnlockCallback();
      }
    }, 600);
  } else {
    // Failure
    inputs.forEach(inp => {
      inp.classList.add('error');
      inp.value = '';
    });
    errorMsg.textContent = '❌ رمز المرور غير صحيح. حاول مرة أخرى.';
    inputs[0].focus();

    const unlockBtn = lockScreenEl.querySelector('#pinUnlockBtn');
    unlockBtn.disabled = true;
  }
}

/**
 * Shows the lock screen overlay
 * @param {Function} callback - Called when successfully unlocked
 */
function showLockScreen(callback) {
  if (!lockScreenEl) {
    createLockScreen();
  }

  onUnlockCallback = callback || null;

  // Reset PIN inputs
  const inputs = lockScreenEl.querySelectorAll('.pin-digit');
  inputs.forEach(inp => {
    inp.value = '';
    inp.classList.remove('error', 'success');
  });
  const errorMsg = lockScreenEl.querySelector('#pinErrorMsg');
  if (errorMsg) errorMsg.textContent = '';
  const unlockBtn = lockScreenEl.querySelector('#pinUnlockBtn');
  if (unlockBtn) unlockBtn.disabled = true;

  // Prevent body scroll
  document.body.style.overflow = 'hidden';

  // Activate overlay
  requestAnimationFrame(() => {
    lockScreenEl.classList.add('active');
    // Focus first PIN input
    setTimeout(() => {
      const firstInput = lockScreenEl.querySelector('.pin-digit[data-index="0"]');
      if (firstInput) firstInput.focus();
    }, 500);
  });
}

/**
 * Hides the lock screen overlay
 */
function hideLockScreen() {
  if (!lockScreenEl) return;

  lockScreenEl.classList.remove('active');
  document.body.style.overflow = '';
}

// Export for use by other modules
window.LockScreen = {
  show: showLockScreen,
  hide: hideLockScreen
};
