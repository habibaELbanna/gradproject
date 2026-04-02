import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from './Sectionlabel';
import './Comparison.css';

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
  const { t, i18n } = useTranslation();
  const [sectionRef, sectionVisible] = useScrollReveal();

  // We define rows inside the component so 't' works
  const ROWS = [
    { trad: t('row_trad_1'), sela: t('row_sela_1') },
    { trad: t('row_trad_2'), sela: t('row_sela_2') },
    { trad: t('row_trad_3'), sela: t('row_sela_3') },
    { trad: t('row_trad_4'), sela: t('row_sela_4') },
    { trad: t('row_trad_5'), sela: t('row_sela_5') },
    { trad: t('row_trad_6'), sela: t('row_sela_6') },
    { trad: t('row_trad_7'), sela: t('row_sela_7') },
    { trad: t('row_trad_8'), sela: t('row_sela_8') },
  ];

  return (
    <section className="comparison" dir={i18n.dir()}>
      <div className="comparison__label-wrap">
        <SectionLabel title={t('comp_label')} number="002" />
      </div>

      <h2 className={`comparison__title${sectionVisible ? ' comparison__title--visible' : ''}`} ref={sectionRef}>
        {t('comp_title')}
      </h2>

      <div className={`comparison__table${sectionVisible ? ' comparison__table--visible' : ''}`}>
        <div className="comparison__header">
          <div className="comparison__header-cell">{t('header_trad')}</div>
          <div className="comparison__header-cell comparison__header-cell--sela">{t('header_sela')}</div>
        </div>

        {ROWS.map((row, i) => (
          <div
            key={i}
            className="comparison__row"
            style={{ animationDelay: sectionVisible ? `${i * 60}ms` : '0ms' }}
          >
            <div className="comparison__cell comparison__cell--traditional">
              <span className="comparison__icon comparison__icon--x">✕</span>
              <span>{row.trad}</span>
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