import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/Dashboardlayout';
import './Buyerdashboard.css';

const ACTIVITIES = [
  { icon: '📋', text: '3 new proposals received for "Office Furniture"', time: '2 hours ago', action: 'Review Proposals', color: '#4CAF50' },
  { icon: '👤', text: 'BuildRight Co viewed your need "Construction Materials"', time: '5 hours ago', action: 'View Profile', color: '#00A7E5' },
  { icon: '💬', text: 'New message from TechVendor regarding proposal', time: '1 day ago', action: 'Reply', color: '#00A7E5' },
  { icon: '⭐', text: 'You rated VendorX 5 stars', time: '2 days ago', action: 'View Review', color: '#FFB800' },
  { icon: '📄', text: 'Need "Marketing Services" expired', time: '3 days ago', action: 'Repost', color: '#ff4444' },
];

const ACTIVE_NEEDS = [
  { title: 'Office Furniture for 50 Employees', category: 'Office Supplies', budgetMin: 15000, budgetMax: 25000, proposals: 6, daysLeft: 5, status: 'Open' },
  { title: 'Corporate Catering Services', category: 'Food & Beverage', budgetMin: 5000, budgetMax: 8000, proposals: 12, daysLeft: 1, status: 'Closing Soon' },
  { title: 'IT Equipment Purchase', category: 'Electronics', budgetMin: 30000, budgetMax: 50000, proposals: 5, daysLeft: 10, status: 'Open' },
];

const PROPOSALS = [
  { vendor: 'BuildRight Construction', avatar: 'B', rating: 4.8, reviews: 245, forNeed: 'Office Furniture', price: 18500, timeline: '15 days', match: 95, time: '2 hours ago', desc: 'We specialize in corporate furniture with 10+ years...' },
  { vendor: 'TechSupply Co', avatar: 'T', rating: 4.6, reviews: 128, forNeed: 'IT Equipment', price: 42000, timeline: '20 days', match: 68, time: '5 hours ago', desc: 'Enterprise-grade IT solutions for businesses...' },
  { vendor: 'CaterPro Services', avatar: 'C', rating: 4.9, reviews: 89, forNeed: 'Corporate Catering', price: 6200, timeline: 'Monthly contract', match: 92, time: '1 day ago', desc: 'Premium catering for corporate events and daily...' },
];

const RECOMMENDED = [
  { name: 'Office Solutions Ltd', category: 'Office Supplies', rating: 4.7, reviews: 156, projects: 89, response: '4 hours avg', tag: 'Matches your Office Furniture need', tagColor: '#00A7E5' },
  { name: 'Premium Catering', category: 'Food & Beverage', rating: 4.9, reviews: 203, projects: 134, response: '2 hours', tag: 'High ratings in catering', tagColor: '#4CAF50' },
  { name: 'Tech Gear Pro', category: 'Electronics', rating: 4.6, reviews: 92, projects: 67, response: '6 hours', tag: 'IT equipment specialist', tagColor: '#888' },
  { name: 'BuildMasters', category: 'Construction', rating: 4.8, reviews: 178, projects: 203, response: '3 hours', tag: 'Top construction vendor', tagColor: '#FFB800' },
];

const DEADLINES = [
  { date: 'Mar 3', text: '"Office Furniture" proposals close' },
  { date: 'Mar 5', text: '"Marketing Campaign" proposals close' },
  { date: 'Mar 8', text: 'Meeting with TechSupply' },
  { date: 'Mar 10', text: '"IT Equipment" delivery scheduled' },
];

export default function BuyerDashboard() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [stats, setStats] = useState({ activeNeeds: 8, proposals: 24, thisMonth: 45200, avgResponse: 18 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: needs } = await supabase.from('needs').select('*');
        const { data: proposals } = await supabase.from('proposals').select('*');
        if (needs) setStats(s => ({ ...s, activeNeeds: needs.filter(n => n.status === 'open').length || 8 }));
        if (proposals) setStats(s => ({ ...s, proposals: proposals.filter(p => p.proposal_status === 'pending').length || 24 }));
      } catch(e) {}
    }
    fetchStats();
  }, []);

  const statusColor = s => s === 'Open' ? '#4CAF50' : s === 'Closing Soon' ? '#ff4444' : '#FFB800';
  const matchColor = m => m >= 90 ? '#4CAF50' : m >= 70 ? '#FFB800' : '#888';

  const breadcrumb = [{ label: 'Home', path: '/' }, { label: 'Dashboard' }];

  return (
    <DashboardLayout breadcrumb={breadcrumb} pageTitle="Dashboard">
      <div className="bd__wrap">

        {/* Header */}
        <div className="bd__header">
          <div>
            <h1 className="bd__title">Dashboard</h1>
            <p className="bd__welcome">Welcome back, Ahmed</p>
          </div>
          <div className="bd__header-btns">
            <button className="bd__btn-primary" onClick={() => navigate('/needs/new')}>Post Need</button>
            <button className="bd__btn-secondary" onClick={() => navigate('/browse')}>Browse Vendors</button>
          </div>
        </div>

        {/* KPIs */}
        <div className="bd__kpis">
          <div className="bd__kpi">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
            <h2 className="bd__kpi-value">{stats.activeNeeds}</h2>
            <p className="bd__kpi-label">Active Needs</p>
            <button className="bd__kpi-link" onClick={() => navigate('/needs')}>View All</button>
          </div>
          <div className="bd__kpi bd__kpi--highlight">
            <div className="bd__kpi-badge">12 new</div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            <h2 className="bd__kpi-value">{stats.proposals}</h2>
            <p className="bd__kpi-label">Proposals to Review</p>
            <button className="bd__kpi-link" onClick={() => navigate('/proposals')}>View All</button>
          </div>
          <div className="bd__kpi">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            <h2 className="bd__kpi-value">EGP {stats.thisMonth.toLocaleString()}</h2>
            <p className="bd__kpi-label">This Month</p>
            <span className="bd__kpi-trend">▲ +18%</span>
          </div>
          <div className="bd__kpi">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <h2 className="bd__kpi-value">{stats.avgResponse} hours</h2>
            <p className="bd__kpi-label">Average Response</p>
            <p className="bd__kpi-sub">Platform avg: 24hrs</p>
          </div>
        </div>

        {/* Activity + Active Needs */}
        <div className="bd__two-col">
          <div className="bd__card">
            <h3 className="bd__card-title">Recent Activity</h3>
            <div className="bd__activities">
              {ACTIVITIES.map((a, i) => (
                <div key={i} className="bd__activity">
                  <div className="bd__activity-icon">{a.icon}</div>
                  <div className="bd__activity-body">
                    <p className="bd__activity-text">{a.text}</p>
                    <p className="bd__activity-time">{a.time}</p>
                  </div>
                  <button className="bd__activity-action" style={{ color: a.color }}>{a.action}</button>
                </div>
              ))}
            </div>
            <button className="bd__show-more">View All Activity</button>
          </div>

          <div className="bd__card">
            <div className="bd__needs-header">
              <h3 className="bd__card-title">Active Needs (8)</h3>
              <div className="bd__tabs">
                {['All', 'Open', 'Closing Soon'].map(t => (
                  <button key={t} className={`bd__tab ${activeTab === t ? 'bd__tab--active' : ''}`}
                    onClick={() => setActiveTab(t)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="bd__needs-list">
              {ACTIVE_NEEDS.map((n, i) => (
                <div key={i} className="bd__need-card">
                  <div className="bd__need-top">
                    <h4 className="bd__need-title">{n.title}</h4>
                    <span className="bd__need-status" style={{ background: statusColor(n.status) + '22', color: statusColor(n.status) }}>{n.status}</span>
                  </div>
                  <p className="bd__need-cat">{n.category}</p>
                  <p className="bd__need-budget">EGP {n.budgetMin.toLocaleString()} – {n.budgetMax.toLocaleString()}</p>
                  <p className="bd__need-meta">{n.proposals} proposals received</p>
                  <p className="bd__need-meta">{n.daysLeft} {n.daysLeft === 1 ? 'day' : 'days'} left</p>
                  <button className="bd__need-link">View Proposals →</button>
                </div>
              ))}
            </div>
            <button className="bd__show-more">View All Needs</button>
          </div>
        </div>

        {/* Proposals */}
        <div className="bd__card">
          <h3 className="bd__card-title">Proposals Awaiting Your Review (24)</h3>
          <div className="bd__proposals-grid">
            {PROPOSALS.map((p, i) => (
              <div key={i} className="bd__proposal-card">
                <div className="bd__proposal-top">
                  <div className="bd__proposal-avatar">{p.avatar || (p.vendor ? String(p.vendor)[0] : 'V')}</div>
                  <div>
                    <h4 className="bd__proposal-vendor">{p.vendor}</h4>
                    <div className="bd__proposal-rating">
                      {'★'.repeat(Math.round(p.rating))} <span>{p.rating} ({p.reviews})</span>
                    </div>
                  </div>
                </div>
                <p className="bd__proposal-for">For: {p.forNeed}</p>
                <h3 className="bd__proposal-price">EGP {p.price.toLocaleString()}</h3>
                <p className="bd__proposal-timeline">Timeline: {p.timeline}</p>
                <p className="bd__proposal-match" style={{ color: matchColor(p.match) }}>Match: {p.match}%</p>
                <p className="bd__proposal-time">{p.time}</p>
                <p className="bd__proposal-desc">{p.desc}</p>
                <div className="bd__proposal-actions">
                  <button className="bd__btn-outline">View Details</button>
                  <button className="bd__btn-primary bd__btn-sm">Accept</button>
                </div>
              </div>
            ))}
          </div>
          <button className="bd__show-more">Show 6 more</button>
        </div>

        {/* Recommended */}
        <div className="bd__card">
          <h3 className="bd__card-title">Recommended for You</h3>
          <p className="bd__card-sub">Based on your active needs and past activity</p>
          <div className="bd__recommended-grid">
            {RECOMMENDED.map((v, i) => (
              <div key={i} className="bd__vendor-card">
                <div className="bd__vendor-avatar">{v.name?.[0] || '?'}</div>
                <h4 className="bd__vendor-name">{v.name}</h4>
                <p className="bd__vendor-cat">{v.category}</p>
                <div className="bd__vendor-rating">★ {v.rating} <span>({v.reviews})</span></div>
                <p className="bd__vendor-meta">{v.projects} completed projects</p>
                <p className="bd__vendor-meta">Response: {v.response}</p>
                <p className="bd__vendor-tag" style={{ color: v.tagColor }}>{v.tag}</p>
                <div className="bd__vendor-actions">
                  <button className="bd__btn-outline bd__btn-sm" onClick={() => navigate('/vendor/profile')}>View Profile</button>
                  <button className="bd__btn-primary bd__btn-sm">Invite</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity + Deadlines */}
        <div className="bd__two-col">
          <div className="bd__card">
            <h3 className="bd__card-title">Your Activity This Month</h3>
            <div className="bd__stats-list">
              {[
                { label: 'Needs posted', value: '12' },
                { label: 'Proposals received', value: '67' },
                { label: 'Vendors contacted', value: '23' },
                { label: 'Projects completed', value: '8' },
                { label: 'Money saved', value: 'EGP 8,400', color: '#4CAF50' },
                { label: 'Avg satisfaction', value: '4.6/5' },
              ].map((s, i) => (
                <div key={i} className="bd__stat-row">
                  <span className="bd__stat-label">{s.label}</span>
                  <span className="bd__stat-value" style={{ color: s.color || '#fff' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bd__card">
            <h3 className="bd__card-title">Upcoming Deadlines</h3>
            <div className="bd__deadlines">
              {DEADLINES.map((d, i) => (
                <div key={i} className="bd__deadline-row">
                  <span className="bd__deadline-date">{d.date}</span>
                  <span className="bd__deadline-text">{d.text}</span>
                  <span className="bd__deadline-arrow">›</span>
                </div>
              ))}
            </div>
            <button className="bd__show-more">View Calendar</button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}