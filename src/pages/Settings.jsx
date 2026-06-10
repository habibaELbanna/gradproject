import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/Dashboardlayout';
import './Settings.css';

const Icons = {
  account: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  company: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3"/><path d="M9 9v.01M9 12v.01M9 15v.01"/></svg>,
  bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  prefs: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  eye: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>,
  card: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  team: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  lock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  alert: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  check: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
};

const TABS = [
  { id: 'account', label: 'set_account', icon: Icons.account },
  { id: 'company', label: 'set_company', icon: Icons.company },
  { id: 'notifications', label: 'set_notifications', icon: Icons.bell },
  { id: 'prefs', label: 'set_prefs', icon: Icons.eye },
  { id: 'appearance', label: 'set_appearance', icon: Icons.prefs },
  { id: 'billing', label: 'set_billing', icon: Icons.card },
  { id: 'team', label: 'set_team', icon: Icons.team },
  { id: 'security', label: 'set_security', icon: Icons.lock },
  { id: 'danger', label: 'set_danger', icon: Icons.alert },
];

const PREF_DEFAULTS = { email: true, proposals: true, messages: true, summary: false, marketing: false, pubProfile: true, directContact: true, reduceMotion: false, compact: false };

const Toggle = ({ on, onClick }) => (
  <button type="button" role="switch" aria-checked={on} className={`set__switch ${on ? 'set__switch--on' : ''}`} onClick={onClick}><span className="set__switch-knob" /></button>
);
const ToggleRow = ({ title, desc, on, onClick }) => (
  <div className="set__toggle-row">
    <div className="set__toggle-text"><span className="set__toggle-title">{title}</span><span className="set__toggle-desc">{desc}</span></div>
    <Toggle on={on} onClick={onClick} />
  </div>
);

export default function Settings() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState('account');
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('buyer');
  const [verified, setVerified] = useState(false);
  const [account, setAccount] = useState({ full_name: '', phone: '' });
  const [company, setCompany] = useState({ name_en: '', name_ar: '', description_en: '', description_ar: '' });
  const [prefs, setPrefs] = useState(PREF_DEFAULTS);
  const [invites, setInvites] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [pw, setPw] = useState({ next: '', confirm: '' });
  const [delConfirm, setDelConfirm] = useState('');
  const [savingA, setSavingA] = useState(false);
  const [savingC, setSavingC] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    try { setPrefs(p => ({ ...p, ...JSON.parse(localStorage.getItem('sela_prefs') || '{}') })); } catch (e) {}
    try { setInvites(JSON.parse(localStorage.getItem('sela_invites') || '[]')); } catch (e) {}
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id); setEmail(user.email || '');
        const { data: prof } = await supabase.from('profiles').select('full_name, phone, role, is_verified').eq('id', user.id).maybeSingle();
        if (prof) { setAccount({ full_name: prof.full_name || '', phone: prof.phone || '' }); if (prof.role) setRole(prof.role); setVerified(!!prof.is_verified); }
        const { data: comp } = await supabase.from('companies').select('name_en, name_ar, description_en, description_ar').eq('owner_id', user.id).maybeSingle();
        if (comp) setCompany({ name_en: comp.name_en || '', name_ar: comp.name_ar || '', description_en: comp.description_en || '', description_ar: comp.description_ar || '' });
      } catch (e) {}
    })();
  }, []);

  // apply appearance prefs to the document
  useEffect(() => {
    document.documentElement.setAttribute('data-reduce-motion', prefs.reduceMotion ? 'true' : 'false');
    document.documentElement.setAttribute('data-density', prefs.compact ? 'compact' : 'comfortable');
  }, [prefs.reduceMotion, prefs.compact]);

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type: '', text: '' }), 3000); };
  const togglePref = (key) => setPrefs(p => { const next = { ...p, [key]: !p[key] }; try { localStorage.setItem('sela_prefs', JSON.stringify(next)); } catch (e) {} return next; });

  const saveAccount = async () => {
    if (!userId) return; setSavingA(true);
    try { const { error } = await supabase.from('profiles').update({ full_name: account.full_name, phone: account.phone }).eq('id', userId); flash(error ? 'error' : 'success', error ? (error.message || t('set_save_err')) : t('set_saved')); }
    catch (e) { flash('error', t('set_save_err')); } finally { setSavingA(false); }
  };
  const saveCompany = async () => {
    if (!userId) return; setSavingC(true);
    try { const { error } = await supabase.from('companies').update({ name_en: company.name_en, name_ar: company.name_ar, description_en: company.description_en, description_ar: company.description_ar }).eq('owner_id', userId); flash(error ? 'error' : 'success', error ? (error.message || t('set_save_err')) : t('set_saved')); }
    catch (e) { flash('error', t('set_save_err')); } finally { setSavingC(false); }
  };
  const updatePassword = async () => {
    if (pw.next.length < 6) return flash('error', t('set_sec_pw_short'));
    if (pw.next !== pw.confirm) return flash('error', t('set_sec_pw_match'));
    setSavingPw(true);
    try { const { error } = await supabase.auth.updateUser({ password: pw.next }); if (error) flash('error', error.message || t('set_save_err')); else { flash('success', t('set_sec_pw_ok')); setPw({ next: '', confirm: '' }); } }
    catch (e) { flash('error', t('set_save_err')); } finally { setSavingPw(false); }
  };
  const signOut = async () => { try { await supabase.auth.signOut(); } catch (e) {} navigate('/'); };
  const deleteAccount = async () => {
    if (delConfirm.trim().toUpperCase() !== 'DELETE') return;
    flash('error', t('set_delete_pending'));
    setTimeout(async () => { try { await supabase.auth.signOut(); } catch (e) {} navigate('/'); }, 1500);
  };

  const addInvite = () => {
    const e = inviteEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return flash('error', t('set_invite_invalid'));
    const next = Array.from(new Set([...invites, e]));
    setInvites(next); try { localStorage.setItem('sela_invites', JSON.stringify(next)); } catch (er) {}
    setInviteEmail(''); flash('success', t('set_invite_sent'));
  };
  const removeInvite = (e) => { const next = invites.filter(x => x !== e); setInvites(next); try { localStorage.setItem('sela_invites', JSON.stringify(next)); } catch (er) {} };

  const switchLang = (lng) => { localStorage.setItem('sela_lang', lng); i18n.changeLanguage(lng); document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lng; };

  const initials = (account.full_name || email || '?').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const breadcrumb = [{ label: t('bd_home'), path: '/' }, { label: t('bd_title'), path: '/buyer/dashboard' }, { label: t('set_title') }];

  return (
    <DashboardLayout breadcrumb={breadcrumb} pageTitle={t('set_title')}>
      <div className="set" dir={i18n.dir()}>
        <div className="set__profile">
          <div className="set__avatar">{initials}</div>
          <div className="set__profile-info">
            <h1 className="set__name">{account.full_name || t('set_title')}</h1>
            {email && <span className="set__email">{email}</span>}
            <div className="set__badges">
              <span className="set__role">{role === 'vendor' ? t('set_vendor') : t('set_buyer')}</span>
              {verified && <span className="set__verified-badge">{Icons.check}{t('set_verified')}</span>}
            </div>
          </div>
        </div>

        {msg.text && <div className={`set__alert set__alert--${msg.type}`}>{msg.text}</div>}

        <div className="set__layout">
          <div className="set__tabs">
            {TABS.map(tb => (
              <button key={tb.id} type="button" className={`set__tab ${tab === tb.id ? 'set__tab--active' : ''} ${tb.id === 'danger' ? 'set__tab--danger' : ''}`} onClick={() => setTab(tb.id)}>
                <span className="set__tab-icon">{tb.icon}</span><span className="set__tab-label">{t(tb.label)}</span>
              </button>
            ))}
          </div>

          <div className="set__panel">
            {tab === 'account' && (<div>
              <div className="set__panel-head"><h2 className="set__panel-title">{t('set_account')}</h2><p className="set__panel-desc">{t('set_account_desc')}</p></div>
              <div className="set__row">
                <div className="set__field"><label className="set__label">{t('set_full_name')}</label><input className="set__input" value={account.full_name} onChange={e => setAccount(a => ({ ...a, full_name: e.target.value }))} /></div>
                <div className="set__field"><label className="set__label">{t('set_phone')}</label><input className="set__input" value={account.phone} onChange={e => setAccount(a => ({ ...a, phone: e.target.value }))} /></div>
              </div>
              <div className="set__field"><label className="set__label">{t('set_email')}</label><input className="set__input set__input--readonly" value={email} readOnly /><span className="set__note">{t('set_email_note')}</span></div>
              <div className="set__actions"><button type="button" className="set__btn" onClick={saveAccount} disabled={savingA}>{savingA ? t('set_saving') : t('set_save')}</button></div>
            </div>)}

            {tab === 'company' && (<div>
              <div className="set__panel-head"><h2 className="set__panel-title">{t('set_company')}</h2><p className="set__panel-desc">{t('set_company_desc')}</p></div>
              <div className="set__row">
                <div className="set__field"><label className="set__label">{t('set_company_en')}</label><input className="set__input" value={company.name_en} onChange={e => setCompany(c => ({ ...c, name_en: e.target.value }))} /></div>
                <div className="set__field"><label className="set__label">{t('set_company_ar')}</label><input className="set__input" dir="rtl" value={company.name_ar} onChange={e => setCompany(c => ({ ...c, name_ar: e.target.value }))} /></div>
              </div>
              <div className="set__row">
                <div className="set__field"><label className="set__label">{t('set_desc_en')}</label><textarea className="set__input set__textarea" rows={3} value={company.description_en} onChange={e => setCompany(c => ({ ...c, description_en: e.target.value }))} /></div>
                <div className="set__field"><label className="set__label">{t('set_desc_ar')}</label><textarea className="set__input set__textarea" rows={3} dir="rtl" value={company.description_ar} onChange={e => setCompany(c => ({ ...c, description_ar: e.target.value }))} /></div>
              </div>
              <div className="set__actions"><button type="button" className="set__btn" onClick={saveCompany} disabled={savingC}>{savingC ? t('set_saving') : t('set_save')}</button></div>
            </div>)}

            {tab === 'notifications' && (<div>
              <div className="set__panel-head"><h2 className="set__panel-title">{t('set_notifications')}</h2><p className="set__panel-desc">{t('set_notif_desc')}</p></div>
              <div className="set__toggles">
                <ToggleRow title={t('set_notif_email')} desc={t('set_notif_email_d')} on={prefs.email} onClick={() => togglePref('email')} />
                <ToggleRow title={t('set_notif_proposals')} desc={t('set_notif_proposals_d')} on={prefs.proposals} onClick={() => togglePref('proposals')} />
                <ToggleRow title={t('set_notif_messages')} desc={t('set_notif_messages_d')} on={prefs.messages} onClick={() => togglePref('messages')} />
                <ToggleRow title={t('set_notif_summary')} desc={t('set_notif_summary_d')} on={prefs.summary} onClick={() => togglePref('summary')} />
                <ToggleRow title={t('set_notif_marketing')} desc={t('set_notif_marketing_d')} on={prefs.marketing} onClick={() => togglePref('marketing')} />
              </div>
            </div>)}

            {tab === 'prefs' && (<div>
              <div className="set__panel-head"><h2 className="set__panel-title">{t('set_prefs')}</h2><p className="set__panel-desc">{t('set_prefs_desc')}</p></div>
              <div className="set__field"><label className="set__label">{t('set_language')}</label>
                <div className="set__lang">
                  <button type="button" className={`set__lang-btn ${i18n.language !== 'ar' ? 'set__lang-btn--sel' : ''}`} onClick={() => switchLang('en')}>English</button>
                  <button type="button" className={`set__lang-btn ${i18n.language === 'ar' ? 'set__lang-btn--sel' : ''}`} onClick={() => switchLang('ar')}>\u0627\u0644\u0639\u0631\u0628\u064a\u0629</button>
                </div>
              </div>
              <div className="set__sub-head">{t('set_priv_title')}</div>
              <div className="set__toggles">
                <ToggleRow title={t('set_priv_public')} desc={t('set_priv_public_d')} on={prefs.pubProfile} onClick={() => togglePref('pubProfile')} />
                <ToggleRow title={t('set_priv_contact')} desc={t('set_priv_contact_d')} on={prefs.directContact} onClick={() => togglePref('directContact')} />
              </div>
            </div>)}

            {tab === 'appearance' && (<div>
              <div className="set__panel-head"><h2 className="set__panel-title">{t('set_appearance')}</h2><p className="set__panel-desc">{t('set_appearance_desc')}</p></div>
              <div className="set__toggles">
                <ToggleRow title={t('set_reduce_motion')} desc={t('set_reduce_motion_d')} on={prefs.reduceMotion} onClick={() => togglePref('reduceMotion')} />
                <ToggleRow title={t('set_compact')} desc={t('set_compact_d')} on={prefs.compact} onClick={() => togglePref('compact')} />
              </div>
            </div>)}

            {tab === 'billing' && (<div>
              <div className="set__panel-head"><h2 className="set__panel-title">{t('set_billing')}</h2><p className="set__panel-desc">{t('set_billing_desc')}</p></div>
              <div className="set__plan">
                <div className="set__plan-info"><span className="set__plan-label">{t('set_current_plan')}</span><span className="set__plan-name">{t('set_plan_free')}</span></div>
                <button type="button" className="set__btn" onClick={() => navigate('/pricing')}>{t('set_manage_plan')}</button>
              </div>
              <span className="set__note">{t('set_billing_note')}</span>
            </div>)}

            {tab === 'team' && (<div>
              <div className="set__panel-head"><h2 className="set__panel-title">{t('set_team')}</h2><p className="set__panel-desc">{t('set_team_desc')}</p></div>
              <div className="set__member">
                <div className="set__member-avatar">{initials}</div>
                <div className="set__member-info"><span className="set__member-name">{account.full_name || email}</span><span className="set__member-email">{email}</span></div>
                <span className="set__member-role">{t('set_owner')}</span>
              </div>
              <div className="set__invite">
                <input className="set__input" type="email" placeholder={t('set_invite_ph')} value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
                <button type="button" className="set__btn" onClick={addInvite}>{t('set_invite')}</button>
              </div>
              {invites.length === 0 ? <p className="set__note">{t('set_no_invites')}</p> : (
                <div className="set__invite-list">
                  {invites.map(e => (
                    <div key={e} className="set__member">
                      <div className="set__member-avatar set__member-avatar--pending">{e[0].toUpperCase()}</div>
                      <div className="set__member-info"><span className="set__member-name">{e}</span><span className="set__member-email">{t('set_pending')}</span></div>
                      <button type="button" className="set__link-danger" onClick={() => removeInvite(e)}>{t('set_remove')}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>)}

            {tab === 'security' && (<div>
              <div className="set__panel-head"><h2 className="set__panel-title">{t('set_security')}</h2><p className="set__panel-desc">{t('set_sec_desc')}</p></div>
              <div className="set__row">
                <div className="set__field"><label className="set__label">{t('set_sec_new')}</label><input className="set__input" type="password" value={pw.next} onChange={e => setPw(p => ({ ...p, next: e.target.value }))} /></div>
                <div className="set__field"><label className="set__label">{t('set_sec_confirm')}</label><input className="set__input" type="password" value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} /></div>
              </div>
              <div className="set__actions"><button type="button" className="set__btn" onClick={updatePassword} disabled={savingPw}>{savingPw ? t('set_sec_updating') : t('set_sec_update')}</button></div>
              <div className="set__danger">
                <div className="set__toggle-text"><span className="set__toggle-title">{t('set_sec_signout')}</span><span className="set__toggle-desc">{t('set_sec_signout_d')}</span></div>
                <button type="button" className="set__btn-danger" onClick={signOut}>{t('set_sec_signout')}</button>
              </div>
            </div>)}

            {tab === 'danger' && (<div>
              <div className="set__panel-head"><h2 className="set__panel-title">{t('set_danger')}</h2><p className="set__panel-desc">{t('set_danger_desc')}</p></div>
              <div className="set__danger-box">
                <h3 className="set__danger-title">{t('set_delete_title')}</h3>
                <p className="set__danger-desc">{t('set_delete_d')}</p>
                <input className="set__input" value={delConfirm} onChange={e => setDelConfirm(e.target.value)} placeholder={t('set_delete_confirm_ph')} />
                <button type="button" className="set__btn-danger set__btn-danger--solid" disabled={delConfirm.trim().toUpperCase() !== 'DELETE'} onClick={deleteAccount}>{t('set_delete_btn')}</button>
                <span className="set__note">{t('set_delete_note')}</span>
              </div>
            </div>)}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}