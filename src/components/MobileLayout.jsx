import { useState, useRef, useEffect, useCallback } from 'react';
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

export default function MobileLayout({ sections = {}, nav, onBackToLanding }) {
  const [activeTab, setActiveTab] = useState('intro');
  const [prevTab, setPrevTab] = useState(null);
  const [direction, setDirection] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [visited, setVisited] = useState(() => new Set(['intro']));

  const dragStartY = useRef(null);

  useEffect(() => {
    if (!prevTab) return;
    const t = setTimeout(() => setPrevTab(null), 340);
    return () => clearTimeout(t);
  }, [prevTab, activeTab]);

  const switchTab = useCallback((id) => {
    if (id === activeTab) return;
    const fromIdx = TABS.findIndex(t => t.id === activeTab);
    const toIdx = TABS.findIndex(t => t.id === id);
    setDirection(toIdx > fromIdx ? 1 : -1);
    setVisited(v => new Set([...v, id]));
    setPrevTab(activeTab);
    setActiveTab(id);
  }, [activeTab]);

  // Swipe handling — lives here, not in HorizontalMobileShell
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const SWIPE_THRESHOLD = 128;

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
      if (currentIdx > 0) {
        switchTab(TABS[currentIdx - 1].id);
      } else {
        onBackToLanding?.(); // first tab → hand off to parent
      }
    }
  }, [activeTab, switchTab, onBackToLanding]);

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
      style={{ '--collapsed-h': `${COLLAPSED_H}px`, '--expanded-h': `${EXPANDED_H}px`, '--dir': direction }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.body} aria-live="polite">
        {nav && <div className={styles.navSlot}>{nav}</div>}

        <div className={styles.paneArea}>
          {TABS.map(({ id }) => {
            if (!visited.has(id)) return null;
            const isActive = id === activeTab;
            const isExit = id === prevTab;
            return (
              <div
                key={id}
                className={[
                  styles.pane,
                  isActive && styles.paneActive,
                  isExit && styles.paneExit,
                ].filter(Boolean).join(' ')}
                aria-hidden={!isActive}
                inert={!isActive ? true : undefined}
              >
                {sections[id]}
              </div>
            );
          })}
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