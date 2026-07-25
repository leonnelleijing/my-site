# Frontend (`src`)

This folder contains the React/TSX site source used by Docusaurus for custom pages and components.

Key folders:

- `src/pages/` — Custom pages (e.g., `index.tsx`, `markdown-page.md`).
- `src/components/` — Reusable React components (see `components/HomepageFeatures/`).
- `src/css/` — Custom CSS files applied site-wide.

Development notes:

- The project uses TypeScript; check `tsconfig.json` for compiler settings.
- Edit components in `src/components/` and import them into pages.
- CSS modules are used in some components (e.g., `styles.module.css`).

Running locally:

```bash
yarn start
```

Build:

```bash
yarn build
```
