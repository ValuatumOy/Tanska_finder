/* =====================================================
   CREDITREPORTS.DK — Search Module
   Placeholder — connect real endpoint when backend is ready
===================================================== */

(function () {
  'use strict';

  /**
   * Redirect to company search results page.
   * Replace body with real API call when backend is available.
   * @param {string} query - Raw search term (name, CVR, business ID)
   * @param {string} [baseUrl] - Base URL for the companies subdomain
   */
  function handleCompanySearch(query, baseUrl) {
    const q = query.trim();
    if (!q) return;
    const encoded = encodeURIComponent(q);
    // PLACEHOLDER: update baseUrl to real companies subdomain in production
    const dest = baseUrl || 'https://companies.creditreports.dk/en/';
    window.location.href = `${dest}?q=${encoded}`;
  }

  /**
   * Attach submit handlers to all search bar forms on the page.
   */
  function initSearchBars() {
    document.querySelectorAll('.search-bar-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('.search-input');
        const base  = form.dataset.searchBase || undefined;
        if (input) handleCompanySearch(input.value, base);
      });

      // Pressing Enter in the input
      const input = form.querySelector('.search-input');
      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const base = form.dataset.searchBase || undefined;
            handleCompanySearch(input.value, base);
          }
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initSearchBars);

  // Expose for programmatic use
  window.CRSearch = { handleCompanySearch };

})();
