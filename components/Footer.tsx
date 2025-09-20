import Link from 'next/link'
import { contactChannels, metrics } from '@/content/site-data'

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-grid">
        <div>
          <h2 className="footer-heading">Signal checks</h2>
          <ul className="metric-list">
            {metrics.map(metric => (
              <li key={metric.name}>
                <span className="metric-name">{metric.name}</span>
                <span className="metric-value">{metric.value}</span>
                <span className="metric-source">{metric.source}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer-heading">Stay connected</h2>
          <ul className="contact-list">
            <li>
              <Link href={`mailto:${contactChannels.email}`}>{contactChannels.email}</Link>
            </li>
            <li>
              <Link href={contactChannels.github}>GitHub</Link>
            </li>
            <li>
              <Link href={contactChannels.linkedin}>LinkedIn</Link>
            </li>
            <li>
              <Link href={contactChannels.twitter}>X (Twitter)</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="footer-heading">Notes</h2>
          <p className="footer-note">
            Built as a personal lab for logistics storytelling. Privacy-respecting analytics only.
          </p>
          <p className="footer-note">© {new Date().getFullYear()} Douglas Mitchell · Halcyon Logistics Dispatch.</p>
        </div>
      </div>
    </footer>
  )
}
