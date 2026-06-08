import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
import FAQ from '../components/Faq';
import CTA from '../components/Cta';
import SectionLabel from '../components/Sectionlabel';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import './Contactus.css';

const NEWS = [
  { source: 'news_1_source', title: 'news_1_title', date: 'news_1_date' },
  { source: 'news_2_source', title: 'news_2_title', date: 'news_2_date' },
  { source: 'news_3_source', title: 'news_3_title', date: 'news_3_date' },
  { source: 'news_4_source', title: 'news_4_title', date: 'news_4_date' },
];

const HorizontalLine = ({ direction = 'down' }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const nodes = [ { progress: 0.0, speed: 0.0035, size: 3 }, { progress: 0.5, speed: 0.0035, size: 3 } ];
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;
      const dotX = W * 0.28, dotY = H * 0.5, breakX = W * 0.70, endX = W;
      const endY = direction === 'down' ? H * 0.95 : H * 0.5;
      const glow = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 26);
      glow.addColorStop(0, 'rgba(0,167,229,0.7)'); glow.addColorStop(0.4, 'rgba(0,167,229,0.25)'); glow.addColorStop(1, 'rgba(0,167,229,0)');
      ctx.beginPath(); ctx.arc(dotX, dotY, 26, 0, Math.PI * 2); ctx.fillStyle = glow; ctx.fill();
      ctx.beginPath(); ctx.arc(dotX, dotY, 7, 0, Math.PI * 2); ctx.fillStyle = '#00A7E5'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(dotX + 8, dotY); ctx.lineTo(breakX, dotY); ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#00A7E5'; ctx.lineWidth = 1; ctx.globalAlpha = 0.75; ctx.stroke(); ctx.globalAlpha = 1;
      const seg1Len = breakX - dotX - 8, seg2Len = Math.hypot(endX - breakX, endY - dotY), totalLen = seg1Len + seg2Len;
      nodes.forEach(node => {
        node.progress += node.speed; if (node.progress > 1) node.progress -= 1;
        const dist = node.progress * totalLen; let nx, ny;
        if (dist <= seg1Len) { nx = dotX + 8 + dist; ny = dotY; }
        else { const t = (dist - seg1Len) / seg2Len; nx = breakX + (endX - breakX) * t; ny = dotY + (endY - dotY) * t; }
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, node.size * 5);
        g.addColorStop(0, 'rgba(255,255,255,0.7)'); g.addColorStop(0.3, 'rgba(255,255,255,0.2)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath(); ctx.arc(nx, ny, node.size * 5, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(nx, ny, node.size, 0, Math.PI * 2); ctx.fillStyle = '#ffffff'; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [direction]);
  return <canvas ref={canvasRef} className="cu-hline-canvas" />;
};

export default function ContactUs() {
  const { t, i18n } = useTranslation();
  return (
    <div className="cu" dir={i18n.dir()}>
      <Navbar />

      <section className="cu-hero">
        <span className="cu-hero__watermark" aria-hidden="true">CONTACT US</span>
        <h1 className="cu-hero__title">{t('cu_hero_title')}</h1>
        <p className="cu-hero__sub">{t('cu_hero_sub')}</p>
      </section>

      <Contact />

      <section className="cu-prefer">
        <div className="cu-mv-row">
          <div className="cu-mv-text">
            <h2 className="cu-mv-heading">{t('cu_pref_email_title')}</h2>
            <p className="cu-mv-desc">{t('cu_pref_email_desc')}</p>
            <a href="mailto:support@sela.com.eg" className="cu-mv-link">support@sela.com.eg</a>
          </div>
          <div className="cu-mv-line"><HorizontalLine direction="down" /></div>
        </div>
        <div className="cu-mv-row cu-mv-row--indent">
          <div className="cu-mv-text">
            <h2 className="cu-mv-heading">{t('cu_pref_call_title')}</h2>
            <p className="cu-mv-desc">{t('cu_pref_call_desc')}</p>
            <span className="cu-mv-link">{t('cu_pref_call_sub')}</span>
          </div>
          <div className="cu-mv-line"><HorizontalLine direction="flat" /></div>
        </div>
      </section>

      <section className="cu-hours">
        {[{ label: t('cu_lang_en') }, { label: t('cu_lang_ar') }].map((tbl, idx) => (
          <table className="cu-table" key={idx}>
            <thead>
              <tr><th className="cu-table__title" colSpan={4}>{tbl.label}</th></tr>
              <tr className="cu-table__cols">
                <th></th><th>{t('cu_voice')}</th><th>{t('cu_chat')}</th><th>{t('cu_email')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="cu-table__day">{t('cu_weekday')}</td>
                <td>10:30AM - 6:00PM EST</td>
                <td colSpan={2}>9:00AM - 5:00PM EST</td>
              </tr>
              <tr>
                <td className="cu-table__day">{t('cu_weekend')}</td>
                <td>{t('cu_closed')}</td>
                <td colSpan={2}>12:00PM - 4:00PM EST</td>
              </tr>
            </tbody>
          </table>
        ))}
      </section>

      <FAQ />

      <Testimonials />

      <section className="cu-news">
        <SectionLabel title={t('news_label')} number="007" />
        <div className="cu-news-grid">
          {NEWS.map((n, i) => (
            <div key={i} className="cu-news-card">
              <span className="cu-news-source">{t(n.source)}</span>
              <h3 className="cu-news-title">{t(n.title)}</h3>
              <span className="cu-news-date">{t(n.date)}</span>
              <a href="#" className="cu-news-link" onClick={(e) => e.preventDefault()}>{t('read_article')}</a>
            </div>
          ))}
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}