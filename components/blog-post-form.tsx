"use client";

import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

import Paper from "@/components/paper";
import RichTextEditor from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface BlogPostFormValues {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tagsInput: string;
  published: boolean;
}

interface BlogPostFormProps {
  initial?: BlogPostFormValues;
  onSave: (values: BlogPostFormValues) => Promise<void>;
  saving: boolean;
  error: string | null;
  backHref?: string;
  pageTitle: string;
  pageDescription?: string;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogPostForm({
  initial,
  onSave,
  saving,
  error,
  backHref = "/admin/editor/blog",
  pageTitle,
  pageDescription,
}: BlogPostFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [tagsInput, setTagsInput] = useState(initial?.tagsInput ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [slugEdited, setSlugEdited] = useState(
    Boolean(initial?.slug && initial.slug.length > 0),
  );

  const handleTitleChange = useCallback(
    (val: string) => {
      setTitle(val);
      if (!slugEdited) {
        setSlug(slugify(val));
      }
    },
    [slugEdited],
  );

  const handleSlugChange = useCallback((val: string) => {
    setSlug(val);
    setSlugEdited(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSave({ title, slug, content, excerpt, tagsInput, published });
  }

  return (
    <Paper>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={backHref}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{pageTitle}</h1>
            {pageDescription && (
              <p className="text-muted-foreground text-sm">{pageDescription}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
              <CardDescription>Title, slug, excerpt and tags</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="My Awesome Post"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="slug">
                  Slug *
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    /blog/{slug || "…"}
                  </span>
                </Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="my-awesome-post"
                  required
                  pattern="[a-z0-9-]+"
                  title="Lowercase letters, numbers and hyphens only"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A short summary shown on the blog listing page…"
                  rows={2}
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm resize-y"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Engineering, AI, Design"
                />
                <p className="text-xs text-muted-foreground">Comma-separated</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={published}
                  aria-label={published ? "Unpublish post" : "Publish post"}
                  onClick={() => setPublished((v) => !v)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    published ? "bg-primary" : "bg-input"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${
                      published ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
                <div className="flex items-center gap-1.5 text-sm">
                  {published ? (
                    <>
                      <Eye className="size-3.5 text-green-600 dark:text-green-400" />
                      <span className="text-green-700 dark:text-green-400 font-medium">
                        Published
                      </span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="size-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Draft</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Write your post. Paste from Notion, Google Docs, or anywhere —
                formatting is preserved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Start writing your post here…"
              />
            </CardContent>
          </Card>

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

          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href={backHref}>Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </Paper>
  );
}
