export const dynamic = 'force-dynamic'

import { getPost, getAllSlugs } from "@/lib/posts";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { remark } from "remark";
import html from "remark-html";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPost(slug);
    return { title: post.title, description: post.excerpt ?? post.title };
  } catch {
    return { title: "Не е намерено" };
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  let post;
  try {
    post = await getPost(slug);
  } catch {
    notFound();
  }

  const processed = await remark().use(html).process(post.content);
  const contentHtml = processed.toString();

  return (
    <article className="max-w-2xl mx-auto px-6 pb-20" style={{ paddingTop: "calc(5rem + var(--header-h))" }}>
      <Link
        href="/journal"
        className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[var(--gold)] hover:opacity-70 transition-opacity mb-12"
      >
        ← Дневник
      </Link>

      {post.category && (
        <span className="inline-block text-[10px] tracking-[0.25em] uppercase bg-[var(--lavender)] text-[var(--ink)] px-3 py-1 rounded-full mb-6">
          {post.category}
        </span>
      )}

      <h1
        className="text-4xl md:text-5xl text-[var(--ink)] mb-4 leading-tight"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
      >
        {post.title}
      </h1>

      <time className="block text-xs text-[var(--gold)] tracking-wide mb-10">
        {new Date(post.date).toLocaleDateString("bg-BG", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </time>

      <div className="divider mb-10"><span className="divider-ornament">✦ ✦ ✦</span></div>

      <div
        className="prose-krasy max-w-none text-[var(--ink-mid)] leading-loose"
        style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300, fontSize: "1.05rem" }}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <div className="divider mt-16 mb-10"><span className="divider-ornament">✦ ✦ ✦</span></div>

      <div className="text-center">
        <Link
          href="/journal"
          className="inline-block px-8 py-3 rounded-full text-sm tracking-widest uppercase border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-white transition-colors"
        >
          Още от дневника
        </Link>
      </div>
    </article>
  );
}
