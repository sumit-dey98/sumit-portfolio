/**
 * ABOUT - bio, contact details and social links.
 *
 * variant: 'bio'
 * `paragraphs`, `details` and social links are all variable-length.
 */
export default {
  id: 'about',
  variant: 'bio',
  label: 'ABOUT',
  navLabel: 'About',
  // Tab icon - see src/data/sectionIcons.jsx for the available names.
  icon: 'document',

  data: {
    headline: 'I BUILD THINGS',
    headlineAccent: 'THAT FEEL ALIVE.',
    paragraphs: [
      "I'm Your Name, a front-end web developer with a focus on interactive UI and creative engineering. I care deeply about the intersection of performance and aesthetics - interfaces that don't just work, but feel good to use.",
      "When I'm not shipping code, I'm experimenting with generative art, contributing to open source, or reverse-engineering animations I find on the web.",
    ],
    // Portrait. Empty string hides the image frame.
    image: '',
    imageAlt: '',
    // Contact rows. `icon` is one of: 'location', 'mail'.
    // Add, remove or reorder freely.
    details: [
      { icon: 'location', label: 'Location', value: 'Your City, Country' },
      { icon: 'mail', label: 'Email', value: 'you@example.com', href: 'mailto:you@example.com' },
    ],
  },
};
