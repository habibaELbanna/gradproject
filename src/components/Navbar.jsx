import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import logo from '../Assets/logorad.svg';
import './Navbar.css';

const NAV_LINKS = [
  { key: 'nav_home', to: '/' },
  { key: 'nav_about', to: '/about' },
  { key: 'nav_pricing', to: '/pricing' },
  { key: 'nav_features', to: '/features' },
  { key: 'nav_how', to: '/how-it-works' },
  { key: 'nav_contact', to: '/contact' },
  { key: 'nav_learn', to: '/learn' },
  { key: 'nav_tips', to: '/tips' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = next;
  };

  return (
    <div className="navbar_container">
      <div className="nav_logo_img">
        <img src={logo} alt="SELA" style={{ height: '100%', width: 'auto', cursor: 'pointer' }} onClick={() => navigate('/')} />
      </div>

      <ul className={`nav_links_list${menuOpen ? ' nav_links_list--open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <li key={link.key}>
            <a href={link.to} onClick={() => setMenuOpen(false)}>{t(link.key)}</a>
          </li>
        ))}
        <li className="nav_mobile_actions">
          <div className="nav_lang_btn" onClick={toggleLang}>
            <span className={i18n.language === 'en' ? 'active_lang' : ''}>EN</span>
            <span className="lang_separator">/</span>
            <span className={i18n.language === 'ar' ? 'active_lang' : ''}>AR</span>
          </div>
          <button className="nav_login_btn" onClick={() => { setMenuOpen(false); navigate('/login'); }}>{t('login')}</button>
          <button className="nav_cta_btn" onClick={() => { setMenuOpen(false); navigate('/signup/role'); }}>{t('get_started')}</button>
        </li>
      </ul>

      <div className="nav_right_section">
        <div className="nav_lang_btn" onClick={toggleLang}>
          <span className={i18n.language === 'en' ? 'active_lang' : ''} style={{ cursor: 'pointer' }}>EN</span>
          <span className="lang_separator">/</span>
          <span className={i18n.language === 'ar' ? 'active_lang' : ''} style={{ cursor: 'pointer' }}>AR</span>
        </div>
        <button className="nav_login_btn" onClick={() => navigate('/login')}>{t('login')}</button>
        <button className="nav_cta_btn" onClick={() => navigate('/signup/role')}>{t('get_started')}</button>
      </div>

      <button className="nav_burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span className={`nav_burger_line${menuOpen ? ' nav_burger_line--open' : ''}`} />
        <span className={`nav_burger_line${menuOpen ? ' nav_burger_line--open' : ''}`} />
        <span className={`nav_burger_line${menuOpen ? ' nav_burger_line--open' : ''}`} />
      </button>
    </div>
  );
}