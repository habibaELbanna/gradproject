import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';

export default function Landing() {
  const [lang, setLang] = useState('en');

  const handleLangToggle = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  return (
    <div style={{ background: '#0e0e0e', minHeight: '100vh' }}>
      <Navbar lang={lang} onLangToggle={handleLangToggle} />
      <Hero />
      <About />
    </div>
  );
}