import Link from "next/link";
import Image from "next/image";
import PostCard from "@/components/PostCard";
import FadeIn from "@/components/FadeIn";
import HeroCanvas from "@/components/HeroCanvas";
import HeroSection from "@/components/HeroSection";
import { getAllPosts } from "@/lib/posts";
import {
  MoonIcon,
  RoseIcon,
  LeafIcon,
  InfinityIcon,
  CrystalIcon,
  FlameIcon,
  EyeIcon,
  PenFeatherIcon,
} from "@/components/Icons";

const affirmations = [
  "Ти си водена от божественото.",
  "Твоята нежност е твоята най-голяма сила.",
  "Магията живее в будните ти мигове.",
  "Вселената заговорничи в твоя полза.",
];

const categories = [
  {
    label: "Духовност",
    desc: "Докосни измеренията отвъд видимото.",
    Icon: MoonIcon,
    color: "var(--lavender)",
    iconColor: "var(--lilac)",
    href: "/journal?cat=spirituality",
  },
  {
    label: "Обич към теб",
    desc: "Обичай се дълбоко — ти заслужаваш нежност.",
    Icon: RoseIcon,
    color: "var(--blush)",
    iconColor: "var(--rose)",
    href: "/journal?cat=self-love",
  },
  {
    label: "Осъзнатост",
    desc: "Открий красотата, скрита в настоящия миг.",
    Icon: LeafIcon,
    color: "var(--sage)",
    iconColor: "#7a9e6e",
    href: "/journal?cat=mindfulness",
  },
  {
    label: "Мантри",
    desc: "Думи с вибрация — мантри за трансформация и вътрешен мир.",
    Icon: InfinityIcon,
    color: "var(--mist)",
    iconColor: "var(--ink-mid)",
    href: "/journal?cat=mantras",
  },
];

const spaces = [
  {
    Icon: CrystalIcon,
    title: "Трансформация",
    body: "Всяко предизвикателство е покана за дълбока промяна. Намери красотата в своето преобразяване.",
  },
  {
    Icon: FlameIcon,
    title: "Страст и пробуждане",
    body: "Огънят вътре в теб не угасва — само чака да го разпознаеш и да му позволиш да гори.",
  },
  {
    Icon: EyeIcon,
    title: "Интуиция",
    body: "Твоето вътрешно знание е компасът, от който имаш нужда. Научи се да го следваш.",
  },
  {
    Icon: PenFeatherIcon,
    title: "Изразяване",
    body: "Словата ти имат сила. Пиши, говори, твори — светът се нуждае от твоя глас.",
  },
];

export default async function Home() {
  const posts = (await getAllPosts()).slice(0, 3);
  const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

  return (
    <>
      {/* ── Герой ────────────────────────────────────────────── */}
      <HeroSection>
        <HeroCanvas />

        <div
          className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center text-center gap-8"
          style={{ paddingTop: "calc(22vh + var(--header-h))", paddingBottom: "18vh" }}
        >
          <span
            className="tracking-[0.4em] text-[11px] uppercase font-semibold"
            style={{
              color: "rgba(220,190,140,0.95)",
              animation: "heroEntrance 0.8s 0.15s cubic-bezier(0.16,1,0.3,1) both",
              textShadow: "0 0 20px rgba(201,160,100,0.5)",
            }}
          >
            <span className="sparkle">✦</span>&ensp;Добре дошла в твоето светилище&ensp;<span className="sparkle" style={{ animationDelay: "1s" }}>✦</span>
          </span>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "clamp(3rem, 7vw, 6rem)",
              lineHeight: 1.12,
              color: "#f5eef8",
              textShadow: "0 2px 40px rgba(0,0,0,0.4)",
              animation: "heroEntrance 1s 0.3s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            Събуди се.{" "}
            <em
              style={{
                fontStyle: "italic",
                background: "linear-gradient(135deg, #d4a96e 0%, #e8c89a 50%, #b8935a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Разцъфти.
            </em>{" "}
            Вдъхнови.
          </h1>

          <div
            style={{
              width: "120px",
              height: "1px",
              background: "linear-gradient(to right, transparent, rgba(201,160,110,0.7), transparent)",
              animation: "heroEntrance 0.8s 0.5s cubic-bezier(0.16,1,0.3,1) both",
            }}
          />

          <p
            className="max-w-lg text-lg leading-relaxed"
            style={{
              color: "rgba(255,248,240,1)",
              animation: "heroEntrance 0.9s 0.55s cubic-bezier(0.16,1,0.3,1) both",
              textShadow: "0 2px 32px rgba(0,0,0,0.9), 0 1px 8px rgba(0,0,0,0.8)",
              fontWeight: 400,
              fontFamily: "'Lato', system-ui, sans-serif",
              fontStyle: "normal",
              fontSize: "1.15rem",
              letterSpacing: "0.01em",
            }}
          >
            Свещено пространство, където женската мъдрост среща духовното прозрение —
            истории, ритуали и размисли за жената, която помни своята магия.
          </p>

          <div
            className="flex flex-wrap justify-center gap-4 pt-2"
            style={{ animation: "heroEntrance 0.9s 0.7s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <Link
              href="/journal"
              className="group relative overflow-hidden px-9 py-3.5 rounded-full text-[11px] tracking-widest uppercase font-semibold transition-all duration-400 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, rgba(201,160,110,0.95), rgba(184,147,90,0.9))",
                color: "#fff",
                boxShadow: "0 4px 24px rgba(201,160,110,0.4), 0 0 0 1px rgba(201,160,110,0.3)",
              }}
            >
              Прочети дневника
            </Link>
            <Link
              href="/about"
              className="px-9 py-3.5 rounded-full text-[11px] tracking-widest uppercase font-semibold transition-all duration-400 hover:scale-105"
              style={{
                border: "1.5px solid rgba(230,215,245,0.5)",
                color: "rgba(240,228,255,0.92)",
                backdropFilter: "blur(8px)",
                background: "rgba(255,255,255,0.06)",
              }}
            >
              Моята история
            </Link>
          </div>
        </div>
      </HeroSection>

      {/* ── Утвърждение ─────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[var(--blush)] via-[var(--lavender)] to-[var(--mist)] py-6 border-y border-[var(--rose)]/40">
        <p
          className="affirm-text text-center text-[var(--ink)] text-xl"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 500 }}
        >
          ✦ {affirmation} ✦
        </p>
      </div>

      {/* ── Категории ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <FadeIn>
          <div className="divider mb-12">
            <span className="text-xs tracking-[0.3em] uppercase text-[var(--gold)] font-semibold">
              Изследвай
            </span>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.map(({ label, desc, Icon, color, iconColor, href }, i) => (
            <FadeIn key={label} delay={i * 80}>
              <Link
                href={href}
                className="bloom-card rounded-2xl p-6 flex flex-col items-center gap-4 border border-[var(--rose)]/50 hover:border-[var(--gold)] transition-colors duration-300 group h-full"
                style={{ background: color }}
              >
                <div
                  className="w-14 h-14 flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.45)" }}
                >
                  <Icon className="w-8 h-8" style={{ color: iconColor }} />
                </div>
                <span
                  className="text-sm tracking-widest uppercase text-[var(--ink)] font-semibold text-center"
                  style={{ letterSpacing: "0.15em" }}
                >
                  {label}
                </span>
                <p className="text-xs text-[var(--ink-mid)] text-center leading-relaxed hidden md:block">
                  {desc}
                </p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Последни публикации ──────────────────────────────── */}
      {posts.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <FadeIn>
            <div className="divider mb-12">
              <span className="text-xs tracking-[0.3em] uppercase text-[var(--gold)] font-semibold">
                Последно от дневника
              </span>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <FadeIn key={post.slug} delay={i * 100} className="h-full">
                <PostCard post={post} />
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={350} className="mt-12 text-center">
            <Link
              href="/journal"
              className="inline-block px-10 py-3 rounded-full text-sm tracking-widest uppercase border-2 border-[var(--gold)] text-[var(--gold)] font-semibold hover:bg-[var(--gold)] hover:text-white transition-all duration-300 hover:scale-105"
            >
              Виж всички записи
            </Link>
          </FadeIn>
        </section>
      )}

      {/* ── За мен (teaser) ─────────────────────────────────── */}
      <section
        className="py-24 border-t border-[var(--rose)]/30"
        style={{ background: "linear-gradient(160deg, var(--blush) 0%, var(--lavender) 60%, var(--mist) 100%)" }}
      >
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div className="aspect-square max-w-sm mx-auto rounded-[40%_60%_55%_45%/45%_40%_60%_55%] shadow-2xl relative overflow-hidden">
              <Image
                src="/krasy.jpg"
                alt="Краси"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 384px"
                priority
              />
            </div>
          </FadeIn>

          <FadeIn delay={150} className="flex flex-col gap-6">
            <span className="text-[var(--gold)] tracking-[0.3em] text-xs uppercase font-semibold">
              ✦ Жената зад думите ✦
            </span>
            <h2
              className="text-4xl md:text-5xl text-[var(--ink)] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
            >
              Здравей, красива душа.
            </h2>
            <p className="text-[var(--ink-mid)] leading-loose">
              Аз съм <strong className="text-[var(--ink)] font-semibold">Краси</strong> — жена,
              водена от любопитство и дълбока вяра, че всяка от нас носи вселена в себе си.
              Пиша за духовността, за нежността към собствената ни душа, за лунните ритуали и ежедневното свещено.
            </p>
            <blockquote
              className="border-l-2 border-[var(--lilac)] pl-5 text-lg text-[var(--ink-mid)]"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
            >
              „Когато жената се издига, целият свят омеква около нея."
            </blockquote>
            <Link
              href="/about"
              className="self-start px-8 py-3 rounded-full text-sm tracking-widest uppercase border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--parchment)] transition-all duration-300 font-semibold"
            >
              Моята история
            </Link>
          </FadeIn>
        </div>
      </section>


    </>
  );
}
