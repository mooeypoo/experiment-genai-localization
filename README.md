# experiment-genai-steps

A small social-style demo application built with Vue 3 and Vite.

The app is intentionally minimal: a single post with comments and a list of users. All data lives in memory and resets on page refresh. The purpose of this repository is to serve as an evolving experiment where each stage of development is captured as a git tag (`step-XX`).

## Quick start

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Building for production

```bash
npm run build
npm run preview   # serves the built output locally
```

The production build outputs static files to `dist/`. These can be deployed to any static hosting provider (Netlify, GitHub Pages, etc.) with no server-side requirements.

## What's inside

- **Vue 3** with the Composition API (vanilla JavaScript, no TypeScript).
- **Vite** as the dev server and build tool.
- **vue-router** with hash-based history so routing works on static hosts.
- An **in-memory data layer** (`src/data/store.js`) seeded from `src/data/seed.json`.
- Two views: a post detail page and a users list.

## Stages

Each major step is tagged as `step-XX`. Check out a tag to see the codebase at that point:

```bash
git checkout step-00
```
