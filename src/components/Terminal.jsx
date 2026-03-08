import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { IoClose, IoRemove } from 'react-icons/io5';
import ExpandIcon from '../assets/ExpandIcon';
import { useThemeContext } from '../theme/ThemeContext';
import styles from './Terminal.module.css';

const SKILLS = [
  {
    group: 'languages',
    items: ['JavaScript', 'PHP', 'Python'],
  },
  {
    group: 'frameworks',
    items: ['React', 'Next.js', 'Vite'],
  },
  {
    group: 'graphics & animations',
    items: ['GSAP', 'Canvas API', 'Framer Motion'],
  },
  {
    group: 'tooling',
    items: ['Tailwind', 'Wordpress', 'HubSpot'],
  },
];

export default function Terminal({ isFullscreen, onClose, onMinimize, onExpand }) {

  const { getCssVar } = useThemeContext();

  const windowVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
    fullscreen: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', damping: 20, stiffness: 200 }
    }
  }), []);

  const groupVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (custom) => ({
      opacity: 1,
      x: 0,
      transition: { delay: custom * 0.1, duration: 0.4 }
    })
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: (custom) => ({
      opacity: 1,
      transition: { delay: custom * 0.04, duration: 0.3 }
    })
  };

  return (
    <motion.div
      className={`${styles.terminal} ${isFullscreen ? styles.fullscreen : ''}`}
      variants={windowVariants}
      initial="hidden"
      animate={isFullscreen ? 'fullscreen' : 'visible'}
      exit="hidden"
      layout 
    >
      <div className={styles.terminalBar}>
        <span
          className={styles.termDot}
          style={{ background: '#ff5f57' }}
          // onClick={onClose}
        >
          <IoClose color="#000" size={16} />
        </span>
        <span
          className={styles.termDot}
          style={{
            background: '#ffbd2e',
          }}
          // onClick={onMinimize}
        >
          <IoRemove color="#000" size={16} />
        </span>
        <span
          className={styles.termDot}
          style={{ background: '#28c840' }}
          onClick={onExpand}
        >
          <ExpandIcon color="#000" size={8} style={{rotate: '-90deg'}}/>
        </span>
        <span className={styles.termTitle}>sumit@portfolio: ~/skills</span>
      </div>

      <div className={styles.terminalBody}>
        <p className={styles.termCmd}>
          <span className={styles.termPrompt}>sumit@portfolio:~$</span> ls -la ./skills
        </p>

        {SKILLS.map((group, gi) => (
          <motion.div
            key={group.group}
            className={styles.group}
            variants={groupVariants}
            initial="hidden"
            animate="visible"
            custom={gi}
          >
            <span className={styles.groupName}>
              <span className={styles.termDir}>drwxr-xr-x</span> ./{group.group}/
            </span>
            <div className={styles.items}>
              {group.items.map((item, ii) => (
                <motion.span
                  key={item}
                  className={styles.item}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={gi * 10 + ii} 
                  whileHover={{ x: 4 }}
                >
                  <span className={styles.fileIcon}>-rw-r--r--</span>
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}

        <p className={styles.termCmd} style={{ marginTop : '20px'}}>
          <span className={styles.termPrompt}>sumit@portfolio:~$</span>
          <span className={styles.cursor}>_</span>
        </p>
      </div>
    </motion.div>
  );
}