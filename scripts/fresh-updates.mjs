import { readFile, writeFile } from 'node:fs/promises'

const SITE = 'https://bigg-boss-india.pages.dev'
const EDITIONS = [
  { key: 'hindi', label: 'Bigg Boss Hindi 20', query: 'Bigg Boss Hindi 20', href: '/topics/hindi-20/', match: /bigg\s*boss\s*(hindi\s*)?20/i },
  { key: 'telugu', label: 'Bigg Boss Telugu 10', query: 'Bigg Boss Telugu 10', href: '/topics/telugu-10-agnipariksha-2/', match: /bigg\s*boss\s*telugu\s*10/i },
  { key: 'tamil', label: 'Bigg Boss Tamil 10', query: 'Bigg Boss Tamil 10', href: '/topics/tamil-10-common-man/', match: /bigg\s*boss\s*tamil\s*10/i },
  { key: 'kannada', label: 'Bigg Boss Kannada 13', query: 'Bigg Boss Kannada 13', href: '/topics/kannada-13-agnipariksha/', match: /bigg\s*boss\s*kannada\s*13/i },
  { key: 'malayalam', label: 'Bigg Boss Malayalam 8', query: 'Bigg Boss Malayalam 8', href: '/topics/malayalam-8-agnipareeksha/', match: /bigg\s*boss\s*malayalam\s*8/i },
  { key: 'bangla', label: 'Bigg Boss Bangla 2026', query: 'Bigg Boss Bangla 2026', href: '/topics/bangla/', match: /bigg\s*boss\s*bangla/i },
]

const now = new Date()
const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
const displayDate = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric' }).format(now)

function escapeHtml(value = '') { return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;') }
function stripHtml(value = '') { return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() }
function stripCdata(value = '') { return value.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim() }
function tag(xml, name) { const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i')); return match ? stripCdata(match[1]) : '' }
function normalize(value = '') { return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() }
function extractItems(xml) { return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(match => match[1]).map(item => ({ title: tag(item, 'title'), link: tag(item, 'link'), pubDate: tag(item, 'pubDate'), description: tag(item, 'description') })).filter(item => item.title && item.link) }
function relevant(edition, item) {
  const text = `${item.title} ${stripHtml(item.description)}`
  if (!edition.match.test(text)) return false
  const blocked = /rise\s+and\s+fall|shehnaaz\s+gill|sidharth\s+shukla|historical|years\s+ago|throwback|contestants?\s+list|with\s+photos|stylist|fashion|looks?|ai\s+avatars?|five.?year\s+dream|favourite\s+contestant|salary|net\s+worth|sponsors?|house\s+tour|premiere\s+date|schedule|watch\s+online|horoscope|birthday/i
  if (blocked.test(text)) return false
  const current = /episode|today|preview|promo|evict|eliminat|nomination|nominate|voting|vote|captain|captaincy|task|fight|clash|argument|conflict|wild.?card|entrant|enters|joins|jail|immunity|power|safe|danger|high.?risk|eviction|mind.?game|cyber|harass|personal\s+(revelation|story|disclosure|struggle)|mental\s+health|controvers/i
  return current.test(text)
}
async function fetchEdition(edition) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(`${edition.query} when:2d`)}&hl=en-IN&gl=IN&ceid=IN:en`
  const response = await fetch(url, { headers: { 'user-agent': 'BiggBossIndiaFreshUpdater/6.0' } })
  if (!response.ok) throw new Error(`${edition.label}: RSS HTTP ${response.status}`)
  const items = extractItems(await response.text()).filter(item => relevant(edition, item))
  return { ...edition, items: items.slice(0, 8) }
}

let previous = { titles: [] }
try { previous = JSON.parse(await readFile('.fresh-update-state.json', 'utf8')) } catch (_) {}
const previousTitles = new Set((previous.titles || []).map(normalize))

function analyze(edition, item) {
  const raw = `${item.title} ${stripHtml(item.description)}`
  const text = raw.toLowerCase()
  const subject = item.title.replace(/\s*[|–-]\s*[^|–-]+$/, '').trim()
  let opening = `What stands out to me here is the timing. ${subject} is not just another update; it changes the way I would read the house from this point.`
  let game = 'The real game now is the reaction. The next task, nomination discussion and the way contestants choose their sides will tell us whether this becomes a genuine storyline or simply passes through the episode.'
  let watch = 'I would watch the small reactions rather than only the loudest moment. That is usually where alliances, insecurity and individual strategy become visible.'
  if (/evict|eliminat|out of the house/.test(text)) { opening = `This is the kind of early-season twist that can quietly change everything. ${subject} means one seat has suddenly disappeared, and the remaining housemates now have to adjust their numbers, relationships and expectations.`; game = 'The important question is who benefits from the exit. Someone who was depending on that relationship may become exposed, while a rival may suddenly get more room to control the group. An early exit can force contestants to stop playing socially safe and show their real priorities.'; watch = 'I would watch who talks about the exit first, who stays unusually quiet, and which contestants immediately start rebuilding their group. Those reactions can tell us more about the next nomination battle than the eviction itself.' }
  else if (/wild.?card|entrant|enters|joins/.test(text)) { opening = `This arrival comes at the point where the original house structure is beginning to form. ${subject} adds a new variable when existing contestants are already learning one another.`; game = 'A new contestant can observe before committing. If the entrant builds independent relationships instead of becoming somebody else’s weapon, established groups could suddenly become much less comfortable.'; watch = 'The first conversations matter more than the first argument. I would watch who welcomes the newcomer, who tries to recruit them immediately, and who looks threatened by their presence.' }
  else if (/captain|captaincy/.test(text)) { opening = `Captaincy is where the house starts revealing its power structure. ${subject} matters because the title is not only about authority; it exposes who can gather support when the game becomes competitive.`; game = 'The next test is whether the captain can lead without creating a larger opposition group. A contestant who uses power too aggressively may gain short-term control but create nominations waiting for them later.'; watch = 'I would watch the captain’s first difficult decision, who gets protected, who feels ignored and which contestants start positioning themselves for the next power shift.' }
  else if (/nominat|voting|vote/.test(text)) { opening = `This nomination development gives us the first real picture of where pressure is building. ${subject} matters because nominations turn casual friendships into strategic calculations.`; game = 'Once names are on the table, contestants have to decide whether to protect relationships or protect their own game. Repeated targets often reveal alliances more clearly than friendly conversations do.'; watch = 'I would watch repeated names, unexpected votes and contestants who suddenly become very active in conversations. The pattern is often more revealing than the final list.' }
  else if (/fight|clash|controvers|argument|conflict|heated/.test(text)) { opening = `The argument itself is only the surface of this story. ${subject} is interesting because repeated friction can reveal which personalities are already struggling to coexist.`; game = 'If the disagreement stays personal, it may burn out quickly. If it connects to tasks, food, leadership or nominations, it can turn into a proper season storyline and pull other contestants into sides.'; watch = 'I would watch who keeps returning to the issue after the obvious confrontation. The second reaction is often more important than the first shout.' }
  else if (/task|challenge|game/.test(text)) { opening = `This task is more important than the result alone suggests. ${subject} puts contestants under pressure, and pressure is where natural leadership, teamwork and selfishness become visible.`; game = 'A strong performance can create credibility, while a poor one can become ammunition in the next nomination discussion. Contestants who understand that balance usually survive longer than those chasing one dramatic moment.'; watch = 'I would watch who performs for the team, who performs only for themselves and who tries to control the room without actually delivering.' }
  else if (/cyber|harass|mental health|personal struggle|suicid/.test(text)) { opening = `This is a different kind of Bigg Boss moment because the story goes beyond competition. ${subject} brings a personal experience into the house, and that can change how viewers understand the contestant.`; game = 'It should not be reduced to a gameplay angle. Moments like this can still change relationships because vulnerability can create trust, concern or distance.'; watch = 'I would watch the housemates’ response rather than turn a personal disclosure into a prediction. Compassion and respect matter more here than manufacturing drama.' }
  return { opening, game, watch }
}

function itemCard(edition, item) {
  const analysis = analyze(edition, item)
  const freshBadge = item.isNew ? '<span class="fresh-badge">NEW</span>' : ''
  return `<article class="card">${freshBadge}<div class="edition">${escapeHtml(edition.label)}</div><h2>${escapeHtml(item.title)}</h2><div class="analysis"><p><strong>What I’m seeing:</strong> ${escapeHtml(analysis.opening)}</p><p><strong>Why this matters:</strong> ${escapeHtml(analysis.game)}</p><p><strong>What I’m watching next:</strong> ${escapeHtml(analysis.watch)}</p></div></article>`
}

const results = []
for (const edition of EDITIONS) {
  try { results.push(await fetchEdition(edition)) }
  catch (error) { console.warn(`WARN ${error.message}`); results.push({ ...edition, items: [] }) }
}

const allItems = results.flatMap(edition => edition.items.map(item => ({ ...item, edition, isNew: !previousTitles.has(normalize(item.title)) })))
if (!allItems.length) throw new Error('No relevant high-value Bigg Boss news items were returned; refusing to publish an empty update page.')
const unique = new Map()
for (const item of allItems) {
  const key = normalize(item.title)
  if (!unique.has(key)) unique.set(key, item)
}
const deduped = [...unique.values()]
deduped.sort((a, b) => Number(b.isNew) - Number(a.isNew) || new Date(b.pubDate || 0) - new Date(a.pubDate || 0))
const latest = deduped.slice(0, 18)
const newCount = latest.filter(item => item.isNew).length
const editionJson = results.map(edition => ({ label: edition.label, href: edition.href, count: edition.items.length }))
const cards = latest.map(({ edition, ...item }) => itemCard(edition, item)).join('\n')
const dashboard = results.map(edition => { const item = edition.items[0]; if (!item) return `<section class="status"><h2>${escapeHtml(edition.label)}</h2><p>No relevant fresh item was available in this refresh window. The edition tracker remains live.</p><p><a href="${edition.href}">Open edition tracker →</a></p></section>`; const analysis = analyze(edition, item); return `<section class="status"><h2>${escapeHtml(edition.label)}</h2><h3>${escapeHtml(item.title)}</h3><p><strong>My read:</strong> ${escapeHtml(analysis.opening)}</p><p><strong>The bigger game:</strong> ${escapeHtml(analysis.game)}</p><p><strong>Next thing to watch:</strong> ${escapeHtml(analysis.watch)}</p><p><a href="${edition.href}">Continue following this edition →</a></p></section>` }).join('\n')
const todayHtml = `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bigg Boss Today: ${escapeHtml(displayDate)} — Live Updates & Deep Analysis</title><meta name="description" content="Bigg Boss today, ${escapeHtml(displayDate)}: fresh Hindi 20, Telugu 10, Tamil 10, Kannada 13, Malayalam 8 and Bangla developments with daily viewer-style analysis."><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><link rel="canonical" href="${SITE}/today/"><meta property="og:type" content="website"><meta property="og:site_name" content="Bigg Boss India"><meta property="og:title" content="Bigg Boss Today: ${escapeHtml(displayDate)} — Live Updates & Deep Analysis"><meta property="og:description" content="Fresh Bigg Boss developments explained through original daily analysis across all six editions."><meta property="og:url" content="${SITE}/today/"><meta property="og:image" content="${SITE}/og-image.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Bigg Boss Today: ${escapeHtml(displayDate)} — Live Updates & Analysis"><meta name="twitter:image" content="${SITE}/og-image.jpg"><script type="application/ld+json">${JSON.stringify({ '@context':'https://schema.org','@type':'CollectionPage',name:`Bigg Boss Today: ${displayDate} — Live Updates & Deep Analysis`,url:`${SITE}/today/`,dateModified:date,inLanguage:'en-IN',publisher:{'@type':'Organization',name:'Bigg Boss India'},mainEntity:{'@type':'ItemList',itemListElement:latest.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.title}))}})}</script><link rel="stylesheet" href="../style.css"></head><body><header class="header"><a class="brand" href="/">BIGG BOSS INDIA</a><div class="tagline">Every House. Every Day.</div></header><main><nav class="breadcrumbs"><a href="/">Bigg Boss India</a><span>›</span><span>Today</span></nav><div class="edition">Fresh developments • Deep editorial analysis</div><h1>Bigg Boss Today: ${escapeHtml(displayDate)} — live updates & analysis</h1><p class="updated"><strong>Updated: ${escapeHtml(displayDate)}</strong> · Three daily refreshes · ${newCount} new developments</p><p>Not just headlines. This is the daily Bigg Boss read: what changed, why it matters inside the house, which relationships may be moving, and what I would be watching next. Fresh reports inform the update, but the page is written as original analysis rather than a copied news feed.</p><section class="status"><h2>🔥 What is happening right now?</h2><div class="cards">${cards}</div></section><h2>My six-edition read</h2>${dashboard}<section class="status"><h2>Keep watching</h2><p>Bigg Boss changes quickly. A loud fight can disappear by tomorrow, while one quiet conversation can become the season’s biggest alliance. Come back for the next refresh to see which story actually survives.</p></section></main><footer>Independent Bigg Boss analysis site. Not affiliated with or endorsed by Bigg Boss or its broadcasters.</footer><section class="ad-slot ad-banner" data-bigg-banner aria-label="Advertisement"></section><script src="/ads.js?v=20260817-social-barsterra" defer></script></body></html>`
const homepage = await readFile('index.html', 'utf8')
const freshSection = `<section class="status" id="fresh-automatic-updates"><h2>⚡ What’s happening inside the houses?</h2><p>Fresh developments are checked three times daily. ${newCount} new relevant developments were detected in this refresh. I’m looking at what each moment could mean for the game, not just repeating headlines.</p><div class="cards">${latest.slice(0, 8).map(({ edition, ...item }) => itemCard(edition, item)).join('\n')}</div><p><a href="/today/"><strong>Enter today’s full Bigg Boss analysis →</strong></a></p></section>`
const withoutOld = homepage.replace(/<section class="status" id="fresh-automatic-updates">[\s\S]*?<\/section>/i, '')
const insertionPoint = withoutOld.indexOf('<section class="cards"')
const homepageUpdated = insertionPoint >= 0 ? `${withoutOld.slice(0, insertionPoint)}${freshSection}\n${withoutOld.slice(insertionPoint)}` : withoutOld
await writeFile('today/index.html', todayHtml)
await writeFile('index.html', homepageUpdated)
const sitemap = await readFile('sitemap.xml', 'utf8')
await writeFile('sitemap.xml', sitemap.replace(/(<loc>https:\/\/bigg-boss-india\.pages\.dev\/today\/<\/loc>\s*<lastmod>)[^<]+(<\/lastmod>)/i, `$1${date}$2`))
const retainedTitles = deduped.slice(0, 40).map(item => item.title)
await writeFile('.fresh-update-state.json', JSON.stringify({ updatedAt: now.toISOString(), date, editions: editionJson, itemCount: latest.length, newCount, titles: retainedTitles, editorialAnalysis: true, externalLinksDisplayed: false }, null, 2) + '\n')
console.log(`Published ${latest.length} high-value Bigg Boss developments, including ${newCount} newly detected items, with deep editorial analysis across ${results.length} editions for ${displayDate}.`)
