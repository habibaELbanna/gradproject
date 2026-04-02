import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from './Sectionlabel';
import tip1 from '../Assets/tip1.png';
import tip2 from '../Assets/tip2.png';
import tip3 from '../Assets/tip3.png';
import './Tips.css';

function TipRow({ num, title, desc, bullets, img, reverse }) {
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
  return (
    <div ref={ref} className={`tips__row ${reverse ? 'tips__row--reverse' : ''} ${visible ? 'tips__row--visible' : ''}`}>
      <div className="tips__img-wrap"><img src={img} alt="" className="tips__img" /></div>
      <div className="tips__content">
        <span className="tips__num">{num}</span>
        <h3 className="tips__title">{title}</h3>
        <p className="tips__desc">{desc}</p>
        <ul className="tips__bullets">
          {bullets.map((b, i) => (
            <li key={i} className="tips__bullet"><span className="tips__bullet-dot" />{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Tips() {
  const { t } = useTranslation();
  const TIPS = [
    { num: '01', title: t('tips_1_title'), desc: t('tips_1_desc'), bullets: [t('tips_1_b1'), t('tips_1_b2'), t('tips_1_b3')], img: tip1, reverse: false },
    { num: '02', title: t('tips_2_title'), desc: t('tips_2_desc'), bullets: [t('tips_2_b1'), t('tips_2_b2'), t('tips_2_b3')], img: tip2, reverse: true },
    { num: '03', title: t('tips_3_title'), desc: t('tips_3_desc'), bullets: [t('tips_3_b1'), t('tips_3_b2'), t('tips_3_b3')], img: tip3, reverse: false },
  ];
  return (
    <section className="tips">
      <div className="tips__label-wrap"><SectionLabel title={t('tips_label')} number="007" /></div>
      <h2 className="tips__heading">{t('tips_heading1')}<br />{t('tips_heading2')}</h2>
      <div className="tips__list">
        {TIPS.map((tip, i) => <TipRow key={i} {...tip} />)}
      </div>
    </section>
  );
}