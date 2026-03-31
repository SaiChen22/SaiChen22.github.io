# Particle Explosion Portrait — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single `index.html` GitHub personal page where ASCII characters form "SAI KAUNG SAN" as a particle field, explode on click, and reform as a bio card — all at 60fps using Pretext for text layout.

**Architecture:** HTML5 Canvas 2D with a particle system. NAME state uses offscreen canvas pixel-sampling to cluster particles in the shape of the name. BIO state uses Pretext (`layoutWithLines`) to position each character of the bio text precisely. A state machine (MATERIALIZING → IDLE → EXPLODING → REFORMING) drives transitions. Single `index.html`, no build step.

**Tech Stack:** HTML5 Canvas, `@chenglou/pretext@0.0.2` via `https://esm.sh/@chenglou/pretext@0.0.2`, vanilla JS ES modules, GitHub Pages.

---

### Task 1: HTML Shell + Canvas

**Files:**
- Create: `index.html`

**Step 1: Create the file**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sai Kaung San</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0d0d0d; overflow: hidden; }
    canvas { display: block; cursor: crosshair; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script type="module">
    import { prepare, layoutWithLines } from 'https://esm.sh/@chenglou/pretext@0.0.2';

    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function loop() {
      ctx.fillStyle = '#0d0d0d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      requestAnimationFrame(loop);
    }
    loop();
  </script>
</body>
</html>
```

**Step 2: Verify**
Open `index.html` in browser. Expected: solid black screen, no console errors. Check Network tab — `esm.sh` request for `@chenglou/pretext` succeeds with HTTP 200.

**Step 3: Commit**
```bash
git add index.html
git commit -m "feat: add canvas shell with Pretext CDN import"
```

---

### Task 2: Name Particle Targets (Offscreen Canvas Sampling)

**Files:**
- Modify: `index.html` — add `buildNameTargets()` inside the `<script type="module">`

**Step 1: Add these constants and function before `loop()`**

```javascript
const ASCII_CHARS = '#@%$*!|/\\^~+-=<>';

function randomASCIIChar() {
  return ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
}

// Renders "SAI KAUNG SAN" to an offscreen canvas at large size,
// samples bright pixels at a fixed grid stride, returns { x, y, char }[].
function buildNameTargets(W, H) {
  const oc = document.createElement('canvas');
  oc.width = W; oc.height = H;
  const octx = oc.getContext('2d');

  const fontSize = Math.min(W / 5, H / 2.5);
  octx.fillStyle = '#000';
  octx.fillRect(0, 0, W, H);
  octx.fillStyle = '#fff';
  octx.font = `bold ${fontSize}px 'Courier New', monospace`;
  octx.textAlign = 'center';
  octx.textBaseline = 'middle';
  octx.fillText('SAI KAUNG SAN', W / 2, H / 2);

  const data = octx.getImageData(0, 0, W, H).data;
  const STEP = 14;
  const candidates = [];

  for (let y = STEP; y < H - STEP; y += STEP) {
    for (let x = STEP; x < W - STEP; x += STEP) {
      const idx = (y * W + x) * 4;
      if (data[idx] > 128) candidates.push({ x, y, char: randomASCIIChar() });
    }
  }

  // Subsample to cap at 350 particles
  const MAX = 350;
  if (candidates.length <= MAX) return candidates;
  const skip = Math.ceil(candidates.length / MAX);
  return candidates.filter((_, i) => i % skip === 0);
}
```

**Step 2: Verify** — add temporarily at the bottom of the module:
```javascript
console.log('name targets:', buildNameTargets(canvas.width, canvas.height).length);
```
Expected: prints a number between 150 and 350.

**Step 3: Remove the console.log, commit**
```bash
git add index.html
git commit -m "feat: add name particle target sampling from offscreen canvas"
```

---

### Task 3: Bio Particle Targets with Pretext

**Files:**
- Modify: `index.html` — add `BIO_TEXT` constant and `buildBioTargets()` function

**Step 1: Add after `buildNameTargets()`**

```javascript
const BIO_TEXT =
`SAI KAUNG SAN
--------------------------------
CS @ Baruch College  NYC  GPA 3.838
Python  TypeScript  Next.js  React  ML

[PROJECTS]
> Clinical Data Reconciliation Engine
> CoinPulse

[AWARD]
> Google x BASTA Innovation - Winner

> github.com/SaiChen22
> linkedin.com/in/sai-kaung-san
> saikaungsanchen@gmail.com`;

// Uses Pretext layoutWithLines to wrap BIO_TEXT at the canvas width,
// then maps every character to a precise (x, y) pixel coordinate.
function buildBioTargets(W, H) {
  const FONT_SIZE = Math.max(11, Math.min(15, Math.floor(W / 90)));
  const FONT = `${FONT_SIZE}px 'Courier New', monospace`;
  const LINE_HEIGHT = Math.floor(FONT_SIZE * 1.6);
  const PADDING = Math.floor(W * 0.08);
  const maxWidth = W - 2 * PADDING;

  // Measure monospace char width once using canvas (all chars same width)
  const oc = document.createElement('canvas');
  const octx = oc.getContext('2d');
  octx.font = FONT;
  const charWidth = octx.measureText('M').width;

  const prepared = prepare(BIO_TEXT, FONT);
  const { lines, height } = layoutWithLines(prepared, maxWidth, LINE_HEIGHT);

  const startY = Math.floor((H - height) / 2);
  const targets = [];

  lines.forEach((line, li) => {
    const y = startY + li * LINE_HEIGHT;
    for (let i = 0; i < line.text.length; i++) {
      targets.push({
        x: PADDING + i * charWidth,
        y,
        char: line.text[i],
      });
    }
  });

  return targets;
}
```

**Step 2: Verify** — add temporarily:
```javascript
const bt = buildBioTargets(canvas.width, canvas.height);
console.log('bio targets:', bt.length, 'first char:', bt[0]);
```
Expected: 200–400 targets, first entry has `{ x, y, char: 'S' }`.

**Step 3: Remove console.log, commit**
```bash
git add index.html
git commit -m "feat: add bio particle targets using Pretext layoutWithLines"
```

---

### Task 4: Particle Array

**Files:**
- Modify: `index.html` — add `buildParticles()` and initialize the particle array

**Step 1: Add `buildParticles()` after the target-building functions**

```javascript
// Creates one particle per slot (count = max of name and bio target lengths).
// Each particle holds targets for both states so it can smoothly switch.
function buildParticles(nameTargets, bioTargets, W, H) {
  const count = Math.max(nameTargets.length, bioTargets.length);
  return Array.from({ length: count }, (_, i) => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: 0, vy: 0,
    nameX: nameTargets[i]?.x ?? -200,
    nameY: nameTargets[i]?.y ?? -200,
    nameChar: nameTargets[i]?.char ?? ' ',
    bioX:  bioTargets[i]?.x  ?? -200,
    bioY:  bioTargets[i]?.y  ?? -200,
    bioChar:  bioTargets[i]?.char  ?? ' ',
    char: nameTargets[i]?.char ?? ' ',
    alpha: 0,
    phase: Math.random() * Math.PI * 2,
  }));
}
```

**Step 2: Initialize at module startup** (replace the existing `window.addEventListener('resize', resize)` block, keeping it but adding below):

```javascript
const nameTargets = buildNameTargets(canvas.width, canvas.height);
const bioTargets  = buildBioTargets(canvas.width, canvas.height);
let particles = buildParticles(nameTargets, bioTargets, canvas.width, canvas.height);
```

**Step 3: Verify**
```javascript
console.log('particles:', particles.length, particles[0]);
```
Expected: particle count ≥ max of name/bio targets. First particle has `.nameX`, `.bioX`, `.char`, `.alpha: 0`.

**Step 4: Remove console.log, commit**
```bash
git add index.html
git commit -m "feat: add unified particle array merging name and bio targets"
```

---

### Task 5: Render Loop — Draw Particles

**Files:**
- Modify: `index.html` — add `drawParticles()` and wire it into `loop()`

**Step 1: Add `drawParticles()` before `loop()`**

```javascript
function drawParticles(t) {
  ctx.font = `${Math.max(11, Math.min(15, Math.floor(canvas.width / 90)))}px 'Courier New', monospace`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  for (const p of particles) {
    if (p.alpha < 0.01) continue;
    const pulse = 0.65 + 0.35 * Math.sin(t * 0.0015 + p.phase);
    const brightness = Math.round(p.alpha * pulse * 255);
    ctx.fillStyle = `rgb(0,${brightness},${Math.round(brightness * 0.25)})`;
    ctx.fillText(p.char, p.x, p.y);
  }
}
```

**Step 2: Update `loop()` to use a frame counter and call `drawParticles()`**

```javascript
let t = 0;
function loop() {
  t++;
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawParticles(t);
  requestAnimationFrame(loop);
}
```

**Step 3: Verify**
All particles have `alpha: 0`, so screen is still black. Temporarily set `particles[0].alpha = 1; particles[0].x = 100; particles[0].y = 100;` and verify a single green character appears at (100, 100).

**Step 4: Remove temp change, commit**
```bash
git add index.html
git commit -m "feat: add particle render loop with pulse brightness animation"
```

---

### Task 6: State Machine + Materialize Animation

**Files:**
- Modify: `index.html` — add state constants, `updateParticles()`, and wire into `loop()`

**Step 1: Add state constants and variables** (before `buildParticles`)

```javascript
const S = { MATERIALIZING: 0, IDLE: 1, EXPLODING: 2, REFORMING: 3 };
let appState = S.MATERIALIZING;
let currentLayout = 'name';
```

**Step 2: Add `updateParticles()` before `loop()`**

```javascript
function updateParticles() {
  const isHoming    = appState === S.MATERIALIZING || appState === S.REFORMING;
  const isExploding = appState === S.EXPLODING;
  let allSettled = true;

  for (const p of particles) {
    if (isHoming || appState === S.IDLE) {
      const tx = currentLayout === 'name' ? p.nameX : p.bioX;
      const ty = currentLayout === 'name' ? p.nameY : p.bioY;
      p.x += (tx - p.x) * 0.07;
      p.y += (ty - p.y) * 0.07;
      p.vx = 0; p.vy = 0;
      p.alpha += (1 - p.alpha) * 0.04;
      if (isHoming && Math.hypot(tx - p.x, ty - p.y) > 2) allSettled = false;
    }

    if (isExploding) {
      p.vy += 0.18;    // gravity
      p.vx *= 0.97;    // air friction
      p.vy *= 0.97;
      p.x  += p.vx;
      p.y  += p.vy;
    }
  }

  if (appState === S.MATERIALIZING && allSettled) appState = S.IDLE;

  if (isExploding) {
    const avgSpeed = particles.reduce((s, p) => s + Math.hypot(p.vx, p.vy), 0) / particles.length;
    if (avgSpeed < 0.8) {
      currentLayout = currentLayout === 'name' ? 'bio' : 'name';
      for (const p of particles) p.char = currentLayout === 'name' ? p.nameChar : p.bioChar;
      appState = S.REFORMING;
    }
  }

  if (appState === S.REFORMING && allSettled) appState = S.IDLE;
}
```

**Step 3: Call `updateParticles()` in `loop()` before `drawParticles(t)`**

```javascript
function loop() {
  t++;
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  updateParticles();
  drawParticles(t);
  requestAnimationFrame(loop);
}
```

**Step 4: Verify**
Open in browser. Expected:
- Characters appear scattered, then spring into the shape of "SAI KAUNG SAN" over ~3 seconds
- Each character is a random symbol like `#`, `@`, `*`
- Once settled, a gentle pulse brightens and dims all characters

**Step 5: Commit**
```bash
git add index.html
git commit -m "feat: add state machine and materialize spring animation"
```

---

### Task 7: Click/Touch Explosion

**Files:**
- Modify: `index.html` — add `explode()` and event listeners

**Step 1: Add `explode()` and event listeners** (after the particle initialization lines)

```javascript
function explode(cx, cy) {
  if (appState === S.EXPLODING) return;
  appState = S.EXPLODING;
  for (const p of particles) {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const dist = Math.max(1, Math.hypot(dx, dy));
    const force = Math.min(35, 1000 / dist);
    p.vx = (dx / dist) * force * (0.8 + Math.random() * 0.4);
    p.vy = (dy / dist) * force * (0.8 + Math.random() * 0.4) - 3;
  }
}

canvas.addEventListener('click', (e) => {
  const r = canvas.getBoundingClientRect();
  explode(e.clientX - r.left, e.clientY - r.top);
});

canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  const r = canvas.getBoundingClientRect();
  const t = e.changedTouches[0];
  explode(t.clientX - r.left, t.clientY - r.top);
}, { passive: false });
```

**Step 2: Verify full interaction loop**
- Wait for materialize → NAME state
- Click canvas → particles explode outward from cursor with gravity
- After ~2-3 seconds slowing: particles reform as bio card (actual text characters, readable)
- Click again → explode → reform back to NAME
- Works on mobile (tap)

**Step 3: Commit**
```bash
git add index.html
git commit -m "feat: add click/touch explosion with physics and layout toggle"
```

---

### Task 8: Resize Handler

**Files:**
- Modify: `index.html` — replace simple resize listener with one that rebuilds targets

**Step 1: Replace `window.addEventListener('resize', resize)` with**

```javascript
window.addEventListener('resize', () => {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const W = canvas.width, H = canvas.height;

  const nt = buildNameTargets(W, H);
  const bt = buildBioTargets(W, H);

  particles.forEach((p, i) => {
    p.nameX    = nt[i]?.x    ?? -200;
    p.nameY    = nt[i]?.y    ?? -200;
    p.nameChar = nt[i]?.char ?? ' ';
    p.bioX     = bt[i]?.x    ?? -200;
    p.bioY     = bt[i]?.y    ?? -200;
    p.bioChar  = bt[i]?.char ?? ' ';
  });
});
```

**Step 2: Verify**
Drag the browser window to a different size. Particles should re-home to positions appropriate to the new canvas size.

**Step 3: Commit**
```bash
git add index.html
git commit -m "feat: rebuild particle targets on window resize"
```

---

### Task 9: Deploy to GitHub Pages

**Files:**
- Create: `_config.yml`

**Step 1: Create `_config.yml`** to exclude non-page files from Jekyll processing

```yaml
exclude:
  - docs/
  - resume.md
```

**Step 2: Final local verification checklist**
Open `index.html` directly in browser. Confirm all of:
- [ ] Page loads without console errors
- [ ] Black screen → characters materialize into name shape (~3s)
- [ ] Idle pulse animation runs continuously
- [ ] Click anywhere → explosion with gravity
- [ ] Characters reform as readable bio card text
- [ ] Click again → explosion → back to name
- [ ] Window resize works without breaking animation

**Step 3: Commit and push**
```bash
git add _config.yml
git commit -m "chore: add _config.yml to exclude docs and resume from Jekyll"
git push origin main
```

**Step 4: Verify deployment**
- Go to the repo's **Actions** tab — watch the Pages deployment job
- Once green, visit `https://saichen22.github.io`
- Expected: same experience as local
