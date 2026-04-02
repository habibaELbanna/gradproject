import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import faqImg from '../Assets/faq.png';
import './Faq.css';

function FAQItem({ q, a, index, visible }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq__item ${open ? 'faq__item--open' : ''} ${visible ? 'faq__item--visible' : ''}`} style={{ transitionDelay: `${index * 80}ms` }}>
      <button className="faq__question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <div className={`faq__arrow ${open ? 'faq__arrow--open' : ''}`}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 4L5 7L8 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
      </button>
      <div className="faq__answer"><p>{a}</p></div>
    </div>
  );
}

export default function FAQ() {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const FAQS = [
    { q: t('faq_q1'), a: t('faq_a1') },
    { q: t('faq_q2'), a: t('faq_a2') },
    { q: t('faq_q3'), a: t('faq_a3') },
    { q: t('faq_q4'), a: t('faq_a4') },
    { q: t('faq_q5'), a: t('faq_a5') },
    { q: t('faq_q6'), a: t('faq_a6') },
    { q: t('faq_q7'), a: t('faq_a7') },
  ];

  return (
    <section className="faq" ref={ref} dir={i18n.dir()}>
      <div className="faq__body">
        <div className={`faq__left${visible ? ' faq__left--visible' : ''}`}>
          <span className="faq__eyebrow">{t('faq_eyebrow')}</span>
          <h2 className="faq__title">{t('faq_title')}</h2>
          <p className="faq__desc">{t('faq_desc')}</p>
          <img src={faqImg} alt="" className="faq__img" />
        </div>
        <div className="faq__right">
          {FAQS.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}