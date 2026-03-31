import { useState, useRef, useEffect, useCallback } from 'react';
import './MobileLayout.css';

/* ─── Tab definitions ──────────────────────── */
const TABS = [
  {
    id: 'intro',
    label: 'Intro',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    id: 'about',
    label: 'About',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="14" y2="13" />
        <line x1="8" y1="17" x2="11" y2="17" />
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="9" height="9" rx="2" />
        <rect x="13" y="3" width="9" height="9" rx="2" />
        <rect x="2" y="14" width="9" height="9" rx="2" />
        <rect x="13" y="14" width="9" height="9" rx="2" />
      </svg>
    ),
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: 'services',
    label: 'Services',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

const COLLAPSED_H = 64;
const EXPANDED_H = 96;
const DRAG_THRESHOLD = 28;

/* ─────────────────────────────────────────────
   MobileLayout
   Props:
     sections — { intro: <Intro/>, about: <About/>, … }
     nav      — React node rendered in the top bar
   
   NOTE: Uses flexbox column — no position:fixed
   inside bodyRef. This is intentional to prevent
   the genie transition from being clipped.
───────────────────────────────────────────── */
export default function MobileLayout({ sections = {}, nav }) {
  const [activeTab, setActiveTab] = useState('intro');
  const [prevTab, setPrevTab] = useState(null);
  const [direction, setDirection] = useState(1);  /* 1 = forward, -1 = back */
  const [expanded, setExpanded] = useState(false);
  const [dragging, setDragging] = useState(false);

  /* lazy-mount: only render a pane after it's first visited */
  const [visited, setVisited] = useState(() => new Set(['intro']));

  const dragStartY = useRef(null);

  /* ── clear prevTab after exit animation completes ── */
  useEffect(() => {
    if (!prevTab) return;
    const t = setTimeout(() => setPrevTab(null), 340);
    return () => clearTimeout(t);
  }, [prevTab, activeTab]);

  /* ── switch tab with directional awareness ── */
  const switchTab = useCallback((id) => {
    if (id === activeTab) return;
    const fromIdx = TABS.findIndex(t => t.id === activeTab);
    const toIdx = TABS.findIndex(t => t.id === id);
    setDirection(toIdx > fromIdx ? 1 : -1);
    setVisited(v => new Set([...v, id]));
    setPrevTab(activeTab);
    setActiveTab(id);
    setExpanded(false);
  }, [activeTab]);

  /* ── drag handlers ── */
  const startDrag = useCallback((clientY) => {
    dragStartY.current = clientY;
    setDragging(true);
  }, []);

  const moveDrag = useCallback((clientY) => {
    if (dragStartY.current === null) return;
    const delta = dragStartY.current - clientY; /* positive = dragged up */
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
      className="ml-wrapper"
      style={{
        '--collapsed-h': `${COLLAPSED_H}px`,
        '--expanded-h': `${EXPANDED_H}px`,
        '--dir': direction, /* used by CSS for slide direction */
      }}
    >
      {/* ── Top nav bar ───────────────────────── */}
      {nav && <div className="ml-nav">{nav}</div>}

      {/* ── Section panes ─────────────────────── */}
      <div className="ml-body" aria-live="polite">
        {TABS.map(({ id }) => {
          if (!visited.has(id)) return null;

          const isActive = id === activeTab;
          const isExit = id === prevTab;

          return (
            <div
              key={id}
              className={[
                'ml-pane',
                isActive && 'ml-pane--active',
                isExit && 'ml-pane--exit',
              ].filter(Boolean).join(' ')}
              aria-hidden={!isActive}
              /* inert prevents focus/interaction on off-screen panes */
              {...(!isActive ? { inert: '' } : {})}
            >
              {sections[id]}
            </div>
          );
        })}
      </div>

      {/* ── Bottom tab sheet ──────────────────── */}
      <div
        className={[
          'ml-sheet',
          expanded && 'ml-sheet--expanded',
          dragging && 'ml-sheet--dragging',
        ].filter(Boolean).join(' ')}
      >
        {/* Drag handle / toggle */}
        <div
          className="ml-handle"
          role="button"
          aria-label={expanded ? 'Collapse navigation' : 'Expand navigation'}
          onClick={() => setExpanded(v => !v)}
          onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientY); }}
          onTouchStart={(e) => startDrag(e.touches[0].clientY)}
        >
          <span className="ml-handle__pill" />
        </div>

        {/* Tab buttons */}
        <nav className="ml-tabs" aria-label="Section navigation">
          {TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              className={`ml-tab${activeTab === id ? ' ml-tab--active' : ''}`}
              onClick={() => switchTab(id)}
              aria-label={label}
              aria-current={activeTab === id ? 'page' : undefined}
            >
              <span className="ml-tab__icon">{icon}</span>
              <span className="ml-tab__label">{label}</span>
              <span className="ml-tab__pip" aria-hidden="true" />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}