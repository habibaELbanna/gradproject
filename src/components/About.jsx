import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from './Sectionlabel';
import Cubes from './Cubes';
import './About.css';

function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

function useCounter(target, suffix, active, duration = 1400) {
  const [value, setValue] = useState('0');
  useEffect(() => {
    if (!active) return;
    let current = 0;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      setValue(Math.floor(current) + suffix);
    }, 16);
    return () => clearInterval(interval);
  }, [active, target, suffix, duration]);
  return value;
}

function StatCard({ number, label, visible, delay = '0s', extraClass = '' }) {
  return (
    <div
      className={`about__stat${visible ? ' about__stat--visible' : ''}${extraClass ? ` ${extraClass}` : ''}`}
      style={{ transitionDelay: visible ? '0s' : delay }}
    >
      <span className="about__stat-num">{number}</span>
      <span className="about__stat-label">{label}</span>
    </div>
  );
}

export default function About() {
  const { t } = useTranslation();
  const [sectionRef, sectionVisible] = useScrollReveal(0.1);
  const [statsRef, statsVisible] = useScrollReveal(0.05);
  const [middleHovered, setMiddleHovered] = useState(false);

  const s1 = useCounter(5, 'M+', statsVisible, 1200);
  const s2 = useCounter(2500, '+', statsVisible, 1400);
  const s3 = useCounter(98, '%', statsVisible, 1000);

  return (
    <section className="about" ref={sectionRef}>
      <div className="about__label-wrap">
        <SectionLabel title={t('about_label')} number="001" />
      </div>

      <div className="about__body">
        <div className="about__left">
          <h2 className={`about__heading${sectionVisible ? ' about__heading--visible' : ''}`}>
            {t('about_heading_line1')}<br />
            {t('about_heading_line2')}
          </h2>
          <p className={`about__desc${sectionVisible ? ' about__desc--visible' : ''}`}>{t('about_desc_1')}</p>
          <p className={`about__desc about__desc--2${sectionVisible ? ' about__desc--visible' : ''}`}>{t('about_desc_2')}</p>
          <a href="/about" className={`about__link${sectionVisible ? ' about__link--visible' : ''}`}>{t('visit_about')}</a>
        </div>

        <div className="about__right">
          <div className={`about__cubes-wrap${sectionVisible ? ' about__cubes-wrap--visible' : ''}`}>
            <Cubes gridSize={8} maxAngle={40} radius={3} borderStyle="1px solid #1a1a1a"
              faceColor="#00a8e56c" rippleColor="#00A7E5" rippleSpeed={1.5} autoAnimate rippleOnClick />
          </div>
        </div>
      </div>

      <div className="about__stats" ref={statsRef}>
        <StatCard
          number={`$${s1}`}
          label={t('stat_val')}
          visible={statsVisible}
          delay="0s"
          extraClass={middleHovered ? 'about__stat--slide-left' : ''}
        />
        <div
          className={`about__stat about__stat--middle${statsVisible ? ' about__stat--visible' : ''}`}
          style={{ transitionDelay: statsVisible ? '0s' : '0.15s' }}
          onMouseEnter={() => setMiddleHovered(true)}
          onMouseLeave={() => setMiddleHovered(false)}
        >
          <span className="about__stat-num">{s2}</span>
          <span className="about__stat-label">{t('stat_users')}</span>
        </div>
        <StatCard
          number={s3}
          label={t('stat_rate')}
          visible={statsVisible}
          delay="0.3s"
          extraClass={middleHovered ? 'about__stat--slide-right' : ''}
        />
      </div>
    </section>
  );
}