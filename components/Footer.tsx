import Link from 'next/link'
import { contactChannels, metrics } from '@/content/site-data'

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-grid">
        <div>
          <h2 className="footer-heading">Quality signals</h2>
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
          <h2 className="footer-heading">Connect</h2>
          <ul className="contact-list">
            <li>
              <Link href={`mailto:${contactChannels.email}`}>{contactChannels.email}</Link>
            </li>
            <li>
              <Link href={contactChannels.consulting}>Consulting requests</Link>
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
          <h2 className="footer-heading">Trust & Privacy</h2>
          <p className="footer-note">
            Privacy-preserving analytics only. No invasive cookies. Security posture reviewed per release.
          </p>
          <p className="footer-note">
            © {new Date().getFullYear()} Douglas Mitchell. Built with Next.js, Sanity, and Mux-ready integrations.
          </p>
        </div>
      </div>
    </footer>
  )
}
