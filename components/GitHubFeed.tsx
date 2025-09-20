'use client'

import { useEffect, useState } from 'react'
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

export function GitHubFeed() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setStatus('loading')
      try {
        const { username, perPage } = githubConfig
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=${perPage}`,
          {
            headers: { Accept: 'application/vnd.github+json' },
            signal: controller.signal
          }
        )

        if (!response.ok) {
          setStatus('error')
          return
        }

        const data = (await response.json()) as Repo[]
        setRepos(data)
        setStatus('ready')
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setStatus('error')
        }
      }
    }

    load()
    return () => controller.abort()
  }, [])

  return (
    <div className="github-feed" aria-live="polite">
      {status === 'loading' ? <p className="muted">Loading recent GitHub activity…</p> : null}
      {status === 'error' ? (
        <p className="muted">GitHub data unavailable at the moment. Retry shortly.</p>
      ) : null}
      {status === 'ready' && repos.length > 0 ? (
        <ul>
          {repos.map(repo => (
            <li key={repo.id}>
              <Link href={repo.html_url} className="github-card">
                <span className="github-name">{repo.name}</span>
                {repo.description ? <span className="github-description">{repo.description}</span> : null}
                <span className="github-meta">
                  Updated {new Date(repo.pushed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} • ⭐ {repo.stargazers_count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
