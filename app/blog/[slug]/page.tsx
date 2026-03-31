import { ArrowLeft, Calendar, Tag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Paper from "@/components/paper";
import { Badge } from "@/components/ui/badge";
import { getBlogPostBySlug } from "@/lib/blog";
import { isPageEnabled } from "@/lib/page-settings";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.excerpt || undefined,
  };
}

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  if (!(await isPageEnabled("blog"))) notFound();

  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.published) notFound();

  return (
    <Paper>
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="size-3.5" />
            All posts
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight leading-snug">
            {post.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {formatDate(post.createdAt)}
            </span>
            {post.updatedAt !== post.createdAt && (
              <span>Updated {formatDate(post.updatedAt)}</span>
            )}
          </div>

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
        </div>

        <div
          className="blog-content prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </Paper>
  );
}
