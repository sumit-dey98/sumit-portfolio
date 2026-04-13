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
  greenfield: {
    logoSrc: '/projects/greenfield/greenfield-logo.svg',
    src: 'https://greenfield-academy-project.vercel.app/',
    bgColor: 'var(--surface)',
    url: 'greenfield',
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
    name: 'School Management Demo',
    tags: ['React', 'Next.JS', 'Tailwind', 'Supabase'],
    link: '/project/greenfield',
    desc: [
      "A full-stack school website and management system built with Next.js, Tailwind CSS, and Supabase. Includes a public-facing website and three role-based portals for students, teachers, and administrators, each with their own dashboard and data access.",
      "Students can view their results, attendance records, class schedule, and personal profile. Teachers have access to their assigned class, student list with subject-specific performance, weekly timetable, and attendance management. Admins get a complete overview with CRUD operations across students, teachers, classes, schedules, results, notices, and announcements. ",
       "Features a superadmin layer backed by real Supabase Auth for write operations and a custom component library. The UI supports light and dark mode with system preference detection and is fully responsive.",
    ],
    screens: [CLD_ASSETS.greenfield_screen_home,
    CLD_ASSETS.greenfield_screen_adminDash,
    CLD_ASSETS.greenfield_screen_login,
    CLD_ASSETS.greenfield_screen_studentDash,
    CLD_ASSETS.greenfield_screen_teacherDash,
    CLD_ASSETS.greenfield_screen_homeDark,
    CLD_ASSETS.greenfield_screen_studentDashDark,
    CLD_ASSETS.greenfield_screen_teacherDashDark,
    CLD_ASSETS.greenfield_screen_adminDashDark,
    ],
    preview: CLD_ASSETS.greenfield_screen_home,
    mobileSrc: CLD_ASSETS.greenfield_screen_home,
    videoSrc: CLD_ASSETS.project_greenfield_preview,
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