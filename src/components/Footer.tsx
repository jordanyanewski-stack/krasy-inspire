export default function Footer() {
  return (
    <footer className="bg-[var(--blush)] border-t border-[var(--rose)]/60">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col items-center gap-5 text-center">
        <p
          className="text-2xl text-[var(--ink)]"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 500 }}
        >
          Ти си магията, която търсиш.
        </p>
        <div className="divider w-48"><span className="divider-ornament">✦ ✦ ✦</span></div>
        <p className="text-xs tracking-widest uppercase text-[var(--ink-soft)] font-semibold">
          © {new Date().getFullYear()} Krasy Inspire · направено с любов ✦
        </p>
      </div>
    </footer>
  );
}
