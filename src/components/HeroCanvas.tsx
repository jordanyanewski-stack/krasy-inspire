"use client";
import { useEffect, useRef } from "react";

type Orb = {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  h: number;  // hue shift offset
  phase: number;
};

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

const ORB_COLORS: [number, number, number][] = [
  [220, 170, 240],  // lavender
  [240, 180, 195],  // rose
  [170, 215, 235],  // mist
  [215, 180, 120],  // gold
  [195, 175, 255],  // lilac
  [245, 200, 210],  // blush
];

export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let raf: number;
    let w = 0, h = 0, dpr = 1;
    let t = 0;
    const orbs: Orb[] = [];
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
      orbs.length = 0;
      stars.length = 0;
      for (let i = 0; i < 7; i++) {
        orbs.push({
          x: Math.random() * w,
          // bias orbs to the middle-lower 55% of the hero, away from the top nav/logo area
          y: h * 0.3 + Math.random() * h * 0.55,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: w * 0.18 + Math.random() * w * 0.15,
          h: i,
          phase: Math.random() * Math.PI * 2,
        });
      }
      for (let i = 0; i < 100; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: 0.5 + Math.random() * 1.8,
          speed: 0.12 + Math.random() * 0.35,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.015 + Math.random() * 0.04,
        });
      }
    }

    function spawnRing() {
      rings.push({
        cx: w * 0.35 + Math.random() * w * 0.3,
        cy: h * 0.2 + Math.random() * h * 0.6,
        r: 0,
        maxR: 60 + Math.random() * 80,
        alpha: 0.25,
        speed: 0.4 + Math.random() * 0.3,
      });
    }

    function draw() {
      t += 0.007;
      ctx.clearRect(0, 0, w, h);

      /* ── Dark base gradient ── */
      const bg = ctx.createLinearGradient(0, 0, w * 0.6, h);
      bg.addColorStop(0,   "#120d1f");
      bg.addColorStop(0.4, "#1e1030");
      bg.addColorStop(0.75,"#190e28");
      bg.addColorStop(1,   "#0e0a1a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      /* ── Rising sparkle stars ── */
      ctx.globalCompositeOperation = "lighter";
      for (const s of stars) {
        s.y -= s.speed;
        s.phase += s.phaseSpeed;
        if (s.y < -4) {
          s.y = h + 4;
          s.x = Math.random() * w;
        }
        const alpha = 0.25 + 0.75 * Math.abs(Math.sin(s.phase));
        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
        glow.addColorStop(0,   `rgba(255,240,210,${alpha})`);
        glow.addColorStop(0.4, `rgba(220,200,255,${alpha * 0.5})`);
        glow.addColorStop(1,   "rgba(220,200,255,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
        ctx.fill();
        /* solid core dot */
        ctx.fillStyle = `rgba(255,248,230,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ── Expanding sacred rings ── */
      ctx.globalCompositeOperation = "screen";
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.r += ring.speed;
        ring.alpha -= 0.0018;
        if (ring.alpha <= 0 || ring.r > ring.maxR) { rings.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(201,160,110,${ring.alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(ring.cx, ring.cy, ring.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      /* ── Constellation lines between nearby stars ── */
      ctx.globalCompositeOperation = "screen";
      ctx.lineWidth = 0.4;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const a = (1 - dist / 80) * 0.08;
            ctx.strokeStyle = `rgba(200,185,255,${a})`;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      /* ── Mouse sparkles ── */
      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.03;
        sp.life -= 1;
        if (sp.life <= 0) { sparks.splice(i, 1); continue; }
        const progress = sp.life / sp.maxLife;
        const alpha = progress * 0.45;
        const glow = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sp.size * 4);
        glow.addColorStop(0,   `rgba(255,245,200,${alpha})`);
        glow.addColorStop(0.3, `rgba(220,190,255,${alpha * 0.6})`);
        glow.addColorStop(1,   "rgba(220,190,255,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,250,220,${alpha})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * 0.6, 0, Math.PI * 2);
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

    /* spawn a ring every 2.5s */
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
