# experiment-genai-steps

A small GenAI incremental localization experiment built with Vue 3 and Vite,
developed across multiple steps driven by an AI coding agent.

The app itself is intentionally minimal: a single social-style post with
comments and a list of users. All data lives in memory and resets on page
refresh. The repository is an experiment in observing how AI-assisted
development evolves a codebase over many guided steps.

---

## Running locally (the Vue app)

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview   # serves the built output locally
```

The production build outputs static files to `dist/`. It can be deployed to
any static hosting provider with no server-side requirements.

---

## Step viewer and build pipeline

A **standalone viewer** and build pipeline live under `viewer/`. The viewer is a Vue 3 app that lists steps, shows each step’s app in an iframe, and displays docs (notes/prompt) in a side panel. It can be extracted into its own repo and vendored back via git subtree.

### Build and preview

```bash
npm run build:pages    # generates site/ at repo root
npm run preview:pages  # serves site/ (e.g. npx serve site)
```

After `build:pages`, open the URL from `preview:pages` (e.g. `http://localhost:3000`). Use **hash routing**: `/#/` (home), `/#/about`, `/#/view/step-01`.

### Integrated vs standalone mode

- **Integrated mode** (this repo with step sources): The build script discovers steps via git tags (`step-01`, `step-02`, …) or `step-XX` folders in the repo root. It builds each step’s app (worktree + `vite build` for tags, or build from step folders), renders `docs/agent-notes/XX.md` and `docs/prompts/step-XX.md` (or `XX.md`) to HTML, and emits `site/steps.json` and `site/step-XX/`.
- **Standalone mode** (viewer extracted, no step sources): If no steps are found, the script generates **mock** step artifacts (`site/step-01/`, `site/step-02/`) and a mock `steps.json` so you can run and test the viewer in isolation.

### Viewer layout

- **Home** (`/#/`): Fetches `./steps.json`, shows a list of steps; each link goes to `/#/view/step-XX`.
- **Step view** (`/#/view/:step`): Iframe `src` is `./<stepId>/` (relative). Docs panel loads `./<stepId>/notes.html` and `./<stepId>/prompt.html` (fallback if missing).
- **About** (`/#/about`): Fetches `./viewer-config.json` and shows site title, assistant name, repo URL, etc.

All fetches and iframe URLs use **relative paths** so the site works under GitHub Pages subpaths.

### Optional: run viewer app in dev

```bash
npm run dev:viewer   # runs Vite dev server for viewer/viewer-app only
```

Integrated testing should use the **built** `site/` served statically (`npm run preview:pages`), not the dev server.

---

## GitHub Pages

When this repository is pushed to GitHub and GitHub Pages is enabled with
**GitHub Actions** as the source, the workflow at
`.github/workflows/pages.yml` builds each step's Vue app and deploys them.

### How it works

1. All `step-*` tags are discovered.
2. Each tag is checked out into a temporary `git worktree`.
3. The Vue app is built with Vite, with assets under `/<repo>/step-XX/app/`.
4. The built output is deployed via `actions/deploy-pages`.

Each step is available at `/<repo>/step-XX/app/` (e.g. `/experiment-genai-steps-cursor/step-01/app/`).

To deploy the **viewer** to Pages, point the workflow at the output of `npm run build:pages` (the `site/` folder) instead of the current step-app-only build.

### Enabling GitHub Pages

In your repository settings:
1. Go to **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` (or trigger the workflow manually via **Actions →
   Deploy to GitHub Pages → Run workflow**).

---

## Repository structure

```
.github/
  workflows/
    pages.yml         # CI/CD: build + deploy to GitHub Pages

viewer/               # Standalone viewer (can be extracted to its own repo)
  viewer-app/         # Vue 3 + Vite viewer app (PrimeVue, hash routing)
  scripts/            # Build script and lib (build-pages.mjs, lib/*.js)
  templates/          # Fallback HTML for missing notes/prompt

viewer.config.json    # Viewer config (site title, footer, etc.); created if missing
site/                 # Generated static output (do not commit)

src/                  # Vue 3 application source (experiment app)
  data/
  components/
  views/
  i18n/
  router/
  main.js
  App.vue

docs/
  agent-notes/        # AI reasoning notes per step (XX.md)
  prompts/            # Original prompts per step (XX.md / step-XX.md)
```

---

## Git tag convention

Each major step is tagged as `step-XX` (zero-padded, e.g. `step-01`):

```bash
git checkout step-03   # see the codebase at step 03
git tag -l 'step-*'    # list all step tags
```
