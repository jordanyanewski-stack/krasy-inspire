"use client";
import { useEffect, useRef } from "react";

type Star = {
  x: number; y: number;
  size: number;
  speed: number;
  phase: number;
  phaseSpeed: number;
};

type Ring = {
  cx: number; cy: number;
  r: number; maxR: number;
  alpha: number; speed: number;
};

type Spark = {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
};

export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let raf: number;
    let w = 0, h = 0, dpr = 1;
    const stars: Star[] = [];
    const rings: Ring[] = [];
    const sparks: Spark[] = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas!.offsetWidth;
      h = canvas!.offsetHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      stars.length = 0;
      for (let i = 0; i < 70; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: 0.4 + Math.random() * 1.4,
          speed: 0.08 + Math.random() * 0.2,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.012 + Math.random() * 0.03,
        });
      }
    }

    function spawnRing() {
      rings.push({
        cx: w * 0.3 + Math.random() * w * 0.4,
        cy: h * 0.2 + Math.random() * h * 0.6,
        r: 0,
        maxR: 50 + Math.random() * 70,
        alpha: 0.18,
        speed: 0.35 + Math.random() * 0.25,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      /* ── Sunset gradient background (deep/saturated) ── */
      const bg = ctx.createLinearGradient(0, 0, w * 0.3, h);
      bg.addColorStop(0,    "#a84e18");
      bg.addColorStop(0.15, "#b86820");
      bg.addColorStop(0.3,  "#c07828");
      bg.addColorStop(0.48, "#a05848");
      bg.addColorStop(0.65, "#7a4870");
      bg.addColorStop(0.8,  "#5c3878");
      bg.addColorStop(1,    "#3a2058");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      /* ── Subtle warm glow top-left ── */
      ctx.globalCompositeOperation = "screen";
      const warm = ctx.createRadialGradient(w * 0.15, h * 0.1, 0, w * 0.15, h * 0.1, w * 0.5);
      warm.addColorStop(0, "rgba(200,140,40,0.12)");
      warm.addColorStop(1, "rgba(200,140,40,0)");
      ctx.fillStyle = warm;
      ctx.fillRect(0, 0, w, h);

      /* ── Rising sparkle stars (white/cream on warm bg) ── */
      ctx.globalCompositeOperation = "screen";
      for (const s of stars) {
        s.y -= s.speed;
        s.phase += s.phaseSpeed;
        if (s.y < -4) {
          s.y = h + 4;
          s.x = Math.random() * w;
        }
        const alpha = 0.2 + 0.6 * Math.abs(Math.sin(s.phase));
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
        glow.addColorStop(0,   `rgba(255,255,250,${alpha})`);
        glow.addColorStop(0.4, `rgba(255,240,220,${alpha * 0.4})`);
        glow.addColorStop(1,   "rgba(255,240,220,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,248,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ── Expanding sacred rings (lavender) ── */
      ctx.globalCompositeOperation = "screen";
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.r += ring.speed;
        ring.alpha -= 0.0015;
        if (ring.alpha <= 0 || ring.r > ring.maxR) { rings.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(220,200,255,${ring.alpha})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.arc(ring.cx, ring.cy, ring.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      /* ── Mouse sparkles (white/lavender) ── */
      ctx.globalCompositeOperation = "screen";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.03;
        sp.life -= 1;
        if (sp.life <= 0) { sparks.splice(i, 1); continue; }
        const progress = sp.life / sp.maxLife;
        const alpha = progress * 0.4;
        const glow = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sp.size * 4);
        glow.addColorStop(0,   `rgba(255,255,250,${alpha})`);
        glow.addColorStop(0.3, `rgba(200,180,240,${alpha * 0.5})`);
        glow.addColorStop(1,   "rgba(200,180,240,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,248,${alpha})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      if (mx < 0 || my < 0 || mx > w || my > h) return;
      for (let i = 0; i < 2; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.2 + Math.random() * 0.5;
        const maxLife = 25 + Math.random() * 20;
        sparks.push({
          x: mx + (Math.random() - 0.5) * 8,
          y: my + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3,
          life: maxLife,
          maxLife,
          size: 0.5 + Math.random() * 0.8,
        });
      }
    }

    resize();
    seed();
    raf = requestAnimationFrame(draw);

    spawnRing();
    const ringInterval = setInterval(spawnRing, 2500);

    window.addEventListener("mousemove", onMouseMove);
    const ro = new ResizeObserver(() => { resize(); seed(); });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(ringInterval);
      window.removeEventListener("mousemove", onMouseMove);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
