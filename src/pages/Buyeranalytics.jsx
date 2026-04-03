import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/Dashboardlayout';
import './Buyeranalytics.css';

const CATEGORY_DATA = [
  { name: 'Office Supplies', needs: 8, proposals: 42, avgBid: 3200, saved: 1800, status: 'closed' },
  { name: 'Construction', needs: 5, proposals: 28, avgBid: 85000, saved: 12000, status: 'open' },
  { name: 'Software & IT', needs: 4, proposals: 19, avgBid: 45000, saved: 8500, status: 'closed' },
  { name: 'Food & Beverage', needs: 6, proposals: 31, avgBid: 12000, saved: 3200, status: 'open' },
  { name: 'Medical Supplies', needs: 3, proposals: 14, avgBid: 28000, saved: 5600, status: 'closed' },
  { name: 'Logistics', needs: 2, proposals: 9, avgBid: 9500, saved: 1200, status: 'open' },
];

const TOP_VENDORS = [
  { name: 'Karim Builders', category: 'Construction', deals: 5, totalSpent: 185000, rating: 4.9, lastDeal: '2 days ago' },
  { name: 'Nour Tech Solutions', category: 'Software & IT', deals: 3, totalSpent: 92000, rating: 4.8, lastDeal: '1 week ago' },
  { name: 'Sami Supplies', category: 'Office Supplies', deals: 8, totalSpent: 48000, rating: 4.6, lastDeal: '3 days ago' },
  { name: 'Omar Print & Pack', category: 'Printing', deals: 4, totalSpent: 32000, rating: 4.7, lastDeal: '2 weeks ago' },
  { name: 'Sara Medical', category: 'Medical', deals: 2, totalSpent: 68000, rating: 4.9, lastDeal: '1 week ago' },
];

const ACTIVITIES = [
  { text: 'New proposal received for "Office Renovation"', time: '1 hr ago', color: '#00A7E5' },
  { text: 'Need "Construction Materials" closed successfully', time: '3 hrs ago', color: '#4CAF50' },
  { text: 'Payment sent to Karim Builders - EGP 85,000', time: '1 day ago', color: '#FFB800' },
  { text: 'Vendor Nour Tech Solutions verified', time: '1 day ago', color: '#4CAF50' },
  { text: '5-star review submitted for Sami Supplies', time: '2 days ago', color: '#FFB800' },
  { text: 'New need "Food Products" posted', time: '3 days ago', color: '#00A7E5' },
  { text: 'Proposal from Sara Medical shortlisted', time: '1 week ago', color: '#00A7E5' },
];

const NEEDS = [
  { title: 'Office Renovation', category: 'Office Supplies', budget: 45000, proposals: 8, status: 'open', posted: 'Feb 20', deadline: 'Mar 5' },
  { title: 'Software Platform', category: 'Software & IT', budget: 200000, proposals: 12, status: 'closed', posted: 'Feb 15', deadline: 'Mar 1' },
  { title: 'Construction Materials', category: 'Construction', budget: 120000, proposals: 6, status: 'open', posted: 'Feb 25', deadline: 'Mar 10' },
  { title: 'Medical Disposables', category: 'Medical', budget: 80000, proposals: 4, status: 'pending', posted: 'Feb 28', deadline: 'Mar 15' },
  { title: 'Organic Food Supply', category: 'Food & Beverage', budget: 35000, proposals: 9, status: 'open', posted: 'Mar 1', deadline: 'Mar 20' },
];

function SpendChart() {
  const [chartType, setChartType] = useState('Line');
  const data = [
    { label: 'Feb 1',  value: 12000 },
    { label: 'Feb 5',  value: 28000 },
    { label: 'Feb 10', value: 45000 },
    { label: 'Feb 15', value: 92000 },
    { label: 'Feb 20', value: 130000 },
    { label: 'Feb 25', value: 175000 },
    { label: 'Mar 1',  value: 215000 },
  ];

  const W = 560, H = 280, padL = 70, padB = 36, padT = 16, padR = 16;
  const chartW = W - padL - padR;
  const chartH = H - padB - padT;
  const maxVal = 250000;
  const yTicks = [0, 50000, 100000, 150000, 200000, 250000];

  const getX = (i) => padL + (i / (data.length - 1)) * chartW;
  const getY = (v) => padT + chartH - (v / maxVal) * chartH;
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
  const areaPoints = `${padL},${padT + chartH} ${points} ${getX(data.length - 1)},${padT + chartH}`;

  const formatY = (v) => v >= 1000 ? `${v/1000}k` : v;

  return (
    <div className="ba__chart-container">
      <div className="ba__chart-header">
        <h3>Spending Over Time</h3>
        <div className="ba__chart-type-tabs">
          {['Line', 'Bar', 'Area'].map(t => (
            <button key={t} className={`ba__chart-type-btn ${chartType === t ? 'ba__chart-type-btn--active' : ''}`}
              onClick={() => setChartType(t)}>{t}</button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="ba__chart-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="baAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00A7E5" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#00A7E5" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {yTicks.map(tick => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#1e1e1e" strokeWidth="1" strokeDasharray="4,4"/>
              <text x={padL - 8} y={y + 4} textAnchor="end" fill="#555" fontSize="11" fontFamily="Helvetica, Arial">{formatY(tick)}</text>
            </g>
          );
        })}
        <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH} stroke="#2a2a2a" strokeWidth="1"/>
        {(chartType === 'Area' || chartType === 'Line') && <polygon points={areaPoints} fill="url(#baAreaGrad)"/>}
        {chartType === 'Bar' && data.map((d, i) => {
          const x = getX(i), y = getY(d.value), bw = 30;
          return <rect key={i} x={x - bw/2} y={y} width={bw} height={padT + chartH - y} fill="rgba(0,167,229,0.5)" rx="2"/>;
        })}
        {chartType !== 'Bar' && <polyline points={points} fill="none" stroke="#00A7E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
        {data.map((d, i) => (
          <g key={i}>
            {chartType !== 'Bar' && <>
              <circle cx={getX(i)} cy={getY(d.value)} r="5" fill="#0e0e0e" stroke="#00A7E5" strokeWidth="2"/>
              <circle cx={getX(i)} cy={getY(d.value)} r="2.5" fill="#00A7E5"/>
            </>}
            <text x={getX(i)} y={H - 6} textAnchor="middle" fill="#555" fontSize="11" fontFamily="Helvetica, Arial">{d.label}</text>
          </g>
        ))}
      </svg>
      <div className="ba__legend">
        <span className="ba__dot" style={{background:'#00A7E5'}}/>
        <span style={{color:'#00A7E5', fontSize:'13px', fontWeight:600}}>spending</span>
      </div>
    </div>
  );
}

function NeedsDonut() {
  const data = [
    {v:12, c:'#4CAF50', label:'Closed',  n:12},
    {v:8,  c:'#00A7E5', label:'Open',    n:8},
    {v:3,  c:'#FFB800', label:'Pending', n:3},
    {v:2,  c:'#888',    label:'Expired', n:2},
  ];
  const total = data.reduce((s,d)=>s+d.v,0);
  const r=70, cx=100, cy=100, sw=28, circ=2*Math.PI*r;
  let off=0;
  return (
    <div className="ba__donut-wrap">
      <svg viewBox="0 0 200 200" className="ba__donut">
        {data.map((d,i)=>{
          const dash=(d.v/total)*circ, gap=circ-dash;
          const el=<circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.c} strokeWidth={sw}
            strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-off*circ/total}
            transform={`rotate(-90 ${cx} ${cy})`}/>;
          off+=d.v; return el;
        })}
      </svg>
      <div className="ba__donut-legend">
        {data.map(d=>(
          <div key={d.label} className="ba__donut-item">
            <span className="ba__dot" style={{background:d.c}}/>
            <span className="ba__donut-label">{d.label}</span>
            <span className="ba__donut-num">{d.n} needs</span>
          </div>
        ))}
        <p className="ba__donut-total">Total: 25 needs posted</p>
      </div>
    </div>
  );
}

const statusColor = s => ({open:'#4CAF50', closed:'#00A7E5', pending:'#FFB800', expired:'#888'}[s]||'#555');

export default function BuyerAnalytics() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [period, setPeriod] = useState('30');
  const [stats, setStats] = useState({ totalSpend: 215000, activeNeeds: 8, savedAmount: 32400, avgProposals: 7.2 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: needs } = await supabase.from('needs').select('*');
        if (needs) {
          const active = needs.filter(n => n.status === 'open').length;
          setStats(s => ({ ...s, activeNeeds: active || 8 }));
        }
        const { data: proposals } = await supabase.from('proposals').select('*');
        if (proposals && needs) {
          const avgProps = needs.length > 0 ? (proposals.length / needs.length).toFixed(1) : 7.2;
          setStats(s => ({ ...s, avgProposals: avgProps }));
        }
        const { data: transactions } = await supabase.from('payment_transactions').select('total_amount_egp').eq('status', 'completed');
        if (transactions) {
          const total = transactions.reduce((sum, t) => sum + (t.total_amount_egp || 0), 0);
          const saved = Math.round(total * 0.13);
          setStats(s => ({ ...s, totalSpend: total || 215000, savedAmount: saved || 32400 }));
        }
      } catch(e) { console.error(e); }
    }
    fetchStats();
  }, []);

  const breadcrumb = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/buyer/dashboard' },
    { label: 'Analytics' },
  ];

  return (
    <DashboardLayout breadcrumb={breadcrumb} pageTitle="Dashboard">
      <div className="ba__wrap">

        {/* Page header */}
        <div className="ba__page-header">
          <div>
            <h1 className="ba__page-title">Procurement Analytics</h1>
            <p className="ba__page-sub">Updated 2 hours ago</p>
          </div>
          <div className="ba__period-btns">
            {['7','30','90','Custom'].map(p => (
              <button key={p} className={`ba__period-btn ${period===p?'ba__period-btn--active':''}`} onClick={()=>setPeriod(p)}>
                {p==='7'?'Last 7 days':p==='30'?'30 days':p==='90'?'90 days':'Custom'}
              </button>
            ))}
            <button className="ba__export-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Report
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="ba__kpis">
          <div className="ba__kpi">
            <div className="ba__kpi-top">
              <span className="ba__kpi-label">Total Spend</span>
            </div>
            <h2 className="ba__kpi-value">EGP {stats.totalSpend.toLocaleString()}</h2>
            <div className="ba__kpi-trend ba__kpi-trend--up">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              +18% from last period
            </div>
            <p className="ba__kpi-note">Across all categories</p>
          </div>

          <div className="ba__kpi">
            <div className="ba__kpi-top">
              <span className="ba__kpi-label">Active Needs</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
            </div>
            <h2 className="ba__kpi-value">{stats.activeNeeds}</h2>
            <div className="ba__kpi-breakdown">
              <div className="ba__kpi-row"><span>Receiving Proposals</span><span>5</span></div>
              <div className="ba__kpi-row"><span>Under Review</span><span>2</span></div>
              <div className="ba__kpi-row"><span>Negotiating</span><span>1</span></div>
            </div>
          </div>

          <div className="ba__kpi">
            <div className="ba__kpi-top">
              <span className="ba__kpi-label">Amount Saved</span>
            </div>
            <h2 className="ba__kpi-value">EGP {stats.savedAmount.toLocaleString()}</h2>
            <div className="ba__kpi-trend ba__kpi-trend--up">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              vs. market average
            </div>
            <div className="ba__kpi-bar-wrap">
              <div className="ba__kpi-bar"><div className="ba__kpi-bar-fill" style={{width:'68%'}}/></div>
              <span className="ba__kpi-bar-label">Savings rate: 13%</span>
            </div>
          </div>

          <div className="ba__kpi">
            <div className="ba__kpi-top">
              <span className="ba__kpi-label">Avg Proposals / Need</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h2 className="ba__kpi-value">{stats.avgProposals}</h2>
            <div className="ba__kpi-trend ba__kpi-trend--up">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              +2.1 from last month
            </div>
            <p className="ba__kpi-note">Platform avg: 5.3</p>
          </div>
        </div>

        {/* Charts */}
        <div className="ba__charts-row">
          <div className="ba__card"><SpendChart/></div>
          <div className="ba__card">
            <h3 className="ba__section-title">Needs Status Breakdown</h3>
            <NeedsDonut/>
          </div>
        </div>

        {/* Category table */}
        <div className="ba__card">
          <h3 className="ba__section-title">Spending by Category</h3>
          <div className="ba__table-wrap">
            <table className="ba__table">
              <thead><tr><th>Category</th><th>Needs Posted</th><th>Proposals Received</th><th>Avg Bid (EGP)</th><th>Amount Saved (EGP)</th><th>Status</th></tr></thead>
              <tbody>
                {CATEGORY_DATA.map((row,i)=>(
                  <tr key={i}>
                    <td>{row.name}</td>
                    <td>{row.needs}</td>
                    <td>{row.proposals}</td>
                    <td>{row.avgBid.toLocaleString()}</td>
                    <td style={{color:'#4CAF50', fontWeight:700}}>{row.saved.toLocaleString()}</td>
                    <td><span className="ba__status" style={{background:statusColor(row.status)+'22',color:statusColor(row.status)}}>{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ba__table-note">Showing 1-6 of 8 categories</p>
        </div>

        {/* Top Vendors + Activity */}
        <div className="ba__two-col">
          <div className="ba__card">
            <h3 className="ba__section-title">Top Vendors</h3>
            {TOP_VENDORS.map((v,i)=>(
              <div key={i} className="ba__vendor-row">
                <div>
                  <div className="ba__vendor-name">{v.name}</div>
                  <div className="ba__vendor-meta">{v.category} · {v.deals} deals · Last: {v.lastDeal}</div>
                </div>
                <div className="ba__vendor-right">
                  <span className="ba__vendor-rating">★ {v.rating}</span>
                  <span className="ba__vendor-spend">EGP {v.totalSpent.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="ba__card">
            <h3 className="ba__section-title">Recent Activity</h3>
            {ACTIVITIES.map((a,i)=>(
              <div key={i} className="ba__activity-row">
                <span className="ba__activity-dot" style={{background:a.color}}/>
                <div><p className="ba__activity-text">{a.text}</p><p className="ba__activity-time">{a.time}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="ba__card">
          <h3 className="ba__section-title">AI-Powered Insights</h3>
          <div className="ba__insights">
            {[
              {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>, title:'Write Detailed Needs', desc:'Needs with detailed descriptions receive 3x more proposals. Add specs, timelines, and budget breakdowns.', cta:'View Tips'},
              {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="1.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>, title:'Strong Savings This Month', desc:'You saved EGP 32,400 vs market prices. Construction category shows highest savings potential.', cta:'See Details'},
              {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFB800" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, title:'New Vendors Available', desc:'12 new verified vendors joined in your top categories this week. Expand your supplier network.', cta:'Browse Vendors'},
            ].map((ins,i)=>(
              <div key={i} className="ba__insight-card">
                <div className="ba__insight-icon">{ins.icon}</div>
                <h4>{ins.title}</h4><p>{ins.desc}</p>
                <button className="ba__insight-cta">{ins.cta}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Needs table */}
        <div className="ba__card">
          <div className="ba__needs-header">
            <h3 className="ba__section-title">All Needs</h3>
            <div className="ba__search-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#555" strokeWidth="1.5"/><path d="M21 21l-4.35-4.35" stroke="#555" strokeWidth="1.5"/></svg>
              <input placeholder="Search by title or category"/>
            </div>
          </div>
          <div className="ba__table-wrap">
            <table className="ba__table">
              <thead><tr><th>Need Title</th><th>Category</th><th>Budget (EGP)</th><th>Proposals</th><th>Status</th><th>Posted</th><th>Deadline</th><th>Actions</th></tr></thead>
              <tbody>
                {NEEDS.map((n,i)=>(
                  <tr key={i}>
                    <td>{n.title}</td><td>{n.category}</td>
                    <td>EGP {n.budget.toLocaleString()}</td>
                    <td>{n.proposals}</td>
                    <td><span className="ba__status" style={{background:statusColor(n.status)+'22',color:statusColor(n.status)}}>{n.status}</span></td>
                    <td>{n.posted}</td><td>{n.deadline}</td>
                    <td><button className="ba__view-btn">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ba__table-note">Showing 1-5 of 25 needs</p>
        </div>

        {/* Targets + Compare */}
        <div className="ba__two-col">
          <div className="ba__card">
            <h3 className="ba__section-title">Monthly Targets</h3>
            {[
              {label:'Budget Goal',value:215000,goal:250000,color:'#00A7E5',note:'EGP 215k / 250k'},
              {label:'Needs Posted',value:8,goal:12,color:'#FFB800',note:'8 / 12'},
              {label:'Savings Goal',value:32400,goal:40000,color:'#4CAF50',note:'EGP 32.4k / 40k'},
              {label:'Vendor Ratings',value:4.7,goal:5,color:'#00A7E5',note:'Avg 4.7 / 5.0'},
            ].map((t,i)=>(
              <div key={i} className="ba__target">
                <div className="ba__target-header"><span>{t.label}</span><span className="ba__target-note">{t.note}</span></div>
                <div className="ba__target-bar"><div className="ba__target-fill" style={{width:`${Math.min((t.value/t.goal)*100,100)}%`,background:t.color}}/></div>
              </div>
            ))}
          </div>
          <div className="ba__card">
            <h3 className="ba__section-title">Compare vs Platform</h3>
            {[
              {label:'Proposals Received / Need',you:7.2,avg:5.3,top:12},
              {label:'Savings Rate %',you:13,avg:8,top:22},
            ].map((c,i)=>(
              <div key={i} className="ba__compare">
                <p className="ba__compare-label">{c.label}</p>
                {[['You',c.you,'#00A7E5'],['Platform Avg',c.avg,'#555'],['Top 10%',c.top,'#4CAF50']].map(([l,v,col])=>(
                  <div key={l} className="ba__compare-row">
                    <span>{l}</span>
                    <div className="ba__compare-bar-wrap"><div className="ba__compare-bar" style={{width:`${(v/c.top)*100}%`,background:col}}/></div>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}