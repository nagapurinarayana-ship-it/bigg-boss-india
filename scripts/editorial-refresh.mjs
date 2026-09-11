import { readFile, writeFile } from 'node:fs/promises'

const files = ['today/index.html', 'index.html']

function decode(value = '') {
  return value.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim()
}

function cleanSource(title = '') {
  return decode(title)
    .replace(/\s*[|–-]\s*(Times of India|The Times of India|NDTV|Deccan Chronicle|Indian Express|The Indian Express|Mid-Day|Deadline|Asianet Newsable|Filmibeat|ETV Bharat|News18|Hindustan Times|IANS LIVE|Sakshi Post|Telegraph India|Times Now).*$/i, '')
    .replace(/^['“”‘’]+|['“”‘’]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function fact(title = '') {
  const t = cleanSource(title)
  const low = t.toLowerCase()
  if (/charan.*(elimin|evict)|(?:elimin|evict).*charan/.test(low)) return 'Charan has been eliminated in the surprise mid-week Bigg Boss Telugu 10 eviction, leaving the house to adjust much earlier than expected.'
  if (/manivannan.*(wild.?card|enter)|wild.?card.*manivannan/.test(low)) return 'Manivannan has entered Bigg Boss Tamil 10 as the first wild-card contestant, adding a fresh personality after the opening house dynamics have already started forming.'
  if (/yung\s*dsa.*captain|first captain.*yung/.test(low)) return 'Yung DSA has become the first captain of Bigg Boss Hindi 20, putting him at the centre of the house power structure at a very early stage.'
  if (/nine contestants|9 contestants|danger zone|danger/.test(low) && /kannada/.test(low)) return 'Nine contestants have been reported to be in the first-week danger zone on Bigg Boss Kannada 13, making the opening voting pressure unusually wide.'
  if (/anjali.*(cyber|attack)|cyber.*anjali/.test(low)) return 'Anjali has opened up about a severe cyberattack ordeal on Bigg Boss Malayalam 8, bringing a deeply personal experience into the house conversation.'
  if (/rajveer.*nandini|nandini.*rajveer/.test(low)) return 'Rajveer Dey and Nandini are at the centre of a fresh conflict in Bigg Boss Bangla, with the disagreement beginning to test the house’s early relationships.'
  if (/chaithra rai.*elimin/.test(low)) return 'Reports of Chaithra Rai’s elimination are circulating around Bigg Boss Telugu 10, but the stronger editorial signal is the uncertainty around the early eviction picture.'
  if (/muniyammal|savinya/.test(low) && /elimin|vot/.test(low)) return 'Muniyammal and Savinya are among the contestants facing early voting pressure in Bigg Boss Tamil 10, making the first elimination race a useful test of audience support.'
  if (/captaincy.*rajveer|rajveer.*captaincy/.test(low)) return 'Rajveer Dey is at the centre of the second captaincy task in Bigg Boss Bangla, putting his relationships with the wider house under pressure.'
  if (/yung\s*dsa.*kanika|kanika.*yung\s*dsa/.test(low)) return 'Yung DSA and Kanika Mann have clashed in Bigg Boss Hindi 20, and the disagreement is now a test of how quickly an early personal issue can become a wider house divide.'
  return t
}

function analyze(title = '') {
  const low = cleanSource(title).toLowerCase()
  const opening = fact(title)
  if (/evict|eliminat|out of the house/.test(low)) return {
    headline: 'An eviction has just changed the house equation',
    body: `${opening} At this stage, the exit matters because every remaining contestant now has to reconsider where that person fitted into the social map.`,
    game: 'The immediate strategic question is who gains from the empty space. A group that loses a dependable vote may become exposed, while a rival can suddenly gain room to influence nominations. Early evictions often reveal which friendships were genuine and which were simply convenient.',
    next: 'My focus now is on the reaction: who moves closer to whom, who becomes more isolated, and whether the next nomination conversation exposes a new alliance before the house has time to settle.'
  }
  if (/wild.?card|entrant|enters|joins/.test(low)) return {
    headline: 'A new entrant could redraw the alliance map',
    body: `${opening} The timing is important because the original contestants have already begun forming first impressions, friendships and rivalries.`,
    game: 'A wild card has one advantage the originals did not: observation. The newcomer can study the existing groups before choosing where to invest, while established contestants may rush to recruit or control that new relationship.',
    next: 'I would watch the first few conversations more closely than the first big argument — who welcomes the entrant, who tries to claim them, and who looks uncomfortable about an independent new player.'
  }
  if (/captain|captaincy/.test(low)) return {
    headline: 'Captaincy is exposing who really holds power',
    body: `${opening} The title itself is only the beginning; the more revealing part is who can build support and what happens when that authority has to be used.`,
    game: 'A captain can strengthen an alliance through protection, but can also create a ready-made opposition through unpopular decisions. That makes the first captaincy especially valuable for reading the house hierarchy.',
    next: 'I am watching the first difficult decision, the contestants who receive trust, the people who feel sidelined and whether the captain starts building a durable bloc or a temporary one.'
  }
  if (/nominat|voting|vote/.test(low)) return {
    headline: 'The first voting pressure is revealing the real alliances',
    body: `${opening} Once contestants have to defend someone or accept that another person is vulnerable, casual friendship starts turning into strategy.`,
    game: 'Repeated names are more revealing than one dramatic vote. A contestant who keeps appearing in danger may be isolated, while a surprising vote can expose a quiet agreement between people who rarely look like a group.',
    next: 'The pattern I am tracking is who changes position, who protects the same people repeatedly and whether the danger list begins concentrating around one emerging power centre.'
  }
  if (/fight|clash|controvers|argument|conflict|heated/.test(low)) return {
    headline: 'A clash is starting to test the house relationships',
    body: `${opening} The first confrontation is rarely the full story in Bigg Boss; what matters is whether the disagreement survives after the heat of the moment.`,
    game: 'If the issue stays personal it can disappear quickly. If other contestants take sides, or if the conflict spills into tasks, food, leadership or nominations, it can become one of the house’s defining early storylines.',
    next: 'I am watching the second reaction rather than the first shout: who keeps returning to the issue, who tries to mediate, who takes a side and who quietly uses the tension against a rival.'
  }
  if (/task|challenge|game/.test(low)) return {
    headline: 'The task is showing who performs when pressure rises',
    body: `${opening} Tasks are useful because they strip away some of the comfortable social routine and show how contestants behave when winning, losing and responsibility are suddenly visible.`,
    game: 'A strong performance can buy credibility for the next nomination cycle. Someone who repeatedly avoids responsibility or puts personal ego above the group can also become an easy target once contestants start looking for reasons to nominate.',
    next: 'The result is only one part of the story. I am watching who leads, who supports, who breaks discipline and who becomes more influential once the task is finished.'
  }
  if (/cyber|harass|mental health|personal struggle|suicid/.test(low)) return {
    headline: 'A deeply personal moment is changing the house conversation',
    body: `${opening} This deserves to be read first as a human story, not as manufactured Bigg Boss drama. A personal disclosure can change how housemates and viewers understand the contestant beyond the game.`,
    game: 'The meaningful effect is likely to be relational rather than tactical. Vulnerability can create trust and support, but it can also leave someone feeling exposed. It is important not to turn a serious personal experience into a prediction or spectacle.',
    next: 'I am watching how the other housemates respond afterwards — whether support is genuine, whether the contestant feels more connected, and whether the conversation is handled with the seriousness it deserves.'
  }
  return {
    headline: 'A fresh development is beginning to shape the house',
    body: `${opening} The useful question is not simply what happened, but what changes because it happened.`,
    game: 'At this early stage, relationships are still fluid. Small moments can affect confidence, visibility and who gets included when the next important decision arrives.',
    next: 'I am watching for the consequence that survives the episode: a new alliance, a changed nomination pattern, a task advantage or a contestant who suddenly becomes much more important to the house.'
  }
}

function replaceCards(html) {
  return html.replace(/<article class="card">([\s\S]*?)<\/article>/g, (full, inner) => {
    const match = inner.match(/<h2>([\s\S]*?)<\/h2>/i)
    if (!match) return full
    const sourceTitle = decode(match[1])
    const result = analyze(sourceTitle)
    const edition = (inner.match(/<div class="edition">([\s\S]*?)<\/div>/i) || ['', ''])[1]
    const badge = (inner.match(/<span class="fresh-badge">[\s\S]*?<\/span>/i) || [''])[0]
    return `<article class="card">${badge}<div class="edition">${edition}</div><h2>${result.headline}</h2><div class="analysis"><p>${result.body}</p><p>${result.game}</p><p>${result.next}</p></div></article>`
  })
}

for (const path of files) {
  let html = await readFile(path, 'utf8')
  html = replaceCards(html)
  html = html.replace(/<h3>([\s\S]*?)<\/h3>/gi, (full, title) => `<h3>${analyze(decode(title)).headline}</h3>`)
  html = html.replace(/<p>Fresh developments are checked three times daily\.[\s\S]*?<\/p>/i, '<p>Fresh Bigg Boss developments are checked three times daily. Each update is rewritten into original viewer-style analysis, with the source material used only as research input.</p>')
  html = html.replace(/<p>Not just headlines\.[\s\S]*?<\/p>/i, '<p>This is the daily Bigg Boss read: what changed, why it matters inside the house, which relationships may be moving, and what I am watching next. The result is original analysis, not a copied news feed.</p>')
  await writeFile(path, html)
}

console.log('Reader-facing editorial pass completed: source headlines and internal analysis labels are hidden from published copy.')
