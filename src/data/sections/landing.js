/**
 * LANDING - the full-screen hero.
 *
 * variant: 'hero'
 * Any number of `nameLines` and `roles` - the animation adapts to the count.
 */
export default {
  id: 'landing',
  variant: 'hero',
  navLabel: 'Home',
  // The landing is the entry screen, not a nav tab.
  showInNav: false,

  data: {
    // Scramble-decrypt text above the name.
    boot: 'INITIALIZING PORTFOLIO...',
    // One array entry per line of the hero headline.
    nameLines: ['YOUR', 'FULL', 'NAME'],
    // Typewriter lines under the name.
    roles: ['Front-end web developer'],
    // Buttons. Remove an entry to remove the button.
    // `action` can be 'projects' (scroll to projects) or omitted when `href` is set.
    actions: [
      { label: 'VIEW CV', href: '', style: 'fill' },
      { label: 'VIEW PROJECTS', action: 'projects', style: 'svg' },
    ],
  },
};
