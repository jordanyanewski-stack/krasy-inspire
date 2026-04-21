import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "За мен",
  description: "Жената зад Krasy Inspire — нейната история, мисия и магия.",
};

const values = [
  { emoji: "🌙", label: "Интуиция" },
  { emoji: "🌸", label: "Женска сила" },
  { emoji: "✨", label: "Духовен растеж" },
  { emoji: "🍃", label: "Вътрешен мир" },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 pb-20" style={{ paddingTop: "calc(5rem + var(--header-h))" }}>
      <div className="text-center mb-16 flex flex-col items-center gap-4">
        <span
          className="text-[var(--gold)] tracking-[0.3em] text-xs uppercase font-semibold"
          style={{ animation: "heroEntrance 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          ✦ Жената зад думите ✦
        </span>
        <h1
          className="text-5xl md:text-6xl text-[var(--ink)]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            animation: "heroEntrance 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          Моята история
        </h1>
        <div
          className="divider w-40 mt-2"
          style={{ animation: "heroEntrance 0.8s 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
        ><span className="divider-ornament">✦ ✦ ✦</span></div>
      </div>

      <div className="grid md:grid-cols-2 gap-16 items-start">
        <FadeIn className="flex flex-col gap-6">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg relative">
            <Image
              src="/krasy.jpg"
              alt="Краси"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {values.map(({ emoji, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-white/80 rounded-xl px-4 py-3 border border-[var(--rose)]/50"
              >
                <span className="text-lg">{emoji}</span>
                <span className="text-sm tracking-wide text-[var(--ink)] font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={150} className="flex flex-col gap-8">
          <h2
            className="text-3xl text-[var(--ink)]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 400 }}
          >
            Здравей, красива душа.
          </h2>

          <div className="flex flex-col gap-5 text-[var(--ink-mid)] leading-loose text-base">
            <p>
              Аз съм <strong className="text-[var(--ink)] font-semibold">Краси</strong> — жена,
              водена от любопитство и дълбока вяра, че всяка от нас носи вселена в себе си.
              Това пространство се роди от моето собствено пътуване на спомняне —
              да се науча да вярвам на интуицията си, да уважавам цикличността си
              и да живея от сърцето, а не от страха.
            </p>
            <p>
              Krasy Inspire е моят дар за теб: тихо убежище, където можеш да забавиш,
              да поемеш въздух и да се срещнеш отново с магията, която живее в теб.
              Пиша за духовността, за нежността към собствената ни душа, за лунните ритуали
              и ежедневното свещено — мъдростта, която нещо дълбоко в теб вече разпознава.
            </p>
            <p>
              Независимо дали си намерила пътя тук чрез търсене, споделяне или чиста
              синхроничност — вярвам, че си тук по причина. Добре дошла у дома.
            </p>
          </div>

          <blockquote
            className="border-l-2 border-[var(--lilac)] pl-6 text-xl text-[var(--ink-mid)]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 500 }}
          >
            „Когато жената се издига, целият свят омеква около нея."
          </blockquote>

          <Link
            href="/journal"
            className="btn-shimmer self-start px-8 py-3 rounded-full text-sm tracking-widest uppercase bg-[var(--ink)] text-[var(--parchment)] hover:scale-105 transition-all duration-300"
          >
            Разгледай дневника
          </Link>
        </FadeIn>
      </div>
    </div>
  );
}
