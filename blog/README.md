# Blog

The `blog/` folder contains markdown files for blog posts. Docusaurus will pick up posts from this folder and render them under the blog section.

Post format:

- Use frontmatter to provide metadata such as title, date, tags, and author. Example:

```markdown
---
title: "My post title"
author: Your Name
date: 2026-07-21
tags: [devops, kubernetes]
---

Post content goes here.
```

Previewing posts:

- Run `yarn start` and visit the blog routes in the local dev server to preview drafts.

Recommendations:

- Keep titles and dates accurate; use tags for categorization.
- Use images from `static/img` and reference them as `/img/your-image.png`.
