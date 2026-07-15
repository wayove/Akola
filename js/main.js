// ==========================================================================
// AKOLA CHEMICALS — shared interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky header shrink ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Desktop mega menu (click + keyboard, hover-friendly) ---------- */
  document.querySelectorAll('.nav-links > li.has-mega').forEach((item) => {
    const trigger = item.querySelector('.nav-link');
    let hoverTimer;

    const open = () => {
      document.querySelectorAll('.nav-links > li.open').forEach(li => li !== item && li.classList.remove('open'));
      item.classList.add('open');
    };
    const close = () => item.classList.remove('open');

    item.addEventListener('mouseenter', () => { clearTimeout(hoverTimer); open(); });
    item.addEventListener('mouseleave', () => { hoverTimer = setTimeout(close, 180); });

    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) return; // mobile handled separately
      e.preventDefault();
      item.classList.contains('open') ? close() : open();
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links > li.has-mega')) {
      document.querySelectorAll('.nav-links > li.open').forEach(li => li.classList.remove('open'));
    }
  });

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });

    mobileNav.querySelectorAll('.has-sub > a').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = link.parentElement;
        const sub = parent.querySelector('.sub-list');
        parent.classList.toggle('open');
        sub && sub.classList.toggle('open');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .wheat-divider');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        countIO.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => countIO.observe(el));
  }

  /* ---------- Video lightbox ---------- */
  const lightbox = document.getElementById('videoLightbox');
  const lightboxVideo = document.getElementById('lightboxVideo');

  const openLightbox = (src) => {
    if (!lightbox || !lightboxVideo) return;
    lightboxVideo.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxVideo.play().catch(() => {});
  };
  const closeLightbox = () => {
    if (!lightbox || !lightboxVideo) return;
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.video-block').forEach((block) => {
    const playBtn = block.querySelector('.video-play');
    const src = block.dataset.videoSrc;
    if (!playBtn) return;
    playBtn.addEventListener('click', () => openLightbox(src));
  });

  if (lightbox) {
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }

  /* ---------- Contact form (static demo, no backend yet) ---------- */
  const form = document.querySelector('.inquiry-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const feedback = form.querySelector('.form-feedback');
      if (feedback) {
        feedback.textContent = 'Thank you — your requirement has been noted. Our team will reply shortly.';
        feedback.classList.add('show');
      }
      form.reset();
    });
  }

});
