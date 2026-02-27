/**
 * render-md.mjs
 *
 * Renders a Markdown file to an HTML fragment (no <html>/<body> wrapper).
 * The fragment is printed to stdout for capture by the calling shell script.
 *
 * Usage:
 *   node render-md.mjs <path/to/file.md>
 */

import { marked } from 'marked'
import { readFileSync } from 'fs'

const [, , filePath] = process.argv

if (!filePath) {
  process.stderr.write('Usage: render-md.mjs <input.md>\n')
  process.exit(1)
}

let markdown
try {
  markdown = readFileSync(filePath, 'utf-8')
} catch (err) {
  process.stderr.write(`Error reading ${filePath}: ${err.message}\n`)
  process.exit(1)
}

// Configure marked for sensible defaults
marked.setOptions({
  gfm: true,   // GitHub Flavoured Markdown (tables, strikethrough, etc.)
  breaks: false,
})

const html = marked.parse(markdown)

// Wrap in a prose container so the shell CSS can style it uniformly.
// No full-page wrapper; the shell injects this into the sidebar DOM.
process.stdout.write(`<div class="prose">\n${html}\n</div>\n`)
