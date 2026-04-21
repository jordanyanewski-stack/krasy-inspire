"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const links = [
  { label: "Начало",  href: "/" },
  { label: "Дневник", href: "/journal" },
  { label: "За мен",  href: "/about" },
];

export default function Header() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname                = usePathname();
  const isHome                  = pathname === "/";

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY >= 60); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // State 1: homepage + not yet scrolled + mobile menu closed
  // Non-home routes skip State 1 entirely — always frosted glass
  const ghost = isHome && !scrolled && !open;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: "var(--header-h)",
        transition: "background 400ms ease, backdrop-filter 400ms ease, box-shadow 400ms ease, border-color 400ms ease",
        background: ghost
          ? "transparent"
          : "rgba(18,13,31,0.90)",
        backdropFilter: ghost
          ? "none"
          : "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: ghost
          ? "none"
          : "blur(20px) saturate(1.4)",
        borderBottom: ghost
          ? "none"
          : "1px solid rgba(201,160,110,0.15)",
        boxShadow: ghost
          ? "none"
          : "0 4px 32px rgba(0,0,0,0.35)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-[var(--header-h)] flex items-center justify-between gap-8">

        {/* Logo */}
        <Link href="/" className="group shrink-0 whitespace-nowrap">
          <div className="flex flex-col items-start justify-center" style={{ height: "var(--header-h)" }}>
            <span
              className="text-2xl group-hover:opacity-75"
              style={{
                transition: "color 400ms ease, text-shadow 400ms ease",
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontWeight: 600,
                lineHeight: 1,
                color: "var(--gold-lt)",
                textShadow: "0 2px 16px rgba(18,13,31,0.85)",
              }}
            >
              Krasy Inspire
            </span>
            <span
              className="text-[10px] tracking-[0.25em] uppercase font-semibold mt-1"
              style={{
                transition: "color 400ms ease, text-shadow 400ms ease",
                lineHeight: 1,
                color: "rgba(220,185,130,0.9)",
                textShadow: "0 1px 8px rgba(18,13,31,0.7)",
              }}
            >
              ✦ душа · дух · любов ✦
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 min-w-0">
          {links.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="relative pb-1"
                style={{
                  transition: "color 400ms ease, text-shadow 400ms ease, opacity 400ms ease",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: active ? "#e8c88a" : "rgba(255,255,255,0.85)",
                  textShadow: "0 2px 12px rgba(18,13,31,0.6)",
                  opacity: active ? 1 : 0.88,
                }}
              >
                {label}
                {active && (
                  <span
                    className="absolute bottom-0 left-0 w-full h-px"
                    style={{ background: "rgba(220,185,130,0.9)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          aria-label="Меню"
          onClick={() => setOpen(!open)}
          style={{ transition: "color 400ms ease", color: "rgba(245,238,248,0.9)" }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu — always opaque for readability */}
      {open && (
        <div className="md:hidden bg-[var(--blush)] border-t border-[var(--rose)]/60 px-6 py-6 flex flex-col gap-5">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm tracking-widest uppercase font-semibold text-[var(--ink-mid)] hover:text-[var(--gold)] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
