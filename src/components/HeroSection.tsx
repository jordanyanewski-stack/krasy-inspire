export default function HeroSection({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {children}
    </section>
  );
}
