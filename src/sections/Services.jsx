import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './Services.module.css';
import { SERVICES } from '../data/data';

const LERP = 0.2;
const INTRO_DURATION = 700;
const DEAD_ZONE = 100;
const CARD_MOVE = 800;

const TOTAL = SERVICES.length;
const TOTAL_BUDGET = (TOTAL - 1) * (DEAD_ZONE + CARD_MOVE) + DEAD_ZONE;
const cardStart = si => si * (DEAD_ZONE + CARD_MOVE) + DEAD_ZONE;
const cardEnd = si => cardStart(si) + CARD_MOVE;

const getStep = () => {
  if (typeof window === 'undefined') return { x: 100, y: 34 };
  return {
    x: Math.round(Math.min(130, (window.innerWidth * 0.8) / (TOTAL * 1.5))),
    y: Math.round(Math.min(44, (window.innerWidth * 0.8) / (TOTAL * 5.5))),
  };
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 1023
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const h = e => setIsMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return isMobile;
}

// -- Mobile ------
const M = {
  SCROLL_PER_CARD: 800,
  CARD_OFFSET_Y: 64,
  SCALE_PER_DEPTH: 0.05,
  MAX_BLUR_PER_DEPTH: 0.4,
  LERP: 0.15,
  BOTTOM_PAD: 0,
  OVERLAP: 0.8, 
};

function MobileServices() {
  const containerRef = useRef(null);   // the scroll container
  const stageRef = useRef(null);   // sticky card viewport
  const cardRefs = useRef([]);     // one ref per card
  const rafRef = useRef(null);
  const scrollY = useRef(0);      // lerped scroll value
  const targetY = useRef(0);      // raw scrollTop
  const stageH = useRef(0);      // measured height of stage/container

  const N = SERVICES.length;
  const sentinelH = (N - 1) * M.SCROLL_PER_CARD * (1 - M.OVERLAP) + M.SCROLL_PER_CARD + M.BOTTOM_PAD;

  const CARD_DEFS = SERVICES.map((_, i) => ({
    restY: i * M.CARD_OFFSET_Y,
    exitStart: i === 0 ? Infinity : (N - 1 - i) * M.SCROLL_PER_CARD * (1 - M.OVERLAP),
    isBase: i === 0,
  }));

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const measure = () => {
      const h = container.clientHeight;
      stageH.current = h;
      stage.style.height = `${h}px`;
    };

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    measure(); 
    return () => ro.disconnect();
  }, []);

  const applyFrames = useCallback((s) => {
    const CH = stageH.current;
    if (!CH) return;

    const sInv = Math.max(0, sentinelH - s);

    const exitP = CARD_DEFS.map((def) => {
      if (def.isBase) return 0;
      const raw = Math.max(0, Math.min(1, (sInv - def.exitStart) / M.SCROLL_PER_CARD));
      return 1 - Math.pow(1 - raw, 3);
    });

    CARD_DEFS.forEach((def, i) => {
      const el = cardRefs.current[i];
      if (!el) return;

      const translateY = def.isBase
        ? def.restY
        : def.restY + (CH - def.restY) * exitP[i];

      let depth = 0;
      for (let j = i + 1; j < N; j++) {
        depth += (1 - exitP[j]);
      }

      const scale = Math.max(0.75, 1 - depth * M.SCALE_PER_DEPTH);
      const blur = depth * M.MAX_BLUR_PER_DEPTH;

      el.style.transform = `translateY(${translateY.toFixed(2)}px) scale(${scale.toFixed(4)})`;
      el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : '';
    });
  }, [N, sentinelH]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTop = sentinelH;
    targetY.current = sentinelH;
    scrollY.current = sentinelH;

    const onScroll = () => { targetY.current = container.scrollTop; };
    container.addEventListener('scroll', onScroll, { passive: true });

    const tick = () => {
      const diff = targetY.current - scrollY.current;
      scrollY.current = Math.abs(diff) > 0.05
        ? scrollY.current + diff * M.LERP
        : targetY.current;
      applyFrames(scrollY.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [applyFrames, sentinelH]);

  return (
    <section id="services" className={styles.section}>
      <div className={styles.outerContainer}>

        <div className={styles.mobileHeader}>
          <p className={styles.label}>
            <span className={styles.prompt}>&gt;</span> WHAT I OFFER
          </p>
        </div>

        <div className={styles.stackContainer} ref={containerRef}>

          <div className={styles.cardStage} ref={stageRef}>
            {[...SERVICES].reverse().map((service, i) => (
              <div
                key={service.id}
                className={`${styles.mobileCard} ${styles[`mobileCard_${i}`]}`}
                ref={el => (cardRefs.current[i] = el)}
              >
                <div className={styles.mobileCardInner}>
                  <div className={styles.cardTop}>
                    <span className={styles.cardNum}>{service.id}</span>
                    <span className={styles.cardTotal}>
                      /{String(TOTAL).padStart(2, '0')}
                    </span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardMid}>
                      <h2 className={styles.cardTitle}>{service.title}</h2>
                      <p className={styles.cardDesc}>{service.desc}</p>
                    </div>
                    <div className={styles.cardBottom}>
                      {service.tags.map(t => (
                        <span key={t} className={styles.tag}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className={styles.stackSentinel}
            style={{ height: `${sentinelH}px` }}
          />

        </div>
      </div>
    </section>
  );
}

function DesktopServices() {
  const sectionRef = useRef(null);
  const rawTargetRef = useRef(0);
  const rawDisplayRef = useRef(0);
  const [raw, setRaw] = useState(0);
  const rafRef = useRef(null);
  const [step, setStep] = useState(getStep);
  const hijackingRef = useRef(false);
  const releaseTimerRef = useRef(null);
  const [introP, setIntroP] = useState(0);
  const introStartRef = useRef(null);
  const introRunningRef = useRef(false);
  const introDoneRef = useRef(false);

  useEffect(() => {
    const onResize = () => setStep(getStep());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--stack-x-budget',
      `${(TOTAL - 1) * step.x + 48}px`
    );
  }, [step.x]);

  useEffect(() => {
    const tick = ts => {
      const cur = rawDisplayRef.current;
      const target = rawTargetRef.current;
      const diff = target - cur;
      if (Math.abs(diff) > 0.05) {
        rawDisplayRef.current = cur + diff * LERP;
        setRaw(rawDisplayRef.current);
      }
      if (introRunningRef.current) {
        if (introStartRef.current === null) introStartRef.current = ts;
        const t = Math.min(1, (ts - introStartRef.current) / INTRO_DURATION);
        const eased = 1 - Math.pow(1 - t, 3);
        setIntroP(eased);
        if (t >= 1) {
          introRunningRef.current = false;
          introDoneRef.current = true;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const disableSnap = useCallback(() => {
    document.documentElement.style.setProperty('scroll-snap-type', 'none', 'important');
  }, []);

  const enableSnap = useCallback(() => {
    document.documentElement.style.removeProperty('scroll-snap-type');
  }, []);

  const releaseHijack = useCallback(() => {
    if (!hijackingRef.current) return;
    hijackingRef.current = false;
    clearTimeout(releaseTimerRef.current);
    enableSnap();
  }, [enableSnap]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!introRunningRef.current && !introDoneRef.current) {
            introRunningRef.current = true;
            introStartRef.current = null;
          }
        } else {
          releaseHijack();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [releaseHijack]);

  const snapOut = useCallback(direction => {
    hijackingRef.current = false;
    enableSnap();
    const section = sectionRef.current;
    if (!section) return;
    if (direction > 0) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: section.offsetTop + section.offsetHeight + 1, behavior: 'smooth' });
      });
    }
  }, [enableSnap]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onWheel = e => {
      // In the dock layout every section is mounted at once; inactive panes are
      // marked `inert`. Never hijack wheel while this Services pane is inactive —
      // otherwise it swallows wheel events meant for the visible tab (e.g.
      // Projects), and the user scrolls Services invisibly.
      if (section.closest('[inert]')) return;

      const rect = section.getBoundingClientRect();
      const inView = rect.top > -2 && rect.top < 2;
      if (!inView) return;

      const t = rawTargetRef.current;
      const dir = e.deltaY;

      if (t <= 0 && dir < 0) { if (hijackingRef.current) snapOut(-1); return; }
      if (t >= TOTAL_BUDGET && dir > 0) { if (hijackingRef.current) snapOut(1); return; }

      e.preventDefault();
      e.stopPropagation();

      if (!hijackingRef.current) {
        hijackingRef.current = true;
        disableSnap();
        window.scrollTo({ top: section.offsetTop, behavior: 'instant' });
      }

      clearTimeout(releaseTimerRef.current);
      rawTargetRef.current = Math.max(0, Math.min(TOTAL_BUDGET, t + e.deltaY));

      releaseTimerRef.current = setTimeout(() => {
        if (rawTargetRef.current >= TOTAL_BUDGET) snapOut(1);
        else if (rawTargetRef.current <= 0) snapOut(-1);
      }, 600);
    };

    const onNavigate = () => releaseHijack();

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('nav:navigate', onNavigate);
    return () => {
      clearTimeout(releaseTimerRef.current);
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('nav:navigate', onNavigate);
      if (hijackingRef.current) enableSnap();
    };
  }, [disableSnap, enableSnap, snapOut, releaseHijack]);

  const card01P = () => (!introRunningRef.current && !introDoneRef.current) ? 0 : introP;
  const scrollCardP = i => {
    const si = i - 1;
    return Math.max(0, Math.min(1, (raw - cardStart(si)) / (cardEnd(si) - cardStart(si))));
  };
  const effectiveP = i => (i === 0 ? card01P() : scrollCardP(i));

  const keepScrollDrive = Math.min(1, raw / (DEAD_ZONE * 0.6));
  const keepOpacity = introP * Math.max(0, 1 - keepScrollDrive * 2);
  const keepScale = 1 - keepScrollDrive * 0.35;
  const keepX = -keepScrollDrive * 68;
  const keepY = keepScrollDrive * 32;

  const getCardStyle = (i, p) => {
    const { x: sx, y: sy } = step;
    const extraX = (1 - p) * (sx * 2.0 + 48);
    const extraY = (1 - p) * (sy * 2.0 + 24);
    const opacity = Math.min(1, p * 1.4);
    let blurPx = 0;
    for (let j = i + 1; j < TOTAL; j++) {
      const jp = effectiveP(j);
      if (jp <= 0.001) break;
      blurPx += Math.min(1, jp / 0.5) * 1 * (1 + (j - i - 1) * 0.08);
    }
    return {
      transform: `translate(${i * sx + extraX}px, ${i * sy + extraY}px)`,
      opacity,
      zIndex: i + 1,
      filter: blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : undefined,
    };
  };

  return (
    <section ref={sectionRef} id="services" className={styles.section}>
      <div className={styles.header}>
        <p className={styles.label}>
          <span className={styles.prompt}>&gt;</span> WHAT I OFFER
        </p>
      </div>

      <div
        className={styles.keepScrolling}
        style={{
          transform: `translate(${keepX}px, ${keepY}px) scale(${keepScale})`,
          opacity: keepOpacity,
        }}
      >
        <span className={styles.keepText}>KEEP SCROLLING</span>
        <span className={styles.keepArrow}>↓</span>
      </div>

      <div className={styles.stackArea}>
        {SERVICES.map((service, i) => {
          const p = effectiveP(i);
          if (p <= 0.001) return null;
          return (
            <div key={service.id} className={styles.card} style={getCardStyle(i, p)}>
              <div className={styles.cardInner}>
                <div className={styles.cardTop}>
                  <span className={styles.cardNum}>{service.id}</span>
                  <span className={styles.cardTotal}>/{String(TOTAL).padStart(2, '0')}</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardMid}>
                    <h2 className={styles.cardTitle}>{service.title}</h2>
                    <p className={styles.cardDesc}>{service.desc}</p>
                  </div>
                  <div className={styles.cardBottom}>
                    {service.tags.map(t => (
                      <span key={t} className={styles.tag}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function Services() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileServices /> : <DesktopServices />;
}