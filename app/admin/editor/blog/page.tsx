"use client";

import {
  ArrowLeft,
  ExternalLink,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import Paper from "@/components/paper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/blog");
        if (!res.ok) throw new Error("Failed to load posts");
        const data = await res.json();
        setPosts(data.posts ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <Paper>
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-muted-foreground">Loading posts…</p>
        </div>
      </Paper>
    );
  }

  return (
    <Paper>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/editor">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold">Blog Posts</h1>
            <p className="text-muted-foreground text-sm">
              Manage your blog posts
            </p>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/editor/blog/new">
              <Plus className="size-4" />
              New Post
            </Link>
          </Button>
        </div>

        {error && (
          <div className="text-sm text-destructive space-y-1">
            <p>{error}</p>
            {(error.includes("does not exist") ||
              error.includes("relation")) && (
              <p className="text-muted-foreground">
                Run the DB migration:{" "}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  psql $DATABASE_URL -f scripts/init-blog.sql
                </code>
              </p>
            )}
          </div>
        )}

        {posts.length === 0 && !error ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
              <p className="text-muted-foreground text-sm">
                No posts yet. Create your first one.
              </p>
              <Button asChild>
                <Link href="/admin/editor/blog/new">
                  <Plus className="size-4" />
                  New Post
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="flex items-center gap-2 flex-wrap">
                        <span className="truncate">{post.title}</span>
                        {post.published ? (
                          <Badge className="shrink-0 bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/20 border-0">
                            <Eye className="size-2.5 mr-1" />
                            Published
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="shrink-0 text-muted-foreground"
                          >
                            <EyeOff className="size-2.5 mr-1" />
                            Draft
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        /blog/{post.slug} · {formatDate(post.createdAt)}
                      </CardDescription>
                    </div>
                  </div>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex gap-2">
                  {post.published && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="shrink-0"
                    >
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="size-3.5" />
                        View
                      </a>
                    </Button>
                  )}
                  <Button size="sm" asChild className="flex-1">
                    <Link href={`/admin/editor/blog/${post.id}`}>
                      <Pencil className="size-3.5" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive shrink-0"
                    disabled={deleting === post.id}
                    onClick={() => handleDelete(post.id, post.title)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Paper>
  );
}
