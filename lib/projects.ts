import { projectShowcase } from '@/content/site-data'

export type Project = (typeof projectShowcase)[number]

export class ProjectNotFoundError extends Error {
  public readonly slug: string

  constructor(slug: string) {
    super(`Project not found for slug: ${slug}`)
    this.name = 'ProjectNotFoundError'
    this.slug = slug
  }
}

const projectsBySlug = new Map(projectShowcase.map(project => [project.slug, project]))

export function getProjectBySlug(slug: string): Project {
  const project = projectsBySlug.get(slug)

  if (!project) {
    throw new ProjectNotFoundError(slug)
  }

  return project
}

export function getProjectStaticParams() {
  return projectShowcase.map(project => ({ slug: project.slug }))
}

export function listProjects(): Project[] {
  return [...projectShowcase]
}

export function isKnownProjectSlug(slug: string): boolean {
  return projectsBySlug.has(slug)
}
