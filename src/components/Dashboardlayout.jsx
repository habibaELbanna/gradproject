import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import logo from '../Assets/logorad.svg';
import './Dashboardlayout.css';

const NAV_ITEMS = (t) => [
  { label: t('dashboard'), path: '/buyer/dashboard', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  )},
  { label: t('nav_browse_needs'), path: '/browse', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
  )},
  { label: t('nav_my_proposals'), path: '/proposals', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
  )},
  { label: t('nav_analytics'), path: '/buyer/analytics', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  )},
  { label: t('nav_messages'), path: '/messages', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
  )},
  { label: t('nav_calendar'), path: '/calendar', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  )},
  { label: t('nav_settings'), path: '/settings', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
  )},
];

export default function DashboardLayout({ children, breadcrumb, pageTitle }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState('buyer');

  useEffect(() => {
    async function getRole() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
          if (profile) setUserRole(profile.role);
        }
      } catch(e) {}
    }
    getRole();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="dash__layout" dir={i18n.dir()}>
      {sidebarOpen && <div className="dash__overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`dash__sidebar ${sidebarOpen ? 'dash__sidebar--open' : ''}`}>
        <nav className="dash__nav">
          {NAV_ITEMS(t).map(item => (
            <div key={item.path}
              className={`dash__nav-item ${location.pathname === item.path ? 'dash__nav-item--active' : ''}`}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}>
              <span className="dash__nav-icon">{item.icon}</span>
              <span className="dash__nav-label">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="dash__sidebar-bottom">
          <button className="dash__submit-btn" onClick={() => navigate('/proposals/new')}>
            {t('submit_proposal')}
          </button>
          <div className="dash__nav-item" onClick={() => navigate('/help')}>
            <span className="dash__nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
            <span className="dash__nav-label">{t('nav_help')}</span>
          </div>
          <div className="dash__nav-item dash__nav-item--logout" onClick={handleLogout}>
            <span className="dash__nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </span>
            <span className="dash__nav-label">{t('nav_logout')}</span>
          </div>
          <button className="dash__lang-btn" onClick={() => {
            const next = i18n.language === 'en' ? 'ar' : 'en';
            i18n.changeLanguage(next);
            document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = next;
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            </svg>
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash__main">
        {/* Topbar */}
        <header className="dash__topbar">
          <div className="dash__topbar-left">
            <button className="dash__burger" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <img src={logo} alt="SELA" className="dash__topbar-logo" onClick={() => navigate('/')} />
            <span className="dash__topbar-page">{pageTitle || 'Dashboard'}</span>
          </div>

          <div className="dash__search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#555" strokeWidth="1.5"/><path d="M21 21l-4.35-4.35" stroke="#555" strokeWidth="1.5"/></svg>
            <input placeholder="Search needs, vendors, proposals..." />
          </div>

          <div className="dash__topbar-icons">
            <button className="dash__icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span className="dash__icon-badge" />
            </button>
            <button className="dash__icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
              <span className="dash__icon-badge" />
            </button>
            <button className="dash__icon-btn" onClick={() => navigate(userRole === 'vendor' ? '/vendor/profile' : '/buyer/profile')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
          </div>
        </header>

        {/* Breadcrumb */}
        {breadcrumb && (
          <div className="dash__breadcrumb">
            {breadcrumb.map((item, i) => (
              <span key={i}>
                {i > 0 && <span className="dash__breadcrumb-sep"> › </span>}
                <span
                  className={i === breadcrumb.length - 1 ? 'dash__breadcrumb--active' : 'dash__breadcrumb-link'}
                  onClick={() => item.path && navigate(item.path)}>
                  {item.label}
                </span>
              </span>
            ))}
          </div>
        )}

        <div className="dash__content">{children}</div>
      </main>
    </div>
  );
}