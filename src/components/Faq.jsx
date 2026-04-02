import { useEffect, useRef, useState } from 'react';
import faqImg from '../Assets/faq.png';
import './Faq.css';

const FAQS = [
  { q: 'Is Sela free to use?', a: 'Sela offers a free Starter plan with 5 needs per month. Upgrade to Pro for unlimited access and advanced features.' },
  { q: 'How are vendors verified?', a: 'All vendors go through a multi-step verification including business registration, tax ID, and quality assessment before approval.' },
  { q: 'How long does it take to receive proposals?', a: 'Most buyers receive their first proposals within 24-48 hours of posting a need.' },
  { q: 'What payment methods are accepted?', a: 'We accept credit/debit cards, bank transfers, and major Egyptian payment gateways.' },
  { q: 'Can I negotiate prices after receiving proposals?', a: 'Yes, you can communicate directly with vendors through our messaging system to negotiate terms.' },
  { q: "What if I'm not satisfied with a vendor?", a: 'We have a dispute resolution process and vendor rating system to ensure quality and accountability.' },
  { q: 'Do you offer training for new users?', a: 'Yes, we offer onboarding tutorials, video guides, and dedicated support for new users.' },
];

function FAQItem({ item, index, visible }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`faq__item ${open ? 'faq__item--open' : ''} ${visible ? 'faq__item--visible' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <button className="faq__question" onClick={() => setOpen(!open)}>
        <span>{item.q}</span>
        <div className={`faq__arrow ${open ? 'faq__arrow--open' : ''}`}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 4L5 7L8 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </button>
      <div className="faq__answer">
        <p>{item.a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
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

  return (
    <section className="faq" ref={ref}>
      <div className="faq__body">
        <div className={`faq__left${visible ? ' faq__left--visible' : ''}`}>
          <span className="faq__eyebrow">ANY QUESTIONS IN MIND</span>
          <h2 className="faq__title">FAQ</h2>
          <p className="faq__desc">
            Whenever you're ready, feel free to send a message. assistance is available to address any questions or concerns you might have.
          </p>
          <img src={faqImg} alt="" className="faq__img" />
        </div>

        <div className="faq__right">
          {FAQS.map((item, i) => (
            <FAQItem key={i} item={item} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}