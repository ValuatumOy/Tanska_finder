/* =====================================================
   CREDITREPORTS.DK — AI Credit Report checkout
   Confirmation modal + Stripe Checkout session creation for
   the on-site "buy AI Credit Report" search flow.
===================================================== */

(function () {
    'use strict';

    const REPORT_TYPE = 'dk_ai_credit_risk';
    const LANG = 'en';

    function init() {
        const overlay = document.getElementById('orderModalOverlay');
        const modal = document.getElementById('orderConfirmModal');
        const closeBtn = document.getElementById('orderConfirmClose');
        const submitBtn = document.getElementById('orderConfirmSubmit');
        const companyEl = document.getElementById('orderConfirmCompany');
        const errorEl = document.getElementById('orderConfirmError');

        if (!overlay || !modal || !submitBtn) return;

        let current = null;
        let submitting = false;
        let lastFocused = null;
        const defaultLabel = submitBtn.textContent;

        function hideError() {
            if (!errorEl) return;
            errorEl.hidden = true;
            errorEl.textContent = '';
        }

        function showError(message) {
            if (!errorEl) return;
            errorEl.textContent = message;
            errorEl.hidden = false;
        }

        function setSubmitting(isSubmitting) {
            submitting = isSubmitting;
            submitBtn.disabled = isSubmitting;
            submitBtn.textContent = isSubmitting ? 'Processing…' : defaultLabel;
        }

        function open(details) {
            current = details || {};
            if (companyEl) companyEl.textContent = current.companyName || 'Selected company';
            hideError();
            setSubmitting(false);
            lastFocused = document.activeElement;
            overlay.classList.add('open');
            modal.classList.add('open');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            window.setTimeout(() => modal.focus(), 60);
        }

        function close() {
            if (submitting) return;
            overlay.classList.remove('open');
            modal.classList.remove('open');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lastFocused instanceof HTMLElement) lastFocused.focus();
        }

        function startCheckout() {
            if (submitting || !current) return;
            setSubmitting(true);
            hideError();

            const payload = {
                reportType: REPORT_TYPE,
                fid: current.fid || '',
                businessId: current.businessId || '',
                companyName: current.companyName || '',
                lang: LANG,
                cancelPath: window.location.pathname,
            };

            fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload),
            })
                .then((res) => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.json();
                })
                .then((data) => {
                    if (!data || !data.url) throw new Error('No checkout URL returned');
                    window.location.href = data.url;
                })
                .catch((err) => {
                    console.error('create-checkout failed', err);
                    setSubmitting(false);
                    showError('Something went wrong starting the payment. Please try again in a moment.');
                });
        }

        overlay.addEventListener('click', close);
        if (closeBtn) closeBtn.addEventListener('click', close);
        submitBtn.addEventListener('click', startCheckout);

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('open')) close();
        });

        // Returning via the back button from Stripe can restore the page from
        // bfcache with submitting still true — reset to a clean state.
        window.addEventListener('pageshow', (event) => {
            if (!event.persisted) return;
            setSubmitting(false);
        });

        window.CRCheckout = { open };
    }

    document.addEventListener('DOMContentLoaded', init);
})();
