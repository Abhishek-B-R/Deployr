# Quick Start: 8-Bit UI Components

Get up and running with the 8-bit retro gaming visual language in under 5 minutes.

## Installation

✅ **Already installed!** All components are integrated and ready to use.

## Import Components

```tsx
import {
  PixelButton,
  PixelCard,
  PixelCardHeader,
  PixelCardTitle,
  PixelCardContent,
  RetroBadge,
  PixelProgress,
  PixelContainer,
  PixelIcon,
} from "@/components/ui/pixel";
```

## Basic Usage

### 1. Simple Button

```tsx
<PixelButton variant="default">Click Me!</PixelButton>
```

### 2. Card with Content

```tsx
<PixelCard>
  <PixelCardHeader>
    <PixelCardTitle>Welcome</PixelCardTitle>
  </PixelCardHeader>
  <PixelCardContent>
    <p>Your 8-bit adventure starts here!</p>
  </PixelCardContent>
</PixelCard>
```

### 3. Badge

```tsx
<RetroBadge variant="yellow">NEW</RetroBadge>
```

### 4. Progress Bar

```tsx
<PixelProgress value={75} max={100} variant="default" />
```

### 5. Icon

```tsx
<PixelIcon name="star" size={24} />
```

## Color Variants

All components support these variants:
- `default` (green) - Primary actions
- `yellow` - Warnings, attention
- `red` - Destructive, errors
- `blue` - Info, secondary
- `outline` - Ghost/neutral

## Utility Classes

### Pixel Font
```tsx
<h1 className="font-pixel text-xs">8-Bit Text</h1>
```

### Background Patterns
```tsx
<div className="pixel-grid-bg p-8">
  Grid background
</div>

<div className="pixel-dots-bg p-8">
  Dot matrix background
</div>
```

### Shadows
```tsx
<div className="pixel-shadow">
  Drop shadow
</div>
```

## Animation with Framer Motion

```tsx
import { motion } from "framer-motion";

<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  <PixelButton>Animated!</PixelButton>
</motion.div>
```

## Complete Example

```tsx
import { motion } from "framer-motion";
import {
  PixelCard,
  PixelCardHeader,
  PixelCardTitle,
  PixelCardContent,
  PixelButton,
  RetroBadge,
  PixelProgress,
  PixelIcon,
} from "@/components/ui/pixel";

export default function GameCard() {
  return (
    <PixelCard>
      <PixelCardHeader>
        <div className="flex items-center justify-between">
          <PixelCardTitle className="flex items-center gap-2">
            <PixelIcon name="star" size={20} />
            Player Status
          </PixelCardTitle>
          <RetroBadge variant="yellow">LEVEL 5</RetroBadge>
        </div>
      </PixelCardHeader>
      <PixelCardContent className="space-y-4">
        <div>
          <div className="flex justify-between font-pixel text-xs mb-2">
            <span>HP</span>
            <span>85/100</span>
          </div>
          <PixelProgress value={85} max={100} variant="red" />
        </div>
        
        <div>
          <div className="flex justify-between font-pixel text-xs mb-2">
            <span>XP</span>
            <span>1250/2000</span>
          </div>
          <PixelProgress value={1250} max={2000} variant="yellow" />
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <PixelButton className="w-full" variant="default">
            Continue Adventure
          </PixelButton>
        </motion.div>
      </PixelCardContent>
    </PixelCard>
  );
}
```

## Live Demo

See `components/Landing/PixelShowcase.tsx` for a complete showcase of all components.

## Documentation

- **Full Catalog**: See `8BIT_CATALOG.md` for comprehensive component reference
- **Design System**: See `DESIGN_TOKENS.md` for design tokens and guidelines
- **Component Docs**: See `components/ui/pixel/README.md` for detailed API

## Tips

1. **Font Size**: Pixel fonts work best at 10-16px (`text-xs` to `text-sm`)
2. **Spacing**: Use multiples of 4px for pixel-perfect layouts
3. **Dark Mode**: All components automatically adapt to dark theme
4. **Accessibility**: Maintain proper color contrast (pre-configured)
5. **Mobile**: Test responsiveness; pixel fonts can be hard to read small

## Need Help?

Check the full documentation:
- `8BIT_CATALOG.md` - Complete component catalog with examples
- `DESIGN_TOKENS.md` - Design system reference
- `components/ui/pixel/README.md` - API documentation

## Common Patterns

### Hero Section
```tsx
<PixelContainer variant="scanlines" className="min-h-screen">
  <h1 className="font-pixel text-lg">START GAME</h1>
  <PixelButton size="lg">PRESS START</PixelButton>
</PixelContainer>
```

### Feature Grid
```tsx
<div className="grid md:grid-cols-3 gap-6">
  {features.map(feature => (
    <PixelCard key={feature.id}>
      <PixelCardContent>
        <PixelIcon name={feature.icon} size={32} />
        <h3 className="font-pixel text-xs">{feature.title}</h3>
      </PixelCardContent>
    </PixelCard>
  ))}
</div>
```

### Status Dashboard
```tsx
<div className="space-y-4">
  <PixelProgress value={hp} max={100} variant="red" />
  <PixelProgress value={mana} max={100} variant="blue" />
  <PixelProgress value={xp} max={100} variant="yellow" />
</div>
```

Happy building! 🎮✨
