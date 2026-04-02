import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from './Sectionlabel';
import './Howitworks.css';

function LinesCanvas() {
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
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;
      const paths = [
        { x1: 0, y1: 0, cpx: W*0.5, cpy: H*0.35, x2: W, y2: 0 },
        { x1: 0, y1: H*0.28, cpx: W*0.5, cpy: H*0.55, x2: W, y2: H*0.28 },
        { x1: 0, y1: H*0.5, cpx: W*0.5, cpy: H*0.5, x2: W, y2: H*0.5 },
        { x1: 0, y1: H*0.72, cpx: W*0.5, cpy: H*0.45, x2: W, y2: H*0.72 },
        { x1: 0, y1: H, cpx: W*0.5, cpy: H*0.65, x2: W, y2: H },
      ];
      paths.forEach((p) => {
        ctx.save(); ctx.beginPath(); ctx.moveTo(p.x1, p.y1);
        ctx.quadraticCurveTo(p.cpx, p.cpy, p.x2, p.y2);
        ctx.strokeStyle = 'rgba(0,167,229,0.25)'; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
      });
      nodes.forEach((node) => {
        node.progress += node.speed;
        if (node.progress > 1) node.progress -= 1;
        const p = paths[node.lineIdx], t = node.progress;
        const x = (1-t)*(1-t)*p.x1 + 2*(1-t)*t*p.cpx + t*t*p.x2;
        const curveY = (1-t)*(1-t)*p.y1 + 2*(1-t)*t*p.cpy + t*t*p.y2;
        ctx.save();
        const grad = ctx.createRadialGradient(x, curveY, 0, x, curveY, node.size * 5);
        grad.addColorStop(0, 'rgba(255,255,255,0.9)'); grad.addColorStop(0.3, 'rgba(255,255,255,0.3)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath(); ctx.arc(x, curveY, node.size * 5, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill(); ctx.restore();
        ctx.save(); ctx.beginPath(); ctx.arc(x, curveY, node.size, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.restore();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="hiw__canvas" />;
}

export default function HowItWorks() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('buyers');
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  const STEPS = {
    buyers: [
      { num: '01', title: t('hiw_b1_title'), desc: t('hiw_b1_desc') },
      { num: '02', title: t('hiw_b2_title'), desc: t('hiw_b2_desc') },
      { num: '03', title: t('hiw_b3_title'), desc: t('hiw_b3_desc') },
      { num: '04', title: t('hiw_b4_title'), desc: t('hiw_b4_desc') },
    ],
    vendors: [
      { num: '01', title: t('hiw_v1_title'), desc: t('hiw_v1_desc') },
      { num: '02', title: t('hiw_v2_title'), desc: t('hiw_v2_desc') },
      { num: '03', title: t('hiw_v3_title'), desc: t('hiw_v3_desc') },
      { num: '04', title: t('hiw_v4_title'), desc: t('hiw_v4_desc') },
    ],
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const steps = STEPS[activeTab];

  return (
    <section className="hiw" ref={sectionRef}>
      <div className="hiw__label-wrap"><SectionLabel title={t('hiw_label')} number="005" /></div>
      <h2 className="hiw__title">{t('hiw_title1')}<br />{t('hiw_title2')}</h2>
      <div className="hiw__tabs">
        <button className={`hiw__tab ${activeTab === 'buyers' ? 'hiw__tab--active' : ''}`}
          onClick={() => { setActiveTab('buyers'); setVisible(false); setTimeout(() => setVisible(true), 50); }}>
          {t('hiw_buyers')}
        </button>
        <button className={`hiw__tab ${activeTab === 'vendors' ? 'hiw__tab--active' : ''}`}
          onClick={() => { setActiveTab('vendors'); setVisible(false); setTimeout(() => setVisible(true), 50); }}>
          {t('hiw_vendor')}
        </button>
      </div>
      <div className="hiw__cards-wrap">
        <LinesCanvas />
        <div className="hiw__cards">
          {steps.map((step, i) => (
            <div key={`${activeTab}-${i}`} className={`hiw__card ${visible ? 'hiw__card--visible' : ''}`}>
              <div className="hiw__card-num-bg">{step.num}</div>
              <span className="hiw__card-num-sm">{step.num}</span>
              <h3 className="hiw__card-title">{step.title}</h3>
              <p className="hiw__card-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}