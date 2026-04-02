import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from './Sectionlabel';
import logo from '../Assets/logorad.svg';
import './Testimonials.css';

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

export default function Testimonials() {
  const { t } = useTranslation();
  const [sectionRef, visible] = useScrollReveal();
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const TESTIMONIALS = [
    { quote: t('test_q1'), name: t('test_n1'), role: t('test_r1'), stars: 5 },
    { quote: t('test_q2'), name: t('test_n2'), role: t('test_r2'), stars: 5 },
    { quote: t('test_q3'), name: t('test_n3'), role: t('test_r3'), stars: 5 },
  ];

  return (
    <section className="testimonials" ref={sectionRef}>
      <div className="testimonials__label-wrap">
        <SectionLabel title={t('test_label')} number="003" />
      </div>
      <div className="testimonials__cards">
        {TESTIMONIALS.map((t2, i) => (
          <div key={i}
            className={`testimonials__card ${visible ? 'testimonials__card--visible' : ''} ${hoveredIdx === i ? 'testimonials__card--hovered' : ''} ${hoveredIdx !== null && hoveredIdx !== i ? 'testimonials__card--dimmed' : ''}`}
            onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
            <img src={logo} alt="SELA" className="testimonials__card-logo" />
            <p className="testimonials__quote">{t2.quote}</p>
            <span className="testimonials__name">{t2.name}</span>
            <span className="testimonials__role">{t2.role}</span>
            <div className="testimonials__stars">{Array.from({ length: t2.stars }).map((_, s) => <span key={s} className="testimonials__star">★</span>)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}