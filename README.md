# pascalre.github.io

My personal portfolio, built with [Astro](https://astro.build) and deployed to GitHub Pages by a GitHub Action.

## Quick start

```bash
npm install
npm run dev       # http://localhost:4321, drafts visible, hot reload
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Edit content

Content lives in YAML under `src/data/`. You don't need to touch any `.astro` file for content changes.

| File | Section |
|---|---|
| `profile.yml` | Name, role, intro, photo, email |
| `links.yml` | Profile links (hero and footer) |
| `about.yml` | "Away from the keyboard" tiles |
| `projects.yml` | Open source projects (star counts load live from GitHub) |
| `experience.yml` | Work history, newest first |
| `skills.yml` | Certifications and tool stack |
| `posts.yml` | Articles published elsewhere, and a fallback for dev.to |

Search for `TODO` to find everything that still needs your input.

- **Photo:** save it as `src/assets/portrait.jpg` (`.png`, `.webp` or `.avif` work too).
  Portrait format 4:5 fits best, at least 1080 px wide. Astro generates optimised AVIF and
  WebP versions at build time. Without a photo, the hero shows your initials.
- **About tiles:** `color` is `sun | mint | rose | sky | lilac`, `size` is `wide | tall | normal`.
  The grid has 4 columns, so order tiles so each row adds up to 4 (wide counts as 2).

## Writing

The writing list merges three sources, newest first, without duplicates:

1. **Posts on this site:** Markdown files in `src/content/blog/`. The file name is the URL
   (`my-post.md` becomes `/blog/my-post/`). `draft: true` shows the post only in `npm run dev`.
2. **dev.to:** imported at build time from the public API. Usernames are set in
   `DEVTO_USERS` in `src/lib/posts.ts`. The workflow rebuilds daily, so new articles appear
   within 24 hours without a commit. If the API is down, the build still succeeds and uses `posts.yml`.
3. **`posts.yml`:** for articles on solace.com, grafana.com and elsewhere.

## Deploy

1. Create a public repository named exactly `pascalre.github.io` and push to `main`.
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and deploys on every push to `main`,
   daily at 05:00 UTC, and on demand from the Actions tab.

## Structure

```
src/
  data/            YAML content
  content/blog/    Markdown posts
  assets/          portrait.jpg (hero photo, optimised at build time)
  components/      Nav, Footer, Portrait, PostList, Socials, Icon
  layouts/         Base.astro (head, fonts, theme toggle)
  lib/             data.ts (YAML loader), posts.ts (merges writing sources)
  pages/           index, blog/index, blog/[...slug], 404
  styles/          global.css
public/            favicon, images
```

Fonts are self-hosted via Fontsource, so no requests go to Google.
