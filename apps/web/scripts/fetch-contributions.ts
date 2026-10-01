import { writeFile } from 'node:fs/promises'

const LOGIN = 'MarquesCoding'
const RESULTS_PER_SEARCH = 1000
const PAGE_SIZE = 100
const PAUSE_MS = 2200
const DAY_MS = 86_400_000
const OUTPUT = new URL('../data/contributions.json', import.meta.url)

type Found = { sha: string; commit: { author: { date: string } } }
type Page = { total_count: number; items: Found[] }

const token = process.env.GITHUB_TOKEN
const counts = new Map<string, number>()
const seen = new Set<string>()

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const dayOf = (moment: Date) => moment.toISOString().slice(0, 10)

async function search(query: string, page: number): Promise<Page> {
  const url = new URL('https://api.github.com/search/commits')
  url.searchParams.set('q', query)
  url.searchParams.set('per_page', String(PAGE_SIZE))
  url.searchParams.set('page', String(page))

  for (let attempt = 0; attempt < 5; attempt++) {
    await pause(PAUSE_MS)
    const response = await fetch(url, {
      headers: {
        accept: 'application/vnd.github+json',
        'user-agent': 'mscripps-contributions',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    })

    if (response.ok) return (await response.json()) as Page

    if (response.status === 403 || response.status === 429) {
      const reset = Number(response.headers.get('x-ratelimit-reset') ?? 0) * 1000
      await pause(Math.max(reset - Date.now(), 10_000) + 1000)
      continue
    }

    throw new Error(`GitHub search failed: ${response.status} ${await response.text()}`)
  }

  throw new Error('GitHub search kept refusing after five tries')
}

async function collect(from: Date, to: Date): Promise<void> {
  const query = `author:${LOGIN} author-date:${dayOf(from)}..${dayOf(to)}`
  const first = await search(query, 1)
  const span = Math.round((to.getTime() - from.getTime()) / DAY_MS)

  if (first.total_count > RESULTS_PER_SEARCH && span > 0) {
    const middle = new Date(from.getTime() + Math.floor(span / 2) * DAY_MS)
    await collect(from, middle)
    await collect(new Date(middle.getTime() + DAY_MS), to)
    return
  }

  const pages = Math.ceil(Math.min(first.total_count, RESULTS_PER_SEARCH) / PAGE_SIZE)
  const record = (found: Found[]) => {
    for (const { sha, commit } of found) {
      if (seen.has(sha)) continue
      seen.add(sha)
      const day = commit.author.date.slice(0, 10)
      counts.set(day, (counts.get(day) ?? 0) + 1)
    }
  }

  record(first.items)

  for (let page = 2; page <= pages; page++) {
    record((await search(query, page)).items)
  }
}

const today = new Date(`${dayOf(new Date())}T00:00:00Z`)
const end = new Date(today.getTime() + (6 - today.getUTCDay()) * DAY_MS)
const start = new Date(end.getTime() - (53 * 7 - 1) * DAY_MS)

await collect(start, today)

const days = []
for (let at = start.getTime(); at <= end.getTime(); at += DAY_MS) {
  const day = dayOf(new Date(at))
  days.push({ date: day, count: at > today.getTime() ? null : (counts.get(day) ?? 0) })
}

const total = days.reduce((sum, day) => sum + (day.count ?? 0), 0)

await writeFile(
  OUTPUT,
  `${JSON.stringify({ login: LOGIN, total, updatedAt: dayOf(today), days }, null, 2)}\n`,
)

console.log(`${total} commits from ${dayOf(start)} to ${dayOf(today)}`)
