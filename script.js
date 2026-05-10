// ===========================
// Forma — script.js
// Multi-Step Form
// Task: Step Navigation + Validation + localStorage
// ===========================

document.addEventListener('DOMContentLoaded', () => {

  const STORAGE_KEY = 'forma-progress';
  const TOTAL_STEPS = 4;

  let currentStep = 1;
  let goingBack   = false;

  // ──────────────────────────
  // STATE — all form data
  // ──────────────────────────
  let formData = {
    firstName: '', lastName: '', email: '', phone: '', dob: '',
    username: '', password: '', confirmPassword: '', role: '',
    plan: '', interests: [], bio: '',
    agreeTerms: false, agreeMarketing: false
  };

  // ──────────────────────────
  // RESTORE from localStorage
  // ──────────────────────────
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      formData = { ...formData, ...parsed };
      restoreFields();
      showSavedIndicator();
    } catch (e) { /* corrupt data, ignore */ }
  }

  function restoreFields() {
    // Step 1
    setVal('firstName',       formData.firstName);
    setVal('lastName',        formData.lastName);
    setVal('email',           formData.email);
    setVal('phone',           formData.phone);
    setVal('dob',             formData.dob);
    // Step 2
    setVal('username',        formData.username);
    setVal('role',            formData.role);
    // Step 3
    setVal('bio',             formData.bio);
    updateCharCount();

    // Plan
    if (formData.plan) {
      document.querySelector(`.plan-card[data-plan="${formData.plan}"]`)?.classList.add('selected');
    }
    // Interests
    if (formData.interests.length) {
      formData.interests.forEach(interest => {
        document.querySelector(`.tag[data-interest="${interest}"]`)?.classList.add('selected');
      });
    }
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val) el.value = val;
  }


  // ──────────────────────────
  // SAVE to localStorage
  // ──────────────────────────
  function saveProgress() {
    // Don't save passwords
    const toSave = { ...formData };
    delete toSave.password;
    delete toSave.confirmPassword;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    showSavedIndicator();
  }

  function showSavedIndicator() {
    const el = document.getElementById('savedIndicator');
    el.classList.add('visible');
  }

  // Auto-save on any input change
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      collectCurrentStep();
      saveProgress();
    });
    el.addEventListener('change', () => {
      collectCurrentStep();
      saveProgress();
    });
  });


  // ──────────────────────────
  // COLLECT field values
  // ──────────────────────────
  function collectCurrentStep() {
    if (currentStep === 1) {
      formData.firstName = getVal('firstName');
      formData.lastName  = getVal('lastName');
      formData.email     = getVal('email');
      formData.phone     = getVal('phone');
      formData.dob       = getVal('dob');
    }
    if (currentStep === 2) {
      formData.username        = getVal('username');
      formData.password        = getVal('password');
      formData.confirmPassword = getVal('confirmPassword');
      formData.role            = getVal('role');
    }
    if (currentStep === 3) {
      formData.bio = getVal('bio');
    }
  }

  function getVal(id) {
    return (document.getElementById(id)?.value || '').trim();
  }


  // ──────────────────────────
  // VALIDATION
  // ──────────────────────────
  function validateStep(step) {
    clearErrors();
    let valid = true;

    if (step === 1) {
      if (!formData.firstName)            { setError('firstName', 'First name is required.'); valid = false; }
      if (!formData.lastName)             { setError('lastName',  'Last name is required.');  valid = false; }
      if (!formData.email)                { setError('email', 'Email address is required.'); valid = false; }
      else if (!isEmail(formData.email))  { setError('email', 'Please enter a valid email.'); valid = false; }
      if (!formData.phone)                { setError('phone', 'Phone number is required.'); valid = false; }
      else if (!isPhone(formData.phone))  { setError('phone', 'Enter a valid phone number.'); valid = false; }
    }

    if (step === 2) {
      if (!formData.username)                    { setError('username', 'Username is required.'); valid = false; }
      else if (!isUsername(formData.username))   { setError('username', 'Only letters, numbers and underscores (3–20 chars).'); valid = false; }
      if (!formData.password)                    { setError('password', 'Password is required.'); valid = false; }
      else if (formData.password.length < 8)     { setError('password', 'Password must be at least 8 characters.'); valid = false; }
      if (!formData.confirmPassword)             { setError('confirmPassword', 'Please confirm your password.'); valid = false; }
      else if (formData.password !== formData.confirmPassword) { setError('confirmPassword', 'Passwords do not match.'); valid = false; }
    }

    if (step === 3) {
      if (!formData.plan)                        { setError('plan', 'Please select a plan.'); valid = false; }
      if (!formData.interests.length)            { setError('interests', 'Select at least one interest.'); valid = false; }
    }

    if (step === 4) {
      formData.agreeTerms = document.getElementById('agreeTerms').checked;
      if (!formData.agreeTerms) { setError('terms', 'You must agree to the terms to continue.'); valid = false; }
    }

    // Shake invalid fields
    if (!valid) {
      document.querySelectorAll('.field-error:not(:empty)').forEach(err => {
        const id = err.id.replace('err-', '');
        const el = document.getElementById(id);
        if (el) { el.classList.add('error'); shakeEl(el); }
      });
    }

    return valid;
  }

  function setError(field, msg) {
    const errEl = document.getElementById('err-' + field);
    if (errEl) errEl.textContent = msg;
  }

  function clearErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    document.querySelectorAll('input.error, select.error, textarea.error').forEach(el => el.classList.remove('error'));
  }

  // Validation helpers
  const isEmail    = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhone    = v => /^[\d\s\+\-\(\)]{7,15}$/.test(v);
  const isUsername = v => /^[a-zA-Z0-9_]{3,20}$/.test(v);

  function shakeEl(el) {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake 0.35s ease';
    setTimeout(() => { el.style.animation = ''; }, 400);
  }

  // inject shake
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);


  // ──────────────────────────
  // STEP NAVIGATION
  // ──────────────────────────
  const nextBtn   = document.getElementById('nextBtn');
  const prevBtn   = document.getElementById('prevBtn');
  const formNav   = document.getElementById('formNav');

  nextBtn.addEventListener('click', () => {
    collectCurrentStep();
    if (!validateStep(currentStep)) return;

    if (currentStep === TOTAL_STEPS) {
      submitForm();
      return;
    }

    goingBack = false;
    goToStep(currentStep + 1);
  });

  prevBtn.addEventListener('click', () => {
    goingBack = true;
    goToStep(currentStep - 1);
  });

  function goToStep(step) {
    // Hide current
    const currentEl = document.getElementById(`form-step-${currentStep}`);
    currentEl.classList.add('hidden');

    currentStep = step;

    // Show next
    const nextEl = document.getElementById(`form-step-${currentStep}`);
    nextEl.classList.remove('hidden');
    if (goingBack) nextEl.classList.add('going-back');
    else           nextEl.classList.remove('going-back');

    // Trigger re-animation
    void nextEl.offsetWidth;

    updateUI();
    saveProgress();

    // If step 4, render review
    if (currentStep === 4) renderReview();

    // Scroll to top
    document.querySelector('.panel--right').scrollTop = 0;
  }

  function updateUI() {
    // Progress bar
    document.getElementById('progressFill').style.width = (currentStep / TOTAL_STEPS * 100) + '%';

    // Prev button
    prevBtn.style.visibility = currentStep > 1 ? 'visible' : 'hidden';

    // Next button label
    nextBtn.textContent = currentStep === TOTAL_STEPS ? 'Submit Application ✦' : 'Continue →';

    // Step dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i + 1 === currentStep) dot.classList.add('active');
      else if (i + 1 < currentStep) dot.classList.add('done');
    });

    // Sidebar step items
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      const item = document.getElementById(`step-nav-${i}`);
      if (!item) continue;
      item.classList.remove('active', 'done');
      if (i === currentStep)    item.classList.add('active');
      else if (i < currentStep) item.classList.add('done');
    }

    // Connectors
    document.querySelectorAll('.step-connector').forEach((con, i) => {
      con.classList.toggle('done', i + 1 < currentStep);
    });

    // Hide nav on success
    if (currentStep > TOTAL_STEPS) {
      formNav.style.display = 'none';
    }
  }


  // ──────────────────────────
  // PLAN CARDS
  // ──────────────────────────
  document.querySelectorAll('.plan-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      formData.plan = card.dataset.plan;
      saveProgress();
    });
  });


  // ──────────────────────────
  // INTEREST TAGS
  // ──────────────────────────
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('selected');
      const interest = tag.dataset.interest;
      if (tag.classList.contains('selected')) {
        if (!formData.interests.includes(interest)) formData.interests.push(interest);
      } else {
        formData.interests = formData.interests.filter(i => i !== interest);
      }
      saveProgress();
    });
  });


  // ──────────────────────────
  // BIO character count
  // ──────────────────────────
  const bioEl = document.getElementById('bio');
  bioEl.addEventListener('input', updateCharCount);

  function updateCharCount() {
    const count = bioEl.value.length;
    const counter = document.getElementById('bioCount');
    if (counter) counter.textContent = `${count} / 200`;
    if (count > 200) {
      bioEl.value = bioEl.value.slice(0, 200);
      counter.textContent = '200 / 200';
    }
  }


  // ──────────────────────────
  // PASSWORD STRENGTH
  // ──────────────────────────
  const passwordEl = document.getElementById('password');
  const strengthFill  = document.getElementById('strengthFill');
  const strengthLabel = document.getElementById('strengthLabel');

  passwordEl.addEventListener('input', () => {
    const pw = passwordEl.value;
    const score = getPasswordStrength(pw);
    const configs = [
      { width: '0%',   color: 'transparent', label: '',         color2: '' },
      { width: '25%',  color: '#f87171',     label: 'Weak',     color2: '#f87171' },
      { width: '50%',  color: '#fb923c',     label: 'Fair',     color2: '#fb923c' },
      { width: '75%',  color: '#fbbf24',     label: 'Good',     color2: '#fbbf24' },
      { width: '100%', color: '#4ade80',     label: 'Strong',   color2: '#4ade80' },
    ];
    const cfg = configs[score];
    strengthFill.style.width      = cfg.width;
    strengthFill.style.background = cfg.color;
    strengthLabel.textContent     = cfg.label;
    strengthLabel.style.color     = cfg.color2;
  });

  function getPasswordStrength(pw) {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8)  score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }


  // ──────────────────────────
  // SHOW/HIDE PASSWORD
  // ──────────────────────────
  const togglePw = document.getElementById('togglePw');
  togglePw.addEventListener('click', () => {
    const isText = passwordEl.type === 'text';
    passwordEl.type = isText ? 'password' : 'text';
    togglePw.textContent = isText ? '👁' : '🙈';
  });


  // ──────────────────────────
  // REVIEW STEP
  // ──────────────────────────
  function renderReview() {
    const card = document.getElementById('reviewCard');
    const plan = formData.plan ? formData.plan.charAt(0).toUpperCase() + formData.plan.slice(1) : '—';
    const interestHtml = formData.interests.length
      ? formData.interests.map(i => `<span class="review-tag">${i}</span>`).join('')
      : '<span style="color:var(--ink-3);font-size:0.82rem">None selected</span>';

    card.innerHTML = `
      <div class="review-section">
        <div class="review-section__label">
          Personal Info
          <button class="review-edit" onclick="goToStepDirect(1)">Edit</button>
        </div>
        <div class="review-grid">
          <div class="review-row">
            <span>Full Name</span>
            <span>${formData.firstName} ${formData.lastName}</span>
          </div>
          <div class="review-row">
            <span>Email</span>
            <span>${formData.email}</span>
          </div>
          <div class="review-row">
            <span>Phone</span>
            <span>${formData.phone}</span>
          </div>
          <div class="review-row">
            <span>Date of Birth</span>
            <span>${formData.dob || '—'}</span>
          </div>
        </div>
      </div>

      <div class="review-section">
        <div class="review-section__label">
          Account
          <button class="review-edit" onclick="goToStepDirect(2)">Edit</button>
        </div>
        <div class="review-grid">
          <div class="review-row">
            <span>Username</span>
            <span>@${formData.username}</span>
          </div>
          <div class="review-row">
            <span>Role</span>
            <span>${formData.role || '—'}</span>
          </div>
        </div>
      </div>

      <div class="review-section">
        <div class="review-section__label">
          Preferences
          <button class="review-edit" onclick="goToStepDirect(3)">Edit</button>
        </div>
        <div class="review-grid" style="margin-bottom:10px">
          <div class="review-row">
            <span>Plan</span>
            <span>${plan}</span>
          </div>
          <div class="review-row">
            <span>Bio</span>
            <span>${formData.bio || '—'}</span>
          </div>
        </div>
        <div style="margin-top:8px">
          <span style="font-size:0.72rem;color:var(--ink-3);display:block;margin-bottom:6px">INTERESTS</span>
          <div class="review-tags">${interestHtml}</div>
        </div>
      </div>
    `;
  }

  // Allow Edit buttons in review to go to specific step
  window.goToStepDirect = function(step) {
    goingBack = step < currentStep;
    const currentEl = document.getElementById(`form-step-${currentStep}`);
    currentEl.classList.add('hidden');
    currentStep = step;
    const nextEl = document.getElementById(`form-step-${currentStep}`);
    nextEl.classList.remove('hidden');
    updateUI();
    document.querySelector('.panel--right').scrollTop = 0;
  };


  // ──────────────────────────
  // SUBMIT
  // ──────────────────────────
  function submitForm() {
    // Hide step 4, show success
    document.getElementById('form-step-4').classList.add('hidden');
    document.getElementById('form-step-success').classList.remove('hidden');
    formNav.style.display = 'none';

    // Mark all steps done in sidebar
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      const item = document.getElementById(`step-nav-${i}`);
      if (item) { item.classList.remove('active'); item.classList.add('done'); }
    }

    document.querySelectorAll('.step-connector').forEach(c => c.classList.add('done'));
    document.getElementById('progressFill').style.width = '100%';

    // Success summary
    const plan = formData.plan ? formData.plan.charAt(0).toUpperCase() + formData.plan.slice(1) : 'Starter';
    document.getElementById('successSummary').innerHTML = `
      <strong>${formData.firstName} ${formData.lastName}</strong> — @${formData.username}<br/>
      <span>📧 ${formData.email}</span><br/>
      <span>📦 ${plan} Plan · ${formData.interests.join(', ')}</span>
    `;

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);
  }

  // Start over button
  document.getElementById('startOverBtn').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });

  // Initial UI state
  updateUI();

});
