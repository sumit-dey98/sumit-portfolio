import Button from '../components/Button';
import { BiLogoGithub, BiLogoLinkedin, BiLogoWhatsapp } from 'react-icons/bi';
import { useRevealOnView } from '../hooks/useRevealOnView';
import styles from './About.module.css';

function LocationIcon({ size = 24, color1 = 'var(--accent)', color2 = 'var(--accent)' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size}
      xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
      <path
        opacity="0.5"
        d="M19.7165 20.3624C21.143 19.5846 22 18.5873 22 17.5C22 16.3475 21.0372 15.2961 19.4537 14.5C17.6226 13.5794 14.9617 13 12 13C9.03833 13 6.37738 13.5794 4.54631 14.5C2.96285 15.2961 2 16.3475 2 17.5C2 18.6525 2.96285 19.7039 4.54631 20.5C6.37738 21.4206 9.03833 22 12 22C15.1066 22 17.8823 21.3625 19.7165 20.3624Z"
        fill={color1}
      />
      <g className={styles.bounce}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5 8.51464C5 4.9167 8.13401 2 12 2C15.866 2 19 4.9167 19 8.51464C19 12.0844 16.7658 16.2499 13.2801 17.7396C12.4675 18.0868 11.5325 18.0868 10.7199 17.7396C7.23416 16.2499 5 12.0844 5 8.51464ZM12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"
          fill={color2}
        />
      </g>
    </svg>
  );
}

function MailIcon({ size = 24, color1 = 'var(--accent)', color2 = 'var(--accent)' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.8 4C1.86451 4 1.0468 4.46923 0.544325 5.16792C0.20074 5.64567 0 6.23499 0 6.86667V17.1333C0 18.682 1.21964 20 2.8 20H10.2C10.7523 20 11.2 19.5523 11.2 19C11.2 18.4477 10.7523 18 10.2 18H2.8C2.39214 18 2 17.6466 2 17.1333V7.94766L7.77948 14.3096C8.96986 15.6199 11.0301 15.6199 12.2205 14.3096L18 7.94766V12.1333C18 12.6856 18.4477 13.1333 19 13.1333C19.5523 13.1333 20 12.6856 20 12.1333V6.86667C20 6.235 19.7993 5.64567 19.4557 5.16792C18.9532 4.46923 18.1355 4 17.2 4H2.8ZM9.25983 12.9647L2.9327 6H17.0673L10.7402 12.9647C10.3434 13.4015 9.65662 13.4015 9.25983 12.9647Z"
        fill={color2}
        stroke={color2}
      />
      <path
        className={styles.mailArrow}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.2929 21.2929C17.9024 21.6834 17.9024 22.3166 18.2929 22.7071C18.6834 23.0976 19.3166 23.0976 19.7071 22.7071L22.7071 19.7071C23.0976 19.3166 23.0976 18.6834 22.7071 18.2929L19.7071 15.2929C19.3166 14.9024 18.6834 14.9024 18.2929 15.2929C17.9024 15.6834 17.9024 16.3166 18.2929 16.7071L19.5858 18H15C14.4477 18 14 18.4477 14 19C14 19.5523 14.4477 20 15 20H19.5858L18.2929 21.2929Z"
        fill={color1}
        stroke={color1}
      />
    </svg>
  );
}

export default function About() {
  const textRef = useRevealOnView({ duration: 0.5 });
  const imageRef = useRevealOnView({ duration: 0.5, delay: 0.15 });

  return (
    <section id="about" className={styles.about}>
      <div className={styles.inner}>
        <p className={styles.label}>
          <span className={styles.prompt}>&gt;</span> ABOUT
        </p>

        <div className={styles.layout}>
          <div ref={textRef} className={styles.text}>
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
            <div className={styles.addresses}>
              <div className={styles.location}>
                <LocationIcon size={28} />
                <span>Location: Dhaka, Bangladesh</span>
              </div>
              <div className={styles.location}>
                <MailIcon size={28} />
                <a href="mailto:work.sumit@gmail.com">Email: work.sumit@gmail.com</a>
              </div>
            </div>
          </div>

          <div>
            <div ref={imageRef} className={styles.imageWrap}>
              <div className={styles.imageFrame}>
                <img
                  src="https://i.pravatar.cc/480?img=11"
                  alt="Sumit Hillol Dey"
                  className={styles.image}
                />
                <div className={styles.imageOverlay} />
              </div>
              <div className={styles.imageBorder} />
            </div>

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
          </div>
        </div>
      </div>
    </section>
  );
}