import { Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import Paper from "@/components/paper";
import { Badge } from "@/components/ui/badge";
import { getPublishedBlogPosts } from "@/lib/blog";
import { isPageEnabled } from "@/lib/page-settings";

export const metadata = {
  title: "Blog",
};

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPage() {
  if (!(await isPageEnabled("blog"))) notFound();

  const posts = await getPublishedBlogPosts();

  return (
    <Paper>
      <div className="space-y-10 pt-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-2 text-muted-foreground">
            Thoughts, notes, and ideas.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            No posts yet. Check back soon.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <article key={post.id} className="py-8 first:pt-0">
                <Link href={`/blog/${post.slug}`} className="group block">
                  <h2 className="text-xl font-semibold group-hover:underline underline-offset-4 decoration-muted-foreground/50">
                    {post.title}
                  </h2>
                </Link>

                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {formatDate(post.createdAt)}
                  </span>
                </div>

                {post.excerpt && (
                  <p className="mt-3 text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                )}

                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                    <Tag className="size-3 text-muted-foreground" />
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block text-sm font-medium hover:underline underline-offset-4"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </Paper>
  );
}
