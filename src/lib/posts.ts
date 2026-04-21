import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content/posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  category?: string;
  coverColor?: string;
  coverImage?: string;
  published?: boolean;
};

export type Post = PostMeta & { content: string };

function slugsFromDir(): string[] {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.(md|mdx)$/, ""));
}

function readPost(slug: string): Post {
  const extensions = [".md", ".mdx"];
  for (const ext of extensions) {
    const filePath = path.join(postsDir, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ? String(data.date) : "",
        excerpt: data.excerpt,
        category: data.category,
        coverColor: data.coverColor,
        coverImage: data.coverImage,
        published: data.published !== false,
        content,
      };
    }
  }
  throw new Error(`Post not found: ${slug}`);
}

export function getAllPosts(): PostMeta[] {
  return slugsFromDir()
    .map((slug) => {
      const { content: _c, ...meta } = readPost(slug);
      return meta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post {
  return readPost(slug);
}

export function getAllSlugs(): string[] {
  return slugsFromDir();
}

export function writePost(slug: string, data: Omit<Post, 'slug'>): void {
  if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });
  const frontmatter = [
    `title: "${data.title.replace(/"/g, '\\"')}"`,
    `date: "${data.date}"`,
    data.excerpt ? `excerpt: "${data.excerpt.replace(/"/g, '\\"')}"` : null,
    data.category ? `category: "${data.category}"` : null,
    data.coverColor ? `coverColor: "${data.coverColor}"` : null,
    data.coverImage ? `coverImage: "${data.coverImage}"` : null,
    data.published === false ? `published: false` : null,
  ]
    .filter(Boolean)
    .join('\n');
  const fileContent = `---\n${frontmatter}\n---\n\n${data.content}`;
  fs.writeFileSync(path.join(postsDir, `${slug}.md`), fileContent, 'utf-8');
}

export function deletePost(slug: string): void {
  const extensions = ['.md', '.mdx'];
  for (const ext of extensions) {
    const filePath = path.join(postsDir, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return;
    }
  }
}
