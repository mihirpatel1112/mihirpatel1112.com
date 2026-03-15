"use client";

import { useEffect, useState } from "react";
import Paper from "@/components/paper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

interface Article {
  title: string;
  description: string;
  url: string;
  tags: string[];
  dateRead: string;
}

export default function ArticlesEditorPage() {
  const [heading, setHeading] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [tagsInputs, setTagsInputs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/admin/articles");
        if (res.ok) {
          const data = await res.json();
          setHeading(data.heading ?? "");
          setArticles(data.articles ?? []);
          setTagsInputs(
            (data.articles ?? []).map((a: Article) =>
              (a.tags ?? []).join(", "),
            ),
          );
        }
      } catch {
        setError("Failed to load articles");
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  function addArticle() {
    setArticles((prev) => [
      ...prev,
      { title: "", description: "", url: "", tags: [], dateRead: "" },
    ]);
    setTagsInputs((prev) => [...prev, ""]);
  }

  function removeArticle(index: number) {
    setArticles((prev) => prev.filter((_, i) => i !== index));
    setTagsInputs((prev) => prev.filter((_, i) => i !== index));
  }

  function updateArticle(
    index: number,
    field: keyof Article,
    value: string | string[],
  ) {
    setArticles((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
    );
  }

  function updateTagsInput(index: number, value: string) {
    setTagsInputs((prev) => prev.map((s, i) => (i === index ? value : s)));
  }

  function parseTags(tagsStr: string): string[] {
    return tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        heading,
        articles: articles.map((a, i) => ({
          ...a,
          tags: parseTags(tagsInputs[i] ?? (a.tags ?? []).join(", ")),
        })),
      };
      const res = await fetch("/api/admin/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ?? data.error ?? "Failed to save");
      }
      setHeading(data.heading ?? "");
      setArticles(data.articles ?? []);
      setTagsInputs(
        (data.articles ?? []).map((a: Article) => (a.tags ?? []).join(", ")),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save articles");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Paper>
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-muted-foreground">Loading...</p>
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
          <div>
            <h1 className="text-2xl font-semibold">Edit Articles</h1>
            <p className="text-muted-foreground text-sm">
              Edit the articles section heading and list
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Articles Content</CardTitle>
            <CardDescription>
              Section heading and list shown on the homepage and /articles page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="articles-heading">Section Heading</Label>
                <Input
                  id="articles-heading"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="Articles I've Been Reading"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Articles</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addArticle}
                  >
                    <Plus className="size-4" />
                    Add Article
                  </Button>
                </div>

                {articles.map((article, index) => (
                  <div key={index} className="rounded-lg border p-4 space-y-3">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeArticle(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label>Title</Label>
                        <Input
                          value={article.title}
                          onChange={(e) =>
                            updateArticle(index, "title", e.target.value)
                          }
                          placeholder="Article title"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Date Read (DD/MM/YYYY)</Label>
                        <Input
                          value={article.dateRead}
                          onChange={(e) =>
                            updateArticle(index, "dateRead", e.target.value)
                          }
                          placeholder="01/01/2025"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Description</Label>
                      <textarea
                        value={article.description}
                        onChange={(e) =>
                          updateArticle(index, "description", e.target.value)
                        }
                        placeholder="Brief description"
                        rows={2}
                        className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>URL</Label>
                      <Input
                        value={article.url}
                        onChange={(e) =>
                          updateArticle(index, "url", e.target.value)
                        }
                        placeholder="https://..."
                        type="url"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Tags (comma-separated)</Label>
                      <Input
                        value={tagsInputs[index] ?? ""}
                        onChange={(e) => updateTagsInput(index, e.target.value)}
                        placeholder="AI, Agents, Bots"
                        autoComplete="off"
                        inputMode="text"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="text-sm text-destructive space-y-1">
                  <p>{error}</p>
                  {(error.includes("does not exist") ||
                    error.includes("relation")) && (
                    <p className="text-muted-foreground">
                      The articles tables may not exist. Run:{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        psql $DATABASE_URL -f scripts/init-articles.sql
                      </code>
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/editor">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Paper>
  );
}
