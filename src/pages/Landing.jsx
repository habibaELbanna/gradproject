import React from 'react';
import { useTranslation } from 'react-i18next'; // Import the hook
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
import Footer from '../components/Footer';
import bg from '../Assets/background.svg';
import './Landing.css';

export default function Landing() {
  // 1. Use the translation hook instead of local useState
  const { i18n } = useTranslation();

  // 2. This function now changes the language GLOBALLLY
  const handleLangToggle = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div 
      style={{ 
        background: '#0e0e0e', 
        minHeight: '100vh', 
        overflowX: 'hidden' 
      }} 
      // 3. This 'dir' handles RTL for the whole page layout
      dir={i18n.dir()} 
    >
      {/* Pass the current language and toggle function to Navbar */}
      <Navbar lang={i18n.language} onLangToggle={handleLangToggle} />
      
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
      <Footer />
    </div>
  );
}