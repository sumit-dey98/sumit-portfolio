/**
 * SERVICES - a stack of cards.
 *
 * variant: 'cards'
 * Any number of cards; the scroll/stack maths is derived from the count.
 */
export default {
  id: 'services',
  variant: 'cards',
  label: 'WHAT I OFFER',
  navLabel: 'Services',
  // Tab icon - see src/data/sectionIcons.jsx for the available names.
  icon: 'layers',

  data: {
    items: [
      {
        id: '01',
        title: 'UI / UX Design',
        desc: 'Pixel-perfect interfaces crafted with intention. From wireframes to high-fidelity prototypes, every interaction is considered.',
        tags: ['Figma', 'Prototyping', 'Design Systems'],
      },
      {
        id: '02',
        title: 'Frontend Development',
        desc: 'Performant, accessible, and animated web experiences built with modern tooling. React, GSAP, and everything in between.',
        tags: ['React', 'TypeScript', 'GSAP'],
      },
      {
        id: '03',
        title: 'Motion Design',
        desc: 'Scroll-linked animations, page transitions, and micro-interactions that breathe life into static layouts.',
        tags: ['Framer Motion', 'Lenis', 'Three.js'],
      },
      {
        id: '04',
        title: 'Creative Direction',
        desc: 'End-to-end visual strategy - brand identity, typography systems, and cohesive design languages that scale.',
        tags: ['Branding', 'Typography', 'Art Direction'],
      },
    ],
  },
};
