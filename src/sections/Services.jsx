import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './Services.module.css';

const LERP = 0.08;
const INTRO_DURATION = 700; 

const DEAD_ZONE = 250;
const CARD_MOVE = 400;

const SERVICES = [
  {
    id: '01',
    title: 'UI / UX Design',
    desc: 'Pixel-perfect interfaces crafted with intention. From wireframes to high-fidelity prototypes, every interaction is considered.',
    tags: ['Figma', 'Prototyping', 'Design Systems'],
  },
  {
    id: '02',
    title: 'Frontend Development',
    desc: 'Performant, accessible, and animated web experiences built with modern tooling. React, GSAP, and everything in between.',
    tags: ['React', 'TypeScript', 'GSAP'],
  },
  {
    id: '03',
    title: 'Motion Design',
    desc: 'Scroll-linked animations, page transitions, and micro-interactions that breathe life into static layouts.',
    tags: ['Framer Motion', 'Lenis', 'Three.js'],
  },
  {
    id: '04',
    title: 'Creative Direction',
    desc: 'End-to-end visual strategy — brand identity, typography systems, and cohesive design languages that scale.',
    tags: ['Branding', 'Typography', 'Art Direction'],
  },
];

const TOTAL = SERVICES.length;
const TOTAL_BUDGET = (TOTAL - 1) * (DEAD_ZONE + CARD_MOVE) + DEAD_ZONE;

const cardStart = (si) => si * (DEAD_ZONE + CARD_MOVE) + DEAD_ZONE;
const cardEnd = (si) => cardStart(si) + CARD_MOVE;

const getStep = () => {
  if (typeof window === 'undefined') return { x: 100, y: 34 };
  return {
    x: Math.round(Math.min(130, (window.innerWidth * 0.8) / (TOTAL * 1.5))),
    y: Math.round(Math.min(44, (window.innerWidth * 0.8) / (TOTAL * 5.5))),
  };
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function Services() {
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

  // ── Resize ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => setStep(getStep());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── CSS stack budget var ──────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--stack-x-budget',
      `${(TOTAL - 1) * step.x + 48}px`
    );
  }, [step.x]);

  // ── Combined RAF loop: lerp scroll + intro animation ─────────────────────
  useEffect(() => {
    const tick = (ts) => {
      const cur = rawDisplayRef.current;
      const target = rawTargetRef.current;
      const diff = target - cur;
      if (Math.abs(diff) > 0.05) {
        const next = cur + diff * LERP;
        rawDisplayRef.current = next;
        setRaw(next);
      }

      if (introRunningRef.current) {
        if (introStartRef.current === null) introStartRef.current = ts;
        const elapsed = ts - introStartRef.current;
        const t = Math.min(1, elapsed / INTRO_DURATION);
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

  // ── Intro trigger via IntersectionObserver ────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !introRunningRef.current && !introDoneRef.current) {
          introRunningRef.current = true;
          introStartRef.current = null;
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // ── Snap helpers ──────────────────────────────────────────────────────────
  const disableSnap = useCallback(() => {
    document.documentElement.style.scrollSnapType = 'none';
  }, []);

  const enableSnap = useCallback(() => {
    document.documentElement.style.scrollSnapType = '';
  }, []);

  const snapOut = useCallback((direction) => {
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

  // ── Wheel handler ─────────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onWheel = (e) => {
      const rect = section.getBoundingClientRect();
      const inView = rect.top > -2 && rect.top < 2;
      if (!inView) return;

      const t = rawTargetRef.current;
      const dir = e.deltaY;

      // Boundary release
      if (t <= 0 && dir < 0) {
        if (hijackingRef.current) snapOut(-1);
        return;
      }
      if (t >= TOTAL_BUDGET && dir > 0) {
        if (hijackingRef.current) snapOut(1);
        return;
      }

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

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => {
      clearTimeout(releaseTimerRef.current);
      window.removeEventListener('wheel', onWheel, { capture: true });
      enableSnap();
    };
  }, [disableSnap, enableSnap, snapOut]);

  const card01P = () => {
    if (!introRunningRef.current && !introDoneRef.current) return 0;
    return introP;
  };

  const scrollCardP = (i) => {
    const si = i - 1;
    const s = cardStart(si);
    const e = cardEnd(si);
    return Math.max(0, Math.min(1, (raw - s) / (e - s)));
  };

  const effectiveP = (i) => (i === 0 ? card01P() : scrollCardP(i));

  const keepScrollDrive = Math.min(1, raw / (DEAD_ZONE * 0.6));
  const keepOpacity = introP * Math.max(0, 1 - keepScrollDrive * 2);
  const keepScale = 1 - keepScrollDrive * 0.35;
  const keepX = -keepScrollDrive * 68;
  const keepY = keepScrollDrive * 32;

  // ── Card styles ───────────────────────────────────────────────────────────
  const getCardStyle = (i, p) => {
    const { x: sx, y: sy } = step;

    const restX = i * sx;
    const restY = i * sy;

    const extraX = (1 - p) * (sx * 2.0 + 48);
    const extraY = (1 - p) * (sy * 2.0 + 24);
    const opacity = Math.min(1, p * 1.4); 

    let blurPx = 0;
    const BASE_BLUR = 1;
    for (let j = i + 1; j < TOTAL; j++) {
      const jp = effectiveP(j);
      if (jp <= 0.001) break;           
      const depth = j - i;            
      const ramp = Math.min(1, jp / 0.5); 
      blurPx += ramp * BASE_BLUR * (1 + (depth - 1) * 0.08);
    }

    return {
      transform: `translate(${restX + extraX}px, ${restY + extraY}px)`,
      opacity,
      zIndex: i + 1,
      filter: blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : undefined,
    };
  };

  return (
    <section ref={sectionRef} id="services" className={styles.section}>

      {/* ── Static header label ─────────────────────────────────────────── */}
      <div className={styles.header}>
        <p className={styles.label}>
          <span className={styles.prompt}>&gt;</span> WHAT I OFFER
        </p>
      </div>

      {/* ── Keep scrolling ──────────────────────────────────────────────── */}
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

      {/* ── Card stack ──────────────────────────────────────────────────── */}
      <div className={styles.stackArea}>
        {SERVICES.map((service, i) => {
          const p = effectiveP(i);
          if (p <= 0.001) return null;
          return (
            <div
              key={service.id}
              className={styles.card}
              style={getCardStyle(i, p)}
            >
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