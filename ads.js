(() => {
  'use strict';

  // Keep the public homepage aligned with the official-source editorial policy.
  // This also protects the deployed homepage when the static index cannot be replaced directly.
  if (location.pathname === '/' || location.pathname === '') {
    document.title = 'Bigg Boss India Today — Official Updates';
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', 'Bigg Boss India updates today, August 18, 2026: official announcements, selection updates and confirmed information across six editions.');

    const intro = document.querySelector('.intro');
    if (intro) intro.textContent = 'Official announcements, selection updates and confirmed information. Unverified contestant rumours are intentionally excluded.';

    const cards = Array.from(document.querySelectorAll('.cards .card'));
    const updates = [
      ['Agnipariksha 2 selection is underway', '<strong>JioStar official terms confirm the Agnipariksha 2 commoner-selection route.</strong> No contestant name is treated as confirmed without an official announcement.', 'See official Telugu status →'],
      ['Official contestant confirmation pending', 'Reported names are excluded until an official broadcaster or JioStar announcement is available.', 'See official-source policy →'],
      ['Official contestant confirmation pending', 'Only broadcaster/platform-confirmed names will be published as confirmed.', 'See Tamil status →'],
      ['Official contestant confirmation pending', 'Media reports and social-media rumours are excluded from the confirmed list.', 'See Kannada status →'],
      ['Official contestant confirmation pending', 'Only official broadcaster/platform announcements will be treated as confirmed.', 'See Hindi status →'],
      ['Sourav Ganguly hosting announcement is official', '<strong>Star Jalsha officially announced Sourav Ganguly to lead Bigg Boss Bangla.</strong> The contestant list remains pending official confirmation.', 'See Bangla status →']
    ];
    cards.forEach((card, i) => {
      const h2 = card.querySelector('h2');
      const p = card.querySelector('p');
      const read = card.querySelector('.read');
      if (h2 && updates[i]) h2.textContent = updates[i][0];
      if (p && updates[i]) p.innerHTML = updates[i][1];
      if (read && updates[i]) read.textContent = updates[i][2];
    });

    const status = Array.from(document.querySelectorAll('.status-grid .status-card'));
    const statusText = [
      ['Agnipariksha 2 — official selection route; contestant list pending', 'OFFICIAL'],
      ['No contestant names published as confirmed without official confirmation', 'PENDING'],
      ['No contestant names published as confirmed without official confirmation', 'PENDING'],
      ['No contestant names published as confirmed without official confirmation', 'PENDING'],
      ['No contestant names published as confirmed without official confirmation', 'PENDING'],
      ['Sourav Ganguly — official host announcement', 'OFFICIAL']
    ];
    status.forEach((card, i) => {
      const spans = card.querySelectorAll('span');
      if (spans[0] && statusText[i]) spans[0].textContent = statusText[i][0];
      if (spans[1] && statusText[i]) spans[1].textContent = statusText[i][1];
    });

    const note = document.querySelector('.status');
    if (note) note.innerHTML = '<strong>Editorial rule:</strong> We do not convert media reports, social posts or rumours into confirmed contestant entries. Names are added only after an official broadcaster/platform or JioStar announcement.';

    const sourceNote = document.querySelector('.source-note');
    if (sourceNote) sourceNote.innerHTML = '<strong>Last updated:</strong> August 18, 2026. Official-source updates only.';

    const faq = document.querySelector('.faq');
    if (faq) faq.innerHTML = '<details><summary>Why was Uppal Balu removed?</summary><p>His name was removed because this site now publishes contestant information only when supported by an official broadcaster/platform or official JioStar material.</p></details><details><summary>Are media-reported contestant lists shown?</summary><p>No. They are intentionally excluded until the makers publish them officially.</p></details><details><summary>Where should I check for new names?</summary><p>Open the relevant edition page. Names will be added only when official-source confirmation becomes available.</p></details>';
  }

  const desktop={key:'9d555c793875e3095248cf45d3085138',width:728,height:90};
  const mobile={key:'d35ee6a7d7ffd21d33f108439621e9cd',width:300,height:250};
  const socialBarSrc='https://pl30872198.effectivecpmnetwork.com/d2/c0/0d/d2c00d8f38a2aa73c72ed31c514b0c56.js';
  const host=document.querySelector('[data-bigg-banner]');
  if(!host||host.dataset.bannerLoaded==='1')return;
  host.dataset.bannerLoaded='1';
  const ad=matchMedia('(min-width:760px)').matches?desktop:mobile;
  const label=document.createElement('span');
  label.className='ad-slot-label';
  label.textContent='Advertisement · '+ad.width+'×'+ad.height;
  const frame=document.createElement('iframe');
  frame.title='Advertisement';
  frame.width=String(ad.width);
  frame.height=String(ad.height);
  frame.loading='eager';
  frame.style.cssText='display:block;width:'+ad.width+'px;max-width:100%;height:'+ad.height+'px;margin:8px auto 0;border:0;overflow:hidden';
  frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation');
  frame.setAttribute('referrerpolicy','no-referrer-when-downgrade');
  frame.srcdoc='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body><script>atOptions={key:"'+ad.key+'",format:"iframe",height:'+ad.height+',width:'+ad.width+',params:{}};<\/script><script src="https://www.highperformanceformat.com/'+ad.key+'/invoke.js"><\/script></body></html>';
  const nativeLabel=document.createElement('span');
  nativeLabel.className='ad-slot-label';
  nativeLabel.textContent='Sponsored recommendations';
  const nativeFrame=document.createElement('iframe');
  nativeFrame.title='Sponsored recommendations';
  nativeFrame.width='100%';
  nativeFrame.height='280';
  nativeFrame.loading='lazy';
  nativeFrame.style.cssText='display:block;width:100%;max-width:760px;height:280px;margin:20px auto 0;border:0;overflow:hidden';
  nativeFrame.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation');
  nativeFrame.setAttribute('referrerpolicy','no-referrer-when-downgrade');
  nativeFrame.srcdoc='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;overflow:auto;background:transparent}</style></head><body><script async data-cfasync="false" src="https://pl30872199.effectivecpmnetwork.com/b842cc6cf0a32d0bed447bdd2ce85a04/invoke.js"><\/script><div id="container-b842cc6cf0a32d0bed447bdd2ce85a04"></div></body></html>';
  const smartLabel=document.createElement('span');
  smartLabel.className='ad-slot-label';
  smartLabel.textContent='More sponsored offers';
  const smartLink=document.createElement('a');
  smartLink.href='https://www.effectivecpmnetwork.com/d5zrph93k4?key=ad5a5c3a9a17913680e1e0df6dc163dc';
  smartLink.rel='sponsored nofollow noopener';
  smartLink.target='_blank';
  smartLink.textContent='Open sponsored offer';
  smartLink.style.cssText='display:inline-block;margin:16px auto 4px;padding:10px 18px;border-radius:999px;background:#fff;color:#111;font-weight:700;text-decoration:none';
  const socialLabel=document.createElement('span');
  socialLabel.className='ad-slot-label';
  socialLabel.textContent='Sponsored social bar';
  const socialFrame=document.createElement('iframe');
  socialFrame.title='Sponsored social bar';
  socialFrame.width='100%';
  socialFrame.height='140';
  socialFrame.loading='lazy';
  socialFrame.style.cssText='display:block;width:100%;max-width:760px;height:140px;margin:20px auto 0;border:0;overflow:hidden';
  socialFrame.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation');
  socialFrame.setAttribute('referrerpolicy','no-referrer-when-downgrade');
  socialFrame.srcdoc='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;min-height:120px;overflow:hidden;background:transparent}</style></head><body><script src="'+socialBarSrc+'"><\/script></body></html>';
  host.replaceChildren(label,frame,nativeLabel,nativeFrame,socialLabel,socialFrame,smartLabel,smartLink);
})();
