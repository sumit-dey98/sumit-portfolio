import { useEffect, useRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import gsap from 'gsap';
import DotGrid from '../components/DotGrid';
import Button from '../components/Button';
import SvgButton from '../components/SvgButton';
import { useThemeContext } from '../theme/ThemeContext';
import { useDecryptedText } from '../hooks/useDecryptedText';
import { useTypewriter } from '../hooks/useTypewriter';
import { IoArrowForwardSharp } from 'react-icons/io5';
import styles from './Landing.module.css';

const LINE = ['Front-end web developer'];

export default function Landing({ ready = false, onEnter, onSkip }) {
  const { getCssVar } = useThemeContext();

  const wrapperControls = useAnimationControls();
  const eyebrowControls = useAnimationControls();
  const word0Controls = useAnimationControls();
  const word1Controls = useAnimationControls();
  const word2Controls = useAnimationControls();
  const roleControls = useAnimationControls();
  const buttonsControls = useAnimationControls();
  const scrollControls = useAnimationControls();
  const wordControlsRef = useRef([word0Controls, word1Controls, word2Controls]);

  const { display, start: startDecrypt } = useDecryptedText('INITIALIZING PORTFOLIO...', {
    speed: 50,
    revealSpeed: 1,
    autoStart: false,
  });

  const startDecryptRef = useRef(startDecrypt);
  useEffect(() => { startDecryptRef.current = startDecrypt; }, [startDecrypt]);

  const typed = useTypewriter(LINE, {
    speed: 55,
    pause: 2000,
    paused: !ready,
  });

  const firedRef = useRef(false);

  useEffect(() => {
    if (!ready || firedRef.current) return;
    firedRef.current = true;

    wrapperControls.start({ opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } });
    startDecryptRef.current?.();

    setTimeout(() => {
      eyebrowControls.start({ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } });
    }, 100);

    wordControlsRef.current.forEach((ctrl, i) => {
      setTimeout(() => {
        ctrl.start({ y: '0%', transition: { duration: 0.7, ease: 'easeOut' } });
      }, 150 + i * 80);
    });

    setTimeout(() => {
      roleControls.start({ opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } });
    }, 550);

    setTimeout(() => {
      buttonsControls.start({ opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } });
    }, 700);

    setTimeout(() => {
      scrollControls.start({ opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } });
    }, 850);

  }, [ready]); 

  return (
    <section id="landing" className={styles.landing}>
      <div className={styles.grid}>
        <DotGrid
          dotSize={3}
          gap={15}
          baseColor={getCssVar('--surface')}
          activeColor={getCssVar('--accent')}
          proximity={130}
          shockRadius={260}
          shockStrength={6}
          resistance={750}
          returnDuration={1.5}
        />
      </div>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0 }}
        animate={wrapperControls}
      >
        <motion.p
          className={styles.pre}
          initial={{ opacity: 0, y: 8 }}
          animate={eyebrowControls}
        >
          <span className={styles.prompt}>&gt;</span> {display}
        </motion.p>

        <h1 className={styles.headline}>
          {['SUMIT', 'HILLOL', 'DEY'].map((word, i) => (
            <span key={word} style={{ display: 'block', overflow: 'hidden' }}>
              <motion.span
                style={{ display: 'inline-block' }}
                initial={{ y: '100%' }}
                animate={wordControlsRef.current[i]}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className={styles.role}
          initial={{ opacity: 0 }}
          animate={roleControls}
        >
          <span className={styles.typed}>
            {typed}<span className={styles.cursor}>▌</span>
          </span>
        </motion.p>

        <motion.div
          className={styles.buttons}
          initial={{ opacity: 0, y: 12 }}
          animate={buttonsControls}
        >
          <Button variant="fill" icon={IoArrowForwardSharp}>VIEW CV</Button>
          <SvgButton
            color={getCssVar('--accent')}
            colorHover={getCssVar('--accent2')}
            width={180}
            height={47}
            radius={2}
            duration={1500}
            fadeLength={0.75}
            strokeWidth={1.5}
            direction="ccw"
            gsap={gsap}
            maxGap={0.5}
            ease="expo.inOut"
            onClick={onSkip}
          >
            SKIP INTRO
          </SvgButton>
        </motion.div>

        <motion.div
          className={styles.scrollHint}
          initial={{ opacity: 0 }}
          animate={scrollControls}
        >
          <span>SCROLL</span>
          <div className={styles.scrollLine} />
        </motion.div>
      </motion.div>
    </section>
  );
}