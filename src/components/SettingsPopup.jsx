import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useUserPrefs } from '../hooks/useUserPrefs';
import Button from './Button';
import styles from './SettingsPopup.module.css';

function ToggleThumb({ on }) {
  const ref = useRef(null);
  const prevOn = useRef(on);

  useEffect(() => {
    if (!ref.current || prevOn.current === on) return;
    prevOn.current = on;
    gsap.to(ref.current, {
      x: on ? 18 : 0,
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)',
    });
  }, [on]);

  return (
    <span
      ref={ref}
      className={styles.toggleThumb}
      style={{ transform: `translateX(${on ? 18 : 0}px)` }}
    />
  );
}

function CursorSetting({ localCursor, setLocalCursor }) {
  return (
    <div className={styles.settingRow}>
      <span className={styles.settingLabel}>Ring Cursor</span>
      <button
        className={`${styles.toggle} ${localCursor === 'yes' ? styles.toggleOn : ''}`}
        onClick={() => setLocalCursor(localCursor === 'yes' ? 'no' : 'yes')}
        role="switch"
        aria-checked={localCursor === 'yes'}
      >
        <span className={styles.toggleTrack}>
          <ToggleThumb on={localCursor === 'yes'} />
        </span>
      </button>
    </div>
  );
}

function GenieSetting({ localGenie, setLocalGenie }) {
  return (
    <div className={styles.settingRow}>
      <span className={styles.settingLabel}>Preloader Animation</span>
      <button
        className={`${styles.toggle} ${localGenie === 'yes' ? styles.toggleOn : ''}`}
        onClick={() => setLocalGenie(localGenie === 'yes' ? 'no' : 'yes')}
        role="switch"
        aria-checked={localGenie === 'yes'}
      >
        <span className={styles.toggleTrack}>
          <ToggleThumb on={localGenie === 'yes'} />
        </span>
      </button>
    </div>
  );
}

export default function SettingsPopup({ onClose, variant = 'popup', onCursorChange }) {
  const { prefs, savePrefs } = useUserPrefs();
  const [name, setName] = useState(prefs?.name || '');
  const [mode, setMode] = useState(prefs?.mode || null);
  const [localCursor, setLocalCursor] = useState(
    () => localStorage.getItem('ring-cursor') ?? 'yes'
  );
  const [localGenie, setLocalGenie] = useState(
    () => localStorage.getItem('genie-enabled') ?? 'yes'
  );

  const handleSave = () => {
    savePrefs({ name: name.trim(), mode });
    localStorage.setItem('ring-cursor', localCursor);
    localStorage.setItem('genie-enabled', localGenie);
    onCursorChange?.(localCursor === 'yes');
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

        <CursorSetting localCursor={localCursor} setLocalCursor={setLocalCursor} />
        <GenieSetting localGenie={localGenie} setLocalGenie={setLocalGenie} />
      </div>

      <div className={styles.footer}>
        <Button className={styles.saveBtn} onClick={handleSave}>
          SAVE CHANGES
        </Button>
        {variant === 'popup' && (
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        )}
      </div>
    </div>
  );

  if (variant === 'inline') return inner;

  return (
    <div className={styles.popup}>
      {inner}
    </div>
  );
}