import Button from '../../components/Button';
import { BiLogoGithub, BiLogoLinkedin, BiLogoWhatsapp } from 'react-icons/bi';
import { IoLocationOutline, IoMailOutline } from 'react-icons/io5';
import LiteSection from './LiteSection';
import styles from './LiteAbout.module.css';

export default function LiteAbout() {
  return (
    <LiteSection index={2} label="ABOUT" className={styles.section}>
      <div className={styles.layout}>
        <div className={styles.text}>
          <h2 className={styles.headline}>
            I BUILD THINGS<br />
            <span className={styles.accent}>THAT FEEL ALIVE.</span>
          </h2>

          <p className={styles.bio}>
            I'm Sumit, a front-end web developer with a focus on interactive UI and creative
            engineering. I care deeply about the intersection of performance and aesthetics —
            interfaces that don't just work, but feel good to use.
          </p>
          <p className={styles.bio}>
            When I'm not shipping code, I'm experimenting with generative art, contributing to
            open source, or reverse-engineering animations I find on the web.
          </p>
        </div>

        <div className={styles.side}>
          <div className={styles.imageWrap}>
            <div className={styles.imageFrame}>
              <img src="" alt="Sumit Hillol Dey" className={styles.image} />
              <div className={styles.imageOverlay} />
            </div>
            <div className={styles.imageBorder} />
          </div>

          <div className={styles.contact}>
            <div className={styles.contactRow}>
              <IoLocationOutline size={22} className={styles.contactIcon} strokeWidth={3} />
              <span>Dhaka, Bangladesh</span>
            </div>
            <div className={styles.contactRow}>
              <IoMailOutline size={22} className={styles.contactIcon} strokeWidth={2} />
              <a href="mailto:work.sumit@gmail.com">work.sumit@gmail.com</a>
            </div>
          </div>

          <div className={styles.links}>
            <Button variant="nofill" href="https://github.com/sumit-dey98" icon={BiLogoGithub} iconSize={20} iconPosition="left">
              @sumit-dey98
            </Button>
            <Button variant="nofill" href="https://linkedin.com" icon={BiLogoLinkedin} iconSize={20} iconPosition="left">
              Sumit
            </Button>
            <Button variant="nofill" href="https://wa.me/8801717742550" icon={BiLogoWhatsapp} iconSize={20} iconPosition="left">
              +880-1717742550
            </Button>
          </div>
        </div>
      </div>
    </LiteSection>
  );
}
