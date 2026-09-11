import { readFile, writeFile } from 'node:fs/promises'

const SITE = 'https://bigg-boss-india.pages.dev'
const EDITIONS = [
  { label: 'Bigg Boss Hindi 20', query: 'Bigg Boss Hindi 20', href: '/topics/hindi-20/' },
  { label: 'Bigg Boss Telugu 10', query: 'Bigg Boss Telugu 10', href: '/topics/telugu-10-agnipariksha-2/' },
  { label: 'Bigg Boss Tamil 10', query: 'Bigg Boss Tamil 10', href: '/topics/tamil-10-common-man/' },
  { label: 'Bigg Boss Kannada 13', query: 'Bigg Boss Kannada 13', href: '/topics/kannada-13-agnipariksha/' },
  { label: 'Bigg Boss Malayalam 8', query: 'Bigg Boss Malayalam 8', href: '/topics/malayalam-8-agnipareeksha/' },
  { label: 'Bigg Boss Bangla 2026', query: 'Bigg Boss Bangla 2026', href: '/topics/bangla/' },
]

const now = new Date()
const date = now.toISOString().slice(0, 10)
const displayDate = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric' }).format(now)

function escapeHtml(value = '') {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}

function stripCdata(value = '') {
  return value.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim()
}

function tag(xml, name) {
  const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'))
  return match ? stripCdata(match[1]) : ''
}

function extractItems(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(match => match[1]).map(item => ({
    title: tag(item, 'title'), link: tag(item, 'link'), pubDate: tag(item, 'pubDate'),
    description: tag(item, 'description'), source: tag(item, 'source'),
  })).filter(item => item.title && item.link)
}

async function fetchEdition(edition) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(`${edition.query} when:2d`)}&hl=en-IN&gl=IN&ceid=IN:en`
  const response = await fetch(url, { headers: { 'user-agent': 'BiggBossIndiaFreshUpdater/1.0' } })
  if (!response.ok) throw new Error(`${edition.label}: RSS HTTP ${response.status}`)
  return { ...edition, items: extractItems(await response.text()).slice(0, 4) }
}

function itemCard(edition, item) {
  const dateText = item.pubDate ? new Date(item.pubDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Latest'
  const source = item.source || 'News source'
  const snippet = stripCdata(item.description).replace(/<[^>]+>/g, '').slice(0, 260)
  return `<article class="card"><div class="edition">${escapeHtml(edition.label)}</div><h2>${escapeHtml(item.title)}</h2><p><strong>${escapeHtml(source)}</strong> · ${escapeHtml(dateText)}</p><p>${escapeHtml(snippet)}</p><p><a class="read" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer nofollow">Read the original report →</a></p></article>`
}

const results = []
for (const edition of EDITIONS) {
  try { results.push(await fetchEdition(edition)) }
  catch (error) { console.warn(`WARN ${error.message}`); results.push({ ...edition, items: [] }) }
}

const allItems = results.flatMap(edition => edition.items.map(item => ({ ...item, edition })))
if (!allItems.length) throw new Error('No fresh news items were returned; refusing to publish an empty update page.')
allItems.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0))
const latest = allItems.slice(0, 12)
const cards = latest.map(({ edition, ...item }) => itemCard(edition, item)).join('\n')
const dashboard = results.map(edition => {
  const item = edition.items[0]
  return `<section class="status"><h2>${escapeHtml(edition.label)}</h2>${item ? `<p><strong>${escapeHtml(item.title)}</strong></p><p>${escapeHtml(item.source || 'Latest report')} · ${escapeHtml(item.pubDate ? new Date(item.pubDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Latest')}</p><p><a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer nofollow">Read the source report →</a> · <a href="${edition.href}">Edition tracker →</a></p>` : `<p>No fresh feed item was available in the last 48 hours. <a href="${edition.href}">Open the edition tracker →</a></p>`}</section>`
}).join('\n')

const todayHtml = `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bigg Boss Today: ${escapeHtml(displayDate)} Live Updates & Results</title>
<meta name="description" content="Bigg Boss today, ${escapeHtml(displayDate)}: fresh Hindi 20, Telugu 10, Tamil 10, Kannada 13, Malayalam 8 and Bangla updates from current news reports.">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="${SITE}/today/">
<meta property="og:type" content="website"><meta property="og:site_name" content="Bigg Boss India"><meta property="og:title" content="Bigg Boss Today: ${escapeHtml(displayDate)} Live Updates & Results"><meta property="og:description" content="Freshly collected Bigg Boss updates across all six active 2026 editions."><meta property="og:url" content="${SITE}/today/"><meta property="og:image" content="${SITE}/og-image.jpg">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Bigg Boss Today: ${escapeHtml(displayDate)} Live Updates"><meta name="twitter:description" content="Latest Bigg Boss updates, nominations, tasks, evictions and wild-card news."><meta name="twitter:image" content="${SITE}/og-image.jpg">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'CollectionPage', name: `Bigg Boss Today: ${displayDate} Live Updates & Results`, description: 'Latest Bigg Boss updates across Hindi, Telugu, Tamil, Kannada, Malayalam and Bangla.', url: `${SITE}/today/`, dateModified: date, inLanguage: 'en-IN', publisher: { '@type': 'Organization', name: 'Bigg Boss India' }, mainEntity: { '@type': 'ItemList', itemListElement: latest.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.title, url: item.link })) } })}</script>
<link rel="stylesheet" href="../style.css">
</head>
<body>
<header class="header"><a class="brand" href="/">BIGG BOSS INDIA</a><div class="tagline">Every House. Every Day.</div></header>
<main>
<nav class="breadcrumbs"><a href="/">Bigg Boss India</a><span>›</span><span>Today</span></nav>
<div class="edition">Automated fresh coverage</div>
<h1>Bigg Boss Today: ${escapeHtml(displayDate)} live updates</h1>
<p class="updated"><strong>Updated: ${escapeHtml(displayDate)}</strong> · Refreshed three times daily</p>
<p>This page automatically collects recent Bigg Boss coverage from public news RSS results. Headlines and snippets remain attributed to their original publishers; this site does not present third-party reports as official broadcaster announcements.</p>
<section class="status"><h2>🔥 Latest reports</h2><div class="cards">${cards}</div></section>
<h2>Six-edition dashboard</h2>
${dashboard}
<section class="status"><h2>Editorial safeguards</h2><p>Fresh collection is automated, but claims remain labelled as reports unless confirmed by the broadcaster or platform. Original publisher links are preserved. Failed feeds never replace the page with an empty result.</p></section>
</main>
<footer>Independent Bigg Boss information site. Not affiliated with or endorsed by Bigg Boss or its broadcasters.</footer>
<section class="ad-slot ad-banner" data-bigg-banner aria-label="Advertisement"></section><script src="/ads.js?v=20260817-social-barsterra" defer></script>
</body></html>`

const homepage = await readFile('index.html', 'utf8')
const freshSection = `<section class="status" id="fresh-automatic-updates"><h2>⚡ Fresh automatic updates</h2><p>Last refreshed ${escapeHtml(displayDate)}. New reports are collected automatically three times daily.</p><div class="cards">${latest.slice(0, 6).map(({ edition, ...item }) => itemCard(edition, item)).join('\n')}</div><p><a href="/today/"><strong>Open the full live update hub →</strong></a></p></section>`
const withoutOld = homepage.replace(/<section class="status" id="fresh-automatic-updates">[\s\S]*?<\/section>/i, '')
const insertionPoint = withoutOld.indexOf('<section class="cards"')
const homepageUpdated = insertionPoint >= 0 ? `${withoutOld.slice(0, insertionPoint)}${freshSection}\n${withoutOld.slice(insertionPoint)}` : withoutOld

await writeFile('today/index.html', todayHtml)
await writeFile('index.html', homepageUpdated)

const sitemap = await readFile('sitemap.xml', 'utf8')
const sitemapUpdated = sitemap.replace(/(<loc>https:\/\/bigg-boss-india\.pages\.dev\/today\/<\/loc>\s*<lastmod>)[^<]+(<\/lastmod>)/i, `$1${date}$2`)
await writeFile('sitemap.xml', sitemapUpdated)
console.log(`Published ${latest.length} fresh Bigg Boss reports across ${results.length} editions for ${displayDate}.`)
