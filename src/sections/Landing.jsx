import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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

const isMobile = typeof window !== 'undefined' && window.innerWidth <= 1023;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const fadeVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const wordVariant = {
  hidden: { y: '100%' },
  visible: { y: '0%', transition: { duration: 0.65, ease: 'easeOut' } },
};

export default function Landing({ ready = false, onEnter, onSkip }) {
  const { getCssVar } = useThemeContext();
  const firedRef = useRef(false);

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

  useEffect(() => {
    if (!ready || firedRef.current) return;
    firedRef.current = true;
    startDecryptRef.current?.();
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
        variants={containerVariants}
        initial="hidden"
        animate={ready ? 'visible' : 'hidden'}
      >
        <motion.p className={styles.pre} variants={fadeUpVariant}>
          <span className={styles.prompt}>&gt;</span> {display}
        </motion.p>

        <h1 className={styles.headline}>
          {['SUMIT', 'HILLOL', 'DEY'].map((word) => (
            <span key={word} style={{ display: 'block', overflow: 'hidden' }}>
              <motion.span style={{ display: 'inline-block' }} variants={wordVariant}>
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p className={styles.role} variants={fadeVariant}>
          <span className={styles.typed}>
            {typed}<span className={styles.cursor}>▌</span>
          </span>
        </motion.p>

        <motion.div className={styles.buttons} variants={fadeUpVariant}>
          <Button variant="fill" icon={IoArrowForwardSharp}>VIEW CV</Button>
          <SvgButton
            color={getCssVar('--accent')}
            colorHover={getCssVar('--accent2')}
            width={186}
            height={48}
            radius={6}
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

        <motion.div className={styles.scrollHint} variants={fadeVariant}>
          <span>{ isMobile ? 'SWIPE' : 'SCROLL'}</span>
          <div className={styles.scrollLine} />
        </motion.div>
      </motion.div>
    </section>
  );
}