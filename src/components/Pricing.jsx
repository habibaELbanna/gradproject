import { useEffect, useRef, useState } from 'react';
import SectionLabel from './Sectionlabel';
import './Pricing.css';

const PLANS = [
  {
    badge: 'STARTER',
    name: 'FREE',
    price: 'EGP 0',
    period: '/MONTH',
    desc: 'Perfect for getting started',
    features: ['5 needs per month', 'Unlimited browsing', 'Basic search & filters', 'Email support', 'Community access'],
    cta: 'GET STARTED FREE',
    highlight: false,
    href: '/signup',
  },
  {
    badge: 'PROFESSIONAL',
    name: 'PRO',
    price: 'EGP 1099',
    period: '/MONTH',
    desc: 'For growing businesses',
    features: ['Unlimited needs & proposals', 'Priority matching', 'Advanced analytics', '24/7 support', 'Verified badge', 'Featured listings'],
    cta: 'START FREE TRIAL',
    highlight: true,
    href: '/signup',
  },
  {
    badge: 'ENTERPRISE',
    name: 'ENTERPRISE',
    price: 'Custom',
    period: '',
    desc: 'For large organizations',
    features: ['Everything in Pro', 'Custom integrations', 'Account manager', 'Training & onboarding', 'Advanced security'],
    cta: 'CONTACT SALES',
    highlight: false,
    href: '/contact',
  },
];

export default function Pricing() {
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
    <section className="pricing" ref={ref}>
      <div className="pricing__top">
        <div>
          <h2 className={`pricing__title${visible ? ' pricing__title--visible' : ''}`}>
            TRANSPARENT PRICING<br />FOR EVERY BUSINESS
          </h2>
          <a href="/pricing" className="pricing__link">Visit Full Pricing Page →</a>
        </div>
        <div className="pricing__label-wrap">
          <SectionLabel title="Choose Plan" number="009" />
        </div>
      </div>

      <div className="pricing__cards">
        {PLANS.map((plan, i) => (
          <div
            key={i}
            className={`pricing__card ${plan.highlight ? 'pricing__card--highlight' : ''} ${visible ? 'pricing__card--visible' : ''}`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            <div className={`pricing__badge ${plan.highlight ? 'pricing__badge--highlight' : ''}`}>
              {plan.badge}
            </div>

            <div className="pricing__name">{plan.name}</div>
            <div className="pricing__price">
              <span className={`pricing__amount ${plan.highlight ? 'pricing__amount--blue' : ''}`}>{plan.price}</span>
              {plan.period && <span className="pricing__period">{plan.period}</span>}
            </div>
            <p className="pricing__desc">{plan.desc}</p>

            <ul className="pricing__features">
              {plan.features.map((f, fi) => (
                <li key={fi} className="pricing__feature">
                  <span className="pricing__feature-dot" />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href={plan.href}
              className={`pricing__cta ${plan.highlight ? 'pricing__cta--highlight' : ''}`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}