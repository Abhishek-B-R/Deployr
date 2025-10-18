Title: feat(pixel-landing-v2): redesign landing page and publish preview

Summary
- Implemented Pixel Landing v2 improvements with a focus on clearer hero hierarchy, accessibility, and performance.
- Prepared this branch for preview deployment and CI validation.

Milestones and conventional commits
- refactor(landing): introduce reduced-motion support and a11y improvements in hero
- chore(docs): add PR template for design-system, a11y, and performance validation
- chore: prepare branch for preview deployment

Design system changes
- Button semantics: ensure clear aria-labels for primary and secondary CTAs
- Section roles/landmarks: hero section now has role=region with an associated heading for better navigation
- Non-essential decorative layers marked aria-hidden

Hero experience updates
- Reduced-motion support: disables 3D animation and starfield when user prefers reduced motion
- Performance tuning: slightly reduced starfield density and animation intensity by default
- Clear CTAs: Start quest and Watch demo have descriptive a11y labels

Accessibility validation
- Landmarks: hero has region + labelledby
- CTAs: buttons have descriptive aria-labels
- Live status: backend notice uses aria-live="polite"
- Reduced motion: honors prefers-reduced-motion

Performance validation
- Steps to reproduce locally
  1) cd core && pnpm install
  2) pnpm build && pnpm start
  3) Run Lighthouse against http://localhost:3000 (Mobile + Desktop)

Attach summary
- Lighthouse: paste scores (PWA, Perf, A11y, Best Practices, SEO)
- Web Vitals: Largest Contentful Paint, First Input Delay/INP, Cumulative Layout Shift

Preview link
- Paste the preview deployment URL from your CI/Vercel here: https://<preview-link>

CI status
- Lint: pnpm lint — expected green
- Test: pnpm test — expected green (or N/A if no tests present)
- Build: pnpm build — expected green

Follow-ups
- Consider adding automated Lighthouse checks in CI for the landing page
- Add unit tests for UI primitives and hero accessibility attributes
