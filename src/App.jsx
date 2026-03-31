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
import './index.css';

/* ─── Project routes ──────────────────────── */
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

/* ─── Mobile breakpoint hook ──────────────── */
/* Hoisted above PortfolioInner so it's defined before use */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 767
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

/* ─── Main portfolio component ────────────── */
function PortfolioInner() {
  const [phase, setPhase] = useState('loader');
  const [userPrefs, setUserPrefs] = useState(null);
  const isMobile = useIsMobile();

  const [cursorEnabled, setCursorEnabled] = useState(
    () => localStorage.getItem('pretty-cursor') !== 'no'
  );
  const { cursorRef, ringRef } = useCursor(cursorEnabled);

  const anchorRef = useRef(null);
  const bodyRef = useRef(null);
  const navRef = useRef(null);

  /* ── Phase handlers ── */
  const handleSpinnerReady = useCallback(() => setPhase('genie'), []);
  const handleLoaderComplete = (prefs) => { setUserPrefs(prefs); setPhase('spinner'); };

  const handleGenieComplete = () => {
    window.scrollTo(0, 0);
    document.documentElement.style.setProperty('scroll-snap-type', 'none', 'important');
    document.body.style.overflow = 'hidden';
    setPhase('sliding');
  };

  /* ── Cursor ── */
  useEffect(() => {
    document.body.classList.toggle('hide-cursor', cursorEnabled);
  }, [cursorEnabled]);

  /* ── Body slide-in animation ── */
  useEffect(() => {
    if (phase !== 'sliding' || !bodyRef.current) return;
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

          /* Animate desktop nav in */
          if (navRef.current && !isMobile) {
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
  }, [phase, isMobile]);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const showGenie = phase === 'genie' || phase === 'sliding';
  const showBody = phase === 'sliding' || phase === 'landing';

  /* ── Mobile sections object ── */
  /* Defined here so userPrefs is in scope */
  const mobileSections = {
    intro: <Intro userPrefs={userPrefs} />,
    about: <About />,
    projects: <Projects />,
    skills: <Skills />,
    services: <Services />,
    contact: <Contact />,
  };

  /* ── Mobile nav — passed into MobileLayout ── */
  const mobileNav = (
    <Nav cursorEnabled={cursorEnabled} onCursorChange={setCursorEnabled}>
      <ThemeSwitcher variant="dropdown" />
    </Nav>
  );

  return (
    <>
      {/* Custom cursor (hidden on touch devices via CSS) */}
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      {/* Genie anchor point — must be outside bodyRef
          so position:fixed works against the true viewport */}
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

      {/* Genie renders outside bodyRef — unaffected by body transform */}
      {showGenie && (
        <Genie anchorRef={anchorRef} onComplete={handleGenieComplete} />
      )}

      {/* Loader / spinner */}
      {phase === 'loader' && <Loader onComplete={handleLoaderComplete} />}
      {phase === 'spinner' && <SpinnerScreen onReady={handleSpinnerReady} />}

      {/* Desktop nav — lives outside bodyRef so it's truly fixed */}
      {showBody && !isMobile && (
        <div
          ref={navRef}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            zIndex: 8000,
            opacity: 0,
          }}
        >
          <Nav cursorEnabled={cursorEnabled} onCursorChange={setCursorEnabled}>
            <ThemeSwitcher variant="dropdown" />
          </Nav>
        </div>
      )}

      {/* Invisible navRef target for mobile (gsap still needs the ref) */}
      {showBody && isMobile && (
        <div ref={navRef} style={{ position: 'fixed', opacity: 0, pointerEvents: 'none' }} />
      )}

      {/* ── Sliding body ──────────────────────────
          Starts off-screen (translateY 100vh).
          GSAP animates it to y:0.
          
          CRITICAL: Do NOT put position:fixed children
          inside this div. Fixed descendants of a
          transformed ancestor get positioned relative
          to the transform context, not the viewport —
          they'll appear on-screen during the genie
          animation. MobileLayout uses flexbox instead.
      ─────────────────────────────────────────── */}
      {showBody && (
        <div
          ref={bodyRef}
          style={{
            position: 'relative',
            zIndex: 7000,
            background: 'var(--bg)',
            transform: 'translateY(100vh)',
          }}
        >
          {/* Landing is always rendered in both layouts */}
          <Landing
            ready={phase === 'landing'}
            onEnter={() => scrollTo('intro')}
            onSkip={() => scrollTo('projects')}
          />

          {/* After Landing: tab layout on mobile, stacked sections on desktop */}
          {isMobile ? (
            <MobileLayout sections={mobileSections} nav={mobileNav} />
          ) : (
            <>
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

/* ─── Router ──────────────────────────────── */
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