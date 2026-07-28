(function () {
  'use strict';

  const BASE   = '/en/';
  const COMP   = 'https://companies.creditreports.dk/en/';
  const LOGIN  = 'https://platform.creditreports.dk';
  const SIGNUP = 'https://platform.creditreports.dk/AspAndUserCreation.action?templateAspQueryKey=CreditAnalysis&popup=true';

  const CHEVRON = `<svg class="nav-chevron" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  function buildNav() {
    const path = window.location.pathname;
    const prodActive = path.startsWith('/en/product') ? ' nav-link--active' : '';
    const suppActive = path.startsWith('/en/support') ? ' nav-link--active' : '';

    return `
<header class="nav" id="nav">
  <div class="nav-inner">
    <a href="${BASE}" class="nav-logo" aria-label="CreditReports.dk home">
      <div class="nav-logo-icon" aria-hidden="true">CR</div>
      <span class="nav-logo-wordmark">CreditReports.dk</span>
    </a>
    <nav class="nav-links" aria-label="Main navigation">

      <div class="nav-item">
        <a href="/en/product/" class="nav-link nav-link--has-dropdown${prodActive}" aria-haspopup="true" aria-expanded="false">Products ${CHEVRON}</a>
        <div class="nav-dropdown" role="menu">
          <div class="nav-dropdown-inner">
          <a href="/en/product/" class="nav-dropdown-link" role="menuitem">All Products</a>
          <div class="nav-dropdown-divider"></div>
          <a href="/en/products/credit-risk-tool/" class="nav-dropdown-link" role="menuitem">Credit Risk Tool</a>
          <a href="/en/products/company-valuation-tool/" class="nav-dropdown-link" role="menuitem">Company Valuation Tool</a>
          <a href="/en/products/credit-risk-assessment-methods/" class="nav-dropdown-link" role="menuitem">Assessment Methods</a>
          <div class="nav-dropdown-divider"></div>
          <a href="/en/ai-credit-report/" class="nav-dropdown-link" role="menuitem" style="color:var(--blue);font-weight:500;">✦ AI Credit Report</a>
          </div>
        </div>
      </div>

      <a href="/en/pricing/" class="nav-link${path.startsWith('/en/pricing') ? ' nav-link--active' : ''}">Pricing</a>
      <a href="/en/ai-credit-report/" class="nav-link${path.startsWith('/en/ai-credit-report') ? ' nav-link--active' : ''}">AI Credit Report</a>
      <a href="${COMP}" class="nav-link">Company Search</a>

      <div class="nav-item">
        <a href="/en/support/" class="nav-link nav-link--has-dropdown${suppActive}" aria-haspopup="true" aria-expanded="false">Support ${CHEVRON}</a>
        <div class="nav-dropdown" role="menu">
          <div class="nav-dropdown-inner">
          <a href="/en/support/" class="nav-dropdown-link" role="menuitem">Support Hub</a>
          <div class="nav-dropdown-divider"></div>
          <a href="/en/support/get-started/" class="nav-dropdown-link" role="menuitem">Get Started</a>
          <a href="/en/support/platform-tutorials/" class="nav-dropdown-link" role="menuitem">Platform Tutorials</a>
          <a href="/en/support/credit-risk-faq/" class="nav-dropdown-link" role="menuitem">Credit Risk FAQ</a>
          <a href="/en/support/credit-risk-management/" class="nav-dropdown-link" role="menuitem">Credit Risk Management</a>
          <a href="/en/support/credit-risk-manual/" class="nav-dropdown-link" role="menuitem">Credit Risk Manual</a>
          <a href="/en/support/credit-risk-model-overview/" class="nav-dropdown-link" role="menuitem">Model Overview</a>
          </div>
        </div>
      </div>

      <a href="/en/contact/" class="nav-link${path.startsWith('/en/contact') ? ' nav-link--active' : ''}">Contact</a>
    </nav>
    <div class="nav-actions">
      <a href="${LOGIN}" class="nav-login" target="_blank" rel="noopener">Login</a>
      <a href="${SIGNUP}" class="nav-cta">Create Account</a>
    </div>
    <button class="nav-hamburger" type="button" aria-label="Open menu" aria-controls="mobileMenu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="nav-mobile-menu" id="mobileMenu" aria-hidden="true">
    <nav class="nav-mobile-nav" aria-label="Mobile navigation">
      <ul class="nav-mobile-list">
        <li class="nav-mobile-group">
          <a href="/en/product/" class="nav-mobile-link">Products</a>
          <ul class="nav-mobile-sublist">
            <li><a href="/en/products/credit-risk-tool/" class="nav-mobile-link nav-mobile-link--sub">Credit Risk Tool</a></li>
            <li><a href="/en/products/company-valuation-tool/" class="nav-mobile-link nav-mobile-link--sub">Company Valuation Tool</a></li>
            <li><a href="/en/products/credit-risk-assessment-methods/" class="nav-mobile-link nav-mobile-link--sub">Assessment Methods</a></li>
            <li><a href="/en/ai-credit-report/" class="nav-mobile-link nav-mobile-link--sub">AI Credit Report</a></li>
          </ul>
        </li>
        <li><a href="/en/pricing/" class="nav-mobile-link">Pricing</a></li>
        <li><a href="${COMP}" class="nav-mobile-link">Company Search</a></li>
        <li class="nav-mobile-group">
          <a href="/en/support/" class="nav-mobile-link">Support</a>
          <ul class="nav-mobile-sublist">
            <li><a href="/en/support/get-started/" class="nav-mobile-link nav-mobile-link--sub">Get Started</a></li>
            <li><a href="/en/support/platform-tutorials/" class="nav-mobile-link nav-mobile-link--sub">Platform Tutorials</a></li>
            <li><a href="/en/support/credit-risk-faq/" class="nav-mobile-link nav-mobile-link--sub">FAQ</a></li>
            <li><a href="/en/support/credit-risk-manual/" class="nav-mobile-link nav-mobile-link--sub">Manual</a></li>
            <li><a href="/en/support/credit-risk-model-overview/" class="nav-mobile-link nav-mobile-link--sub">Model Overview</a></li>
          </ul>
        </li>
        <li><a href="/en/contact/" class="nav-mobile-link">Contact</a></li>
        <li><a href="${LOGIN}" class="nav-mobile-link" target="_blank" rel="noopener">Login</a></li>
        <li><a href="${SIGNUP}" class="nav-mobile-link nav-mobile-cta">Create Account</a></li>
      </ul>
    </nav>
  </div>
</header>`;
  }

  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav || nav.dataset.navInitialized === 'true') return;
    nav.dataset.navInitialized = 'true';

    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const hamburger = nav.querySelector('.nav-hamburger');
    const mobileMenu = nav.querySelector('#mobileMenu');
    const setMenuOpen = (open) => {
      if (!hamburger || !mobileMenu) return;
      mobileMenu.classList.toggle('open', open);
      mobileMenu.setAttribute('aria-hidden', String(!open));
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-menu-open', open);
    };

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', (event) => {
        event.stopPropagation();
        setMenuOpen(!mobileMenu.classList.contains('open'));
      });

      mobileMenu.addEventListener('click', (event) => {
        if (event.target.closest('a')) setMenuOpen(false);
      });

      document.addEventListener('click', (event) => {
        if (!nav.contains(event.target)) setMenuOpen(false);
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setMenuOpen(false);
      });
    }

    nav.querySelectorAll('.nav-item').forEach((item) => {
      let closeTimer;
      const trigger = item.querySelector('.nav-link--has-dropdown');
      const setDropdownOpen = (open) => {
        item.classList.toggle('open', open);
        if (trigger) trigger.setAttribute('aria-expanded', String(open));
      };

      item.addEventListener('mouseenter', () => {
        if (window.matchMedia('(hover: hover)').matches) {
          clearTimeout(closeTimer);
          setDropdownOpen(true);
        }
      });

      item.addEventListener('mouseleave', () => {
        if (window.matchMedia('(hover: hover)').matches) {
          closeTimer = setTimeout(() => setDropdownOpen(false), 120);
        }
      });

      if (trigger) {
        trigger.addEventListener('click', (event) => {
          if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
            event.preventDefault();
            setDropdownOpen(!item.classList.contains('open'));
          }
        });
      }
    });
  }

  function buildFooter() {
    return `
<footer class="footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <span class="footer-wordmark">CreditReports.dk</span>
        <p class="footer-tagline">Credit risk reports and financial analysis for Danish companies.</p>
        <a href="https://valuatum.com" class="footer-valuatum-link" target="_blank" rel="noopener">Powered by Valuatum ↗</a>
      </div>
      <nav class="footer-nav" aria-label="Footer navigation">
        <div class="footer-col">
          <span class="footer-col-label">Products</span>
          <a href="/en/products/credit-risk-tool/" class="footer-link">Credit Risk Tool</a>
          <a href="/en/products/company-valuation-tool/" class="footer-link">Company Valuation Tool</a>
          <a href="/en/ai-credit-report/" class="footer-link">AI Credit Report</a>
          <a href="/en/pricing/" class="footer-link">Pricing</a>
        </div>
        <div class="footer-col">
          <span class="footer-col-label">Company Search</span>
          <a href="https://companies.creditreports.dk/en/" class="footer-link">Search Danish companies</a>
          <a href="https://companies.creditreports.dk/en/" class="footer-link">Company directory</a>
        </div>
        <div class="footer-col">
          <span class="footer-col-label">Support</span>
          <a href="/en/support/" class="footer-link">Support hub</a>
          <a href="/en/support/get-started/" class="footer-link">Get started</a>
          <a href="/en/support/platform-tutorials/" class="footer-link">Platform tutorials</a>
          <a href="/en/support/credit-risk-faq/" class="footer-link">Credit risk FAQ</a>
          <a href="/en/support/credit-risk-manual/" class="footer-link">Manual</a>
          <a href="/en/support/credit-risk-model-overview/" class="footer-link">Model overview</a>
        </div>
        <div class="footer-col">
          <span class="footer-col-label">Company</span>
          <a href="/en/contact/" class="footer-link">Contact us</a>
          <a href="https://platform.creditreports.dk" class="footer-link" target="_blank" rel="noopener">Login</a>
          <a href="/en/create-account/" class="footer-link">Create Account</a>
          <a href="/en/privacy-policy/" class="footer-link">Privacy Policy</a>
          <a href="https://valuatum.com" class="footer-link" target="_blank" rel="noopener">Valuatum.com</a>
        </div>
      </nav>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">© 2025 CreditReports.dk. All rights reserved.</p>
      <p class="footer-reg">Powered by Valuatum · Helsinki, Finland</p>
    </div>
  </div>
</footer>`;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const navSlot = document.getElementById('site-nav');
    if (navSlot) navSlot.outerHTML = buildNav();

    const footerSlot = document.getElementById('site-footer');
    if (footerSlot) footerSlot.outerHTML = buildFooter();

    initNav();
  });

  window.CRNav = { buildNav, buildFooter, initNav };
})();
