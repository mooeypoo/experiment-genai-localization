We have a static Vue app with multiple historical stages tagged in git as step-01, step-02, ... step-12. Each step contains docs/agent-notes/XX.md. I will also add docs/prompts/step-XX.md for each step.

Now implement the GitHub Pages “global shell” viewer and deployment pipeline.

Goals
- Create a GitHub Pages site that can host and let people browse the app at each step-* tag.
- The shell UX should be modern, minimal, clean (good typography, generous spacing, simple colors, mobile-friendly).
- The shell itself should NOT be part of the step selector (so do not name anything as step-* for the shell; it should be global/latest).
- When I push this repo to GitHub and enable GitHub Pages, it should deploy and work.

Core UX Requirements (global/latest)
1) Global index page (/)
- Lists all available steps (auto-discovered from git tags matching step-*).
- Has a short description of what this site is.
- Clicking a step takes you to /step-XX/

2) Global About page (/about/)
- Explains this is a static demo viewer for an experiment.
- Links to the GitHub repo.
- Explains that each step is built from a git tag.
- Mentions that the sidebar shows the agent notes and the prompt used.
- Include a placeholder for a future video link (no actual link yet).

3) Global Shell UI (applies when viewing any /step-XX/)
A persistent top bar:
- Step selector dropdown populated from the available step-* tags (auto-generated).
- Current step clearly shown.
- Link back to index.
- Link to about.
- “Link to this step” button that copies the current URL to clipboard and shows a subtle success state.
- A hamburger icon to toggle a sidebar on small screens.

A sidebar / drawer:
- Shows rendered HTML for the agent notes for that step.
- Also shows rendered HTML for the prompt for that step (if present).
- If notes or prompt is missing, show a friendly fallback.
- On desktop: sidebar visible by default (or a clear toggle).
- On mobile: sidebar collapsed by default and toggled via hamburger.

Important: the shell should be global (one place to edit design/content later) and should NOT require rebuilding every step to change the index/about/chrome.

Technical / Build Requirements
- Use GitHub Actions to build and deploy to GitHub Pages (no secrets; use official Pages deployment actions and default tokens/permissions).
- Workflow must:
  1) Discover tags matching step-* (sorted in step order).
  2) For each step tag:
     - Checkout the tag
     - Install dependencies
     - Build the Vue app for static hosting under /<repo>/step-XX/ (handle correct base paths)
     - Render docs/agent-notes/XX.md to an HTML file that will be served under that step folder (e.g. notes.html)
     - Render docs/prompts/step-XX.md to an HTML file under that step folder (e.g. prompt.html) if it exists; otherwise generate a friendly placeholder
  3) Generate a global steps.json at the site root so the shell can populate the dropdown without hardcoding
  4) Generate the global index and about pages (global/latest)
  5) Include global shell assets (JS/CSS) at stable paths (e.g. /shell/...) that:
     - detect current step from URL
     - load steps.json
     - fetch and display that step’s notes.html and prompt.html in the sidebar
     - implement the step switcher navigation
     - implement the copy-link button
- The shell should not depend on any runtime backend.
- Routing must work on refresh on GitHub Pages. Use a static-safe approach (hash router for the built app, OR a GH Pages SPA fallback strategy). Keep it robust.

Separation Requirements
- Keep this “Pages viewer” system isolated from the Vue app’s internal UI as much as possible.
- Prefer a wrapper approach where the shell surrounds the step app build output, rather than modifying the app’s components across all steps.
- Keep scripts for building/generating site content in dedicated folders (e.g. under .github/ or a scripts folder).
- Do not change the historical meaning of existing step-* tags (do not retag them or rewrite history).

README
- Update the README to include:
  - how to run locally
  - how the Pages demo works
  - how steps are discovered
  - where prompts and agent notes live

Finish by writing docs/agent-notes/pages-shell.md (or similar name that is NOT step-XX) with thorough reasoning:
1) Summary
2) Decisions & Rationale
3) Ambiguities Encountered (options + resolution)
4) Tradeoffs
5) Non-Goals
6) Files Changed
7) Manual Verification Checklist (include how to verify Pages locally if possible)
8) Known Issues / Follow-ups
