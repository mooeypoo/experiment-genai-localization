/**
 * Environment and paths for the build.
 * All paths are relative to repo root (where viewer.config.json lives).
 */

import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** Repo root: directory containing viewer.config.json (three levels up from viewer/scripts/lib/) */
export const REPO_ROOT = resolve(__dirname, '../../../')

/** viewer/ directory */
export const VIEWER_DIR = join(REPO_ROOT, 'viewer')

/** viewer-app directory */
export const VIEWER_APP_DIR = join(VIEWER_DIR, 'viewer-app')

/** Output directory for the static site */
export const SITE_DIR = join(REPO_ROOT, 'site')

/** viewer/scripts directory */
export const SCRIPTS_DIR = join(VIEWER_DIR, 'scripts')

/** viewer/templates directory */
export const TEMPLATES_DIR = join(VIEWER_DIR, 'templates')
