export default function HeroSection({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="relative overflow-hidden flex flex-col justify-center"
      style={{ height: "100vh" }}
    >
      {children}
    </section>
  );
}
