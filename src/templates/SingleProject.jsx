import ProjectTransition from '../components/ProjectTransition';
import { useState } from 'react';

export default function SingleProject({ src, bgColor, logo }) {
  const [transitioning, setTransitioning] = useState(true);
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: bgColor }}>
      {transitioning && (
        <ProjectTransition
          bgColor={bgColor}
          logo={logo}
          onDone={() => {
            setTransitioning(false);
            setTimeout(() => setVisible(true), 50);
          }}
        />
      )}
      {!transitioning && (
        <iframe
          src={src}
          allow="accelerometer; camera; gyroscope; xr-spatial-tracking"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            background: bgColor,
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      )}
    </div>
  );
}