import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
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
import Connect4 from './projectRoutes/Connect4';
import Skills from './sections/Skills';
import About from './sections/About';
import Contact from './sections/Contact';
import './index.css';

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

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<PortfolioInner />} />
        <Route path="/project/connect4" element={<Connect4 />} />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  );
}