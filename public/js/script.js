/**
 * Professional interactions and ultra-minimal script.
 * Removed canvas starfield to allow video/image background to shine.
 */

// ═══════════════════ OBSERVER ANIMATIONS ═══════════════════

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-reveal]').forEach((el) => {
  observer.observe(el);
});

// ═══════════════════ CUSTOM CURSOR ═══════════════════

const cursor = document.getElementById('custom-cursor');

document.addEventListener('mousemove', (e) => {
  if (cursor) {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  }
});

document.querySelectorAll('a, button, input, textarea, select, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor?.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor?.classList.remove('hovered'));
});


// ═══════════════════ SCROLL PROGRESS & NAVBAR ═══════════════════

const pbar = document.getElementById('pbar');
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  const scrollTotal = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPct = (scrollTotal / height) * 100;
  
  if (pbar) pbar.style.width = scrollPct + '%';

  if (window.scrollY > 50) {
    if (nav) nav.classList.add('scrolled');
  } else {
    if (nav) nav.classList.remove('scrolled');
  }
});

// ═══════════════════ FORM SUBMISSION ═══════════════════

const supabaseUrl = 'https://guxisdxehavxywetzkwz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1eGlzZHhlaGF2eHl3ZXR6a3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDUzMzUsImV4cCI6MjA5MDAyMTMzNX0.mNLJYTqDLRzn_b8uiQMIk4gTvneZcRi8XAHeZyxZodA';
const supabaseClient = window.supabase?.createClient(supabaseUrl, supabaseAnonKey);

function setFormStatus(form, message, color) {
  if (!form) return;

  let statusEl = form.querySelector('[data-form-status]');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.setAttribute('data-form-status', 'true');
    statusEl.setAttribute('aria-live', 'polite');
    statusEl.style.marginTop = '16px';
    statusEl.style.fontSize = '0.95rem';
    form.appendChild(statusEl);
  }

  statusEl.textContent = message;
  statusEl.style.color = color;
}

async function handleSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form?.querySelector('button[type="submit"]');
  if (!form || !button) return;

  const originalText = button.innerHTML;
  const formData = new FormData(form);
  const payload = {
    full_name: formData.get('fullName')?.toString().trim() || '',
    select_year: formData.get('year')?.toString().trim() || '',
    branch: formData.get('branch')?.toString().trim() || '',
    domain_interest: formData.get('domainInterest')?.toString().trim() || '',
    why_dhruvishaya: formData.get('motivation')?.toString().trim() || ''
  };

  if (!supabaseClient) {
    setFormStatus(form, 'Unable to connect right now. Please try again.', '#B42318');
    return;
  }

  button.innerHTML = 'System Launching...';
  button.style.opacity = '0.7';
  button.disabled = true;
  setFormStatus(form, '', '');

  try {
    const { error } = await supabaseClient
      .from('registrations')
      .insert([payload]);

    if (error) throw error;

    button.innerHTML = 'Application Received ✓';
    button.style.opacity = '1';
    button.style.background = '#4CAF50';
    button.style.borderColor = '#4CAF50';
    button.style.color = '#fff';
    setFormStatus(form, 'Application submitted successfully.', '#4CAF50');

    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = '';
      button.style.borderColor = '';
      button.style.color = '';
      button.disabled = false;
      form.reset();
    }, 3000);
  } catch (error) {
    button.innerHTML = 'Submission Failed';
    button.style.opacity = '1';
    button.style.background = '#B42318';
    button.style.borderColor = '#B42318';
    button.style.color = '#fff';
    setFormStatus(form, error.message || 'Something went wrong. Please try again.', '#B42318');

    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = '';
      button.style.borderColor = '';
      button.style.color = '';
      button.disabled = false;
    }, 3000);
  }
}

// ═══════════════════ FORCE AUTOPLAY (fallback for strict browsers) ═══════════════════
// Some browsers block autoplay without a user gesture even when muted.
// This tries to start playback once DOM is ready and adds a small play overlay if blocked.

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('application-form');
  form?.addEventListener('submit', handleSubmit);

  const video = document.querySelector('.bg-video');
  if (!video) return;

  const tryPlay = () => {
    video.play().catch(() => {
      // show small play hint so user can allow playback
      const hint = document.createElement('div');
      hint.className = 'video-play-hint';
      hint.innerText = '▶ Tap to play';
      document.body.appendChild(hint);

      const onUserGesture = () => {
        video.play().catch(() => {});
        hint.remove();
        window.removeEventListener('click', onUserGesture);
      };

      window.addEventListener('click', onUserGesture, { once: true });
    });
  };

  tryPlay();
});
