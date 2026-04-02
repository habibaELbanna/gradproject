import { useEffect, useRef, useState } from 'react';
import SectionLabel from './Sectionlabel';
import tip1 from '../Assets/tip1.png';
import tip2 from '../Assets/tip2.png';
import tip3 from '../Assets/tip3.png';
import './Tips.css';

const TIPS = [
  {
    num: '01',
    title: 'Write Clear, Detailed Descriptions',
    desc: "The more specific you are about your requirements, timeline, and budget, the better proposals you'll receive. Include technical specifications, quantities, and quality standards.",
    bullets: [
      'Be specific about quantities and specifications',
      'Include timeline and delivery requirements',
      'Set realistic budgets based on market rates',
    ],
    img: tip1,
    reverse: false,
  },
  {
    num: '02',
    title: 'Build Trust with Quality Portfolios',
    desc: 'Showcase your best work with high-quality photos, detailed case studies, and client testimonials. A strong portfolio increases your proposal acceptance rate by 300%.',
    bullets: [
      'Upload professional photos of completed projects',
      'Include before/after comparisons when relevant',
      'Add client testimonials and success metrics',
    ],
    img: tip2,
    reverse: true,
  },
  {
    num: '03',
    title: 'Respond Quickly to Opportunities',
    desc: 'Speed matters. Vendors who respond within 2 hours are 5x more likely to win contracts. Enable notifications and check the platform regularly to stay competitive.',
    bullets: [
      'Enable push notifications for new opportunities',
      'Set up email alerts for your categories',
      'Aim to respond within 24 hours maximum',
    ],
    img: tip3,
    reverse: false,
  },
];

function TipRow({ tip, index }) {
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
    <div
      ref={ref}
      className={`tips__row ${tip.reverse ? 'tips__row--reverse' : ''} ${visible ? 'tips__row--visible' : ''}`}
    >
      <div className="tips__img-wrap">
        <img src={tip.img} alt="" className="tips__img" />
      </div>
      <div className="tips__content">
        <span className="tips__num">{tip.num}</span>
        <h3 className="tips__title">{tip.title}</h3>
        <p className="tips__desc">{tip.desc}</p>
        <ul className="tips__bullets">
          {tip.bullets.map((b, i) => (
            <li key={i} className="tips__bullet">
              <span className="tips__bullet-dot" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Tips() {
  return (
    <section className="tips">
      <div className="tips__label-wrap">
        <SectionLabel title="Tips" number="007" />
      </div>

      <h2 className="tips__heading">
        MAXIMIZE YOUR<br />SUCCESS ON SELA
      </h2>

      <div className="tips__list">
        {TIPS.map((tip, i) => (
          <TipRow key={i} tip={tip} index={i} />
        ))}
      </div>
    </section>
  );
}