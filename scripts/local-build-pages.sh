#!/usr/bin/env bash

# Local builder for the GitHub Pages shell site.
# Mirrors the CI workflow but targets a developer machine so you can
# preview the shell + step apps before pushing.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

REPO_NAME="experiment-genai-localization"

echo "==> Local Pages shell build (repo: ${REPO_NAME})"

# Discover steps, or accept a space-separated list as the first arg
if [ "${1-}" != "" ]; then
  STEPS="$1"
else
  STEPS="$(git tag -l 'step-*' | sort -V | tr '\n' ' ' | xargs || true)"
fi

if [ -z "$STEPS" ]; then
  echo "No step-* tags found. Nothing to build."
  exit 1
fi

echo "Steps: ${STEPS}"

# Clean and prepare _site
rm -rf _site
mkdir -p _site/shell _site/about
cp shell/shell.css _site/shell/shell.css
cp shell/shell.js  _site/shell/shell.js

WORKSPACE="$ROOT_DIR"

for TAG in $STEPS; do
  echo ""
  echo "────────────────────────────────────────"
  echo "  Building ${TAG}"
  echo "────────────────────────────────────────"

  STEP_NUM="${TAG#step-}"

  # Checkout tag into a temporary worktree
  git worktree add "/tmp/wt-${TAG}" "$TAG"

  # Reuse main node_modules to avoid repeated installs
  ln -sf "${WORKSPACE}/node_modules" "/tmp/wt-${TAG}/node_modules"

  # Build the Vue app. For local preview we keep the base simple so it
  # works under http://localhost:PORT without the GitHub repo prefix.
  BASE="/${TAG}/app/"
  mkdir -p "_site/${TAG}/app"

  (
    cd "/tmp/wt-${TAG}"
    npx vite build --base="${BASE}" --outDir="${WORKSPACE}/_site/${TAG}/app"
  )

  # Render notes
  NOTES_DEST="_site/${TAG}/notes.html"
  NOTES_SRC="/tmp/wt-${TAG}/docs/agent-notes/${STEP_NUM}.md"
  if [ -f "$NOTES_SRC" ]; then
    node "${WORKSPACE}/scripts/render-md.mjs" "$NOTES_SRC" > "$NOTES_DEST"
    echo "  ✓ Rendered notes"
  else
    printf '<p class="prose-missing">No agent notes found for %s.</p>' "$TAG" > "$NOTES_DEST"
    echo "  ⚠ No notes found at $NOTES_SRC"
  fi

  # Render prompt (step-XX.md or XX.md)
  PROMPT_DEST="_site/${TAG}/prompt.html"
  PROMPT_SRC_A="/tmp/wt-${TAG}/docs/prompts/step-${STEP_NUM}.md"
  PROMPT_SRC_B="/tmp/wt-${TAG}/docs/prompts/${STEP_NUM}.md"
  if [ -f "$PROMPT_SRC_A" ]; then
    node "${WORKSPACE}/scripts/render-md.mjs" "$PROMPT_SRC_A" > "$PROMPT_DEST"
    echo "  ✓ Rendered prompt (step-XX.md)"
  elif [ -f "$PROMPT_SRC_B" ]; then
    node "${WORKSPACE}/scripts/render-md.mjs" "$PROMPT_SRC_B" > "$PROMPT_DEST"
    echo "  ✓ Rendered prompt (XX.md)"
  else
    printf '<p class="prose-missing">No prompt file found for %s.</p>' "$TAG" > "$PROMPT_DEST"
    echo "  ⚠ No prompt found for $TAG"
  fi

  # Clean up worktree
  git worktree remove "/tmp/wt-${TAG}" --force
done

# Generate global pages and shell wrappers
node "${WORKSPACE}/scripts/generate-site.mjs" "${STEPS}" "${REPO_NAME}" _site

echo ""
echo "==> Local Pages shell build complete."
echo "    Output: ${WORKSPACE}/_site"
echo "    You can preview it with any static server, e.g.:"
echo "      npx serve _site"

