# Accessibility (WCAG 2.2 AA) & Internationalization Notes

Compliance record for `apps/web` (Build Standard A38).

## Accessibility Checklist

- **Semantic Landmarks:** Single `<header role="banner">`, `<nav role="tablist">`, `<main id="main-content">`, and `<footer role="contentinfo">`, plus a visible-on-focus skip link (`Skip to main content`).
- **Keyboard Navigation Pass (Manual Verification):**
  - `Tab` / `Shift+Tab` traverses all tabs, dropdowns, sliders, buttons, forensic audit pins (`1..5`), trace textarea, and footer links with high-contrast `:focus-visible` outlines (`2px solid #38bdf8`).
  - `ArrowLeft` / `ArrowRight` inside the tab bar moves focus and activates adjacent workbench modules cleanly (`aria-selected`, `aria-controls`, `role="tabpanel"`).
- **Color Contrast:** Primary text `#f1f5f9` on `#060a13` / `#0d1424` exceeds `15:1` contrast ratio; secondary text `#cbd5e1` exceeds `11:1`; status pills use high-luminance foregrounds (`#6ee7b7`, `#7dd3fc`, `#fcd34d`, `#fda4af`) against dark translucent badges.
- **Reduced Motion:** `@media (prefers-reduced-motion: reduce)` disables CSS transitions and `scene3d.ts` checks `window.matchMedia('(prefers-reduced-motion: reduce)').matches` to pause continuous 3D camera rotation and kinesin motion.
- **Alternative Text:** Every static image (`tripartite_bouton_blueprint.png`, publication figures) includes descriptive `alt` attributes; interactive `<canvas>` elements carry `aria-label`.

## Internationalization (i18n)

- **Encoding:** UTF-8 everywhere (`.editorconfig`, `.gitattributes`).
- **Supported Locales:** `en-US` (explicitly declared in `README.md`).
- **Externalized Message Catalog:** Top-level UI titles, descriptions, and tab labels live in `apps/web/src/i18n/en.json`, cleanly separated from core calculation logic in `@synapse/core`. Numeric displays use locale-aware formatting (`toLocaleString()`).
