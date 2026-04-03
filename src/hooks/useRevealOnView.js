import { useCallback } from 'react';
import gsap from 'gsap';

export function useRevealOnView(vars = {}) {
  return useCallback((node) => {
    if (!node || window.innerWidth < 1024) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.to(node, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          ...vars,
        });
        observer.disconnect();
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
  }, []);
}