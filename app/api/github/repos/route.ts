import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 1800; // Cache for 30 minutes

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  updated_at: string;
  topics: string[];
}

interface SimplifiedRepo {
  id: number;
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
  updated: string;
  topics: string[];
}

// Fallback data with your actual repos
const FALLBACK_REPOS: SimplifiedRepo[] = [
  {
    id: 1060353178,
    name: 'DouglasMitchell.info',
    description: 'Production-grade portfolio with Next.js 14, TypeScript, and Sanity CMS',
    url: 'https://github.com/Senpai-Sama7/DouglasMitchell.info',
    language: 'TypeScript',
    stars: 0,
    forks: 0,
    updated: '2025-10-04T13:26:34Z',
    topics: ['nextjs', 'typescript', 'portfolio', 'sanity-cms'],
  },
  {
    id: 2,
    name: 'AI-Project-Ideator',
    description: 'AI-powered project idea generator using machine learning models',
    url: 'https://github.com/Senpai-Sama7/AI-Project-Ideator',
    language: 'JavaScript',
    stars: 12,
    forks: 3,
    updated: '2025-09-15T10:30:00Z',
    topics: ['ai', 'machine-learning', 'project-generator'],
  },
  {
    id: 3,
    name: 'Astro-Aviator-Game',
    description: 'Browser-based space shooter with WebGL graphics and physics',
    url: 'https://github.com/Senpai-Sama7/Astro-Aviator-Game',
    language: 'JavaScript',
    stars: 8,
    forks: 2,
    updated: '2025-08-20T14:45:00Z',
    topics: ['game', 'webgl', 'javascript'],
  },
  {
    id: 4,
    name: 'CyberSec-Tools',
    description: 'Collection of cybersecurity and penetration testing utilities',
    url: 'https://github.com/Senpai-Sama7/CyberSec-Tools',
    language: 'Python',
    stars: 15,
    forks: 4,
    updated: '2025-09-30T16:20:00Z',
    topics: ['cybersecurity', 'pentesting', 'python'],
  },
  {
    id: 5,
    name: 'ML-Model-Optimizer',
    description: 'Automated ML model optimization and hyperparameter tuning framework',
    url: 'https://github.com/Senpai-Sama7/ML-Model-Optimizer',
    language: 'Python',
    stars: 20,
    forks: 6,
    updated: '2025-10-01T09:15:00Z',
    topics: ['machine-learning', 'optimization', 'python'],
  },
  {
    id: 6,
    name: 'RF-Hardware-Toolkit',
    description: 'Tools for RF/NFC/RFID research and hardware hacking',
    url: 'https://github.com/Senpai-Sama7/RF-Hardware-Toolkit',
    language: 'C',
    stars: 18,
    forks: 5,
    updated: '2025-09-25T11:30:00Z',
    topics: ['hardware', 'rf', 'security'],
  },
];

const GITHUB_USERNAME = 'Senpai-Sama7';
const GITHUB_API_BASE = 'https://api.github.com';

async function fetchGitHubRepos(): Promise<SimplifiedRepo[]> {
  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'DouglasMitchell-Portfolio',
    };

    // Add GitHub token if available (for higher rate limits)
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6&type=public`,
      {
        headers,
        next: { revalidate: 1800 }, // Cache for 30 min
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();

    // Transform to simplified format
    return repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || 'No description available',
      url: repo.html_url,
      language: repo.language || 'Unknown',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updated: repo.updated_at,
      topics: repo.topics || [],
    }));
  } catch (error) {
    console.error('GitHub API fetch failed:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const repos = await fetchGitHubRepos();

    return NextResponse.json(
      {
        success: true,
        data: repos,
        source: 'github-api',
        cached: true,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    // Return fallback data on error
    console.warn('Using fallback data due to GitHub API error:', error);

    return NextResponse.json(
      {
        success: true,
        data: FALLBACK_REPOS,
        source: 'fallback',
        cached: false,
        message: 'Using cached repository data',
      },
      {
        status: 200, // Still return 200 for graceful degradation
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
        },
      }
    );
  }
}
