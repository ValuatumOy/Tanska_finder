/* =====================================================
   CREDITREPORTS.DK - Company Search Autocomplete
===================================================== */

(function () {
    'use strict';

    const SEARCH_ENDPOINT = 'https://api.creditreports.dk';
    const SEARCH_DELAY = 500;
    const MIN_QUERY_LENGTH = 3;
    const MAX_RESULTS = 10;

    function buildSearchQuery(rawQuery) {
        const query = String(rawQuery || '').trim();
        if (!query) return '';
        return encodeURIComponent(`${query}*|${query}`);
    }

    function orderConcernCompanies(results) {
        const concernCompanies = results.filter((company) => company.companyCode.endsWith('K'));
        const concernCodeSet = new Set(
            concernCompanies.map((company) => company.companyCode.slice(0, -1)),
        );
        const regularCompanies = results.filter(
            (company) =>
                !concernCodeSet.has(company.companyCode) && !company.companyCode.endsWith('K'),
        );

        return concernCompanies.concat(regularCompanies);
    }

    function normalizeSearchResponse(json) {
        const hits = json && json.hits && Array.isArray(json.hits.hit) ? json.hits.hit : [];

        const results = hits
            .map((hit) => {
                const fields = hit && hit.fields ? hit.fields : {};
                return {
                    followedModelId: String(fields.followedmodelid || ''),
                    companyName: String(fields.name || ''),
                    companyCode: String(fields.isin || ''),
                    nameSlug: String(fields.name_slug || ''),
                };
            })
            .filter((result) => result.followedModelId && result.companyName && result.nameSlug);

        return orderConcernCompanies(results);
    }

    function assertSearchPayload(json) {
        if (!json || !json.hits || !Array.isArray(json.hits.hit)) {
            throw new Error('Malformed search response');
        }
    }

    async function fetchSearchResults(query, signal) {
        const encodedQuery = buildSearchQuery(query);
        if (!encodedQuery) return [];

        const response = await fetch(`${SEARCH_ENDPOINT}/search?q=${encodedQuery}`, { signal });
        if (!response.ok) throw new Error(`Search failed with ${response.status}`);

        const json = await response.json();
        assertSearchPayload(json);
        return normalizeSearchResponse(json);
    }

    function handleCompanySearch(query) {
        const controller = new AbortController();
        return fetchSearchResults(query, controller.signal);
    }

    function createSearchDropdown(id) {
        const dropdown = document.createElement('div');
        dropdown.className = 'search-dropdown';
        dropdown.id = id;
        dropdown.hidden = true;
        dropdown.setAttribute('role', 'listbox');
        dropdown.setAttribute('aria-live', 'polite');
        return dropdown;
    }

    function createLoadingNode() {
        const loading = document.createElement('div');
        loading.className = 'search-dropdown-loading';

        const spinner = document.createElement('span');
        spinner.className = 'search-dropdown-spinner';
        spinner.setAttribute('aria-hidden', 'true');

        const text = document.createElement('span');
        text.className = 'sr-only';
        text.textContent = 'Loading search results';

        loading.append(spinner, text);
        return loading;
    }

    function createMessageNode(className, text) {
        const message = document.createElement('div');
        message.className = className;
        message.textContent = text;
        return message;
    }

    function formatCompanyCode(companyCode) {
        return companyCode.endsWith('K') ? companyCode.slice(0, -1) : companyCode;
    }

    function buildCompanyUrl(result) {
        const locale = window.location.pathname.startsWith('/da/') ? 'da' : 'en';
        return `https://companies.creditreports.dk/${locale}/companies/${encodeURIComponent(result.followedModelId)}/${encodeURIComponent(result.nameSlug)}/`;
    }

    function buildResultLink(result, index, dropdownId) {
        const link = document.createElement('a');
        link.className = 'search-dropdown-link';
        link.href = buildCompanyUrl(result);
        link.id = `${dropdownId}-result-${index}`;
        link.setAttribute('role', 'option');
        link.setAttribute('aria-selected', 'false');
        link.tabIndex = -1;

        const company = document.createElement('span');
        company.className = 'search-dropdown-company';
        company.textContent = result.companyName;

        const meta = document.createElement('span');
        meta.className = 'search-dropdown-meta';
        const companyCode = formatCompanyCode(result.companyCode);
        meta.textContent = companyCode ? `CVR: ${companyCode}` : 'Company profile';

        link.append(company, meta);
        return link;
    }

    function buildBuyResultButton(result, index, dropdownId) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'search-dropdown-link';
        button.id = `${dropdownId}-result-${index}`;
        button.setAttribute('role', 'option');
        button.setAttribute('aria-selected', 'false');
        button.tabIndex = -1;

        const companyCode = formatCompanyCode(result.companyCode);
        button.dataset.companyName = result.companyName;
        button.dataset.businessId = companyCode;
        button.dataset.fid = result.followedModelId;
        button.dataset.fiscalYear = result.fiscalYear || '';

        const company = document.createElement('span');
        company.className = 'search-dropdown-company';
        company.textContent = result.companyName;

        const meta = document.createElement('span');
        meta.className = 'search-dropdown-meta';
        meta.textContent = companyCode
            ? `CVR: ${companyCode} · Buy AI Credit Report — €3`
            : 'Buy AI Credit Report — €3';

        button.append(company, meta);

        button.addEventListener('click', () => {
            if (window.CRCheckout && typeof window.CRCheckout.open === 'function') {
                window.CRCheckout.open({
                    companyName: button.dataset.companyName,
                    businessId: button.dataset.businessId,
                    fid: button.dataset.fid,
                    fiscalYear: button.dataset.fiscalYear,
                });
            }
        });

        return button;
    }

    function getResultLinks(dropdown) {
        return Array.from(dropdown.querySelectorAll('.search-dropdown-link'));
    }

    function setExpanded(input, dropdown, isExpanded) {
        dropdown.hidden = !isExpanded;
        input.setAttribute('aria-expanded', String(isExpanded));
    }

    function clearDropdown(dropdown) {
        dropdown.replaceChildren();
    }

    function updateSelectedResult(dropdown, activeIndex) {
        getResultLinks(dropdown).forEach((link, index) => {
            const isSelected = index === activeIndex;
            link.setAttribute('aria-selected', String(isSelected));
            link.tabIndex = isSelected ? 0 : -1;
        });
    }

    function renderLoading(input, dropdown) {
        clearDropdown(dropdown);
        dropdown.appendChild(createLoadingNode());
        setExpanded(input, dropdown, true);
    }

    function renderMessage(input, dropdown, className, text) {
        clearDropdown(dropdown);
        dropdown.appendChild(createMessageNode(className, text));
        setExpanded(input, dropdown, true);
    }

    function renderResults(input, dropdown, state, results, isOrderMode) {
        clearDropdown(dropdown);
        state.activeResultIndex = -1;

        if (!results.length) {
            renderMessage(input, dropdown, 'search-dropdown-empty', 'No companies found');
            return;
        }

        const list = document.createElement('ul');
        list.className = 'search-dropdown-list';

        results.forEach((result, index) => {
            const item = document.createElement('li');
            item.className = 'search-dropdown-item';
            const resultEl = isOrderMode
                ? buildBuyResultButton(result, index, dropdown.id)
                : buildResultLink(result, index, dropdown.id);
            item.appendChild(resultEl);
            list.appendChild(item);
        });

        dropdown.appendChild(list);
        setExpanded(input, dropdown, true);
    }

    function closeDropdown(input, dropdown, state) {
        state.activeResultIndex = -1;
        updateSelectedResult(dropdown, state.activeResultIndex);
        setExpanded(input, dropdown, false);
    }

    function abortActiveRequest(state) {
        if (state.activeRequest) {
            state.activeRequest.abort();
            state.activeRequest = null;
        }
    }

    function clearPendingSearch(state) {
        if (state.debounceId) {
            window.clearTimeout(state.debounceId);
            state.debounceId = null;
        }
    }

    function focusResult(input, dropdown, state, index) {
        const links = getResultLinks(dropdown);
        if (!links.length) return;

        const clampedIndex = Math.max(0, Math.min(index, links.length - 1));
        state.activeResultIndex = clampedIndex;
        updateSelectedResult(dropdown, state.activeResultIndex);
        links[clampedIndex].focus();
    }

    function shouldRenderForCurrentFocus(form) {
        return form.contains(document.activeElement);
    }

    function scheduleSearch(form, input, dropdown, state, isOrderMode) {
        const query = input.value.trim();
        clearPendingSearch(state);
        abortActiveRequest(state);
        state.requestSeq += 1;

        if (query.length < MIN_QUERY_LENGTH) {
            state.latestResults = [];
            state.latestQuery = '';
            closeDropdown(input, dropdown, state);
            return;
        }

        renderLoading(input, dropdown);

        state.debounceId = window.setTimeout(async () => {
            const searchQuery = input.value.trim();
            if (searchQuery.length < MIN_QUERY_LENGTH) {
                closeDropdown(input, dropdown, state);
                return;
            }

            const requestId = state.requestSeq + 1;
            state.requestSeq = requestId;
            const controller = new AbortController();
            state.activeRequest = controller;

            try {
                const results = await fetchSearchResults(searchQuery, controller.signal);
                if (controller.signal.aborted || requestId !== state.requestSeq) return;

                state.latestQuery = searchQuery;
                state.latestResults = results.slice(0, MAX_RESULTS);
                if (shouldRenderForCurrentFocus(form)) {
                    renderResults(input, dropdown, state, state.latestResults, isOrderMode);
                }
            } catch (error) {
                if (controller.signal.aborted || requestId !== state.requestSeq) return;
                state.latestResults = [];
                state.latestQuery = '';
                if (shouldRenderForCurrentFocus(form)) {
                    renderMessage(
                        input,
                        dropdown,
                        'search-dropdown-error',
                        'Search is temporarily unavailable',
                    );
                }
            } finally {
                if (state.activeRequest === controller) {
                    state.activeRequest = null;
                }
            }
        }, SEARCH_DELAY);
    }

    function initSearchForm(form, index) {
        const input = form.querySelector('.search-input');
        if (!input) return;

        const isOrderMode = form.dataset.searchAction === 'order';

        const state = {
            debounceId: null,
            activeRequest: null,
            requestSeq: 0,
            activeResultIndex: -1,
            latestResults: [],
            latestQuery: '',
        };

        const dropdown = createSearchDropdown(`company-search-results-${index + 1}`);
        form.appendChild(dropdown);

        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('aria-haspopup', 'listbox');
        input.setAttribute('aria-controls', dropdown.id);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
        });

        form.addEventListener('focusout', () => {
            window.setTimeout(() => {
                if (!form.contains(document.activeElement)) {
                    closeDropdown(input, dropdown, state);
                }
            }, 120);
        });

        document.addEventListener('mousedown', (event) => {
            if (!form.contains(event.target)) {
                closeDropdown(input, dropdown, state);
            }
        });

        input.addEventListener('input', () => {
            scheduleSearch(form, input, dropdown, state, isOrderMode);
        });

        input.addEventListener('focus', () => {
            const query = input.value.trim();
            if (query.length < MIN_QUERY_LENGTH) {
                closeDropdown(input, dropdown, state);
                return;
            }

            if (state.latestQuery === query && state.latestResults.length) {
                renderResults(input, dropdown, state, state.latestResults, isOrderMode);
                return;
            }

            scheduleSearch(form, input, dropdown, state, isOrderMode);
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                return;
            }

            if (event.key === 'Escape') {
                closeDropdown(input, dropdown, state);
                return;
            }

            if (event.key === 'ArrowDown' && state.latestResults.length) {
                event.preventDefault();
                if (dropdown.hidden) {
                    renderResults(input, dropdown, state, state.latestResults, isOrderMode);
                }
                focusResult(input, dropdown, state, 0);
            }
        });

        dropdown.addEventListener('keydown', (event) => {
            const links = getResultLinks(dropdown);
            if (!links.length) return;

            if (event.key === 'Escape') {
                event.preventDefault();
                closeDropdown(input, dropdown, state);
                input.focus();
                return;
            }

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                focusResult(input, dropdown, state, state.activeResultIndex + 1);
                return;
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (state.activeResultIndex <= 0) {
                    state.activeResultIndex = -1;
                    updateSelectedResult(dropdown, state.activeResultIndex);
                    input.focus();
                    return;
                }
                focusResult(input, dropdown, state, state.activeResultIndex - 1);
                return;
            }

            if (event.key === 'Home') {
                event.preventDefault();
                focusResult(input, dropdown, state, 0);
                return;
            }

            if (event.key === 'End') {
                event.preventDefault();
                focusResult(input, dropdown, state, links.length - 1);
            }
        });
    }

    function initSearchBars() {
        document.querySelectorAll('.search-bar-form').forEach(initSearchForm);
    }

    if (typeof document !== 'undefined') {
        document.addEventListener('DOMContentLoaded', initSearchBars);
    }

    const root = typeof window !== 'undefined' ? window : globalThis;
    root.CRSearch = {
        handleCompanySearch,
        fetchSearchResults,
        normalizeSearchResponse,
        buildSearchQuery,
    };
})();
