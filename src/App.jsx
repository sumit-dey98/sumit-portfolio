import { Routes, Route } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useCursor } from './hooks/useCursor';
import { ThemeProvider } from './theme/ThemeContext';
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
import MobileLayout from './components/MobileLayout';
import {PROJECT_ROUTES} from './data/data';
import './index.css';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 1023
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

function HorizontalMobileShell({ landingPanel, tabsPanel }) {
  const [panel, setPanel] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const THRESHOLD = 48;

  const slideTo = useCallback((index) => setPanel(index), []);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    touchStartX.current = null;
    touchStartY.current = null;

    if (dy > Math.abs(dx) || Math.abs(dx) < THRESHOLD) return;

    if (panel === 0 && dx > 0) slideTo(1);
  };

  const offset = panel === 0 ? '0vw' : '-100vw';

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100dvh', transform: `translateX(${offset})`, transition: 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)', willChange: 'transform' }}>
        {landingPanel(slideTo)}
      </div>
      <div style={{ position: 'absolute', top: 0, left: '100vw', width: '100vw', height: '100dvh', transform: `translateX(${offset})`, transition: 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)', willChange: 'transform' }}>
        {tabsPanel(slideTo)}
      </div>
    </div>
  );
}

function PortfolioInner() {
  const [phase, setPhase] = useState('loader');
  const [userPrefs, setUserPrefs] = useState(null);
  const isMobile = useIsMobile();

  const [cursorEnabled, setCursorEnabled] = useState(
    () => localStorage.getItem('ring-cursor') !== 'no'
  );
  const { cursorRef, ringRef } = useCursor(cursorEnabled);

  const anchorRef = useRef(null);
  const bodyRef = useRef(null);
  const navRef = useRef(null);

  const handleSpinnerReady = useCallback(() => {
    const genieEnabled = localStorage.getItem('genie-enabled') !== 'no';
    if (genieEnabled) {
      setPhase('genie');
    } else {
      window.scrollTo(0, 0);
      if (!isMobile) {
        document.documentElement.style.setProperty('scroll-snap-type', 'none', 'important');
      }
      document.body.style.overflow = 'hidden';
      setPhase('sliding');
    }
  }, [isMobile]);

  const handleGenieComplete = () => {
    window.scrollTo(0, 0);
    if (!isMobile) {
      document.documentElement.style.setProperty('scroll-snap-type', 'none', 'important');
    }
    document.body.style.overflow = 'hidden';
    setPhase('sliding');
  };

  const handleLoaderComplete = useCallback((prefs) => {
    setUserPrefs(prefs);
    setPhase('spinner');
  }, []);

  useEffect(() => {
    document.body.classList.toggle('hide-cursor', cursorEnabled);
  }, [cursorEnabled]);

  useEffect(() => {
    if (phase !== 'sliding' || !bodyRef.current) return;

    const t = setTimeout(() => {
      if (!bodyRef.current) return;

      const animProps = genieEnabled
        ? { y: 0, duration: 0.8, ease: 'ease.in' }
        : { opacity: 1, duration: 0.5, ease: 'power2.out' };

      gsap.to(bodyRef.current, {
        ...animProps,
        force3D: true,
        onComplete: () => {
          if (bodyRef.current) {
            bodyRef.current.style.transform = '';
            bodyRef.current.style.webkitTransform = '';
          }
          document.body.style.overflow = '';
          if (!isMobile) {
            document.documentElement.style.removeProperty('scroll-snap-type');
          }
          window.scrollTo(0, 0);
          setPhase('landing');

          if (navRef.current && !isMobile) {
            gsap.fromTo(
              navRef.current,
              { opacity: 0, y: -12 },
              { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
          }
        },
      });
    }, genieEnabled ? 350 : 0);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
      if (!isMobile) {
        document.documentElement.style.removeProperty('scroll-snap-type');
      }
    };
  }, [phase, isMobile]);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const genieEnabled = localStorage.getItem('genie-enabled') !== 'no';
  const showGenie = genieEnabled && (phase === 'genie' || phase === 'sliding');
  const showBody = phase === 'sliding' || phase === 'landing';

  const mobileSections = {
    intro: <Intro userPrefs={userPrefs} />,
    about: <About />,
    projects: <Projects />,
    skills: <Skills />,
    services: <Services />,
    contact: <Contact />,
  };

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

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

      {showGenie && <Genie anchorRef={anchorRef} onComplete={handleGenieComplete} />}

      {phase === 'loader' && <Loader onComplete={handleLoaderComplete} />}
      {phase === 'spinner' && <SpinnerScreen onReady={handleSpinnerReady} />}

      {showBody && !isMobile && (
        <div
          ref={navRef}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 8000, opacity: 0 }}
        >
          <Nav cursorEnabled={cursorEnabled} onCursorChange={setCursorEnabled}>
            <ThemeSwitcher variant="dropdown" />
          </Nav>
        </div>
      )}

      {showBody && (
        <div
          ref={bodyRef}
          style={{
            position: 'relative',
            zIndex: 7000,
            background: 'var(--bg)',
            transform: genieEnabled ? 'translateY(100vh)' : 'none',
            opacity: genieEnabled ? 1 : 0,
            ...(isMobile ? { height: '100dvh', overflow: 'hidden' } : {}),
          }}
        >
          {isMobile ? (
            <div style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 200 }}>
                <Nav alwaysVisible cursorEnabled={cursorEnabled} onCursorChange={setCursorEnabled}>
                  <ThemeSwitcher variant="dropdown" />
                </Nav>
              </div>

              <HorizontalMobileShell
                landingPanel={(slideTo) => (
                  <Landing
                    ready={phase === 'landing'}
                    onEnter={() => slideTo(1)}
                    onSkip={() => slideTo(1)}
                  />
                )}
                tabsPanel={(slideTo) => (
                  <MobileLayout
                    sections={mobileSections}
                    // nav={mobileNav}
                    onBackToLanding={() => slideTo(0)}
                  />
                )}
              />
            </div>
          ) : (
            <>
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
            </>
          )}
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
        <Route path="/project/connect4" element={<SingleProject {...PROJECT_ROUTES.connect4} />} />
        <Route path="/project/rubiks-cube" element={<SingleProject {...PROJECT_ROUTES.rubiks} />} />
        <Route path="/project/interior" element={<SingleProject {...PROJECT_ROUTES.interior} />} />
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