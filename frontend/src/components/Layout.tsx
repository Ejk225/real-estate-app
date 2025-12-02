import { Link, useLocation } from 'react-router-dom';

/**
 * Layout Component
 * Composant de mise en page réutilisable avec navigation
 */

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div>
      <nav className="navbar">
        <div className="container navbar-content">
          <Link to="/" className="navbar-brand">
            🏠 ImmoApp
          </Link>
          <ul className="navbar-nav">
            <li>
              <Link to="/" className={`navbar-link ${isActive('/')}`}>
                Annonces
              </Link>
            </li>
            <li>
              <Link to="/create" className={`navbar-link ${isActive('/create')}`}>
                Créer une annonce
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <main className="container">
        {children}
      </main>
    </div>
  );
}