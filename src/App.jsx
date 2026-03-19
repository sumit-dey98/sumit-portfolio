import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useCursor } from './hooks/useCursor';
import { ThemeProvider, useThemeContext } from './theme/ThemeContext';
import Loader from './sections/Loader';
import Nav from './components/Nav';
import ThemeSwitcher from './components/ThemeSwitcher';
import Landing from './sections/Landing';
import Intro from './sections/Intro';
import Projects from './sections/Projects';
import SingleProject from './templates/SingleProject';
import Skills from './sections/Skills';
import About from './sections/About';
import Contact from './sections/Contact';
import ProjectTransition from './components/ProjectTransition';
import './index.css';

const PROJECT_ROUTES = {
  'connect4': {
    logo: <img src="/projects/connect4/connect4-logo.svg" width={256} height={256} />,
    src: '/projects/connect4/connect4.html',
    bgColor: 'var(--surface)',
    url: 'connect4',
  },
  'rubiks': {
    logo: <img src="/projects/rubiks/rubiks-logo.svg" width={256} height={256} />,
    src: '/projects/rubiks/rubiks.html',
    bgColor: 'var(--surface)',
    url: 'rubiks-cube',
  },
  'interior': {
    logo: <img src="/projects/interior/interior-logo.svg" width={256} height={256} />,
    src: '/projects/interior/index.html',
    bgColor: '#fff',
    url: 'interior-design-studio',
  },
};

function PortfolioInner() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [userPrefs, setUserPrefs] = useState(null);

  const { cursorRef, ringRef } = useCursor();
  const { getCssVar } = useThemeContext();

  const handleLoaderComplete = (prefs) => {
    setUserPrefs(prefs);
    setLoaderDone(true);
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      {!loaderDone ? (
        <Loader onComplete={handleLoaderComplete} />
      ) : (
        <>
          <Nav>
            <ThemeSwitcher variant="dropdown" />
          </Nav>
          <Landing
            onEnter={() => scrollTo('intro')}
            onSkip={() => scrollTo('projects')}
            dotBaseColor={getCssVar('--surface')}
            dotActiveColor={getCssVar('--accent')}
          />
          <Intro userPrefs={userPrefs} />
          <Projects />
          <Skills />
          <About />
          <Contact />
        </>
      )}
    </>
  );
}

function AppInner() {
  const location = useLocation();

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