"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import BlogPostForm, {
  type BlogPostFormValues,
} from "@/components/blog-post-form";

function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function NewBlogPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(values: BlogPostFormValues) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
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
        throw new Error(data.details ?? data.error ?? "Failed to create post");
      }
      router.push(`/admin/editor/blog/${data.post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <BlogPostForm
      onSave={handleSave}
      saving={saving}
      error={error}
      pageTitle="New Blog Post"
      pageDescription="Create a new blog post"
    />
  );
}
