/**
 * ============================================================================
 *  VARIANT REGISTRY - maps a section's `variant` string to its component.
 * ============================================================================
 *
 *  Variants are interchangeable: any section in src/data/sections/ may declare
 *  any variant here, and the same variant may be used by several sections.
 *
 *  Each variant receives the same props:
 *      { section, data, label, index, total }
 *  where `data` is the section's own `data` object.
 *
 *  Data shape expected by each variant:
 *    hero      { boot, nameLines[], roles[], actions[] }
 *    status    { status|null, headlinePrefix, typedLines[], body, stats[], decorLines }
 *    bio       { headline, headlineAccent, paragraphs[], image, details[] }
 *    showcase  { items[] }
 *    terminal  { user, groups[] }
 *    cards     { items[] }
 *    contact   { headline, headlineAccent, sub, email, socials[], footer }
 *
 *  To add your own variant: build the component, import it, add it below, then
 *  set `variant: 'yourname'` on a section.
 */

import Landing from './Landing';
import Intro from './Intro';
import About from './About';
import Projects from './Projects';
import Skills from './Skills';
import Services from './Services';
import Contact from './Contact';
import SectionNotFound from './SectionNotFound';

export const VARIANTS = {
  hero: Landing,
  status: Intro,
  bio: About,
  showcase: Projects,
  terminal: Skills,
  cards: Services,
  contact: Contact,
};

/** Resolve a variant name to a component, falling back to a visible notice. */
export const resolveVariant = name => VARIANTS[name] || SectionNotFound;

export default VARIANTS;
