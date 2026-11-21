import LiteSection from './LiteSection';
import styles from './LiteSkills.module.css';

/** Lite variant: 'terminal'. Data shape matches src/data/sections/skills.js. */
export default function LiteSkills({ data = {}, label, index, total }) {
  const { groups = [] } = data;

  return (
    <LiteSection index={index} total={total} label={label} className={styles.section}>
      <div className={styles.grid}>
        {groups.map((stack, i) => (
          <div key={stack.id ?? stack.group ?? i} className={styles.group}>
            <div className={styles.groupHead}>
              <span className={styles.groupNum}>{stack.id ?? String(i + 1).padStart(2, '0')}</span>
              <span className={styles.groupName}>{stack.group}</span>
            </div>

            <ul className={styles.items}>
              {Object.entries(stack.items || {}).map(([name, level]) => (
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
