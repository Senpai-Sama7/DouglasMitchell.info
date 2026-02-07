'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Repo {
  id: number;
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
}

interface ApiResponse {
  success: boolean;
  data: Repo[];
  source: 'github-api' | 'fallback';
  message?: string;
}

export function GitHubRepos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'github-api' | 'fallback'>('github-api');

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/github/repos', {
        next: { revalidate: 1800 },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const result: ApiResponse = await response.json();
      setRepos(result.data);
      setSource(result.source);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching repos:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
            <div className="flex gap-2 mt-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-6 text-center"
        role="alert"
      >
        <p className="text-red-600 dark:text-red-400 font-medium mb-2">
          Unable to load repositories
        </p>
        <p className="text-sm text-red-500 dark:text-red-400/80 mb-4">{error}</p>
        <button
          onClick={fetchRepos}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {source === 'fallback' && (
        <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 p-4">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            📡 Displaying cached repository data
          </p>
        </div>
      )}

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        role="list"
        aria-label="GitHub repositories"
      >
        {repos.map((repo, index) => (
          <motion.article
            key={repo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 p-6 transition-all hover:shadow-lg"
            role="listitem"
          >
            <h3 className="text-lg font-semibold mb-2">
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {repo.name}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {repo.description}
            </p>

            <div className="flex items-center gap-4 text-sm">
              {repo.language && (
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: getLanguageColor(repo.language),
                    }}
                    aria-hidden="true"
                  ></span>
                  <span className="text-gray-700 dark:text-gray-300">{repo.language}</span>
                </span>
              )}

              <span
                className="flex items-center gap-1 text-gray-600 dark:text-gray-400"
                aria-label={`${repo.stars} stars`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {repo.stars}
              </span>

              {repo.forks > 0 && (
                <span
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-400"
                  aria-label={`${repo.forks} forks`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    />
                  </svg>
                  {repo.forks}
                </span>
              )}
            </div>

            {repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {repo.topics.slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  );
}

// Language color mapping (GitHub's colors)
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Rust: '#dea584',
    Go: '#00ADD8',
    Java: '#b07219',
    C: '#555555',
    'C++': '#f34b7d',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
  };

  return colors[language] || '#8b949e';
}
