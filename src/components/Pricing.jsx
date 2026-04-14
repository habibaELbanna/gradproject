import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from './Sectionlabel';
import './Pricing.css';

export default function Pricing() {
  const { t } = useTranslation();
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

  const PLANS = [
    {
      badge: t('plan_starter'), name: t('plan_free'), price: t('plan_free_price'), period: t('plan_month'),
      desc: t('plan_free_desc'), highlight: false, cta: t('plan_free_cta'), href: '/signup',
      features: [t('plan_f1'), t('plan_f2'), t('plan_f3'), t('plan_f4'), t('plan_f5')],
    },
    {
      badge: t('plan_pro_badge'), name: t('plan_pro'), price: t('plan_pro_price'), period: t('plan_month'),
      desc: t('plan_pro_desc'), highlight: true, cta: t('plan_pro_cta'), href: '/signup',
      features: [t('plan_p1'), t('plan_p2'), t('plan_p3'), t('plan_p4'), t('plan_p5'), t('plan_p6')],
    },
    {
      badge: t('plan_ent_badge'), name: t('plan_ent'), price: t('plan_ent_price'), period: '',
      desc: t('plan_ent_desc'), highlight: false, cta: t('plan_ent_cta'), href: '/contact',
      features: [t('plan_e1'), t('plan_e2'), t('plan_e3'), t('plan_e4'), t('plan_e5')],
    },
  ];

  return (
    <section className="pricing" ref={ref}>
      <div className="pricing__label-wrap">
        <SectionLabel title={t('pricing_label')} number="009" />
      </div>
      <div className="pricing__top">
        <h2 className={`pricing__title${visible ? ' pricing__title--visible' : ''}`}>
          {t('pricing_title1')}<br />{t('pricing_title2')}
        </h2>
        <a href="/pricing" className="pricing__link">{t('pricing_link')}</a>
      </div>
      <div className="pricing__cards">
        {PLANS.map((plan, i) => (
          <div key={i} className={`pricing__card ${plan.highlight ? 'pricing__card--highlight' : ''} ${visible ? 'pricing__card--visible' : ''}`}
            style={{ transitionDelay: `${i * 120}ms` }}>
            <div className={`pricing__badge ${plan.highlight ? 'pricing__badge--highlight' : ''}`}>{plan.badge}</div>
            <div className="pricing__name">{plan.name}</div>
            <div className="pricing__price">
              <span className={`pricing__amount ${plan.highlight ? 'pricing__amount--blue' : ''}`}>{plan.price}</span>
              {plan.period && <span className="pricing__period">{plan.period}</span>}
            </div>
            <p className="pricing__desc">{plan.desc}</p>
            <ul className="pricing__features">
              {plan.features.map((f, fi) => (
                <li key={fi} className="pricing__feature"><span className="pricing__feature-dot" />{f}</li>
              ))}
            </ul>
            <a href={plan.href} className={`pricing__cta ${plan.highlight ? 'pricing__cta--highlight' : ''}`}>{plan.cta}</a>
          </div>
        ))}
      </div>
    </section>
  );
}