(() => {
  'use strict';
  const params = new URLSearchParams(window.location.search);
  const sources = ['instagram', 'youtube', 'tiktok', 'website'];
  const source = sources.includes(params.get('utm_source')) ? params.get('utm_source') : 'website';
  const candidate = params.get('utm_campaign') || '';
  const campaign = /^(?:(ig|yt|tt)_reading_[0-9]{2}|story_quiz_pilot_202610)$/.test(candidate) ? candidate : 'website_reading';
  const medium = source === 'website' ? 'referral' : 'organic_social';
  const allowedContent = ['profile', 'mountains_hiking_01'];
  const content = allowedContent.includes(params.get('utm_content')) ? params.get('utm_content') : null;
  const locale = document.documentElement.lang;
  // Local integration hook only. No analytics provider, cookies or network requests.
  const event = (name, extra) => window.dispatchEvent(new CustomEvent('litoo_growth', {
    detail: { event: name, source, medium, campaign, ...(content ? {content} : {}), locale, ...extra },
  }));

  document.querySelectorAll('[data-store]').forEach(link => {
    if (link.dataset.store === 'android') {
      const url = new URL(link.href);
      url.searchParams.set('hl', locale);
      url.searchParams.set('utm_source', source);
      url.searchParams.set('utm_medium', medium);
      url.searchParams.set('utm_campaign', campaign);
      if (content) url.searchParams.set('utm_content', content);
      else url.searchParams.delete('utm_content');
      // Google Play Install Referrer receives the campaign inside `referrer`.
      // Top-level UTM parameters alone do not provide that install payload.
      const referrer = new URLSearchParams({utm_source: source, utm_medium: medium, utm_campaign: campaign});
      if (content) referrer.set('utm_content', content);
      url.searchParams.set('referrer', referrer.toString());
      link.href = url.toString();
    }
    // Generated in this app's App Store Connect campaign builder on 2026-10-23.
    const appleCampaigns = {instagram: 'ig_story_quiz_202610', youtube: 'yt_story_quiz_202610'};
    if (link.dataset.store === 'ios' && campaign === 'story_quiz_pilot_202610' && appleCampaigns[source]) {
      const url = new URL('https://apps.apple.com/app/apple-store/id6742233378');
      url.searchParams.set('pt', '127604962');
      url.searchParams.set('ct', appleCampaigns[source]);
      url.searchParams.set('mt', '8');
      link.href = url.toString();
    }
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
    url.searchParams.set('utm_medium', medium);
    if (content) url.searchParams.set('utm_content', content);
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
