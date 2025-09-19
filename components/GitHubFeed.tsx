import Link from 'next/link'
import { githubConfig } from '@/content/site-data'

type Repo = {
  id: number
  name: string
  html_url: string
  description: string | null
  pushed_at: string
  stargazers_count: number
}

async function fetchRepos(): Promise<Repo[]> {
  const { username, perPage } = githubConfig

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=${perPage}`,
      {
        headers: {
          Accept: 'application/vnd.github+json'
        },
        next: { revalidate: 3600 }
      }
    )

    if (!response.ok) {
      console.error('GitHub request failed', await response.text())
      return []
    }

    const data = (await response.json()) as Repo[]
    return data
  } catch (error) {
    console.error('GitHub request failed', error)
    return []
  }
}

export async function GitHubFeed() {
  const repos = await fetchRepos()

  return (
    <div className="github-feed" aria-live="polite">
      {repos.length === 0 ? (
        <p className="muted">GitHub data unavailable at the moment. Retry shortly.</p>
      ) : (
        <ul>
          {repos.map(repo => (
            <li key={repo.id}>
              <Link href={repo.html_url} className="github-card">
                <span className="github-name">{repo.name}</span>
                {repo.description ? <span className="github-description">{repo.description}</span> : null}
                <span className="github-meta">
                  Updated {new Date(repo.pushed_at).toLocaleDateString()} • ⭐ {repo.stargazers_count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
