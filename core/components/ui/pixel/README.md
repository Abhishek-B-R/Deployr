# 8-Bit Pixel UI Components

A collection of retro-styled, 8-bit themed UI components inspired by classic NES and arcade games. These components integrate seamlessly with the existing Tailwind/Shadcn stack while providing an authentic pixel art aesthetic.

## Design System

### Color Palette

The 8-bit color palette provides consistent retro gaming colors with dark mode support:

**Light Mode:**
- Green: `#92CD41` / Dark: `#4AA52E`
- Yellow: `#F7D51D` / Dark: `#E59400`
- Red: `#E76E55` / Dark: `#8C2022`
- Blue: `#209CDC` / Dark: `#1565C0`

**Dark Mode:**
Colors automatically adjust to maintain contrast and readability.

### Typography

- **Pixel Font**: Press Start 2P (Google Fonts)
- Usage: `.font-pixel` utility class
- Characteristics: Monospace, bitmap-style, optimal at 10-16px

### Visual Effects

#### Shadows
- `.pixel-shadow` - Standard 4px offset shadow
- `.pixel-shadow-lg` - Larger 6px offset shadow
- `.pixel-shadow-inset` - Inset shadow for depth
- `.nes-btn-shadow` - NES-style button shadow
- `.nes-btn-shadow-active` - Active button state

#### Borders
- `.pixel-border` - 4px solid border with corner styling
- All components use `border-radius: 0` for sharp pixel edges

#### Backgrounds
- `.pixel-grid-bg` - Grid pattern overlay
- `.pixel-dots-bg` - Dot matrix pattern
- `.pixel-scanlines` - CRT scanline effect

## Components

### PixelButton

Retro-styled button with blocky borders and inset shadows.

```tsx
import { PixelButton } from "@/components/ui/pixel";

<PixelButton variant="default">Start Game</PixelButton>
<PixelButton variant="yellow">Continue</PixelButton>
<PixelButton variant="red">Quit</PixelButton>
<PixelButton variant="blue">Options</PixelButton>
```

**Variants:**
- `default` (green) - Primary actions
- `yellow` - Warning/attention
- `red` - Destructive/cancel
- `blue` - Info/secondary
- `outline` - Ghost style

**Sizes:** `sm`, `default`, `lg`, `icon`

### PixelCard

8-bit styled card container with thick borders.

```tsx
import { 
  PixelCard, 
  PixelCardHeader, 
  PixelCardTitle,
  PixelCardContent 
} from "@/components/ui/pixel";

<PixelCard>
  <PixelCardHeader>
    <PixelCardTitle>Level 1</PixelCardTitle>
  </PixelCardHeader>
  <PixelCardContent>
    <p>Your adventure begins...</p>
  </PixelCardContent>
</PixelCard>
```

### RetroBadge

Small pixel-styled label/badge component.

```tsx
import { RetroBadge } from "@/components/ui/pixel";

<RetroBadge variant="default">New</RetroBadge>
<RetroBadge variant="yellow">Beta</RetroBadge>
<RetroBadge variant="red">Hot</RetroBadge>
```

### PixelInput

Retro text input with blocky styling.

```tsx
import { PixelInput } from "@/components/ui/pixel";

<PixelInput placeholder="Enter your name..." />
```

### PixelProgress

8-bit style progress bar (like game health bars).

```tsx
import { PixelProgress } from "@/components/ui/pixel";

<PixelProgress value={75} max={100} variant="default" />
<PixelProgress value={30} max={100} variant="red" />
```

### PixelContainer

Layout wrapper with optional background patterns.

```tsx
import { PixelContainer } from "@/components/ui/pixel";

<PixelContainer variant="grid">
  {/* Content */}
</PixelContainer>
```

**Variants:**
- `default` - Plain container
- `grid` - Grid pattern background
- `dots` - Dot matrix pattern
- `scanlines` - CRT scanline overlay

### PixelIcon

Pixel art SVG icons.

```tsx
import { PixelIcon } from "@/components/ui/pixel";

<PixelIcon name="star" size={24} />
<PixelIcon name="heart" size={32} />
<PixelIcon name="coin" size={24} />
```

**Available Icons:**
- `star` - 8-bit star
- `heart` - Pixel heart
- `coin` - Retro coin
- `block` - Pixel block
- `sparkle` - Sparkle effect

## Utility Classes

### Font
- `.font-pixel` - Apply pixel font

### Effects
- `.retro-glow` - Text glow effect
- `.pixel-corners` - Clipped pixel corners

### Patterns (from pixel-patterns.css)
- `.pixel-pattern-bricks`
- `.pixel-pattern-checkerboard`
- `.pixel-pattern-diagonal`
- `.pixel-pattern-dots-dense`
- `.pixel-pattern-cross`
- `.pixel-pattern-circuit`

## Integration with Framer Motion

All components support Framer Motion animations:

```tsx
import { motion } from "framer-motion";
import { PixelButton } from "@/components/ui/pixel";

<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <PixelButton>Animated!</PixelButton>
</motion.div>
```

## Responsive Design

Components are fully responsive:
- Pixel font scales appropriately at breakpoints
- Shadow/border sizes remain consistent
- Grid patterns adjust for mobile screens

## Dark Mode

All components automatically support dark mode through CSS variables:
- Colors adjust for proper contrast
- Shadows remain visible
- Patterns adapt opacity

## Best Practices

1. **Font Sizing**: Pixel fonts work best at 10-16px; use carefully for body text
2. **Contrast**: Always ensure sufficient contrast with 8-bit colors
3. **Spacing**: Use multiples of 4px for authentic pixel-perfect spacing
4. **Performance**: SVG sprites are optimized; backgrounds use CSS gradients
5. **Accessibility**: Components maintain ARIA support from Shadcn base

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with touch optimizations

## Examples

See `/components/Landing` for production usage examples.
