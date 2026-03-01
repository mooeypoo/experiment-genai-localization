/**
 * Load or create viewer.config.json at repo root.
 */

import { join } from 'path'
import { readJson, writeJson, exists } from './fs.js'
import { REPO_ROOT } from './env.js'

const CONFIG_PATH = join(REPO_ROOT, 'viewer.config.json')

const DEFAULTS = {
  siteTitle: 'Step Viewer',
  assistantName: '',
  repoUrl: '',
  otherExperimentUrl: '',
  footerName: '',
  footerUrl: '',
  description: '',
}

export function loadViewerConfig() {
  if (!exists(CONFIG_PATH)) {
    writeJson(CONFIG_PATH, DEFAULTS)
    return DEFAULTS
  }
  try {
    const data = readJson(CONFIG_PATH)
    return { ...DEFAULTS, ...data }
  } catch {
    return DEFAULTS
  }
}
