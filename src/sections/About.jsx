import { motion } from 'framer-motion';
import styles from './About.module.css';

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.inner}>
        <p className={styles.label}>
          <span className={styles.prompt}>&gt;</span> ABOUT
        </p>

        <div className={styles.layout}>
          <motion.div
            className={styles.text}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.headline}>
              I BUILD THINGS<br />
              <span className={styles.accent}>THAT FEEL ALIVE.</span>
            </h2>
            <p className={styles.bio}>
              I'm Sumit, a full-stack web developer with a focus on interactive UI and creative engineering.
              I care deeply about the intersection of performance and aesthetics — interfaces that don't just
              work, but feel good to use.
            </p>
            <p className={styles.bio}>
              When I'm not shipping code, I'm experimenting with generative art, contributing to open source,
              or reverse-engineering animations I find on the web.
            </p>

            <div className={styles.links}>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
                <span className={styles.linkArrow}>→</span> GitHub
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
                <span className={styles.linkArrow}>→</span> LinkedIn
              </a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.link}>
                <span className={styles.linkArrow}>→</span> Resume
              </a>
            </div>
          </motion.div>

          {/* <motion.div
            className={styles.imageWrap}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className={styles.imageFrame}>
              <img
                src="https://i.pravatar.cc/480?img=11"
                alt="Sumit Hillol Dey"
                className={styles.image}
              />
              <div className={styles.imageOverlay} />
            </div>
            <div className={styles.imageBorder} />
          </motion.div> */}
        </div>
      </div>
    </section>
  );
}