import { motion } from 'framer-motion';
import { useState } from 'react';
import Terminal from '../components/Terminal';
import styles from './Skills.module.css';

const STACKS = [
  {
    id: '01',
    group: 'Core',
    items: {
      'HTML5': '90',
      'CSS3': '90',
      'JS ES6+': '80',
    }
  },
  {
    id: '02',
    group: 'Frameworks',
    items: {
      'React': '80',
      'Next.js': '70',
      'Tailwind': '90',
      'Bootstrap': '70',
    }
  },
  {
    id: '03',
    group: 'Tools',
    items: {
      'Git': '80',
      'Docker': '60',
    }
  },
  {
    id: '04',
    group: 'CMS',  
    items: {
      'WordPress': '80',
      'HubSpot': '70',
    }
  },
];

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

        <motion.div className={styles.stacksContainer}>
          {STACKS.map((stack) => (
            <div key={stack.id} className={styles.stackWrapper}>
              <Terminal
                isFullscreen={fullscreenId === stack.id}
                onExpand={() => handleExpand(stack.id)}
                data={stack}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
