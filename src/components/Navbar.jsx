import logo from '../Assets/logorad.svg';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Features', to: '/features' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Contact', to: '/contact' },
  { label: 'Learn & Grow', to: '/learn' },
  { label: 'Tips', to: '/tips' },
];

export default function Navbar({ lang = 'en', onLangToggle }) {
  return (
    <nav className="navbar">
      <a href="/" className="navbar__logo">
        <img src={logo} alt="SELA" className="navbar__logo-img" />
      </a>

      <ul className="navbar__links">
        {NAV_LINKS.map((link) => (
          <li key={link.to}>
            <a href={link.to} className="navbar__link">
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="navbar__right">
        <button className="navbar__lang" onClick={onLangToggle}>
          <span className={lang === 'en' ? 'active' : ''}>EN</span>
          {' / '}
          <span className={lang === 'ar' ? 'active' : ''}>AR</span>
        </button>
        <a href="/login" className="navbar__login">Login</a>
        <a href="/signup" className="navbar__cta">Get Started →</a>
      </div>
    </nav>
  );
}