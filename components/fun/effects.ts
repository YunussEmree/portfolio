const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A burst of confetti from (x, y) on a throwaway canvas; nothing when the visitor prefers less motion. */
export function confetti({ x = window.innerWidth / 2, y = window.innerHeight / 2, count = 90, power = 1 } = {}) {
  if (reducedMotion()) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement("canvas");
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "300" });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas.remove();
  ctx.scale(dpr, dpr);

  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent-fill").trim() || "#c6f36a";
  const colors = [accent, "#7aa2ff", "#ffb547", "#ff6b8b", "#5ee6c8"];
  const parts = Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = (3 + Math.random() * 7) * power;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5 * power,
      size: 5 + Math.random() * 6,
      spin: Math.random() * Math.PI,
      vspin: (Math.random() - 0.5) * 0.35,
      color: colors[i % colors.length],
    };
  });

  const life = 2400;
  const start = performance.now();
  let last = start;
  const tick = (now: number) => {
    const k = Math.min((now - last) / 16.7, 3); // frame-rate independent physics
    last = now;
    const t = now - start;
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t - life * 0.6) / (life * 0.4));
    for (const p of parts) {
      p.vy += 0.25 * k;
      p.vx *= 0.985;
      p.x += p.vx * k;
      p.y += p.vy * k;
      p.spin += p.vspin * k;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.spin);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, (p.size / 2) * Math.abs(Math.cos(p.spin * 1.7)) + 1);
      ctx.restore();
    }
    if (t < life) requestAnimationFrame(tick);
    else canvas.remove();
  };
  requestAnimationFrame(tick);
}

/**
 * The screen spins once, like the old search engine trick. It rotates a View Transition snapshot of the viewport,
 * not <body>: the body is the whole (very tall) page, so rotating it swings the visible part and the fixed nav
 * far off screen.
 */
export function barrelRoll() {
  if (reducedMotion()) return;
  const spin = { transform: ["rotate(0deg)", "rotate(360deg)"] };
  const timing = { duration: 1200, easing: "cubic-bezier(0.65, 0, 0.35, 1)" };
  const doc = document as Document & { startViewTransition?: (update: () => void) => { ready: Promise<void> } };
  if (doc.startViewTransition) {
    doc
      .startViewTransition(() => {})
      .ready.then(() => document.documentElement.animate(spin, { ...timing, pseudoElement: "::view-transition-group(root)" }))
      .catch(() => {});
    return;
  }
  // Older browsers: spin the body around the middle of the screen and hide the scrollbars it would cause.
  const root = document.documentElement;
  const body = document.body;
  root.style.overflow = "hidden";
  body.style.transformOrigin = `50% ${window.scrollY + window.innerHeight / 2}px`;
  body.animate(spin, timing).finished.finally(() => {
    root.style.overflow = "";
    body.style.transformOrigin = "";
  });
}

/** Emoji falling from the top of the screen, swaying and spinning a little. */
export function emojiRain(emoji: string, count = 28) {
  if (reducedMotion()) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement("canvas");
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "300" });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas.remove();
  ctx.scale(dpr, dpr);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const drops = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: -40 - Math.random() * h * 0.8,
    vy: 2.2 + Math.random() * 2.8,
    size: 20 + Math.random() * 18,
    phase: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.6,
  }));

  const start = performance.now();
  let last = start;
  const tick = (now: number) => {
    const k = Math.min((now - last) / 16.7, 3);
    last = now;
    const t = now - start;
    ctx.clearRect(0, 0, w, h);
    let alive = false;
    for (const d of drops) {
      d.y += d.vy * k;
      if (d.y < h + 40) alive = true;
      ctx.save();
      ctx.translate(d.x + Math.sin(t / 400 + d.phase) * 14, d.y);
      ctx.rotate(Math.sin(t / 500 + d.phase) * d.spin);
      ctx.font = `${d.size}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
      ctx.fillText(emoji, 0, 0);
      ctx.restore();
    }
    if (alive && t < 8000) requestAnimationFrame(tick);
    else canvas.remove();
  };
  requestAnimationFrame(tick);
}
