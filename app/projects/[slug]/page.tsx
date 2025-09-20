import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getProjectBySlug, getProjectStaticParams, ProjectNotFoundError } from '@/lib/projects'

type ProjectPageParams = Promise<{ slug: string }>
type ProjectPageProps = { params: ProjectPageParams }

export function generateStaticParams() {
  return getProjectStaticParams()
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const project = getProjectBySlug(slug)

    return {
      title: `${project.title} · Douglas Mitchell`,
      description: project.summary
    }
  } catch (error) {
    if (error instanceof ProjectNotFoundError) {
      return {
        title: 'Project not found · Douglas Mitchell'
      }
    }

    throw error
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params
  let project

  try {
    project = getProjectBySlug(slug)
  } catch (error) {
    if (error instanceof ProjectNotFoundError) {
      notFound()
    }

    throw error
  }

  return (
    <main className={`project-detail project-detail--${project.slug}`}>
      <header className="project-detail__hero">
        <div className="project-detail__badge">{project.format}</div>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
        <div className="project-detail__cta">
          <Link href="#overview" className="axiom-button axiom-button--primary">
            Architecture overview
          </Link>
          <Link href={project.links?.[0]?.href ?? '#'} className="axiom-button axiom-button--ghost" target="_blank" rel="noreferrer">
            View artifacts
          </Link>
        </div>
      </header>

      <section id="overview" className="project-detail__section">
        <div className="project-detail__grid">
          <article>
            <h2>Problem & constraints</h2>
            <p>{project.problem}</p>
          </article>
          <article>
            <h2>Architecture</h2>
            <p>{project.architecture}</p>
          </article>
          <article>
            <h2>Validation strategy</h2>
            <p>{project.validation}</p>
          </article>
          <article>
            <h2>Outcomes</h2>
            <p>{project.outcomes}</p>
          </article>
        </div>
      </section>

      <section className="project-detail__section project-detail__section--meta">
        <div className="project-detail__meta">
          <div>
            <h3>Tech stack</h3>
            <ul>
              {project.tech.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Tags</h3>
            <ul>
              {project.tags.map(tag => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </div>
        {project.links && project.links.length > 0 ? (
          <div className="project-detail__links">
            <h3>Reference assets</h3>
            <ul>
              {project.links.map(link => (
                <li key={link.href}>
                  <Link href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="project-detail__section project-detail__section--return">
        <Link href="/" className="axiom-button axiom-button--inline">
          Return to home
        </Link>
        <Link href="/#contact" className="axiom-button axiom-button--inline">
          Initiate contact
        </Link>
      </section>
    </main>
  )
}
