import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Store } from 'lucide-react';
import logo from '../Assets/logorad.svg';
import './SignupRole.css'; 

export default function SignupRole() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate('/signup/details', { state: { role } });
  };

  return (
    <div className="signup-container" dir={i18n.dir()}>
      <nav className="signup-nav">
        <img src={logo} alt="SELA" className="nav-logo" onClick={() => navigate('/')} />
        <div className="progress-container">
          <span className="step-text">{t('step')} 1 {t('of')} 3</span>
          <div className="dots-gap">
            <div className="dot active"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </nav>

      <main className="signup-main">
        <div className="title-section">
          <h1>{t('choose_role')}</h1>
          <p>{t('role_subtitle')}</p>
        </div>

        <div className="role-grid">
          <div className="role-card">
            <div className="icon-wrapper">
              <ShoppingBag size={50} strokeWidth={1.5} />
            </div>
            <h2>{t('role_buyer')}</h2>
            <p>{t('buyer_desc')}</p>
            <button className="select-btn" onClick={() => handleSelect('buyer')}>
              {t('select')}
            </button>
          </div>

          <div className="role-card">
            <div className="icon-wrapper">
              <Store size={50} strokeWidth={1.5} />
            </div>
            <h2>{t('role_vendor')}</h2>
            <p>{t('vendor_desc')}</p>
            <button className="select-btn" onClick={() => handleSelect('vendor')}>
              {t('select')}
            </button>
          </div>
        </div>
      </main>

      <footer className="signup-footer">
        <p className="login-prompt">
          {t('already_have_account')} <button className="login-link" onClick={() => navigate('/login')}>{t('login')}</button>
        </p>
        <div className="footer-links">
          <a href="/terms">{t('terms')}</a>
          <span>|</span>
          <a href="/privacy">{t('privacy')}</a>
        </div>
      </footer>
    </div>
  );
}