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

function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target;
  const originalText = btn.innerHTML;
  
  btn.innerHTML = 'System Launching...';
  btn.style.opacity = '0.7';
  
  setTimeout(() => {
    btn.innerHTML = 'Application Received ✓';
    btn.style.opacity = '1';
    btn.style.background = '#4CAF50';
    btn.style.borderColor = '#4CAF50';
    btn.style.color = '#fff';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.color = '';
      e.target.closest('form')?.reset();
    }, 3000);
  }, 1500);
}

window.handleSubmit = handleSubmit;

// ═══════════════════ FORCE AUTOPLAY (fallback for strict browsers) ═══════════════════
// Some browsers block autoplay without a user gesture even when muted.
// This tries to start playback once DOM is ready and adds a small play overlay if blocked.

window.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector<HTMLVideoElement>('.bg-video');
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
