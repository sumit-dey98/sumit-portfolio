/**
 * ============================================================================
 *  SECTIONS - what the site is made of, and in what order.
 * ============================================================================
 *
 *  To REMOVE a section: delete its line from the array below.
 *  To ADD one:          create a file in this folder, import it, add it here.
 *  To REORDER:          move the lines around.
 *
 *  Nothing else needs changing. Navigation, tab lists, section numbering
 *  ("03 / 06") and scroll behaviour are all derived from this array.
 *
 *  Each section declares a `variant` naming the component that renders it.
 *  Variants are interchangeable - any section may use any variant, and the
 *  same variant may be used by several sections. See src/sections/registry.js
 *  for the available variants and the data shape each one expects.
 */

import landing from './landing';
import intro from './intro';
import about from './about';
import projects from './projects';
import skills from './skills';
import services from './services';
import contact from './contact';

export const SECTIONS = [
  landing,
  intro,
  about,
  projects,
  skills,
  services,
  contact,
];

// -- Derived helpers ---------------------------------------------------------
// Everything below is computed from SECTIONS. Don't hand-maintain these.

/** Sections that appear as navigable tabs (i.e. everything but the landing). */
export const NAV_SECTIONS = SECTIONS.filter(s => s.showInNav !== false);

/** Ordered ids, e.g. ['landing', 'intro', ...]. */
export const SECTION_IDS = SECTIONS.map(s => s.id);

/** Ordered nav ids, excluding non-nav sections. */
export const NAV_IDS = NAV_SECTIONS.map(s => s.id);

/** Look up a section by id. */
export const getSection = id => SECTIONS.find(s => s.id === id);

/**
 * 1-based position of a section within the nav, and the nav total - used for
 * the "03 / 06" counters. Returns null for sections outside the nav.
 */
export const getSectionIndex = id => {
  const i = NAV_SECTIONS.findIndex(s => s.id === id);
  return i === -1 ? null : { index: i + 1, total: NAV_SECTIONS.length };
};

export default SECTIONS;
