# Pages Shell — Agent Notes

## 1. Summary

This step introduces the GitHub Pages "global shell" viewer and its automated
build pipeline. The goal is to let anyone browse the evolving Vue 3 demo at
any historical `step-*` tag via a single hosted URL, without touching those
tags or rebuilding them to change the chrome.

The deliverables are:

- A GitHub Actions workflow (`.github/workflows/pages.yml`) that discovers
  all `step-*` tags, builds each step's Vue app with the correct base path,
  renders Markdown docs to HTML fragments, and deploys everything via the
  official Pages Actions.
- A lightweight static shell (`shell/shell.css`, `shell/shell.js`) that
  provides a persistent top bar and sidebar around each step's app in an
  iframe.
- A set of Node.js build scripts (`scripts/`) responsible for rendering
  Markdown and generating the global index, about, and per-step wrapper pages.
- An updated README covering local development and Pages operation.
- This document.

---

## 2. Decisions & Rationale

### iframe isolation over direct injection

The shell wraps each step's built Vue app in an `<iframe src="./app/">`.
The alternative—injecting the shell's `<header>` into each step's own
`index.html` — would require modifying every step build at CI time, coupling
the shell's HTML structure to the steps' internals. Any future shell redesign
would then require rebuilding all steps.

With the iframe:
- The shell HTML is generated once in `generate-site.mjs`.
- The per-step Vue app is completely self-contained and oblivious to the shell.
- The shell can evolve freely: pushing to `main` redeploys all step wrappers
  while the step apps remain cached artifacts.

Trade-off accepted: the browser's address bar always shows the step wrapper
URL (e.g. `/step-01/`), not the inner hash route. For a demo viewer this is
acceptable. The Vue app's own navigation still works perfectly inside the
iframe because it uses `createWebHashHistory`, which operates entirely in the
URL fragment and never requires the outer page to navigate.

### git worktrees instead of a second clone

`git worktree add /tmp/wt-step-01 step-01` checks out a tag into a temporary
directory without cloning the whole repository again. This keeps the CI run
fast and avoids authentication token re-use across clone invocations.

Each worktree shares the main checkout's object store, so all 12 worktrees
combined take only as much disk space as the working tree files (no duplicate
`.git` databases).

### Shared node_modules via symlink

Because every step tag uses the same package versions, the workflow installs
dependencies once in the main checkout and symlinks
`/tmp/wt-stepXX/node_modules → $GITHUB_WORKSPACE/node_modules`. This reduces
CI time from ~12 npm install runs to one. If a future step introduces
different dependency versions, the symlink approach must be revisited (the
worktree would need its own install).

### Custom Markdown renderer (marked) instead of pandoc

`marked` is a pure-JS library that requires no system packages, integrates
trivially into the existing Node toolchain, and produces clean HTML. pandoc
would offer richer output (e.g. syntax highlighting out of the box) but adds
a binary system dependency that complicates the CI setup for no meaningful
benefit at this scale.

### steps.json manifest

A `steps.json` file is generated at the site root so the shell dropdown can
be populated at runtime by `shell.js`. The per-step HTML pages already contain
statically generated `<option>` elements as a fallback, but the fetch ensures
the dropdown is always in sync with what was actually deployed. This separation
also means the global shell assets do not need to know the step list at
author-time.

### Prompt file naming fallback

The existing prompt files are `docs/prompts/XX.md` (e.g. `01.md`). The user
stated future files may use the `step-XX.md` convention. The workflow checks
`step-XX.md` first, then falls back to `XX.md`, so both naming conventions
work transparently without any manual migration.

### No build-time syntax highlighting

Syntax-highlighted code blocks inside the agent notes would require a
highlight.js pass or a Shiki render step. This adds complexity and was not
requested. The CSS applies dark-background `pre` styling that is readable
without per-language colours. Adding highlighting is a clean follow-up.

### `dvh` with `vh` fallback for full-height shell

The shell uses `height: 100dvh` (dynamic viewport height, which accounts for
mobile browser chrome) with `height: 100vh` as the fallback property above
it. This avoids the classic iOS Safari bug where `100vh` includes the address
bar, causing a scrollbar to appear.

### Permissions and secrets

The workflow uses the default `GITHUB_TOKEN` via the `contents: read`,
`pages: write`, `id-token: write` permission set. No custom secrets are
required. The deployer uses `actions/upload-pages-artifact` + `actions/deploy-pages`
(the official GitHub-maintained actions), which is the recommended approach
for the "GitHub Actions" Pages source.

---

## 3. Ambiguities Encountered

### What exactly is the base path for the Vue app?

**Problem:** GitHub Pages serves a project repo at
`https://owner.github.io/<repo>/`. Vite must be told this prefix so the
built `index.html` references assets at the right absolute paths. Without
it, the app loads a blank page.

**Options considered:**
1. Hard-code the repo name in `vite.config.js`. Fragile; breaks forks.
2. Pass `--base` on the command line from CI using `${{ github.event.repository.name }}`.
3. Use a relative base (`./`). Vite supports this, but it can break with
   nested hash routes if the browser resolves relative asset paths relative
   to the hash fragment.

**Resolution:** Option 2 — `--base=/${REPO_NAME}/${TAG}/app/`. This is
deterministic, fork-safe, and produces correct absolute asset URLs.

Special case: if someone uses this in a `username.github.io` repo (where the
Pages URL has no path prefix), the base would resolve to `//step-01/app/`
which is incorrect. This edge case is documented in Known Issues.

### Where does the shell CSS/JS live relative to the step pages?

The step pages are at `step-XX/index.html` and the shell is at `shell/shell.css`.
Relative paths (`../shell/shell.css`) work correctly on GitHub Pages because
the site is served from a single origin with a fixed structure.

If the site were to be served from a CDN sub-path that differs from the
repo name, this would break. Considered using an injected `<base>` tag, but
the shell pages are completely static so the relative approach is simpler
and sufficient.

### Should the sidebar load content eagerly or lazily?

Notes and prompt are fetched immediately when the step page loads
(`shell.js` calls `loadPane` for both tabs on init). The alternative—lazy
loading only when the user clicks a tab—would reduce initial network
requests but introduce a loading delay mid-interaction.

Since both files are small HTML fragments (rendered Markdown), eager
fetching is preferable: the content is ready by the time the user opens the
sidebar, and the cost is just 2 small HTTP requests per page load.

### Notes file naming in tags

At step tags, notes are stored as `docs/agent-notes/XX.md` (e.g. `01.md`),
not `step-01.md`. The step number is extracted with `STEP_NUM="${TAG#step-}"`,
giving `01` from `step-01`. Confirmed by listing the actual docs directory.

---

## 4. Tradeoffs

| Decision | Benefit | Cost |
|---|---|---|
| iframe isolation | Shell fully decoupled from step builds | Address bar shows wrapper URL; cannot deep-link to inner routes |
| Shared node_modules | Fast CI (~1 install vs 12) | Breaks if step deps diverge |
| Eager sidebar fetch | Content ready instantly | 2 extra HTTP requests on every step load |
| Static HTML generation | No JS required for index/about | Re-deploy needed to change step descriptions |
| No syntax highlighting | Simpler build pipeline | Code blocks are less readable |
| marked over pandoc | Zero system deps | Less rendering fidelity (no table of contents, footnotes) |
| Relative asset paths | Works on any origin+prefix | Breaks on custom CDN sub-paths |

---

## 5. Non-Goals

- **Per-step branch builds triggered by tag push.** The workflow only runs on
  `main`. Tags are read-only historical artifacts; they are never mutated.
- **Custom domain support.** The base-path logic assumes a standard GitHub
  Pages URL. Custom domains would need a separate `base` variable.
- **Search across steps.** A nice future feature; out of scope here.
- **Syntax-highlighted code in the sidebar.** Readable but not coloured.
- **Diff view between steps.** Interesting, but not requested.
- **Step-to-step comment/annotation overlay.** Out of scope.
- **Server-side rendering or edge functions.** Everything is purely static.

---

## 6. Files Changed

| File | Status | Description |
|---|---|---|
| `.github/workflows/pages.yml` | New | GitHub Actions: discover tags, build each step, generate site, deploy |
| `scripts/package.json` | New | Node deps for build scripts (`marked`) |
| `scripts/render-md.mjs` | New | Renders a `.md` file to an HTML fragment via marked |
| `scripts/generate-site.mjs` | New | Generates `steps.json`, `index.html`, `about/index.html`, per-step shells |
| `shell/shell.css` | New | All styles: global page layout, shell top bar, sidebar, prose, responsive |
| `shell/shell.js` | New | Shell interactivity: step switcher, sidebar toggle, tab switch, copy-link |
| `README.md` | Updated | Added Pages demo section, build overview, directory structure table |
| `docs/agent-notes/pages-shell.md` | New | This file |

---

## 7. Manual Verification Checklist

### Local pre-flight

- [ ] `cd scripts && npm install` — installs `marked` with no errors.
- [ ] `node scripts/render-md.mjs docs/agent-notes/01.md` — prints an HTML
  fragment to stdout beginning with `<div class="prose">`.
- [ ] `node scripts/generate-site.mjs "step-01 step-02" experiment-genai-steps _site_test` —
  creates `_site_test/steps.json`, `_site_test/index.html`,
  `_site_test/about/index.html`, `_site_test/step-01/index.html`,
  `_site_test/step-02/index.html`. Inspect each file manually.
- [ ] Open `_site_test/index.html` in a browser — step cards for 01 and 02
  appear; clicking either navigates to the step page (relative link works
  with a file server, e.g. `npx serve _site_test`).

### Building a single step locally

```bash
# From the repo root
git worktree add /tmp/wt-step-01 step-01
ln -sf "$(pwd)/node_modules" /tmp/wt-step-01/node_modules
cd /tmp/wt-step-01
npx vite build --base=/experiment-genai-steps/step-01/app/ --outDir=/tmp/dist-step-01
cd -
git worktree remove /tmp/wt-step-01 --force
```

- [ ] `/tmp/dist-step-01/index.html` exists and contains
  `src="/experiment-genai-steps/step-01/app/assets/..."`

### Full local simulation

```bash
mkdir -p _site_local/shell _site_local/about
cp shell/shell.css _site_local/shell/
cp shell/shell.js  _site_local/shell/

# Render notes and prompt for step-01
node scripts/render-md.mjs docs/agent-notes/01.md > _site_local/step-01/notes.html
node scripts/render-md.mjs docs/prompts/01.md     > _site_local/step-01/prompt.html

# Generate shell wrapper (use a fake steps list)
node scripts/generate-site.mjs "step-01" "experiment-genai-steps" _site_local

# Copy the built app
cp -r /tmp/dist-step-01/. _site_local/step-01/app/

# Serve and inspect
npx serve _site_local
```

- [ ] Visit `http://localhost:3000/step-01/` — top bar visible with step
  selector showing "Step 01".
- [ ] Sidebar appears on desktop (≥ 769 px) with "Agent Notes" and "Prompt"
  tabs.
- [ ] Agent Notes tab loads the rendered notes content.
- [ ] Prompt tab loads the rendered prompt content.
- [ ] Step selector navigating to a different step changes the URL.
- [ ] "Copy link" button copies the current URL; label briefly shows "Copied!".
- [ ] On a narrow viewport (≤ 768 px), sidebar is hidden; hamburger icon is
  visible.
- [ ] Tapping hamburger opens sidebar drawer; "×" button and backdrop tap
  close it.
- [ ] Home icon (⌂) navigates to `/step-01/../` = `index.html`.
- [ ] About link navigates to `../about/`.
- [ ] The Vue app in the iframe is fully usable: routing works, language
  switcher works, comments can be added.

### GitHub Actions

- [ ] After pushing to `main` with Pages source set to "GitHub Actions", the
  workflow run completes without errors.
- [ ] The deployed site at `https://<owner>.github.io/<repo>/` shows the index.
- [ ] `https://<owner>.github.io/<repo>/steps.json` returns valid JSON.
- [ ] `https://<owner>.github.io/<repo>/step-12/` loads the shell with the
  Vue app inside the iframe.
- [ ] Refreshing `https://<owner>.github.io/<repo>/step-06/` does not 404
  (GitHub Pages serves the folder's `index.html`).

---

## 8. Known Issues / Follow-ups

- **`username.github.io` repos**: If the repo is `owner.github.io`, GitHub
  Pages serves it at `https://owner.github.io/` (no sub-path). The `--base`
  would need to be `/step-XX/app/` instead of `/<repo>/step-XX/app/`. A
  follow-up could auto-detect this case in the workflow.

- **CI time**: Building 12 steps sequentially takes several minutes. If the
  step count grows, parallel matrix builds (using `strategy.matrix`) could
  cut this significantly.

- **No syntax highlighting**: Code blocks inside Markdown notes are rendered
  as plain text in a dark `<pre>`. Adding highlight.js (client-side) or Shiki
  (build-time) would improve readability of technical content.

- **iframe inner routing not reflected in address bar**: If a user navigates
  inside the Vue app (e.g. to `/users`) and then copies the link, they get
  the step shell URL, not the deep-link. This is a fundamental limitation of
  the iframe approach. A future `postMessage`-based bridge could sync the
  inner hash to the outer URL's fragment.

- **No 404 page**: If someone visits `/<repo>/step-99/` (non-existent), GitHub
  Pages returns a default 404. A custom `404.html` at the site root would give
  a nicer fallback.

- **Worktree symlink assumption**: All steps are assumed to have the same
  `package.json` versions. If a future step upgrades a dependency, the
  symlinked `node_modules` from the latest main checkout could produce
  incompatible builds for older steps. The fix is a per-step `npm ci` with
  node_modules caching keyed on the lock file hash.

- **`prompt.html` naming mismatch**: Existing prompt files are at
  `docs/prompts/XX.md`. The user mentioned future files may be
  `docs/prompts/step-XX.md`. The workflow already handles both via a fallback
  check, but the README note about the convention should be kept updated.

- **Accessibility of the iframe**: Screen readers announce the iframe as a
  separate document. The `title` attribute is set to identify the step, but
  full keyboard/AT flow between the shell chrome and the iframe content
  requires explicit focus management that is not implemented.

---

## 9. Content Consolidation Note

The landing page (`index.html`) and About page (`about/index.html`) content
has been consolidated and standardized across experiments.

Both pages now use the canonical title
**GenAI Incremental Localization Experiment (Cursor / Sonnet)** and share
consistent body copy that describes the experiment's purpose, incremental
methodology, multi-assistant comparison, and how to navigate the site.

The same canonical text is applied to both the generator template
(`scripts/generate-site.mjs`) and the committed static output (`_site/`).
Future regeneration of the site via the CI workflow will produce pages
matching this standardized content.
