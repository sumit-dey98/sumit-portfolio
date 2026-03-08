import { useEffect, useRef } from 'react';

export function useCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let rx = 0, ry = 0;

    const onMove = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      rx = e.clientX;
      ry = e.clientY;
    };

    let lx = 0, ly = 0;
    let rafId;
    const lerp = () => {
      lx += (rx - lx) * 0.12;
      ly += (ry - ly) * 0.12;
      ring.style.left = `${lx}px`;
      ring.style.top = `${ly}px`;
      rafId = requestAnimationFrame(lerp);
    };
    lerp();

    const onEnter = () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      ring.style.width = '56px';
      ring.style.height = '56px';
      ring.style.opacity = '1';
    };

    const onLeave = () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.opacity = '0.6';
    };

    const onTouchMove = (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      cursor.style.opacity = '1';
      ring.style.opacity = '0.6';
      cursor.style.left = `${touch.clientX}px`;
      cursor.style.top = `${touch.clientY}px`;
      rx = touch.clientX;
      ry = touch.clientY;
    };

    const onTouchEnd = () => {
      cursor.style.opacity = '0';
      ring.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove);
    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);

      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  return { cursorRef, ringRef };
}