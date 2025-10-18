This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# 8-bit Design System Foundations

This app ships with a pixel-inspired design system. The tokens are defined in `app/globals.css` via Tailwind v4 `@theme` so all utilities snap to an 8px grid and use the 8-bit palette.

## Tokens

- Colors: `background`, `foreground`, `primary`, `secondary`, `accent`, `muted`, `border`, `ring`, etc. Use utilities like `bg-background`, `text-foreground`, `border-border`, `ring-ring`.
- Spacing: 8px steps mapped to Tailwind scale
  - `p-1` = 8px, `p-2` = 16px, `p-3` = 24px, `p-4` = 32px, etc.
- Radii: stepped pixel corners
  - `rounded-none`, `rounded-sm` (2px), `rounded-md` (4px), `rounded-lg` (6px), `rounded-xl` (8px)
- Shadows: stepped hard shadows
  - `shadow-xs` (2px), `shadow-sm` (4px), `shadow-md` (6px), `shadow-lg` (8px)
- Border width (pixel): `--pixel-border` is 3px
  - Use `border-[var(--pixel-border)]` for NES-style thick rules.

## Fonts

Loaded in `app/layout.tsx`:
- Display: Press Start 2P → `--font-display`
- Body: Geist Sans → `--font-body`
- Mono: Geist Mono → `--font-mono`

Usage:
- Body copy: `font-sans` (maps to `--font-body`)
- Display headings or labels: `font-[var(--font-display)]`

## Focus and Accessibility

- Use `focus-visible:ring-4 focus-visible:ring-ring/60` for a high-contrast pixel ring.
- Prefer `rounded-none` + `border-[var(--pixel-border)]` for pixel components.

## Pixel utilities and sprites

- Utility classes:
  - `.pixelated` — crisp edges for images and canvases
  - `.pixel-outline` — 3px ring outline using theme `--ring`
- Component: `components/ui/pixel-sprite.tsx` — scales tiny sprites using `scale` and forces pixelated rendering.
- Assets: add sprites in `public/pixel/*` (a few samples are included: heart, star, coin, cursor).

## Example

```tsx
<button className="font-[var(--font-display)] border-[var(--pixel-border)] rounded-none shadow-sm focus-visible:ring-4 focus-visible:ring-ring/60 bg-primary text-primary-foreground px-4 py-2">
  START
</button>
```
