import { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
import FAQ from '../components/Faq';
import CTA from '../components/Cta';
import SectionLabel from '../components/Sectionlabel';
import Footer from '../components/Footer';
import './Contactus.css';

const NEWS = [
  { source: 'TECHCRUNCH MIDDLE EAST', title: 'SELA Revolutionizes Egyptian B2B Market', date: 'January 2025' },
  { source: 'ENTERPRISE TIMES',       title: 'How SELA is Transforming Procurement',  date: 'December 2024' },
  { source: 'CAIRO BUSINESS MONTHLY',  title: 'The Rise of Digital Procurement Platforms', date: 'November 2024' },
  { source: 'MENA TECH REVIEW',        title: 'SELA Reaches 1000+ Deals Milestone',  date: 'October 2024' },
];

const HorizontalLine = ({ direction = 'down' }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const nodes = [
      { progress: 0.0, speed: 0.0035, size: 3 },
      { progress: 0.5, speed: 0.0035, size: 3 },
    ];
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;
      const dotX = W * 0.28;
      const dotY = H * 0.5;
      const breakX = W * 0.70;
      const endX = W;
      const endY = direction === 'down' ? H * 0.95 : H * 0.5;
      const glow = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 26);
      glow.addColorStop(0, 'rgba(0,167,229,0.7)');
      glow.addColorStop(0.4, 'rgba(0,167,229,0.25)');
      glow.addColorStop(1, 'rgba(0,167,229,0)');
      ctx.beginPath(); ctx.arc(dotX, dotY, 26, 0, Math.PI * 2);
      ctx.fillStyle = glow; ctx.fill();
      ctx.beginPath(); ctx.arc(dotX, dotY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#00A7E5'; ctx.fill();
      ctx.beginPath();
      ctx.moveTo(dotX + 8, dotY);
      ctx.lineTo(breakX, dotY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#00A7E5'; ctx.lineWidth = 1; ctx.globalAlpha = 0.75; ctx.stroke(); ctx.globalAlpha = 1;
      const seg1Len = breakX - dotX - 8;
      const seg2Len = Math.hypot(endX - breakX, endY - dotY);
      const totalLen = seg1Len + seg2Len;
      nodes.forEach(node => {
        node.progress += node.speed;
        if (node.progress > 1) node.progress -= 1;
        const dist = node.progress * totalLen;
        let nx, ny;
        if (dist <= seg1Len) { nx = dotX + 8 + dist; ny = dotY; }
        else { const t = (dist - seg1Len) / seg2Len; nx = breakX + (endX - breakX) * t; ny = dotY + (endY - dotY) * t; }
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, node.size * 5);
        g.addColorStop(0, 'rgba(255,255,255,0.7)');
        g.addColorStop(0.3, 'rgba(255,255,255,0.2)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
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
  return (
    <div className="cu">
      <Navbar />

      <section className="cu-hero">
        <span className="cu-hero__watermark" aria-hidden="true">CONTACT US</span>
        <h1 className="cu-hero__title">WE'RE HERE WHEN IT MATTERS.</h1>
        <p className="cu-hero__sub">Real People, Quick Replies, Tailored Solutions, Clear Communication, Ongoing Support — All Ready For You.</p>
      </section>

      <Contact />

      <section className="cu-prefer">
        <div className="cu-mv-row">
          <div className="cu-mv-text">
            <h2 className="cu-mv-heading">Prefer email?</h2>
            <p className="cu-mv-desc">You can also reach us at</p>
            <a href="mailto:support@sela.com.eg" className="cu-mv-link">support@sela.com.eg</a>
          </div>
          <div className="cu-mv-line"><HorizontalLine direction="down" /></div>
        </div>
        <div className="cu-mv-row cu-mv-row--indent">
          <div className="cu-mv-text">
            <h2 className="cu-mv-heading">Prefer a call?</h2>
            <p className="cu-mv-desc">Schedule a quick call with our team</p>
            <span className="cu-mv-link">look below for the Customer Service Hours of Operation</span>
          </div>
          <div className="cu-mv-line"><HorizontalLine direction="flat" /></div>
        </div>
      </section>

      <section className="cu-hours">
        {['English', 'Arabic'].map((lang) => (
          <table className="cu-table" key={lang}>
            <thead>
              <tr><th className="cu-table__title" colSpan={4}>{lang}</th></tr>
              <tr className="cu-table__cols">
                <th></th><th>Voice</th><th>Chat</th><th>Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="cu-table__day">Weekday</td>
                <td>10:30AM - 6:00PM EST</td>
                <td colSpan={2}>9:00AM - 5:00PM EST</td>
              </tr>
              <tr>
                <td className="cu-table__day">Weekend</td>
                <td>Closed</td>
                <td colSpan={2}>12:00PM - 4:00PM EST</td>
              </tr>
            </tbody>
          </table>
        ))}
      </section>

      <FAQ />

      <section className="cu-news">
        <SectionLabel title="NEWS" number="007" />
        <div className="cu-news-grid">
          {NEWS.map((n, i) => (
            <div key={i} className="cu-news-card">
              <span className="cu-news-source">{n.source}</span>
              <h3 className="cu-news-title">{n.title}</h3>
              <span className="cu-news-date">{n.date}</span>
              <a href="#" className="cu-news-link" onClick={(e) => e.preventDefault()}>READ ARTICLE →</a>
            </div>
          ))}
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}