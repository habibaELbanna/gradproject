import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import Features from '../components/Features';
import Statistics from '../components/Statistics';
import Comparison from '../components/Comparison';
import Testimonials from '../components/Testimonials';
import CTA from '../components/Cta';
import Footer from '../components/Footer';
import bigbird from '../Assets/bigbird.svg';
import img1 from '../Assets/img1.png';
import img2 from '../Assets/img2.png';
import img3 from '../Assets/img3.png';
import img4 from '../Assets/img4.png';
import guyimg from '../Assets/guyimg.png';
import '../components/Tips.css';
import './Howitworkspage.css';

function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold, rootMargin: '0px 0px -80px 0px' });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const Play = () => (<svg viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>);

const BUYER_STEPS = [
  { num: '01', title: 'hwp_b1_title', desc: 'hwp_b1_desc', bullets: ['hwp_b1_b1','hwp_b1_b2','hwp_b1_b3','hwp_b1_b4','hwp_b1_b5'], img: img1 },
  { num: '02', title: 'hwp_b2_title', desc: 'hwp_b2_desc', bullets: ['hwp_b2_b1','hwp_b2_b2','hwp_b2_b3','hwp_b2_b4','hwp_b2_b5'], img: img2 },
  { num: '03', title: 'hwp_b3_title', desc: 'hwp_b3_desc', bullets: ['hwp_b3_b1','hwp_b3_b2','hwp_b3_b3','hwp_b3_b4','hwp_b3_b5'], img: img3 },
  { num: '04', title: 'hwp_b4_title', desc: 'hwp_b4_desc', bullets: ['hwp_b4_b1','hwp_b4_b2','hwp_b4_b3','hwp_b4_b4','hwp_b4_b5'], img: img4 },
];

const VENDOR_STEPS = [
  { num: '01', title: 'hwp_v1_title', desc: 'hwp_v1_desc', bullets: ['hwp_v1_b1','hwp_v1_b2','hwp_v1_b3','hwp_v1_b4','hwp_v1_b5'], img: img1 },
  { num: '02', title: 'hwp_v2_title', desc: 'hwp_v2_desc', bullets: ['hwp_v2_b1','hwp_v2_b2','hwp_v2_b3','hwp_v2_b4','hwp_v2_b5'], img: img2 },
  { num: '03', title: 'hwp_v3_title', desc: 'hwp_v3_desc', bullets: ['hwp_v3_b1','hwp_v3_b2','hwp_v3_b3','hwp_v3_b4','hwp_v3_b5'], img: img3 },
  { num: '04', title: 'hwp_v4_title', desc: 'hwp_v4_desc', bullets: ['hwp_v4_b1','hwp_v4_b2','hwp_v4_b3','hwp_v4_b4','hwp_v4_b5'], img: img4 },
];

const VIDEOS = [
  { title: 'hwp_vid1', dur: '2:15' },
  { title: 'hwp_vid2', dur: '3:40' },
  { title: 'hwp_vid3', dur: '4:02' },
];

export default function HowItWorksPage() {
  const { t, i18n } = useTranslation();
  const [heroRef, heroVisible] = useScrollReveal(0.05);
  const [tab, setTab] = useState('buyers');
  const birdRef = useRef(null);
  const birdWrapRef = useRef(null);
  const shadowRef = useRef(null);

  useEffect(() => {
    const wrap = birdWrapRef.current;
    const shadow = shadowRef.current;
    if (!wrap) return;
    gsap.set(wrap, { xPercent: -180, yPercent: -50, scale: 0.5, opacity: 0 });
    if (shadow) gsap.set(shadow, { scaleX: 0.4, opacity: 0 });
    if (!heroVisible) return;
    gsap.to(wrap, { xPercent: 0, scale: 1, opacity: 1, duration: 1.6, ease: 'power3.out', delay: 0.4 });
    if (shadow) {
      gsap.to(shadow, { scaleX: 1, opacity: 1, duration: 1.6, ease: 'power3.out', delay: 0.5,
        onComplete: () => { gsap.to(shadow, { scaleX: 0.78, opacity: 0.55, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }); } });
    }
  }, [heroVisible]);

  const handleMouseMove = useCallback((e) => {
    const el = birdRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    el.style.transform = `perspective(1200px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) scale(1.02)`;
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (birdRef.current) birdRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

  const steps = tab === 'buyers' ? BUYER_STEPS : VENDOR_STEPS;

  return (
    <div className="hw" dir={i18n.dir()}>
      <Navbar />

      <section className="hw-hero">
        <div ref={heroRef} className={`hw-card-wrap${heroVisible ? ' hw-card-wrap--visible' : ''}`}>
          <svg className="hw-card-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 797 620" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hwFrameGlow" x1="0%" y1="50%" x2="65%" y2="50%">
                <stop offset="0%" stopColor="#0E0E0E" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#0E0E0E" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#0E0E0E" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M796.141 97.1C796.141 82.9357 785.358 71.0996 771.255 69.7829L30.4859 0.621197C14.3961 -0.881022 0.499573 11.7785 0.499573 27.9383V591.414C0.499573 607.574 14.3961 620.234 30.486 618.731L771.255 549.57C785.358 548.253 796.141 536.417 796.141 522.253V97.1Z" fill="#0E0E0E" stroke="#00A7E5" />
            <path d="M796.141 97.1C796.141 82.9357 785.358 71.0996 771.255 69.7829L30.4859 0.621197C14.3961 -0.881022 0.499573 11.7785 0.499573 27.9383V591.414C0.499573 607.574 14.3961 620.234 30.486 618.731L771.255 549.57C785.358 548.253 796.141 536.417 796.141 522.253V97.1Z" fill="url(#hwFrameGlow)" />
          </svg>
          <div className="hw-card-text">
            <h1 className={`hw-htitle${heroVisible ? ' hw-htitle--visible' : ''}`}>{t('hwp_hero_title')}</h1>
            <p className={`hw-hdesc${heroVisible ? ' hw-hdesc--visible' : ''}`}>{t('hwp_hero_sub')}</p>
          </div>
          <div ref={birdWrapRef} className="hw-bird-wrap" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <img ref={birdRef} src={bigbird} alt="" className="hw-bird" style={{ transformStyle: 'preserve-3d', transition: 'transform 0.12s ease-out' }} />
            <div ref={shadowRef} className="hw-bird-shadow" />
          </div>
        </div>
      </section>

      <section className="hw-steps">
        <div className="hw-tabs">
          <button className={`hw-tab${tab === 'buyers' ? ' hw-tab--active' : ''}`} onClick={() => setTab('buyers')}>{t('hiw_buyers')}</button>
          <button className={`hw-tab${tab === 'vendors' ? ' hw-tab--active' : ''}`} onClick={() => setTab('vendors')}>{t('hiw_vendor')}</button>
        </div>
        <h2 className="hw-steps-heading">{tab === 'buyers' ? t('hwp_buyers_heading') : t('hwp_vendors_heading')}</h2>
        <div className="tips__list">
          {steps.map((step, i) => (
            <div key={`${tab}-${i}`} className={`tips__row ${i % 2 === 1 ? 'tips__row--reverse' : ''} tips__row--visible`}>
              <div className="tips__img-wrap"><img src={step.img} alt="" className="tips__img" /></div>
              <div className="tips__content">
                <span className="tips__num">{step.num}</span>
                <h3 className="tips__title">{t(step.title)}</h3>
                <p className="tips__desc">{t(step.desc)}</p>
                <ul className="tips__bullets">
                  {step.bullets.map((b, bi) => (<li key={bi} className="tips__bullet"><span className="tips__bullet-dot" />{t(b)}</li>))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Features />
      <Statistics />
      <Comparison />

      <section className="hw-video">
        <h2 className="hw-video__heading">{t('hwp_video_heading')}</h2>
        <p className="hw-video__sub">{t('hwp_video_sub')}</p>
        <div className="hw-video__main">
          <img src={guyimg} alt="" className="hw-video__guy" />
          <div className="hw-video__banner-text">
            <h3 className="hw-video__banner-title">{t('hwp_video_b1')}<br />{t('hwp_video_b2')}</h3>
            <p className="hw-video__banner-sub">{t('hwp_video_bsub')}</p>
          </div>
          <button className="hw-video__play" aria-label="Play overview"><Play /></button>
          <div className="hw-video__meta">
            <span>{t('hwp_video_walk')}</span>
            <span className="hw-video__dur">{t('hwp_video_dur')}</span>
          </div>
        </div>
        <div className="hw-video__grid">
          {VIDEOS.map((v, i) => (
            <div className="hw-vcard" key={i}>
              <span className="hw-vcard__play"><Play /></span>
              <span className="hw-vcard__title">{t(v.title)}</span>
              <span className="hw-vcard__dur">{v.dur}</span>
            </div>
          ))}
        </div>
        <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="hw-video__yt">{t('hwp_yt')}</a>
      </section>

      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}