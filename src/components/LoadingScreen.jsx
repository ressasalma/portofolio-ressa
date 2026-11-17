import { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onDone }) => {
  const [phase, setPhase] = useState('enter'); // enter → exit
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress dari 1% sampai 100%
    let val = 0;
    const interval = setInterval(() => {
      val += Math.random() * 15 + 5;
      if (val >= 100) {
        val = 100;
        clearInterval(interval);
        // Ketika tepat 100%, tunggu 400ms sebelum memicu exit
        setTimeout(() => setPhase('exit'), 400);
      }
      setProgress(Math.min(val, 100));
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === 'exit') {
      const t = setTimeout(() => onDone?.(), 800);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  return (
    <div className={`loading-screen loading-screen--${phase}`}>
      <div className="loading-bg-circle loading-bg-circle--1" />
      <div className="loading-bg-circle loading-bg-circle--2" />
      <div className="loading-bg-circle loading-bg-circle--3" />

      <div className="loading-content">
        <div className="loading-logo">
          <span className="loading-logo__letter">R</span>
          <span className="loading-logo__letter">e</span>
          <span className="loading-logo__letter">s</span>
          <span className="loading-logo__letter">s</span>
          <span className="loading-logo__letter">a</span>
        </div>

        <p className="loading-tagline">Portofolio & Creative Space</p>

        <div className="loading-bar-wrap">
          <div className="loading-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="loading-percent">{Math.round(progress)}%</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
