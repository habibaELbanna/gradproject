import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Comparison from '../components/Comparison';
import Testimonials from '../components/Testimonials';
import Features from '../components/Features';
import HowItWorks from '../components/Howitworks';
import LearnGrow from '../components/Learngrow';
import Tips from '../components/Tips';
import Statistics from '../components/Statistics';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';
import FAQ from '../components/Faq';
import CTA from '../components/Cta';
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
      <HowItWorks />
      <LearnGrow />
      <Tips />
      <Statistics />
      <Pricing />
      <Contact />
      <FAQ />
      <CTA />
    </div>
  );
}