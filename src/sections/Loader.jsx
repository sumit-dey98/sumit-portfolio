import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useThemeContext } from '../theme/ThemeContext';
import { useTypewriter } from '../hooks/useTypewriter';
import { THEMES } from '../theme/themes';
import { useUserPrefs } from '../hooks/useUserPrefs';
import Button from '../components/Button';
import { IoArrowForwardSharp, IoArrowBackSharp } from 'react-icons/io5';
import styles from './Loader.module.css';

const EASE_SOFT = 'power2.out';

const TYPEWRITER_LINES = [
  'Enter your name',
  'You can skip this',
  'Your data will only be stored in your browser',
];

// ─── Utility: fade a node out with optional y/blur, then call onComplete ───
function animateOut(node, { y = 0, blur = false, duration = 0.4 } = {}, onComplete) {
  if (!node) { onComplete?.(); return; }
  const vars = { opacity: 0, duration, ease: 'power2.in', onComplete };
  if (y) vars.y = y;
  if (blur) vars.filter = 'blur(4px)';
  gsap.to(node, vars);
}

// ─── Utility: fade a node in with optional y ──────────────────────────────
function animateIn(node, { y = 0, delay = 0, duration = 0.4 } = {}) {
  if (!node) return;
  gsap.fromTo(node,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, delay, ease: EASE_SOFT }
  );
}

// ─── Loader-level fade (replaces outermost AnimatePresence) ──────────────
function useLoaderFade(exiting, nodeRef) {
  useEffect(() => {
    if (!nodeRef.current) return;
    if (!exiting) {
      gsap.fromTo(nodeRef.current, { opacity: 0 }, { opacity: 1, duration: 0.15 });
    } else {
      gsap.to(nodeRef.current, { opacity: 0, duration: 0.15 });
    }
  }, [exiting]);
}

// ─── CharReveal: staggered per-char y+opacity via callback ref ────────────
const CharReveal = ({ text, delay = 0, className = '' }) => {
  const words = text.split(' ');

  const containerRef = useCallback((node) => {
    if (!node) return;
    const chars = node.querySelectorAll('[data-char]');
    gsap.fromTo(chars,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: 'power2.out',
        stagger: 0.028,
        delay,
      }
    );
  }, [text, delay]);

  return (
    <span ref={containerRef} className={className} aria-label={text}>
      {words.map((word, wIdx) => (
        <span key={wIdx} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((ch, i) => (
            <span
              key={i}
              data-char
              style={{ display: 'inline-block', whiteSpace: 'pre', opacity: 0 }}
            >
              {ch}
            </span>
          ))}
          {wIdx < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
};

// ─── Corner: draws horizontal + vertical lines via scaleX/scaleY ──────────
const Corner = ({ delay }) => {
  const hRef = useCallback((node) => {
    if (!node) return;
    gsap.fromTo(node,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.5, delay, ease: EASE_SOFT }
    );
  }, [delay]);

  const vRef = useCallback((node) => {
    if (!node) return;
    gsap.fromTo(node,
      { scaleY: 0 },
      { scaleY: 1, duration: 0.5, delay, ease: EASE_SOFT }
    );
  }, [delay]);

  return (
    <span className={styles.cornerInner}>
      <span ref={hRef} className={`${styles.cLine} ${styles.cLineH}`} />
      <span ref={vRef} className={`${styles.cLine} ${styles.cLineV}`} />
    </span>
  );
};

const ThemeIcon = ({ icon: Icon, size = 11 }) => <Icon size={size} />;

// ─── ThemeCard: spring scale-in for checkmark ────────────────────────────
const ThemeCard = ({ themeKey: tk, t, selected, onSelect }) => {
  const checkRef = useCallback((node) => {
    if (!node) return;
    gsap.fromTo(node,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.5)' }
    );
  }, []);

  return (
    <button
      className={`${styles.themeCard} ${selected ? styles.themeCardOn : ''}`}
      onClick={() => onSelect(tk)}
      style={{
        '--cc-bg': t.vars['--bg'],
        '--cc-border': t.vars['--border'],
        '--cc-accent': t.vars['--accent'],
        '--cc-text': t.vars['--text'],
        '--cc-dim': t.vars['--dim'],
      }}
    >
      <span className={styles.cardPreview}>
        <span className={styles.cardBar}>
          {['#ff5f57', '#ffbd2e', '#28c840'].map(c => (
            <span key={c} className={styles.cardDot} style={{ background: c }} />
          ))}
        </span>
        <span className={styles.cardLines}>
          <span className={styles.cardLine} style={{ width: '55%', opacity: 0.9 }} />
          <span className={styles.cardLine} style={{ width: '75%' }} />
          <span className={styles.cardLine} style={{ width: '40%' }} />
        </span>
      </span>
      <span className={styles.cardFooter}>
        <span className={styles.cardIcon}><ThemeIcon icon={t.icon} /></span>
        <span className={styles.cardName}>{t.label}</span>
      </span>
      {selected && (
        <span ref={checkRef} className={styles.cardCheck} style={{ opacity: 0 }} />
      )}
    </button>
  );
};

const ModeCard = ({ id, tag, title, desc, selected, onSelect }) => (
  <button
    className={`${styles.modeCard} ${selected ? styles.modeCardOn : ''}`}
    onClick={() => onSelect(id)}
  >
    <span className={styles.modeTag}>{tag}</span>
    <span className={styles.modeTitle}>{title}</span>
    <span className={styles.modeDesc}>{desc}</span>
  </button>
);

// ─── StaggerFade: wraps children, staggers them in on mount ───────────────
const StaggerFade = ({ children, delayStart = 0, stagger = 0.06, className }) => {
  const ref = useCallback((node) => {
    if (!node) return;
    const items = node.children;
    gsap.fromTo(items,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, stagger, delay: delayStart, ease: EASE_SOFT }
    );
  }, []);

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
          <div key={i} style={{ opacity: 0 }}>{child}</div>
        ))
        : children}
    </div>
  );
};

// ─── FadeIn: simple opacity+y fade via callback ref ───────────────────────
const FadeIn = ({ delay = 0, y = 0, children, className, style }) => {
  const ref = useCallback((node) => {
    if (!node) return;
    gsap.fromTo(node,
      { opacity: 0, y },
      { opacity: 1, y: 0, duration: 0.4, delay, ease: EASE_SOFT }
    );
  }, [delay, y]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0, ...style }}>
      {children}
    </div>
  );
};

// ─── Panel switcher: replaces AnimatePresence mode="wait" ─────────────────
// Animates current panel out (y-20 + blur), then swaps, animates new one in
function usePanelTransition(step) {
  const [visibleStep, setVisibleStep] = useState(step);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const panelRef = useRef(null);
  const pendingStep = useRef(null);

  useEffect(() => {
    if (step === visibleStep) return;

    if (panelRef.current && !isTransitioning) {
      setIsTransitioning(true);
      pendingStep.current = step;
      animateOut(panelRef.current, { y: -20, blur: true, duration: 0.4 }, () => {
        setVisibleStep(pendingStep.current);
        setIsTransitioning(false);
      });
    } else {
      pendingStep.current = step;
    }
  }, [step]);

  // Animate in when visibleStep changes
  const inRef = useCallback((node) => {
    panelRef.current = node;
    if (!node) return;
    animateIn(node, { duration: 0.4 });
  }, [visibleStep]);

  return { visibleStep, inRef };
}

const STEPS = ['theme', 'name', 'mode'];

export default function Loader({ onComplete }) {
  const { themeKey, setTheme } = useThemeContext();
  const { prefs, savePrefs } = useUserPrefs();

  const [step, setStep] = useState(() => prefs ? 'returning' : 'welcome');
  const [name, setName] = useState(prefs?.name || '');
  const [mode, setMode] = useState(prefs?.mode || null);
  const [exiting, setExiting] = useState(false);
  const inputRef = useRef(null);
  const wizardRef = useRef(null);
  const trackRef = useRef(null);
  const loaderRef = useRef(null);

  const isTyping = name.length > 0;
  const [focused, setFocused] = useState(false);
  const placeholder = useTypewriter(TYPEWRITER_LINES, {
    speed: 55,
    pause: 1400,
    loop: true,
    paused: isTyping,
  });

  const stepIndex = STEPS.indexOf(step);
  const inWizard = STEPS.includes(step);

  // Loader-level fade in/out
  useEffect(() => {
    if (!loaderRef.current) return;
    if (!exiting) {
      gsap.fromTo(loaderRef.current, { opacity: 0 }, { opacity: 1, duration: 0.15 });
    } else {
      gsap.to(loaderRef.current, { opacity: 0, duration: 0.15 });
    }
  }, [exiting]);

  // Returning user auto-advance
  useEffect(() => {
    if (step !== 'returning') return;
    const t = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onComplete({ name: prefs?.name || '', mode: prefs?.mode, themeKey }), 400);
    }, 2000);
    return () => clearTimeout(t);
  }, [step]);

  // Wizard track sliding
  useEffect(() => {
    if (!trackRef.current || !inWizard || !wizardRef.current) return;
    const containerWidth = wizardRef.current.offsetWidth;
    const targetX = -(stepIndex < 0 ? 0 : stepIndex * containerWidth);
    gsap.to(trackRef.current, { x: targetX, duration: 1, ease: 'expo.out' });
  }, [stepIndex, inWizard]);

  useEffect(() => {
    if (trackRef.current && inWizard) gsap.set(trackRef.current, { x: 0 });
  }, []);

  useEffect(() => {
    if (step === 'name') setTimeout(() => inputRef.current?.focus(), 500);
  }, [step]);

  const goTo = (s) => setStep(s);

  const handleEnter = (overrides = {}) => {
    const finalMode = overrides.mode ?? mode;
    if (!finalMode) return;
    const p = { name: overrides.name ?? name.trim(), mode: finalMode, themeKey };
    savePrefs(p);
    setExiting(true);
    setTimeout(() => onComplete(p), 400);
  };

  const handleSkipAll = () => handleEnter({ mode: 'lite', name: '' });

  // Panel transition controller
  const { visibleStep, inRef } = usePanelTransition(
    inWizard ? 'wizard' : step
  );

  const THEME_LABEL = THEMES[themeKey]?.label || themeKey;
  const MODE_LABEL = prefs?.mode === 'full' ? 'Immersive' : 'Essential';

  return (
    <div ref={loaderRef} className={styles.loader} style={{ opacity: 0 }}>
      <div className={`${styles.corner} ${styles.cornerTL}`}><Corner delay={0.05} /></div>
      <div className={`${styles.corner} ${styles.cornerTR}`}><Corner delay={0.1} /></div>
      <div className={`${styles.corner} ${styles.cornerBL}`}><Corner delay={0.15} /></div>
      <div className={`${styles.corner} ${styles.cornerBR}`}><Corner delay={0.2} /></div>

      {inWizard && (
        <div className={styles.dots}>
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`${styles.stepDot}
                ${s === step ? styles.stepDotActive : ''}
                ${i < stepIndex ? styles.stepDotDone : ''}
              `}
            />
          ))}
        </div>
      )}

      <div className={styles.content}>
        {/* Single panel node — swapped by usePanelTransition */}
        <div key={visibleStep} ref={inRef} className={styles.panel} style={{ opacity: 0 }}>

          {visibleStep === 'welcome' && (
            <div className={styles.welcomeWrapper}>
              <h1 className={styles.bigTitle}>
                <CharReveal text="WELCOME" delay={0.5} />
                <br />
                <CharReveal text="GUEST" delay={0.8} />
              </h1>
              <FadeIn delay={1.5} className={styles.sub}>
                <p className={styles.sub}>Let's configure your experience.</p>
              </FadeIn>
              <FadeIn delay={1.8} className={styles.nextBtn}>
                <Button variant='fill' icon={IoArrowForwardSharp} onClick={() => goTo('theme')}>
                  GET STARTED
                </Button>
              </FadeIn>
            </div>
          )}

          {visibleStep === 'returning' && (
            <div className={styles.welcomeWrapper}>
              <FadeIn delay={0.2} y={8}>
                <p className={styles.eyebrow}>
                  <span className={styles.prompt}>&gt;</span> RETURNING SESSION
                </p>
              </FadeIn>
              <h1 className={styles.bigTitle}>
                <CharReveal
                  text={prefs?.name ? `WELCOME BACK, ${prefs.name.toUpperCase()}.` : 'WELCOME BACK'}
                  delay={0.4}
                />
              </h1>
              <FadeIn delay={1.0} y={12}>
                <div className={styles.settingsSummary}>
                  <span className={styles.settingsRow}>
                    <span className={styles.settingsLabel}>THEME</span>
                    <span className={styles.settingsValue}>{THEME_LABEL}</span>
                  </span>
                  <span className={styles.settingsDivider} />
                  <span className={styles.settingsRow}>
                    <span className={styles.settingsLabel}>MODE</span>
                    <span className={styles.settingsValue}>{MODE_LABEL}</span>
                  </span>
                </div>
              </FadeIn>
              <FadeIn delay={1.4}>
                <p className={styles.sub}>Entering…</p>
              </FadeIn>
            </div>
          )}

          {visibleStep === 'wizard' && (
            <div ref={wizardRef} className={styles.wizardOuter}>
              <div className={styles.wizardTrack} ref={trackRef}>

                {/* Panel 1: Theme */}
                <div className={styles.wizardPanel}>
                  <p className={styles.eyebrow}><span className={styles.prompt}>&gt;</span> 01 / THEME</p>
                  <div className={styles.stepHeader}>
                    <h2 className={styles.stepTitle}>Choose your aesthetic.</h2>
                  </div>
                  <StaggerFade stagger={0.06} className={styles.themeGrid}>
                    {Object.entries(THEMES).map(([key, t]) => (
                      <ThemeCard key={key} themeKey={key} t={t} selected={themeKey === key} onSelect={setTheme} />
                    ))}
                  </StaggerFade>
                  <div className={styles.btnRow}>
                    <Button variant='fill' icon={IoArrowForwardSharp} onClick={() => goTo('name')}>
                      CONTINUE
                    </Button>
                    <button className={styles.skipBtn} onClick={handleSkipAll}>skip all</button>
                  </div>
                </div>

                {/* Panel 2: Name */}
                <div className={styles.wizardPanel}>
                  <p className={styles.eyebrow}><span className={styles.prompt}>&gt;</span> 02 / IDENTITY</p>
                  <div className={styles.stepHeader}>
                    <h2 className={styles.stepTitle}>What should I call you?</h2>
                    <button className={styles.backBtn} onClick={() => goTo('theme')}>
                      <IoArrowBackSharp className={styles.backIcon} />
                    </button>
                  </div>
                  <div className={styles.inputRow}>
                    <span className={styles.inputPrompt}>&gt;</span>
                    <div className={styles.inputWrap}>
                      {!isTyping && !focused && (
                        <span className={styles.fakePlaceholder}>
                          <span style={{ direction: 'ltr', unicodeBidi: 'embed' }}>
                            {placeholder}<span className={styles.inputCursor}>_</span>
                          </span>
                        </span>
                      )}
                      <input
                        ref={inputRef}
                        className={styles.input}
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && goTo('mode')}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        maxLength={32}
                        spellCheck={false}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className={styles.btnRow}>
                    <Button variant='fill' icon={IoArrowForwardSharp} onClick={() => goTo('mode')}>
                      CONTINUE
                    </Button>
                    <button className={styles.skipBtn} onClick={handleSkipAll}>skip all</button>
                  </div>
                </div>

                {/* Panel 3: Mode */}
                <div className={styles.wizardPanel}>
                  <p className={styles.eyebrow}><span className={styles.prompt}>&gt;</span> 03 / EXPERIENCE</p>
                  <div className={styles.stepHeader}>
                    <h2 className={styles.stepTitle}>Pick a mode.</h2>
                    <button className={styles.backBtn} onClick={() => goTo('name')}>
                      <IoArrowBackSharp className={styles.backIcon} />
                    </button>
                  </div>
                  <StaggerFade stagger={0.08} className={styles.modeGrid}>
                    {[
                      { id: 'full', tag: 'FULL', title: 'Immersive', desc: 'Every animation, every detail - the complete experience, exactly as designed.' },
                      { id: 'lite', tag: 'LITE', title: 'Essential', desc: 'Clean layout, reduced motion. Built for focus - no distractions, just content.' },
                    ].map(m => (
                      <ModeCard key={m.id} {...m} selected={mode === m.id} onSelect={setMode} />
                    ))}
                  </StaggerFade>
                  <div className={styles.btnRow}>
                    <Button
                      variant='fill'
                      icon={IoArrowForwardSharp}
                      onClick={() => handleEnter()}
                      disabled={!mode}
                    >
                      ENTER{name ? `, ${name.toUpperCase()}` : ''}
                    </Button>
                    <button className={styles.skipBtn} onClick={handleSkipAll}>skip all</button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      <FadeIn delay={0.7} className={styles.statusBar}>
        <div className={styles.statusBar}>
          <span className={styles.statusDot} />
        </div>
      </FadeIn>
    </div>
  );
}