/**
 * shell.js — Global shell behaviour for the GitHub Pages step viewer.
 *
 * Responsibilities:
 *  1. Populate the step dropdown from steps.json (fetched once, cached).
 *  2. Navigate when the user switches steps.
 *  3. Fetch and inject notes.html / prompt.html into the sidebar.
 *  4. Handle tab switching (Agent Notes ↔ Prompt).
 *  5. Copy-link button with transient success state.
 *  6. Sidebar toggle (hamburger on mobile; close button inside sidebar).
 *
 * The script is loaded on every step-XX/index.html page.
 * It reads `window.SHELL_STEP` and `window.SHELL_ROOT` set inline by the page.
 */

;(function () {
  'use strict'

  // ── Config injected by the page ──────────────────────────────────────────
  const STEP = window.SHELL_STEP || ''       // e.g. "step-01"
  const ROOT = window.SHELL_ROOT || '../'   // path to site root from this page

  // ── DOM references ───────────────────────────────────────────────────────
  const sel   = /** @type {HTMLSelectElement} */ (qs('#shell-step-select'))
  const sidebar       = qs('#shell-sidebar')
  const backdrop      = qs('#shell-backdrop')
  const sidebarToggle = qs('#shell-sidebar-toggle')
  const sidebarClose  = qs('#shell-sidebar-close')
  const copyBtn       = qs('#shell-copy-btn')
  const copyIcon      = qs('#shell-copy-icon')
  const copiedIcon    = qs('#shell-copied-icon')
  const copyLabel     = qs('#shell-copy-label')
  const notesBody     = qs('#shell-notes-body')
  const promptBody    = qs('#shell-prompt-body')
  const tabs          = qsa('.shell-tab')
  const panels        = qsa('.shell-tab-panel')

  function qs(selector)  { return document.querySelector(selector) }
  function qsa(selector) { return Array.from(document.querySelectorAll(selector)) }

  // ── 1. Step dropdown ─────────────────────────────────────────────────────
  // steps.json is fetched to keep the dropdown up-to-date with the actual
  // tags available, rather than relying only on the static options baked in
  // at build time. On first load the static options are already correct; this
  // fetch is a progressive enhancement that catches any mismatch.

  fetch(ROOT + 'steps.json')
    .then((r) => r.json())
    .then((steps) => {
      if (!sel || !Array.isArray(steps) || steps.length === 0) return

      // Rebuild options so the list is always fresh
      sel.innerHTML = steps
        .map(
          (s) =>
            `<option value="${s.id}"${s.id === STEP ? ' selected' : ''}>${s.label}</option>`,
        )
        .join('')
    })
    .catch(() => {
      // Silently fall back to the statically generated options
    })

  if (sel) {
    sel.addEventListener('change', () => {
      const chosen = sel.value
      if (chosen && chosen !== STEP) {
        window.location.href = ROOT + chosen + '/'
      }
    })
  }

  // ── 2. Fetch and inject sidebar content ──────────────────────────────────
  function loadPane(url, container) {
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then((html) => {
        container.innerHTML = html
        // Make external links open in a new tab (they come from rendered MD)
        container.querySelectorAll('a[href]').forEach((a) => {
          const href = a.getAttribute('href') || ''
          if (href.startsWith('http://') || href.startsWith('https://')) {
            a.setAttribute('target', '_blank')
            a.setAttribute('rel', 'noopener noreferrer')
          }
        })
      })
      .catch((err) => {
        container.innerHTML =
          `<p class="prose-missing">Could not load content (${err.message}).</p>`
      })
  }

  if (notesBody)  loadPane('./notes.html',  notesBody)
  if (promptBody) loadPane('./prompt.html', promptBody)

  // ── 3. Tab switching ─────────────────────────────────────────────────────
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab  // "notes" or "prompt"

      tabs.forEach((t) => {
        const isActive = t.dataset.tab === targetId
        t.classList.toggle('shell-tab--active', isActive)
        t.setAttribute('aria-selected', String(isActive))
      })

      panels.forEach((panel) => {
        const isActive = panel.id === `panel-${targetId}`
        panel.classList.toggle('shell-tab-panel--active', isActive)
        panel.hidden = !isActive
      })
    })
  })

  // ── 4. Copy-link button ──────────────────────────────────────────────────
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const url = window.location.href
      navigator.clipboard
        .writeText(url)
        .then(() => showCopied())
        .catch(() => {
          // Fallback for browsers that block clipboard without https
          try {
            const ta = document.createElement('textarea')
            ta.value = url
            ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0'
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            document.body.removeChild(ta)
            showCopied()
          } catch (_) {
            // If everything fails, do nothing visible
          }
        })
    })
  }

  function showCopied() {
    if (!copyBtn) return
    copyBtn.classList.add('copied')
    if (copyIcon)   copyIcon.style.display   = 'none'
    if (copiedIcon) copiedIcon.style.display = ''
    if (copyLabel)  copyLabel.textContent    = 'Copied!'

    setTimeout(() => {
      copyBtn.classList.remove('copied')
      if (copyIcon)   copyIcon.style.display   = ''
      if (copiedIcon) copiedIcon.style.display = 'none'
      if (copyLabel)  copyLabel.textContent    = 'Copy link'
    }, 2000)
  }

  // ── 5. Sidebar toggle ────────────────────────────────────────────────────
  const menuIcon  = sidebarToggle && sidebarToggle.querySelector('.icon-menu')
  const closeIconHamburger = sidebarToggle && sidebarToggle.querySelector('.icon-close')

  function isMobile() { return window.innerWidth <= 768 }

  function openSidebar() {
    if (!sidebar) return
    sidebar.classList.add('is-open')
    if (backdrop) backdrop.classList.add('is-visible')
    if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'true')
    if (menuIcon)  menuIcon.style.display  = 'none'
    if (closeIconHamburger) closeIconHamburger.style.display = ''
    document.addEventListener('keydown', handleEscape)
  }

  function closeSidebar() {
    if (!sidebar) return
    sidebar.classList.remove('is-open')
    if (backdrop) backdrop.classList.remove('is-visible')
    if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'false')
    if (menuIcon)  menuIcon.style.display  = ''
    if (closeIconHamburger) closeIconHamburger.style.display = 'none'
    document.removeEventListener('keydown', handleEscape)
  }

  function handleEscape(e) {
    if (e.key === 'Escape') closeSidebar()
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      if (!isMobile()) return
      if (sidebar && sidebar.classList.contains('is-open')) {
        closeSidebar()
      } else {
        openSidebar()
      }
    })
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar)
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar)
  }

  // Close sidebar when viewport grows past mobile breakpoint
  window.addEventListener('resize', () => {
    if (!isMobile() && sidebar && sidebar.classList.contains('is-open')) {
      closeSidebar()
    }
  })

  // ── 6. Initial state: sidebar open on desktop, closed on mobile ──────────
  // The CSS already handles this via media queries for visibility, but we
  // also need the aria-expanded attribute to be correct on load.
  if (sidebarToggle) {
    sidebarToggle.setAttribute('aria-expanded', isMobile() ? 'false' : 'true')
  }

})()
