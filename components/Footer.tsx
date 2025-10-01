import Link from 'next/link'
import { contactChannels, metrics } from '@/content/site-data'

const socials = [
  { label: 'GitHub', href: contactChannels.github },
  { label: 'LinkedIn', href: contactChannels.linkedin }
]

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-grid">
        <div>
          <h2 className="footer-heading">Trust signals</h2>
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
          <h2 className="footer-heading">Presence</h2>
          <ul className="contact-list">
            <li>
              <Link href={`mailto:${contactChannels.email}`}>{contactChannels.email}</Link>
            </li>
            <li>{contactChannels.location}</li>
            {socials.map(social => (
              <li key={social.href}>
                <Link href={social.href}>{social.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer-heading">Assurances</h2>
          <p className="footer-note">Privacy-preserving analytics, MFA everywhere, and transparent data practices.</p>
          <p className="footer-note">© {new Date().getFullYear()} Douglas Mitchell · All systems monitored.</p>
        </div>
      </div>
    </footer>
  )
}
