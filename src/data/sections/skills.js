/**
 * SKILLS - terminal windows, one per group.
 *
 * variant: 'terminal'
 * Any number of groups, each with any number of items.
 */
export default {
  id: 'skills',
  variant: 'terminal',
  label: 'SKILLS',
  navLabel: 'Skills',
  // Tab icon - see src/data/sectionIcons.jsx for the available names.
  icon: 'pulse',

  data: {
    // Shell username shown in the prompt: `<user>@portfolio:~$`
    user: 'you',
    // `items` maps a label to a proficiency value from 0-100 (bar width).
    groups: [
      {
        id: '01',
        group: 'Core',
        items: { 'HTML5': '90', 'CSS3': '90', 'JS ES6+': '80' },
      },
      {
        id: '02',
        group: 'Frameworks',
        items: { 'React': '80', 'Next.js': '70', 'Tailwind': '90', 'Bootstrap': '70' },
      },
      {
        id: '03',
        group: 'Tools',
        items: { 'Git': '80', 'Docker': '60' },
      },
      {
        id: '04',
        group: 'CMS',
        items: { 'WordPress': '80', 'HubSpot': '70' },
      },
    ],
  },
};
