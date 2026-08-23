import { useState, useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { IoSettingsOutline } from 'react-icons/io5';
import Logo from '../components/Logo';
import ThemeSwitcher from '../components/ThemeSwitcher';
import SettingsPopup from '../components/SettingsPopup';
import SvgButton from '../components/SvgButton';
import styles from './LiteLayout.module.css';

const SETTINGS_EASE = 'power4.out';

const NAV_ITEMS = [
  { id: 'landing', label: 'Home' },
  { id: 'intro', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

const LAST_INDEX = NAV_ITEMS.length - 1;

export default function LiteLayout({
  sections = {},
  onReplayIntro,
  cursorEnabled,
  onCursorChange,
}) {
  const scrollRef = useRef(null);
  const settingsIconRef = useRef(null);
  const settingsPopupRef = useRef(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeId, setActiveId] = useState('intro');

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
        { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.3, ease: SETTINGS_EASE }
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

  const scrollToId = useCallback((id) => {
    const scroller = scrollRef.current;
    const target = scroller?.querySelector(`#lite-${id}`);
    if (!scroller || !target) return;
    scroller.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
  }, []);

  // Track which section is centered -> active (drives the rail + focus state).
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const targets = NAV_ITEMS
      .map(({ id }) => scroller.querySelector(`#lite-${id}`))
      .filter(Boolean);
    if (!targets.length) return;

    let raf = 0;
    const pickActive = () => {
      raf = 0;
      const mid = scroller.scrollTop + scroller.clientHeight / 2;
      let best = { id: NAV_ITEMS[0].id, dist: Infinity };
      targets.forEach((el) => {
        const center = el.offsetTop + el.offsetHeight / 2;
        const dist = Math.abs(center - mid);
        if (dist < best.dist) best = { id: el.id.replace('lite-', ''), dist };
      });
      setActiveId(best.id);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pickActive);
    };
    pickActive();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [sections]);

  const activeIndex = NAV_ITEMS.findIndex((n) => n.id === activeId);
  const nextItem =
    activeIndex >= 0 && activeIndex < NAV_ITEMS.length - 1
      ? NAV_ITEMS[activeIndex + 1]
      : null;

  return (
    <div className={styles.shell}>
      <div
        ref={settingsPopupRef}
        style={{
          opacity: 0,
          pointerEvents: 'none',
          position: 'fixed',
          top: 'calc((var(--lite-topbar-h, 64px) - 32px) / 2 + 32px + 8px)',
          right: 'var(--section-pad-x)',
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

      <header className={styles.topbar}>
        <Logo className={styles.brand} onClick={() => scrollToId('landing')} />

        <div className={styles.utils}>
          <ThemeSwitcher variant="dropdown" />

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
            onClick={() => setSettingsOpen((o) => !o)}
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
      </header>

      <nav className={styles.rail} aria-label="Section navigation">
        {NAV_ITEMS.map(({ id, label }, i) => (
          <button
            key={id}
            className={`${styles.railItem} ${activeId === id ? styles.railItemActive : ''} ${i < activeIndex ? styles.railItemDone : ''}`}
            onClick={() => scrollToId(id)}
            aria-current={activeId === id ? 'true' : undefined}
          >
            <p className={styles.railLabelContainer}>
              <span className={styles.railLabel}>{label}</span>
            </p>

            <span className={styles.railDot} />
          </button>
        ))}
      </nav>

      {nextItem && (
        <button
          className={styles.peekBar}
          onClick={() => scrollToId(nextItem.id)}
          aria-label={`Go to ${nextItem.label}`}
        >
          <span className={styles.peekPrompt}>&gt;</span>
          <span className={styles.peekLabel}>{nextItem.label}</span>
          <span className={styles.peekNum}>
            {String(activeIndex + 1).padStart(2, '0')} / {String(LAST_INDEX).padStart(2, '0')}
          </span>
        </button>
      )}

      <main ref={scrollRef} className={styles.scroll} data-lite-scroll>
        {NAV_ITEMS.map(({ id }) => (
          <section
            key={id}
            id={`lite-${id}`}
            className={`${styles.section} ${activeId === id ? styles.sectionActive : ''}`}
          >
            {id !== 'landing' && (
              <>
                <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
                <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />
              </>
            )}
            <div className={styles.sectionInner}>{sections[id]}</div>
          </section>
        ))}
      </main>

    </div>
  );
}
