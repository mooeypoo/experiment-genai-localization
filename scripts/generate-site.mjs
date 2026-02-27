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

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs'
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
  const baseLabel = `Step ${number}`

  let title = ''
  let short = ''

  try {
    const notesPath = join(outDir, id, 'notes.html')
    if (existsSync(notesPath)) {
      const html = readFileSync(notesPath, 'utf-8')
      const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
      if (match && match[1]) {
        // Strip any inner tags from the H1 (unlikely, but safe)
        const rawTitle = match[1].replace(/<[^>]+>/g, '').trim()
        if (rawTitle) {
          title = rawTitle
          // Remove the leading "Step XX —" / "Step XX -" / "Step XX:" prefix if present
          const prefixRe = new RegExp(`^Step\\s+${number}\\s*[—\\-:\\u2013]?\\s*`, 'i')
          const stripped = rawTitle.replace(prefixRe, '').trim()
          short = stripped || rawTitle
        }
      }
    }
  } catch {
    // If anything goes wrong reading/parsing notes.html, we just fall back
    // to the plain "Step XX" label with no short description.
  }

  const fullLabel = short ? `${baseLabel} — ${short}` : baseLabel

  return {
    id,
    number,
    label: fullLabel,      // used by the shell dropdown + index cards
    short,                 // short description derived from the H1, if available
    title: title || fullLabel, // raw H1 text or the full label as a fallback
  }
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
  <title>GenAI Incremental Localization Experiment (Cursor / Sonnet)</title>
  <link rel="stylesheet" href="./shell/shell.css" />
</head>
<body class="page-layout">

  <header class="page-header">
    <div class="page-header-inner">
      <span class="page-brand">GenAI Incremental Localization Experiment (Cursor / Sonnet)</span>
      <nav class="page-nav">
        <a href="./about/">About</a>
      </nav>
    </div>
  </header>

  <main class="page-main">
    <section class="page-hero">
      <h1>GenAI Incremental Localization Experiment (Cursor / Sonnet)</h1>
    </section>

    <h2>What This Is</h2>
    <p>This site documents an incremental software development experiment conducted using an AI coding assistant.</p>
    <p>The premise is simple:</p>
    <p>Start with a small, straightforward application.<br />
    Then, step by step, introduce increasingly realistic localization constraints — new languages, right-to-left scripts, character limits, culturally sensitive phrasing, locale-aware sorting, and formatting rules.</p>
    <p>At each stage, we observe how the AI adapts.</p>
    <p>We record:</p>
    <ul>
      <li>The exact prompt given to the assistant</li>
      <li>The code it produced</li>
      <li>The architectural decisions it made</li>
      <li>The reasoning it documented</li>
    </ul>
    <p>This is not a benchmark and not a competition.</p>
    <p>It is a process study.</p>

    <h2>Why This Experiment Exists</h2>
    <p>Modern software is global by default.</p>
    <p>Yet many applications begin without serious consideration for:</p>
    <ul>
      <li>Multilingual users</li>
      <li>Right-to-left layouts</li>
      <li>Text expansion and contraction</li>
      <li>Locale-aware sorting</li>
      <li>Cultural phrasing differences</li>
      <li>Formatting conventions</li>
    </ul>
    <p>Localization is often treated as a late-stage polish rather than an architectural concern.</p>
    <p>This experiment asks:</p>
    <p>What happens when localization pressure is introduced incrementally into an evolving application?</p>
    <p>How does an AI coding assistant respond when constraints accumulate over time?</p>

    <h2>How to Use This Site</h2>
    <ol>
      <li>Choose a step from the selector.</li>
      <li>Explore the application at that stage.</li>
      <li>Open the sidebar to read:
        <ul>
          <li>The agent&#8217;s notes (what it decided and why)</li>
          <li>The prompt that produced that stage.</li>
        </ul>
      </li>
      <li>Move forward step by step and observe what changes.</li>
    </ol>
    <p>You can jump between stages at any time.</p>

    <h2>Multiple Assistants</h2>
    <p>This experiment was conducted using more than one AI coding assistant.</p>
    <p>You can explore both versions:</p>
    <p>Cursor / Sonnet version:<br />
    <a href="https://mooeypoo.github.io/experiment-genai-localization/" target="_blank" rel="noopener">https://mooeypoo.github.io/experiment-genai-localization/</a></p>
    <p>GitHub Copilot version:<br />
    <a href="https://mooeypoo.github.io/experiment-genai-localization-copilot/" target="_blank" rel="noopener">https://mooeypoo.github.io/experiment-genai-localization-copilot/</a></p>
    <p>The goal is not to declare a winner.</p>
    <p>The goal is to observe differences in architectural foresight, ambiguity handling, refactoring behavior, and documentation patterns under evolving localization constraints.</p>

    <section class="step-section">
      <h2 class="section-heading">Available steps</h2>
      <div class="step-grid">${stepCards}
      </div>
    </section>
  </main>

  <footer class="page-footer">
    <a href="https://moriel.tech" class="footer-link" target="_blank" rel="noopener">
      Made by Moriel Schottlender
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
  <title>About — GenAI Incremental Localization Experiment (Cursor / Sonnet)</title>
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
      <span class="page-brand">GenAI Incremental Localization Experiment (Cursor / Sonnet)</span>
      <nav class="page-nav">
        <a href="../about/" aria-current="page">About</a>
      </nav>
    </div>
  </header>

  <main class="page-main page-main--narrow">
    <h1>About This Experiment</h1>

    <p>The GenAI Incremental Localization Experiment is a structured exploration of how AI coding assistants behave when software requirements evolve incrementally.</p>
    <p>Rather than asking an assistant to build a fully internationalized system from the start, we follow a more realistic development path:</p>
    <ul>
      <li>Begin with a small monolingual application.</li>
      <li>Add features normally.</li>
      <li>Introduce translation requirements later.</li>
      <li>Add right-to-left languages.</li>
      <li>Introduce character constraints.</li>
      <li>Add locale-aware sorting and formatting.</li>
      <li>Refine natural language phrasing.</li>
    </ul>
    <p>At each stage, we observe:</p>
    <ul>
      <li>What architectural decisions were made?</li>
      <li>Did the assistant anticipate future complexity?</li>
      <li>What had to be refactored?</li>
      <li>How were ambiguities resolved?</li>
      <li>What assumptions became visible only under pressure?</li>
    </ul>

    <h2>Why Localization?</h2>
    <p>Localization is one of the most underestimated forces in software architecture.</p>
    <p>It affects:</p>
    <ul>
      <li>Layout and direction</li>
      <li>Validation rules</li>
      <li>Data modeling</li>
      <li>Sorting logic</li>
      <li>Formatting APIs</li>
      <li>UX microcopy</li>
      <li>Accessibility</li>
    </ul>
    <p>It is rarely treated as foundational at the start of a project.</p>
    <p>That makes it an ideal pressure test for incremental AI development.</p>

    <h2>Why Incremental?</h2>
    <p>Real software projects do not begin with perfect foresight.</p>
    <p>They evolve.</p>
    <p>This experiment mirrors that reality.</p>
    <p>We intentionally do not warn the assistant in advance that complex localization constraints are coming.</p>
    <p>The goal is not to trick the AI.</p>
    <p>The goal is to observe how it reasons and adapts under evolving constraints.</p>

    <h2>Multiple Assistants, Same Structure</h2>
    <p>This experiment was conducted multiple times using different AI coding assistants.</p>
    <p>Each run follows the same incremental structure and staged prompts.</p>
    <p>The only variable changed was the assistant.</p>
    <p>You can explore both versions:</p>
    <p>Cursor / Sonnet version:<br />
    <a href="https://mooeypoo.github.io/experiment-genai-localization/" target="_blank" rel="noopener">https://mooeypoo.github.io/experiment-genai-localization/</a></p>
    <p>GitHub Copilot version:<br />
    <a href="https://mooeypoo.github.io/experiment-genai-localization-copilot/" target="_blank" rel="noopener">https://mooeypoo.github.io/experiment-genai-localization-copilot/</a></p>
    <p>This is not about ranking assistants.</p>
    <p>It is about observing reasoning patterns.</p>

    <h2>How the Site Works</h2>
    <p>Each stage corresponds to a git tag.</p>
    <p>For every stage, you can view:</p>
    <ul>
      <li>The running application at that point in history.</li>
      <li>The agent&#8217;s reasoning notes.</li>
      <li>The exact prompt that produced that stage.</li>
    </ul>
    <p>The global shell provides navigation and context.<br />
    Each step is a historical snapshot.</p>

    <h2>Limitations</h2>
    <p>This experiment does not claim:</p>
    <ul>
      <li>That the resulting applications are production-ready.</li>
      <li>That localization coverage is complete.</li>
      <li>That these outcomes represent all possible AI development paths.</li>
    </ul>
    <p>It is a structured exploration, not a benchmark.</p>
  </main>

  <footer class="page-footer">
    <a href="https://moriel.tech" class="footer-link" target="_blank" rel="noopener">
      Made by Moriel Schottlender
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
  <title>${label} — GenAI Incremental Localization Experiment (Cursor/Sonnet)</title>
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
      <span class="shell-brand" aria-hidden="true">GenAI Incremental Localization Experiment (Cursor/Sonnet)</span>
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
