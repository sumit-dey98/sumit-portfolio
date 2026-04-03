import { CLD_ASSETS } from './cloudinary-urls';

export const PROJECT_ROUTES = {
  connect4: {
    logoSrc: '/projects/connect4/connect4-logo.svg',
    src: '/projects/connect4/connect4.html',
    bgColor: 'var(--surface)',
    url: 'connect4',
  },
  rubiks: {
    logoSrc: '/projects/rubiks/rubiks-logo.svg',
    src: '/projects/rubiks/rubiks.html',
    bgColor: 'var(--surface)',
    url: 'rubiks-cube',
  },
  interior: {
    logoSrc: '/projects/interior/interior-logo.svg',
    src: '/projects/interior/index.html',
    bgColor: '#fff',
    url: 'interior-design-studio',
  },
};

export const SECTIONS = ['landing', 'intro', 'about', 'projects', 'skills', 'services', 'contact'];

export const PROJECTS = [
  {
    id: '01',
    name: 'Connect 4 Game',
    tags: ['React+Vite', 'Zustand', 'GSAP'],
    link: '/project/connect4',
    desc: 'A Connect 4 game with 5-level AI, animated disc drops, customizable board, and multiple game modes. A Connect 4 game with 5-level AI, animated disc drops, customizable board, and multiple game modes. ',
    screens: [CLD_ASSETS.project_connect4_thumb, CLD_ASSETS.project_rubiks_thumb, CLD_ASSETS.project_interior_thumb],
    preview: CLD_ASSETS.project_connect4_thumb,
    mobileSrc: CLD_ASSETS.project_connect4_thumb,
    videoSrc: CLD_ASSETS.project_connect4_preview,
  },
  {
    id: '02',
    name: "Rubik's Cube",
    tags: ['React+Vite', 'Three.js', 'Tailwind'],
    link: '/project/rubiks-cube',
    desc: "A 3D Rubik's Cube with realistic and customizable visuals and interactions, created with React and Three.js.",
    screens: [CLD_ASSETS.project_connect4_thumb, CLD_ASSETS.project_rubiks_thumb, CLD_ASSETS.project_interior_thumb],
    preview: CLD_ASSETS.project_rubiks_thumb,
    mobileSrc: CLD_ASSETS.project_rubiks_thumb,
    videoSrc: CLD_ASSETS.project_rubiks_preview,
  },
  {
    id: '03',
    name: 'Interior Design Studio Clone',
    tags: ['HTML', 'SCSS', 'JavaScript'],
    link: '/project/interior',
    desc: 'A front end demo website with custom scroll animations and responsive layout.',
    screens: [CLD_ASSETS.project_connect4_thumb, CLD_ASSETS.project_rubiks_thumb, CLD_ASSETS.project_interior_thumb],
    preview: CLD_ASSETS.project_interior_thumb,
    mobileSrc: CLD_ASSETS.project_interior_thumb,
    videoSrc: CLD_ASSETS.project_interior_preview,
  },
  {
    id: '04',
    name: 'Motion Design System',
    tags: ['Framer Motion', 'Storybook', 'React'],
    link: null,
    desc: 'A comprehensive animation library with 60+ primitives, used across 3 production products.',
    screens: [CLD_ASSETS.project_connect4_thumb, CLD_ASSETS.project_rubiks_thumb, CLD_ASSETS.project_interior_thumb],
    preview: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80',
    mobileSrc: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',
    videoSrc: null,
  },
];

export const STACKS = [
  {
    id: '01',
    group: 'Core',
    items: {
      'HTML5': '90',
      'CSS3': '90',
      'JS ES6+': '80',
    }
  },
  {
    id: '02',
    group: 'Frameworks',
    items: {
      'React': '80',
      'Next.js': '70',
      'Tailwind': '90',
      'Bootstrap': '70',
    }
  },
  {
    id: '03',
    group: 'Tools',
    items: {
      'Git': '80',
      'Docker': '60',
    }
  },
  {
    id: '04',
    group: 'CMS',
    items: {
      'WordPress': '80',
      'HubSpot': '70',
    }
  },
];

export const SERVICES = [
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
];