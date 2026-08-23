import LiteSection from './LiteSection';
import { STACKS } from '../../data/data';
import styles from './LiteSkills.module.css';

export default function LiteSkills() {
  return (
    <LiteSection index={4} label="SKILLS" className={styles.section}>
      <div className={styles.grid}>
        {STACKS.map((stack) => (
          <div key={stack.id} className={styles.group}>
            <div className={styles.groupHead}>
              <span className={styles.groupNum}>{stack.id}</span>
              <span className={styles.groupName}>{stack.group}</span>
            </div>

            <ul className={styles.items}>
              {Object.entries(stack.items).map(([name, level]) => (
                <li key={name} className={styles.item}>
                  <span className={styles.itemTop}>
                    <span className={styles.itemName}>{name}</span>
                    <span className={styles.itemLevel}>{level}%</span>
                  </span>
                  <span className={styles.bar}>
                    <span className={styles.barFill} style={{ width: `${level}%` }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </LiteSection>
  );
}
