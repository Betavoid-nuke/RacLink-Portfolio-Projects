# Design plan — VELTRIX

## Brand brief
- **Brand name:** VELTRIX
- **Tagline:** Intelligence, Engineered.
- **Personality:** Computational intelligence, precision engineering, cross-language coding, adaptive software development, technical sophistication, powerful yet understated.
- **Vibe:** Precision Dark Engineering Instrument (obsidian surfaces, fine architectural hairlines, restrained violet & icy-blue illumination).

## Goal
- **Audience:** Software engineers, systems architects, and polyglot developers working across complex codebases.
- **The one action:** Request early access (`Get Early Access →`) or explore the interactive workflow (`Explore the Platform ↓`).
- **Feeling in 5 seconds:** "This is an extraordinary, precision-engineered computational system from the next generation of developer tools."

## Pages / screens
- `/` (VELTRIX flagship homepage — 5 distinct art-directed sections + sticky minimal navigation + early-access modal + complete footer)

## Page outline: `/` (Homepage)
| # | Section | Its job | Part (registry/item or lib) | Notes |
|---|---|---|---|---|
| 0 | Navigation | Orient + primary CTA + modal trigger | `Button`, `Sheet`, `Dialog` (`@/components/ui/*`) | Slim dark glass on scroll (`backdrop-blur-md`), custom geometric SVG symbol, keyboard accessible |
| 1 | Section 01 — The Hero | Immediate visual arrest + core promise + CTAs | Asymmetrical split + custom 3D-inspired SVG/CSS Intelligence Engine + floating syntax-highlighted code panels (`Python`, `TypeScript`, `Rust`, `Go`) | Exact headline: "One intelligence. Every language." (`Every language.` in violet-to-icy-blue gradient). Bottom bar with `MULTI-LANGUAGE`, `CONTEXT-AWARE`, `DEVELOPER-FOCUSED` |
| 2 | Section 02 — Intelligence | Show how logic connects across 7 languages | Interactive SVG/Canvas node graph + `Badge` + 3 editorial capability blocks (`Understand`, `Translate`, `Adapt`) | Central VELTRIX node connected to Python, TypeScript, JavaScript, Rust, Go, Java, C++ with hover/focus inspection |
| 3 | Section 03 — Capabilities | Showcase 6 core product capabilities | Asymmetrical bento grid using `Card`, `Tabs`, `Badge` (`@/components/ui/*`) | 01 Code Generation (2-col), 02 Code Understanding (tall), 03 Debugging, 04 Cross-Language Development (wide split), 05 Refactoring, 06 Development Workflow |
| 4 | Section 04 — How It Works | Interactive 4-step developer workspace | Interactive simulated IDE (`Tabs`, `Select`, `Button`, `Input`, `Badge`) | Steps: `01 Describe`, `02 Understand`, `03 Generate`, `04 Refine` + language selector, prompt input, simulated loading state, code output, reset action |
| 5 | Section 05 — Final CTA | Memorable closing conversion composition | Restrained geometric horizon SVG + `Button` + Early Access `Dialog` | Headline: "Your next breakthrough starts with an idea." |
| 6 | Footer | Navigation, documentation/resource drawers, legal | Semantic footer + interactive documentation/legal modal viewers | Current year copyright, zero dead links |

## Tokens
- **Colours (OKLCH + Brand Hex):**
  - Background (`#07080C`): `oklch(0.132 0.014 272)`
  - Secondary background (`#0B0D13`): `oklch(0.158 0.018 270)`
  - Elevated surfaces (`#11141D`): `oklch(0.192 0.022 268)`
  - Primary accent (`#9B7BFF` — signature violet): `oklch(0.675 0.195 292)`
  - Secondary accent (`#5CC8FF` — icy blue): `oklch(0.795 0.135 232)`
  - Primary text (`#F5F6FC`): `oklch(0.972 0.006 270)`
  - Secondary text (`#989DB0`): `oklch(0.695 0.025 272)`
  - Borders (`#242735`): `oklch(0.275 0.026 272)`
- **Typography:**
  - Headlines (`--font-heading` / `--font-display`): `Space Grotesk` (weights 500, 600, 700; tight tracking `-0.03em`)
  - Body (`--font-sans`): `Inter` (weights 400, 500, 600)
  - Code & technical labels (`--font-mono`): `JetBrains Mono` (weights 400, 500; uppercase tracking for labels)
- **Radius, Shadows & Motion:**
  - Radius: `0.625rem` (`10px` base, sharp technical precision)
  - Shadows: `--shadow-soft`, `--shadow-lifted`, `--highlight-inset`
  - Motion: `--duration-fast: 150ms`, `--duration-base: 220ms`, `--duration-slow: 450ms`, `--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1)`

## Install list
- Installed via `stack.scaffold`: `next`, `react`, `tailwindcss`, `motion`, `lucide-react`, `radix-ui`, `sonner`, and `@/components/ui/*` (`button`, `card`, `dialog`, `input`, `label`, `select`, `sheet`, `tabs`, `textarea`, `tooltip`, `badge`, `separator`, `field`).

## States to cover
- **Navigation & Mobile Menu:** Default, hover, focus-visible ring, active section indicator, scrolled glass state, mobile `Sheet` open/close + Escape key.
- **Early Access Modal (`Dialog`):** Default, field blur/submit validation (Name, Email, Primary Language, Intended Use), error messages next to fields, loading spinner on submit, honest simulated preview confirmation state (explicitly noting no live backend storage), Escape/close focus restoration.
- **Section 02 Language Graph:** Node default, hover, keyboard focus-visible, selected active state updating the inspection panel.
- **Section 04 Interactive Workspace:** Step selector (`01`–`04`), language selector (`Python`, `TypeScript`, `Rust`, `Go`), prompt input editing, `Generate` button loading state (blocks double submit), simulated result state, and `Reset` action.

## Done when
- `npm run lint`, `npm run typecheck`, `npm run build`, and `ui-audit` pass with 0 errors
- `PREMIUM_CHECKLIST` all yes
- Responsive and art-directed across 375px, 768px, 1280px, and 1536px
