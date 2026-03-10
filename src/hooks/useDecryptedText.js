import { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>/\\|[]{}';

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * useDecryptText
 *
 * @param {string}  text            - The final text to reveal
 * @param {object}  options
 * @param {number}  options.speed        - ms between each frame tick (default: 40)
 * @param {number}  options.revealSpeed  - how many chars get locked per tick (default: 1)
 * @param {string}  options.chars        - custom scramble character set (optional)
 * @param {boolean} options.autoStart    - start immediately on mount (default: true)
 * @param {number}  options.delay        - ms before animation starts (default: 0)
 *
 * @returns {{ display, start, reset, done }}
 */
export function useDecryptedText(text, {
  speed = 40,
  revealSpeed = 1,
  chars = CHARS,
  autoStart = true,
  delay = 0,
} = {}) {
  const [display, setDisplay] = useState('');
  const [done, setDone] = useState(false);
  const revealedRef = useRef(0);
  const rafRef = useRef(null);
  const startedRef = useRef(false);

  const animate = () => {
    const revealed = revealedRef.current;

    // Build the string: locked chars + scrambled remainder
    const result = text.split('').map((char, i) => {
      if (i < revealed) return char;           // locked in
      if (char === ' ') return ' ';              // preserve spaces
      return rand(chars.split(''));           // scramble
    }).join('');

    setDisplay(result);

    if (revealed >= text.length) {
      setDone(true);
      return;
    }

    rafRef.current = setTimeout(() => {
      revealedRef.current = Math.min(revealed + revealSpeed, text.length);
      animate();
    }, speed);
  };

  const start = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    revealedRef.current = 0;
    setDone(false);

    // Seed with scrambled text before revealing
    setDisplay(text.split('').map(c => c === ' ' ? ' ' : rand(chars.split(''))).join(''));

    rafRef.current = setTimeout(animate, 0);
  };

  const reset = () => {
    clearTimeout(rafRef.current);
    startedRef.current = false;
    revealedRef.current = 0;
    setDone(false);
    setDisplay('');
  };

  useEffect(() => {
    if (!autoStart) return;
    const t = setTimeout(start, delay);
    return () => {
      clearTimeout(t);
      clearTimeout(rafRef.current);
    };
  }, [text]);

  return { display, start, reset, done };
}