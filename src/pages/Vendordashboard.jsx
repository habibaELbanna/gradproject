import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/Dashboardlayout';
import './Vendordashboard.css';

const STATIC_ACTIVITIES = [
  { icon: '✅', text: 'Proposal accepted for "Office Renovation"', time: '2 hours ago', action: 'View Details', color: '#4CAF50' },
  { icon: '📋', text: 'New need matching your profile posted', time: '4 hours ago', action: 'View Need', color: '#00A7E5' },
  { icon: '💬', text: 'New message from Khalil Industries', time: '1 day ago', action: 'Reply', color: '#00A7E5' },
  { icon: '💰', text: 'Payment received - EGP 48,000', time: '2 days ago', action: 'View Receipt', color: '#4CAF50' },
  { icon: '⭐', text: 'You received a 5-star review from Hana Corp', time: '3 days ago', action: 'View Review', color: '#FFB800' },
];

const STATIC_PROPOSALS = [
  { title: 'Office Renovation', client: 'TechCorp Egypt', category: 'Office Supplies', bid: 18500, status: 'accepted', submitted: 'Feb 20', match: 95 },
  { title: 'IT Equipment Supply', client: 'BuildCo', category: 'Electronics', bid: 42000, status: 'pending', submitted: 'Feb 25', match: 68 },
  { title: 'Corporate Catering', client: 'FinanceHub', category: 'Food & Beverage', bid: 6200, status: 'shortlisted', submitted: 'Feb 22', match: 92 },
];

const STATIC_NEEDS = [
  { title: 'Steel Bars Supply', category: 'Steel & Metals', budget: 500000, proposals: 8, urgency: 'high', daysLeft: 3 },
  { title: 'Software Development', category: 'Software & IT', budget: 200000, proposals: 5, urgency: 'medium', daysLeft: 7 },
  { title: 'Office Furniture', category: 'Office Supplies', budget: 35000, proposals: 12, urgency: 'low', daysLeft: 14 },
];

const DEADLINES = [
  { date: 'Mar 3', text: 'Proposal for "IT Equipment" due' },
  { date: 'Mar 5', text: 'Delivery deadline for Office Renovation' },
  { date: 'Mar 8', text: 'Meeting with Khalil Industries' },
  { date: 'Mar 10', text: 'Invoice due for Corporate Catering' },
];

export default function VendorDashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [userName, setUserName] = useState('Nour');
  const [stats, setStats] = useState({ activeProposals: 12, newNeeds: 34, thisMonth: 48000, winRate: 68 });
  const [proposals, setProposals] = useState(STATIC_PROPOSALS);
  const [activities, setActivities] = useState(STATIC_ACTIVITIES);
  const [browseNeeds, setBrowseNeeds] = useState(STATIC_NEEDS);
  const [deadlines, setDeadlines] = useState(DEADLINES);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
          setUserName(profile?.full_name?.split(' ')[0] || 'Nour');
        }

        const { data: proposalData } = await supabase.from('proposals').select('*');
        if (proposalData) {
          const active = proposalData.filter(p => ['pending', 'shortlisted'].includes(p.proposal_status)).length;
          const won = proposalData.filter(p => p.proposal_status === 'accepted').length;
          const winRate = proposalData.length > 0 ? Math.round((won / proposalData.length) * 100) : 68;
          setStats(s => ({ ...s, activeProposals: active || 12, winRate }));
          setProposals(proposalData.slice(0, 3).map(p => ({
            title: p.quoted_price ? `Proposal #${p.id}` : 'Proposal',
            client: 'Client', category: 'General',
            bid: p.quoted_price, status: p.proposal_status,
            submitted: new Date(p.submitted_at).toLocaleDateString(),
            match: 80,
          })));
        }

        const { data: needsData } = await supabase.from('needs').select('*, categories(name_en)').eq('status', 'open').limit(3);
        if (needsData && needsData.length > 0) {
          setBrowseNeeds(needsData.map(n => ({
            title: n.title_en, category: n.categories?.name_en || 'General',
            budget: n.budget_max_egp, proposals: 0,
            urgency: n.urgency_level, daysLeft: 7,
          })));
        }

        const { data: notifications } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(5);
        if (notifications && notifications.length > 0) {
          setActivities(notifications.map(n => ({
            icon: '🔔', text: n.body_en || n.title_en,
            time: new Date(n.created_at).toLocaleDateString(),
            action: 'View', color: '#00A7E5',
          })));
        }

        const { data: transactions } = await supabase.from('payment_transactions').select('total_amount_egp').eq('status', 'completed');
        if (transactions) {
          const total = transactions.reduce((sum, t) => sum + (t.total_amount_egp || 0), 0);
          setStats(s => ({ ...s, thisMonth: total || 48000 }));
        }

        const { data: deadlineNeeds } = await supabase.from('needs').select('title_en, deadline').not('deadline', 'is', null).order('deadline', { ascending: true }).limit(4);
        if (deadlineNeeds && deadlineNeeds.length > 0) {
          setDeadlines(deadlineNeeds.map(n => ({
            date: new Date(n.deadline).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
            text: `"${n.title_en}" deadline`,
          })));
        }
      } catch(e) { console.error(e); }
    }
    fetchData();
  }, []);

  const statusColor = s => ({ accepted: '#4CAF50', pending: '#FFB800', shortlisted: '#00A7E5', rejected: '#ff4444' }[s] || '#555');
  const urgencyColor = u => ({ high: '#ff4444', medium: '#FFB800', low: '#4CAF50' }[u] || '#555');

  const breadcrumb = [{ label: 'Home', path: '/' }, { label: t('dashboard') }];

  return (
    <DashboardLayout breadcrumb={breadcrumb} pageTitle={t('dashboard')}>
      <div className="vd__wrap">

        {/* Header */}
        <div className="vd__header">
          <div>
            <h1 className="vd__title">{t('dashboard')}</h1>
            <p className="vd__welcome">{t('welcome_back')}, {userName}</p>
          </div>
          <div className="vd__header-btns">
            <button className="vd__btn-primary" onClick={() => navigate('/browse')}>{t('browse_needs') || 'Browse Needs'}</button>
            <button className="vd__btn-secondary" onClick={() => navigate('/analytics')}>{t('nav_analytics') || 'Analytics'}</button>
          </div>
        </div>

        {/* KPIs */}
        <div className="vd__kpis">
          <div className="vd__kpi">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
            <h2 className="vd__kpi-value">{stats.activeProposals}</h2>
            <p className="vd__kpi-label">{t('active_proposals') || 'Active Proposals'}</p>
            <button className="vd__kpi-link" onClick={() => navigate('/proposals')}>{t('view_all')}</button>
          </div>
          <div className="vd__kpi vd__kpi--highlight">
            <div className="vd__kpi-badge">{t('new') || 'new'}</div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <h2 className="vd__kpi-value">{stats.newNeeds}</h2>
            <p className="vd__kpi-label">{t('nav_browse_needs') || 'Browse Needs'}</p>
            <button className="vd__kpi-link" onClick={() => navigate('/browse')}>{t('view_all')}</button>
          </div>
          <div className="vd__kpi">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            <h2 className="vd__kpi-value">EGP {stats.thisMonth.toLocaleString()}</h2>
            <p className="vd__kpi-label">{t('this_month')}</p>
            <span className="vd__kpi-trend">▲ +12%</span>
          </div>
          <div className="vd__kpi">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <h2 className="vd__kpi-value">{stats.winRate}%</h2>
            <p className="vd__kpi-label">{t('win_rate') || 'Win Rate'}</p>
            <span className="vd__kpi-trend">▲ +5%</span>
          </div>
        </div>

        {/* Activity + Browse Needs */}
        <div className="vd__two-col">
          <div className="vd__card">
            <h3 className="vd__card-title">{t('recent_activity')}</h3>
            <div className="vd__activities">
              {activities.map((a, i) => (
                <div key={i} className="vd__activity">
                  <div className="vd__activity-icon">{a.icon}</div>
                  <div className="vd__activity-body">
                    <p className="vd__activity-text">{a.text}</p>
                    <p className="vd__activity-time">{a.time}</p>
                  </div>
                  <button className="vd__activity-action" style={{ color: a.color }}>{a.action}</button>
                </div>
              ))}
            </div>
            <button className="vd__show-more" onClick={() => navigate('/analytics')}>{t('view_all_activity')}</button>
          </div>

          <div className="vd__card">
            <div className="vd__needs-header">
              <h3 className="vd__card-title">{t('nav_browse_needs') || 'Browse Needs'}</h3>
              <div className="vd__tabs">
                {['all', 'high', 'medium'].map(tab => (
                  <button key={tab} className={`vd__tab ${activeTab === tab ? 'vd__tab--active' : ''}`}
                    onClick={() => setActiveTab(tab)}>{tab === 'all' ? t('all') : tab}</button>
                ))}
              </div>
            </div>
            <div className="vd__needs-list">
              {browseNeeds.map((n, i) => (
                <div key={i} className="vd__need-card">
                  <div className="vd__need-top">
                    <h4 className="vd__need-title">{n.title}</h4>
                    <span className="vd__need-urgency" style={{ background: urgencyColor(n.urgency) + '22', color: urgencyColor(n.urgency) }}>{n.urgency}</span>
                  </div>
                  <p className="vd__need-cat">{n.category}</p>
                  <p className="vd__need-budget">EGP {(n.budget || 0).toLocaleString()}</p>
                  <p className="vd__need-meta">{n.proposals} proposals · {n.daysLeft} days left</p>
                  <button className="vd__need-link" onClick={() => navigate('/vendor/create-offering')}>Submit Proposal →</button>
                </div>
              ))}
            </div>
            <button className="vd__show-more" onClick={() => navigate('/browse')}>{t('view_all')}</button>
          </div>
        </div>

        {/* My Proposals */}
        <div className="vd__card">
          <h3 className="vd__card-title">{t('nav_my_proposals') || 'My Proposals'}</h3>
          <div className="vd__table-wrap">
            <table className="vd__table">
              <thead>
                <tr>
                  <th>Project</th><th>Client</th><th>Category</th>
                  <th>Your Bid</th><th>Status</th><th>Submitted</th><th>Match</th><th></th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((p, i) => (
                  <tr key={i}>
                    <td>{p.title}</td>
                    <td>{p.client}</td>
                    <td>{p.category}</td>
                    <td>EGP {(p.bid || 0).toLocaleString()}</td>
                    <td><span className="vd__status" style={{ background: statusColor(p.status) + '22', color: statusColor(p.status) }}>{p.status}</span></td>
                    <td>{p.submitted}</td>
                    <td style={{ color: p.match >= 90 ? '#4CAF50' : p.match >= 70 ? '#FFB800' : '#888', fontWeight: 700 }}>{p.match}%</td>
                    <td><button className="vd__view-btn" onClick={() => navigate('/proposals')}>{t('view_details')}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="vd__show-more" onClick={() => navigate('/proposals')}>{t('view_all')}</button>
        </div>

        {/* Stats + Deadlines */}
        <div className="vd__two-col">
          <div className="vd__card">
            <h3 className="vd__card-title">{t('your_activity')}</h3>
            <div className="vd__stats-list">
              {[
                { label: t('nav_my_proposals') || 'Proposals submitted', value: '18' },
                { label: t('win_rate') || 'Proposals won', value: '12' },
                { label: 'Clients contacted', value: '23' },
                { label: t('projects_completed'), value: '10' },
                { label: t('total_revenue') || 'Revenue this month', value: 'EGP 48,000', color: '#4CAF50' },
                { label: t('avg_satisfaction'), value: '4.8/5' },
              ].map((s, i) => (
                <div key={i} className="vd__stat-row">
                  <span className="vd__stat-label">{s.label}</span>
                  <span className="vd__stat-value" style={{ color: s.color || '#fff' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="vd__card">
            <h3 className="vd__card-title">{t('upcoming_deadlines')}</h3>
            <div className="vd__deadlines">
              {deadlines.map((d, i) => (
                <div key={i} className="vd__deadline-row">
                  <span className="vd__deadline-date">{d.date}</span>
                  <span className="vd__deadline-text">{d.text}</span>
                  <span className="vd__deadline-arrow">›</span>
                </div>
              ))}
            </div>
            <button className="vd__show-more" onClick={() => navigate('/analytics')}>{t('view_calendar')}</button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}