import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/Dashboardlayout';
import './Buyerdashboard.css';

const PHOTOS = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/65.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/52.jpg',
  'https://randomuser.me/api/portraits/women/29.jpg',
];
const VendorAvatar = ({ src }) => <img src={src} alt="" loading="lazy" />;

/* ---- Inline icon set (matches site line-icon style) ---- */
const Ic = {
  doc: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>,
  chat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  money: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  message: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v12H5.17L4 17.17z"/></svg>,
  star: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M13 2v7h7"/></svg>,
  bell: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
};
const StarFilled = () => <svg className="bd__star-ic" viewBox="0 0 24 24" fill="#FFB800" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const TrendUp = () => <svg className="bd__trend-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const Chevron = () => <svg className="bd__chev-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;

export default function BuyerDashboard() {
  const { t, i18n } = useTranslation();
  const L = i18n.language === 'ar' ? 'ar' : 'en';
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const [profileName, setProfileName] = useState('');
  const [kpis, setKpis] = useState({ activeNeeds: 0, proposals: 0, thisMonth: 0, avgResponse: 18, newCount: 0 });
  const [needs, setNeeds] = useState(null);
  const [proposals, setProposals] = useState(null);
  const [activities, setActivities] = useState(null);
  const [deadlines, setDeadlines] = useState(null);

  /* ---- Bilingual demo fallbacks (used only when a table returns nothing) ---- */
  const demoActivities = [
    { icon: 'doc', text: t('bd_act_1'), time: '2h', action: t('bd_act_review'), color: '#4CAF50' },
    { icon: 'user', text: t('bd_act_2'), time: '5h', action: t('bd_act_profile'), color: '#00A7E5' },
    { icon: 'message', text: t('bd_act_3'), time: '1d', action: t('bd_act_reply'), color: '#00A7E5' },
    { icon: 'star', text: t('bd_act_4'), time: '2d', action: t('bd_act_view'), color: '#FFB800' },
    { icon: 'file', text: t('bd_act_5'), time: '3d', action: t('bd_act_repost'), color: '#ff4444' },
  ];
  const demoNeeds = [
    { title: t('bd_n1_t'), category: t('bd_n1_c'), budgetMin: 15000, budgetMax: 25000, proposals: 6, daysLeft: 5, status: 'open' },
    { title: t('bd_n2_t'), category: t('bd_n2_c'), budgetMin: 5000, budgetMax: 8000, proposals: 12, daysLeft: 1, status: 'closing' },
    { title: t('bd_n3_t'), category: t('bd_n3_c'), budgetMin: 30000, budgetMax: 50000, proposals: 5, daysLeft: 10, status: 'open' },
  ];
  const demoProposals = [
    { vendor: 'BuildRight Construction', rating: 4.8, reviews: 245, forNeed: t('bd_n1_c'), price: 18500, timeline: '15', match: 95, time: '2h' },
    { vendor: 'TechSupply Co', rating: 4.6, reviews: 128, forNeed: t('bd_n3_c'), price: 42000, timeline: '20', match: 68, time: '5h' },
    { vendor: 'CaterPro Services', rating: 4.9, reviews: 89, forNeed: t('bd_n2_c'), price: 6200, timeline: '30', match: 92, time: '1d' },
  ];
  const demoDeadlines = [
    { date: 'Mar 3', text: t('bd_d1') }, { date: 'Mar 5', text: t('bd_d2') },
    { date: 'Mar 8', text: t('bd_d3') }, { date: 'Mar 10', text: t('bd_d4') },
  ];
  const recommended = [
    { key: 'bd_r1', rating: 4.7, reviews: 156, projects: 89, response: '4h', tagColor: '#00A7E5' },
    { key: 'bd_r2', rating: 4.9, reviews: 203, projects: 134, response: '2h', tagColor: '#4CAF50' },
    { key: 'bd_r3', rating: 4.6, reviews: 92, projects: 67, response: '6h', tagColor: '#888' },
    { key: 'bd_r4', rating: 4.8, reviews: 178, projects: 203, response: '3h', tagColor: '#FFB800' },
  ];
  const monthStats = [
    { label: t('bd_needs_posted'), value: '12' },
    { label: t('bd_proposals_recv2'), value: '67' },
    { label: t('bd_vendors_contacted'), value: '23' },
    { label: t('bd_projects_completed'), value: '8' },
    { label: t('bd_money_saved'), value: 'EGP 8,400', color: '#4CAF50' },
    { label: t('bd_avg_satisfaction'), value: '4.6/5' },
  ];

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: prof } = await supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle();
          if (alive && prof?.full_name) setProfileName(prof.full_name);
        }
      } catch (e) {}

      // Needs (+ category names)
      try {
        const { data: nd } = await supabase.from('needs').select('*, categories(name_en, name_ar)');
        if (alive && nd) {
          const open = nd.filter(n => n.status === 'open');
          const dleft = (dl) => dl ? Math.ceil((new Date(dl) - new Date()) / 86400000) : null;
          const mapped = open.slice(0, 6).map(n => {
            const d = dleft(n.deadline);
            return {
              title: n['title_' + L] || n.title_en,
              category: n.categories ? (n.categories['name_' + L] || n.categories.name_en) : '',
              budgetMin: n.budget_min_egp || 0, budgetMax: n.budget_max_egp || 0,
              proposals: 0, daysLeft: d, status: (d != null && d <= 2) ? 'closing' : 'open',
              id: n.id,
            };
          });
          if (mapped.length) setNeeds(mapped);
          setKpis(k => ({ ...k, activeNeeds: open.length }));
        }
      } catch (e) {}

      // Proposals (+ vendor company, best-effort join)
      try {
        let pr = null;
        const joined = await supabase.from('proposals').select('*, companies:vendor_company_id(*)');
        pr = joined.data;
        if (!pr) { const plain = await supabase.from('proposals').select('*'); pr = plain.data; }
        if (alive && pr) {
          const pending = pr.filter(p => p.proposal_status === 'pending');
          const newCount = pr.filter(p => {
            const c = p.created_at ? new Date(p.created_at) : null;
            return c && (Date.now() - c.getTime()) < 7 * 86400000;
          }).length;
          const mapped = pending.slice(0, 6).map(p => {
            const co = p.companies || {};
            const vname = co['name_' + L] || co.name_en || co.company_name || co.name || 'Vendor';
            return {
              vendor: vname, rating: co.rating || 4.7, reviews: co.review_count || 0,
              avatar: co.logo_url || co.avatar_url || null,
              forNeed: '', price: p.quoted_price || 0,
              timeline: p.timeline_days || p.delivery_days || '', match: p.match_score || 0,
              time: p.created_at ? new Date(p.created_at).toLocaleDateString() : '',
            };
          });
          if (mapped.length) setProposals(mapped);
          setKpis(k => ({ ...k, proposals: pending.length, newCount }));
        }
      } catch (e) {}

      // Recent activity from notifications
      try {
        const { data: nt } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(5);
        if (alive && nt && nt.length) {
          setActivities(nt.map(n => ({
            icon: 'bell',
            text: n['body_' + L] || n['title_' + L] || n.body_en || n.title_en || '',
            time: n.created_at ? new Date(n.created_at).toLocaleDateString() : '',
            action: t('bd_act_view'), color: '#00A7E5',
          })));
        }
      } catch (e) {}

      // Upcoming deadlines from needs
      try {
        const { data: nd2 } = await supabase.from('needs').select('title_en, title_ar, deadline').not('deadline', 'is', null);
        if (alive && nd2 && nd2.length) {
          const up = nd2
            .filter(n => new Date(n.deadline) >= new Date())
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 4)
            .map(n => ({
              date: new Date(n.deadline).toLocaleDateString(L === 'ar' ? 'ar-EG' : 'en', { month: 'short', day: 'numeric' }),
              text: `"${n['title_' + L] || n.title_en}"`,
            }));
          if (up.length) setDeadlines(up);
        }
      } catch (e) {}

      // This-month spend
      try {
        const { data: pay } = await supabase.from('payment_transactions').select('total_amount_egp, status, created_at');
        if (alive && pay) {
          const now = new Date();
          const sum = pay
            .filter(x => x.status === 'completed' && x.created_at && new Date(x.created_at).getMonth() === now.getMonth() && new Date(x.created_at).getFullYear() === now.getFullYear())
            .reduce((a, x) => a + (x.total_amount_egp || 0), 0);
          if (sum) setKpis(k => ({ ...k, thisMonth: sum }));
        }
      } catch (e) {}
    })();
    return () => { alive = false; };
  }, [L, t]);

  const statusColor = s => s === 'open' ? '#4CAF50' : s === 'closing' ? '#ff4444' : '#FFB800';
  const statusLabel = s => s === 'open' ? t('bd_status_open') : s === 'closing' ? t('bd_status_closing') : s;
  const matchColor = m => m >= 90 ? '#4CAF50' : m >= 70 ? '#FFB800' : '#888';

  const needsList = needs || demoNeeds;
  const proposalsList = proposals || demoProposals;
  const activityList = activities || demoActivities;
  const deadlineList = deadlines || demoDeadlines;

  const shownNeeds = needsList.filter(n =>
    activeTab === 'All' ? true : activeTab === 'Open' ? n.status === 'open' : n.status === 'closing');

  const breadcrumb = [{ label: t('bd_home'), path: '/' }, { label: t('bd_title') }];

  return (
    <DashboardLayout breadcrumb={breadcrumb} pageTitle={t('bd_title')}>
      <div className="bd__wrap" dir={i18n.dir()}>

        <div className="bd__header">
          <div>
            <h1 className="bd__title">{t('bd_title')}</h1>
            <p className="bd__welcome">{t('bd_welcome')}{profileName ? `, ${profileName}` : ''}</p>
          </div>
          <div className="bd__header-btns">
            <button className="bd__btn-primary" onClick={() => navigate('/post-need')}>{t('bd_post_need')}</button>
            <button className="bd__btn-secondary" onClick={() => navigate('/browse')}>{t('bd_browse_vendors')}</button>
          </div>
        </div>

        <div className="bd__kpis">
          <div className="bd__kpi">
            <span className="bd__kpi-ic">{Ic.doc}</span>
            <h2 className="bd__kpi-value">{kpis.activeNeeds}</h2>
            <p className="bd__kpi-label">{t('bd_active_needs')}</p>
            <button className="bd__kpi-link" onClick={() => navigate('/browse')}>{t('bd_view_all')}</button>
          </div>
          <div className="bd__kpi bd__kpi--highlight">
            {kpis.newCount > 0 && <div className="bd__kpi-badge">{kpis.newCount} {t('bd_new')}</div>}
            <span className="bd__kpi-ic">{Ic.chat}</span>
            <h2 className="bd__kpi-value">{kpis.proposals}</h2>
            <p className="bd__kpi-label">{t('bd_proposals_review')}</p>
            <button className="bd__kpi-link" onClick={() => navigate('/browse')}>{t('bd_view_all')}</button>
          </div>
          <div className="bd__kpi">
            <span className="bd__kpi-ic">{Ic.money}</span>
            <h2 className="bd__kpi-value">EGP {kpis.thisMonth.toLocaleString()}</h2>
            <p className="bd__kpi-label">{t('bd_this_month')}</p>
            <span className="bd__kpi-trend"><TrendUp /> +18%</span>
          </div>
          <div className="bd__kpi">
            <span className="bd__kpi-ic">{Ic.clock}</span>
            <h2 className="bd__kpi-value">{kpis.avgResponse} {t('bd_hours')}</h2>
            <p className="bd__kpi-label">{t('bd_avg_response')}</p>
            <p className="bd__kpi-sub">{t('bd_platform_avg')}</p>
          </div>
        </div>

        <div className="bd__two-col">
          <div className="bd__card">
            <h3 className="bd__card-title">{t('bd_recent_activity')}</h3>
            <div className="bd__activities">
              {activityList.map((a, i) => (
                <div key={i} className="bd__activity">
                  <div className="bd__activity-icon" style={{ color: a.color }}>{Ic[a.icon] || Ic.bell}</div>
                  <div className="bd__activity-body">
                    <p className="bd__activity-text">{a.text}</p>
                    <p className="bd__activity-time">{a.time}</p>
                  </div>
                  <button className="bd__activity-action" style={{ color: a.color }}>{a.action}</button>
                </div>
              ))}
            </div>
            <button className="bd__show-more">{t('bd_view_all_activity')}</button>
          </div>

          <div className="bd__card">
            <div className="bd__needs-header">
              <h3 className="bd__card-title">{t('bd_active_needs')} ({needsList.length})</h3>
              <div className="bd__tabs">
                {[['All', t('bd_tab_all')], ['Open', t('bd_tab_open')], ['Closing Soon', t('bd_tab_closing')]].map(([k, lbl]) => (
                  <button key={k} className={`bd__tab ${activeTab === k ? 'bd__tab--active' : ''}`} onClick={() => setActiveTab(k)}>{lbl}</button>
                ))}
              </div>
            </div>
            <div className="bd__needs-list">
              {shownNeeds.map((n, i) => (
                <div key={i} className="bd__need-card">
                  <div className="bd__need-top">
                    <h4 className="bd__need-title">{n.title}</h4>
                    <span className="bd__need-status" style={{ background: statusColor(n.status) + '22', color: statusColor(n.status) }}>{statusLabel(n.status)}</span>
                  </div>
                  <p className="bd__need-cat">{n.category}</p>
                  <p className="bd__need-budget">EGP {n.budgetMin.toLocaleString()} – {n.budgetMax.toLocaleString()}</p>
                  <p className="bd__need-meta">{n.proposals} {t('bd_proposals_received')}</p>
                  {n.daysLeft != null && <p className="bd__need-meta">{n.daysLeft} {n.daysLeft === 1 ? t('bd_day_left') : t('bd_days_left')}</p>}
                  <button className="bd__need-link">{t('bd_view_proposals')} →</button>
                </div>
              ))}
            </div>
            <button className="bd__show-more">{t('bd_view_all_needs')}</button>
          </div>
        </div>

        <div className="bd__card">
          <h3 className="bd__card-title">{t('bd_proposals_awaiting')} ({kpis.proposals || proposalsList.length})</h3>
          <div className="bd__proposals-grid">
            {proposalsList.map((p, i) => (
              <div key={i} className="bd__proposal-card">
                <div className="bd__proposal-top">
                  <div className="bd__proposal-avatar"><VendorAvatar src={p.avatar || PHOTOS[i % PHOTOS.length]} /></div>
                  <div>
                    <h4 className="bd__proposal-vendor">{p.vendor}</h4>
                    <div className="bd__proposal-rating">
                      {Array.from({ length: Math.round(p.rating || 0) }).map((_, s) => <StarFilled key={s} />)}
                      <span>{p.rating} ({p.reviews})</span>
                    </div>
                  </div>
                </div>
                {p.forNeed && <p className="bd__proposal-for">{t('bd_for')}: {p.forNeed}</p>}
                <h3 className="bd__proposal-price">EGP {(p.price || 0).toLocaleString()}</h3>
                {p.timeline && <p className="bd__proposal-timeline">{t('bd_timeline')}: {p.timeline} {typeof p.timeline === 'number' || /^\d+$/.test(String(p.timeline)) ? t('bd_days_left').split(' ')[0] : ''}</p>}
                {p.match > 0 && <p className="bd__proposal-match" style={{ color: matchColor(p.match) }}>{t('bd_match')}: {p.match}%</p>}
                <p className="bd__proposal-time">{p.time}</p>
                <div className="bd__proposal-actions">
                  <button className="bd__btn-outline">{t('bd_view_details')}</button>
                  <button className="bd__btn-primary bd__btn-sm">{t('bd_accept')}</button>
                </div>
              </div>
            ))}
          </div>
          <button className="bd__show-more">{t('bd_show_more')}</button>
        </div>

        <div className="bd__card">
          <h3 className="bd__card-title">{t('bd_recommended')}</h3>
          <p className="bd__card-sub">{t('bd_recommended_sub')}</p>
          <div className="bd__recommended-grid">
            {recommended.map((v, i) => {
              const name = t(v.key + '_n');
              return (
                <div key={i} className="bd__vendor-card">
                  <div className="bd__vendor-avatar"><VendorAvatar src={PHOTOS[i % PHOTOS.length]} /></div>
                  <h4 className="bd__vendor-name">{name}</h4>
                  <p className="bd__vendor-cat">{t(v.key + '_c')}</p>
                  <div className="bd__vendor-rating"><StarFilled /> {v.rating} <span>({v.reviews})</span></div>
                  <p className="bd__vendor-meta">{v.projects} {t('bd_completed_projects')}</p>
                  <p className="bd__vendor-meta">{t('bd_response')}: {v.response}</p>
                  <p className="bd__vendor-tag" style={{ color: v.tagColor }}>{t(v.key + '_tag')}</p>
                  <div className="bd__vendor-actions">
                    <button className="bd__btn-outline bd__btn-sm" onClick={() => navigate('/vendor/profile')}>{t('bd_view_profile')}</button>
                    <button className="bd__btn-primary bd__btn-sm">{t('bd_invite')}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bd__two-col">
          <div className="bd__card">
            <h3 className="bd__card-title">{t('bd_activity_month')}</h3>
            <div className="bd__stats-list">
              {monthStats.map((s, i) => (
                <div key={i} className="bd__stat-row">
                  <span className="bd__stat-label">{s.label}</span>
                  <span className="bd__stat-value" style={{ color: s.color || '#fff' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bd__card">
            <h3 className="bd__card-title">{t('bd_deadlines')}</h3>
            <div className="bd__deadlines">
              {deadlineList.map((d, i) => (
                <div key={i} className="bd__deadline-row">
                  <span className="bd__deadline-date">{d.date}</span>
                  <span className="bd__deadline-text">{d.text}</span>
                  <span className="bd__deadline-arrow"><Chevron /></span>
                </div>
              ))}
            </div>
            <button className="bd__show-more">{t('bd_view_calendar')}</button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}