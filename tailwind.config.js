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
        "headline-lg-mobile": ["Bricolage Grotesque"],
        "headline-xl": ["Bricolage Grotesque"],
        "headline-lg": ["Bricolage Grotesque"],
        "label-sm": ["JetBrains Mono"],
        "body-md": ["Hanken Grotesk"]
      },
      fontSize: {
        "headline-lg-mobile": ["28px", { lineHeight: "34px", fontWeight: "700" }],
        "headline-xl": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }]
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Prevent Tailwind preflight from breaking Docusaurus defaults
  },
};
