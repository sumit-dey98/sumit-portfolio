import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import ThemeSwitcher from './ThemeSwitcher';
import Logo from './Logo';
import MenuTrigger from './MenuTrigger';
import SvgButton from './SvgButton';
import SettingsPopup from './SettingsPopup';
import { IoSettingsOutline, IoArrowBackOutline, IoArrowForwardSharp } from 'react-icons/io5';
import { SECTIONS } from '../data/data';
import styles from './Nav.module.css';

const ease = 'power4.out';

export default function Nav({ children, cursorEnabled, onCursorChange, onReplayIntro, alwaysVisible = false }) {
  const [active, setActive] = useState('landing');
  const [visible, setVisible] = useState(alwaysVisible);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [drawerView, setDrawerView] = useState('menu');

  const settingsIconRef = useRef(null);
  const settingsPopupRef = useRef(null);
  const overlayRef = useRef(null);
  const drawerContentRef = useRef(null);

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
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    if (!drawerOpen) setDrawerView('menu');
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  useEffect(() => {
    if (!settingsIconRef.current) return;
    gsap.to(settingsIconRef.current, {
      rotate: settingsOpen ? 60 : 0,
      duration: 0.3,
      ease: 'power2.inOut',
    });
  }, [settingsOpen]);

  useEffect(() => {
    const el = settingsPopupRef.current;
    if (!el) return;

    if (settingsOpen) {
      gsap.fromTo(el,
        { opacity: 0, y: -6, pointerEvents: 'none' },
        { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.3, ease }
      );
    } else {
      gsap.to(el, {
        opacity: 0,
        y: -6,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => gsap.set(el, { pointerEvents: 'none' }),
      });
    }
  }, [settingsOpen]);

  useEffect(() => {
    if (!settingsOpen) return;

    const handleClickOutside = (e) => {
      if (
        settingsPopupRef.current?.contains(e.target) ||
        e.target.closest(`.${styles.settingsBtn}`)
      ) return;
      setSettingsOpen(false);
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [settingsOpen]);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    if (drawerOpen) {
      gsap.fromTo(el,
        { opacity: 0, display: 'block' },
        { opacity: 1, duration: 0.25, ease: 'none' }
      );
    } else {
      gsap.to(el, {
        opacity: 0,
        duration: 0.25,
        ease: 'none',
        onComplete: () => gsap.set(el, { display: 'none' }),
      });
    }
  }, [drawerOpen]);

  useEffect(() => {
    const el = drawerContentRef.current;
    if (!el || !drawerOpen) return;

    gsap.fromTo(el,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' }
    );
  }, [drawerView, drawerOpen]);

  const switchDrawerView = (next) => {
    const el = drawerContentRef.current;
    if (!el) { setDrawerView(next); return; }

    gsap.to(el, {
      opacity: 0,
      y: -8,
      duration: 0.14,
      ease: 'power2.in',
      onComplete: () => setDrawerView(next),
    });
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.dispatchEvent(new CustomEvent('nav:navigate', { detail: { id } }));
    requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth' }));
  };

  return (
    <>
      <div
        ref={settingsPopupRef}
        style={{
          opacity: 0,
          pointerEvents: 'none',
          position: 'fixed',      
          top: 64,             
          right: 48,
          zIndex: 1000,
        }}
      >
        <SettingsPopup
          onClose={() => setSettingsOpen(false)}
          cursorEnabled={cursorEnabled}
          onCursorChange={onCursorChange}
          onReplayIntro={onReplayIntro}
        />
      </div>

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
            <span
              ref={settingsIconRef}
              style={{ display: 'flex', alignItems: 'center', transformOrigin: 'center' }}
            >
              <IoSettingsOutline size={15} />
            </span>
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

      {alwaysVisible && (
        <>
          <div
            ref={overlayRef}
            className={styles.overlay}
            style={{ display: 'none', opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
          />

          <div className={`${styles.mobileTopBar} ${drawerOpen ? styles.mobileTopBarOpen : ''}`}>
            <div className={styles.mobileTopBarTop}>
              <Logo onClick={() => scrollTo('landing')} />
              <div className={styles.mobileTopBarRight}>
                <MenuTrigger isOpen={drawerOpen} onClick={() => setDrawerOpen(o => !o)} fixed={false} />
              </div>
            </div>

            {drawerOpen && (
              <div ref={drawerContentRef} className={styles.drawerContent} style={{ opacity: 0 }}>
                {drawerView === 'menu' && (
                  <>
                    <div className={styles.drawerRow}>
                      <ThemeSwitcher variant="list" />
                    </div>
                    <div className={styles.drawerRow}>
                      <button
                        className={styles.drawerSettingsBtn}
                        onClick={() => switchDrawerView('settings')}
                      >
                        <IoSettingsOutline size={13} />
                        <span>PREFERENCES</span>
                        <span className={styles.drawerArrow}><IoArrowForwardSharp size={12} /></span>
                      </button>
                    </div>
                  </>
                )}

                {drawerView === 'settings' && (
                  <>
                    <button
                      className={styles.drawerBackBtn}
                      onClick={() => switchDrawerView('menu')}
                    >
                      <IoArrowBackOutline size={13} />
                      <span>BACK</span>
                    </button>
                    <SettingsPopup
                      variant="inline"
                      onClose={() => switchDrawerView('menu')}
                      cursorEnabled={cursorEnabled}
                      onCursorChange={onCursorChange}
                      onReplayIntro={onReplayIntro}
                    />
                  </>
                )}
              </div>
            )}

            <div className={styles.drawerHandle}>
              <span className={styles.drawerPill} />
            </div>
          </div>
        </>
      )}
    </>
  );
}