# Design Tour

## Overview

This app is designed specifically for **8.8″ ultrawide displays** with a focus on:
- **Visual polish** - Every interaction is smooth and intentional
- **Horizontal workflow** - Sections scroll left-to-right like a board
- **Keyboard-first** - Most actions accessible via shortcuts
- **Theme flexibility** - Full customization of colors, spacing, and effects

---

## Key UI Polish Details

### 1. Horizontal Kinetic Scrolling

The main layout uses CSS scroll-snap for smooth, physics-like scrolling between sections. The sections (Today/Upcoming/Someday) flow horizontally, optimized for ultrawide aspect ratios.

```css
.main-layout {
  scroll-snap-type: x proximity;
  scroll-behavior: smooth;
}
```

Each section snaps to the start, creating a "page-like" feel.

### 2. Micro-Interactions

All interactive elements have carefully crafted transitions:

- **Hover lifts**: Cards rise 2px on hover with a subtle shadow
- **Press scales**: Buttons scale to 0.98× when clicked
- **Completion morph**: Check circles fill with color on hover
- **Slide-up animations**: Modals enter from the bottom with 300ms ease-out

```css
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### 3. Custom Scrollbars

Default scrollbars are hidden and replaced with styled versions that match the theme:

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
  transition: background 0.2s;
}
```

### 4. Glass Morphism

Surface elements use backdrop-filter blur for depth and layering:

```css
.glass {
  background: rgba(255, 255, 255, var(--opacity-glass));
  backdrop-filter: blur(var(--blur-glass));
  -webkit-backdrop-filter: blur(var(--blur-glass));
}
```

The opacity and blur values are theme-configurable (default: 0.85 opacity, 16px blur).

### 5. Typography Optimization

Typography is tuned for ultrawide displays:

- **Tight letter-spacing** (-0.02em on headings) for compact feel
- **Optical size** support via system fonts
- **Line clamping** on task titles (max 2 lines) to prevent vertical bloat
- **Monospace for metadata** (due times, tags) for visual hierarchy

```css
.task-section-title {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}
```

### 6. Color Token System

All colors are CSS variables, updated live when themes change:

```css
:root {
  --color-primary: #6366f1;
  --color-secondary: #8b5cf6;
  --color-background: #0f172a;
  --color-surface: #1e293b;
  /* ... */
}
```

The theme store dynamically sets these via JavaScript:

```ts
root.style.setProperty('--color-primary', theme.colors.primary);
```

### 7. Spacing Scale

All spacing uses a **4px base unit** (--spacing-base):

- Gaps: `calc(var(--spacing-base) * 3)` = 12px
- Padding: `calc(var(--spacing-base) * 4)` = 16px
- Margins: `calc(var(--spacing-base) * 6)` = 24px

This creates mathematical consistency and makes responsive adjustments easy.

### 8. Accessibility

- **High-contrast theme option** (Noir Neon has 21:1 contrast ratio)
- **Keyboard-first navigation** with visible focus states
- **ARIA labels** on all interactive elements
- **Screen reader support** for task status changes

---

## Theme System Architecture

### Presets

Three curated themes are provided:

1. **Slate Glass** (default)
   - Dark blue-gray background
   - Soft purple accents
   - Heavy glass blur (16px)
   - Modern, professional

2. **Noir Neon**
   - Pure black background
   - Neon pink/cyan accents
   - Minimal blur (8px)
   - Cyberpunk aesthetic

3. **Paper Warm**
   - Cream background
   - Warm orange/brown tones
   - Serif fonts (Georgia)
   - Cozy, analog feel

### Theme Structure

```ts
interface Theme {
  name: string;
  colors: { primary, secondary, background, ... };
  spacing: { base: number };
  borderRadius: { sm, md, lg };
  opacity: { glass: number };
  blur: { glass: number };
  fonts: { body, heading, mono };
}
```

Themes are stored in localStorage and applied on mount.

---

## Responsive Behavior

### Display Profiles

The app adapts to three ultrawide resolutions:

- **1920×480** (default): Full spacing, standard font sizes
- **1280×400**: Slightly tighter spacing (base unit could be 3px)
- **1024×256**: Reduced font scale (0.8–0.9×), minimal padding

Users can set **Font Size Scale** in Settings (0.5–2.0×) to fine-tune.

### Fit to Display

A future "Fit to Display" button would:
1. Detect screen resolution
2. Snap window to nearest ultrawide ratio
3. Center on the target monitor
4. Adjust font scale automatically

---

## AI Integration Design

### Embedded Mode (Default)

1. User clicks **✨ Draft** on a task
2. AI Panel slides up from bottom (50% height)
3. Prompt is prefilled from task.aiPrompt or auto-generated
4. User clicks "Draft with Ollama"
5. Tokens stream in real-time with a glowing caret effect
6. User can edit the draft before copying or emailing

### External Mode

1. User clicks **✨ Draft**
2. App launches Ollama app (platform-specific command)
3. Prompt is copied to clipboard
4. Toast appears: "Prompt copied. Switch to Ollama and paste."

This fallback ensures compatibility even if Ollama HTTP API is blocked.

---

## Data Flow

### Task CRUD

1. **Frontend**: User interacts with UI
2. **Store**: Zustand state updates
3. **Command**: Invoke Tauri command (e.g., `create_task`)
4. **Backend**: Rust handler processes, updates SQLite
5. **Response**: Task returned, Zustand re-renders UI

### Scheduler

1. **Rust scheduler** (Tokio cron) runs every minute
2. Queries SQLite for tasks with `remindAt <= now`
3. Emits Tauri event: `reminder-due`
4. Frontend listens and shows toast + desktop notification
5. User can Complete, Snooze (10m/1h/tomorrow), or Open Task

---

## Future Enhancements

- **Emoji tag picker** with recent-emoji memory
- **Focus Mode**: Giant single-task view with progress dial
- **REST API** for adding tasks from other devices
- **Drag-and-drop** reordering within sections
- **Undo/Redo** with Cmd+Z
- **Export themes** as shareable JSON files
- **Custom command actions** (e.g., run a script when task completes)

---

## Performance Notes

- **SQLite indexing** on `section`, `completed_at`, `due_at` for fast queries
- **React.memo** on TaskCard for large lists
- **Debounced search** in command palette
- **Lazy-loaded modals** (AI Panel, Theme Editor only render when open)

---

## Codebase Philosophy

- **Prefer composition over configuration**
- **CSS Modules for scoping** (or Tailwind with semantic class names)
- **Single source of truth** (Zustand store mirrors SQLite)
- **Type safety everywhere** (strict TypeScript, Rust's type system)
- **No default UI vibes** - every element is intentionally styled

---

This design document captures the essence of the app's polish. Every pixel is considered, every transition is intentional. The result is a tool that feels as good as it looks.
