/* =====================================================
   CREDITREPORTS.DK — Order Modal
   Integration-ready placeholder for Stripe checkout.
   Wire handleAiCreditReportOrder / handleStandardCreditRiskReportOrder
   to real backend endpoints when ready.
===================================================== */

(function () {
  'use strict';

  // ── Config ─────────────────────────────────────────
  const AI_CREDIT_REPORT_PRICE_DKK = '€3';

  const SAMPLE_REPORT_URL = '/sample-reports/ai-credit-report-sample.pdf';

  // ── Placeholder handlers ────────────────────────────
  // Replace these with real implementations when backend is connected.

  /**
   * @param {Object} formData
   * @param {string} formData.companyName
   * @param {string} formData.companyId
   * @param {string} formData.email
   * @param {string} formData.billingEmail
   * @param {string} formData.message
   */
  function handleAiCreditReportOrder(formData) {
    // TODO: Connect to Stripe checkout or backend order endpoint
    console.log('[PLACEHOLDER] handleAiCreditReportOrder', formData);
    // redirectToStripeCheckout(formData);
  }

  /**
   * @param {Object} formData
   */
  function handleStandardCreditRiskReportOrder(formData) {
    // TODO: Connect to order processing backend
    console.log('[PLACEHOLDER] handleStandardCreditRiskReportOrder', formData);
  }

  /**
   * @param {Object} formData
   */
  function redirectToStripeCheckout(formData) {
    // TODO: Implement Stripe checkout redirect
    // Example: fetch('/api/create-checkout-session', { method: 'POST', body: JSON.stringify(formData) })
    //   .then(r => r.json()).then(d => window.location.href = d.url);
    console.log('[PLACEHOLDER] redirectToStripeCheckout', formData);
  }

  // ── Modal class ─────────────────────────────────────
  class OrderModal {
    constructor() {
      this.overlay   = document.getElementById('modalOverlay');
      this.container = document.getElementById('orderModal');
      this.form      = document.getElementById('orderForm');
      this.currentType = null;

      if (!this.overlay || !this.container) return;
      this._bind();
    }

    _bind() {
      // Close on overlay click
      this.overlay.addEventListener('click', () => this.close());

      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.container.classList.contains('open')) this.close();
      });

      // Close button
      const closeBtn = this.container.querySelector('.modal-close');
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());

      // Form submit
      if (this.form) {
        this.form.addEventListener('submit', (e) => {
          e.preventDefault();
          this._handleSubmit();
        });
      }

      // Trigger buttons — any element with data-order-type attribute
      document.querySelectorAll('[data-order-type]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const type        = btn.getAttribute('data-order-type');
          const companyName = btn.getAttribute('data-company-name') || '';
          const companyId   = btn.getAttribute('data-company-id')   || '';
          this.open(type, companyName, companyId);
        });
      });
    }

    /**
     * @param {'ai-credit-report'|'standard-credit-risk-report'} type
     * @param {string} companyName
     * @param {string} companyId
     */
    open(type, companyName = '', companyId = '') {
      this.currentType = type;

      const isAI = type === 'ai-credit-report';

      // Update modal content
      const title  = this.container.querySelector('#modalTitle');
      const price  = this.container.querySelector('#modalPrice');
      const submit = this.container.querySelector('#modalSubmit');
      const badge  = this.container.querySelector('#modalBadge');

      if (title)  title.textContent  = isAI ? 'Order AI Credit Report' : 'Order Credit Risk Report';
      if (price)  price.textContent  = isAI ? `${AI_CREDIT_REPORT_PRICE_DKK} DKK / report` : 'See pricing page';
      if (submit) submit.textContent = isAI ? 'Continue to payment' : 'Order report';
      if (badge) {
        badge.textContent = isAI ? 'AI Credit Report' : 'Credit Risk Report';
        badge.className = `badge ${isAI ? 'badge--blue' : 'badge--ai'}`;
      }

      // Pre-fill company fields
      const nameInput = this.container.querySelector('#modalCompanyName');
      const idInput   = this.container.querySelector('#modalCompanyId');
      if (nameInput && companyName) nameInput.value = companyName;
      if (idInput   && companyId)   idInput.value   = companyId;

      // Show
      this.overlay.classList.add('open');
      this.container.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Trap focus on first input
      setTimeout(() => {
        const first = this.container.querySelector('input:not([disabled])');
        if (first) first.focus();
      }, 80);
    }

    close() {
      this.overlay.classList.remove('open');
      this.container.classList.remove('open');
      document.body.style.overflow = '';
      this.currentType = null;

      // Reset form
      if (this.form) this.form.reset();

      // Reset submit button
      const submit = this.container.querySelector('#modalSubmit');
      if (submit) {
        submit.disabled = false;
        submit.textContent = 'Continue to payment';
      }
    }

    _collectFormData() {
      return {
        type:         this.currentType,
        companyName:  this.container.querySelector('#modalCompanyName')?.value ?? '',
        companyId:    this.container.querySelector('#modalCompanyId')?.value   ?? '',
        email:        this.container.querySelector('#modalEmail')?.value        ?? '',
        billingEmail: this.container.querySelector('#modalBillingEmail')?.value ?? '',
        message:      this.container.querySelector('#modalMessage')?.value      ?? '',
      };
    }

    _handleSubmit() {
      const data = this._collectFormData();
      const submit = this.container.querySelector('#modalSubmit');

      // Basic validation
      if (!data.email) {
        const emailInput = this.container.querySelector('#modalEmail');
        if (emailInput) emailInput.focus();
        return;
      }

      // Show loading state
      if (submit) {
        submit.disabled    = true;
        submit.textContent = 'Processing…';
      }

      // Route to appropriate placeholder handler
      if (this.currentType === 'ai-credit-report') {
        handleAiCreditReportOrder(data);
      } else {
        handleStandardCreditRiskReportOrder(data);
      }
    }
  }

  // ── Init ────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    new OrderModal();
  });

  // ── Expose globals for inline onclick usage ─────────
  window.CRModal = {
    AI_CREDIT_REPORT_PRICE_DKK,
    SAMPLE_REPORT_URL,
    handleAiCreditReportOrder,
    handleStandardCreditRiskReportOrder,
    redirectToStripeCheckout,
  };

})();
