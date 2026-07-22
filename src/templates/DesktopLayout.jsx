import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import {
  IoPersonOutline,
  IoDocumentTextOutline,
  IoGridOutline,
  IoPulseOutline,
  IoLayersOutline,
  IoChatbubbleOutline,
  IoSettingsOutline,
  IoExpandOutline,
  IoContractOutline,
} from 'react-icons/io5';
import ThemeSwitcher from '../components/ThemeSwitcher';
import SettingsPopup from '../components/SettingsPopup';
import SvgButton from '../components/SvgButton';
import Logo from '../components/Logo';
import styles from './DesktopLayout.module.css';

const TABS = [
  { id: 'intro', label: 'Intro', icon: <IoPersonOutline size={22} /> },
  { id: 'about', label: 'About', icon: <IoDocumentTextOutline size={22} /> },
  { id: 'projects', label: 'Projects', icon: <IoGridOutline size={22} /> },
  { id: 'skills', label: 'Skills', icon: <IoPulseOutline size={22} /> },
  { id: 'services', label: 'Services', icon: <IoLayersOutline size={22} /> },
  { id: 'contact', label: 'Contact', icon: <IoChatbubbleOutline size={22} /> },
];

// Fisheye magnification tuning
const BASE = 44;        // resting icon size (px), for distance math
const MAX_SCALE = 0.28; // extra scale at the cursor's exact position (1.28x peak)
const RANGE = 2.0;      // how many icon-widths the falloff spans

const CARD_EXIT_MS = 220; // must match the .cardOut CSS animation duration

function useExitTransition(open, exitMs = CARD_EXIT_MS) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    if (open) {
      setMounted(true);
      setClosing(false);
    } else if (mounted) {
      setClosing(true);
      timer.current = setTimeout(() => {
        setMounted(false);
        setClosing(false);
      }, exitMs);
    }
    return () => clearTimeout(timer.current);
  }, [open, exitMs, mounted]);

  return { mounted, closing };
}

export default function DesktopLayout({
  sections = {},
  revealed = true,
  onBackToLanding,
  onReplayIntro,
  cursorEnabled,
  onCursorChange,
}) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (revealed && !entered) setEntered(true);
  }, [revealed, entered]);
  const [activeTab, setActiveTab] = useState('intro');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsAnim = useExitTransition(settingsOpen);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wipe, setWipe] = useState(null);
  const wipeTimers = useRef([]);
  const wipeEnabledRef = useRef(localStorage.getItem('wipe-enabled') !== 'no');

  useEffect(() => {
    const onPref = (e) => { wipeEnabledRef.current = e.detail !== false; };
    window.addEventListener('wipe-pref-change', onPref);
    return () => window.removeEventListener('wipe-pref-change', onPref);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const trackRef = useRef(null);
  const tweenRef = useRef(null);
  const dockRef = useRef(null);
  const iconRefs = useRef([]);
  const settingsPopRef = useRef(null);

  const PANE_PCT = 100 / TABS.length;

  const snapTo = useCallback((index) => {
    if (!trackRef.current) return;
    tweenRef.current?.kill();
    gsap.set(trackRef.current, { xPercent: -(index * PANE_PCT) });
  }, [PANE_PCT]);

  const switchTab = useCallback((id) => {
    if (id === activeTab || wipe) return;
    const tab = TABS.find((t) => t.id === id);
    const index = TABS.findIndex((t) => t.id === id);

    setActiveTab(id);

    if (!wipeEnabledRef.current) {
      if (trackRef.current) {
        tweenRef.current?.kill();
        tweenRef.current = gsap.to(trackRef.current, {
          xPercent: -(index * PANE_PCT),
          duration: 0.5,
          ease: 'expo.out',
        });
      }
      return;
    }

    setWipe({ label: tab.label });

    wipeTimers.current.forEach(clearTimeout);
    const t1 = setTimeout(() => snapTo(index), 680);
    const t2 = setTimeout(() => setWipe(null), 1400);
    wipeTimers.current = [t1, t2];
  }, [activeTab, wipe, snapTo, PANE_PCT]);

  useEffect(() => () => wipeTimers.current.forEach(clearTimeout), []);

  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  useEffect(() => {
    const snap = () => {
      const track = trackRef.current;
      if (!track) return;
      const index = TABS.findIndex((t) => t.id === activeTabRef.current);
      tweenRef.current?.kill();
      gsap.set(track, { xPercent: -(index * PANE_PCT) });
    };

    snap();
    window.addEventListener('resize', snap);
    return () => window.removeEventListener('resize', snap);
  }, [PANE_PCT]);

  // expose the dock's rendered width so the popover cards can match it
  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const setW = () => {
      document.documentElement.style.setProperty('--dock-w', `${dock.offsetWidth}px`);
    };
    setW();
    const ro = new ResizeObserver(setW);
    ro.observe(dock);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest('input, textarea')) return;
      const idx = TABS.findIndex((t) => t.id === activeTab);
      if (e.key === 'ArrowRight' && idx < TABS.length - 1) switchTab(TABS[idx + 1].id);
      if (e.key === 'ArrowLeft') {
        if (idx > 0) switchTab(TABS[idx - 1].id);
        else onBackToLanding?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeTab, switchTab, onBackToLanding]);

  // ---- macOS dock fisheye ----
  const applyMagnify = useCallback((cursorX) => {
    iconRefs.current.forEach((el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist = Math.abs(cursorX - center);
      const spread = BASE * RANGE;
      let boost = 0;
      if (dist < spread) {
        boost = MAX_SCALE * (Math.cos((dist / spread) * (Math.PI / 2)) ** 2);
      }
      el.style.transform = `scale(${1 + boost})`;
    });
  }, []);

  const resetMagnify = useCallback(() => {
    iconRefs.current.forEach((el) => {
      if (el) el.style.transform = 'scale(1)';
    });
  }, []);

  useEffect(() => {
    if (!settingsOpen) return;
    const onDown = (e) => {
      if (
        settingsPopRef.current?.contains(e.target) ||
        iconRefs.current[TABS.length]?.contains(e.target)
      ) return;
      setSettingsOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [settingsOpen]);

  return (
    <div className={`${styles.shell} ${entered ? styles.shellEntered : ''}`}>
      {wipe && (
        <div className={styles.wipe} aria-hidden="true">
          <span className={styles.wipeLabel}>{wipe.label}</span>
        </div>
      )}

      <Logo className={styles.brand} onClick={onBackToLanding} />

      <button
        className={styles.fullscreenToggle}
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
      >
        {isFullscreen ? <IoContractOutline size={18} /> : <IoExpandOutline size={18} />}
      </button>

      <div className={styles.stage}>
        <div
          ref={trackRef}
          className={styles.track}
          style={{ width: `${TABS.length * 100}%` }}
        >
          {TABS.map(({ id }) => (
            <div
              key={id}
              className={`${styles.pane} ${id === 'projects' ? styles.paneNoScroll : ''}`}
              style={{ width: `${100 / TABS.length}%` }}
              aria-hidden={id !== activeTab}
              {...(id !== activeTab ? { inert: true } : {})}
            >
              {sections[id]}
            </div>
          ))}
        </div>
      </div>

      {/* ---- Dock ---- */}
      <div className={styles.dockWrap}>
        <nav
          ref={dockRef}
          className={styles.dock}
          aria-label="Section navigation"
          onMouseMove={(e) => applyMagnify(e.clientX)}
          onMouseLeave={resetMagnify}
        >
          {TABS.map(({ id, label, icon }, i) => (
            <div
              key={id}
              ref={(el) => (iconRefs.current[i] = el)}
              className={`${styles.dockItem} ${activeTab === id ? styles.dockItemActive : ''}`}
            >
              <span className={styles.dockLabel}>{label}</span>
              <SvgButton
                width={44}
                height={44}
                radius={6}
                strokeWidth={1.5}
                duration={1000}
                maxGap={0.5}
                fadeLength={0.5}
                color="var(--accent)"
                colorHover="var(--accent2)"
                textColor={activeTab === id ? 'var(--accent2)' : 'var(--dim)'}
                forceActive={activeTab === id}
                className={`${styles.dockBtn} ${activeTab === id ? styles.dockBtnActive : ''}`}
                onClick={() => switchTab(id)}
                aria-label={label}
                aria-current={activeTab === id ? 'page' : undefined}
              >
                {icon}
              </SvgButton>
            </div>
          ))}

          <span className={styles.dockSep} />

          <div className={styles.dockUtil}>
            <ThemeSwitcher
              variant="dockIcon"
              magnifyRef={(el) => (iconRefs.current[TABS.length + 1] = el)}
            />
          </div>

          <div className={styles.dockUtil}>
            <div
              ref={(el) => (iconRefs.current[TABS.length] = el)}
              className={`${styles.dockItem} ${settingsOpen ? styles.dockUtilOn : ''}`}
            >
              <span className={styles.dockLabel}>Preferences</span>
              <SvgButton
                width={44}
                height={44}
                radius={6}
                strokeWidth={1.5}
                duration={1000}
                maxGap={0.5}
                fadeLength={0.5}
                color="var(--accent)"
                colorHover="var(--accent2)"
                textColor={settingsOpen ? 'var(--accent2)' : 'var(--dim)'}
                forceActive={settingsOpen}
                className={`${styles.dockBtn} ${settingsOpen ? styles.dockBtnOn : ''}`}
                onClick={() => setSettingsOpen((o) => !o)}
                aria-label="Preferences"
              >
                <IoSettingsOutline size={20} />
              </SvgButton>
            </div>

            {settingsAnim.mounted && (
              <div
                ref={settingsPopRef}
                className={`${styles.settingsPop} ${settingsAnim.closing ? styles.cardOut : ''}`}
              >
                <SettingsPopup
                  variant="inline"
                  onClose={() => setSettingsOpen(false)}
                  cursorEnabled={cursorEnabled}
                  onCursorChange={onCursorChange}
                  onReplayIntro={onReplayIntro}
                />
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
