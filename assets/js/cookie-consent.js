(function () {
  var CONSENT_KEY = 'rs_analytics_consent';
  var CONSENT_VALUE = 'granted';
  var DENIAL_VALUE = 'denied';
  var BANNER_ID = 'rs-cookie-banner';

  function getConsent() {
    var match = document.cookie.match(new RegExp('(?:^|; )' + CONSENT_KEY + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function setConsent(value) {
    var expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    document.cookie = CONSENT_KEY + '=' + value + '; expires=' + expiry.toUTCString() + '; path=/; SameSite=Lax';
  }

  function loadAnalytics() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-8XFFYQRQDJ';
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-8XFFYQRQDJ', { anonymize_ip: true });
  }

  function removeBanner() {
    var banner = document.getElementById(BANNER_ID);
    if (banner) banner.remove();
  }

  function accept() {
    setConsent(CONSENT_VALUE);
    loadAnalytics();
    removeBanner();
  }

  function decline() {
    setConsent(DENIAL_VALUE);
    removeBanner();
  }

  function showBanner() {
    var banner = document.createElement('div');
    banner.id = BANNER_ID;
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<div class="rs-cookie-inner">' +
        '<p>We use cookies to analyse website traffic using Google Analytics. ' +
        'No cookies are set without your consent. ' +
        '<a href="/privacy/index.html">Read our Cookie Policy</a>.</p>' +
        '<div class="rs-cookie-buttons">' +
          '<button id="rs-cookie-accept" class="btn btn-primary btn-sm">Accept analytics cookies</button>' +
          '<button id="rs-cookie-decline" class="btn btn-outline-secondary btn-sm">Decline</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);
    document.getElementById('rs-cookie-accept').addEventListener('click', accept);
    document.getElementById('rs-cookie-decline').addEventListener('click', decline);
  }

  // On page load - check existing consent
  var existing = getConsent();
  if (existing === CONSENT_VALUE) {
    loadAnalytics();
  } else if (!existing) {
    // No decision yet - show banner
    document.addEventListener('DOMContentLoaded', showBanner);
  }
  // If DENIAL_VALUE - do nothing, no banner, no analytics

})();