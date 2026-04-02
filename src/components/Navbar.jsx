import { useTranslation } from 'react-i18next';
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

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = next;
  };

  return (
    <div className="navbar_container">
      <div className="nav_logo_img">
        <a href="/"><img src={logo} alt="SELA" style={{ height: '100%', width: 'auto' }} /></a>
      </div>

      <ul className="nav_links_list">
        {NAV_LINKS.map((link) => (
          <li key={link.key}>
            <a href={link.to}>{t(link.key)}</a>
          </li>
        ))}
      </ul>

      <div className="nav_right_section">
        <div className="nav_lang_btn" onClick={toggleLang}>
          <span className={i18n.language === 'en' ? 'active_lang' : ''}
            style={{ cursor: 'pointer' }}>EN</span>
          <span className="lang_separator">/</span>
          <span className={i18n.language === 'ar' ? 'active_lang' : ''}
            style={{ cursor: 'pointer' }}>AR</span>
        </div>
        <a href="/login"><button className="nav_login_btn">{t('login')}</button></a>
        <a href="/signup"><button className="nav_cta_btn">{t('get_started')}</button></a>
      </div>
    </div>
  );
}