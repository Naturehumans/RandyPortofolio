/** @type {import('tailwindcss').Config} */
// Semua warna memetakan CSS variables dari src/styles/tokens.css
// (single source of truth — DESIGN.md §2). Jangan hardcode hex di sini.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--c-bg)',
        raised: 'var(--c-raised)',
        sunken: 'var(--c-sunken)',
        ink: 'var(--c-ink)',
        muted: 'var(--c-muted)',
        accent: 'var(--c-accent)',
        'accent-soft': 'var(--c-accent-soft)',
        ochre: 'var(--c-ochre)',
        forest: 'var(--c-forest)',
        leaf: 'var(--c-leaf)',
        moss: 'var(--c-moss)',
        line: 'var(--c-line)',
        'on-forest': 'var(--c-on-forest)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        wrap: '72rem',
      },
      boxShadow: {
        float: 'var(--shadow-float)',
      },
      transitionTimingFunction: {
        organic: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
