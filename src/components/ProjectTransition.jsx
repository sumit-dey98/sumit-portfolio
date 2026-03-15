import { useEffect, useState } from 'react';

export default function ProjectTransition({ bgColor, logo, onDone }) {
  const [phase, setPhase] = useState('cover');

  useEffect(() => {
    console.log('ProjectTransition mounted');
    const t1 = setTimeout(
      () => setPhase('bounce'), 400);
    const t2 = setTimeout(() => setPhase('bounce'), 1100);
    const t3 = setTimeout(() => setPhase('exit'), 1450);
    const t4 = setTimeout(() => { setPhase('done'); onDone?.(); }, 1800);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  if (phase === 'done') return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: bgColor,
      transform: phase === 'exit' ? 'translateY(-100%)' : 'translateY(0)',
      transition: phase === 'exit' ? 'transform 0.4s cubic-bezier(0.76,0,0.24,1)' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        opacity: phase === 'cover' ? 0 : 1,
        animation: phase === 'pulse'
          ? 'tpulse 0.5s ease-in-out 2'
          : phase === 'bounce'
            ? 'tbounce 0.35s ease-out forwards'
            : 'none',
        transition: 'opacity 0.2s',
      }}>
        {logo}
      </div>

      <style>{`
        @keyframes tpulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.12); opacity: 0.8; }
        }
        @keyframes tbounce {
          0% { transform: scale(1); }
          40% { transform: scale(1.18); }
          70% { transform: scale(0.92); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}