import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';
import Logo from './Logo';
import MenuTrigger from './MenuTrigger';
import SvgButton from './SvgButton';
import SettingsPopup from './SettingsPopup';
import { IoSettingsOutline, IoArrowBackOutline, IoArrowForwardSharp } from 'react-icons/io5';
import styles from './Nav.module.css';

const SECTIONS = ['landing', 'intro', 'about', 'projects', 'skills', 'services', 'contact'];
const ease = [0.16, 1, 0.3, 1];

export default function Nav({ children, cursorEnabled, onCursorChange, alwaysVisible = false }) {
  const [active, setActive] = useState('landing');
  const [visible, setVisible] = useState(alwaysVisible);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [drawerView, setDrawerView] = useState('menu');

  useEffect(() => {
    if (alwaysVisible) return;

    const observers = SECTIONS.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.5 }
      );
      obs.observe(el);
      return obs;
    });

    const landingEl = document.getElementById('landing');
    if (landingEl) {
      const landingObs = new IntersectionObserver(
        ([entry]) => setVisible(!entry.isIntersecting),
        { threshold: 0.1 }
      );
      landingObs.observe(landingEl);
      observers.push(landingObs);
    }

    return () => observers.forEach(o => o?.disconnect());
  }, [alwaysVisible]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setDrawerView('menu');
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <AnimatePresence>
        {settingsOpen && (
          <SettingsPopup
            onClose={() => setSettingsOpen(false)}
            cursorEnabled={cursorEnabled}
            onCursorChange={onCursorChange}
          />
        )}
      </AnimatePresence>

      {/* ── Desktop nav ── */}

      <nav className={`${styles.nav} ${visible ? styles.visible : ''}`}>
        <Logo onClick={() => scrollTo('landing')} />
        <ul className={styles.links}>
          {SECTIONS.slice(1).map(id => (
            <li key={id}>
              <button
                className={`${styles.link} ${active === id ? styles.active : ''}`}
                onClick={() => scrollTo(id)}
              >{id}</button>
            </li>
          ))}
        </ul>
        <div className={styles.right}>
          {children}
          <SvgButton
            color="var(--accent)"
            colorHover="var(--accent2)"
            textColor="var(--accent)"
            width={36}
            height={36}
            strokeWidth={1.5}
            fadeLength={0.5}
            duration={1000}
            maxGap={0.5}
            radius={4}
            className={`${styles.settingsBtn} ${settingsOpen ? styles.settingsBtnActive : ''}`}
            onClick={() => setSettingsOpen(o => !o)}
            title="Preferences"
          >
            <motion.span
              animate={{ rotate: settingsOpen ? 60 : 0 }}
              transition={{ duration: 0.3, ease }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <IoSettingsOutline size={15} />
            </motion.span>
          </SvgButton>
        </div>
        <div className={styles.indicator}>
          {SECTIONS.map(id => (
            <span
              key={id}
              className={`${styles.dot} ${active === id ? styles.activeDot : ''}`}
              onClick={() => scrollTo(id)}
            />
          ))}
        </div>
      </nav>

      {/* ── Mobile top bar (tabs context only) ── */}
      {alwaysVisible && (
        <>
          <AnimatePresence>
            {drawerOpen && (
              <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setDrawerOpen(false)}
              />
            )}
          </AnimatePresence>

          <div className={`${styles.mobileTopBar} ${drawerOpen ? styles.mobileTopBarOpen : ''}`}>
            <div className={styles.mobileTopBarTop}>
              <Logo onClick={() => scrollTo('landing')} />
              <div className={styles.mobileTopBarRight}>
                <MenuTrigger isOpen={drawerOpen} onClick={() => setDrawerOpen(o => !o)} fixed={false} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {drawerOpen && drawerView === 'menu' && (
                <motion.div
                  key="menu-view"
                  className={styles.drawerContent}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className={styles.drawerRow}>
                    <ThemeSwitcher variant="list" />
                  </div>
                  <div className={styles.drawerRow}>
                    <button className={styles.drawerSettingsBtn} onClick={() => setDrawerView('settings')}>
                      <IoSettingsOutline size={13} />
                      <span>PREFERENCES</span>
                      <span className={styles.drawerArrow}><IoArrowForwardSharp size={12} /></span>
                    </button>
                  </div>
                </motion.div>
              )}

              {drawerOpen && drawerView === 'settings' && (
                <motion.div
                  key="settings-view"
                  className={styles.drawerContent}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <button className={styles.drawerBackBtn} onClick={() => setDrawerView('menu')}>
                    <IoArrowBackOutline size={13} />
                    <span>BACK</span>
                  </button>
                  <SettingsPopup
                    variant="inline"
                    onClose={() => setDrawerView('menu')}
                    cursorEnabled={cursorEnabled}
                    onCursorChange={onCursorChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className={styles.drawerHandle}>
              <span className={styles.drawerPill} />
            </div>
          </div>
        </>
      )}

      {/* ── Top drawer ── */}
  
    </>
  );
}