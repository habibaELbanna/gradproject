import { useEffect, useRef, useState } from 'react';
import './Sectionlabel.css';

export default function SectionLabel({ title, number }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
   const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  },
  { threshold: 0, rootMargin: '0px 0px -200px 0px' }
);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="section-label-wrap" ref={ref}>
      <div className={`section-label${visible ? ' section-label--visible' : ''}`}>
        <span className="section-label__title">{title}</span>
        <span className="section-label__divider" />
        <span className="section-label__number">{number}</span>
      </div>
    </div>
  );
}