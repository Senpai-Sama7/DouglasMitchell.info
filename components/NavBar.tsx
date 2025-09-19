import Link from 'next/link'
import { navigationLinks } from '@/content/site-data'

export function NavBar() {
  return (
    <header className="site-header" role="banner">
      <div className="container nav-container">
        <Link href="#home" className="brand" aria-label="Douglas Mitchell home">
          Douglas Mitchell
        </Link>
        <nav aria-label="Primary" className="primary-nav">
          <ul>
            {navigationLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="nav-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
