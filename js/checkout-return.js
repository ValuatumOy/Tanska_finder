/* Verify captured payment before confirming or measuring a purchase. */
(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');
  const title = document.querySelector('[data-checkout-title]');
  const message = document.querySelector('[data-checkout-message]');
  const panel = document.querySelector('[data-checkout-status]');
  const danish = window.location.pathname.startsWith('/da/');
  let summary = null;
  let emitted = false;
  let attempts = 0;
  const deadline = Date.now() + 32 * 60 * 1000;

  function status(heading, text) {
    if (panel) panel.hidden = false;
    if (title) title.textContent = heading;
    if (message) message.textContent = text;
  }

  function trackPurchase() {
    if (emitted || !summary || !summary.paid || summary.livemode !== true ||
        summary.internalTest !== false || !window.CRAnalytics?.isEnabled() ||
        typeof window.gtag !== 'function') return;
    const key = 'report_purchase_tracked:' + summary.transactionId;
    try {
      if (localStorage.getItem(key) === '1') return;
    } catch (_) { /* GA also deduplicates by transaction_id. */ }

    const value = (summary.amountTotal - summary.taxTotal - summary.shippingTotal) / 100;
    try {
      window.gtag('event', 'purchase', {
        transaction_id: summary.transactionId,
        value,
        currency: summary.currency,
        tax: summary.taxTotal / 100,
        shipping: summary.shippingTotal / 100,
        report_type: summary.reportType,
        report_lang: summary.reportLang,
        items: [{ item_id: summary.reportType, item_name: summary.reportType, price: value, quantity: 1 }],
      });
      window.gtag('event', 'ai_report_purchase_success', {
        transaction_id: summary.transactionId,
        report_type: summary.reportType,
        report_lang: summary.reportLang,
        value: summary.amountTotal / 100,
        currency: summary.currency,
      });
    } catch (_) { return; }
    emitted = true;
    try { localStorage.setItem(key, '1'); } catch (_) { /* no persistence */ }
  }

  function validSummary(data) {
    if (!data || typeof data.paid !== 'boolean' || typeof data.pending !== 'boolean') return false;
    if (!data.paid) return true;
    return data.transactionId === sessionId &&
      Number.isInteger(data.amountTotal) && data.amountTotal > 0 &&
      Number.isInteger(data.taxTotal) && data.taxTotal >= 0 &&
      Number.isInteger(data.shippingTotal) && data.shippingTotal >= 0 &&
      data.taxTotal + data.shippingTotal <= data.amountTotal &&
      data.currency === 'EUR' && typeof data.reportType === 'string';
  }

  async function verify() {
    attempts += 1;
    try {
      const response = await fetch('/api/checkout-summary?session_id=' + encodeURIComponent(sessionId), { cache: 'no-store' });
      if (!response.ok) throw new Error('Payment verification unavailable');
      const data = await response.json();
      if (!validSummary(data)) throw new Error('Invalid payment summary');
      summary = data;
      if (data.paid) {
        const next = document.querySelector('[data-checkout-next]');
        if (next) next.hidden = false;
        status(danish ? 'Betaling bekræftet' : 'Payment confirmed', danish
          ? 'Rapporten sendes til den e-mailadresse, du angav hos Stripe. Kontakt info@creditreports.dk, hvis du har spørgsmål.'
          : 'Your report is sent to the email address you entered at Stripe. Contact info@creditreports.dk if you have any questions.');
        trackPurchase();
        return;
      }
      if (!data.pending) {
        status(danish ? 'Betaling er ikke bekræftet' : 'Payment is not confirmed', danish
          ? 'Kontakt info@creditreports.dk, hvis du har gennemført bestillingen. Tjek status, før du bestiller igen.'
          : 'Contact info@creditreports.dk if you completed checkout. Check the status before placing another order.');
        return;
      }
      status(danish ? 'Betaling afventer' : 'Payment pending', danish
        ? 'Vi afventer bekræftelse af betalingen. En reservation på dit kort er ikke en gennemført betaling. Lad siden stå åben for at tjekke igen.'
        : 'We are waiting for payment confirmation. A card authorization is not a completed payment. Keep this page open to check again.');
    } catch (_) {
      status(danish ? 'Betaling kunne ikke bekræftes' : 'Payment could not be confirmed', danish
        ? 'Kontakt info@creditreports.dk, hvis du har gennemført betalingen. Bestil ikke igen, før status er afklaret.'
        : 'Contact info@creditreports.dk if you completed checkout. Please check the status before placing another order.');
    }
    if (attempts < 33 && Date.now() < deadline) window.setTimeout(verify, Math.min(60000, deadline - Date.now()));
    else status(danish ? 'Betaling afventer stadig' : 'Payment still pending', danish
      ? 'Automatisk tjek er afsluttet. Genindlæs siden for at tjekke igen, eller kontakt info@creditreports.dk, før du bestiller igen.'
      : 'Automatic checking has stopped. Reload to check again, or contact info@creditreports.dk before placing another order.');
  }

  window.addEventListener('creditreports:analytics-ready', trackPurchase);
  if (!sessionId) {
    if (window.location.pathname.includes('/thankyou/')) status(danish ? 'Ingen betaling at bekræfte' : 'No payment to confirm', danish
      ? 'Brug linket fra Stripe eller kontakt info@creditreports.dk for hjælp med din ordre.'
      : 'Use the return link from Stripe or contact info@creditreports.dk for help with your order.');
    return;
  }
  status(danish ? 'Tjekker betaling…' : 'Checking payment…', danish
    ? 'Vi tjekker betalingsstatus hos Stripe. Bestil ikke igen, mens vi bekræfter din ordre.'
    : 'We are checking the payment status with Stripe. Please wait before placing another order.');
  verify();
})();
