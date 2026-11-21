import Button from '../../components/Button';
import { ACTIVE_SOCIALS } from '../../data/site.config';
import { socialIcon } from '../../data/socialIcons';
import { IoLocationOutline, IoMailOutline } from 'react-icons/io5';
import LiteSection from './LiteSection';
import styles from './LiteAbout.module.css';

/** Icons available to `details[].icon` in the section data. */
const DETAIL_ICONS = {
  location: IoLocationOutline,
  mail: IoMailOutline,
};

/** Lite variant: 'bio'. Data shape matches src/data/sections/about.js. */
export default function LiteAbout({ data = {}, label, index, total }) {
  const {
    headline = '',
    headlineAccent = '',
    paragraphs = [],
    image = '',
    imageAlt = '',
    details = [],
  } = data;

  const hasSide = Boolean(image) || details.length > 0 || ACTIVE_SOCIALS.length > 0;

  return (
    <LiteSection index={index} total={total} label={label} className={styles.section}>
      <div className={styles.layout}>
        <div className={styles.text}>
          {(headline || headlineAccent) && (
            <h2 className={styles.headline}>
              {headline}
              {headline && headlineAccent && <br />}
              {headlineAccent && <span className={styles.accent}>{headlineAccent}</span>}
            </h2>
          )}

          {paragraphs.map((para, i) => (
            <p key={i} className={styles.bio}>{para}</p>
          ))}
        </div>

        {hasSide && (
          <div className={styles.side}>
            {image && (
              <div className={styles.imageWrap}>
                <div className={styles.imageFrame}>
                  <img src={image} alt={imageAlt} className={styles.image} />
                  <div className={styles.imageOverlay} />
                </div>
                <div className={styles.imageBorder} />
              </div>
            )}

            {details.length > 0 && (
              <div className={styles.contact}>
                {details.map((detail, i) => {
                  const Icon = DETAIL_ICONS[detail.icon];
                  return (
                    <div key={i} className={styles.contactRow}>
                      {Icon && (
                        <Icon size={22} className={styles.contactIcon} strokeWidth={2} />
                      )}
                      {detail.href
                        ? <a href={detail.href}>{detail.value}</a>
                        : <span>{detail.value}</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {ACTIVE_SOCIALS.length > 0 && (
              <div className={styles.links}>
                {ACTIVE_SOCIALS.map(social => (
                  <Button
                    key={social.key}
                    variant="nofill"
                    href={social.url}
                    icon={socialIcon(social.key)}
                    iconSize={20}
                    iconPosition="left"
                  >
                    {social.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </LiteSection>
  );
}
