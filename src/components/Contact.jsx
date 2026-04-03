import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import SectionLabel from './Sectionlabel';
import './Contact.css';

export default function Contact() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('loading');
    const { error } = await supabase
      .from('contact_messages')
      .insert([{ name: form.name, email: form.email, message: form.message }]);
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    }
  };

  return (
    <section className="contact" ref={ref}>
      <div className="contact__label-wrap">
        <SectionLabel title={t('cont_label')} number="010" />
      </div>

      <h2 className={`contact__title${visible ? ' contact__title--visible' : ''}`}>
        {t('cont_title')}<br />{t('cont_title_2')}
      </h2>

      <div className="contact__body">
        <div className={`contact__left${visible ? ' contact__left--visible' : ''}`}>
          <h3 className="contact__subtitle">{t('cont_subtitle')}</h3>
          <div className="contact__info-list">
            <div className="contact__info-item">
              <div className="contact__info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#00A7E5" strokeWidth="1.5"/>
                  <path d="M22 6l-10 7L2 6" stroke="#00A7E5" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <div className="contact__info-label">{t('cont_email')}</div>
                <div className="contact__info-value">support@sela.com.eg</div>
              </div>
            </div>
            <div className="contact__info-item">
              <div className="contact__info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#00A7E5" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <div className="contact__info-label">{t('cont_phone')}</div>
                <div className="contact__info-value">+20 2 1234 5678</div>
              </div>
            </div>
            <div className="contact__info-item">
              <div className="contact__info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#00A7E5" strokeWidth="1.5"/>
                  <circle cx="12" cy="10" r="3" stroke="#00A7E5" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <div className="contact__info-label">{t('cont_addr')}</div>
                <div className="contact__info-value">Cairo, Egypt</div>
              </div>
            </div>
            <div className="contact__info-item">
              <div className="contact__info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#00A7E5" strokeWidth="1.5"/>
                  <path d="M12 6v6l4 2" stroke="#00A7E5" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="contact__info-label">{t('cont_hours')}</div>
                <div className="contact__info-value">{t('cont_hours_val')}</div>
              </div>
            </div>
          </div>
          <a href="/contact" className="contact__link">{t('cont_link')}</a>
        </div>

        <form className={`contact__form${visible ? ' contact__form--visible' : ''}`} onSubmit={handleSubmit}>
          <div className="contact__field">
            <label className="contact__label">{t('form_name')}</label>
            <input className="contact__input" type="text" name="name" placeholder={t('form_name_ph')}
              value={form.name} onChange={handleChange} required />
          </div>
          <div className="contact__field">
            <label className="contact__label">{t('form_email')}</label>
            <input className="contact__input" type="email" name="email" placeholder={t('form_email_ph')}
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="contact__field">
            <label className="contact__label">{t('form_msg')}</label>
            <textarea className="contact__textarea" name="message" placeholder={t('form_msg_ph')}
              value={form.message} onChange={handleChange} rows={6} required />
          </div>

          <button type="submit" className={`contact__submit${status === 'loading' ? ' contact__submit--loading' : ''}`}
            disabled={status === 'loading'}>
            {status === 'loading' ? '...' : status === 'success' ? '✓ Message Sent!' : t('form_send')}
          </button>

          {status === 'error' && (
            <p className="contact__error">Something went wrong. Please try again.</p>
          )}
        </form>
      </div>
    </section>
  );
}