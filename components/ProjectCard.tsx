import Link from 'next/link'

type Asset = {
  label: string
  href: string
}

type Project = {
  title: string
  summary: string
  problem: string
  architecture: string
  validation: string
  outcomes: string
  assets: Asset[]
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <h3>{project.title}</h3>
      <p className="project-summary">{project.summary}</p>
      <dl className="project-detail">
        <div>
          <dt>Problem</dt>
          <dd>{project.problem}</dd>
        </div>
        <div>
          <dt>Architecture</dt>
          <dd>{project.architecture}</dd>
        </div>
        <div>
          <dt>Validation</dt>
          <dd>{project.validation}</dd>
        </div>
        <div>
          <dt>Outcomes</dt>
          <dd>{project.outcomes}</dd>
        </div>
      </dl>
      <ul className="project-assets">
        {project.assets.map(asset => (
          <li key={asset.href}>
            <Link href={asset.href} className="project-link">
              {asset.label}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  )
}
