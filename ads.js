(() => {
  'use strict';

  function addPopularSearchTopics(){
    if(document.querySelector('[data-bigg-popular-searches]'))return;
    const path=location.pathname;
    let edition='Bigg Boss India';
    let links=[
      ['Bigg Boss Telugu 10','/topics/telugu-10-agnipariksha-2/'],
      ['Bigg Boss Telugu 10 voting','/topics/telugu-10-voting/'],
      ['Bigg Boss Hindi 20','/topics/hindi-20/'],
      ['Bigg Boss Tamil 10','/topics/tamil-10-common-man/'],
      ['Bigg Boss Kannada 13','/topics/kannada-13-agnipariksha/'],
      ['Bigg Boss Malayalam 8','/topics/malayalam-8-agnipareeksha/'],
      ['Bigg Boss Bangla 3','/topics/bangla/']
    ];
    let topics=['premiere date and time','official contestants','host and channel','JioHotstar streaming','voting and nominations','eviction or elimination updates','latest official updates'];
    if(path.includes('telugu-10')){
      edition='Bigg Boss Telugu 10';
      links=[['Telugu 10 release & Agnipariksha 2','/topics/telugu-10-agnipariksha-2/'],['Telugu 10 official voting status','/topics/telugu-10-voting/'],['All Bigg Boss India editions','/']];
      topics=['Bigg Boss Telugu 10 premiere date','Bigg Boss Telugu 10 contestants','Bigg Boss Telugu 10 voting','Nagarjuna host updates','Star Maa and JioHotstar','Agnipariksha 2 commoners','nominations and eviction updates'];
    }else if(path.includes('hindi-20')){
      edition='Bigg Boss Hindi 20';
      topics=['Bigg Boss 20 premiere date','Bigg Boss 20 contestants','Bigg Boss 20 voting','Salman Khan host updates','Colors TV and JioHotstar','nominations and eviction','winner and live updates'];
      links=[['Bigg Boss Hindi 20 official status','/topics/hindi-20/'],['All Bigg Boss India editions','/']];
    }else if(path.includes('tamil-10')){
      edition='Bigg Boss Tamil 10';
      topics=['Bigg Boss Tamil 10 premiere date','Bigg Boss Tamil 10 contestants','Bigg Boss Tamil 10 voting','Vijay Sethupathi host updates','JioHotstar streaming','nominations and elimination','latest official updates'];
      links=[['Bigg Boss Tamil 10 official status','/topics/tamil-10-common-man/'],['All Bigg Boss India editions','/']];
    }else if(path.includes('kannada-13')){
      edition='Bigg Boss Kannada 13';
      topics=['Bigg Boss Kannada 13 premiere date','Bigg Boss Kannada 13 contestants','Bigg Boss Kannada 13 voting','Kichcha Sudeepa host updates','JioHotstar streaming','nominations and eviction','latest official updates'];
      links=[['Bigg Boss Kannada 13 official status','/topics/kannada-13-agnipariksha/'],['All Bigg Boss India editions','/']];
    }else if(path.includes('malayalam-8')){
      edition='Bigg Boss Malayalam 8';
      topics=['Bigg Boss Malayalam 8 premiere date','Bigg Boss Malayalam 8 contestants','Bigg Boss Malayalam 8 voting','Mohanlal host updates','JioHotstar streaming','nominations and eviction','latest official updates'];
      links=[['Bigg Boss Malayalam 8 official status','/topics/malayalam-8-agnipareeksha/'],['All Bigg Boss India editions','/']];
    }else if(path.includes('bangla')){
      edition='Bigg Boss Bangla 3';
      topics=['Bigg Boss Bangla 3 contestants','Bigg Boss Bangla voting','Sourav Ganguly host','Star Jalsha and JioHotstar','nominations and eviction','latest episode updates','winner updates'];
      links=[['Bigg Boss Bangla 3 official status','/topics/bangla/'],['All Bigg Boss India editions','/']];
    }

    const section=document.createElement('section');
    section.dataset.biggPopularSearches='1';
    section.setAttribute('aria-labelledby','bigg-popular-searches-title');
    section.style.cssText='max-width:980px;margin:34px auto;padding:0 18px';
    section.innerHTML='<div style="border:1px solid #dedee5;border-radius:18px;background:#fff;padding:20px"><div style="font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:#5b5bd6">Popular '+edition+' searches</div><h2 id="bigg-popular-searches-title" style="margin:8px 0 10px;font-size:24px">What viewers usually want to check</h2><p style="margin:0 0 12px;line-height:1.65;color:#585866">Official-source coverage focuses on the questions people search most often while keeping rumours clearly separate from confirmed information.</p><div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px">'+topics.map(t=>'<span style="display:inline-block;padding:7px 10px;border-radius:999px;background:#f4f4f8;border:1px solid #e4e4eb;font-size:13px">'+t+'</span>').join('')+'</div><nav aria-label="Related Bigg Boss pages" style="display:flex;flex-wrap:wrap;gap:10px">'+links.map(([label,href])=>'<a href="'+href+'" style="font-weight:700;color:#3434a8">'+label+' →</a>').join('')+'</nav></div>';
    const footer=document.querySelector('footer');
    if(footer&&footer.parentNode)footer.parentNode.insertBefore(section,footer);else document.body.appendChild(section);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addPopularSearchTopics,{once:true});else addPopularSearchTopics();

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