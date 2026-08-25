(function () {
  'use strict';

  const LOGIN = 'https://platform.creditreports.dk';
  const SIGNUP = 'https://platform.creditreports.dk/AspAndUserCreation.action?templateAspQueryKey=CreditAnalysis&popup=true';
  const CHEVRON = `<svg class="nav-chevron" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const COPY = {
    en: {
      products: 'Products',
      allProducts: 'All Products',
      creditRiskTool: 'Credit Risk Tool',
      valuationTool: 'Company Valuation Tool',
      assessmentMethods: 'Assessment Methods',
      pricing: 'Pricing',
      aiReport: 'AI Credit Report',
      companySearch: 'Company Search',
      support: 'Support',
      supportHub: 'Support Hub',
      getStarted: 'Get Started',
      tutorials: 'Platform Tutorials',
      faq: 'Credit Risk FAQ',
      management: 'Credit Risk Management',
      manual: 'Credit Risk Manual',
      modelOverview: 'Model Overview',
      contact: 'Contact',
      login: 'Login',
      createAccount: 'Create Account',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      footerTagline: 'Credit risk reports and financial analysis for Danish companies.',
      poweredBy: 'Powered by Valuatum',
      searchDanish: 'Search Danish companies',
      directory: 'Company directory',
      supportLabel: 'Support',
      companyLabel: 'Company',
      contactUs: 'Contact us',
      privacy: 'Privacy Policy',
      rights: 'All rights reserved.'
    },
    da: {
      products: 'Produkter',
      allProducts: 'Alle produkter',
      creditRiskTool: 'Credit Risk Tool',
      valuationTool: 'Company Valuation Tool',
      assessmentMethods: 'Kreditrisikometoder',
      pricing: 'Priser',
      aiReport: 'AI Credit Report',
      companySearch: 'Virksomhedssøgning',
      support: 'Support',
      supportHub: 'Support hub',
      getStarted: 'Kom i gang',
      tutorials: 'Platformsguides',
      faq: 'Kreditrisiko FAQ',
      management: 'Kreditrisikostyring',
      manual: 'Manual',
      modelOverview: 'Modeloverblik',
      contact: 'Kontakt',
      login: 'Login',
      createAccount: 'Opret konto',
      openMenu: 'Åbn menu',
      closeMenu: 'Luk menu',
      footerTagline: 'Kreditrapporter og finansiel analyse for danske virksomheder.',
      poweredBy: 'Drevet af Valuatum',
      searchDanish: 'Søg danske virksomheder',
      directory: 'Virksomhedsregister',
      supportLabel: 'Support',
      companyLabel: 'Virksomhed',
      contactUs: 'Kontakt os',
      privacy: 'Privatlivspolitik',
      rights: 'Alle rettigheder forbeholdes.'
    }
  };

  function localeFromPath(path) {
    return path === '/da' || path.startsWith('/da/') ? 'da' : 'en';
  }

  function pagePath(locale, suffix = '') {
    return `/${locale}/${suffix}`.replace(/\/{2,}/g, '/');
  }

  function companySearch(locale) {
    return `https://companies.creditreports.dk/${locale}/`;
  }

  function supportDetailLinks(locale, text, className) {
    const links = locale === 'da'
      ? [[riskManagementPath(locale), text.management]]
      : [
          [supportPath('en', 'get-started/'), text.getStarted],
          [supportPath('en', 'platform-tutorials/'), text.tutorials],
          [supportPath('en', 'credit-risk-faq/'), text.faq],
          [riskManagementPath(locale), text.management],
          [supportPath('en', 'credit-risk-manual/'), text.manual],
          [supportPath('en', 'credit-risk-model-overview/'), text.modelOverview],
        ];
    const mobile = className.includes('nav-mobile-link');
    const role = className === 'nav-dropdown-link' ? ' role="menuitem"' : '';
    return links
      .map(([href, label]) => {
        const link = `<a href="${href}" class="${className}"${role}>${label}</a>`;
        return mobile ? `<li>${link}</li>` : link;
      })
      .join('\n');
  }

  function alternatePath(path, nextLocale) {
    const normalized = path.endsWith('/') ? path : `${path}/`;
    if (nextLocale === 'da') {
      if (normalized.startsWith('/en/')) return normalized.replace('/en/', '/da/');
      if (normalized === '/') return '/da/';
      return normalized.startsWith('/da/') ? normalized : `/da${normalized}`;
    }
    if (normalized.startsWith('/da/')) return normalized.replace('/da/', '/en/');
    if (normalized === '/') return '/en/';
    return normalized.startsWith('/en/') ? normalized : `/en${normalized}`;
  }

  function supportPath(locale, suffix = '') {
    if (locale === 'da') return pagePath('da', suffix ? `support/${suffix}` : 'support/kreditrisiko/');
    return pagePath('en', `support/${suffix}`);
  }

  function riskManagementPath(locale) {
    return locale === 'da' ? supportPath('da', 'kreditrisiko/') : supportPath('en', 'credit-risk-management/');
  }

  function buildNav() {
    const path = window.location.pathname;
    const locale = localeFromPath(path);
    const text = COPY[locale];
    const otherLocale = locale === 'da' ? 'en' : 'da';
    const otherPath = alternatePath(path, otherLocale);
    const productActive = path.startsWith(`/${locale}/product`) ? ' nav-link--active' : '';
    const supportActive = path.startsWith(`/${locale}/support`) ? ' nav-link--active' : '';

    return `
<header class="nav" id="nav">
  <div class="nav-inner">
    <a href="${pagePath(locale)}" class="nav-logo" aria-label="CreditReports.dk home">
      <img class="nav-logo-image" src="/assets/brand/creditreportsdklogo.svg" alt="CreditReports.dk">
    </a>
    <nav class="nav-links" aria-label="Main navigation">
      <div class="nav-item">
        <a href="${pagePath(locale, 'product/')}" class="nav-link nav-link--has-dropdown${productActive}" aria-haspopup="true" aria-expanded="false">${text.products} ${CHEVRON}</a>
        <div class="nav-dropdown" role="menu">
          <div class="nav-dropdown-inner">
            <a href="${pagePath(locale, 'product/')}" class="nav-dropdown-link" role="menuitem">${text.allProducts}</a>
            <div class="nav-dropdown-divider"></div>
            <a href="${pagePath(locale, 'products/credit-risk-tool/')}" class="nav-dropdown-link" role="menuitem">${text.creditRiskTool}</a>
            <a href="${pagePath(locale, 'products/company-valuation-tool/')}" class="nav-dropdown-link" role="menuitem">${text.valuationTool}</a>
            <a href="${pagePath(locale, 'products/credit-risk-assessment-methods/')}" class="nav-dropdown-link" role="menuitem">${text.assessmentMethods}</a>
            <div class="nav-dropdown-divider"></div>
            <a href="${pagePath(locale, 'ai-credit-report/')}" class="nav-dropdown-link" role="menuitem" style="color:var(--blue);font-weight:500;">${text.aiReport}</a>
          </div>
        </div>
      </div>

      <a href="${pagePath(locale, 'pricing/')}" class="nav-link${path.startsWith(`/${locale}/pricing`) ? ' nav-link--active' : ''}">${text.pricing}</a>
      <a href="${pagePath(locale, 'ai-credit-report/')}" class="nav-link${path.startsWith(`/${locale}/ai-credit-report`) ? ' nav-link--active' : ''}">${text.aiReport}</a>
      <a href="${companySearch(locale)}" class="nav-link">${text.companySearch}</a>

      <div class="nav-item">
        <a href="${supportPath(locale)}" class="nav-link nav-link--has-dropdown${supportActive}" aria-haspopup="true" aria-expanded="false">${text.support} ${CHEVRON}</a>
        <div class="nav-dropdown" role="menu">
          <div class="nav-dropdown-inner">
            <a href="${supportPath(locale)}" class="nav-dropdown-link" role="menuitem">${text.supportHub}</a>
            <div class="nav-dropdown-divider"></div>
            ${supportDetailLinks(locale, text, 'nav-dropdown-link')}
          </div>
        </div>
      </div>

      <a href="${pagePath(locale, 'contact/')}" class="nav-link${path.startsWith(`/${locale}/contact`) ? ' nav-link--active' : ''}">${text.contact}</a>
    </nav>
    <div class="nav-actions">
      <a href="${LOGIN}" class="nav-login" target="_blank" rel="noopener">${text.login}</a>
      <a href="${pagePath(locale, 'create-account/')}" class="nav-cta">${text.createAccount}</a>
      <a href="${otherPath}" class="nav-lang" hreflang="${otherLocale}" aria-label="${otherLocale === 'da' ? 'Dansk version' : 'English version'}">${otherLocale.toUpperCase()}</a>
    </div>
    <button class="nav-hamburger" type="button" aria-label="${text.openMenu}" aria-controls="mobileMenu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="nav-mobile-menu" id="mobileMenu" aria-hidden="true">
    <nav class="nav-mobile-nav" aria-label="Mobile navigation">
      <ul class="nav-mobile-list">
        <li class="nav-mobile-group">
          <a href="${pagePath(locale, 'product/')}" class="nav-mobile-link">${text.products}</a>
          <ul class="nav-mobile-sublist">
            <li><a href="${pagePath(locale, 'products/credit-risk-tool/')}" class="nav-mobile-link nav-mobile-link--sub">${text.creditRiskTool}</a></li>
            <li><a href="${pagePath(locale, 'products/company-valuation-tool/')}" class="nav-mobile-link nav-mobile-link--sub">${text.valuationTool}</a></li>
            <li><a href="${pagePath(locale, 'products/credit-risk-assessment-methods/')}" class="nav-mobile-link nav-mobile-link--sub">${text.assessmentMethods}</a></li>
            <li><a href="${pagePath(locale, 'ai-credit-report/')}" class="nav-mobile-link nav-mobile-link--sub">${text.aiReport}</a></li>
          </ul>
        </li>
        <li><a href="${pagePath(locale, 'pricing/')}" class="nav-mobile-link">${text.pricing}</a></li>
        <li><a href="${companySearch(locale)}" class="nav-mobile-link">${text.companySearch}</a></li>
        <li class="nav-mobile-group">
          <a href="${supportPath(locale)}" class="nav-mobile-link">${text.support}</a>
          <ul class="nav-mobile-sublist">
            ${supportDetailLinks(locale, text, 'nav-mobile-link nav-mobile-link--sub')}
          </ul>
        </li>
        <li><a href="${pagePath(locale, 'contact/')}" class="nav-mobile-link">${text.contact}</a></li>
        <li><a href="${otherPath}" class="nav-mobile-link">${otherLocale.toUpperCase()}</a></li>
        <li><a href="${LOGIN}" class="nav-mobile-link" target="_blank" rel="noopener">${text.login}</a></li>
        <li><a href="${pagePath(locale, 'create-account/')}" class="nav-mobile-link nav-mobile-cta">${text.createAccount}</a></li>
      </ul>
    </nav>
  </div>
</header>`;
  }

  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav || nav.dataset.navInitialized === 'true') return;
    nav.dataset.navInitialized = 'true';
    const text = COPY[localeFromPath(window.location.pathname)];

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
      hamburger.setAttribute('aria-label', open ? text.closeMenu : text.openMenu);
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
    const locale = localeFromPath(window.location.pathname);
    const text = COPY[locale];

    return `
<footer class="footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <span class="footer-wordmark">CreditReports.dk</span>
        <p class="footer-tagline">${text.footerTagline}</p>
        <a href="https://valuatum.com" class="footer-valuatum-link" target="_blank" rel="noopener">${text.poweredBy}</a>
      </div>
      <nav class="footer-nav" aria-label="Footer navigation">
        <div class="footer-col">
          <span class="footer-col-label">${text.products}</span>
          <a href="${pagePath(locale, 'products/credit-risk-tool/')}" class="footer-link">${text.creditRiskTool}</a>
          <a href="${pagePath(locale, 'products/company-valuation-tool/')}" class="footer-link">${text.valuationTool}</a>
          <a href="${pagePath(locale, 'ai-credit-report/')}" class="footer-link">${text.aiReport}</a>
          <a href="${pagePath(locale, 'pricing/')}" class="footer-link">${text.pricing}</a>
        </div>
        <div class="footer-col">
          <span class="footer-col-label">${text.companySearch}</span>
          <a href="${companySearch(locale)}" class="footer-link">${text.searchDanish}</a>
          <a href="${companySearch(locale)}" class="footer-link">${text.directory}</a>
        </div>
        <div class="footer-col">
          <span class="footer-col-label">${text.supportLabel}</span>
          <a href="${supportPath(locale)}" class="footer-link">${text.supportHub}</a>
          ${supportDetailLinks(locale, text, 'footer-link')}
        </div>
        <div class="footer-col">
          <span class="footer-col-label">${text.companyLabel}</span>
          <a href="${pagePath(locale, 'contact/')}" class="footer-link">${text.contactUs}</a>
          <a href="${LOGIN}" class="footer-link" target="_blank" rel="noopener">${text.login}</a>
          <a href="${pagePath(locale, 'create-account/')}" class="footer-link">${text.createAccount}</a>
          <a href="${pagePath(locale, 'privacy-policy/')}" class="footer-link">${text.privacy}</a>
          <a href="https://valuatum.com" class="footer-link" target="_blank" rel="noopener">Valuatum.com</a>
        </div>
      </nav>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">© 2026 CreditReports.dk. ${text.rights}</p>
      <p class="footer-reg">${text.poweredBy} · Helsinki, Finland</p>
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
