(() => {
  'use strict';
  const desktop = { key: '9d555c793875e3095248cf45d3085138', width: 728, height: 90, src: 'https://www.highperformanceformat.com/9d555c793875e3095248cf45d3085138/invoke.js' };
  const mobile = { key: 'd35ee6a7d7ffd21d33f108439621e9cd', width: 300, height: 250, src: 'https://www.highperformanceformat.com/d35ee6a7d7ffd21d33f108439621e9cd/invoke.js' };
  const host = document.querySelector('[data-bigg-banner]');
  if (!host) return;
  const ad = matchMedia('(min-width:760px)').matches ? desktop : mobile;
  host.innerHTML = '<span class="ad-slot-label">Advertisement · ' + ad.width + '×' + ad.height + '</span><div class="banner-frame" style="max-width:100%;overflow:hidden;text-align:center;min-height:' + ad.height + 'px"></div>';
  window.atOptions = { key: ad.key, format: 'iframe', height: ad.height, width: ad.width, params: {} };
  const script = document.createElement('script');
  script.src = ad.src;
  script.onload = script.onerror = () => { delete window.atOptions; };
  host.querySelector('.banner-frame').appendChild(script);
})();
