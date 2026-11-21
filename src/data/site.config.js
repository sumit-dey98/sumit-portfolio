/**
 * ============================================================================
 *  SITE CONFIG - site-wide identity and metadata.
 * ============================================================================
 *
 *  Per-section content lives in src/data/sections/ - one file per section.
 *  This file holds only what is shared across the whole site.
 */

// -- Branding ----------------------------------------------------------------
export const PERSON = {
  // Logo mark, rendered as `shortName` + `logoSuffix`.
  shortName: 'YOUR',
  logoSuffix: '.DEV',
};

// -- Where to find you -------------------------------------------------------
// Used by the About section's link list. Set a `url` to an empty string
// (or delete the entry) to hide that link everywhere.
export const SOCIALS = {
  github: { label: '@yourhandle', url: 'https://github.com/yourhandle' },
  linkedin: { label: 'Your Name', url: 'https://linkedin.com/in/yourhandle' },
  whatsapp: { label: '+00-0000000000', url: '' },
};

// Ordered list of socials that actually have a URL, so removing one above
// cleanly removes it from every layout.
export const ACTIVE_SOCIALS = Object.entries(SOCIALS)
  .filter(([, s]) => s && s.url)
  .map(([key, s]) => ({ key, ...s }));

// -- Browser / PWA metadata --------------------------------------------------
export const SITE_META = {
  title: 'YOUR.DEV',
  description: 'Portfolio of Your Full Name, front-end web developer.',
  themeColor: '#080810',
};
