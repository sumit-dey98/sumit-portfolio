import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';
import Logo from './Logo';
import MenuTrigger from './MenuTrigger';
import SvgButton from './SvgButton';
import SettingsPopup from './SettingsPopup';
import { useUserPrefs } from '../hooks/useUserPrefs';
import { IoSettingsOutline, IoArrowBackOutline, IoArrowForwardSharp } from 'react-icons/io5';
import styles from './Nav.module.css';

const SECTIONS = ['landing', 'intro', 'projects', 'skills', 'about', 'contact'];
const ease = [0.16, 1, 0.3, 1];

export default function Nav({ children }) {
  const [active, setActive] = useState('landing');
  const [visible, setVisible] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState('nav');

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.setProperty('--scrollbar-width', '0px');
      setSidebarView('nav'); 
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.documentElement.style.setProperty('--scrollbar-width', '0px');
    };
  }, [sidebarOpen]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const handleNavClick = (id) => { scrollTo(id); setSidebarOpen(false); };

  return (
    <>
      {/* ── Desktop settings popup ── */}
      <AnimatePresence>
        {settingsOpen && (
          <SettingsPopup onClose={() => setSettingsOpen(false)} />
        )}
      </AnimatePresence>

      {/* ── Mobile logo ── */}
      <Logo mobile onClick={() => scrollTo('landing')} />

      {/* ── Desktop Nav ── */}
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
            color = "var(--border)"
            colorHover = "var(--accent)"
            textColor = "var(--dim)"
            width = {36}
            height = {36}
            strokeWidth = {1.5}
            fadeLength = {0.5}
            duration = {1000}
            maxGap = {0.5}
            radius = {4}
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

      {/* ── Mobile Trigger ── */}
      <MenuTrigger isOpen={sidebarOpen} onClick={() => setSidebarOpen(o => !o)} fixed={true} />

      {/* ── Sidebar ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSidebarOpen(false)}
            />

            <motion.aside
              className={styles.sidebar}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              {/* Header */}
              <div className={styles.sidebarHeader}>
                <AnimatePresence mode="wait">
                  {sidebarView === 'nav' ? (
                    <motion.span
                      key="menu-label"
                      className={styles.sidebarLogo}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      <span className={styles.prompt}>&gt;</span> MENU
                    </motion.span>
                  ) : (
                    <motion.button
                      key="back-btn"
                      className={styles.backBtn}
                      onClick={() => setSidebarView('nav')}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.18 }}
                    >
                      <IoArrowBackOutline size={13} />
                      <span>BACK</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Body — animated panel switch */}
              <div className={styles.sidebarBody}>
                <AnimatePresence mode="wait">

                  {sidebarView === 'nav' && (
                    <motion.div
                      key="nav-view"
                      className={styles.sidebarNavView}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.22, ease }}
                    >
                      <ul className={styles.sidebarLinks}>
                        {SECTIONS.slice(1).map((id, i) => (
                          <motion.li
                            key={id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.22 }}
                          >
                            <button
                              className={`${styles.sidebarLink} ${active === id ? styles.sidebarLinkActive : ''}`}
                              onClick={() => handleNavClick(id)}
                            >
                              <span className={styles.sidebarNum}>0{i + 1}</span>
                              {id}
                            </button>
                          </motion.li>
                        ))}
                      </ul>

                      <div className={styles.sidebarFooter}>
                        <ThemeSwitcher variant="list" />
                        <button
                          className={styles.sidebarSettingsBtn}
                          onClick={() => setSidebarView('settings')}
                        >
                          <IoSettingsOutline size={12} />
                          <span>PREFERENCES</span>
                          <span className={styles.sidebarSettingsArrow}> <IoArrowForwardSharp size={12} /> </span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {sidebarView === 'settings' && (
                    <motion.div
                      key="settings-view"
                      className={styles.sidebarSettingsView}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.22, ease }}
                    >
                      <SettingsPopup variant="inline" onClose={() => setSidebarView('nav')} />
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}