import { useEffect, useRef, useState } from 'react';
import SectionLabel from './Sectionlabel';
import logo from '../Assets/logorad.svg';
import './Testimonials.css';

const TESTIMONIALS = [
  {
    quote: "Smart matching connected us with vendors we never knew existed. The AI recommendations are spot-on every time.",
    name: "nada shokry",
    role: "Procurement Manager, InnovateCo",
    stars: 5,
  },
  {
    quote: "SELA transformed our procurement process. We've reduced costs by 30% and cut vendor onboarding time in half.",
    name: "mohamed ahmed",
    role: "Supply Chain Director, GlobalMart",
    stars: 5,
  },
  {
    quote: "SELA transformed our procurement process. We've reduced costs by 30% and cut vendor onboarding time in half.",
    name: "karim sadeek",
    role: "CPO, TechCorp Industries",
    stars: 5,
  },
];

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

export default function Testimonials() {
  const [sectionRef, sectionVisible] = useScrollReveal();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section className="testimonials" ref={sectionRef}>
      <div className="testimonials__label-wrap">
        <SectionLabel title="Testimonials" number="003" />
      </div>

      <div className="testimonials__cards">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className={`
              testimonials__card
              ${sectionVisible ? 'testimonials__card--visible' : ''}
              ${hoveredIdx === i ? 'testimonials__card--hovered' : ''}
              ${hoveredIdx !== null && hoveredIdx !== i ? 'testimonials__card--dimmed' : ''}
            `}
            style={{ transitionDelay: sectionVisible ? `${i * 120}ms` : '0ms' }}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <img src={logo} alt="SELA" className="testimonials__card-logo" />
            <p className="testimonials__quote">{t.quote}</p>
            <span className="testimonials__name">{t.name}</span>
            <span className="testimonials__role">{t.role}</span>
            <div className="testimonials__stars">
              {Array.from({ length: t.stars }).map((_, s) => (
                <span key={s} className="testimonials__star">★</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}