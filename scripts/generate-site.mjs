/**
 * generate-site.mjs
 *
 * Generates the static shell pages for the GitHub Pages viewer:
 *   - _site/steps.json           (step manifest consumed by shell.js)
 *   - _site/index.html           (global landing page)
 *   - _site/about/index.html     (about page)
 *   - _site/step-XX/index.html   (shell wrapper per step, one per tag)
 *
 * Usage:
 *   node generate-site.mjs "<space-separated step tags>" "<repo-name>" <outDir>
 *
 * Example:
 *   node generate-site.mjs "step-01 step-02 step-12" "experiment-genai-steps" _site
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const [, , stepsArg = '', repoName = '', outDir = '_site'] = process.argv

/** Sorted list of step tag strings, e.g. ['step-01', 'step-02', ...] */
const steps = stepsArg.trim().split(/\s+/).filter((s) => /^step-\d+$/.test(s))

if (steps.length === 0) {
  process.stderr.write('Warning: no step tags found, site will have no steps.\n')
}

// Ensure the output directory exists
mkdirSync(outDir, { recursive: true })

// ─── steps.json ─────────────────────────────────────────────────────────────

const stepsData = steps.map((id) => {
  const number = id.replace('step-', '')
  return { id, number, label: `Step ${number}` }
})

writeFileSync(join(outDir, 'steps.json'), JSON.stringify(stepsData, null, 2) + '\n')
console.log('Generated steps.json')

// ─── Global index ────────────────────────────────────────────────────────────

const stepCards = stepsData
  .map(
    ({ id, label }) => `
        <a href="./${id}/" class="step-card">
          <span class="step-card-label">${label}</span>
          <svg class="step-card-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>`,
  )
  .join('')

writeFileSync(
  join(outDir, 'index.html'),
  /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Social Demo Viewer</title>
  <link rel="stylesheet" href="./shell/shell.css" />
</head>
<body class="page-layout">

  <header class="page-header">
    <div class="page-header-inner">
      <span class="page-brand">Social Demo Viewer</span>
      <nav class="page-nav">
        <a href="./about/">About</a>
      </nav>
    </div>
  </header>

  <main class="page-main">
    <section class="page-hero">
      <h1>Step-by-step Vue 3 demo</h1>
      <p>
        Browse an evolving social demo app built incrementally across
        <strong>${stepsData.length} steps</strong>. Each step is built from
        a <code>git</code> tag and comes with agent notes and the original prompt.
      </p>
    </section>

    <section class="step-section">
      <h2 class="section-heading">Available steps</h2>
      <div class="step-grid">${stepCards}
      </div>
    </section>
  </main>

  <footer class="page-footer">
    <a href="https://github.com/${repoName}" class="footer-link" target="_blank" rel="noopener">
      View on GitHub
    </a>
  </footer>

</body>
</html>
`,
)
console.log('Generated index.html')

// ─── About page ──────────────────────────────────────────────────────────────

mkdirSync(join(outDir, 'about'), { recursive: true })

writeFileSync(
  join(outDir, 'about', 'index.html'),
  /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>About — Social Demo Viewer</title>
  <link rel="stylesheet" href="../shell/shell.css" />
</head>
<body class="page-layout">

  <header class="page-header">
    <div class="page-header-inner">
      <a href="../" class="page-back-link">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="16" height="16">
          <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        All steps
      </a>
      <span class="page-brand">Social Demo Viewer</span>
      <nav class="page-nav">
        <a href="../about/" aria-current="page">About</a>
      </nav>
    </div>
  </header>

  <main class="page-main page-main--narrow">
    <h1>About this site</h1>

    <p>
      This is a static demo viewer for an AI-assisted coding experiment. A Vue 3
      social demo app was built incrementally across ${stepsData.length} steps, each driven by
      a prompt given to an AI coding agent. The agent's reasoning for each step is
      recorded in the <em>agent notes</em>.
    </p>

    <h2>How steps are discovered</h2>
    <p>
      The GitHub Actions build workflow discovers every <code>git</code> tag
      matching <code>step-*</code>, checks each tag out into a temporary worktree,
      builds the Vue app with the correct asset base path, and renders the
      Markdown docs to HTML. A <code>steps.json</code> manifest at the site root
      lets the shell populate the step dropdown without hard-coding anything.
    </p>

    <h2>Where the docs live</h2>
    <ul>
      <li>
        <strong>Agent notes</strong> — <code>docs/agent-notes/XX.md</code> in each
        step tag. The notes cover decisions, rationale, ambiguities, and tradeoffs.
      </li>
      <li>
        <strong>Prompts</strong> — <code>docs/prompts/XX.md</code> (or
        <code>docs/prompts/step-XX.md</code>). These are the original instructions
        given to the agent for that step.
      </li>
    </ul>

    <h2>Shell architecture</h2>
    <p>
      The global shell (top bar + sidebar) is a thin static HTML/CSS/JS layer
      generated once at build time. It wraps each step's Vue app in an
      <code>&lt;iframe&gt;</code>, keeping the step builds completely isolated.
      Changing the shell design requires only a push to <code>main</code> —
      no per-step rebuild needed.
    </p>

    <h2>Video walkthrough</h2>
    <p class="video-placeholder">
      <em>A video walkthrough will be linked here in a future update.</em>
    </p>

    <h2>Source</h2>
    <p>
      <a href="https://github.com/${repoName}" target="_blank" rel="noopener">
        github.com/${repoName}
      </a>
    </p>
  </main>

  <footer class="page-footer">
    <a href="https://github.com/${repoName}" class="footer-link" target="_blank" rel="noopener">
      View on GitHub
    </a>
  </footer>

</body>
</html>
`,
)
console.log('Generated about/index.html')

// ─── Step shell wrappers ─────────────────────────────────────────────────────

for (const { id, number, label } of stepsData) {
  const stepDir = join(outDir, id)
  mkdirSync(stepDir, { recursive: true })

  // Build the <option> list for the step selector
  const options = stepsData
    .map(
      (s) =>
        `<option value="${s.id}"${s.id === id ? ' selected' : ''}>${s.label}</option>`,
    )
    .join('\n        ')

  writeFileSync(
    join(stepDir, 'index.html'),
    /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${label} — Social Demo Viewer</title>
  <link rel="stylesheet" href="../shell/shell.css" />
</head>
<body class="shell-layout" data-step="${id}">

  <!-- ── Top bar ────────────────────────────────────────────────────── -->
  <header class="shell-topbar" id="shell-topbar">

    <div class="shell-topbar-start">
      <a href="../" class="shell-home-btn" aria-label="Back to all steps" title="All steps">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="18" height="18">
          <path d="M3 10l7-7 7 7" stroke="currentColor" stroke-width="1.6"
            stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5 8v9h4v-5h2v5h4V8" stroke="currentColor" stroke-width="1.6"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
      <span class="shell-brand" aria-hidden="true">Social Demo</span>
    </div>

    <div class="shell-topbar-center">
      <label class="shell-step-label" for="shell-step-select">Step</label>
      <select id="shell-step-select" class="shell-step-select" aria-label="Switch step">
        ${options}
      </select>
    </div>

    <div class="shell-topbar-end">
      <a href="../about/" class="shell-nav-link">About</a>

      <button id="shell-copy-btn" class="shell-icon-btn" title="Copy link to this step"
        aria-label="Copy link to this step">
        <svg id="shell-copy-icon" viewBox="0 0 20 20" fill="none"
          aria-hidden="true" width="17" height="17">
          <rect x="7" y="7" width="10" height="12" rx="2"
            stroke="currentColor" stroke-width="1.6"/>
          <path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
            stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
        <svg id="shell-copied-icon" viewBox="0 0 20 20" fill="none"
          aria-hidden="true" width="17" height="17" style="display:none">
          <path d="M4 10l4 4 8-8" stroke="currentColor" stroke-width="1.8"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span id="shell-copy-label" class="shell-btn-label">Copy link</span>
      </button>

      <button id="shell-sidebar-toggle" class="shell-icon-btn shell-hamburger-btn"
        aria-label="Toggle sidebar" aria-expanded="false"
        aria-controls="shell-sidebar">
        <svg class="icon-menu" viewBox="0 0 20 20" fill="none"
          aria-hidden="true" width="18" height="18">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor"
            stroke-width="1.6" stroke-linecap="round"/>
        </svg>
        <svg class="icon-close" viewBox="0 0 20 20" fill="none"
          aria-hidden="true" width="18" height="18" style="display:none">
          <path d="M5 5l10 10M15 5L5 15" stroke="currentColor"
            stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

  </header>

  <!-- ── Body ───────────────────────────────────────────────────────── -->
  <div class="shell-body">

    <!-- Step app in an isolated iframe -->
    <main class="shell-main" aria-label="Step application">
      <iframe
        id="shell-app-frame"
        src="./app/"
        title="${label} — app"
        class="shell-app-iframe"
        loading="eager"
      ></iframe>
    </main>

    <!-- Sidebar: agent notes + prompt -->
    <aside class="shell-sidebar" id="shell-sidebar" aria-label="Step documentation">

      <div class="shell-sidebar-header">
        <div class="shell-tabs" role="tablist" aria-label="Documentation sections">
          <button class="shell-tab shell-tab--active" role="tab"
            aria-selected="true" data-tab="notes" id="tab-notes"
            aria-controls="panel-notes">Agent notes</button>
          <button class="shell-tab" role="tab"
            aria-selected="false" data-tab="prompt" id="tab-prompt"
            aria-controls="panel-prompt">Prompt</button>
        </div>
        <button class="shell-sidebar-close" id="shell-sidebar-close"
          aria-label="Close sidebar">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="16" height="16">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" stroke-width="1.6"
              stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="shell-tab-panel shell-tab-panel--active"
        id="panel-notes" role="tabpanel" aria-labelledby="tab-notes">
        <div id="shell-notes-body" class="shell-prose-container">
          <p class="shell-loading">Loading notes…</p>
        </div>
      </div>

      <div class="shell-tab-panel" id="panel-prompt" role="tabpanel"
        aria-labelledby="tab-prompt" hidden>
        <div id="shell-prompt-body" class="shell-prose-container">
          <p class="shell-loading">Loading prompt…</p>
        </div>
      </div>

    </aside>

    <!-- Sidebar backdrop (mobile overlay) -->
    <div class="shell-backdrop" id="shell-backdrop" aria-hidden="true"></div>

  </div><!-- /.shell-body -->

  <!-- Per-step config — read by shell.js before it initialises -->
  <script>
    window.SHELL_STEP = '${id}';
    window.SHELL_ROOT  = '../';
  </script>
  <script src="../shell/shell.js"></script>

</body>
</html>
`,
  )
  console.log(`Generated ${id}/index.html`)
}

console.log('\nSite generation complete.')
