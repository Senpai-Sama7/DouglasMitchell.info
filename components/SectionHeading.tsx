import { ReactNode } from 'react'

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <header className="section-heading">
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      <div className="section-heading-row">
        <div>
          <h2>{title}</h2>
          {description ? <p className="section-description">{description}</p> : null}
        </div>
        {actions ? <div className="section-actions">{actions}</div> : null}
      </div>
    </header>
  )
}
