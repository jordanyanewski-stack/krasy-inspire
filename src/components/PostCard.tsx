import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

const categoryColors: Record<string, string> = {
  spirituality:  "bg-[var(--lavender)] text-[var(--ink)]",
  "self-love":   "bg-[var(--blush)] text-[var(--ink)]",
  mindfulness:   "bg-[var(--sage)] text-[var(--ink)]",
  mantras:       "bg-[var(--mist)] text-[var(--ink)]",
  default:       "bg-[var(--rose)] text-[var(--ink)]",
};

export default function PostCard({ post }: { post: PostMeta }) {
  const colorClass =
    categoryColors[post.category?.toLowerCase().replace(/ /g, "-") ?? ""] ??
    categoryColors.default;

  return (
    <Link href={`/journal/${post.slug}`} className="block bloom-card h-full">
      <article className="bg-white/90 rounded-2xl overflow-hidden border border-[var(--rose)]/60 h-full flex flex-col shadow-sm">
        <div className="h-1.5 bg-gradient-to-r from-[var(--rose)] via-[var(--lilac)] to-[var(--mist)]" />

        <div className="p-7 flex flex-col gap-3 flex-1">
          {post.category && (
            <span className={`self-start text-[10px] tracking-[0.2em] uppercase font-bold px-3 py-1 rounded-full ${colorClass}`}>
              {post.category}
            </span>
          )}

          <h2
            className="text-2xl text-[var(--ink)] leading-snug"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
          >
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-sm text-[var(--ink-mid)] leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          )}

          <div className="mt-auto pt-5 flex items-center justify-between border-t border-[var(--rose)]/40">
            <time className="text-xs text-[var(--gold)] tracking-wide font-semibold">
              {new Date(post.date).toLocaleDateString("bg-BG", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span className="text-xs text-[var(--gold)] tracking-widest uppercase font-bold">
              Прочети →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
