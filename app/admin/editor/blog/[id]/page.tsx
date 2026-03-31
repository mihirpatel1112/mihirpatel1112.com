"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BlogPostForm, {
  type BlogPostFormValues,
} from "@/components/blog-post-form";
import Paper from "@/components/paper";

function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [initial, setInitial] = useState<BlogPostFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/blog/${id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Failed to load post");
        }
        const { post } = await res.json();
        setInitial({
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          tagsInput: (post.tags ?? []).join(", "),
          published: post.published,
        });
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleSave(values: BlogPostFormValues) {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          slug: values.slug,
          content: values.content,
          excerpt: values.excerpt,
          tags: parseTags(values.tagsInput),
          published: values.published,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ?? data.error ?? "Failed to save");
      }
      setInitial({
        title: data.post.title,
        slug: data.post.slug,
        content: data.post.content,
        excerpt: data.post.excerpt,
        tagsInput: (data.post.tags ?? []).join(", "),
        published: data.post.published,
      });
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Paper>
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-muted-foreground">Loading post…</p>
        </div>
      </Paper>
    );
  }

  if (loadError || !initial) {
    return (
      <Paper>
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-destructive">{loadError ?? "Post not found"}</p>
        </div>
      </Paper>
    );
  }

  return (
    <BlogPostForm
      initial={initial}
      onSave={handleSave}
      saving={saving}
      error={saveError}
      pageTitle="Edit Post"
      pageDescription={`Editing: ${initial.title}`}
    />
  );
}
