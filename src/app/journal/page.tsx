import PostCard from "@/components/PostCard";
import FadeIn from "@/components/FadeIn";
import { getAllPosts } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Дневник",
  description: "Размисли за духовност, себелюбие, осъзнатост и мантри.",
};

export default function JournalPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-5xl mx-auto px-6 pb-20" style={{ paddingTop: "calc(5rem + var(--header-h))" }}>
      <div className="text-center mb-16 flex flex-col items-center gap-4">
        <span
          className="text-[var(--gold)] tracking-[0.3em] text-xs uppercase font-semibold"
          style={{ animation: "heroEntrance 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          ✦ Свещени писания ✦
        </span>
        <h1
          className="text-5xl md:text-6xl text-[var(--ink)]"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            animation: "heroEntrance 0.8s 0.2s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          Дневникът
        </h1>
        <p
          className="max-w-md text-[var(--ink-mid)] text-base leading-relaxed"
          style={{ animation: "heroEntrance 0.8s 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          Размисли, ритуали и бележки за душата — написани от сърце, за твоето.
        </p>
        <div className="divider w-40 mt-2" style={{ animation: "heroEntrance 0.8s 0.45s cubic-bezier(0.16,1,0.3,1) both" }}><span className="divider-ornament">✦ ✦ ✦</span></div>
      </div>

      {posts.length === 0 ? (
        <FadeIn className="text-center py-24 flex flex-col gap-4 items-center">
          <span className="text-5xl">🌸</span>
          <p
            className="text-2xl text-[var(--ink-mid)]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
          >
            Историите се събират…
          </p>
          <p className="text-sm text-[var(--ink-soft)]">
            Добави Markdown файлове в <code className="bg-[var(--blush)] px-2 py-0.5 rounded text-[var(--ink)]">content/posts/</code>, за да се появят тук.
          </p>
        </FadeIn>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 80} className="h-full">
              <PostCard post={post} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
