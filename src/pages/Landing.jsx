import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Comparison from '../components/Comparison';
import Testimonials from '../components/Testimonials';
import Features from '../components/Features';
import bg from '../Assets/background.svg';
import './Landing.css';

export default function Landing() {
  const [lang, setLang] = useState('en');
  const handleLangToggle = () => setLang(prev => prev === 'en' ? 'ar' : 'en');

  return (
    <div style={{ background: '#0e0e0e', minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar lang={lang} onLangToggle={handleLangToggle} />
      <Hero />
      <About />
      <div className="landing__bg-wrap">
        <img src={bg} alt="" className="landing__bg" />
        <Comparison />
        <Testimonials />
      </div>
      <Features />
    </div>
  );
}