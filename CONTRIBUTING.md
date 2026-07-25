# Contributing & Deployment

Thank you for contributing! This file contains basics for contributing, building and deploying the site.

Contribution workflow:

1. Fork the repository and create a topic branch for your changes.
2. Make changes and run `yarn start` locally to preview.
3. Open a pull request describing the change.

Formatting & checks:

- Keep markdown readable and use frontmatter for docs/blog posts.
- If you add code, ensure TypeScript type checks and linting (if configured).

Build locally:

```bash
yarn
yarn build
```

Deploying the site

There are two common ways to deploy (the project uses the standard Docusaurus deploy script):

- Using SSH (recommended if you have push access):

```bash
USE_SSH=true yarn deploy
```

- Using HTTPS (specify your GitHub username):

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

Notes:

- The deploy command builds the site and pushes the finished static site to the `gh-pages` branch (if configured for GH Pages).
- Ensure the repo `package.json` has the correct `homepage` or `url` settings if you host on GitHub Pages or another platform.

If you want, I can add a CI workflow (GitHub Actions) to build and deploy automatically on merges to `main`.
