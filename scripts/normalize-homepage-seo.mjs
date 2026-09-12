import { readFile, writeFile } from 'node:fs/promises'

const path = 'index.html'
const title = 'Bigg Boss India 2026: Live Updates & Analysis'
const description = 'Bigg Boss India 2026 live updates across Hindi, Telugu, Tamil, Kannada, Malayalam and Bangla, with voting, eliminations, captaincy, wild cards and original daily analysis.'

const html = await readFile(path, 'utf8')
let updated = html
updated = updated.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`)
updated = updated.replace(/<meta\s+name="description"\s+content="[^"]*">/i, `<meta name="description" content="${description}">`)

if (updated === html) throw new Error('Homepage SEO metadata was not found; refusing to publish an unsafe no-op.')

await writeFile(path, updated)
console.log(`Normalized homepage SEO metadata: title=${title.length} chars, description=${description.length} chars.`)
