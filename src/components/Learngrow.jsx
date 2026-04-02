import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from './Sectionlabel';
import thumb1 from '../Assets/thumb1.png';
import thumb2 from '../Assets/thumb2.png';
import './Learngrow.css';

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

export default function LearnGrow() {
  const { t } = useTranslation();
  const [sectionRef, visible] = useScrollReveal();

  const VIDEOS = [
    { thumb: thumb1, duration: '3:45', desc: t('learn_v1_desc'), views: t('learn_v1_views'), url: '#' },
    { thumb: thumb2, duration: '3:45', desc: t('learn_v2_desc'), views: t('learn_v2_views'), url: '#' },
  ];

  return (
    <section className="learn" ref={sectionRef}>
      <div className="learn__label-wrap"><SectionLabel title={t('learn_label')} number="006" /></div>
      <h2 className={`learn__title${visible ? ' learn__title--visible' : ''}`}>
        {t('learn_title1')}<br />{t('learn_title2')}
      </h2>
      <p className={`learn__sub${visible ? ' learn__sub--visible' : ''}`}>{t('learn_sub')}</p>
      <div className="learn__cards">
        {VIDEOS.map((v, i) => (
          <a key={i} href={v.url} className={`learn__card${visible ? ' learn__card--visible' : ''}`}
            style={{ transitionDelay: `${i * 150}ms` }} target="_blank" rel="noreferrer">
            <div className="learn__thumb-wrap">
              <img src={v.thumb} alt="" className="learn__thumb" />
              <span className="learn__duration">{v.duration}</span>
              <div className="learn__play">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L16 10L7 16V4Z" fill="white"/></svg>
              </div>
            </div>
            <div className="learn__card-body">
              <p className="learn__card-desc">{v.desc}</p>
              <span className="learn__views">{v.views}</span>
            </div>
          </a>
        ))}
      </div>
      <div className={`learn__footer${visible ? ' learn__footer--visible' : ''}`}>
        <a href="https://youtube.com" className="learn__yt-link" target="_blank" rel="noreferrer">
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><path d="M21.5 2.5C21.2 1.3 20.3 0.4 19.1 0.1C17.4 0 11 0 11 0C11 0 4.6 0 2.9 0.1C1.7 0.4 0.8 1.3 0.5 2.5C0 4.2 0 8 0 8C0 8 0 11.8 0.5 13.5C0.8 14.7 1.7 15.6 2.9 15.9C4.6 16 11 16 11 16C11 16 17.4 16 19.1 15.9C20.3 15.6 21.2 14.7 21.5 13.5C22 11.8 22 8 22 8C22 8 22 4.2 21.5 2.5ZM8.8 11.4V4.6L14.6 8L8.8 11.4Z" fill="#00A7E5"/></svg>
          {t('learn_yt')}
        </a>
        <span className="learn__subs">{t('learn_subs')}</span>
      </div>
    </section>
  );
}