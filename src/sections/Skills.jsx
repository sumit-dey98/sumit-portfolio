import { useState } from 'react';
import Terminal from '../components/Terminal';
import styles from './Skills.module.css';

/**
 * Variant: 'terminal'
 * All content comes from the section's `data` - see src/data/sections/skills.js.
 * Any number of groups, each with any number of items.
 */
export default function Skills({ data = {}, label }) {
  const { groups = [], user = 'user' } = data;
  const [fullscreenId, setFullscreenId] = useState(null);

  const handleExpand = (id) => setFullscreenId(prev => prev === id ? null : id);

  return (
    <section id="skills" className={styles.skills}>
      <div className={styles.inner}>
        {label && (
          <p className={styles.label}>
            <span className={styles.prompt}>&gt; </span>
            &nbsp;{label}
          </p>
        )}

        <div className={styles.stacksContainer}>
          {groups.map((stack, i) => {
            const key = stack.id ?? stack.group ?? i;
            return (
              <div key={key} className={styles.stackWrapper}>
                <Terminal
                  isFullscreen={fullscreenId === key}
                  onExpand={() => handleExpand(key)}
                  data={stack}
                  user={user}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
