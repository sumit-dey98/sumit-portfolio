import {
  IoPersonOutline,
  IoDocumentTextOutline,
  IoGridOutline,
  IoPulseOutline,
  IoLayersOutline,
  IoChatbubbleOutline,
  IoEllipseOutline,
} from 'react-icons/io5';

/**
 * Icons available to a section's `icon` field in src/data/sections/.
 * Add your own here; an unmapped name falls back to a neutral circle so a
 * typo never breaks the tab bar.
 */
const ICONS = {
  person: IoPersonOutline,
  document: IoDocumentTextOutline,
  grid: IoGridOutline,
  pulse: IoPulseOutline,
  layers: IoLayersOutline,
  chat: IoChatbubbleOutline,
};

export const sectionIcon = (name, size = 22) => {
  const Icon = ICONS[name] || IoEllipseOutline;
  return <Icon size={size} />;
};

export default ICONS;
