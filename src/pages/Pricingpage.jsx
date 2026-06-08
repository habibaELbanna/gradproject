import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import FAQ from '../components/Faq';
import CTA from '../components/Cta';
import SectionLabel from '../components/Sectionlabel';
import Footer from '../components/Footer';
import '../components/Pricing.css';
import './Pricingpage.css';

const LinesBg = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const nodes = [];
    for (let li = 0; li < 5; li++) {
      for (let i = 0; i < 3; i++) {
        nodes.push({ lineIdx: li, progress: i / 3, speed: 0.0004 * (0.7 + Math.random() * 0.7), size: 2 + Math.random() * 1.5 });
      }
    }
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    function draw() {
      const W = canvas.clientWidth, H = canvas.clientHeight;
      ctx.clearRect(0, 0, W, H);
      const cy = H * 0.5;
      const sq = (v) => cy + (v - cy) * 0.4;
      const paths = [
        { x1: 0, y1: sq(0),      cpx: W*0.5, cpy: sq(H*0.35), x2: W, y2: sq(0) },
        { x1: 0, y1: sq(H*0.28), cpx: W*0.5, cpy: sq(H*0.55), x2: W, y2: sq(H*0.28) },
        { x1: 0, y1: sq(H*0.5),  cpx: W*0.5, cpy: sq(H*0.5),  x2: W, y2: sq(H*0.5) },
        { x1: 0, y1: sq(H*0.72), cpx: W*0.5, cpy: sq(H*0.45), x2: W, y2: sq(H*0.72) },
        { x1: 0, y1: sq(H),      cpx: W*0.5, cpy: sq(H*0.65), x2: W, y2: sq(H) },
      ];
      paths.forEach((p) => {
        ctx.beginPath(); ctx.moveTo(p.x1, p.y1);
        ctx.quadraticCurveTo(p.cpx, p.cpy, p.x2, p.y2);
        ctx.strokeStyle = '#00A7E5'; ctx.lineWidth = 1; ctx.stroke();
      });
      nodes.forEach((node) => {
        node.progress += node.speed;
        if (node.progress > 1) node.progress -= 1;
        const p = paths[node.lineIdx], t = node.progress;
        const x = (1-t)*(1-t)*p.x1 + 2*(1-t)*t*p.cpx + t*t*p.x2;
        const curveY = (1-t)*(1-t)*p.y1 + 2*(1-t)*t*p.cpy + t*t*p.y2;
        const grad = ctx.createRadialGradient(x, curveY, 0, x, curveY, node.size * 5);
        grad.addColorStop(0, 'rgba(255,255,255,0.4)');
        grad.addColorStop(0.3, 'rgba(255,255,255,0.1)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath(); ctx.arc(x, curveY, node.size * 5, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath(); ctx.arc(x, curveY, node.size, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className="pp-lines-canvas" />;
};

const COMPARE = [
  { f: 'pp_cmp_1',  free: '5',            pro: 'pp_unlimited', ent: 'pp_unlimited' },
  { f: 'pp_cmp_2',  free: true,  pro: true,  ent: true },
  { f: 'pp_cmp_3',  free: true,  pro: true,  ent: true },
  { f: 'pp_cmp_4',  free: true,  pro: true,  ent: true },
  { f: 'pp_cmp_5',  free: true,  pro: true,  ent: true },
  { f: 'pp_cmp_6',  free: false, pro: true,  ent: true },
  { f: 'pp_cmp_7',  free: false, pro: true,  ent: true },
  { f: 'pp_cmp_8',  free: false, pro: true,  ent: true },
  { f: 'pp_cmp_9',  free: false, pro: true,  ent: true },
  { f: 'pp_cmp_10', free: false, pro: true,  ent: true },
  { f: 'pp_cmp_11', free: false, pro: false, ent: true },
  { f: 'pp_cmp_12', free: false, pro: false, ent: true },
  { f: 'pp_cmp_13', free: false, pro: false, ent: true },
  { f: 'pp_cmp_14', free: false, pro: false, ent: true },
  { f: 'pp_cmp_15', free: false, pro: false, ent: true },
];

const ROADMAP = [
  { q: 'Q1 2026', items: ['pp_rm_1', 'pp_rm_2'] },
  { q: 'Q2 2026', items: ['pp_rm_3', 'pp_rm_4'] },
  { q: 'Q3 2026', items: ['pp_rm_5', 'pp_rm_6'] },
  { q: 'Q4 2026', items: ['pp_rm_7', 'pp_rm_8'] },
];

const NEWS = [
  { source: 'news_1_source', title: 'news_1_title', date: 'news_1_date' },
  { source: 'news_2_source', title: 'news_2_title', date: 'news_2_date' },
  { source: 'news_3_source', title: 'news_3_title', date: 'news_3_date' },
  { source: 'news_4_source', title: 'news_4_title', date: 'news_4_date' },
];

const Check = () => (<svg className="pp-ic" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>);
const Cross = () => (<svg className="pp-ic" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>);

const Cell = ({ v, t }) => {
  if (v === true) return <Check />;
  if (v === false) return <Cross />;
  return <span className="pp-table__val">{t(v)}</span>;
};

export default function PricingPage() {
  const { t, i18n } = useTranslation();

  const PLANS = [
    { badge: t('plan_starter'), name: t('plan_free'), price: t('plan_free_price'), period: t('plan_month'), desc: t('plan_free_desc'), highlight: false, cta: t('plan_free_cta'), href: '/signup', features: [t('plan_f1'), t('plan_f2'), t('plan_f3'), t('plan_f4'), t('plan_f5')] },
    { badge: t('plan_pro_badge'), name: t('plan_pro'), price: t('plan_pro_price'), period: t('plan_month'), desc: t('plan_pro_desc'), highlight: true, cta: t('plan_pro_cta'), href: '/signup', features: [t('plan_p1'), t('plan_p2'), t('plan_p3'), t('plan_p4'), t('plan_p5'), t('plan_p6')] },
    { badge: t('plan_ent_badge'), name: t('plan_ent'), price: t('plan_ent_price'), period: '', desc: t('plan_ent_desc'), highlight: false, cta: t('plan_ent_cta'), href: '/contact', features: [t('plan_e1'), t('plan_e2'), t('plan_e3'), t('plan_e4'), t('plan_e5')] },
  ];

  return (
    <div className="pp" dir={i18n.dir()}>
      <Navbar />

      <section className="pp-hero">
        <span className="pp-hero__watermark" aria-hidden="true">PRICING</span>
        <h1 className="pp-hero__title">{t('pp_hero_title')}</h1>
        <p className="pp-hero__sub">{t('pp_hero_sub')}</p>
      </section>

      <section className="pp-plans">
        <div className="pricing__cards">
          {PLANS.map((plan, i) => (
            <div key={i} className={`pricing__card ${plan.highlight ? 'pricing__card--highlight' : ''} pricing__card--visible`}>
              <div className={`pricing__badge ${plan.highlight ? 'pricing__badge--highlight' : ''}`}>{plan.badge}</div>
              <div className="pricing__name">{plan.name}</div>
              <div className="pricing__price">
                <span className={`pricing__amount ${plan.highlight ? 'pricing__amount--blue' : ''}`}>{plan.price}</span>
                {plan.period && <span className="pricing__period">{plan.period}</span>}
              </div>
              <p className="pricing__desc">{plan.desc}</p>
              <ul className="pricing__features">
                {plan.features.map((f, fi) => (<li key={fi} className="pricing__feature"><span className="pricing__feature-dot" />{f}</li>))}
              </ul>
              <a href={plan.href} className={`pricing__cta ${plan.highlight ? 'pricing__cta--highlight' : ''}`}>{plan.cta}</a>
            </div>
          ))}
        </div>
      </section>

      <section className="pp-compare">
        <h2 className="pp-heading">{t('pp_compare_heading')}</h2>
        <div className="pp-table">
          <div className="pp-table__row pp-table__row--head">
            <span className="pp-table__feat">{t('pp_col_features')}</span>
            <span>{t('pp_col_free')}</span>
            <span className="pp-table__pro">{t('pp_col_pro')}</span>
            <span>{t('pp_col_ent')}</span>
          </div>
          {COMPARE.map((r, i) => (
            <div key={i} className="pp-table__row">
              <span className="pp-table__feat">{t(r.f)}</span>
              <span><Cell v={r.free} t={t} /></span>
              <span><Cell v={r.pro} t={t} /></span>
              <span><Cell v={r.ent} t={t} /></span>
            </div>
          ))}
        </div>
      </section>

      <section className="pp-roadmap">
        <div className="pp-roadmap__lines"><LinesBg /></div>
        <h2 className="pp-heading">{t('pp_roadmap_heading')}</h2>
        <div className="pp-roadmap-grid">
          {ROADMAP.map((q, i) => (
            <div key={i} className="pp-rm-card">
              <span className="pp-rm-q">{q.q}</span>
              <ul className="pp-rm-list">
                {q.items.map((it, j) => (
                  <li key={j} className="pp-rm-item">
                    <svg className="pp-rm-check" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></svg>
                    {t(it)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <FAQ />

      <section className="pp-news">
        <SectionLabel title={t('news_label')} number="007" />
        <div className="pp-news-grid">
          {NEWS.map((n, i) => (
            <div key={i} className="pp-news-card">
              <span className="pp-news-source">{t(n.source)}</span>
              <h3 className="pp-news-title">{t(n.title)}</h3>
              <span className="pp-news-date">{t(n.date)}</span>
              <a href="#" className="pp-news-link" onClick={(e) => e.preventDefault()}>{t('read_article')}</a>
            </div>
          ))}
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}