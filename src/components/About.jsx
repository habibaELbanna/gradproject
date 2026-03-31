import { useEffect, useRef, useState } from 'react';
import SectionLabel from './Sectionlabel';
import Cubes from './Cubes';
import './About.css';

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

function useCounter(target, suffix, active, duration = 1400) {
  const [value, setValue] = useState('0');
  useEffect(() => {
    if (!active) return;
    let current = 0;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      setValue(Math.floor(current) + suffix);
    }, 16);
    return () => clearInterval(interval);
  }, [active, target, suffix, duration]);
  return value;
}

function StatCard({ number, label, delay, className }) {
  const [ref, visible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`about__stat${visible ? ' about__stat--visible' : ''}${className ? ` ${className}` : ''}`}
    >
      <span className="about__stat-num">{number}</span>
      <span className="about__stat-label">{label}</span>
    </div>
  );
}

export default function About() {
  const [sectionRef, sectionVisible] = useScrollReveal();
  const [statsRef, statsVisible] = useScrollReveal();

  const s1 = useCounter(5, 'M+', statsVisible, 1200);
  const s2 = useCounter(2500, '+', statsVisible, 1400);
  const s3 = useCounter(98, '%', statsVisible, 1000);

  const [middleHovered, setMiddleHovered] = useState(false);

  return (
    <section className="about" ref={sectionRef}>
      <div className="about__label-wrap">
        <SectionLabel title="About SELA" number="001" />
      </div>

      <div className="about__body">
        <div className="about__left">
          <h2 className={`about__heading${sectionVisible ? ' about__heading--visible' : ''}`}>
            EGYPT'S LEADING<br />
            B2B PROCUREMENT<br />
            PLATFORM
          </h2>
          <p className={`about__desc${sectionVisible ? ' about__desc--visible' : ''}`}>
            Sela revolutionizes how Egyptian businesses procure goods and
            services. We connect buyers with verified vendors through an
            intelligent platform that makes procurement faster, more
            transparent, and more cost-effective.
          </p>
          <p className={`about__desc about__desc--2${sectionVisible ? ' about__desc--visible' : ''}`}>
            Whether you're sourcing office supplies, construction materials, or
            professional services, Sela streamlines the entire process from
            posting needs to closing deals.
          </p>
          <a href="/about" className={`about__link${sectionVisible ? ' about__link--visible' : ''}`}>
            Visit Full About us Page →
          </a>
        </div>

        <div className="about__right">
          <div className={`about__cubes-wrap${sectionVisible ? ' about__cubes-wrap--visible' : ''}`}>
            <Cubes
              gridSize={8}
              maxAngle={40}
              radius={3}
              borderStyle="1px solid #1a1a1a"
              faceColor="#00a8e53c"
              rippleColor="#00A7E5"
              rippleSpeed={1.5}
              autoAnimate
              rippleOnClick
            />
          </div>
        </div>
      </div>

      <div className="about__stats" ref={statsRef}>
        <StatCard number={`$${s1}`} label="TRANSACTION VALUE" delay={0} className={middleHovered ? 'about__stat--slide-left' : ''} />
        <div
          className={`about__stat about__stat--middle${statsVisible ? ' about__stat--visible' : ''}`}
          onMouseEnter={() => setMiddleHovered(true)}
          onMouseLeave={() => setMiddleHovered(false)}
        >
          <span className="about__stat-num">{s2}</span>
          <span className="about__stat-label">ACTIVE USERS</span>
        </div>
        <StatCard number={s3} label="SATISFACTION RATE" delay={0} className={middleHovered ? 'about__stat--slide-right' : ''} />
      </div>
    </section>
  );
}