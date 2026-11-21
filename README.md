# Portfolio Template

An animated, themeable single-page portfolio template built with React + Vite.
Fork it, edit two files, and it's yours.

Originally built as [Sumit Hillol Dey](https://github.com/sumit-dey98)'s personal
portfolio, now generalised into a reusable template.

---

## Quick start

```bash
npm install
npm run dev
```

Then edit the data files — no component code required:

| File | What lives there |
| --- | --- |
| [`src/data/sections/`](src/data/sections/) | One file per section: its content, and which variant renders it |
| [`src/data/sections/index.js`](src/data/sections/index.js) | Which sections exist, and in what order |
| [`src/data/site.config.js`](src/data/site.config.js) | Site-wide identity: logo, socials, browser/PWA metadata |
| [`src/data/routes.js`](src/data/routes.js) | Optional standalone project pages |

No component contains a name, an email, a label, or a hardcoded count.

---

## 1. Sections

The site is a list of sections. Each one is a data file that declares a
**variant** — the component that renders it:

```js
// src/data/sections/skills.js
export default {
  id: 'skills',
  variant: 'terminal',   // which component renders this section
  label: 'SKILLS',       // the "> SKILLS" eyebrow
  navLabel: 'Skills',    // the nav / tab label
  icon: 'pulse',         // the tab icon
  data: { /* whatever this variant needs */ },
};
```

`src/data/sections/index.js` controls what exists and in what order:

```js
export const SECTIONS = [landing, intro, about, projects, skills, services, contact];
```

**Remove a section** by deleting its line. **Add one** by creating a file and
importing it. **Reorder** by moving lines. Navigation, tab bars, section
numbering (`03 / 06`), scroll spying and the lite-mode rail are all derived from
this array — nothing is hand-maintained, and no component assumes a fixed count
or position.

### Variants

Seven variants ship, and they are **interchangeable** — any section may use any
variant, and the same variant may be used more than once:

| Variant | Renders | Expects |
| --- | --- | --- |
| `hero` | Full-screen landing | `boot`, `nameLines[]`, `roles[]`, `actions[]` |
| `status` | Status + stats | `status`, `headlinePrefix`, `typedLines[]`, `body`, `stats[]` |
| `bio` | Bio, portrait, contact rows | `headline`, `paragraphs[]`, `image`, `details[]` |
| `showcase` | Project listing | `items[]` |
| `terminal` | Terminal windows per skill group | `user`, `groups[]` |
| `cards` | Stacked service cards | `items[]` |
| `contact` | Closing call to action | `headline`, `sub`, `email`, `socials[]`, `footer` |

Every list is variable-length. Three stats or seven, two projects or twenty,
one skill group or ten — the layouts read the count from the data.

Want two card sections? Point two section files at `variant: 'cards'`. A section
naming a variant that doesn't exist renders a visible notice instead of breaking
the page.

To build your own variant: write the component, register it in
[`src/sections/registry.js`](src/sections/registry.js) (and optionally
[`src/sections/lite/registry.js`](src/sections/lite/registry.js) for lite mode),
then set `variant: 'yourname'` on a section.

---

## 2. Themes

Ten built-in themes live in [`src/theme/themes.js`](src/theme/themes.js):
`dark`, `light`, `cyber`, `arctic`, `solar`, `ash`, `matrix`, `amber`,
`crimson`, `indigo`. Visitors switch between them from the settings panel.

Add your own by appending an entry - each theme is just a set of CSS variables:

```js
mytheme: {
  label: 'MY THEME',
  icon: BsHexagonFill,
  vars: {
    '--bg': '#080810',      '--surface': '#0E0E1A',
    '--border': '#1A1A2E',  '--accent': '#5227FF',
    '--accent2': '#00FFCC', '--dim': '#7A7AAD',
    '--muted': '#6A6A88',   '--text': '#E0E0F0',
    '--text-dim': '#A4A4CA',
  },
},
```

Every component reads these variables, so a new theme restyles the whole site.

---

## 3. Layouts and modes

The site renders one of three layouts:

| Layout | When |
| --- | --- |
| [`DesktopLayout`](src/templates/DesktopLayout.jsx) | Wide screens - full experience |
| [`MobileLayout`](src/templates/MobileLayout.jsx) | Small screens - bottom-sheet tabs |
| [`LiteLayout`](src/templates/LiteLayout.jsx) | When the visitor chooses lite mode |

Desktop vs. mobile is picked from the viewport. **Lite mode** is a visitor
choice, stored in `localStorage` under `portfolio-prefs` (see
[`useUserPrefs`](src/hooks/useUserPrefs.js)) and offered in the settings panel.

Lite mode is a lighter build of the same content - no custom cursor, no dot
grid, no looping typewriter, simpler animations. Useful for low-power devices or
visitors who prefer reduced motion. Its sections live in
[`src/sections/lite/`](src/sections/lite/) and read from the same config, so
editing `site.config.js` updates both versions at once.

---

## 4. Media

By default all media is served from `/public` - no accounts required. What
ships with the template:

```
public/
  placeholders/project-01..03.svg   generic project thumbnails
  projects/demo/demo.html           the embedded demo project page
  Icon.svg  Logo.svg  fonts/        branding and typefaces - swap freely
```

Drop your own images and videos into `/public` and point `preview`,
`mobileSrc`, `screens` and `videoSrc` in `src/data/sections/projects.js` at them. `videoSrc` is
optional - leave it as `''` and the card simply shows the still image.

Optionally, you can host media on Cloudinary:

1. `cp .env.example .env` and fill in your Cloudinary credentials.
2. Point `IMAGES_DIRS` in `cloudinaryUrlsGenerator.js` at your local folders.
3. Run `node cloudinaryUrlsGenerator.js` to generate `src/data/cloudinary-urls.js`.
4. Import `CLD_ASSETS` in `src/data/sections/projects.js` and use those URLs
   instead of `/public` paths.

The script refuses to run with a clear message if credentials are missing, and
the site works fine without it. **Never commit your `.env`** - it is gitignored.

---

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |

---

## Deploying

The included `vercel.json` sets up SPA rewrites for Vercel. Any static host
works - build with `npm run build` and serve `dist/`, with a rewrite sending all
routes to `index.html` so the project pages resolve.

`@vercel/analytics` and `@vercel/speed-insights` are wired up in `App.jsx`; they
no-op off Vercel, and can be removed if you don't want them.

---

## Tech

React 19 + Vite, GSAP and Motion for animation, Lenis for smooth scroll,
Flickity for carousels, React Icons, React Router. Styling is CSS Modules with
CSS custom properties for theming.

### Custom components

- **Genie** - the loader animation
- **Button** - background wipe animation
- **SvgButton** - animated SVG border
- **Terminal** - expandable macOS-style terminal used by the Skills section
- **ThemeSwitcher** - dropdown and panel variants
- **DotGrid** - interactive dot field (from React Bits)

### Custom hooks

- **useCursor** - custom dot and ring pointer
- **useTypewriter** - typewriter effect
- **useDecryptedText** - scramble-to-reveal text (adapted from React Bits)
- **useTheme** - theme switching, plus `getCssVar()` to read theme variables

---

## Credits

Template by [Sumit Hillol Dey](https://github.com/sumit-dey98).
Component inspiration from [React Bits](https://reactbits.dev).

If you use this, a link back is appreciated but not required.
