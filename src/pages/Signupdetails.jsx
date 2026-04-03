import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import logo from '../Assets/logorad.svg';
import './Auth.css';

export default function SignupDetails() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || 'buyer';
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    const { error } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (error) { setError(error.message); setLoading(false); }
    else navigate('/signup/profile', { state: { role } });
  };

  return (
    <div className="auth__page" dir={i18n.dir()}>
      <nav className="auth__nav">
        <img src={logo} alt="SELA" className="auth__logo" onClick={() => navigate('/')} />
        <div className="auth__progress">
          <span className="auth__step">Step 2 of 3</span>
          <div className="auth__dots">
            <div className="auth__dot auth__dot--active" />
            <div className="auth__dot auth__dot--active" />
            <div className="auth__dot" />
          </div>
        </div>
      </nav>

      <main className="auth__main">
        <h1 className="auth__title">Create Your Account</h1>
        <p className="auth__subtitle">Set up your login credentials</p>

        <div className="auth__social">
          <button className="auth__social-btn">
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <button className="auth__social-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0077B5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            Continue with LinkedIn
          </button>
          <button className="auth__social-btn">
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z" fill="#F25022"/></svg>
            Continue with Microsoft
          </button>
        </div>

        <div className="auth__divider"><span>OR</span></div>

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label">Email Address</label>
            <div className="auth__input-wrap">
              <svg className="auth__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5"/><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5"/></svg>
              <input className="auth__input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="auth__field">
            <label className="auth__label">Password</label>
            <div className="auth__input-wrap">
              <svg className="auth__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5"/></svg>
              <input className="auth__input" type={showPass ? 'text' : 'password'} name="password" placeholder="Enter password" value={form.password} onChange={handleChange} required />
              <button type="button" className="auth__eye" onClick={() => setShowPass(!showPass)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
              </button>
            </div>
          </div>
          <div className="auth__field">
            <label className="auth__label">Confirm Password</label>
            <div className="auth__input-wrap">
              <svg className="auth__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5"/></svg>
              <input className="auth__input" type={showConfirm ? 'text' : 'password'} name="confirm" placeholder="Re-enter password" value={form.confirm} onChange={handleChange} required />
              <button type="button" className="auth__eye" onClick={() => setShowConfirm(!showConfirm)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.5"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5"/></svg>
              </button>
            </div>
          </div>
          {error && <p className="auth__error">{error}</p>}
          <button type="submit" className="auth__btn" disabled={loading}>{loading ? '...' : 'Create Account'}</button>
          <p className="auth__switch">Already have an account? <span className="auth__link" onClick={() => navigate('/login')}>Sign in</span></p>
        </form>
      </main>

      <div className="auth__nav-btns">
        <button className="auth__back" onClick={() => navigate('/signup/role')}>Back</button>
        <button className="auth__continue" onClick={() => navigate('/signup/profile', { state: { role } })}>Continue</button>
      </div>

      <footer className="auth__footer">
        <div className="auth__footer-links">
          <a href="/terms">Terms</a><span>|</span><a href="/privacy">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}