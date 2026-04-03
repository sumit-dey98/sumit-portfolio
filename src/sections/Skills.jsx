import { useState } from 'react';
import Terminal from '../components/Terminal';
import styles from './Skills.module.css';
import { STACKS } from '../data/data';

export default function Skills() {
  const [fullscreenId, setFullscreenId] = useState(null);

  const handleExpand = (id) => setFullscreenId(prev => prev === id ? null : id);

  return (
    <section id="skills" className={styles.skills}>
      <div className={styles.inner}>
        <p className={styles.label}>
          <span className={styles.prompt}>&gt; </span>
          &nbsp;SKILLS
        </p>

        <div className={styles.stacksContainer}>
          {STACKS.map((stack) => (
            <div key={stack.id} className={styles.stackWrapper}>
              <Terminal
                isFullscreen={fullscreenId === stack.id}
                onExpand={() => handleExpand(stack.id)}
                data={stack}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}