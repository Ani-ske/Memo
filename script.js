/* ======================
   FLOATING PETALS
   ====================== */
function createPetals() {
  const container = document.getElementById('petalContainer');
  const colors = ['#f5b8b4', '#e8a4a0', '#f9d0cc', '#f2c0bc', '#fde4e0'];

  for (let i = 0; i < 18; i++) {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    petal.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${8 + Math.random() * 10}px;
      height: ${10 + Math.random() * 10}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      opacity: ${0.3 + Math.random() * 0.5};
      animation-duration: ${6 + Math.random() * 10}s;
      animation-delay: ${-Math.random() * 12}s;
      border-radius: ${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
    `;
    container.appendChild(petal);
  }
}

/* ======================
   SCROLL ANIMATIONS
   ====================== */
function setupScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger children if multiple
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  // Observe timeline items with stagger
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.dataset.delay = i * 150;
    observer.observe(el);
  });

  // Observe photo cards with stagger
  document.querySelectorAll('.photo-card').forEach((el, i) => {
    el.dataset.delay = i * 100;
    observer.observe(el);
  });

  // Observe letter
  document.querySelectorAll('.letter-wrapper').forEach(el => observer.observe(el));
}

/* ======================
   SURPRISE BUTTON
   ====================== */
function revealSurprise() {
  const overlay = document.getElementById('surpriseOverlay');
  overlay.classList.add('active');

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
      launchHearts();
    });
  });

  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

function closeSurprise() {
  const overlay = document.getElementById('surpriseOverlay');
  overlay.classList.remove('visible');

  setTimeout(() => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('messageHearts').innerHTML = '';
  }, 400);
}

function launchHearts() {
  const container = document.getElementById('messageHearts');
  const hearts = ['💕', '💗', '🌸', '💖', '✨', '💝', '🌷', '💞'];

  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const heart = document.createElement('span');
      heart.classList.add('floating-heart');
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.cssText = `
        left: ${5 + Math.random() * 90}%;
        font-size: ${0.8 + Math.random() * 1}rem;
        animation-duration: ${2 + Math.random() * 3}s;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      container.appendChild(heart);

      heart.addEventListener('animationend', () => heart.remove());
    }, i * 120);
  }
}

// Close on overlay backdrop click
document.getElementById('surpriseOverlay').addEventListener('click', function (e) {
  if (e.target === this) closeSurprise();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSurprise();
});

/* ======================
   HERO PARALLAX (subtle)
   ====================== */
function setupParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroHeight = document.querySelector('.hero').offsetHeight;
    if (scrolled < heroHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  }, { passive: true });
}

/* ======================
   CURSOR SPARKLE (desktop)
   ====================== */
function setupCursorSparkle() {
  if (window.matchMedia('(hover: none)').matches) return;

  let lastX = 0, lastY = 0;
  let throttle = false;

  document.addEventListener('mousemove', (e) => {
    if (throttle) return;
    throttle = true;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 25) {
      lastX = e.clientX;
      lastY = e.clientY;
      createSparkle(e.clientX, e.clientY);
    }

    setTimeout(() => throttle = false, 60);
  });
}

function createSparkle(x, y) {
  const sparkle = document.createElement('div');
  sparkle.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #e8a4a0;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%) scale(1);
    transition: transform 0.6s ease, opacity 0.6s ease;
    opacity: 0.7;
  `;
  document.body.appendChild(sparkle);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      sparkle.style.transform = `translate(-50%, -50%) scale(0) translateY(-20px)`;
      sparkle.style.opacity = '0';
    });
  });

  setTimeout(() => sparkle.remove(), 700);
}

/* ======================
   INIT
   ====================== */
document.addEventListener('DOMContentLoaded', () => {
  createPetals();
  setupScrollAnimations();
  setupParallax();
  setupCursorSparkle();
});