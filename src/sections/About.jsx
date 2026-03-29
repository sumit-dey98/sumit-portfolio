import { motion } from 'framer-motion';
import Button from '../components/Button';
import { BiArrowToLeft, BiLogoGithub, BiLogoLinkedin, BiLogoWhatsapp, BiMapPin } from 'react-icons/bi';
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
              I'm Sumit, a front-end web developer with a focus on interactive UI and creative engineering.
              I care deeply about the intersection of performance and aesthetics - interfaces that don't just
              work, but feel good to use.
            </p>
            <p className={styles.bio}>
              When I'm not shipping code, I'm experimenting with generative art, contributing to open source,
              or reverse-engineering animations I find on the web.
            </p>
            <div className={styles.bio}>
              <div className={styles.location}> 
                <BiMapPin size={22} strokeWidth={2} stroke='var(--accent)' fill='none'/>
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </motion.div>

          <motion.div>
            <motion.div
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
            </motion.div>

            <div className={styles.socials}>
              <div className={styles.links}>
                <Button variant='nofill' href="https://github.com/sumit-dey98" target="_blank" rel="noopener noreferrer" icon={BiLogoGithub} iconSize={22} iconPosition='left'>
                   @sumit-dey98
                </Button>
                <Button variant='nofill' href="https://linkedin.com" target="_blank" rel="noopener noreferrer" icon={BiLogoLinkedin} iconSize={22} iconPosition='left'>
                  Sumit
                </Button>
                <Button variant='nofill' href="https://wa.me/8801717742550" target="_blank" rel="noopener noreferrer" icon={BiLogoWhatsapp} iconSize={22} iconPosition='left'>
                  +880-1717742550
                  </Button>
              </div>
              
            </div>
          </motion.div>
  
        </div>
      </div>
    </section>
  );
}