import { useEffect, useRef, useState } from 'react';
import SectionLabel from './Sectionlabel';
import './Statistics.css';

const STATS = [
  { value: 2500, prefix: '', suffix: '+', label: 'ACTIVE USERS', progress: 0.75, growth: '+24%' },
  { value: 5, prefix: '$', suffix: 'M', label: 'TOTAL VALUE', progress: 0.90, growth: '+180%' },
  { value: 1200, prefix: '', suffix: '+', label: 'PROJECTS', progress: 0.60, growth: '+67%' },
  { value: 4.8, prefix: '', suffix: '/5', label: 'AVG RATING', progress: 0.96, growth: '+0.3', decimal: true },
];

function StatCard({ stat, visible, delay }) {
  const [count, setCount] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(() => {
      const duration = 1400;
      const steps = 60;
      const increment = stat.value / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(interval);
        }
        setCount(current);
      }, duration / steps);
      setBarWidth(stat.progress * 100);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [visible, stat.value, stat.progress, delay]);

  const display = stat.decimal
    ? count.toFixed(1)
    : Math.floor(count).toLocaleString();

  return (
    <div className={`stats__card ${visible ? 'stats__card--visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className="stats__number">
        {stat.prefix}{display}{stat.suffix}
      </div>
      <div className="stats__label">{stat.label}</div>
      <div className="stats__bar-track">
        <div className="stats__bar-fill" style={{ width: visible ? `${barWidth}%` : '0%', transitionDelay: `${delay + 200}ms` }} />
      </div>
      <div className="stats__growth">{stat.growth}</div>
    </div>
  );
}

export default function Statistics() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2, rootMargin: '0px 0px -80px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats" ref={ref}>
      <div className="stats__label-wrap">
        <SectionLabel title="Statistics" number="008" />
      </div>
      <div className="stats__grid">
        {STATS.map((stat, i) => (
          <StatCard key={i} stat={stat} visible={visible} delay={i * 120} />
        ))}
      </div>
    </section>
  );
}