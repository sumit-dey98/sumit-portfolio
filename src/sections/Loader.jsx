import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useThemeContext } from '../theme/ThemeContext';
import { useTypewriter } from '../hooks/useTypewriter';
import { THEMES } from '../theme/themes';
import { useUserPrefs } from '../hooks/useUserPrefs';
import Button from '../components/Button';
import CurtainTransition from '../components/CurtainTransition';
import { IoArrowForwardSharp, IoArrowBackSharp } from 'react-icons/io5';
import styles from './Loader.module.css';

const ease = [0.16, 1, 0.3, 1]; 
const TYPEWRITER_LINES = [
  'Enter your name',
  'You can skip this',
  'Your data will only be stored in your browser',
];

const CharReveal = ({ text, delay = 0, className = '' }) => {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wIdx) => (
        <span
          key={wIdx}
          style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
        >
          {word.split('').map((ch, i) => {
            const charIndex = words
              .slice(0, wIdx)
              .reduce((acc, w) => acc + w.length, 0) + i + wIdx; 
            return (
              <motion.span
                key={i}
                style={{ display: 'inline-block', whiteSpace: 'pre' }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: delay + charIndex * 0.028,
                  ease,
                }}
              >
                {ch}
              </motion.span>
            );
          })}
          {wIdx < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
};

const Corner = ({ delay }) => (
  <motion.span className={styles.cornerInner}>
    <motion.span
      className={`${styles.cLine} ${styles.cLineH}`}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.5, delay, ease }}
    />
    <motion.span
      className={`${styles.cLine} ${styles.cLineV}`}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.5, delay, ease }}
    />
  </motion.span>
);

const ThemeIcon = ({ icon: Icon, size = 11 }) => <Icon size={size} />;

const ThemeCard = ({ themeKey: tk, t, selected, onSelect }) => (
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
      <span className={styles.cardIcon}>
        <ThemeIcon icon={t.icon} />
      </span>
      <span className={styles.cardName}>{t.label}</span>
    </span>
    {selected && (
      <motion.span
        className={styles.cardCheck}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      ></motion.span>
    )}
  </button>
);

const ModeCard = ({ id, tag, title, desc, selected, onSelect }) => (
  <button
    className={`${styles.modeCard} ${selected ? styles.modeCardOn : ''}`}
    onClick={() => onSelect(id)}
  >
    <span className={styles.modeTag}>{tag}</span>
    <span className={styles.modeTitle}>{title}</span>
    <span className={styles.modeDesc}>{desc}</span>
    {/* {selected && (
      <motion.span
        className={styles.modeCheck}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >✓</motion.span>
    )} */}
  </button>
);

const STEPS = ['theme', 'name', 'mode'];

export default function Loader({ onComplete }) {
  const { themeKey, setTheme, getCssVar } = useThemeContext();
  const { prefs, savePrefs } = useUserPrefs();

  const [step, setStep] = useState(() => prefs ? 'returning' : 'welcome');
  const [name, setName] = useState(prefs?.name || '');
  const [mode, setMode] = useState(prefs?.mode || null);
  const [exiting, setExiting] = useState(false);
  const [showCurtain, setShowCurtain] = useState(false);
  const inputRef = useRef(null);
  const wizardRef = useRef(null);
  const trackRef = useRef(null);

  const isTyping = name.length > 0;
  const placeholder = useTypewriter(TYPEWRITER_LINES, {
    speed: 55,
    pause: 1400,
    loop: true,
    paused: isTyping,
  });

  const stepIndex = STEPS.indexOf(step); 
  const inWizard = STEPS.includes(step);

  useEffect(() => {
    if (step !== 'returning') return;
    const t = setTimeout(() => {
      setExiting(true);
      setTimeout(() => setShowCurtain(true), 400);
    }, 2000);
    return () => clearTimeout(t);
  }, [step]);

useEffect(() => {
  if (!trackRef.current || !inWizard) return;
  const panelWidth = Math.min(800, window.innerWidth);
  const targetX = -(stepIndex < 0 ? 0 : stepIndex * panelWidth);
  gsap.to(trackRef.current, {
    x: targetX,
    duration: 1,
    ease: 'expo.out',
  });

}, [stepIndex, inWizard]);

  useEffect(() => {
    if (step === 'name') setTimeout(() => inputRef.current?.focus(), 500);
  }, [step]);

  const goTo = (s) => setStep(s);

  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
    else setStep('welcome'); 
  };

  const handleEnter = (overrides = {}) => {
    const finalMode = overrides.mode ?? mode;
    if (!finalMode) return;
    const p = { name: overrides.name ?? name.trim(), mode: finalMode, themeKey };
    savePrefs(p);
    setExiting(true);
    setTimeout(() => setShowCurtain(true), 400);
  };

  const handleSkipAll = () => handleEnter({ mode: 'lite', name: '' });

  const handleCurtainDone = useCallback(() => {
    onComplete({ name: name.trim() || prefs?.name || '', mode: mode || prefs?.mode, themeKey });
  }, [name, mode, themeKey, prefs, onComplete]);


  useEffect(() => {
    if (!trackRef.current || !inWizard) return;
    gsap.set(trackRef.current, { x: 0 });
  }, []);

  useEffect(() => {
    if (!trackRef.current || !inWizard || !wizardRef.current) return;
    const containerWidth = wizardRef.current.offsetWidth; 
    const targetX = -(stepIndex < 0 ? 0 : stepIndex * containerWidth);
    gsap.to(trackRef.current, {
      x: targetX,
      duration: 1,
      ease: 'expo.out',
    });
  }, [stepIndex, inWizard]);


  // ── Slide offset: each panel is 33.33% of the slider width ──
  // const getTranslateX = () => {
  //   if (stepIndex < 0) return 'translateX(0%)';
  //   return `translateX(-${stepIndex * 33.333}%)`;
  // };

  const THEME_LABEL = prefs ? (THEMES[prefs.themeKey]?.label || prefs.themeKey) : '';
  const MODE_LABEL = prefs?.mode === 'full' ? 'Immersive' : 'Essential';

  return (
    <>
      {showCurtain && (
        <CurtainTransition
          color={getCssVar('--accent2')}
          color2={getCssVar('--accent')}
          onComplete={handleCurtainDone}
        />
      )}

      <AnimatePresence>
        {!exiting && (
          <motion.div
            className={styles.loader}
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
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
              <AnimatePresence mode="wait">

                {step === 'welcome' && (
                  <motion.div key="welcome" className={styles.panel}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                    transition={{ duration: 0.4, ease }}
                  > <div className={styles.welcomeWrapper}> 
                      <h1 className={styles.bigTitle}>
                        <CharReveal text="WELCOME" delay={0.5} />
                        <br />
                        <CharReveal text="GUEST" delay={0.8} />
                      </h1>
                      <motion.p className={styles.sub}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >
                        Let's configure your experience.
                      </motion.p>
                      <motion.div
                        className={styles.nextBtn}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 1.8 }}
                      >
                        <Button variant='fill' icon={IoArrowForwardSharp} onClick={() => goTo('theme')}>GET STARTED</Button>
                      </motion.div>
                  </div>
                  </motion.div>
                )}

                {step === 'returning' && (
                  <motion.div key="returning" className={styles.panel}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className={styles.welcomeWrapper}>
                      <motion.p className={styles.eyebrow}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className={styles.prompt}>&gt;</span> RETURNING SESSION
                      </motion.p>
                      <h1 className={styles.bigTitle}>
                        <CharReveal
                          text={prefs?.name ? `WELCOME BACK, ${prefs.name.toUpperCase()}.` : 'WELCOME BACK'}
                          delay={0.4}
                        />
                      </h1>
                      <motion.div
                        className={styles.settingsSummary}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                      >
                        <span className={styles.settingsRow}>
                          <span className={styles.settingsLabel}>THEME</span>
                          <span className={styles.settingsValue}>{THEME_LABEL}</span>
                        </span>
                        <span className={styles.settingsDivider} />
                        <span className={styles.settingsRow}>
                          <span className={styles.settingsLabel}>MODE</span>
                          <span className={styles.settingsValue}>{MODE_LABEL}</span>
                        </span>
                      </motion.div>
                      <motion.p className={styles.sub}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                      >
                        Entering…
                      </motion.p>
                    </div>
                  </motion.div>
                )}

                {inWizard && (
                  <motion.div
                    key="wizard"
                    ref={wizardRef}
                    className={styles.wizardOuter}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <div className={styles.wizardTrack} ref={trackRef}>

                      <div className={styles.wizardPanel}>
                        <p className={styles.eyebrow}><span className={styles.prompt}>&gt;</span> 01 / THEME</p>
                        <div className={styles.stepHeader}> <h2 className={styles.stepTitle}>Choose your aesthetic.</h2>
                         </div>
                        
                        <div className={styles.themeGrid}>
                          {Object.entries(THEMES).map(([key, t], i) => (
                            <motion.div key={key}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.06, ease }}
                            >
                              <ThemeCard themeKey={key} t={t} selected={themeKey === key} onSelect={setTheme} />
                            </motion.div>
                          ))}
                        </div>
                        <div className={styles.btnRow} >
                          <Button variant='fill' icon={IoArrowForwardSharp} onClick={() => goTo('name')}>
                            CONTINUE
                          </Button>
                          {inWizard && (
                            <button className={styles.skipBtn} onClick={handleSkipAll}>skip all</button>
                          )}
                        </div>
                      </div>

                      <div className={styles.wizardPanel}>
                        <p className={styles.eyebrow}><span className={styles.prompt}>&gt;</span> 02 / IDENTITY</p>
                        <div className={styles.stepHeader}> <h2 className={styles.stepTitle}>What should we call you?</h2>
                          <button className={styles.backBtn} onClick={() => goTo('theme')}> <IoArrowBackSharp className={styles.backIcon} /> </button>
                        </div>
                        {/* <p className={styles.sub}>Optional — personalises your visit.</p> */}
                        <div className={styles.inputRow}>
                          <span className={styles.inputPrompt}>&gt;</span>
                          <div className={styles.inputWrap}>
                            {!isTyping && (
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
                              maxLength={32}
                              spellCheck={false}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                        <div className={styles.btnRow}>
                          <Button variant='fill' icon={IoArrowForwardSharp} onClick={() => goTo('mode')}>CONTINUE</Button>
                          {inWizard && (
                              <button className={styles.skipBtn} onClick={handleSkipAll}>skip all</button>
                          )}      
                        </div>
                      </div>

                      <div className={styles.wizardPanel}>
                        <p className={styles.eyebrow}><span className={styles.prompt}>&gt;</span> 03 / EXPERIENCE</p>
                        <div className={styles.stepHeader}> <h2 className={styles.stepTitle}>Pick a mode.</h2>
                          <button className={styles.backBtn} onClick={() => goTo('name')}> <IoArrowBackSharp className={styles.backIcon} /> </button>
                        </div>
                        <div className={styles.modeGrid}>
                          {[
                            { id: 'lite', tag: 'LITE', title: 'Essential', desc: 'Clean layout, reduced motion. Built for focus — no distractions, just content.' },
                            { id: 'full', tag: 'FULL', title: 'Immersive', desc: 'Every animation, every detail — the complete experience, exactly as designed.' },
                          ].map((m, i) => (
                            <motion.div key={m.id}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.08, ease }}
                            >
                              <ModeCard {...m} selected={mode === m.id} onSelect={setMode} />
                            </motion.div>
                          ))}
                        </div>
                        <div className={styles.btnRow}>
                          <Button
                            variant='fill'
                            icon={IoArrowForwardSharp}
                            onClick={() => handleEnter()}
                            disabled={!mode}
                          >
                            ENTER{name ? `, ${name.toUpperCase()}` : ''}
                          </Button>
                          {inWizard && (
                              <button className={styles.skipBtn} onClick={handleSkipAll}>skip all</button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            <motion.div className={styles.statusBar}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className={styles.statusDot} />
              {/* <span>sumit.dev — portfolio</span>
              <span className={styles.statusRight}>{new Date().getFullYear()}</span> */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}