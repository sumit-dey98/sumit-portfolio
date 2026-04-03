import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import {
  IoPersonOutline,
  IoDocumentTextOutline,
  IoGridOutline,
  IoPulseOutline,
  IoLayersOutline,
  IoChatbubbleOutline,
} from 'react-icons/io5';
import styles from './MobileLayout.module.css';

const TABS = [
  { id: 'intro', label: 'Intro', icon: <IoPersonOutline size={20} /> },
  { id: 'about', label: 'About', icon: <IoDocumentTextOutline size={20} /> },
  { id: 'projects', label: 'Projects', icon: <IoGridOutline size={20} /> },
  { id: 'skills', label: 'Skills', icon: <IoPulseOutline size={20} /> },
  { id: 'services', label: 'Services', icon: <IoLayersOutline size={20} /> },
  { id: 'contact', label: 'Contact', icon: <IoChatbubbleOutline size={20} /> },
];

const COLLAPSED_H = 52;
const EXPANDED_H = 64;
const DRAG_THRESHOLD = 28;
const SWIPE_THRESHOLD = 128;

export default function MobileLayout({ sections = {}, nav, onBackToLanding }) {
  const [activeTab, setActiveTab] = useState('intro');
  const [expanded, setExpanded] = useState(false);
  const [dragging, setDragging] = useState(false);

  const trackRef = useRef(null);
  const tweenRef = useRef(null);
  const dragStartY = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  // ── Slide track to a given tab index via GSAP ──────────────────────────
  const slideTo = useCallback((index) => {
    if (!trackRef.current) return;
    const paneWidth = trackRef.current.parentElement.offsetWidth;
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(trackRef.current, {
      x: -(index * paneWidth),
      duration: 0.42,
      ease: 'expo.out',
    });
  }, []);

  // ── Switch tab ──────────────────────────────────────────────────────────
  const switchTab = useCallback((id) => {
    if (id === activeTab) return;
    const index = TABS.findIndex(t => t.id === id);
    setActiveTab(id);
    slideTo(index);
  }, [activeTab, slideTo]);

  // ── Init: set track width and snap to index 0 with no animation ────────
  useEffect(() => {
    if (!trackRef.current) return;
    gsap.set(trackRef.current, { x: 0 });
  }, []);

  // ── On resize: re-snap to current tab without animation ────────────────
  useEffect(() => {
    const onResize = () => {
      if (!trackRef.current) return;
      const index = TABS.findIndex(t => t.id === activeTab);
      const paneWidth = trackRef.current.parentElement.offsetWidth;
      gsap.set(trackRef.current, { x: -(index * paneWidth) });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeTab]);

  // ── Swipe gesture ───────────────────────────────────────────────────────
  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    touchStartX.current = null;
    touchStartY.current = null;

    if (dy > Math.abs(dx) || Math.abs(dx) < SWIPE_THRESHOLD) return;

    const currentIdx = TABS.findIndex(t => t.id === activeTab);
    if (dx > 0) {
      // swipe left → next tab
      if (currentIdx < TABS.length - 1) switchTab(TABS[currentIdx + 1].id);
    } else {
      // swipe right → prev tab or back to landing
      if (currentIdx > 0) switchTab(TABS[currentIdx - 1].id);
      else onBackToLanding?.();
    }
  }, [activeTab, switchTab, onBackToLanding]);

  // ── Drag handle (expand/collapse sheet) ────────────────────────────────
  const startDrag = useCallback((clientY) => {
    dragStartY.current = clientY;
    setDragging(true);
  }, []);

  const moveDrag = useCallback((clientY) => {
    if (dragStartY.current === null) return;
    const delta = dragStartY.current - clientY;
    if (Math.abs(delta) > DRAG_THRESHOLD) {
      setExpanded(delta > 0);
      dragStartY.current = null;
      setDragging(false);
    }
  }, []);

  const endDrag = useCallback(() => {
    dragStartY.current = null;
    setDragging(false);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => moveDrag(e.touches ? e.touches[0].clientY : e.clientY);
    const onUp = () => endDrag();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging, moveDrag, endDrag]);

  return (
    <div
      className={styles.wrapper}
      style={{
        '--collapsed-h': `${COLLAPSED_H}px`,
        '--expanded-h': `${EXPANDED_H}px`,
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.body} aria-live="polite">
        {nav && <div className={styles.navSlot}>{nav}</div>}

        {/* Clip window — overflow hidden, full width */}
        <div className={styles.paneArea}>

          {/* Track — all panes side by side, GSAP moves this */}
          <div
            ref={trackRef}
            className={styles.paneTrack}
            style={{ width: `${TABS.length * 100}%` }}
          >
            {TABS.map(({ id }) => (
              <div
                key={id}
                className={styles.pane}
                style={{ width: `${100 / TABS.length}%` }}
                aria-hidden={id !== activeTab}
                {...(id !== activeTab ? { inert: true } : {})}             
                >
                {sections[id]}
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className={[
        styles.sheet,
        expanded && styles.sheetExpanded,
        dragging && styles.sheetDragging,
      ].filter(Boolean).join(' ')}>
        <div
          className={styles.handle}
          role="button"
          aria-label={expanded ? 'Collapse navigation' : 'Expand navigation'}
          onClick={() => setExpanded(v => !v)}
          onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientY); }}
          onTouchStart={(e) => startDrag(e.touches[0].clientY)}
        >
          <span className={styles.handlePill} />
        </div>

        <nav className={styles.tabs} aria-label="Section navigation">
          {TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              className={[
                styles.tab,
                activeTab === id && styles.tabActive,
              ].filter(Boolean).join(' ')}
              onClick={() => switchTab(id)}
              aria-label={label}
              aria-current={activeTab === id ? 'page' : undefined}
            >
              <span className={styles.tabIcon}>{icon}</span>
              <span className={styles.tabLabel}>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}