import { resolveVariant } from './registry';
import { resolveLiteVariant } from './lite/registry';
import { SECTIONS, NAV_SECTIONS } from '../data/sections';

/**
 * Renders one section by looking up its variant in the registry.
 *
 * Every variant receives the same props, so a section's data shape - not the
 * layout - decides what appears. `index`/`total` describe the section's place
 * in the nav, for "03 / 06" style counters.
 */
export function renderSection(section, extraProps = {}) {
  const Component = resolveVariant(section.variant);
  const navIndex = NAV_SECTIONS.findIndex(s => s.id === section.id);

  return (
    <Component
      key={section.id}
      section={section}
      data={section.data}
      label={section.label}
      index={navIndex === -1 ? null : navIndex + 1}
      total={NAV_SECTIONS.length}
      {...extraProps}
    />
  );
}

/**
 * Builds the { id: element } map the layouts consume, covering every nav
 * section in data order. Adding or removing a section in
 * src/data/sections/index.js flows through here automatically.
 */
export function buildSectionElements(extraPropsById = {}) {
  return NAV_SECTIONS.reduce((acc, section) => {
    acc[section.id] = renderSection(section, extraPropsById[section.id]);
    return acc;
  }, {});
}

/**
 * Lite-mode counterpart of buildSectionElements. Covers every section - the
 * landing included, since lite mode scrolls through it rather than using it as
 * a separate entry screen. A variant with no lite implementation is skipped.
 */
export function buildLiteSectionElements() {
  return SECTIONS.reduce((acc, section) => {
    const Component = resolveLiteVariant(section.variant);
    if (!Component) return acc;

    const navIndex = NAV_SECTIONS.findIndex(s => s.id === section.id);
    acc[section.id] = (
      <Component
        key={section.id}
        section={section}
        data={section.data}
        label={section.label}
        index={navIndex === -1 ? null : navIndex + 1}
        total={NAV_SECTIONS.length}
      />
    );
    return acc;
  }, {});
}
