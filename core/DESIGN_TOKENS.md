# 8-Bit Gaming Visual Language - Design Tokens

This document outlines the complete design token system for the 8-bit retro gaming aesthetic applied to the Deployr landing page.

## Overview

The 8-bit visual language draws inspiration from classic NES, arcade games, and pixel art from the golden age of gaming (1980s-1990s). It combines nostalgic aesthetics with modern web standards, accessibility, and responsive design.

## Color System

### Primary Palette (NES-Inspired)

#### Light Mode
```css
--pixel-green: #92CD41;         /* Primary action color, NES green */
--pixel-green-dark: #4AA52E;    /* Shadow/border for green */
--pixel-yellow: #F7D51D;        /* Warning/attention color */
--pixel-yellow-dark: #E59400;   /* Shadow/border for yellow */
--pixel-red: #E76E55;           /* Destructive/error color */
--pixel-red-dark: #8C2022;      /* Shadow/border for red */
--pixel-blue: #209CDC;          /* Info/secondary color */
--pixel-blue-dark: #1565C0;     /* Shadow/border for blue */
```

#### Dark Mode
```css
--pixel-green: #76C442;         /* Slightly muted for dark backgrounds */
--pixel-green-dark: #3A6B1E;    /* Darker shadow for contrast */
--pixel-yellow: #F2C409;        /* Adjusted for dark mode visibility */
--pixel-yellow-dark: #C89200;   /* Darker shadow */
--pixel-red: #CE372B;           /* Adjusted red */
--pixel-red-dark: #6B1A14;      /* Darker shadow */
--pixel-blue: #1976D2;          /* Adjusted blue */
--pixel-blue-dark: #0D47A1;     /* Darker shadow */
```

### Color Usage Guidelines

- **Green**: Primary actions, success states, progress indicators
- **Yellow**: Warnings, beta features, energy bars
- **Red**: Destructive actions, errors, health warnings
- **Blue**: Information, secondary actions, mana/magic indicators
- **Outline**: Neutral/ghost actions, less prominent elements

## Typography

### Fonts

#### Pixel Font (Primary for 8-bit elements)
```css
--font-press-start: 'Press Start 2P', cursive;
```

**Usage:**
- Headings in pixel components
- Button text
- Badge labels
- Progress indicators
- Small accent text

**Best Practices:**
- Optimal size: 10-16px
- Line height: 1.6 (increased for readability)
- Use sparingly for body text (readability concerns)
- Excellent for headings and CTAs

**Class:** `.font-pixel`

#### Standard Fonts (For body content)
- Sans: Geist Sans (existing)
- Mono: Geist Mono (existing)

### Font Rendering
```css
image-rendering: pixelated;
-webkit-font-smoothing: none;
-moz-osx-font-smoothing: grayscale;
```

## Spacing & Borders

### Border System

All pixel components use **zero border-radius** for authentic blocky aesthetics:

```css
--radius-pixel: 0px;
```

**Border Widths:**
- Standard: `4px`
- Thin: `2px`
- Thick (cards): `4px`

### Shadow System

#### NES-Style Box Shadows (3D Effect)

**Default Button Shadow:**
```css
box-shadow: inset -4px -4px 0 0 rgba(0, 0, 0, 0.2);
```

**Hover State:**
```css
box-shadow: inset -6px -6px 0 0 rgba(0, 0, 0, 0.2);
```

**Active/Pressed State:**
```css
box-shadow: inset 4px 4px 0 0 rgba(0, 0, 0, 0.2);
```

**Utility Classes:**
- `.nes-btn-shadow` - Default button shadow
- `.nes-btn-shadow-active` - Pressed button shadow
- `.pixel-shadow` - 4px offset shadow
- `.pixel-shadow-lg` - 6px offset shadow
- `.pixel-shadow-inset` - Inset depth shadow

### Spacing Scale

Follow 4px increments for pixel-perfect alignment:
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px

## Visual Effects

### Background Patterns

#### Grid Pattern
```css
.pixel-grid-bg {
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

#### Dot Matrix Pattern
```css
.pixel-dots-bg {
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 16px 16px;
}
```

#### Scanlines (CRT Effect)
```css
.pixel-scanlines::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0.05) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 1;
}
```

### Text Effects

#### Retro Glow
```css
.retro-glow {
  text-shadow: 
    0 0 5px currentColor,
    0 0 10px currentColor;
}
```

### Additional Patterns (pixel-patterns.css)

1. **Bricks**: Repeating brick pattern
2. **Checkerboard**: Classic 8-bit checkerboard
3. **Diagonal**: Diagonal stripe pattern
4. **Dense Dots**: Tighter dot matrix
5. **Cross**: Grid cross pattern
6. **Circuit**: Tech-inspired grid

## Component Specifications

### PixelButton

**Dimensions:**
- Small: `h-9 px-4 py-2`
- Default: `h-12 px-6 py-3`
- Large: `h-14 px-8 py-4`
- Icon: `h-10 w-10`

**Visual States:**
1. Default: Inset shadow (-4px -4px)
2. Hover: Enhanced shadow (-6px -6px)
3. Active: Inverted shadow (4px 4px)
4. Disabled: 50% opacity

### PixelCard

**Structure:**
- Border: 4px solid foreground
- Shadow: 4px offset
- Sections: Header, Content, Footer
- Section dividers: 4px border

### RetroBadge

**Dimensions:**
- Small: `px-2 py-1 text-[8px]`
- Default: `px-3 py-1.5 text-[10px]`
- Large: `px-4 py-2 text-xs`

**Visual:**
- Border: 2px solid
- Inset shadow: -2px -2px

### PixelProgress

**Structure:**
- Height: 32px (8px grid)
- Border: 4px solid
- Fill shadow: Inset -2px -2px
- Transition: 300ms ease-out

## Icon System

### Pixel Sprites

Located in `/public/pixel-sprites.svg`

**Available Icons:**
1. **Star** - Achievement, favorite
2. **Heart** - Health, likes
3. **Coin** - Currency, value
4. **Block** - Building, solid element
5. **Sparkle** - Effect, enhancement

**Specifications:**
- Grid: 32x32px base
- Pixel size: 4x4px blocks
- Format: SVG with `image-rendering: pixelated`

## Responsive Breakpoints

### Font Scaling
```
Mobile (< 640px):   10px pixel font
Tablet (640-1024px): 12px pixel font
Desktop (> 1024px):  14px pixel font
```

### Component Adjustments
- Shadows remain consistent across breakpoints
- Borders remain 4px on all screen sizes
- Grid patterns scale proportionally
- Icons scale with container size

## Accessibility

### Contrast Ratios
All pixel color combinations meet WCAG AA standards:
- Green on white: 4.5:1 minimum
- Yellow text uses black foreground for readability
- Dark mode colors adjusted for proper contrast

### Focus States
```css
focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

### Motion
- Respects `prefers-reduced-motion`
- Transitions: 300ms for smooth interaction
- Hover states provide clear feedback

## Animation Guidelines

### Framer Motion Integration

**Recommended Animations:**
```tsx
// Hover scale
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}

// Slide in
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

**8-Bit Specific:**
- Avoid smooth curves; prefer linear or stepped timing
- Use discrete position changes when possible
- Implement "frame-by-frame" style animations
- Keep animations snappy (200-400ms)

## Browser Support

### Modern Features Used
- CSS Custom Properties (variables)
- CSS Grid
- Flexbox
- Box-shadow (multiple layers)
- SVG with `use` element
- CSS Gradients

### Fallbacks
- Font stack includes fallback to monospace
- Patterns degrade gracefully without CSS
- Components remain functional without animations

## Performance Optimization

### CSS
- Patterns use gradients (no images)
- Minimal shadow layers (max 2-3)
- Variables reduce CSS size

### Fonts
- Single Google Font import
- Display: swap for fast rendering
- Subset option available

### SVG
- Sprite sheet reduces HTTP requests
- Inline SVG when appropriate
- Pixelated rendering is GPU-accelerated

## Implementation Checklist

✅ CSS variables in `globals.css`
✅ Utility classes defined
✅ Pixel font imported (Press Start 2P)
✅ Color palette (light/dark modes)
✅ Shadow system (NES-style)
✅ Background patterns
✅ PixelButton component
✅ PixelCard component
✅ RetroBadge component
✅ PixelInput component
✅ PixelProgress component
✅ PixelContainer component
✅ PixelIcon component
✅ SVG sprite sheet
✅ Pattern CSS file
✅ Component documentation
✅ Demo/showcase component

## Future Enhancements

Potential additions to the design system:
- PixelDialog/Modal
- PixelTooltip
- PixelTabs
- PixelSelect (dropdown)
- PixelCheckbox
- PixelRadio
- PixelSwitch
- Animated sprite sheets
- Sound effects integration
- Particle system
- More pixel icons
- Pattern customization utilities

## References

- **NES.css**: Inspiration for shadow technique
- **8bitcn.com**: Component pattern reference
- **Press Start 2P**: Google Fonts
- **Classic NES Games**: Color palette inspiration
- **Arcade UI Patterns**: Layout and spacing
