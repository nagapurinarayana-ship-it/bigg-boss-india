import { readFile, writeFile } from 'node:fs/promises'

const files = ['today/index.html', 'index.html']

function cleanTitle(title = '') {
  return title
    .replace(/\s*[|–-]\s*(Times of India|The Times of India|NDTV|Deccan Chronicle|Indian Express|The Indian Express|Mid-Day|Deadline|Asianet Newsable|Filmibeat|ETV Bharat|News18|Hindustan Times).*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function analyze(title = '') {
  const t = title.toLowerCase()
  const subject = cleanTitle(title)
  if (/evict|eliminat|out of the house/.test(t)) return {
    headline: 'A sudden exit changes the house balance',
    body: `The latest development is an eviction, and that immediately changes the numbers inside the house. ${subject} means contestants who were relying on this relationship now have to rethink where they stand.`,
    game: `The bigger impact is strategic: one less person can strengthen one group, expose another and change the next nomination calculation. Early exits also remove a familiar vote and can force quieter contestants to become more visible.`,
    next: `The key signal now is who moves first — who replaces the lost alliance, who becomes a new target, and whether the next nomination reflects the old rivalry or a completely new map.`
  }
  if (/wild.?card|entrant|enters|joins/.test(t)) return {
    headline: 'A new entrant can disrupt the early alliance map',
    body: `The house has received a new variable with ${subject}. The important part is not simply the arrival; it is that the newcomer enters after the first relationships have already started taking shape.`,
    game: `That gives the entrant an unusual advantage: they can observe existing groups before choosing where to invest their loyalty. At the same time, established contestants may try to recruit them before they become independent.`,
    next: `The first few conversations should reveal the real story — who approaches first, who tries to control the newcomer, and whether the entrant builds a separate centre of influence.`
  }
  if (/captain|captaincy/.test(t)) return {
    headline: 'Captaincy starts exposing the house power structure',
    body: `${subject} is important because captaincy is the first clear test of who can convert popularity, relationships and performance into actual authority.`,
    game: `The captain now has to balance power with perception. Protecting a close group can strengthen an alliance, but using authority too aggressively can create a ready-made opposition for the next nomination.`,
    next: `Watch the first difficult decision, the contestants who receive protection, and the people who feel ignored. Those reactions will show whether this captaincy creates a durable bloc or a temporary one.`
  }
  if (/nominat|voting|vote/.test(t)) return {
    headline: 'Nominations are beginning to reveal the real alliances',
    body: `${subject} moves the game from casual friendship into calculation. Once contestants have to name targets or defend people, the difference between a friendship and a strategic alliance becomes much easier to see.`,
    game: `Repeated names matter more than one dramatic vote. A contestant who keeps appearing in danger may be isolated, while a surprising name can reveal a quiet agreement forming behind the scenes.`,
    next: `The next pattern to watch is who changes their position, who protects the same people repeatedly, and whether the danger list starts concentrating around one emerging group.`
  }
  if (/fight|clash|controvers|argument|conflict|heated/.test(t)) return {
    headline: 'A clash could become a larger house storyline',
    body: `${subject} matters because the argument itself is only the first layer. Repeated friction can expose personality differences that later spill into tasks, nominations and alliances.`,
    game: `If the issue remains personal, it may fade quickly. If other contestants choose sides, however, the disagreement can become a genuine power struggle and change how the house votes.`,
    next: `The second reaction is the one to watch: who keeps returning to the issue, who tries to mediate, and who quietly uses the conflict to weaken a rival.`
  }
  if (/task|challenge|game/.test(t)) return {
    headline: 'The task is revealing who can actually perform under pressure',
    body: `${subject} gives us more information than the final score. Tasks expose who takes responsibility, who follows a group plan and who starts playing only for personal advantage when pressure rises.`,
    game: `That performance can become currency in the next nomination cycle. A contestant who delivers for the team gains credibility, while someone who repeatedly fails or puts ego first can become an easy target.`,
    next: `The useful signal is not only who wins. Watch who leads, who supports, who breaks discipline and who becomes influential after the task is over.`
  }
  if (/cyber|harass|mental health|personal struggle|suicid/.test(t)) return {
    headline: 'A personal disclosure is changing how the contestant is being seen',
    body: `${subject} is a different kind of Bigg Boss development because it goes beyond competition. A personal disclosure can change the way both housemates and viewers understand the person behind the gameplay.`,
    game: `The important response is human rather than strategic. Vulnerability can deepen trust, create concern or alter relationships, but it should not be turned into manufactured drama.`,
    next: `The meaningful signal is how the house responds afterwards — whether support becomes genuine connection and whether the contestant feels safer or more isolated.`
  }
  return {
    headline: 'A fresh development is starting to shape the house',
    body: `The latest development is ${subject}. At this stage of the season, even a small change can matter because contestants are still deciding whom to trust, challenge and protect.`,
    game: `The real value of the update is what it changes around the event: relationships, confidence, visibility and the next decision under pressure. Those secondary effects are often more important than the headline moment itself.`,
    next: `The next episode or house reaction should tell us whether this becomes a lasting storyline, affects nominations or simply disappears when the next task arrives.`
  }
}

function decode(value = '') {
  return value.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim()
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
  await writeFile(path, html)
}

console.log('Editorial rendering pass completed: source headlines are no longer exposed as the visible analysis copy.')
