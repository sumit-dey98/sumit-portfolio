/**
 * ============================================================================
 *  PROJECT ROUTES - optional standalone pages for individual projects.
 * ============================================================================
 *
 *  Each entry renders at /project/<url> automatically - no App.jsx edit needed.
 *  Link to one from a project's `link` field in src/data/sections/projects.js.
 *
 *  `src` may be a file in /public or the full URL of a deployed site; it is
 *  shown in an embedded frame.
 *
 *  Delete every entry to remove standalone project pages entirely; the routes
 *  disappear with them.
 */
export const PROJECT_ROUTES = {
  demo: {
    logoSrc: '/Logo.svg',
    src: '/projects/demo/demo.html',
    bgColor: 'var(--surface)',
    url: 'demo-project',
  },
};

export default PROJECT_ROUTES;
