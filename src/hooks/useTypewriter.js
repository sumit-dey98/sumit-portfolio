import { useState, useEffect } from 'react';

export function useTypewriter(lines, { speed = 60, pause = 1200, loop = false, paused = false } = {}) {
  const [display, setDisplay] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (paused) return;

    const current = lines[lineIndex];

    if (!deleting && charIndex < current.length) {
      const t = setTimeout(() => setCharIndex(i => i + 1), speed);
      return () => clearTimeout(t);
    }

    if (!deleting && charIndex === current.length) {
      if (!loop && lineIndex === lines.length - 1) return;
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }

    if (deleting && charIndex > 0) {
      const t = setTimeout(() => setCharIndex(i => i - 1), speed / 2);
      return () => clearTimeout(t);
    }

    if (deleting && charIndex === 0) {
      setDeleting(false);
      setLineIndex(i => (i + 1) % lines.length);
    }
  }, [charIndex, deleting, lineIndex, lines, speed, pause, loop, paused]);

  useEffect(() => {
    setDisplay(lines[lineIndex].slice(0, charIndex));
  }, [charIndex, lineIndex, lines]);

  useEffect(() => {
    if (!paused) {
      setCharIndex(0);
      setLineIndex(0);
      setDeleting(false);
    }
  }, [paused]);

  return display;
}