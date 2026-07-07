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
   * Create the placeholder dropdown used while remote search is pending.
   * Real AWS CloudSearch/API Gateway results can replace the loading body later.
   * @returns {HTMLElement}
   */
  function createSearchDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    dropdown.setAttribute('role', 'status');
    dropdown.setAttribute('aria-live', 'polite');
    dropdown.hidden = true;

    const loading = document.createElement('div');
    loading.className = 'search-dropdown-loading';

    const spinner = document.createElement('span');
    spinner.className = 'search-dropdown-spinner';
    spinner.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.className = 'sr-only';
    text.textContent = 'Loading search results';

    loading.append(spinner, text);
    dropdown.append(loading);

    return dropdown;
  }

  /**
   * Toggle dropdown visibility from the current input value.
   * @param {HTMLInputElement} input
   * @param {HTMLElement} dropdown
   */
  function updateSearchDropdown(input, dropdown) {
    const isOpen = input.value.trim().length > 0;
    dropdown.hidden = !isOpen;
  }

  /**
   * Attach submit handlers to all search bar forms on the page.
   */
  function initSearchBars() {
    document.querySelectorAll('.search-bar-form').forEach((form) => {
      const input = form.querySelector('.search-input');
      const dropdown = createSearchDropdown();
      form.appendChild(dropdown);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const base  = form.dataset.searchBase || undefined;
        if (input) handleCompanySearch(input.value, base);
      });

      // Pressing Enter in the input
      if (input) {
        updateSearchDropdown(input, dropdown);

        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('aria-haspopup', 'listbox');

        input.addEventListener('input', () => {
          updateSearchDropdown(input, dropdown);
          input.setAttribute('aria-expanded', String(!dropdown.hidden));
        });

        input.addEventListener('focus', () => {
          updateSearchDropdown(input, dropdown);
          input.setAttribute('aria-expanded', String(!dropdown.hidden));
        });

        input.addEventListener('blur', () => {
          window.setTimeout(() => {
            dropdown.hidden = true;
            input.setAttribute('aria-expanded', 'false');
          }, 120);
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            dropdown.hidden = true;
            input.setAttribute('aria-expanded', 'false');
            return;
          }

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
