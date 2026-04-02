import logo from '../Assets/logorad.svg';
import './Footer.css';

const LINKS = {
  'For Buyers': ['Post a Need', 'Browse Vendors', 'How It Works', 'Success Stories', 'Pricing'],
  'For Vendors': ['Create Profile', 'Browse Opportunities', 'Vendor Resources', 'Best Practices', 'Analytics'],
  'Company': ['About Us', 'Careers', 'Contact Us', 'Blog', 'Press Kit'],
  'Support': ['Help Center', 'FAQs', 'Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

const HREFS = {
  'Post a Need': '/create-need', 'Browse Vendors': '/browse', 'How It Works': '/how-it-works',
  'Success Stories': '/testimonials', 'Pricing': '/pricing', 'Create Profile': '/signup',
  'Browse Opportunities': '/browse', 'Vendor Resources': '/learn', 'Best Practices': '/tips',
  'Analytics': '/dashboard', 'About Us': '/about', 'Careers': '#', 'Contact Us': '/contact',
  'Blog': '#', 'Press Kit': '#', 'Help Center': '#', 'FAQs': '/faq',
  'Privacy Policy': '#', 'Terms of Service': '#', 'Cookie Policy': '#',
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <img src={logo} alt="SELA" className="footer__logo" />
          <p className="footer__tagline">Connecting Egyptian Businesses</p>
          <p className="footer__desc">Egypt's leading B2B procurement platform making business sourcing faster, transparent, and cost-effective.</p>
          <div className="footer__socials">
            <a href="#" className="footer__social" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="#" className="footer__social" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
            <a href="#" className="footer__social" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </a>
            <a href="#" className="footer__social" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>

        {Object.entries(LINKS).map(([col, items]) => (
          <div key={col} className="footer__col">
            <h4 className="footer__col-title">{col}</h4>
            <ul className="footer__col-list">
              {items.map(item => (
                <li key={item}>
                  <a href={HREFS[item] || '#'} className="footer__link">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer__bottom">
        <span className="footer__copy">© 2026 Sela Platform. All rights reserved.</span>
        <span className="footer__lang">English |</span>
      </div>
    </footer>
  );
}