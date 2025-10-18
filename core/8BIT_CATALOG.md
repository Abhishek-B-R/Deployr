# 8-Bit Component Library Catalog

This catalog documents all reusable pixel-themed patterns, components, and utilities created for the Deployr landing page's 8-bit visual language.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Design Tokens](#design-tokens)
3. [UI Components](#ui-components)
4. [Utility Classes](#utility-classes)
5. [Static Assets](#static-assets)
6. [Usage Examples](#usage-examples)

---

## Quick Start

### Installation

All components are already integrated into the project. To use them:

```tsx
import { 
  PixelButton, 
  PixelCard, 
  RetroBadge 
} from "@/components/ui/pixel";
```

### Basic Example

```tsx
import { PixelButton, PixelCard, PixelCardContent } from "@/components/ui/pixel";

export default function MyComponent() {
  return (
    <PixelCard>
      <PixelCardContent>
        <h3 className="font-pixel text-xs">Welcome Player!</h3>
        <PixelButton variant="default">Start Game</PixelButton>
      </PixelCardContent>
    </PixelCard>
  );
}
```

---

## Design Tokens

### Color Variables

#### CSS Custom Properties

```css
/* Light Mode */
--pixel-green: #92CD41;
--pixel-green-dark: #4AA52E;
--pixel-yellow: #F7D51D;
--pixel-yellow-dark: #E59400;
--pixel-red: #E76E55;
--pixel-red-dark: #8C2022;
--pixel-blue: #209CDC;
--pixel-blue-dark: #1565C0;

/* Dark Mode (automatically applied) */
--pixel-green: #76C442;
--pixel-green-dark: #3A6B1E;
/* ... (see DESIGN_TOKENS.md for full list) */
```

#### Tailwind Usage

```tsx
<div className="bg-[var(--pixel-green)] border-[var(--pixel-green-dark)]">
  Green themed element
</div>
```

### Typography

**Pixel Font:**
- Font Family: `'Press Start 2P', cursive`
- Class: `.font-pixel`
- Best at: 10-16px

```tsx
<h1 className="font-pixel text-sm">8-Bit Heading</h1>
```

### Border Radius

All pixel components use:
```css
--radius-pixel: 0px;
border-radius: 0;
```

---

## UI Components

### 1. PixelButton

**Location:** `components/ui/pixel-button.tsx`

**Variants:**
- `default` (green) - Primary actions
- `yellow` - Warning/attention
- `red` - Destructive
- `blue` - Info/secondary
- `outline` - Ghost style

**Sizes:**
- `sm` - Small button
- `default` - Standard size
- `lg` - Large button
- `icon` - Square icon button

**Features:**
- NES-style inset shadows
- Press animation (shadow flips on click)
- Hover effect (shadow deepens)
- Disabled state support

**Example:**
```tsx
<PixelButton variant="default" size="lg">
  Start Adventure
</PixelButton>

<PixelButton variant="red" onClick={handleDelete}>
  Delete
</PixelButton>
```

### 2. PixelCard

**Location:** `components/ui/pixel-card.tsx`

**Components:**
- `PixelCard` - Main container
- `PixelCardHeader` - Header section with border
- `PixelCardTitle` - Pixel font title
- `PixelCardDescription` - Subtitle text
- `PixelCardContent` - Main content area
- `PixelCardFooter` - Footer with border

**Features:**
- 4px borders
- Drop shadow
- Section dividers
- Responsive padding

**Example:**
```tsx
<PixelCard>
  <PixelCardHeader>
    <PixelCardTitle>Level Complete</PixelCardTitle>
    <PixelCardDescription>You earned 100 points!</PixelCardDescription>
  </PixelCardHeader>
  <PixelCardContent>
    <p>Next level unlocked...</p>
  </PixelCardContent>
  <PixelCardFooter>
    <PixelButton>Continue</PixelButton>
  </PixelCardFooter>
</PixelCard>
```

### 3. RetroBadge

**Location:** `components/ui/retro-badge.tsx`

**Variants:**
- `default` (green)
- `yellow`
- `red`
- `blue`
- `outline`
- `ghost`

**Sizes:**
- `sm` - 8px font
- `default` - 10px font
- `lg` - 12px font

**Features:**
- Pixel font
- Inset shadows
- Color-coded borders

**Example:**
```tsx
<RetroBadge variant="yellow">NEW</RetroBadge>
<RetroBadge variant="red" size="sm">HOT</RetroBadge>
<RetroBadge variant="outline">BETA</RetroBadge>
```

### 4. PixelInput

**Location:** `components/ui/pixel-input.tsx`

**Features:**
- Blocky borders (4px)
- Inset shadow for depth
- Pixel font
- Focus ring
- Disabled state

**Example:**
```tsx
<PixelInput 
  placeholder="Enter player name..." 
  className="w-full"
/>
```

### 5. PixelProgress

**Location:** `components/ui/pixel-progress.tsx`

**Variants:**
- `default` (green) - Health, success
- `yellow` - XP, warning
- `red` - Danger, low health
- `blue` - Mana, info

**Features:**
- Game-style progress bar
- Smooth transitions
- Percentage-based
- Inset shadow on fill

**Example:**
```tsx
<PixelProgress value={75} max={100} variant="default" />
<PixelProgress value={30} max={100} variant="red" />
```

**Advanced Example:**
```tsx
<div>
  <div className="flex justify-between font-pixel text-xs mb-2">
    <span>HP</span>
    <span>{health}/{maxHealth}</span>
  </div>
  <PixelProgress value={health} max={maxHealth} variant="red" />
</div>
```

### 6. PixelContainer

**Location:** `components/ui/pixel-container.tsx`

**Variants:**
- `default` - Plain wrapper
- `grid` - Grid pattern background
- `dots` - Dot matrix pattern
- `scanlines` - CRT scanline effect

**Features:**
- Background pattern overlays
- Responsive
- Works as layout wrapper

**Example:**
```tsx
<PixelContainer variant="grid" className="p-8">
  {/* Your content */}
</PixelContainer>
```

### 7. PixelIcon

**Location:** `components/ui/pixel-icon.tsx`

**Available Icons:**
- `star` - Achievement, favorite
- `heart` - Health, likes
- `coin` - Currency, points
- `block` - Solid element
- `sparkle` - Effect, magic

**Features:**
- SVG-based pixel art
- Scalable with size prop
- Color inherits from currentColor

**Example:**
```tsx
<PixelIcon name="star" size={24} className="text-yellow-500" />
<PixelIcon name="heart" size={32} className="text-red-500" />
```

---

## Utility Classes

### Font

| Class | Effect |
|-------|--------|
| `.font-pixel` | Apply Press Start 2P font with optimal settings |

### Shadows

| Class | Effect |
|-------|--------|
| `.pixel-shadow` | 4px offset shadow |
| `.pixel-shadow-lg` | 6px offset shadow |
| `.pixel-shadow-inset` | Inset shadow for depth |
| `.nes-btn-shadow` | NES button default shadow |
| `.nes-btn-shadow-active` | Pressed button shadow |

### Borders

| Class | Effect |
|-------|--------|
| `.pixel-border` | 4px border with corner effects |
| `.pixel-corners` | Clipped pixel corners |

### Backgrounds

| Class | Effect |
|-------|--------|
| `.pixel-grid-bg` | Grid pattern overlay |
| `.pixel-dots-bg` | Dot matrix pattern |
| `.pixel-scanlines` | CRT scanline effect |

### Additional Patterns (from pixel-patterns.css)

| Class | Effect |
|-------|--------|
| `.pixel-pattern-bricks` | Brick wall pattern |
| `.pixel-pattern-checkerboard` | Checkerboard pattern |
| `.pixel-pattern-diagonal` | Diagonal stripes |
| `.pixel-pattern-dots-dense` | Dense dot matrix |
| `.pixel-pattern-cross` | Grid cross pattern |
| `.pixel-pattern-circuit` | Circuit board style |

### Effects

| Class | Effect |
|-------|--------|
| `.retro-glow` | Text glow effect |

---

## Static Assets

### SVG Sprite Sheet

**Location:** `/public/pixel-sprites.svg`

**Usage:**
```tsx
<svg width="24" height="24">
  <use href="/pixel-sprites.svg#pixel-star" />
</svg>
```

**Icons in Sprite:**
- `#pixel-star`
- `#pixel-heart`
- `#pixel-coin`
- `#pixel-block`
- `#pixel-sparkle`

### Pattern CSS

**Location:** `/public/pixel-patterns.css`

Import in your component:
```tsx
import "/pixel-patterns.css";
```

---

## Usage Examples

### Example 1: Retro Button Group

```tsx
import { PixelButton } from "@/components/ui/pixel";

export function GameMenu() {
  return (
    <div className="space-y-4">
      <PixelButton className="w-full" variant="default">
        New Game
      </PixelButton>
      <PixelButton className="w-full" variant="blue">
        Continue
      </PixelButton>
      <PixelButton className="w-full" variant="yellow">
        Settings
      </PixelButton>
      <PixelButton className="w-full" variant="red">
        Quit
      </PixelButton>
    </div>
  );
}
```

### Example 2: Status Display

```tsx
import { PixelCard, PixelProgress, PixelIcon } from "@/components/ui/pixel";

export function PlayerStatus() {
  return (
    <PixelCard>
      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-center gap-2 font-pixel text-xs mb-2">
            <PixelIcon name="heart" size={16} className="text-red-500" />
            <span>HEALTH</span>
          </div>
          <PixelProgress value={85} max={100} variant="red" />
        </div>
        <div>
          <div className="flex items-center gap-2 font-pixel text-xs mb-2">
            <PixelIcon name="sparkle" size={16} className="text-blue-500" />
            <span>MANA</span>
          </div>
          <PixelProgress value={60} max={100} variant="blue" />
        </div>
        <div>
          <div className="flex items-center gap-2 font-pixel text-xs mb-2">
            <PixelIcon name="star" size={16} className="text-yellow-500" />
            <span>XP</span>
          </div>
          <PixelProgress value={42} max={100} variant="yellow" />
        </div>
      </div>
    </PixelCard>
  );
}
```

### Example 3: Achievement Card

```tsx
import { 
  PixelCard, 
  PixelCardHeader, 
  PixelCardTitle, 
  PixelCardContent,
  RetroBadge,
  PixelIcon 
} from "@/components/ui/pixel";

export function Achievement() {
  return (
    <PixelCard>
      <PixelCardHeader>
        <div className="flex items-center justify-between">
          <PixelCardTitle className="flex items-center gap-2">
            <PixelIcon name="star" size={20} className="text-yellow-500" />
            First Deploy
          </PixelCardTitle>
          <RetroBadge variant="yellow">NEW</RetroBadge>
        </div>
      </PixelCardHeader>
      <PixelCardContent>
        <p className="text-sm">
          You've completed your first deployment! Keep up the great work!
        </p>
        <div className="mt-4 flex gap-2">
          <PixelIcon name="coin" size={24} className="text-yellow-500" />
          <span className="font-pixel text-xs">+100 XP</span>
        </div>
      </PixelCardContent>
    </PixelCard>
  );
}
```

### Example 4: Animated Hero Section

```tsx
import { motion } from "framer-motion";
import { PixelButton, PixelContainer, PixelIcon } from "@/components/ui/pixel";

export function PixelHero() {
  return (
    <PixelContainer variant="scanlines" className="min-h-screen flex items-center">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <PixelIcon name="star" size={64} className="text-yellow-500 mb-8" />
        </motion.div>
        
        <motion.h1 
          className="font-pixel text-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          START YOUR ADVENTURE
        </motion.h1>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PixelButton size="lg" variant="default">
            PRESS START
          </PixelButton>
        </motion.div>
      </div>
    </PixelContainer>
  );
}
```

### Example 5: Feature Grid with Patterns

```tsx
import { PixelCard, PixelCardContent, RetroBadge } from "@/components/ui/pixel";

export function Features() {
  const features = [
    { title: "Fast Deploy", badge: "NEW", pattern: "pixel-pattern-circuit" },
    { title: "Auto Scale", badge: "PRO", pattern: "pixel-pattern-grid" },
    { title: "Zero Config", badge: "FREE", pattern: "pixel-pattern-dots" },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {features.map((feature) => (
        <PixelCard key={feature.title}>
          <div className={`h-32 ${feature.pattern} border-b-4 border-foreground`} />
          <PixelCardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-pixel text-xs">{feature.title}</h3>
              <RetroBadge variant="yellow" size="sm">
                {feature.badge}
              </RetroBadge>
            </div>
            <p className="text-sm text-muted-foreground">
              Description of the feature goes here.
            </p>
          </PixelCardContent>
        </PixelCard>
      ))}
    </div>
  );
}
```

---

## Integration with Existing Components

### Mixing with Standard Shadcn Components

You can mix pixel components with standard components:

```tsx
import { Button } from "@/components/ui/button";
import { PixelButton } from "@/components/ui/pixel";

export function MixedButtons() {
  return (
    <div className="flex gap-4">
      <Button>Standard Button</Button>
      <PixelButton variant="default">Pixel Button</PixelButton>
    </div>
  );
}
```

### Theming

All pixel components respect the dark mode theme:

```tsx
import { useTheme } from "next-themes";
import { PixelCard } from "@/components/ui/pixel";

export function ThemedCard() {
  const { theme } = useTheme();
  
  return (
    <PixelCard>
      {/* Colors automatically adjust based on theme */}
    </PixelCard>
  );
}
```

---

## Files Reference

| File | Description |
|------|-------------|
| `app/globals.css` | Design tokens, utility classes, color palette |
| `components/ui/pixel-button.tsx` | PixelButton component |
| `components/ui/pixel-card.tsx` | PixelCard and subcomponents |
| `components/ui/retro-badge.tsx` | RetroBadge component |
| `components/ui/pixel-input.tsx` | PixelInput component |
| `components/ui/pixel-progress.tsx` | PixelProgress component |
| `components/ui/pixel-container.tsx` | PixelContainer wrapper |
| `components/ui/pixel-icon.tsx` | PixelIcon component |
| `components/ui/pixel/index.ts` | Barrel export for all pixel components |
| `public/pixel-sprites.svg` | SVG sprite sheet for icons |
| `public/pixel-patterns.css` | Additional background patterns |
| `DESIGN_TOKENS.md` | Comprehensive design system documentation |
| `components/Landing/PixelShowcase.tsx` | Live demo component |

---

## Best Practices

1. **Font Usage**: Use `.font-pixel` sparingly; it's best for headings and CTAs
2. **Color Consistency**: Stick to the predefined color variants for cohesion
3. **Spacing**: Use 4px increments (Tailwind's default scale works well)
4. **Accessibility**: Always maintain proper color contrast
5. **Performance**: Use CSS patterns instead of images when possible
6. **Responsive**: Test on mobile; pixel fonts can be hard to read at small sizes

---

## Support & Resources

- **Component Docs**: See individual component files for TypeScript types
- **Design Tokens**: Full reference in `DESIGN_TOKENS.md`
- **Live Demo**: Check `PixelShowcase` component for working examples
- **Inspiration**: Based on NES.css and 8bitcn.com patterns
