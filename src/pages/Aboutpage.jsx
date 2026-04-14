import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bigbird from '../Assets/bigbird.svg';
import icon1 from '../Assets/icon1.svg';
import icon2 from '../Assets/icon2.svg';
import icon3 from '../Assets/icon3.svg';
import './Aboutpage.css';

function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

function useCounter(target, suffix, prefix = '', active, duration = 1400) {
  const [value, setValue] = useState('0');
  useEffect(() => {
    if (!active) return;
    let current = 0;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      setValue(prefix + Math.floor(current) + suffix);
    }, 16);
    return () => clearInterval(interval);
  }, [active, target, suffix, prefix, duration]);
  return value;
}

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
        { x1: 0, y1: 0,        cpx: W * 0.5, cpy: H * 0.35, x2: W, y2: 0 },
        { x1: 0, y1: H * 0.28, cpx: W * 0.5, cpy: H * 0.55, x2: W, y2: H * 0.28 },
        { x1: 0, y1: H * 0.5,  cpx: W * 0.5, cpy: H * 0.5,  x2: W, y2: H * 0.5 },
        { x1: 0, y1: H * 0.72, cpx: W * 0.5, cpy: H * 0.45, x2: W, y2: H * 0.72 },
        { x1: 0, y1: H,        cpx: W * 0.5, cpy: H * 0.65, x2: W, y2: H },
      ];
      paths.forEach((p) => {
        ctx.beginPath(); ctx.moveTo(p.x1, p.y1);
        ctx.quadraticCurveTo(p.cpx, p.cpy, p.x2, p.y2);
        ctx.strokeStyle = '#00A7E5'; ctx.lineWidth = 1; ctx.globalAlpha = 0.3; ctx.stroke();
        ctx.globalAlpha = 1;
      });
      nodes.forEach((node) => {
        node.progress += node.speed;
        if (node.progress > 1) node.progress -= 1;
        const p = paths[node.lineIdx], t = node.progress;
        const x = (1-t)*(1-t)*p.x1 + 2*(1-t)*t*p.cpx + t*t*p.x2;
        const y = (1-t)*(1-t)*p.y1 + 2*(1-t)*t*p.cpy + t*t*p.y2;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, node.size * 5);
        grad.addColorStop(0, 'rgba(255,255,255,0.4)');
        grad.addColorStop(0.3, 'rgba(255,255,255,0.1)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath(); ctx.arc(x, y, node.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="ap__lines-canvas" />;
}

const VALUES = [
  { title: 'TRANSPARENCY', desc: 'Every transaction, every vendor, every deal — fully visible and traceable on our platform.' },
  { title: 'EFFICIENCY',   desc: 'We cut procurement time from weeks to hours through smart matching and automated workflows.' },
  { title: 'TRUST',        desc: 'All vendors undergo rigorous verification before joining. Your business deserves reliable partners.' },
  { title: 'GROWTH',       desc: 'Built to scale with Egyptian businesses — from startups to enterprises, Sela grows with you.' },
];

const TEAM = [
  { name: 'AHMED HASSAN',  role: 'CEO & CO-FOUNDER',   tag: 'LEADERSHIP' },
  { name: 'SARAH IBRAHIM', role: 'CTO & CO-FOUNDER',   tag: 'TECHNOLOGY' },
  { name: 'OMAR KHALIL',   role: 'HEAD OF OPERATIONS', tag: 'OPERATIONS' },
  { name: 'NOUR MAHMOUD',  role: 'HEAD OF PRODUCT',    tag: 'PRODUCT' },
];

export default function AboutPage() {
  const { t, i18n } = useTranslation();

  const [heroRef, heroVisible]       = useScrollReveal(0.05);
  const [statsRef, statsVisible]     = useScrollReveal(0.1);
  const [missionRef, missionVisible] = useScrollReveal(0.1);
  const [valuesRef, valuesVisible]   = useScrollReveal(0.1);
  const [teamRef, teamVisible]       = useScrollReveal(0.1);
  const [journeyRef, journeyVisible]  = useScrollReveal(0.1);

  const vendors  = useCounter(500,  '+',  '',  statsVisible, 1200);
  const deals    = useCounter(2500, '+',  '',  statsVisible, 1400);
  const business = useCounter(150,  'k+', '',  statsVisible, 1100);
  const potential = useCounter(500, 'M+', '$', statsVisible, 1300);

  const birdRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = birdRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    el.style.transform = `perspective(1200px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (birdRef.current) birdRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

  const stats = [
    { value: vendors,   label: t('stat_vendors') },
    { value: deals,     label: t('stat_deals') },
    { value: business,  label: t('stat_business') },
    { value: potential, label: t('stat_potential') },
  ];

  return (
    <div className="ap" dir={i18n.dir()}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="ap__hero">
        <div
          ref={heroRef}
          className={`ap__card-wrap${heroVisible ? ' ap__card-wrap--visible' : ''}`}
        >
          {/* SVG shape as border/background */}
          <svg
            className="ap__card-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 797 620"
            preserveAspectRatio="none"
          >
            <path
              d="M796.141 97.1C796.141 82.9357 785.358 71.0996 771.255 69.7829L30.4859 0.621197C14.3961 -0.881022 0.499573 11.7785 0.499573 27.9383V591.414C0.499573 607.574 14.3961 620.234 30.486 618.731L771.255 549.57C785.358 548.253 796.141 536.417 796.141 522.253V97.1Z"
              fill="#0E0E0E"
              stroke="#00A7E5"
            />
          </svg>

          {/* Text — left side */}
          <div className="ap__card-text">
            <h1 className={`ap__title${heroVisible ? ' ap__title--visible' : ''}`}>
              ABOUT SELA
            </h1>
            <p className={`ap__desc${heroVisible ? ' ap__desc--visible' : ''}`}>
              {t('about_desc_1')}
            </p>
            <p className={`ap__desc ap__desc--2${heroVisible ? ' ap__desc--visible' : ''}`}>
              {t('about_desc_2')}
            </p>
          </div>

          {/* Bird — right side */}
          <div className="ap__bird-wrap" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <img ref={birdRef} src={bigbird} alt="" className="ap__bird" style={{ transformStyle: "preserve-3d", transition: "transform 0.12s ease-out" }} />
          </div>

        </div>
      </section>

      {/* ── Stats ── */}
      <section className="ap__stats-section" ref={statsRef}>
        <LinesCanvas />
        <div className="ap__stats">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`ap__stat${statsVisible ? ' ap__stat--visible' : ''}`}
              style={{ transitionDelay: statsVisible ? `${i * 0.1}s` : '0s' }}
            >
              <span className="ap__stat-num">{s.value}</span>
              <span className="ap__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>


      {/* ── Journey ── */}
      <section className="ap__journey" ref={journeyRef}>
        <div className={`ap__section-label${journeyVisible ? ' ap__section-label--visible' : ''}`}>
          <span>THE JOURNEY</span>
          <span className="ap__label-divider" />
          <span className="ap__label-num">001</span>
        </div>
        <div className="ap__journey-grid">
          {[
            { year: '2024', title: 'Founded',         desc: 'SELA was born from a vision to revolutionize B2B procurement in Egypt, bringing transparency and efficiency to the market.',  icon: icon1 },
            { year: '2024', title: 'First 100 Users', desc: 'Rapid adoption as businesses recognized the value of streamlined procurement processes and trusted vendor networks.',          icon: icon2 },
            { year: '2025', title: '1000+ Deals',     desc: "Scaling to serve Egypt's largest enterprises, processing millions in transactions and building lasting partnerships.",        icon: icon3 },
          ].map((item, i) => (
            <div
              key={i}
              className={`ap__journey-card${journeyVisible ? ' ap__journey-card--visible' : ''}`}
              style={{ transitionDelay: journeyVisible ? `${i * 0.15}s` : '0s' }}
            >
              <span className="ap__journey-year">{item.year}</span>
              <div className="ap__journey-body">
                <h3 className="ap__journey-title">{item.title}</h3>
                <p className="ap__journey-desc">{item.desc}</p>
              </div>
              <div className="ap__journey-icon"><img src={item.icon} alt="" /></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="ap__mission" ref={missionRef}>
        <div className={`ap__section-label${missionVisible ? ' ap__section-label--visible' : ''}`}>
          <span>OUR MISSION</span>
          <span className="ap__label-divider" />
          <span className="ap__label-num">002</span>
        </div>
        <div className="ap__mission-body">
          <h2 className={`ap__mission-heading${missionVisible ? ' ap__mission-heading--visible' : ''}`}>
            CONNECTING EGYPT'S<br />BUSINESS ECOSYSTEM
          </h2>
          <p className={`ap__mission-text${missionVisible ? ' ap__mission-text--visible' : ''}`}>
            Sela was founded with a single mission: to modernize B2B procurement in Egypt.
            We saw businesses spending weeks finding suppliers, negotiating over phone calls,
            and closing deals with no transparency or accountability. We built the platform
            we always wished existed — one that brings speed, trust, and intelligence to
            every procurement decision.
          </p>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="ap__values" ref={valuesRef}>
        <div className={`ap__section-label${valuesVisible ? ' ap__section-label--visible' : ''}`}>
          <span>WHAT WE STAND FOR</span>
          <span className="ap__label-divider" />
          <span className="ap__label-num">003</span>
        </div>
        <div className="ap__values-grid">
          {VALUES.map((v, i) => (
            <div
              key={i}
              className={`ap__value-card${valuesVisible ? ' ap__value-card--visible' : ''}`}
              style={{ transitionDelay: valuesVisible ? `${i * 0.12}s` : '0s' }}
            >
              <span className="ap__value-index">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="ap__value-title">{v.title}</h3>
              <p className="ap__value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="ap__team" ref={teamRef}>
        <div className={`ap__section-label${teamVisible ? ' ap__section-label--visible' : ''}`}>
          <span>THE TEAM</span>
          <span className="ap__label-divider" />
          <span className="ap__label-num">004</span>
        </div>
        <div className="ap__team-grid">
          {TEAM.map((m, i) => (
            <div
              key={i}
              className={`ap__team-card${teamVisible ? ' ap__team-card--visible' : ''}`}
              style={{ transitionDelay: teamVisible ? `${i * 0.1}s` : '0s' }}
            >
              <div className="ap__team-avatar"><div className="ap__team-avatar-inner" /></div>
              <span className="ap__team-tag">{m.tag}</span>
              <h4 className="ap__team-name">{m.name}</h4>
              <p className="ap__team-role">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ap__cta">
        <div className="ap__cta-glow" />
        <h2 className="ap__cta-heading">READY TO TRANSFORM<br />YOUR PROCUREMENT?</h2>
        <div className="ap__cta-actions">
          <a href="/signup/role" className="ap__cta-btn ap__cta-btn--primary">GET STARTED →</a>
          <a href="/#contact"   className="ap__cta-btn ap__cta-btn--secondary">CONTACT US</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}