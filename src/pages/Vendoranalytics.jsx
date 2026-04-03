import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/Dashboardlayout';
import './Vendoranalytics.css';

const CATEGORY_DATA = [
  { name: 'Office Supplies', proposals: 24, winRate: 72, avgResponse: '3.5hrs', revenue: 12450 },
  { name: 'Electronics', proposals: 18, winRate: 65, avgResponse: '5.1hrs', revenue: 18200 },
  { name: 'Construction', proposals: 12, winRate: 58, avgResponse: '6.2hrs', revenue: 8900 },
  { name: 'Professional Services', proposals: 10, winRate: 80, avgResponse: '2.8hrs', revenue: 3200 },
  { name: 'Food & Beverage', proposals: 8, winRate: 50, avgResponse: '7.5hrs', revenue: 1800 },
  { name: 'Marketing', proposals: 4, winRate: 75, avgResponse: '4.0hrs', revenue: 700 },
];

const CLIENTS = [
  { name: 'TechCorp Egypt', projects: 8, revenue: 15400, rating: 5, lastProject: '3 days ago' },
  { name: 'BuildRight Co', projects: 6, revenue: 12800, rating: 4.8, lastProject: '1 week ago' },
  { name: 'StartupHub', projects: 5, revenue: 8600, rating: 4.9, lastProject: '2 weeks ago' },
  { name: 'MarketPro Ltd', projects: 4, revenue: 5200, rating: 4.7, lastProject: '1 week ago' },
  { name: 'DesignCo', projects: 3, revenue: 2950, rating: 5, lastProject: '3 weeks ago' },
];

const ACTIVITIES = [
  { text: 'Proposal accepted for "Office Renovation"', time: '2 hrs ago', color: '#00A7E5' },
  { text: 'New proposal submitted to TechCorp', time: '5 hrs ago', color: '#4CAF50' },
  { text: 'Proposal declined for "Marketing Campaign"', time: '1 day ago', color: '#ff4444' },
  { text: 'Payment received - EGP 4,500', time: '1 day ago', color: '#4CAF50' },
  { text: '5-star review from BuildRight', time: '2 days ago', color: '#FFB800' },
  { text: 'Proposal shortlisted for "IT Equipment"', time: '3 days ago', color: '#00A7E5' },
  { text: 'Won proposal "Corporate Catering"', time: '1 week ago', color: '#4CAF50' },
];

const PROPOSALS = [
  { title: 'Office Renovation', client: 'TechCorp', category: 'Office Supplies', bid: 4500, status: 'won', submitted: 'Feb 20', response: '2.5hrs', competitors: 8 },
  { title: 'Marketing Campaign', client: 'StartupX', category: 'Marketing', bid: 2200, status: 'lost', submitted: 'Feb 18', response: '5.1hrs', competitors: 12 },
  { title: 'IT Equipment', client: 'BuildCo', category: 'Electronics', bid: 6800, status: 'pending', submitted: 'Feb 25', response: '3.2hrs', competitors: 5 },
  { title: 'Construction Materials', client: 'ProBuild', category: 'Construction', bid: 8900, status: 'won', submitted: 'Feb 15', response: '4.1hrs', competitors: 7 },
  { title: 'Corporate Catering', client: 'FinanceHub', category: 'Food & Beverage', bid: 1800, status: 'won', submitted: 'Feb 22', response: '1.8hrs', competitors: 15 },
];

function MiniChart() {
  const { t } = useTranslation();
  const [chartType, setChartType] = useState('Line');
  const data = [
    { label: 'Feb 1',  value: 2400 },
    { label: 'Feb 5',  value: 3100 },
    { label: 'Feb 10', value: 4200 },
    { label: 'Feb 15', value: 5900 },
    { label: 'Feb 20', value: 7100 },
    { label: 'Feb 25', value: 8900 },
    { label: 'Mar 1',  value: 10800 },
  ];

  const W = 560, H = 280, padL = 55, padB = 36, padT = 16, padR = 16;
  const chartW = W - padL - padR;
  const chartH = H - padB - padT;
  const maxVal = 12000;
  const yTicks = [0, 3000, 6000, 9000, 12000];

  const getX = (i) => padL + (i / (data.length - 1)) * chartW;
  const getY = (v) => padT + chartH - (v / maxVal) * chartH;
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
  const areaPoints = `${padL},${padT + chartH} ${points} ${getX(data.length - 1)},${padT + chartH}`;

  return (
    <div className="va__chart-container">
      <div className="va__chart-header">
        <h3>{t('revenue_over_time')}</h3>
        <div className="va__chart-type-tabs">
          {['Line', 'Bar', 'Area'].map(t => (
            <button key={t} className={`va__chart-type-btn ${chartType === t ? 'va__chart-type-btn--active' : ''}`}
              onClick={() => setChartType(t)}>{t}</button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="va__chart-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00A7E5" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#00A7E5" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {yTicks.map(tick => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#1e1e1e" strokeWidth="1" strokeDasharray="4,4"/>
              <text x={padL - 8} y={y + 4} textAnchor="end" fill="#555" fontSize="11" fontFamily="Helvetica, Arial">{tick}</text>
            </g>
          );
        })}
        <line x1={padL} y1={padT + chartH} x2={W - padR} y2={padT + chartH} stroke="#2a2a2a" strokeWidth="1"/>
        {(chartType === 'Area' || chartType === 'Line') && <polygon points={areaPoints} fill="url(#areaGrad)"/>}
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
      <div className="va__legend">
        <span className="va__dot" style={{background:'#00A7E5'}}/>
        <span style={{color:'#00A7E5', fontSize:'13px', fontWeight:600}}>revenue</span>
      </div>
    </div>
  );
}

function DonutChart() {
  const { t } = useTranslation();
  const data = [
    {v:34, c:'#4CAF50', label:t('won'),     n:34},
    {v:21, c:'#ff4444', label:t('lost'),    n:21},
    {v:14, c:'#FFB800', label:t('pending'), n:14},
    {v:7,  c:'#888',    label:t('expired'), n:7},
  ];
  const total = data.reduce((s,d)=>s+d.v,0);
  const r=70, cx=100, cy=100, sw=28, circ=2*Math.PI*r;
  let off=0;
  return (
    <div className="va__donut-wrap">
      <svg viewBox="0 0 200 200" className="va__donut">
        {data.map((d,i)=>{
          const dash=(d.v/total)*circ, gap=circ-dash;
          const el=<circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.c} strokeWidth={sw}
            strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-off*circ/total}
            transform={`rotate(-90 ${cx} ${cy})`}/>;
          off+=d.v; return el;
        })}
      </svg>
      <div className="va__donut-legend">
        {data.map(d=>(
          <div key={d.label} className="va__donut-item">
            <span className="va__dot" style={{background:d.c}}/>
            <span className="va__donut-label">{d.label}</span>
            <span className="va__donut-num">{d.n} proposals</span>
          </div>
        ))}
        <p className="va__donut-total">Total: 76 proposals submitted</p>
      </div>
    </div>
  );
}

const statusColor = s => ({won:'#4CAF50',lost:'#ff4444',pending:'#FFB800',shortlisted:'#00A7E5'}[s]||'#555');

export default function VendorAnalytics() {
  const { t, i18n } = useTranslation();
  const [period, setPeriod] = useState('30');
  const [stats, setStats] = useState({ revenue: 45250, activeProposals: 18, winRate: 68, avgResponse: 4.2 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: proposals } = await supabase.from('proposals').select('*');
        if (proposals) {
          const active = proposals.filter(p => ['pending','shortlisted'].includes(p.proposal_status)).length;
          const won = proposals.filter(p => p.proposal_status === 'accepted').length;
          const winRate = proposals.length > 0 ? Math.round((won / proposals.length) * 100) : 68;
          setStats(s => ({ ...s, activeProposals: active || 18, winRate }));
        }
        const { data: transactions } = await supabase.from('payment_transactions').select('total_amount_egp').eq('status', 'completed');
        if (transactions) {
          const total = transactions.reduce((sum, t) => sum + (t.total_amount_egp || 0), 0);
          setStats(s => ({ ...s, revenue: total || 45250 }));
        }
        const { data: reviews } = await supabase.from('reviews').select('*');
        if (reviews && reviews.length > 0) {
          const avgRating = reviews.reduce((sum, r) => sum + r.rating_stars, 0) / reviews.length;
          setStats(s => ({ ...s, avgResponse: avgRating.toFixed(1) }));
        }
      } catch(e) { console.error(e); }
    }
    fetchStats();
  }, []);

  const breadcrumb = [
    { label: 'Home', path: '/' },
    { label: t('dashboard'), path: '/dashboard' },
    { label: t('nav_analytics') },
  ];

  return (
    <DashboardLayout breadcrumb={breadcrumb} pageTitle="Dashboard">
      <div className="va__wrap">

        {/* Page header */}
        <div className="va__page-header">
          <div>
            <h1 className="va__page-title">{t('performance_analytics')}</h1>
            <p className="va__page-sub">{t('updated')} 2 {t('hours_ago')}</p>
          </div>
          <div className="va__period-btns">
            {['7','30','90','Custom'].map(p => (
              <button key={p} className={`va__period-btn ${period===p?'va__period-btn--active':''}`} onClick={()=>setPeriod(p)}>
                {p==='7'?t('last_7_days'):p==='30'?t('days_30'):p==='90'?t('days_90'):t('custom')}
              </button>
            ))}
            <button className="va__export-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {t('export_report')}
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="va__kpis">
          <div className="va__kpi">
            <div className="va__kpi-top">
              <span className="va__kpi-label">{t('total_revenue')}</span>
            </div>
            <h2 className="va__kpi-value">EGP {stats.revenue.toLocaleString()}</h2>
            <div className="va__kpi-trend va__kpi-trend--up">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              +12% from last period
            </div>
            <p className="va__kpi-note">From won proposals</p>
          </div>

          <div className="va__kpi">
            <div className="va__kpi-top">
              <span className="va__kpi-label">{t('active_proposals')}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
            </div>
            <h2 className="va__kpi-value">{stats.activeProposals}</h2>
            <div className="va__kpi-breakdown">
              <div className="va__kpi-row"><span>Pending</span><span>8</span></div>
              <div className="va__kpi-row"><span>Under Review</span><span>6</span></div>
              <div className="va__kpi-row"><span>Negotiation</span><span>4</span></div>
            </div>
          </div>

          <div className="va__kpi">
            <div className="va__kpi-top">
              <span className="va__kpi-label">{t('win_rate')}</span>
            </div>
            <h2 className="va__kpi-value">{stats.winRate}%</h2>
            <div className="va__kpi-trend va__kpi-trend--up">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              +5% from last month
            </div>
            <div className="va__kpi-bar-wrap">
              <div className="va__kpi-bar"><div className="va__kpi-bar-fill" style={{width:`${stats.winRate}%`}}/></div>
              <span className="va__kpi-bar-label">Platform avg: 52%</span>
            </div>
          </div>

          <div className="va__kpi">
            <div className="va__kpi-top">
              <span className="va__kpi-label">{t('avg_response_time')}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h2 className="va__kpi-value">{stats.avgResponse} hours</h2>
            <div className="va__kpi-trend va__kpi-trend--blue">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
              -1.2hrs (faster)
            </div>
            <p className="va__kpi-note">Your goal: &lt;6hrs</p>
          </div>
        </div>

        {/* Charts */}
        <div className="va__charts-row">
          <div className="va__card"><MiniChart/></div>
          <div className="va__card">
            <h3 className="va__section-title">{t('proposal_status')}</h3>
            <DonutChart/>
          </div>
        </div>

        {/* Category table */}
        <div className="va__card">
          <h3 className="va__section-title">{t('performance_by_category')}</h3>
          <div className="va__table-wrap">
            <table className="va__table">
              <thead><tr><th>Category Name</th><th>Proposals Submitted</th><th>Win Rate</th><th>Avg Response Time</th><th>Total Revenue</th></tr></thead>
              <tbody>
                {CATEGORY_DATA.map((row,i)=>(
                  <tr key={i}>
                    <td>{row.name}</td><td>{row.proposals}</td>
                    <td><span style={{color:row.winRate>=70?'#4CAF50':row.winRate>=55?'#FFB800':'#ff4444',fontWeight:700}}>{row.winRate}%</span></td>
                    <td>{row.avgResponse}</td><td>EGP {row.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="va__table-note">Showing 1-10 of 15 categories</p>
        </div>

        {/* Clients + Activity */}
        <div className="va__two-col">
          <div className="va__card">
            <h3 className="va__section-title">{t('best_clients')}</h3>
            {CLIENTS.map((c,i)=>(
              <div key={i} className="va__client-row">
                <div><div className="va__client-name">{c.name}</div><div className="va__client-meta">Projects: {c.projects} · Last project: {c.lastProject}</div></div>
                <div className="va__client-right"><span className="va__client-rating">★ {c.rating}</span><span className="va__client-rev">Revenue: EGP {c.revenue.toLocaleString()}</span></div>
              </div>
            ))}
          </div>
          <div className="va__card">
            <h3 className="va__section-title">{t('recent_activity_label')}</h3>
            {ACTIVITIES.map((a,i)=>(
              <div key={i} className="va__activity-row">
                <span className="va__activity-dot" style={{background:a.color}}/>
                <div><p className="va__activity-text">{a.text}</p><p className="va__activity-time">{a.time}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="va__card">
          <h3 className="va__section-title">{t('ai_insights')}</h3>
          <div className="va__insights">
            {[
              {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>, title:'Improve Response Time', desc:'You respond 2hrs slower than top performers in Office Supplies. Faster responses increase win rate by 15%.', cta:'View Tips'},
              {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="1.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>, title:'Strong Quarter', desc:'Your win rate increased 12% this quarter. Electronics category showing highest growth.', cta:'See Details'},
              {icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFB800" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, title:'Untapped Categories', desc:'Consider expanding to Industrial Machinery. 48 needs posted last month with avg budget EGP 8K.', cta:'Browse Needs'},
            ].map((ins,i)=>(
              <div key={i} className="va__insight-card">
                <div className="va__insight-icon">{ins.icon}</div>
                <h4>{ins.title}</h4><p>{ins.desc}</p>
                <button className="va__insight-cta">{ins.cta}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Proposals */}
        <div className="va__card">
          <div className="va__proposals-header">
            <h3 className="va__section-title">{t('all_proposals')}</h3>
            <div className="va__search-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#555" strokeWidth="1.5"/><path d="M21 21l-4.35-4.35" stroke="#555" strokeWidth="1.5"/></svg>
              <input placeholder="Search by client or project"/>
            </div>
          </div>
          <div className="va__table-wrap">
            <table className="va__table">
              <thead><tr><th>Project Title</th><th>Client Name</th><th>Category</th><th>Your Bid</th><th>Status</th><th>Submitted</th><th>Response Time</th><th>Competitors</th><th>Actions</th></tr></thead>
              <tbody>
                {PROPOSALS.map((p,i)=>(
                  <tr key={i}>
                    <td>{p.title}</td><td>{p.client}</td><td>{p.category}</td>
                    <td>EGP {p.bid.toLocaleString()}</td>
                    <td><span className="va__status" style={{background:statusColor(p.status)+'22',color:statusColor(p.status)}}>{p.status}</span></td>
                    <td>{p.submitted}</td><td>{p.response}</td><td>{p.competitors} bids</td>
                    <td><button className="va__view-btn">{t('view_all')}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="va__table-note">Showing 1-8 of 70 proposals</p>
        </div>

        {/* Targets + Compare */}
        <div className="va__two-col">
          <div className="va__card">
            <h3 className="va__section-title">{t('monthly_targets')}</h3>
            {[
              {label:'Revenue Goal',value:45250,goal:50000,color:'#00A7E5',note:'10% · 5 days remaining'},
              {label:'Proposals Goal',value:18,goal:25,color:'#FFB800',note:'18 / 25'},
              {label:'Win Rate Goal',value:68,goal:70,color:'#00A7E5',note:'68% / 70%'},
              {label:'Attend Rate',value:85,goal:100,color:'#4CAF50',note:'Above target!'},
            ].map((t,i)=>(
              <div key={i} className="va__target">
                <div className="va__target-header"><span>{t.label}</span><span className="va__target-note">{t.note}</span></div>
                <div className="va__target-bar"><div className="va__target-fill" style={{width:`${Math.min((t.value/t.goal)*100,100)}%`,background:t.color}}/></div>
              </div>
            ))}
          </div>
          <div className="va__card">
            <h3 className="va__section-title">{t('compare_performance')}</h3>
            {[{label:'Win Rate',you:68,avg:52,top:85},{label:'Response Time',you:42,avg:65,top:28}].map((c,i)=>(
              <div key={i} className="va__compare">
                <p className="va__compare-label">{c.label}</p>
                {[['You',c.you,'#00A7E5'],['Platform Avg',c.avg,'#555'],['Top 10%',c.top,'#4CAF50']].map(([l,v,col])=>(
                  <div key={l} className="va__compare-row">
                    <span>{l}</span>
                    <div className="va__compare-bar-wrap"><div className="va__compare-bar" style={{width:`${v}%`,background:col}}/></div>
                    <span>{v}%</span>
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