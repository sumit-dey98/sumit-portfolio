import { motion } from 'framer-motion';
import Button from '../components/Button';
import { BiArrowToLeft, BiLogoGithub, BiLogoLinkedin, BiLogoWhatsapp, BiMapPin } from 'react-icons/bi';
import styles from './About.module.css';

function LocationIcon({ size = 24, color1 = 'var(--accent)', color2 = 'var(--accent)' }) {
  return (
    <svg viewBox="0 0 24 24" id="locationIcon" fill="none" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <path
        opacity="0.5"
        d="M19.7165 20.3624C21.143 19.5846 22 18.5873 22 17.5C22 16.3475 21.0372 15.2961 19.4537 14.5C17.6226 13.5794 14.9617 13 12 13C9.03833 13 6.37738 13.5794 4.54631 14.5C2.96285 15.2961 2 16.3475 2 17.5C2 18.6525 2.96285 19.7039 4.54631 20.5C6.37738 21.4206 9.03833 22 12 22C15.1066 22 17.8823 21.3625 19.7165 20.3624Z"
        fill={color1}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        className={styles.bounce}
        d="M5 8.51464C5 4.9167 8.13401 2 12 2C15.866 2 19 4.9167 19 8.51464C19 12.0844 16.7658 16.2499 13.2801 17.7396C12.4675 18.0868 11.5325 18.0868 10.7199 17.7396C7.23416 16.2499 5 12.0844 5 8.51464ZM12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"
        fill={color2}
      />
    </svg>
  );
}

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
            <div className={styles.location}>
              {/* <BiMapPin size={22} strokeWidth={2} stroke='var(--accent)' fill='none' /> */}
              <LocationIcon size={28} />
              <span>Location: Dhaka, Bangladesh</span>
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