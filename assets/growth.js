(() => {
  'use strict';
  const params = new URLSearchParams(window.location.search);
  const sources = ['instagram', 'youtube', 'tiktok', 'website'];
  const source = sources.includes(params.get('utm_source')) ? params.get('utm_source') : 'website';
  const candidate = params.get('utm_campaign') || '';
  const campaign = /^(ig|yt|tt)_reading_[0-9]{2}$/.test(candidate) ? candidate : 'website_reading';
  const medium = source === 'website' ? 'referral' : 'organic_social';
  const locale = document.documentElement.lang;
  // Local integration hook only. No analytics provider, cookies or network requests.
  const event = (name, extra) => window.dispatchEvent(new CustomEvent('litoo_growth', {
    detail: { event: name, source, medium, campaign, locale, ...extra },
  }));

  document.querySelectorAll('[data-store]').forEach(link => {
    if (link.dataset.store === 'android') {
      const url = new URL(link.href);
      url.searchParams.set('hl', locale);
      url.searchParams.set('utm_source', source);
      url.searchParams.set('utm_medium', medium);
      url.searchParams.set('utm_campaign', campaign);
      link.href = url.toString();
    }
    // iOS campaign parameters must come from App Store Connect, never invented.
    link.addEventListener('click', () => event('store_click', {
      platform: link.dataset.store, placement: link.dataset.placement,
    }));
  });

  // Keep the same allowlisted campaign when the visitor switches language.
  document.querySelectorAll('[data-locale]').forEach(link => {
    if (source === 'website') return;
    const url = new URL(link.href);
    url.searchParams.set('utm_source', source);
    url.searchParams.set('utm_campaign', campaign);
    link.href = url.toString();
  });

  const word = document.getElementById('demo-word');
  const meaning = document.getElementById('demo-meaning');
  if (word && meaning) word.addEventListener('click', () => {
    const expanded = word.getAttribute('aria-expanded') !== 'true';
    word.setAttribute('aria-expanded', String(expanded));
    meaning.hidden = !expanded;
    if (expanded) event('demo_word_open', { word: 'little' });
  });
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
