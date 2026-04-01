// ─── Helpers ────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Feature 1: Typewriter hero sequence ────────────────────────────────────

const LINES = [
  'Sai Kaung San',
  'CS @ Baruch College · NYC',
  'Python · TypeScript · Next.js · React · ML',
];

async function typewriterSequence() {
  const output = document.getElementById('typewriter-output');
  const scrollHint = document.getElementById('scroll-hint');

  if (!output) return;

  await sleep(500);

  for (const text of LINES) {
    const lineSpan = document.createElement('span');
    lineSpan.className = 'line';

    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'cursor';
    cursorSpan.textContent = '▍';

    output.appendChild(lineSpan);
    output.appendChild(cursorSpan);

    for (const char of text) {
      lineSpan.textContent += char;
      await sleep(40 + Math.random() * 30);
    }

    await sleep(300);
    cursorSpan.remove();
    await sleep(120);
  }

  if (scrollHint) {
    scrollHint.classList.add('visible');
  }
}

// ─── Feature 2: Scroll reveal via IntersectionObserver ──────────────────────

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => observer.observe(el));
}

// ─── Feature 3: ASCII walking pet ───────────────────────────────────────────

function initPet() {
  const el = document.getElementById('pet');
  if (!el) return;

  const FRAMES = {
    right: ["(='.'=)>", "(=','=)>"],
    left:  ["<(='.'=)", "<(=','=)"],
  };
  const FIRE_RIGHT = '~*';
  const FIRE_LEFT  = '*~';

  const WALK_INTERVAL = 180;   // ms between frame toggles
  const SPEED         = 1.2;   // px per rAF tick (normalized to 60fps)
  const FIRE_DURATION = 600;   // ms fire stays visible
  const FIRE_CHANCE   = 0.008; // ~once per 22s average

  let x          = 0;
  let direction  = 1;   // 1=right, -1=left
  let frameIndex = 0;
  let fireUntil  = 0;
  let petWidth   = 0;
  let lastToggle = 0;
  let lastRaf    = null;

  function measureWidth() {
    el.textContent = FRAMES.right[0];
    petWidth = el.getBoundingClientRect().width;
  }

  function buildFrame(now) {
    const onFire = now < fireUntil;
    const base = direction === 1 ? FRAMES.right[frameIndex] : FRAMES.left[frameIndex];
    if (!onFire) return base;
    return direction === 1 ? base + FIRE_RIGHT : FIRE_LEFT + base;
  }

  function tick(now) {
    if (lastRaf === null) { lastRaf = now; lastToggle = now; }

    const delta = now - lastRaf;
    lastRaf = now;

    x += direction * SPEED * (delta / (1000 / 60));
    if (x <= 0) {
      x = 0;
      direction = 1;
    } else if (x + petWidth >= window.innerWidth) {
      x = window.innerWidth - petWidth;
      direction = -1;
    }

    if (now - lastToggle >= WALK_INTERVAL) {
      frameIndex = frameIndex === 0 ? 1 : 0;
      lastToggle = now;
      if (Math.random() < FIRE_CHANCE) fireUntil = now + FIRE_DURATION;
    }

    el.textContent = buildFrame(now);
    el.style.transform = `translateX(${Math.round(x)}px)`;
    requestAnimationFrame(tick);
  }

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      measureWidth();
      if (x + petWidth > window.innerWidth) x = Math.max(0, window.innerWidth - petWidth);
    }, 100);
  });

  measureWidth();
  requestAnimationFrame(tick);
}

// ─── Init ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  typewriterSequence();
  initScrollReveal();
  initPet();
});
