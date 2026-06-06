import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTA from '../components/Cta';
import bigbird from '../Assets/bigbird.svg';
import icon1 from '../Assets/icon1.svg';
import icon2 from '../Assets/icon2.svg';
import icon3 from '../Assets/icon3.svg';
import loc1 from '../Assets/loc1.png';
import loc2 from '../Assets/loc2.png';
import loc3 from '../Assets/loc3.png';
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


function HorizontalLine({ direction = 'down' }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const nodes = [
      { progress: 0.0, speed: 0.0035, size: 3 },
      { progress: 0.5, speed: 0.0035, size: 3 },
    ];
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;

      // Lines start further into the canvas — short and exit the right edge
      const dotX = W * 0.28;
      const dotY = H * 0.5;
      const breakX = W * 0.70;
      const endX = W;
      const endY = direction === 'down' ? H * 0.95 : H * 0.5;

      // Soft glow behind dot
      const glow = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 26);
      glow.addColorStop(0, 'rgba(0,167,229,0.7)');
      glow.addColorStop(0.4, 'rgba(0,167,229,0.25)');
      glow.addColorStop(1, 'rgba(0,167,229,0)');
      ctx.beginPath();
      ctx.arc(dotX, dotY, 26, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Solid blue dot
      ctx.beginPath();
      ctx.arc(dotX, dotY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#00A7E5';
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.moveTo(dotX + 8, dotY);
      ctx.lineTo(breakX, dotY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#00A7E5';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.75;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Traveling white sparkle nodes
      const seg1Len = breakX - dotX - 8;
      const seg2Len = Math.hypot(endX - breakX, endY - dotY);
      const totalLen = seg1Len + seg2Len;

      nodes.forEach(node => {
        node.progress += node.speed;
        if (node.progress > 1) node.progress -= 1;
        const dist = node.progress * totalLen;
        let nx, ny;
        if (dist <= seg1Len) {
          nx = dotX + 8 + dist;
          ny = dotY;
        } else {
          const t = (dist - seg1Len) / seg2Len;
          nx = breakX + (endX - breakX) * t;
          ny = dotY + (endY - dotY) * t;
        }
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, node.size * 5);
        g.addColorStop(0, 'rgba(255,255,255,0.7)');
        g.addColorStop(0.3, 'rgba(255,255,255,0.2)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath(); ctx.arc(nx, ny, node.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(nx, ny, node.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff'; ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [direction]);
  return <canvas ref={canvasRef} className="ap__hline-canvas" />;
}

const WHO = [
  {
    title: 'TRANSPARENCY',
    desc: 'Open communication and clear processes build trust with every transaction.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'INNOVATION',
    desc: 'Continuously evolving our platform to meet the changing needs of modern businesses.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 22h4" />
        <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1h6c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
      </svg>
    ),
  },
  {
    title: 'TRUST',
    desc: 'Building secure, reliable relationships between buyers and vendors.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />
      </svg>
    ),
  },
];


const NEWS = [
  { source: 'TECHCRUNCH MIDDLE EAST', title: 'SELA Revolutionizes Egyptian B2B Market', date: 'January 2025' },
  { source: 'ENTERPRISE TIMES',       title: 'How SELA is Transforming Procurement',  date: 'December 2024' },
  { source: 'CAIRO BUSINESS MONTHLY',  title: 'The Rise of Digital Procurement Platforms', date: 'November 2024' },
  { source: 'MENA TECH REVIEW',        title: 'SELA Reaches 1000+ Deals Milestone',  date: 'October 2024' },
];

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [heroRef, heroVisible]       = useScrollReveal(0.05);
  const [statsRef, statsVisible]     = useScrollReveal(0.1);
  const [missionRef, missionVisible] = useScrollReveal(0.1);
  const [whoRef, whoVisible]         = useScrollReveal(0.1);
  const [locRef, locVisible]       = useScrollReveal(0.1);
  const [journeyRef, journeyVisible]  = useScrollReveal(0.1);
  const [newsRef, newsVisible]       = useScrollReveal(0.1);

  const vendors  = useCounter(500,  '+',  '',  statsVisible, 1200);
  const deals    = useCounter(2500, '+',  '',  statsVisible, 1400);
  const business = useCounter(150,  'k+', '',  statsVisible, 1100);
  const potential = useCounter(500, 'M+', '$', statsVisible, 1300);

  const birdRef = useRef(null);
  const birdWrapRef = useRef(null);
  const shadowRef = useRef(null);

  // Entrance: bird flies in from the left, scales up from far → near
  useEffect(() => {
    const wrap = birdWrapRef.current;
    const shadow = shadowRef.current;
    if (!wrap) return;
    gsap.set(wrap, { xPercent: -180, yPercent: -50, scale: 0.5, opacity: 0 });
    if (shadow) gsap.set(shadow, { scaleX: 0.4, opacity: 0 });
    if (!heroVisible) return;
    gsap.to(wrap, {
      xPercent: 0,
      scale: 1,
      opacity: 1,
      duration: 1.6,
      ease: 'power3.out',
      delay: 0.4,
    });
    if (shadow) {
      gsap.to(shadow, {
        scaleX: 1,
        opacity: 1,
        duration: 1.6,
        ease: 'power3.out',
        delay: 0.5,
        onComplete: () => {
          // Continuous pulse — sells the "bird is alive and flapping" feel
          gsap.to(shadow, {
            scaleX: 0.78,
            opacity: 0.55,
            duration: 1.4,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
          });
        }
      });
    }
  }, [heroVisible]);

  // Exit: bird flies out to the right, scales down as it gets "further"
  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (href === window.location.pathname) return;
      e.preventDefault();
      const wrap = birdWrapRef.current;
      const shadow = shadowRef.current;
      if (!wrap) { navigate(href); return; }
      // Stop the shadow pulse so exit reads cleanly
      if (shadow) gsap.killTweensOf(shadow);
      gsap.to(wrap, {
        xPercent: 160,
        scale: 0.4,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in',
        onComplete: () => navigate(href),
      });
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [navigate]);

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
            <defs>
              <linearGradient id="apFrameGlow" x1="0%" y1="50%" x2="65%" y2="50%">
                <stop offset="0%" stopColor="#0E0E0E" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#0E0E0E" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#0E0E0E" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M796.141 97.1C796.141 82.9357 785.358 71.0996 771.255 69.7829L30.4859 0.621197C14.3961 -0.881022 0.499573 11.7785 0.499573 27.9383V591.414C0.499573 607.574 14.3961 620.234 30.486 618.731L771.255 549.57C785.358 548.253 796.141 536.417 796.141 522.253V97.1Z"
              fill="#0E0E0E"
              stroke="#00A7E5"
            />
            <path
              d="M796.141 97.1C796.141 82.9357 785.358 71.0996 771.255 69.7829L30.4859 0.621197C14.3961 -0.881022 0.499573 11.7785 0.499573 27.9383V591.414C0.499573 607.574 14.3961 620.234 30.486 618.731L771.255 549.57C785.358 548.253 796.141 536.417 796.141 522.253V97.1Z"
              fill="url(#apFrameGlow)"
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
          <div ref={birdWrapRef} className="ap__bird-wrap" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <img ref={birdRef} src={bigbird} alt="" className="ap__bird" style={{ transformStyle: "preserve-3d", transition: "transform 0.12s ease-out" }} />
            <div ref={shadowRef} className="ap__bird-shadow" />
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

      {/* ── Mission & Vision ── */}
      <section className="ap__mission" ref={missionRef}>
        <div className="ap__mv-row">
          <div className={`ap__mv-text${missionVisible ? ' ap__mv-text--visible' : ''}`}>
            <h2 className="ap__mv-heading">OUR MISSION</h2>
            <p className="ap__mv-desc">
              To empower Egyptian businesses with a transparent, efficient, and trustworthy B2B
              procurement platform that drives growth and fosters lasting partnerships across industries.
            </p>
          </div>
          <div className="ap__mv-line">
            <HorizontalLine direction="down" />
          </div>
        </div>
        <div className="ap__mv-row ap__mv-row--indent">
          <div className={`ap__mv-text${missionVisible ? ' ap__mv-text--visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
            <h2 className="ap__mv-heading">OUR VISION</h2>
            <p className="ap__mv-desc">
              To become the leading B2B procurement ecosystem in the MENA region, setting new
              standards for transparency, innovation, and business growth in the digital age.
            </p>
          </div>
          <div className="ap__mv-line">
            <HorizontalLine direction="flat" />
          </div>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="ap__who" ref={whoRef}>
        <div className={`ap__section-label${whoVisible ? ' ap__section-label--visible' : ''}`}>
          <span>WHO WE ARE</span>
          <span className="ap__label-divider" />
          <span className="ap__label-num">003</span>
        </div>
        <div className={`ap__who-grid${whoVisible ? ' ap__who-grid--visible' : ''}`}>
          {WHO.map((w, i) => (
            <div className="ap__who-card" key={i}>
              <div className="ap__who-icon">{w.icon}</div>
              <h3 className="ap__who-title">{w.title}</h3>
              <p className="ap__who-desc">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Location ── */}
      <section className="ap__loc" ref={locRef}>
        <div className={`ap__section-label${locVisible ? ' ap__section-label--visible' : ''}`}>
          <span>LOCATION</span>
          <span className="ap__label-divider" />
          <span className="ap__label-num">004</span>
        </div>

        <div className={`ap__loc-card${locVisible ? ' ap__loc-card--visible' : ''}`}>
          <div className="ap__loc-text">
            <h3 className="ap__loc-name">Cairo HQ</h3>
            <p className="ap__loc-info">123 Tahrir Street, Cairo</p>
            <p className="ap__loc-info">+20 2 1234 5678</p>
            <p className="ap__loc-info">Sun-Thu, 9AM-6PM</p>
          </div>
          <div className="ap__loc-pin">
            <svg viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
              <circle cx="12" cy="10" r="2.6" />
            </svg>
          </div>
        </div>

        <div className={`ap__loc-gallery${locVisible ? ' ap__loc-gallery--visible' : ''}`}>
          <img src={loc1} alt="Sela brand display" className="ap__loc-img ap__loc-img--1" />
          <img src={loc2} alt="Sela signage" className="ap__loc-img ap__loc-img--2" />
          <img src={loc3} alt="Cairo skyline" className="ap__loc-img ap__loc-img--3" />
        </div>
      </section>

      {/* ── News ── */}
      <section className="ap__news" ref={newsRef}>
        <div className={`ap__section-label${newsVisible ? ' ap__section-label--visible' : ''}`}>
          <span>NEWS</span>
          <span className="ap__label-divider" />
          <span className="ap__label-num">007</span>
        </div>
        <div className="ap__news-grid">
          {NEWS.map((n, i) => (
            <div
              key={i}
              className={`ap__news-card${newsVisible ? ' ap__news-card--visible' : ''}`}
              style={{ transitionDelay: newsVisible ? `${i * 0.1}s` : '0s' }}
            >
              <span className="ap__news-source">{n.source}</span>
              <h3 className="ap__news-title">{n.title}</h3>
              <span className="ap__news-date">{n.date}</span>
              <a href="#" className="ap__news-link" onClick={(e) => e.preventDefault()}>READ ARTICLE →</a>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <CTA />

      <Footer />
    </div>
  );
}