(() => {
  'use strict';
  const ua = navigator.userAgent || '';
  // iPadOS can identify itself as a Mac when requesting desktop websites.
  const isIOS = /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const platform = /Android/i.test(ua) ? 'android' : isIOS ? 'ios' : null;
  if (!platform) return;

  const link = document.querySelector(`[data-store="${platform}"]`);
  if (!link) return;
  document.getElementById('store-status').textContent =
    `${platform === 'ios' ? 'App Store’a' : 'Google Play’e'} yönlendiriliyorsun. Mağaza açılmazsa aşağıdaki butona dokun.`;
  // growth.js runs first, so Android keeps the existing allowlisted campaign tags.
  // Destinations come only from the fixed store links, never from URL parameters.
  window.location.replace(link.href);
})();
