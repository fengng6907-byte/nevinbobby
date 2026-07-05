# ENCORE v2 — "Living Digital City" Design System

## Concept
The app presents itself as a holographic operating system: users land in an
interactive miniature city where landmarks are application modules.

## Tokens (globals.css `@theme`)
| Token | Value | Use |
| --- | --- | --- |
| `bg-primary` | `#030B29` | page background (under ambient layer) |
| `bg-card` | `#0A1748` | opaque card fallback |
| `bg-elevated` | `#0E1F5C` | inputs, nested surfaces |
| `border-subtle` | `#24408F` | hairline borders |
| `text-secondary` | `#8FA6E0` | muted copy |
| `accent-cyan` | `#00D8FF` | primary accent / active state |
| `accent-blue` | `#5A68FF` | secondary neon |
| `accent-aqua` | `#6CF9FF` | highlights, glows |

Amber = tips/gold, Emerald = money/open, Rose = booked. Unchanged semantics.

## Surfaces
- `.glass` — light frosted panel (nav dock, chips)
- `.glass-deep` — deep blue frosted card (content cards, HUD panels)
- `.neon-ring` — gradient border ring overlay
- `.glow-cyan`, `.text-glow` — volumetric glow

## Motion
- Ambient: `encore-ambient` grid drift, orbs, rising particles (in `layout.tsx`)
- City: `hud-float*`, `beacon-pulse`, `wifi-wave`, `window-blink`,
  `building-scan`, `eq-bar` keyframes
- `SoundWave.tsx`: canvas waveform — idle layered sines; mouse/touch proximity
  amplifies bars with gaussian falloff (hero, Live Bands + Tip Jar headers)
- Page transitions + micro-interactions via Framer Motion
- All ambient/decorative animation disabled under `prefers-reduced-motion`

## Structure
- `CityLanding.tsx` — hero city (SVG skyline, landmark chips, HUD panels with
  live app data, mouse-parallax via springs)
- Landmarks → modules: Twin Towers → Live Bands, KL Tower → Discover,
  Merdeka 118 → Tip Jar
- Business logic untouched: `EncoreContext`, `/api/places`, booking, bids,
  song requests all preserved.

## Type
Space Grotesk (`next/font`), monospaced numerals for stats (`font-mono`).
