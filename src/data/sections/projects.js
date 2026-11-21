/**
 * PROJECTS - the project showcase.
 *
 * variant: 'showcase'
 * Any number of projects; each project's `screens` list is also variable-length.
 */
export default {
  id: 'projects',
  variant: 'showcase',
  label: 'PROJECTS',
  navLabel: 'Projects',
  // Tab icon - see src/data/sectionIcons.jsx for the available names.
  icon: 'grid',

  data: {
    // `desc` accepts a string or an array of strings (one paragraph each).
    // `link` may be '/project/<url>' (see routes.js) or any external URL.
    // `videoSrc` is optional - leave it '' to show the still image only.
    items: [
      {
        id: '01',
        name: 'Project One',
        tags: ['React', 'Vite', 'GSAP'],
        link: '/project/demo-project',
        desc: 'A short description of what this project is and what makes it interesting. Two or three sentences works best in the card layout.',
        screens: [
          '/placeholders/project-01.svg',
          '/placeholders/project-02.svg',
          '/placeholders/project-03.svg',
        ],
        preview: '/placeholders/project-01.svg',
        mobileSrc: '/placeholders/project-01.svg',
        videoSrc: '',
      },
      {
        id: '02',
        name: 'Project Two',
        tags: ['React', 'Three.js', 'Tailwind'],
        link: 'https://example.com',
        desc: 'Another project. Swap these placeholders for your own work - add or remove entries freely, the layouts adapt to the list length.',
        screens: [
          '/placeholders/project-02.svg',
          '/placeholders/project-03.svg',
        ],
        preview: '/placeholders/project-02.svg',
        mobileSrc: '/placeholders/project-02.svg',
        videoSrc: '',
      },
      {
        id: '03',
        name: 'Project Three',
        tags: ['HTML', 'SCSS', 'JavaScript'],
        link: 'https://example.com',
        desc: [
          'Use an array when you want multiple paragraphs on the project detail view.',
          'Each string becomes its own paragraph. Keep the first one punchy - it is what most visitors will actually read.',
        ],
        screens: ['/placeholders/project-03.svg'],
        preview: '/placeholders/project-03.svg',
        mobileSrc: '/placeholders/project-03.svg',
        videoSrc: '',
      },
    ],
  },
};
