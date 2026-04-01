import { useEffect, useRef, useCallback } from 'react';

export function useCursor(enabled = true) {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    // hide/show based on enabled
    if (!enabled) {
      cursor.style.opacity = '0';
      cursor.style.pointerEvents = 'none';
      ring.style.opacity = '0';
      ring.style.pointerEvents = 'none';
      return;
    }

    cursor.style.opacity = '1';
    ring.style.opacity = '0.6';
    cursor.style.pointerEvents = 'none';
    ring.style.pointerEvents = 'none';

    let rx = 0, ry = 0, lx = 0, ly = 0, rafId;

    const onSelect = () => {
      window.getSelection()?.removeAllRanges();
    };

    const onMove = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      rx = e.clientX;
      ry = e.clientY;
    };

    const lerp = () => {
      lx += (rx - lx) * 0.12;
      ly += (ry - ly) * 0.12;
      ring.style.left = `${lx}px`;
      ring.style.top = `${ly}px`;
      rafId = requestAnimationFrame(lerp);
    };
    lerp();

    const setSize = (cw, ch, rw, rh, ro) => {
      cursor.style.width = `${cw}px`;
      cursor.style.height = `${ch}px`;
      ring.style.width = `${rw}px`;
      ring.style.height = `${rh}px`;
      ring.style.opacity = `${ro}`;
    };

    const onNormal = () => setSize(10, 10, 36, 36, 0.6);
    onNormal();
    const onEnter = () => setSize(20, 20, 56, 56, 1);
    const onLeave = () => onNormal();

    const onClick = () => {
      setSize(12, 12, 44, 44, 0.8);
      setTimeout(onNormal, 150);
    };

    // use event delegation instead of attaching to each element
    const onMouseOver = (e) => {
      if (e.target.closest('a, button, [data-cursor]')) onEnter();
    };
    const onMouseOut = (e) => {
      if (e.target.closest('a, button, [data-cursor]')) onLeave();
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
    window.addEventListener('click', onClick);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
    document.addEventListener('selectstart', onSelect);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      document.removeEventListener('selectstart', onSelect);
    };
  }, [enabled]);

  return { cursorRef, ringRef };
}