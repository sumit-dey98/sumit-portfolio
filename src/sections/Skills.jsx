import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsTerminalFill } from 'react-icons/bs';
import Terminal from '../components/Terminal';
import styles from './Skills.module.css';

export default function Skills() {
  const [showTerminal, setShowTerminal] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleClose = () => setShowTerminal(false);
  const handleExpand = () => setIsFullscreen(!isFullscreen);
  const handleMinimize = () => setShowTerminal(false);

  return (
    <section id="skills" className={styles.skills}>
      <div className={styles.inner}>
        <p className={styles.label}>
          <span className={styles.prompt}>&gt;</span> SKILLS
        </p>

        <AnimatePresence>
          {showTerminal && (
            <Terminal
              key="terminal"
              isFullscreen={isFullscreen}
              onClose={handleClose}
              onMinimize={handleMinimize}
              onExpand={handleExpand}
            />
          )}
        </AnimatePresence>

        {!showTerminal && (
          <motion.button
            className={styles.floatingIcon}
            onClick={() => setShowTerminal(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <BsTerminalFill size={28} />
          </motion.button>
        )}
      </div>
    </section>
  );
}