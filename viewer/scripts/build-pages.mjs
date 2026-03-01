#!/usr/bin/env node
/**
 * Canonical build script for the step viewer site.
 * Generates the static folder `site/` at repo root.
 *
 * MODE 1 — Integrated: step sources present (tags or step-* folders).
 *   Builds step artifacts, renders docs, emits steps.json from real data.
 *
 * MODE 2 — Standalone: no step sources. Generates mock step artifacts
 *   and steps.json so the viewer can be tested in isolation.
 */

import { spawnSync } from 'child_process'
import { join } from 'path'
import { REPO_ROOT, SITE_DIR, VIEWER_APP_DIR, TEMPLATES_DIR } from './lib/env.js'
import { loadViewerConfig } from './lib/config.js'
import { writeJson, ensureDir, removeDir, writeText, readText } from './lib/fs.js'
import { buildStepsJson } from './lib/steps.js'
import { discoverSteps, buildStep, hasIntegratedSteps } from './lib/integrate.js'

function log(msg) {
  console.log(msg)
}

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd: cwd || REPO_ROOT, stdio: 'inherit', shell: true })
  if (r.status !== 0) {
    process.exit(r.status ?? 1)
  }
}

// ─── Clean and prepare ─────────────────────────────────────────────────────
removeDir(SITE_DIR)
ensureDir(SITE_DIR)

// ─── Build viewer app into site/ first (so Vite can emptyOutDir safely) ─────
log('Building viewer app into site/...')
const siteDirAbs = join(REPO_ROOT, 'site')
run('npx', ['vite', 'build', '--outDir', siteDirAbs], VIEWER_APP_DIR)

// ─── Viewer config ─────────────────────────────────────────────────────────
const viewerConfig = loadViewerConfig()
writeJson(join(SITE_DIR, 'viewer-config.json'), viewerConfig)
log('Emitted viewer-config.json')

// ─── Steps: integrated or mock ─────────────────────────────────────────────
let stepsData = []

if (hasIntegratedSteps()) {
  log('Integrated mode: building step artifacts from repo.')
  const stepIds = discoverSteps()
  for (const stepId of stepIds) {
    log(`  Building ${stepId}...`)
    const meta = buildStep(stepId, SITE_DIR)
    if (meta) {
      stepsData.push(meta)
    }
  }
} else {
  log('Standalone mode: generating mock step artifacts.')
  stepsData = [
    { id: 'step-01', num: 1, title: 'Step 01 — Mock step with docs', tag: null, hasNotes: true, hasPrompt: true },
    { id: 'step-02', num: 2, title: 'Step 02 — Mock step missing docs', tag: null, hasNotes: false, hasPrompt: false },
  ]
  const missingNotes = readText(join(TEMPLATES_DIR, 'missing-notes.html'))
  const missingPrompt = readText(join(TEMPLATES_DIR, 'missing-prompt.html'))
  for (const step of stepsData) {
    const stepDir = join(SITE_DIR, step.id)
    ensureDir(stepDir)
    const indexHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${step.title}</title></head><body><h1>${step.title}</h1><p>Mock step artifact. In standalone mode the viewer is tested with placeholder content.</p></body></html>`
    writeText(join(stepDir, 'index.html'), indexHtml)
    if (step.hasNotes) {
      writeText(join(stepDir, 'notes.html'), '<div class="prose"><h1>Mock notes</h1><p>Sample notes for this step.</p></div>')
    } else {
      writeText(join(stepDir, 'notes.html'), missingNotes)
    }
    if (step.hasPrompt) {
      writeText(join(stepDir, 'prompt.html'), '<div class="prose"><h1>Mock prompt</h1><p>Sample prompt for this step.</p></div>')
    } else {
      writeText(join(stepDir, 'prompt.html'), missingPrompt)
    }
  }
}

const stepsJson = buildStepsJson(stepsData)
writeJson(join(SITE_DIR, 'steps.json'), stepsJson)
log('Emitted steps.json')

log('Done. Output: site/')
