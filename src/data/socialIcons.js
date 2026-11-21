import { BiLogoGithub, BiLogoLinkedin, BiLogoWhatsapp, BiLink } from 'react-icons/bi';

/**
 * Maps a key from SOCIALS in site.config.js to its icon and display name.
 * Add an entry here when you add a new social; anything unmapped falls back
 * to a generic link icon and its own key, so the UI never breaks.
 */
const ICONS = {
  github: BiLogoGithub,
  linkedin: BiLogoLinkedin,
  whatsapp: BiLogoWhatsapp,
};

const NAMES = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  whatsapp: 'WhatsApp',
};

export const socialIcon = key => ICONS[key] || BiLink;
export const socialName = key => NAMES[key] || key;
