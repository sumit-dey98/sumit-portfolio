import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import DotGrid from '../components/DotGrid';
import AnimatedContent from '../components/AnimatedContent';
import Button from '../components/Button';
import SvgButton from '../components/SvgButton';
import { useThemeContext } from '../theme/ThemeContext';
import { useDecryptedText } from '../hooks/useDecryptedText';
import { useTypewriter } from '../hooks/useTypewriter';
import { IoArrowForwardSharp, IoGlobeSharp } from 'react-icons/io5';
import styles from './Landing.module.css';


const LINE = ['Full-stack web developer'];

export default function Landing({ onEnter, onSkip }) {

  const { getCssVar } = useThemeContext();

  const { display } = useDecryptedText('INITIALIZING PORTFOLIO...', {
    speed: 50,
    revealSpeed: 1,
    delay: 300,
  });

  const typed = useTypewriter(LINE, { speed: 55, pause: 2000 });

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
        initial={{ opacity: 0.5, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <p className={styles.pre}>
          <span className={styles.prompt}>&gt;</span> {display}
        </p>

        <h1 className={styles.headline}>
          <AnimatedContent direction='horizontal' delay={0.2}> SUMIT </AnimatedContent>
          <AnimatedContent direction='horizontal' reverse delay={0.25}> HILLOL </AnimatedContent>
          <AnimatedContent direction='horizontal' delay={0.3}> DEY </AnimatedContent>
        </h1>

        <p className={styles.role}>
          <span className={styles.typed}>{typed}<span className={styles.cursor}>▌</span></span>
        </p>

        <div className={styles.buttons}>
          <Button variant="fill" icon={IoArrowForwardSharp}>VIEW CV</Button>
          <SvgButton
            color={getCssVar('--accent')}
            colorHover={getCssVar('--accent2')}
            width={180}
            height={47}
            radius = {2}
            duration={1500}
            fadeLength={0.75}
            strokeWidth = {1.5}
            direction="ccw"
            gsap={gsap}
            maxGap={0.5}
            ease="expo.inOut"
            onClick={onSkip}
          >
            SKIP INTRO
          </SvgButton>
        </div>
        <div className={styles.scrollHint}>
          <span>SCROLL</span>
          <div className={styles.scrollLine} />
        </div>
      </motion.div>
    </section>
  );
}