import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import logo from '../Assets/logorad.svg';
import './Auth.css';

const INDUSTRIES = ['Steel & Metals', 'Software & IT', 'Office Furniture', 'Construction', 'Food & Beverages', 'Printing & Packaging', 'Medical Supplies', 'Logistics'];
const CODES = ['+20', '+971', '+966', '+1', '+44'];

export default function SignupProfile() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || 'buyer';
  const [form, setForm] = useState({ fullName: '', company: '', industry: '', taxId: '', phoneCode: '+20', phone: '', agreed: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
const { data: { user } } = await supabase.auth.getUser();
if (!user) { navigate('/analytics'); return; }
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: user.id, email: user.email, full_name: form.fullName,
      role, phone: `${form.phoneCode}${form.phone}`, is_verified: false,
    });
    if (profileError) { setError(profileError.message); setLoading(false); return; }
    const { error: companyError } = await supabase.from('companies').insert({
      owner_id: user.id, name_en: form.company, company_type: role,
    });
    if (companyError) { setError(companyError.message); setLoading(false); return; }
    navigate(role === 'vendor' ? '/analytics' : '/buyer/analytics');
  };

  return (
    <div className="auth__page" dir={i18n.dir()}>
      <nav className="auth__nav">
        <img src={logo} alt="SELA" className="auth__logo" onClick={() => navigate('/')} />
        <div className="auth__progress">
          <span className="auth__step">Step 3 of 3</span>
          <div className="auth__dots">
            <div className="auth__dot auth__dot--active" />
            <div className="auth__dot auth__dot--active" />
            <div className="auth__dot auth__dot--active" />
          </div>
        </div>
      </nav>

      <main className="auth__main">
        <h1 className="auth__title">Complete your profile</h1>
        <p className="auth__subtitle">Set up your login credentials</p>

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label">Full Name <span className="auth__required">*</span></label>
            <div className="auth__input-wrap">
              <svg className="auth__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/></svg>
              <input className="auth__input" name="fullName" placeholder="Ahmed Mohamed" value={form.fullName} onChange={handleChange} />
            </div>
          </div>

          <div className="auth__field">
            <label className="auth__label">Company Name <span className="auth__required">*</span></label>
            <div className="auth__input-wrap">
              <svg className="auth__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.5"/></svg>
              <input className="auth__input" name="company" placeholder="Your Company Ltd." value={form.company} onChange={handleChange} />
            </div>
          </div>

          <div className="auth__field">
            <label className="auth__label">Industry <span className="auth__required">*</span></label>
            <div className="auth__input-wrap">
              <svg className="auth__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5"/></svg>
              <select className="auth__input auth__select" name="industry" value={form.industry} onChange={handleChange}>
                <option value="" disabled>Select industry</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <svg className="auth__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5"/></svg>
            </div>
          </div>

          <div className="auth__field">
            <label className="auth__label">Tax ID</label>
            <div className="auth__input-wrap">
              <svg className="auth__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5"/></svg>
              <input className="auth__input" name="taxId" placeholder="Enter tax registration number" value={form.taxId} onChange={handleChange} />
            </div>
          </div>

          <div className="auth__field">
            <label className="auth__label">Phone Number <span className="auth__required">*</span></label>
            <div className="auth__phone-wrap">
              <div className="auth__input-wrap auth__phone-code">
                <select className="auth__input auth__select" name="phoneCode" value={form.phoneCode} onChange={handleChange}>
                  {CODES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <svg className="auth__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5"/></svg>
              </div>
              <div className="auth__input-wrap auth__phone-num">
                <svg className="auth__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.5"/></svg>
                <input className="auth__input" name="phone" placeholder="123 456 7890" value={form.phone} onChange={handleChange} />
              </div>
            </div>
          </div>

          <label className="auth__checkbox">
            <input type="checkbox" name="agreed" checked={form.agreed} onChange={handleChange} />
            <span>I agree to <a href="/terms" className="auth__link">Terms of Service</a> and <a href="/privacy" className="auth__link">Privacy Policy</a></span>
          </label>

          {error && <p className="auth__error">{error}</p>}
          <button type="submit" className="auth__btn" disabled={loading}>{loading ? '...' : 'Complete Profile'}</button>
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