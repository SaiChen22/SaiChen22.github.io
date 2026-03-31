# Homepage Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild `saichen22.github.io` as a terminal-aesthetic single-page scrollable portfolio with typewriter hero, replacing the current particle canvas entirely.

**Architecture:** Three-file static site (`index.html` + `style.css` + `main.js`) with no build step or external dependencies. Hero uses JS typewriter sequencing; all other animations use CSS transitions triggered by `IntersectionObserver` adding `.visible` classes.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties, grid, IntersectionObserver), ES6 JS. GitHub Pages deployment via `main` branch push.

---

### Task 1: Scaffold — replace index.html, create style.css and main.js

**Files:**
- Modify: `index.html` (full rewrite)
- Create: `style.css`
- Create: `main.js`

**Step 1: Rewrite index.html with full section skeleton**

Replace entire contents of `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sai Kaung San</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- HERO -->
  <section id="hero">
    <div class="hero-inner">
      <span class="prompt">$ ./sai_kaung_san.sh</span>
      <div id="typewriter-output"></div>
      <div class="scroll-hint" id="scroll-hint">↓</div>
    </div>
  </section>

  <!-- ABOUT -->
  <section id="about" class="reveal">
    <div class="terminal-card">
      <div class="card-title">[ about.txt ]</div>
      <div class="card-body">
        <p>CS student @ Baruch College, NYC</p>
        <p>GPA: 3.838 · Expected May 2027</p>
        <br>
        <p>Team Lead @ FQE Club</p>
        <p class="indent">Short-Run Forex Pricing (eigenvalue decomposition)</p>
        <p>Member @ MLDS Club</p>
        <p class="indent">cuny-rag-assistant (RAG pipeline project)</p>
        <br>
        <p class="gold">★ Google × BASTA Innovation Challenge — Winner</p>
      </div>
    </div>
  </section>

  <!-- CONTACT -->
  <section id="contact" class="reveal">
    <div class="contact-links">
      <a href="https://github.com/SaiChen22" target="_blank" class="cli-link">
        <span class="arrow">&gt;</span> github.com/SaiChen22
      </a>
      <a href="https://www.linkedin.com/in/sai-kaung-san-6ab676327" target="_blank" class="cli-link">
        <span class="arrow">&gt;</span> linkedin.com/in/sai-kaung-san-6ab676327
      </a>
      <a href="mailto:saikaungsanchen@gmail.com" class="cli-link">
        <span class="arrow">&gt;</span> saikaungsanchen@gmail.com
      </a>
    </div>
  </section>

  <!-- PROJECTS -->
  <section id="projects" class="reveal">
    <h2 class="section-label">$ ls projects/</h2>
    <div class="projects-grid">

      <div class="terminal-card project-card">
        <div class="card-title">[ clinical-data-reconciliation-engine ]</div>
        <div class="card-body">
          <div class="tags">
            <span class="tag">Python</span>
            <span class="tag">FastAPI</span>
            <span class="tag">React 19</span>
            <span class="tag">TypeScript</span>
            <span class="tag">SQLite</span>
          </div>
          <p>AI-powered full-stack app reconciling conflicting EHR medication records. Hot-swappable LLM layer (Mock/GPT-4o/Claude/OpenAI), 24 automated tests, TypeScript–Pydantic schema parity.</p>
          <a href="https://github.com/SaiChen22/smart_clinical_application" target="_blank" class="card-link">[→ github]</a>
        </div>
      </div>

      <div class="terminal-card project-card">
        <div class="card-title">[ coinpulse ]</div>
        <div class="card-body">
          <div class="tags">
            <span class="tag">Next.js 16</span>
            <span class="tag">React 19</span>
            <span class="tag">TypeScript</span>
            <span class="tag">WebSocket</span>
            <span class="tag">Tailwind</span>
          </div>
          <p>Real-time crypto tracking with live prices, candlestick charts, and fiat converter. Custom WebSocket hook with 5-min cache TTL and exponential backoff on HTTP 429.</p>
          <a href="https://github.com/SaiChen22/CoinPulse" target="_blank" class="card-link">[→ github]</a>
        </div>
      </div>

    </div>
  </section>

  <!-- SKILLS -->
  <section id="skills" class="reveal">
    <h2 class="section-label">$ cat skills.txt</h2>
    <div class="skills-grid">
      <div class="skill-row">
        <span class="skill-label">[Languages]</span>
        <span class="tag">Python</span>
        <span class="tag">TypeScript</span>
        <span class="tag">JavaScript</span>
        <span class="tag">C++</span>
        <span class="tag">SQL</span>
      </div>
      <div class="skill-row">
        <span class="skill-label">[Frameworks]</span>
        <span class="tag">Next.js</span>
        <span class="tag">React</span>
        <span class="tag">FastAPI</span>
        <span class="tag">Scikit-learn</span>
        <span class="tag">Pandas</span>
      </div>
      <div class="skill-row">
        <span class="skill-label">[Tools]</span>
        <span class="tag">Docker</span>
        <span class="tag">Git</span>
        <span class="tag">REST APIs</span>
        <span class="tag">WebSockets</span>
        <span class="tag">Linux</span>
      </div>
      <div class="skill-row">
        <span class="skill-label">[Concepts]</span>
        <span class="tag">Machine Learning</span>
        <span class="tag">RESTful API Design</span>
        <span class="tag">Data Modeling</span>
        <span class="tag">Time-Series</span>
      </div>
    </div>
  </section>

  <script src="main.js"></script>
</body>
</html>
```

**Step 2: Create empty style.css and main.js**

Create `style.css` with just a comment:
```css
/* Terminal Portfolio — style.css */
```

Create `main.js` with just a comment:
```js
// Terminal Portfolio — main.js
```

**Step 3: Verify in browser**

Open `index.html` locally (e.g. `python3 -m http.server 8000` then visit `localhost:8000`).
Expected: raw unstyled HTML with all five sections visible as plain text. No errors in console.

**Step 4: Commit**

```bash
git add index.html style.css main.js
git commit -m "feat: scaffold homepage sections, replace canvas with HTML structure"
```

---

### Task 2: Global styles — CSS variables, reset, scanline, scrollbar, typography

**Files:**
- Modify: `style.css`

**Step 1: Write global styles**

Replace `style.css` entirely:

```css
/* Terminal Portfolio — style.css */

/* ── Variables ────────────────────────────────── */
:root {
  --bg:        #0d0d0d;
  --green:     #00ff41;
  --green-dim: #00a832;
  --text:      #c8c8c8;
  --card-bg:   #111111;
  --gold:      #ffd700;
  --font:      'Courier New', Courier, monospace;
  --max-w:     900px;
}

/* ── Reset ────────────────────────────────────── */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  font-size: 15px;
  line-height: 1.7;
  min-height: 100vh;
}

/* ── Scanline overlay ─────────────────────────── */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 3px,
    rgba(0, 0, 0, 0.08) 3px,
    rgba(0, 0, 0, 0.08) 4px
  );
  z-index: 9999;
}

/* ── Scrollbar ────────────────────────────────── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--green-dim); border-radius: 2px; }

/* ── Typography ───────────────────────────────── */
a {
  color: var(--green-dim);
  text-decoration: none;
  transition: color 0.15s;
}

a:hover {
  color: var(--green);
}

p { margin-bottom: 0.25rem; }

.gold { color: var(--gold); }
.indent { padding-left: 2ch; }

/* ── Layout wrapper ───────────────────────────── */
section {
  padding: 80px 24px;
  max-width: var(--max-w);
  margin: 0 auto;
}

#hero {
  max-width: 100%;
  padding: 0;
}

/* ── Section labels ───────────────────────────── */
.section-label {
  color: var(--green-dim);
  font-size: 0.9rem;
  font-weight: normal;
  margin-bottom: 32px;
  letter-spacing: 0.05em;
}

/* ── Scroll reveal ────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Step 2: Verify in browser**

Reload `localhost:8000`.
Expected: dark background, monospace text, visible scanlines, thin green scrollbar. All section text readable.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add global CSS variables, scanline overlay, scroll reveal base"
```

---

### Task 3: Hero section styles

**Files:**
- Modify: `style.css` (append)

**Step 1: Append hero CSS**

Add to the end of `style.css`:

```css
/* ── Hero ─────────────────────────────────────── */
#hero {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-inner {
  padding: 24px;
  width: 100%;
  max-width: var(--max-w);
}

.prompt {
  display: block;
  color: var(--green);
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  margin-bottom: 24px;
}

#typewriter-output {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: var(--text);
  min-height: 5em;
}

#typewriter-output .line {
  display: block;
  white-space: pre;
}

#typewriter-output .line::before {
  content: '> ';
  color: var(--green-dim);
}

/* blinking cursor */
.cursor {
  display: inline-block;
  width: 0.6ch;
  height: 1.1em;
  background: var(--green);
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* scroll hint arrow */
.scroll-hint {
  margin-top: 60px;
  color: var(--green-dim);
  font-size: 1.4rem;
  opacity: 0;
  animation: float 2s ease-in-out infinite;
  transition: opacity 0.8s ease;
}

.scroll-hint.visible {
  opacity: 1;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(8px); }
}
```

**Step 2: Verify**

Reload. Expected: hero takes full viewport height, centered content. No typewriter yet (JS not written). Text shows raw HTML fallback.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add hero section styles and cursor animation"
```

---

### Task 4: Typewriter JS logic

**Files:**
- Modify: `main.js`

**Step 1: Write typewriter implementation**

Replace `main.js` entirely:

```js
// Terminal Portfolio — main.js

// ── Typewriter ──────────────────────────────────
const LINES = [
  'Sai Kaung San',
  'CS @ Baruch College · NYC',
  'Python · TypeScript · Next.js · React · ML',
];

const output    = document.getElementById('typewriter-output');
const scrollHint = document.getElementById('scroll-hint');

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function typeLine(text) {
  const span   = document.createElement('span');
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  span.className = 'line';
  output.appendChild(span);
  output.appendChild(cursor);

  for (const ch of text) {
    span.textContent += ch;
    await sleep(40 + Math.random() * 30);
  }

  // Pause, then move cursor to next line
  await sleep(300);
  cursor.remove();
}

async function runTypewriter() {
  await sleep(500); // initial pause

  for (const line of LINES) {
    await typeLine(line);
    await sleep(120);
  }

  // Show scroll hint after all lines done
  scrollHint.classList.add('visible');
}

runTypewriter();
```

**Step 2: Verify in browser**

Reload. Expected:
- 500ms pause then prompt appears
- Three lines type out one by one with blinking cursor
- After last line, `↓` arrow fades in and floats
- No console errors

**Step 3: Commit**

```bash
git add main.js
git commit -m "feat: implement typewriter hero sequence with scroll hint reveal"
```

---

### Task 5: Terminal card component styles (About + Projects shared)

**Files:**
- Modify: `style.css` (append)

**Step 1: Append terminal card CSS**

```css
/* ── Terminal Card ────────────────────────────── */
.terminal-card {
  border: 1px solid var(--green-dim);
  background: var(--card-bg);
  border-radius: 2px;
}

.card-title {
  padding: 8px 16px;
  border-bottom: 1px solid var(--green-dim);
  color: var(--green);
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.card-body {
  padding: 20px 16px;
  color: var(--text);
}

.card-body p {
  margin-bottom: 0.3rem;
}
```

**Step 2: Verify**

Reload. Expected: About and Project cards now have green borders with title tab styling.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add terminal card component styles"
```

---

### Task 6: About section styles

**Files:**
- Modify: `style.css` (append)

**Step 1: Append about CSS**

```css
/* ── About ────────────────────────────────────── */
#about .terminal-card {
  max-width: 640px;
}
```

**Step 2: Verify**

Reload, scroll to About. Expected: card is narrower (max 640px), gold award line stands out.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add about section layout styles"
```

---

### Task 7: Contact section styles

**Files:**
- Modify: `style.css` (append)

**Step 1: Append contact CSS**

```css
/* ── Contact ──────────────────────────────────── */
.contact-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cli-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
  transition: color 0.15s;
  font-size: 0.95rem;
}

.cli-link .arrow {
  color: var(--green-dim);
  transition: color 0.15s, transform 0.1s;
  display: inline-block;
  width: 1.2ch;
}

.cli-link:hover {
  color: var(--green);
}

.cli-link:hover .arrow {
  color: var(--green);
  /* shift from > to >> effect via content replacement handled in HTML */
}

/* blink once on hover */
.cli-link:hover {
  animation: link-blink 0.15s step-end 1;
}

@keyframes link-blink {
  0%   { opacity: 1; }
  50%  { opacity: 0; }
  100% { opacity: 1; }
}
```

**Step 2: Verify**

Scroll to Contact. Expected: three links stacked, hover changes color and blinks once.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add contact section styles with hover blink"
```

---

### Task 8: Projects section styles

**Files:**
- Modify: `style.css` (append)

**Step 1: Append projects CSS**

```css
/* ── Projects ─────────────────────────────────── */
.projects-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.project-card .card-body p {
  margin: 12px 0;
  font-size: 0.9rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag {
  background: transparent;
  border: 1px solid var(--green-dim);
  color: var(--green-dim);
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 0.78rem;
  transition: background 0.15s, color 0.15s;
  cursor: default;
}

.tag:hover {
  background: var(--green);
  color: var(--bg);
  border-color: var(--green);
}

.card-link {
  display: inline-block;
  margin-top: 8px;
  color: var(--green-dim);
  font-size: 0.88rem;
  transition: color 0.15s;
}

.card-link:hover {
  color: var(--green);
}

/* ── Responsive: projects stack on mobile ──────── */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
```

**Step 2: Verify**

Scroll to Projects. Expected: two cards side by side on desktop. Tag pills hover green. `[→ github]` link visible.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add projects grid and tag pill styles"
```

---

### Task 9: Skills section styles

**Files:**
- Modify: `style.css` (append)

**Step 1: Append skills CSS**

```css
/* ── Skills ───────────────────────────────────── */
.skills-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-label {
  color: var(--green-dim);
  font-size: 0.82rem;
  min-width: 14ch;
  flex-shrink: 0;
}
```

**Step 2: Verify**

Scroll to Skills. Expected: four rows, each with label + tag pills inline.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add skills section styles"
```

---

### Task 10: Scroll reveal — IntersectionObserver

**Files:**
- Modify: `main.js` (append)

**Step 1: Append IntersectionObserver to main.js**

```js
// ── Scroll Reveal ───────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // fire once
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));
```

**Step 2: Verify**

Reload. Scroll down slowly. Expected: About, Contact, Projects, Skills each fade in and slide up as they enter the viewport. Each triggers only once.

**Step 3: Commit**

```bash
git add main.js
git commit -m "feat: add IntersectionObserver scroll reveal for all sections"
```

---

### Task 11: Responsive mobile styles

**Files:**
- Modify: `style.css` (append)

**Step 1: Append mobile CSS**

```css
/* ── Mobile ───────────────────────────────────── */
@media (max-width: 600px) {
  body { font-size: 13px; }

  section { padding: 60px 16px; }

  .prompt { font-size: 1rem; }

  #typewriter-output { font-size: 1rem; }

  .skill-label { min-width: 100%; }

  .skill-row { flex-direction: column; align-items: flex-start; }
}
```

**Step 2: Verify**

Open DevTools → toggle device toolbar → iPhone 12 Pro (390px wide).
Expected: single-column layout, readable text, no horizontal overflow.

**Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add mobile responsive styles"
```

---

### Task 12: Final cleanup and deploy

**Files:**
- Modify: `index.html` (remove any leftover canvas references if present)

**Step 1: Verify no old canvas code remains**

Run:
```bash
grep -n "canvas\|particle\|ASCII_CHARS" index.html main.js style.css
```
Expected: no matches.

**Step 2: Full browser smoke test checklist**

Open `localhost:8000` and verify:
- [ ] Hero typewriter runs, scroll hint appears
- [ ] Scrolling down reveals each section in order
- [ ] About card gold award line visible
- [ ] Contact links open correct URLs
- [ ] Project cards link to correct GitHub repos
- [ ] Skill tags hover to green
- [ ] No console errors
- [ ] Resize to mobile (< 600px): projects stack, no overflow

**Step 3: Commit and push**

```bash
git add index.html style.css main.js
git status  # confirm only expected files staged
git commit -m "feat: complete homepage redesign — terminal portfolio"
git push origin main
```

**Step 4: Verify GitHub Pages deployment**

Wait ~60 seconds, then visit `https://saichen22.github.io`.
Expected: new terminal portfolio live, no old particle canvas.
