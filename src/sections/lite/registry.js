/**
 * ============================================================================
 *  LITE VARIANT REGISTRY - the lite-mode counterpart of src/sections/registry.js
 * ============================================================================
 *
 *  Same variant names, same data shapes, lighter rendering. A section declares
 *  its variant once in src/data/sections/ and both modes pick it up.
 *
 *  A variant missing here simply doesn't render in lite mode, which is the
 *  desired behaviour for heavy variants you don't want on low-power devices.
 */

import LiteLanding from './LiteLanding';
import LiteIntro from './LiteIntro';
import LiteAbout from './LiteAbout';
import LiteProjects from './LiteProjects';
import LiteSkills from './LiteSkills';
import LiteServices from './LiteServices';
import LiteContact from './LiteContact';

export const LITE_VARIANTS = {
  hero: LiteLanding,
  status: LiteIntro,
  bio: LiteAbout,
  showcase: LiteProjects,
  terminal: LiteSkills,
  cards: LiteServices,
  contact: LiteContact,
};

export const resolveLiteVariant = name => LITE_VARIANTS[name] || null;

export default LITE_VARIANTS;
