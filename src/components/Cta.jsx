import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DotGrid from './Dotgrid';
import './Cta.css';

export default function CTA() {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="cta" ref={ref} dir={i18n.dir()}>
      <DotGrid dotSize={5} gap={15} baseColor="#0e1a24" activeColor="#00A7E5" proximity={120} shockRadius={250} shockStrength={5} resistance={750} returnDuration={1.5} />
      <div className={`cta__content${visible ? ' cta__content--visible' : ''}`}>
        <h2 className="cta__title">
          {t('cta_title')}<br />
          <span className="cta__title--blue">{t('cta_title_blue')}</span>
        </h2>
        <p className="cta__sub">{t('cta_sub')}</p>
        <div className="cta__btns">
          <a href="/signup?role=buyer" className="cta__btn cta__btn--primary">{t('cta_buyer')}</a>
          <a href="/signup?role=vendor" className="cta__btn cta__btn--secondary">{t('cta_vendor')}</a>
        </div>
      </div>
    </section>
  );
}