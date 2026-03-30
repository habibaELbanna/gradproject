import { useEffect, useRef, useState, useCallback } from 'react';
import bird from '../Assets/bird.svg';
import './Hero.css';

/* ── Animated Lines Canvas ── */
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
        { x1: 0, y1: 0,   cpx: W*0.5, cpy: H*0.35, x2: W, y2: 0   },
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

  return <canvas ref={canvasRef} className="lines-canvas" />;
}

/* ── Counter ── */
function useCounter(target, suffix, startDelay, duration = 1200) {
  const [value, setValue] = useState('0');

  useEffect(() => {
    const timeout = setTimeout(() => {
      let current = 0;
      const step = target / (duration / 16);
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        setValue(Math.floor(current) + suffix);
      }, 16);
      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [target, suffix, startDelay, duration]);

  return value;
}

/* ── Hero Section ── */
export default function Hero() {
  const s1 = useCounter(500, '+', 5500);
  const s2 = useCounter(400, '+', 5700);
  const s3 = useCounter(900, 'k+', 5900);

  const birdRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const bird = birdRef.current;
    if (!bird) return;
    const rect = bird.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotateX = -dy * 14;
    const rotateY = dx * 14;
    bird.style.transform = `perspective(800px) translateY(-50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const bird = birdRef.current;
    if (!bird) return;
    bird.style.transform = `perspective(800px) translateY(-50%) rotateX(0deg) rotateY(0deg) scale(1)`;
  }, []);

  return (
    <section className="hero">
      <div className="hero__glow" />

      <div
        className="hero__bird"
        ref={birdRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img src={bird} alt="" className="hero__bird-img" />
      </div>

      {/* Phase 1: TALK LESS, SYNC MORE */}
      <div className="hero__phase hero__phase--1">
        <div className="hero__line">
          <span className="hero__word hero__word--white hero__word--delay-1">TALK</span>
          <span className="hero__word hero__word--white hero__word--delay-2">LESS,</span>
        </div>
        <div className="hero__line">
          <span className="hero__word hero__word--blue hero__word--delay-3">SYNC</span>
        </div>
        <div className="hero__line">
          <span className="hero__word hero__word--blue hero__word--delay-4">MORE</span>
        </div>
      </div>

      {/* Phase 2: CONNECT BUYERS & VENDORS */}
      <div className="hero__phase hero__phase--2">
        <div className="hero__line">
          <span className="hero__word hero__word--blue hero__word--p2-delay-1">CONNECT</span>
        </div>
        <div className="hero__line">
          <span className="hero__word hero__word--white hero__word--p2-delay-2">BUYERS</span>
        </div>
        <div className="hero__line">
          <span className="hero__word hero__word--blue hero__word--p2-delay-3">&amp;</span>
          <span className="hero__word hero__word--white hero__word--p2-delay-4">VENDORS</span>
        </div>
      </div>

      {/* Subtitle + CTA */}
      <div className="hero__sub">
        <p className="hero__desc">
          The smart B2B platform connecting Egyptian buyers<br />
          with verified vendors. Find what you need, get<br />
          competitive bids, close deals faster.
        </p>
        <a href="/signup" className="hero__cta">GET STARTED →</a>
      </div>

      {/* Stats strip */}
      <div className="hero__stats-strip">
        <LinesCanvas />
        <div className="hero__stats">
          <div className="hero__stat hero__stat--delay-1">
            <span className="hero__stat-num">{s1}</span>
            <span className="hero__stat-label">Vendors</span>
          </div>
          <div className="hero__stat hero__stat--delay-2">
            <span className="hero__stat-num">{s2}</span>
            <span className="hero__stat-label">Deals</span>
          </div>
          <div className="hero__stat hero__stat--delay-3">
            <span className="hero__stat-num">{s3}</span>
            <span className="hero__stat-label">Business</span>
          </div>
          <div className="hero__stat hero__stat--delay-4">
            <span className="hero__stat-num">∞</span>
            <span className="hero__stat-label">Potential</span>
          </div>
        </div>
      </div>
    </section>
  );
}