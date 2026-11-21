/**
 * CONTACT - closing call to action.
 *
 * variant: 'contact'
 * `socials` is variable-length; separators are inserted between entries.
 */
export default {
  id: 'contact',
  variant: 'contact',
  label: 'CONTACT',
  navLabel: 'Contact',
  // Tab icon - see src/data/sectionIcons.jsx for the available names.
  icon: 'chat',

  data: {
    headline: "LET'S WORK",
    headlineAccent: 'TOGETHER.',
    sub: 'Open to freelance projects, full-time roles, and interesting collabs.',
    // Shown in the copy-to-clipboard button. Empty string hides the button.
    email: 'you@example.com',
    // `icon` is optional and maps to src/data/socialIcons.js.
    socials: [
      { icon: 'github', label: 'GitHub', url: 'https://github.com/yourhandle' },
      { icon: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/yourhandle' },
    ],
    // Footer line. `{year}` is replaced with the current year.
    footer: '© YOUR FULL NAME | {year}',
  },
};
