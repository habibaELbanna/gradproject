import { useEffect, useState } from 'react';
import './Preloader.css';

export default function Preloader({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2000);
    const done = setTimeout(() => onFinish(), 2500);
    return () => { clearTimeout(timer); clearTimeout(done); };
  }, [onFinish]);

  return (
    <div className={`pre__wrap ${fadeOut ? 'pre__wrap--out' : ''}`}>
      <div className="pre__content">
        <svg className="pre__logo" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="32" fontSize="36" fontWeight="900" fontFamily="Helvetica, Arial" fill="#fff">SELA</text>
        </svg>
        <svg className="pre__bird" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5">
          <path d="M22 2L11 13"/>
          <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
        </svg>
        <div className="pre__bar">
          <div className="pre__bar-fill" />
        </div>
      </div>
    </div>
  );
}
