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

// ─── Init ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  typewriterSequence();
  initScrollReveal();
});
