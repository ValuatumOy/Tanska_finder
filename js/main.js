/* =====================================================
   CREDITREPORTS.DK — Main JS
   Navigation, scroll, reveal animations, accordion
===================================================== */

(function () {
  'use strict';

  // ── Navigation ──────────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Reveal animations ───────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('is-visible'), Number(delay));
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-animate], .reveal').forEach((el) => {
    revealObserver.observe(el);
  });

  // ── Hero entrance ────────────────────────────────────
  const hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(() => hero.classList.add('hero-loaded'));
  }

  // ── Anchor nav active state ──────────────────────────
  const anchorLinks = document.querySelectorAll('.anchor-link');
  if (anchorLinks.length > 0) {
    const sectionIds = Array.from(anchorLinks).map((a) => a.getAttribute('href')?.replace('#', '')).filter(Boolean);
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    const setActiveAnchor = () => {
      const scrollMid = window.scrollY + 160;
      let current = sections[0];
      sections.forEach((s) => { if (s.offsetTop <= scrollMid) current = s; });
      anchorLinks.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === `#${current?.id}`);
      });
    };

    window.addEventListener('scroll', setActiveAnchor, { passive: true });
    setActiveAnchor();
  }

  // ── Dropdown nav ─────────────────────────────────────
  document.querySelectorAll('.nav-item').forEach((item) => {
    let closeTimer;
    item.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      item.classList.add('open');
    });
    item.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => item.classList.remove('open'), 120);
    });
    const trigger = item.querySelector('.nav-link--has-dropdown');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    }
  });

  // ── FAQ accordion ────────────────────────────────────
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  // ── Example accordion (product page) ─────────────────
  document.querySelectorAll('.example-item').forEach((item) => {
    const btn = item.querySelector('.example-header');
    if (!btn) return;
    btn.addEventListener('click', () => item.classList.toggle('open'));
  });

})();
