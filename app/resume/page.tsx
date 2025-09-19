import Link from 'next/link'
import { bios, roles, education, metrics, contactChannels } from '@/content/site-data'

export const metadata = {
  title: 'Douglas Mitchell — Resume'
}

export default function ResumePage() {
  return (
    <main className="container" style={{ padding: '4rem 0' }}>
      <header className="section-heading" style={{ marginBottom: '2rem' }}>
        <p className="section-eyebrow">Resume</p>
        <h1>Douglas Mitchell</h1>
        <p className="section-description">{bios.short}</p>
      </header>
      <section style={{ marginBottom: '3rem' }}>
        <h2>Experience</h2>
        <ul className="community-list">
          {roles.map(role => (
            <li key={role.organization}>
              <strong>{role.organization}</strong> · {role.dates}
              <ul className="bridge-list">
                {role.bullets.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h2>Education & Training</h2>
        <ul className="community-list">
          {education.map(entry => (
            <li key={entry.program}>
              <strong>{entry.program}</strong>
              <div className="muted">{entry.status}</div>
            </li>
          ))}
        </ul>
      </section>
      <section style={{ marginBottom: '3rem' }}>
        <h2>Metrics</h2>
        <ul className="community-list">
          {metrics.map(metric => (
            <li key={metric.name}>
              <strong>{metric.name}</strong>: {metric.value} · {metric.source}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Email: <Link href={`mailto:${contactChannels.email}`}>{contactChannels.email}</Link></p>
        <p>GitHub: <Link href={contactChannels.github}>{contactChannels.github}</Link></p>
        <p>LinkedIn: <Link href={contactChannels.linkedin}>{contactChannels.linkedin}</Link></p>
      </section>
    </main>
  )
}
