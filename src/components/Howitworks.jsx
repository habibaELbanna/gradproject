import { useEffect, useRef, useState } from 'react';
import SectionLabel from './Sectionlabel';
import './Howitworks.css';

const STEPS = {
  buyers: [
    { num: '01', title: 'POST YOUR NEED', desc: 'Describe what you need, set your budget, and specify requirements in minutes.' },
    { num: '02', title: 'RECEIVE PROPOSALS', desc: 'Verified vendors submit competitive proposals with detailed pricing and timelines.' },
    { num: '03', title: 'COMPARE & CHOOSE', desc: 'Review proposals, check vendor ratings and portfolios, compare offers side-by-side.' },
    { num: '04', title: 'CLOSE THE DEAL', desc: 'Select the best vendor, negotiate final terms, and complete your procurement securely.' },
  ],
  vendors: [
    { num: '01', title: 'CREATE PROFILE', desc: 'Set up your verified vendor profile, showcase your portfolio and expertise.' },
    { num: '02', title: 'BROWSE NEEDS', desc: 'Discover procurement needs that match your specialization and capabilities.' },
    { num: '03', title: 'SUBMIT PROPOSAL', desc: 'Send competitive proposals with your pricing, timeline, and approach.' },
    { num: '04', title: 'WIN & DELIVER', desc: 'Get selected, communicate with buyers, and deliver your best work.' },
  ],
};

function LinesCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const nodes = [];
    for (let li = 0; li < 5; li++) {
      for (let i = 0; i < 3; i++) {
        nodes.push({
          lineIdx: li,
          progress: i / 3,
          speed: 0.0004 * (0.7 + Math.random() * 0.7),
          size: 2 + Math.random() * 1.5,
        });
      }
    }

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width;
      const H = canvas.height;

      const paths = [
        { x1: 0, y1: 0,      cpx: W*0.5, cpy: H*0.35, x2: W, y2: 0      },
        { x1: 0, y1: H*0.28, cpx: W*0.5, cpy: H*0.55, x2: W, y2: H*0.28 },
        { x1: 0, y1: H*0.5,  cpx: W*0.5, cpy: H*0.5,  x2: W, y2: H*0.5  },
        { x1: 0, y1: H*0.72, cpx: W*0.5, cpy: H*0.45, x2: W, y2: H*0.72 },
        { x1: 0, y1: H,      cpx: W*0.5, cpy: H*0.65, x2: W, y2: H      },
      ];

      paths.forEach((p) => {
        ctx.beginPath();
        ctx.moveTo(p.x1, p.y1);
        ctx.quadraticCurveTo(p.cpx, p.cpy, p.x2, p.y2);
        ctx.strokeStyle = '#00A7E5';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      nodes.forEach((node) => {
        node.progress += node.speed;
        if (node.progress > 1) node.progress -= 1;

        const p = paths[node.lineIdx];
        const t = node.progress;
        const x = (1-t)*(1-t)*p.x1 + 2*(1-t)*t*p.cpx + t*t*p.x2;
        const curveY = (1-t)*(1-t)*p.y1 + 2*(1-t)*t*p.cpy + t*t*p.y2;

        const grad = ctx.createRadialGradient(x, curveY, 0, x, curveY, node.size * 5);
        grad.addColorStop(0, 'rgba(255,255,255,0.4)');
        grad.addColorStop(0.3, 'rgba(255,255,255,0.1)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.arc(x, curveY, node.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, curveY, node.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hiw__canvas" />;
}

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('buyers');
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

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
      <div className="hiw__label-wrap">
        <SectionLabel title="How It Works" number="005" />
      </div>

      <h2 className="hiw__title">
        SIMPLE PROCESS,<br />POWERFUL RESULTS
      </h2>

      <div className="hiw__tabs">
        <button
          className={`hiw__tab ${activeTab === 'buyers' ? 'hiw__tab--active' : ''}`}
          onClick={() => { setActiveTab('buyers'); setVisible(false); setTimeout(() => setVisible(true), 50); }}
        >
          FOR BUYERS →
        </button>
        <button
          className={`hiw__tab ${activeTab === 'vendors' ? 'hiw__tab--active' : ''}`}
          onClick={() => { setActiveTab('vendors'); setVisible(false); setTimeout(() => setVisible(true), 50); }}
        >
          FOR VENDOR →
        </button>
      </div>

      <div className="hiw__cards-wrap">
        <LinesCanvas />
        <div className="hiw__cards">
          {steps.map((step, i) => (
            <div
              key={`${activeTab}-${i}`}
              className={`hiw__card ${visible ? 'hiw__card--visible' : ''}`}
            >
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