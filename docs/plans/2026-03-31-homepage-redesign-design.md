# Homepage Redesign Design

**Date:** 2026-03-31
**Status:** Approved

---

## Concept

A complete redesign of `saichen22.github.io` as a terminal-aesthetic single-page portfolio. No particle animation — replaced by a typewriter hero sequence. Dark background, monospace font throughout, green terminal palette. Scrollable sections with terminal-window card styling.

---

## Architecture

**File structure:**
```
index.html   — markup and section skeletons
style.css    — all styling, animations, scanline overlay
main.js      — typewriter logic, scroll reveal, hover effects
```

No build step. No frameworks. No CDN dependencies. Deploys directly to GitHub Pages by pushing to `main`.

---

## Visual System

| Token | Value | Usage |
|---|---|---|
| Background | `#0d0d0d` | Page background |
| Primary green | `#00ff41` | Titles, cursor, highlights |
| Dim green | `#00a832` | Body text, borders |
| Body text | `#c8c8c8` | Readable prose |
| Card background | `#111111` | Section cards |
| Gold | `#ffd700` | Award badge |
| Font | `'Courier New', monospace` | Entire site |

**Global effects:**
- Subtle scanline texture via `repeating-linear-gradient` over the whole page
- Custom scrollbar: thin green track
- Link hover: single blink animation + color shift to `#00ff41`

---

## Page Layout (top to bottom)

### 1. Hero — full viewport height
```
$ ./sai_kaung_san.sh▌

> Sai Kaung San
> CS @ Baruch College · NYC
> Python · TypeScript · Next.js · React · ML

        ↓
```
- Black background fills the viewport
- Typewriter prints the prompt line, then three content lines sequentially
- Blinking block cursor (`▌`) after each line while typing, stays at end
- Scroll-down arrow appears after all lines finish, animates with slow float

### 2. About — terminal window card
```
┌─[ about.txt ]──────────────────────────────┐
│                                             │
│  CS student @ Baruch College, NYC           │
│  GPA: 3.838 · Expected May 2027             │
│                                             │
│  Team Lead @ FQE Club                       │
│    Short-Run Forex Pricing (eigenvalue)     │
│  Member @ MLDS Club                         │
│    cuny-rag-assistant (RAG project)         │
│                                             │
│  ★ Google × BASTA Innovation — Winner       │
│                                             │
└─────────────────────────────────────────────┘
```
- Green border, title tab in top-left (`[ about.txt ]`)
- Award line uses gold `#ffd700`

### 3. Contact — below About
```
> github.com/SaiChen22
> linkedin.com/in/sai-kaung-san-6ab676327
> saikaungsanchen@gmail.com
```
- Three `<a>` links, each prefixed with `>`
- On hover: `>` becomes `>>` and line color shifts to `#00ff41`

### 4. Projects — two terminal cards side by side (stacked on mobile)

**Card structure:**
```
┌─[ project-name ]────────────────────────────┐
│  tag  tag  tag  tag                          │
│                                              │
│  One or two sentence description.           │
│                                              │
│  [→ github]                                 │
└──────────────────────────────────────────────┘
```

**Card 1: Clinical Data Reconciliation Engine**
- Tags: `Python` `FastAPI` `React 19` `TypeScript` `SQLite`
- Description: AI-powered full-stack app reconciling conflicting EHR medication records. Hot-swappable LLM layer (Mock/GPT-4o/Claude/OpenAI), 24 automated tests, TypeScript–Pydantic schema parity.

**Card 2: CoinPulse**
- Tags: `Next.js 16` `React 19` `TypeScript` `WebSocket` `Tailwind`
- Description: Real-time crypto tracking with live prices, candlestick charts, and fiat converter. Custom WebSocket hook with 5-min cache TTL and exponential backoff.

### 5. Skills — tag grid
```
$ cat skills.txt

[Languages]   Python  TypeScript  JavaScript  C++  SQL
[Frameworks]  Next.js  React  FastAPI  Scikit-learn  Pandas
[Tools]       Docker  Git  REST APIs  WebSockets  Linux
[Concepts]    ML  RESTful API Design  Data Modeling  Time-Series
```
- Category label in dim green, tags as small pill badges
- Pill hover: background becomes `#00ff41`, text becomes `#0d0d0d`

---

## Scroll Reveal

Each section fades in + slides up slightly as it enters the viewport (`IntersectionObserver`). No JS library — pure CSS transition triggered by adding an `.visible` class.

---

## Responsive Behavior

- Projects: 2-column grid on desktop, 1-column stacked on mobile (`< 768px`)
- Hero font size: clamp between `1.2rem` and `2rem`
- Cards: full width on mobile with reduced padding

---

## Deployment

1. `index.html`, `style.css`, `main.js` in repo root
2. Push to `main` branch of `SaiChen22.github.io`
3. GitHub Pages serves automatically at `https://saichen22.github.io`
4. Existing `_config.yml` already excludes `docs/` from Jekyll — no changes needed
