import { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { IoClose, IoRemove } from 'react-icons/io5';
import ExpandIcon from '../assets/ExpandIcon';
import styles from './Terminal.module.css';

function SkillItem({ item, level, variants, custom, isInView, isFullscreen }) {
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start({ width: `${level}%` });
  }, [isInView]);

  useEffect(() => {
    if (isFullscreen) {
      controls.set({ width: 0 });
      controls.start({ width: `${level}%` });
    }
  }, [isFullscreen]);

  return (
    <motion.div
      className={styles.item}
      variants={variants}
      initial="hidden"
      animate="visible"
      custom={custom}
      whileHover={{ x: 4 }}
    >
      <span className={styles.fileIcon}>-rw-r--r--</span>
      <span className={styles.itemName}>{item}</span>
      <span className={styles.progressBar}>
        <motion.span
          className={styles.progressFill}
          initial={{ width: 0 }}
          animate={controls}
          transition={{ duration: 0.8, ease: 'easeOut', delay: custom * 0.08 }}
        />
      </span>
      <span className={styles.itemLevel}>{level}%</span>
    </motion.div>
  );
}

const groupVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (custom) => ({
    opacity: 1,
    transition: { delay: custom * 0.1, duration: 0.4 },
  }),
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: (custom) => ({
    opacity: 1,
    transition: { delay: custom * 0.04, duration: 0.3 },
  }),
};

const MOBILE_BREAKPOINT = 1023;

export default function Terminal({ isFullscreen, onExpand, data }) {
  const terminalRef = useRef(null);
  const isInView = useInView(terminalRef, { once: true });
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT;

  const effectiveFullscreen = isMobile ? false : isFullscreen;

  return (
    <motion.div
      ref={terminalRef}
      className={styles.terminal}
      animate={effectiveFullscreen ? {
        position: 'absolute',
        top: 14, left: 14, right: 14, bottom: 14,
        width: '100%',
        maxWidth: 'calc(100% - 28px)',
        height: '100%',
        maxHeight: 'calc(100% - 28px)',
        zIndex: 1000,
        borderRadius: 12,
      } : {
        position: 'relative',
        top: 0, left: 0, right: 0, bottom: 0,
        width: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        height: '100%',
        zIndex: 1,
        borderRadius: 12,
      }}
      transition={{ type: 'ease', duration: 0.2 }}
    >
      <div className={styles.terminalBar}>
        <span className={styles.termDot} style={{ background: '#ff5f57' }}>
          <IoClose color="#000" size={16} />
        </span>
        <span className={styles.termDot} style={{ background: '#ffbd2e' }}>
          <IoRemove color="#000" size={16} />
        </span>
        <span
          className={styles.termDot}
          style={{ background: '#28c840', ...(isMobile ? { pointerEvents: 'none', opacity: 0.4 } : {}) }}
          onClick={isMobile ? undefined : onExpand}
        >
          <ExpandIcon color="#000" size={8} style={{ rotate: '-90deg' }} />
        </span>
        <span className={styles.termTitle}>sumit@portfolio: ~/stack/{data.group}</span>
      </div>

      <div className={`${styles.terminalBody} ${effectiveFullscreen ? styles.terminalBodyFullscreen : ''}`}>
        {!isMobile && 
          <p className={styles.termCmd}>
            <span className={styles.termPrompt}>sumit@portfolio:~$</span> ls -la ./{data.group}
          </p>
        }
        <motion.div
          className={styles.group}
          variants={groupVariants}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <div className={styles.items}>
            {Object.entries(data.items).map(([item, level], ii) => (
              <SkillItem
                key={item}
                item={item}
                level={level}
                variants={itemVariants}
                custom={ii}
                isInView={isInView}
                isFullscreen={effectiveFullscreen}
              />
            ))}
          </div>
        </motion.div>

        <p className={styles.termCmd} style={{ marginTop: '20px' }}>
          <span className={styles.termPrompt}>sumit@portfolio:~$</span>
          <span className={styles.cursor}>_</span>
        </p>
      </div>
    </motion.div>
  );
}