/**
 * INTRO - short status / positioning statement.
 *
 * variant: 'status'
 * `stats` accepts any number of entries; dividers are inserted between them.
 */
export default {
  id: 'intro',
  variant: 'status',
  label: 'STATUS',
  navLabel: 'Intro',
  // Tab icon - see src/data/sectionIcons.jsx for the available names.
  icon: 'person',

  data: {
    // Set `status` to null to hide the availability badge entirely.
    status: { text: 'Available for work' },
    headlinePrefix: "I'm a developer",
    // Typewriter lines after the prefix.
    typedLines: [
      'building fast, interactive web experiences.',
      'turning ideas into polished interfaces.',
      'obsessing over the details that matter.',
    ],
    body: 'Five years building production React apps, interactive experiences, and the kind of interfaces people actually remember.',
    stats: [
      { val: '5+', key: 'years exp' },
      { val: '42', key: 'projects shipped' },
      { val: '\u221E', key: 'coffee consumed' },
    ],
    // Decorative background lines. Set to 0 to remove them.
    decorLines: 12,
  },
};
