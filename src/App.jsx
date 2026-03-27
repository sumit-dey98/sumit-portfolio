import { Routes, Route } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useCursor } from './hooks/useCursor';
import { ThemeProvider, useThemeContext } from './theme/ThemeContext';
import Loader from './sections/Loader';
import SpinnerScreen from './components/SpinnerScreen';
import Genie from './components/Genie';
import Nav from './components/Nav';
import ThemeSwitcher from './components/ThemeSwitcher';
import Landing from './sections/Landing';
import Intro from './sections/Intro';
import Projects from './sections/Projects';
import SingleProject from './templates/SingleProject';
import Skills from './sections/Skills';
import Services from './sections/Services';
import About from './sections/About';
import Contact from './sections/Contact';
import './index.css';

const PROJECT_ROUTES = {
  'connect4': {
    logo: <img src="/projects/connect4/connect4-logo.svg" width={256} height={256} loading="lazy" />,
    src: '/projects/connect4/connect4.html',
    bgColor: 'var(--surface)',
    url: 'connect4',
  },
  'rubiks': {
    logo: <img src="/projects/rubiks/rubiks-logo.svg" width={256} height={256} loading="lazy" />,
    src: '/projects/rubiks/rubiks.html',
    bgColor: 'var(--surface)',
    url: 'rubiks-cube',
  },
  'interior': {
    logo: <img src="/projects/interior/interior-logo.svg" width={256} height={256} loading="lazy" />,
    src: '/projects/interior/index.html',
    bgColor: '#fff',
    url: 'interior-design-studio',
  },
};

function PortfolioInner() {
  const [phase, setPhase] = useState('loader');
  const [userPrefs, setUserPrefs] = useState(null);

  const { cursorRef, ringRef } = useCursor();

  const anchorRef = useRef(null);
  const bodyRef = useRef(null);
  const navRef = useRef(null);

  const handleSpinnerReady = useCallback(() => {
    setPhase('genie');
  }, []);

  const handleLoaderComplete = (prefs) => {
    setUserPrefs(prefs);
    setPhase('spinner');
  };

  const handleGenieComplete = () => {
    window.scrollTo(0, 0);
    document.documentElement.style.setProperty('scroll-snap-type', 'none', 'important');
    document.body.style.overflow = 'hidden';
    setPhase('sliding');
  };

  useEffect(() => {
    if (phase !== 'sliding') return;
    if (!bodyRef.current) return;
    bodyRef.current.classList.remove('body-slider-init');

    const t = setTimeout(() => {
      if (!bodyRef.current) return;

      gsap.to(bodyRef.current, {
        y: 0,
        duration: 0.8,
        ease: 'ease.in',
        force3D: true,
        onComplete: () => {
          document.body.style.overflow = '';
          document.documentElement.style.removeProperty('scroll-snap-type');
          window.scrollTo(0, 0);

          setPhase('landing');
      
          if (navRef.current) {
            gsap.fromTo(
              navRef.current,
              { opacity: 0, y: -12 },
              { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
          }
        },
      });
    }, 350);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
      document.documentElement.style.removeProperty('scroll-snap-type');
    };
  }, [phase]);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const showGenie = phase === 'genie' || phase === 'sliding';
  const showBody = phase === 'sliding' || phase === 'landing';

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      {/* -- Genie anchor - always in DOM ------------------------------- */}
      <div
        ref={anchorRef}
        style={{
          position: 'fixed',
          bottom: 2,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />

      {/* -- Genie ----------------------------------------------------- */}
      {showGenie && (
        <Genie
          anchorRef={anchorRef}
          onComplete={handleGenieComplete}
        />
      )}

      {/* -- Loader ----------------------------------------------------- */}
      {phase === 'loader' && (
        <Loader onComplete={handleLoaderComplete} />
      )}

      {/* -- Spinner ---------------------------------------------------- */}
      {phase === 'spinner' && (
        <SpinnerScreen onReady={handleSpinnerReady} />
      )}

      {/* -- Nav -------------------------------------------------------- */}
      {showBody && (
        <div
          ref={navRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 8000,
            opacity: 0,
          }}
        >
          <Nav>
            <ThemeSwitcher variant="dropdown" />
          </Nav>
        </div>
      )}

      {/* -- Body -------------------------------------------------------- */}
      {showBody && (
        <div
          ref={bodyRef}
          style={{
            position: 'relative',
            zIndex: 7000,
            background: 'var(--bg)',
            // willChange: 'transform',
            transform: 'translateY(100vh)', 
          }}
        >
          <Landing
            ready={phase === 'landing'}
            onEnter={() => scrollTo('intro')}
            onSkip={() => scrollTo('projects')}
          />
          <Intro userPrefs={userPrefs} />
          <About />
          <Projects />
          <Skills />
          <Services />
          <Contact />
        </div>
      )}
    </>
  );
}

function AppInner() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PortfolioInner />} />
        <Route path="/project/connect4" element={<SingleProject {...PROJECT_ROUTES['connect4']} />} />
        <Route path="/project/rubiks-cube" element={<SingleProject {...PROJECT_ROUTES['rubiks']} />} />
        <Route path="/project/interior" element={<SingleProject {...PROJECT_ROUTES['interior']} />} />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}