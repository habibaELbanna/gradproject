import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/Dashboardlayout';
import './Buyerprofile.css';

const SAVED_VENDORS = [
  { name: 'BuildRight Construction', category: 'Construction & Building', rating: 4.8, reviews: 245, saved: '1 week ago' },
  { name: 'Elite Builders', category: 'Construction & Renovation', rating: 4.7, reviews: 203, saved: '2 weeks ago' },
  { name: 'TechSupply Pro', category: 'Office Supplies', rating: 4.6, reviews: 178, saved: '3 weeks ago' },
  { name: 'Digital Marketing Hub', category: 'Marketing Services', rating: 4.5, reviews: 156, saved: '1 month ago' },
  { name: 'Prime Catering Co.', category: 'Food & Beverage', rating: 4.9, reviews: 312, saved: '1 month ago' },
  { name: 'ITSolutions Egypt', category: 'IT Services', rating: 4.7, reviews: 267, saved: '2 months ago' },
];

const ACTIVITIES = [
  { icon: '📄', text: 'Posted need "Office Furniture for 50 Employees"', time: '2 hours ago' },
  { icon: '✅', text: 'Accepted proposal from BuildRight Construction', time: '1 day ago' },
  { icon: '⭐', text: 'Rated vendor BuildRight 5 stars', time: '1 day ago' },
  { icon: '💬', text: 'Sent message to ConstructPro Egypt', time: '3 days ago' },
  { icon: '🔖', text: 'Saved vendor "Elite Builders"', time: '5 days ago' },
  { icon: '📄', text: 'Posted need "IT Equipment Purchase"', time: '1 week ago' },
  { icon: '✅', text: 'Completed project "Corporate Catering"', time: '2 weeks ago' },
  { icon: '💰', text: 'Payment processed - EGP 12,500', time: '2 weeks ago' },
];

const NEEDS = [
  { title: 'Office Furniture for 50 Employees', category: 'Office Supplies', budgetMin: 15000, budgetMax: 25000, posted: '2 hours ago', proposals: 3, status: 'active' },
  { title: 'IT Equipment Purchase', category: 'Electronics', budgetMin: 30000, budgetMax: 50000, posted: '1 week ago', proposals: 12, status: 'active' },
  { title: 'Marketing Campaign Services', category: 'Marketing', budgetMin: 8000, budgetMax: 15000, posted: '2 weeks ago', proposals: 18, status: 'closed' },
  { title: 'Corporate Catering Services', category: 'Food & Beverage', budgetMin: 5000, budgetMax: 8000, posted: '3 weeks ago', proposals: 8, status: 'closed' },
];

export default function BuyerProfile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [needsFilter, setNeedsFilter] = useState('all');
  const [showActivity, setShowActivity] = useState(false);
  const [profile, setProfile] = useState({ full_name: 'Ahmed Hassan', email: '', phone: '', is_verified: true });
  const [company, setCompany] = useState({ name_en: 'TechCorp Egypt', description_en: '', website: '' });
  const [stats, setStats] = useState({ needsPosted: 24, projectsCompleted: 12, vendorsWorked: 18, avgRating: 4.6 });
  const [needs, setNeeds] = useState(NEEDS);
  const [savedVendors, setSavedVendors] = useState(SAVED_VENDORS);
  const [showActivity2, setShowActivity2] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (prof) setProfile(prof);
        const { data: comp } = await supabase.from('companies').select('*').eq('owner_id', user.id).single();
        if (comp) setCompany(comp);
        const { data: needsData } = await supabase.from('needs').select('*').order('created_at', { ascending: false });
        if (needsData) {
          setStats(s => ({ ...s, needsPosted: needsData.length }));
          setNeeds(needsData.slice(0, 6).map(n => ({
            title: n.title_en, category: n.category_id,
            budgetMin: n.budget_min || 0, budgetMax: n.budget_max_egp || 0,
            posted: new Date(n.created_at).toLocaleDateString(),
            proposals: 0, status: n.status,
          })));
        }
        const { data: savedData } = await supabase.from('saved_items').select('*').eq('user_id', user.id).eq('entity_type', 'vendor');
        if (savedData) setStats(s => ({ ...s, vendorsWorked: savedData.length || 18 }));
      } catch(e) { console.error(e); }
    }
    fetchProfile();
  }, []);

  const statusColor = s => ({ active: '#4CAF50', closed: '#555', expired: '#ff4444' }[s] || '#555');
  const filteredNeeds = needsFilter === 'all' ? needs : needs.filter(n => n.status === needsFilter);

  const breadcrumb = [{ label: 'Home', path: '/' }, { label: 'My Profile' }];

  return (
    <DashboardLayout breadcrumb={breadcrumb} pageTitle="My Profile">
      <div className="bp__wrap">

        {/* Profile Header */}
        <div className="bp__hero">
          <div className="bp__hero-left">
            <div className="bp__avatar-wrap">
              <div className="bp__avatar">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <button className="bp__avatar-upload">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </button>
            </div>
            <div>
              <div className="bp__name-row">
                <h1 className="bp__name">{profile.full_name}</h1>
                {profile.is_verified && (
                  <span className="bp__verified">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    Verified
                  </span>
                )}
              </div>
              <span className="bp__role-badge">Buyer</span>
              <p className="bp__company">Company: {company.name_en}</p>
              <p className="bp__member">Member since: January 2024</p>
            </div>
          </div>
          <div className="bp__hero-actions">
            <button className="bp__btn-primary">Edit Profile</button>
            <button className="bp__btn-secondary">Share Profile</button>
            <button className="bp__btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="bp__stats">
          {[
            { value: stats.needsPosted, label: 'Needs Posted', color: '#00A7E5' },
            { value: stats.projectsCompleted, label: 'Projects Completed', color: '#00A7E5' },
            { value: stats.vendorsWorked, label: 'Vendors Worked With', color: '#00A7E5' },
            { value: `${stats.avgRating} ★`, label: 'Average Rating Given', color: '#FFB800' },
          ].map((s, i) => (
            <div key={i} className="bp__stat">
              <span className="bp__stat-value" style={{ color: s.color }}>{s.value}</span>
              <span className="bp__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bp__tabs">
          {['overview', 'myneeds', 'savedvendors', 'settings'].map(tab => (
            <button key={tab} className={`bp__tab ${activeTab === tab ? 'bp__tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}>
              {tab === 'overview' ? t('view_details') : tab === 'myneeds' ? t('my_needs') : tab === 'savedvendors' ? t('saved_vendors') : t('account_settings')}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="bp__overview">
            <div className="bp__overview-left">
              <div className="bp__card">
                <div className="bp__card-header">
                  <h3>About</h3>
                  <button className="bp__edit-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                </div>
                <p className="bp__about-text">{company.description_en || 'TechCorp Egypt is a leading technology company specializing in software development and IT solutions. We regularly procure office supplies, electronics, and professional services to support our growing team and operations.'}</p>
              </div>

              <div className="bp__card">
                <div className="bp__card-header">
                  <h3>Industries We Procure From</h3>
                  <button className="bp__edit-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                </div>
                <div className="bp__tags">
                  {['Office Supplies', 'Electronics', 'Construction', 'Marketing', 'IT Services', 'Food & Beverage', 'Professional Services', 'Furniture'].map(tag => (
                    <span key={tag} className="bp__tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="bp__card">
                <div className="bp__card-header">
                  <h3>Procurement Preferences</h3>
                  <button className="bp__edit-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                </div>
                {[
                  { label: 'Typical budget range', value: 'EGP 10,000 - 50,000' },
                  { label: 'Preferred delivery time', value: '2-3 weeks' },
                  { label: 'Payment terms', value: 'Net 30' },
                ].map((p, i) => (
                  <div key={i} className="bp__pref-row">
                    <span className="bp__pref-label">{p.label}</span>
                    <span className="bp__pref-value">{p.value}</span>
                  </div>
                ))}
              </div>

              <div className="bp__card">
                <h3>Recent Activity</h3>
                <div className="bp__activities">
                  {(showActivity ? ACTIVITIES : ACTIVITIES.slice(0, 5)).map((a, i) => (
                    <div key={i} className="bp__activity">
                      <div className="bp__activity-icon">{a.icon}</div>
                      <div>
                        <p className="bp__activity-text">{a.text}</p>
                        <p className="bp__activity-time">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="bp__show-more" onClick={() => setShowActivity(!showActivity)}>
                  {showActivity ? 'Show Less' : 'Show More'}
                </button>
              </div>
            </div>

            <div className="bp__overview-right">
              <div className="bp__card">
                <div className="bp__card-header">
                  <h3>{t('contact_info')}</h3>
                  <button className="bp__edit-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                </div>
                {[
                  { icon: '✉', value: profile.email || 'ahmed@techcorp.eg' },
                  { icon: '📞', value: profile.phone || '+20 100 123 4567' },
                  { icon: '🌐', value: company.website || 'www.techcorp.eg' },
                  { icon: '📍', value: 'Smart Village, 6th October City, Giza, Egypt' },
                ].map((c, i) => (
                  <div key={i} className="bp__contact-row">
                    <span className="bp__contact-icon">{c.icon}</span>
                    <span className="bp__contact-value">{c.value}</span>
                  </div>
                ))}
              </div>

              <div className="bp__card">
                <div className="bp__card-header">
                  <h3>Company Details</h3>
                  <button className="bp__edit-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                </div>
                {[
                  { label: 'Company name', value: company.name_en },
                  { label: 'Industry', value: 'Technology' },
                  { label: 'Company size', value: '50-100 employees' },
                  { label: 'Tax ID', value: '••••••1234' },
                ].map((d, i) => (
                  <div key={i} className="bp__detail-row">
                    <span className="bp__detail-label">{d.label}</span>
                    <span className="bp__detail-value">{d.value}</span>
                  </div>
                ))}
              </div>

              <div className="bp__card">
                <h3>Account Statistics</h3>
                {[
                  { label: 'Total spent', value: 'EGP 145,000' },
                  { label: 'Active needs', value: '3' },
                  { label: 'Pending proposals', value: '24' },
                  { label: 'Favorite vendors', value: '8' },
                ].map((s, i) => (
                  <div key={i} className="bp__detail-row">
                    <span className="bp__detail-label">{s.label}</span>
                    <span className="bp__detail-value">{s.value}</span>
                  </div>
                ))}
              </div>

              <div className="bp__card">
                <h3>Verification Status</h3>
                {['Email', 'Phone', 'Business', 'Tax ID'].map(item => (
                  <div key={item} className="bp__verify-row">
                    <span className="bp__verify-label">{item}</span>
                    <span className="bp__verify-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      Verified
                    </span>
                  </div>
                ))}
              </div>

              <div className="bp__card">
                <div className="bp__card-header">
                  <h3>{t('privacy_settings')}</h3>
                  <button className="bp__edit-link">Edit Privacy</button>
                </div>
                {[
                  { label: 'Profile visibility', value: 'Public' },
                  { label: 'Show email', value: 'Yes' },
                  { label: 'Show phone', value: 'No' },
                ].map((p, i) => (
                  <div key={i} className="bp__detail-row">
                    <span className="bp__detail-label">{p.label}</span>
                    <span className="bp__detail-value">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MY NEEDS TAB */}
        {activeTab === 'myneeds' && (
          <div className="bp__needs-wrap">
            <div className="bp__needs-filters">
              {['all', 'active', 'closed', 'expired'].map(f => (
                <button key={f} className={`bp__filter-btn ${needsFilter === f ? 'bp__filter-btn--active' : ''}`}
                  onClick={() => setNeedsFilter(f)} style={{ textTransform: 'capitalize' }}>{f}</button>
              ))}
            </div>
            <div className="bp__needs-grid">
              {filteredNeeds.map((n, i) => (
                <div key={i} className="bp__need-card">
                  <div className="bp__need-top">
                    <h4 className="bp__need-title">{n.title}</h4>
                    <span className="bp__need-status" style={{ background: statusColor(n.status) + '22', color: statusColor(n.status) }}>{n.status}</span>
                  </div>
                  <div className="bp__need-rows">
                    <div className="bp__need-row"><span>Category</span><span>{n.category}</span></div>
                    <div className="bp__need-row"><span>Budget</span><span>EGP {n.budgetMin?.toLocaleString()} - {n.budgetMax?.toLocaleString()}</span></div>
                    <div className="bp__need-row"><span>Posted</span><span>{n.posted}</span></div>
                    <div className="bp__need-row"><span>Proposals</span><span className="bp__proposals-count">{n.proposals} received</span></div>
                  </div>
                  <div className="bp__need-actions">
                    <button className="bp__need-btn">Edit</button>
                    <button className="bp__need-btn">View Proposals</button>
                    <button className="bp__need-delete">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SAVED VENDORS TAB */}
        {activeTab === 'savedvendors' && (
          <div className="bp__saved-grid">
            {savedVendors.map((v, i) => (
              <div key={i} className="bp__saved-card">
                <div className="bp__saved-top">
                  <div className="bp__saved-avatar">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
                  </div>
                  <div>
                    <h4 className="bp__saved-name">{v.name}</h4>
                    <p className="bp__saved-cat">{v.category}</p>
                    <div className="bp__saved-rating">★ {v.rating} <span>({v.reviews} reviews)</span></div>
                  </div>
                </div>
                <p className="bp__saved-time">Saved {v.saved}</p>
                <button className="bp__saved-view" onClick={() => navigate('/vendor/profile')}>View Profile</button>
                <div className="bp__saved-actions">
                  <button className="bp__saved-invite">Invite to Bid</button>
                  <button className="bp__saved-remove">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bp__settings-wrap">
            <div className="bp__settings-card">
              <h3>{t('account_settings')}</h3>
              <div className="bp__settings-row">
                <label>Change Password</label>
                <button className="bp__settings-btn">Update Password</button>
              </div>
              <div className="bp__settings-row">
                <label>Language</label>
                <select className="bp__settings-select" onChange={(e) => {
                  const next = e.target.value;
                  i18n.changeLanguage(next);
                  document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
                  document.documentElement.lang = next;
                }} defaultValue={i18n.language}>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
            </div>

            <div className="bp__settings-card">
              <h3>{t('privacy_settings')}</h3>
              {[
                { label: 'Who can see my profile', type: 'select', options: ['Public', 'Verified Users', 'Private'] },
                { label: 'Who can contact me', type: 'select', options: ['Everyone', 'Verified Users', 'No one'] },
              ].map((s, i) => (
                <div key={i} className="bp__settings-row">
                  <label>{s.label}</label>
                  <select className="bp__settings-select"><option>{s.options[0]}</option>{s.options.slice(1).map(o => <option key={o}>{o}</option>)}</select>
                </div>
              ))}
              <div className="bp__settings-row">
                <label>Show my activity</label>
                <div className="bp__toggle bp__toggle--on" />
              </div>
            </div>

            <div className="bp__settings-card">
              <h3>{t('notification_prefs')}</h3>
              {[
                { label: 'New proposals', value: 'Email + SMS' },
                { label: 'Messages', value: 'Push + Email' },
                { label: 'Weekly summary', value: 'Email' },
                { label: 'Marketing emails', value: 'Off' },
              ].map((n, i) => (
                <div key={i} className="bp__settings-row">
                  <label>{n.label}</label>
                  <span className="bp__settings-value">{n.value}</span>
                </div>
              ))}
            </div>

            <div className="bp__settings-card bp__settings-card--danger">
              <h3>Delete Account</h3>
              <p>Once you delete your account, there is no going back. Please be certain.</p>
              <button className="bp__delete-btn" onClick={async () => {
                if (window.confirm('Are you sure you want to delete your account?')) {
                  await supabase.auth.signOut();
                  navigate('/');
                }
              }}>Delete My Account</button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}