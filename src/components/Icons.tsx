import React from "react";

type IconProps = { className?: string; style?: React.CSSProperties };

/* ── Category icons ───────────────────────────────────────────── */

/** Crescent moon — Духовност */
export function MoonIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className} style={style} aria-hidden>
      {/* crescent: outer arc left side, inner cutout right side */}
      <path d="M24 4C11 4 2 13 2 24C2 35 11 44 24 44C20 40 17 33 17 24C17 15 20 8 24 4Z" />
      {/* small stars */}
      <circle cx="34" cy="10" r="1.6" />
      <circle cx="38" cy="17" r="1.1" opacity="0.7" />
      <circle cx="31"  cy="7"  r="1.1" opacity="0.7" />
    </svg>
  );
}

/** Rose petals — Себелюбие */
export function RoseIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className} style={style} aria-hidden>
      {/* 6 petals via rotated ellipses */}
      <g opacity="0.85" style={{ transformOrigin: "24px 24px" }}>
        <ellipse cx="24" cy="14" rx="5" ry="10" opacity="0.9" />
        <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(60 24 24)"  opacity="0.8" />
        <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(120 24 24)" opacity="0.8" />
        <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(180 24 24)" opacity="0.75" />
        <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(240 24 24)" opacity="0.75" />
        <ellipse cx="24" cy="14" rx="5" ry="10" transform="rotate(300 24 24)" opacity="0.8" />
      </g>
      {/* centre */}
      <circle cx="24" cy="24" r="5" />
    </svg>
  );
}

/** Leaf with veins — Осъзнатост */
export function LeafIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden>
      {/* leaf body */}
      <path
        d="M24 42C24 42 8 32 8 18C8 9 15 4 24 4C33 4 40 9 40 18C40 32 24 42 24 42Z"
        fill="currentColor" fillOpacity="0.18" strokeWidth="1.5"
      />
      {/* spine */}
      <line x1="24" y1="4" x2="24" y2="42" strokeWidth="1.5" />
      {/* veins */}
      <path d="M24 15L16 21" strokeWidth="1" opacity="0.6" />
      <path d="M24 15L32 21" strokeWidth="1" opacity="0.6" />
      <path d="M24 23L15 28" strokeWidth="1" opacity="0.5" />
      <path d="M24 23L33 28" strokeWidth="1" opacity="0.5" />
      <path d="M24 31L19 35" strokeWidth="1" opacity="0.4" />
      <path d="M24 31L29 35" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

/** Crescent + 4-point star */
export function MoonStarIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className} style={style} aria-hidden>
      {/* soft full-moon glow behind */}
      <circle cx="21" cy="27" r="13" opacity="0.12" />
      {/* crescent */}
      <path d="M21 14C14 14 8 20 8 27C8 34 14 40 21 40C17 36 15 32 15 27C15 22 17 18 21 14Z" />
      {/* 4-point star */}
      <path d="M37 8L38.5 12.5L43 14L38.5 15.5L37 20L35.5 15.5L31 14L35.5 12.5Z" />
      {/* small dots */}
      <circle cx="40" cy="24" r="1.4" opacity="0.7" />
      <circle cx="34"  cy="8"  r="1"   opacity="0.6" />
      <circle cx="42" cy="31" r="0.9" opacity="0.5" />
    </svg>
  );
}

/* ── Section / practice icons ─────────────────────────────────── */

/** Crystal / diamond — трансформация */
export function CrystalIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className} style={style} aria-hidden>
      {/* top facet */}
      <path d="M24 4L10 18H38Z" opacity="0.5" />
      {/* middle band */}
      <path d="M10 18L24 44L38 18Z" opacity="0.85" />
      {/* inner highlight */}
      <path d="M20 18L24 38L28 18Z" opacity="0.35" />
    </svg>
  );
}

/** Flame — страст и пробуждане */
export function FlameIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className} style={style} aria-hidden>
      {/* outer flame */}
      <path d="M24 6C20 14 11 17 13 28C15 38 22 44 24 44C26 44 33 38 35 28C37 17 28 14 24 6Z" opacity="0.8" />
      {/* inner core */}
      <path d="M24 22C22 26 18 29 19 34C20 38 24 40 24 40C24 40 28 38 29 34C30 29 26 26 24 22Z" opacity="0.45" />
    </svg>
  );
}

/** Infinity / sacred loop — мъдрост */
export function InfinityIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} style={style} aria-hidden>
      <path d="M14 24C14 20 17 16 21 16C25 16 27 20 24 24C21 28 23 32 27 32C31 32 34 28 34 24C34 20 31 16 27 16C23 16 21 20 24 24C27 28 25 32 21 32C17 32 14 28 14 24Z" />
    </svg>
  );
}

/** Eye — интуиция и осъзнаване */
export function EyeIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} style={style} aria-hidden>
      {/* eye outline */}
      <path d="M4 24C4 24 12 10 24 10C36 10 44 24 44 24C44 24 36 38 24 38C12 38 4 24 4 24Z"
        fill="currentColor" fillOpacity="0.1" />
      {/* iris */}
      <circle cx="24" cy="24" r="7" fill="currentColor" fillOpacity="0.2" />
      {/* pupil */}
      <circle cx="24" cy="24" r="3.5" fill="currentColor" />
      {/* upper lash highlight */}
      <path d="M4 24C4 24 12 10 24 10C36 10 44 24 44 24" strokeWidth="2" />
    </svg>
  );
}

/** Feather — писане и изразяване */
export function PenFeatherIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className} style={style} aria-hidden>
      {/* feather body */}
      <path
        d="M38 6C38 6 44 20 30 28L14 42"
        strokeWidth="1.5"
      />
      {/* feather vane left */}
      <path d="M38 6C28 10 22 18 20 28" opacity="0.6" />
      {/* feather vane right */}
      <path d="M38 6C36 18 32 24 26 30" opacity="0.6" />
      {/* barbs */}
      <path d="M34 12L28 18" opacity="0.4" />
      <path d="M36 16L29 22" opacity="0.4" />
      <path d="M34 20L27 26" opacity="0.4" />
      <path d="M31 24L25 29" opacity="0.4" />
      {/* nib */}
      <path d="M14 42L10 46L18 42L14 38Z" fill="currentColor" opacity="0.7" stroke="none" />
    </svg>
  );
}
