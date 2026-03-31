import { useEffect, useRef, useState } from 'react';
import SectionLabel from './Sectionlabel';
import bg from '../Assets/background.svg';
import './Comparison.css';

const ROWS = [
  { traditional: 'Manual vendor search',    sela: 'AI-powered matching'     },
  { traditional: 'Phone calls & emails',    sela: 'Centralized platform'    },
  { traditional: 'Weeks to find vendors',   sela: '24-48 hours'             },
  { traditional: 'Unknown vendor quality',  sela: 'Verified businesses'     },
  { traditional: 'No price transparency',   sela: 'Competitive bidding'     },
  { traditional: 'Complex payment process', sela: 'Secure escrow'           },
  { traditional: 'Limited vendor options',  sela: '500+ verified vendors'   },
  { traditional: 'Manual tracking',         sela: 'Automated dashboard'     },
];

function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold, rootMargin: '0px 0px -80px 0px' }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export default function Comparison() {
  const [sectionRef, sectionVisible] = useScrollReveal();

  return (
    <section className="comparison">
      <img src={bg} alt="" className="comparison__bg" />

      <div className="comparison__label-wrap">
        <SectionLabel title="Why SELA" number="002" />
      </div>

      <h2 className={`comparison__title${sectionVisible ? ' comparison__title--visible' : ''}`} ref={sectionRef}>
        Traditional vs Sela Procurement
      </h2>

      <div className={`comparison__table${sectionVisible ? ' comparison__table--visible' : ''}`}>
        <div className="comparison__header">
          <div className="comparison__header-cell">Traditional Procurement</div>
          <div className="comparison__header-cell comparison__header-cell--sela">With Sela</div>
        </div>

        {ROWS.map((row, i) => (
          <div
            key={i}
            className="comparison__row"
            style={{ animationDelay: sectionVisible ? `${i * 60}ms` : '0ms' }}
          >
            <div className="comparison__cell comparison__cell--traditional">
              <span className="comparison__icon comparison__icon--x">✕</span>
              <span>{row.traditional}</span>
            </div>
            <div className="comparison__cell comparison__cell--sela">
              <span className="comparison__icon comparison__icon--check">✓</span>
              <span>{row.sela}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}