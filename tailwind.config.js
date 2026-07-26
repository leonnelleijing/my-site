/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,md,mdx}',
    './docs/**/*.{md,mdx}',
    './blog/**/*.{md,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#10113e',
        'ink-navy': '#252753',
        'coral-red': '#FB452A',
        'secondary': '#9f4200',
        'minty-blue': '#A8CDD2',
        'canvas-offwhite': '#F3EFE2',
        'background': '#fdf9ec',
        'surface': '#fdf9ec',
        'surface-container': '#f2eee1',
        'surface-container-low': '#f8f3e6',
        'surface-container-high': '#ece8db',
        'surface-container-highest': '#e6e2d6',
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-surface': '#1c1c14',
        'on-surface-variant': '#46464f',
        'on-primary-container': '#8d8fc1',
        'outline': '#777680',
        'outline-variant': '#c7c5d0',
        'tertiary-fixed-dim': '#c4c0ff',
        'secondary-container': '#fe7110',
      },
      spacing: {
        'container-max': '1200px',
        'margin-mobile': '20px',
        'margin-desktop': '64px',
        'section-gap': '120px',
        'gutter': '24px',
      },
      fontFamily: {
        'display-lg': ['Plus Jakarta Sans', 'sans-serif'],
        'headline-md': ['Plus Jakarta Sans', 'sans-serif'],
        'headline-lg': ['Plus Jakarta Sans', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif'],
        'body-lg': ['Inter', 'sans-serif'],
        'label-md': ['Inter', 'sans-serif'],
        'label-sm': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Prevent Tailwind preflight from breaking Docusaurus defaults
  },
};
