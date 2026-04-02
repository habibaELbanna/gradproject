import { useTranslation } from 'react-i18next';
import logo from '../Assets/logorad.svg';
import './Footer.css';

export default function Footer() {
  const { t } = useTranslation();

  const LINKS = {
    [t('footer_buyers')]: [
      { key: 'f_post', href: '/create-need' }, { key: 'f_browse_v', href: '/browse' },
      { key: 'f_how', href: '/how-it-works' }, { key: 'f_success', href: '/testimonials' },
      { key: 'f_pricing', href: '/pricing' },
    ],
    [t('footer_vendors')]: [
      { key: 'f_create', href: '/signup' }, { key: 'f_browse_o', href: '/browse' },
      { key: 'f_resources', href: '/learn' }, { key: 'f_best', href: '/tips' },
      { key: 'f_analytics', href: '/dashboard' },
    ],
    [t('footer_company')]: [
      { key: 'f_about', href: '/about' }, { key: 'f_careers', href: '#' },
      { key: 'f_contact', href: '/contact' }, { key: 'f_blog', href: '#' },
      { key: 'f_press', href: '#' },
    ],
    [t('footer_support')]: [
      { key: 'f_help', href: '#' }, { key: 'f_faqs', href: '/faq' },
      { key: 'f_privacy', href: '#' }, { key: 'f_terms', href: '#' },
      { key: 'f_cookie', href: '#' },
    ],
  };

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <img src={logo} alt="SELA" className="footer__logo" />
          <p className="footer__tagline">{t('footer_tagline')}</p>
          <p className="footer__desc">{t('footer_desc')}</p>
          <div className="footer__socials">
            <a href="#" className="footer__social" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="#" className="footer__social" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            </a>
            <a href="#" className="footer__social" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
            </a>
            <a href="#" className="footer__social" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
            </a>
          </div>
        </div>
        {Object.entries(LINKS).map(([col, items]) => (
          <div key={col} className="footer__col">
            <h4 className="footer__col-title">{col}</h4>
            <ul className="footer__col-list">
              {items.map(item => (
                <li key={item.key}><a href={item.href} className="footer__link">{t(item.key)}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer__bottom">
        <span className="footer__copy">{t('footer_copy')}</span>
        <span className="footer__lang">{t('footer_lang')}</span>
      </div>
    </footer>
  );
}