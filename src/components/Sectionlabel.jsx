import { useEffect, useRef, useState } from 'react';
import './SectionLabel.css';

export default function SectionLabel({ title, number }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`section-label${visible ? ' section-label--visible' : ''}`}>
      <span className="section-label__title">{title}</span>
      <span className="section-label__divider" />
      <span className="section-label__number">{number}</span>
    </div>
  );
}