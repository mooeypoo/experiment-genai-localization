# experiment-genai-steps

A small social-style demo application built with Vue 3 and Vite, developed
incrementally across multiple steps driven by an AI coding agent.

The app itself is intentionally minimal: a single post with comments and a
list of users. All data lives in memory and resets on page refresh. The
repository is an experiment in observing how AI-assisted development evolves
a codebase over many guided steps.

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

## GitHub Pages demo

When this repository is pushed to GitHub and GitHub Pages is enabled with
**GitHub Actions** as the source, the workflow at
`.github/workflows/pages.yml` automatically builds and deploys a viewer site.

### What the viewer provides

- **Global index** (`/`) — lists every available step with a link to try it.
- **Global about page** (`/about/`) — explains the project, architecture, and
  where docs live.
- **Per-step shell** (`/step-XX/`) — a persistent top bar and sidebar that
  wrap each step's Vue app in an `<iframe>`. The sidebar shows:
  - **Agent notes** — the AI's reasoning for that step (rendered from
    `docs/agent-notes/XX.md`).
  - **Prompt** — the original instructions given to the agent (rendered from
    `docs/prompts/step-XX.md` or `docs/prompts/XX.md`).

### How steps are discovered

The workflow runs `git tag -l 'step-*'` and processes the results in
version-sorted order. A `steps.json` manifest is generated at the site root;
the shell dropdown is populated from that file at runtime.

### How the build works

1. All `step-*` tags are discovered.
2. Each tag is checked out into a temporary `git worktree`.
3. The Vue app is built with Vite, passing the correct `--base` path so
   assets resolve at `/<repo>/step-XX/app/`.
4. `docs/agent-notes/XX.md` is rendered to `notes.html`.
5. `docs/prompts/step-XX.md` (or `docs/prompts/XX.md`) is rendered to
   `prompt.html`.
6. A global shell wrapper `index.html` is generated for each step.
7. The global `index.html`, `about/index.html`, and `steps.json` are
   generated.
8. Everything is deployed via `actions/deploy-pages`.

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

scripts/
  package.json        # Dependencies for build scripts (marked)
  render-md.mjs       # Renders a Markdown file to an HTML fragment
  generate-site.mjs   # Generates global pages, steps.json, and step shells

shell/
  shell.css           # Global styles for the Pages viewer shell
  shell.js            # Shell interactivity (dropdown, sidebar, copy-link)

src/                  # Vue 3 application source
  data/
    seed.json         # Seed data (users, post, comments)
    store.js          # In-memory reactive data layer
  components/         # Reusable Vue components
  views/              # Page-level Vue components
  i18n/               # Lightweight i18n module + locale files
  router/             # vue-router configuration
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

The shell viewer is **not** tagged as a step — it lives on `main` and is
considered global/latest infrastructure.
