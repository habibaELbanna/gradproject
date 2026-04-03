import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import logo from '../Assets/logorad.svg';
import './Auth.css';

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: form.email, password: form.password 
    });
    if (error) { setError(error.message); setLoading(false); return; }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();
    if (profile?.role === 'vendor') navigate('/vendor/dashboard');
    else navigate('/buyer/dashboard');
  };

  return (
    <div className="auth__page" dir={i18n.dir()}>
      <nav className="auth__nav">
        <img src={logo} alt="SELA" className="auth__logo" onClick={() => navigate('/')} />
        <div className="auth__progress">
          <span className="auth__step">Step 1 of 3</span>
          <div className="auth__dots">
            <div className="auth__dot auth__dot--active" />
            <div className="auth__dot" />
            <div className="auth__dot" />
          </div>
        </div>
      </nav>

      <main className="auth__main">
        <h1 className="auth__title">welcome back</h1>
        <p className="auth__subtitle">How are u today?</p>

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label">Email Address</label>
            <div className="auth__input-wrap">
              <svg className="auth__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.5"/><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5"/></svg>
              <input className="auth__input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div className="auth__field">
            <label className="auth__label">Password</label>
            <div className="auth__input-wrap">
              <svg className="auth__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5"/></svg>
              <input className="auth__input" type={showPass ? 'text' : 'password'} name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} />
              <button type="button" className="auth__eye" onClick={() => setShowPass(!showPass)}>
                {showPass
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.5"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
                }
              </button>
            </div>
            <button type="button" className="auth__forgot" onClick={() => navigate('/forgot-password')}>Forgot Password?</button>
          </div>

          {error && <p className="auth__error">{error}</p>}
          <button type="submit" className="auth__btn" disabled={loading}>{loading ? '...' : 'Sign In'}</button>
          <p className="auth__switch">Don't have an account? <span className="auth__link" onClick={() => navigate('/signup/role')}>Sign up</span></p>
        </form>
      </main>

      <footer className="auth__footer">
        <div className="auth__footer-links">
          <a href="/terms">Terms</a><span>|</span><a href="/privacy">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}