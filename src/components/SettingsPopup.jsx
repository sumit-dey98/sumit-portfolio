import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserPrefs } from '../hooks/useUserPrefs';
import Button from './Button';
import styles from './SettingsPopup.module.css';

const ease = [0.16, 1, 0.3, 1];

/**
 * variant="popup"  - floating popup, desktop nav (default)
 * variant="inline" - fills sidebar settings panel, no overlay
 */
export default function SettingsPopup({ onClose, variant = 'popup' }) {
  const { prefs, savePrefs } = useUserPrefs();
  const [name, setName] = useState(prefs?.name || '');
  const [mode, setMode] = useState(prefs?.mode || null);

  const handleSave = () => {
    savePrefs({ name: name.trim(), mode });
    onClose?.();
  };

  const inner = (
    <div className={`${styles.inner} ${variant === 'inline' ? styles.innerInline : ''}`}>
      <div className={styles.header}>
        <p className={styles.title}>
          <span className={styles.prompt}>&gt;</span> PREFERENCES
        </p>
        {variant === 'popup' && (
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        )}
      </div>

      <div className={styles.body}>
        {/* Name */}
        <div className={styles.field}>
          <label className={styles.label}>NAME</label>
          <div className={styles.inputRow}>
            <span className={styles.inputPrompt}>&gt;</span>
            <input
              className={styles.input}
              type="text"
              placeholder="YOUR NAME"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              maxLength={32}
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>

        {/* Mode */}
        <div className={styles.field}>
          <label className={styles.label}>EXPERIENCE MODE</label>
          <div className={styles.modeRow}>
            {[
              { id: 'lite', tag: 'LITE', desc: 'Reduced motion' },
              { id: 'full', tag: 'FULL', desc: 'Full animations' },
            ].map(m => (
              <button
                key={m.id}
                className={`${styles.modeBtn} ${mode === m.id ? styles.modeBtnOn : ''}`}
                onClick={() => setMode(m.id)}
              >
                <span className={styles.modeTag}>{m.tag}</span>
                <span className={styles.modeDesc}>{m.desc}</span>
                {mode === m.id && (
                  <motion.span
                    className={styles.modeCheck}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  ></motion.span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <Button className={styles.saveBtn} onClick={handleSave}>
          <span className={styles.saveBg} />
          <span >SAVE CHANGES</span>
        </Button>
        {variant === 'popup' && (
          <button className={styles.cancelBtn} onClick={onClose}>cancel</button>
        )}
      </div>
    </div>
  );

  if (variant === 'inline') return inner;

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={e => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        className={styles.popup}
        initial={{ opacity: 0, y: -10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.97 }}
        transition={{ duration: 0.22, ease }}
      >
        {inner}
      </motion.div>
    </motion.div>
  );
}