/* Consent-aware GA4 loading and shared acquisition events. */
(function () {
  "use strict";

  const MEASUREMENT_ID = "G-W3625Y8D4S";
  const CONSENT_KEY = "creditreports_analytics_consent";
  const AI_REFERRERS = {
    "chatgpt.com": "chatgpt",
    "chat.openai.com": "chatgpt",
    "perplexity.ai": "perplexity",
    "www.perplexity.ai": "perplexity",
    "claude.ai": "claude",
    "gemini.google.com": "gemini",
    "copilot.microsoft.com": "copilot",
  };

  let loaded = false;

  function currentConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (_) {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (_) {
      /* no persistence */
    }
  }

  function aiReferrer() {
    if (!document.referrer) return null;
    try {
      return (
        AI_REFERRERS[new URL(document.referrer).hostname.toLowerCase()] || null
      );
    } catch (_) {
      return null;
    }
  }

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, {
      cookie_flags: "SameSite=None;Secure",
      send_page_view: true,
    });

    const source = aiReferrer();
    if (source) {
      window.gtag("event", "ai_referral_session", {
        ai_referrer: source,
        traffic_source_group: "ai_assistant",
      });
    }
  }

  function consentBanner() {
    const danish = window.location.pathname.startsWith("/da/");
    const banner = document.createElement("aside");
    banner.className = "analytics-consent";
    banner.setAttribute(
      "aria-label",
      danish ? "Indstillinger for analyse" : "Analytics settings",
    );
    banner.innerHTML = `<p>${
      danish
        ? 'Vi bruger analyse-cookies til at måle, hvilke sider og søgninger der hjælper brugerne. <a href="/da/privacy-policy/">Læs mere</a>.'
        : 'We use analytics cookies to measure which pages and searches help users. <a href="/en/privacy-policy/">Learn more</a>.'
    }</p><div class="analytics-consent-actions"><button type="button" class="analytics-consent-reject">${danish ? "Afvis" : "Reject"}</button><button type="button" class="analytics-consent-accept">${danish ? "Accepter" : "Accept"}</button></div>`;

    banner
      .querySelector(".analytics-consent-reject")
      .addEventListener("click", () => {
        saveConsent("denied");
        banner.hidden = true;
      });
    banner
      .querySelector(".analytics-consent-accept")
      .addEventListener("click", () => {
        saveConsent("granted");
        banner.hidden = true;
        loadAnalytics();
      });
    document.body.appendChild(banner);
  }

  const consent = currentConsent();
  if (consent === "granted") loadAnalytics();
  else if (consent !== "denied") {
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", consentBanner);
    else consentBanner();
  }
})();
