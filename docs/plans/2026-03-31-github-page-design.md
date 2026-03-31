# GitHub Personal Page Design — Particle Explosion Portrait

**Date:** 2026-03-31
**Status:** Approved

---

## Concept

A terminal-aesthetic GitHub personal page where ASCII characters form the owner's name as a particle field. Clicking anywhere triggers a physics-based explosion, after which characters reform into a bio card. Clicking again reforms back to the name. Powered by Pretext for pixel-perfect text layout at 60fps without DOM reflows.

---

## Architecture

- **Single file**: `index.html` — no build step, deploys directly to GitHub Pages
- **Rendering**: HTML5 Canvas 2D
- **Text layout**: `@chenglou/pretext` loaded via `https://esm.sh/@chenglou/pretext@0.0.2` as an ES module
- **Script**: `<script type="module">` inline in `index.html`
- **No Jekyll processing** needed — add `_config.yml` disabling Jekyll if required

---

## Interaction Flow

1. **Load** — black screen, blinking cursor for ~0.5s
2. **Materialize** — characters drift in from random positions and lock into `SAI KAUNG SAN` in large terminal block text
3. **Idle** — slow breathing pulse: characters flicker subtly in brightness
4. **Click/tap** — explosion: every character launches outward from the click point with physics (velocity, gravity, friction)
5. **Reform (bio state)** — characters home to new target positions forming the bio card layout
6. **Click again** — explosion → reform back to name state
7. Loop: toggles between name state and bio state

---

## Visual Design

- **Background**: `#0d0d0d` (near-black)
- **Primary color**: `#00ff41` (terminal green)
- **Dim color**: `#003b0f` (dark green for idle flicker)
- **Font**: monospace (Courier New or system monospace)
- **No images, no CSS frameworks, no external assets** beyond the Pretext CDN

---

## Bio Card Content (bio state)

```
SAI KAUNG SAN
──────────────────────────────────
CS @ Baruch College · NYC · GPA 3.838
Python · TypeScript · Next.js · React · ML

[Projects]
> Clinical Data Reconciliation Engine
> CoinPulse

[Award]
> Google × BASTA Innovation Challenge — Winner

> github.com/SaiChen22
> linkedin.com/in/sai-kaung-san-6ab676327
> saikaungsanchen@gmail.com
```

---

## Particle Physics

Each character is a particle with:
- `x, y` — current position
- `vx, vy` — velocity (set on explosion)
- `targetX, targetY` — destination in current layout state
- `char` — the ASCII character to render
- `brightness` — for idle pulse animation (0.0–1.0)

On click:
1. Compute vector from click point to each particle
2. Apply outward velocity scaled by inverse distance (closer = faster)
3. Apply gravity (`vy += 0.3` per frame) and friction (`vx *= 0.98`, `vy *= 0.98`)
4. Once particles slow down, switch target state and begin homing

Homing: each frame, `x += (targetX - x) * 0.08` (spring easing)

---

## Pretext Usage

Pretext calculates exact character positions for the bio card text layout:
- `prepare(text, "16px monospace")` → opaque handle
- `layoutWithLines(prepared, canvasWidth, lineHeight)` → `{ lines }` with per-line text and widths
- Used to map each character in the bio card to a precise `(x, y)` pixel coordinate
- Runs every frame resize — no DOM measurement, no reflow

---

## Deployment

1. Push `index.html` (and optionally `_config.yml`) to `main` branch of `SaiChen22.github.io`
2. GitHub Pages serves it automatically at `https://saichen22.github.io`
3. No CI, no build pipeline needed
