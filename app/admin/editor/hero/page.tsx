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
import { ArrowLeft } from "lucide-react";

interface HeroContent {
  greeting: string;
  name: string;
  bio: string;
}

export default function HeroEditorPage() {
  const [heroForm, setHeroForm] = useState<HeroContent>({
    greeting: "",
    name: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHero() {
      try {
        const res = await fetch("/api/admin/hero");
        if (res.ok) {
          const data = await res.json();
          setHeroForm(data);
        }
      } catch {
        setError("Failed to load hero content");
      } finally {
        setLoading(false);
      }
    }
    fetchHero();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroForm),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ?? data.error ?? "Failed to save");
      }
      setHeroForm(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save hero content",
      );
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
            <h1 className="text-2xl font-semibold">Edit Hero</h1>
            <p className="text-muted-foreground text-sm">
              Edit the greeting, name, and bio shown on the homepage
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hero Content</CardTitle>
            <CardDescription>
              Changes will appear on the homepage immediately after saving
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSave}
              className="flex flex-col gap-4 max-w-xl"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="hero-greeting">Greeting</Label>
                <Input
                  id="hero-greeting"
                  value={heroForm.greeting}
                  onChange={(e) =>
                    setHeroForm((p) => ({ ...p, greeting: e.target.value }))
                  }
                  placeholder="Hello, I'm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="hero-name">Name</Label>
                <Input
                  id="hero-name"
                  value={heroForm.name}
                  onChange={(e) =>
                    setHeroForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Mihir Patel"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="hero-bio">Bio</Label>
                <textarea
                  id="hero-bio"
                  value={heroForm.bio}
                  onChange={(e) =>
                    setHeroForm((p) => ({ ...p, bio: e.target.value }))
                  }
                  placeholder="I craft elegant solutions..."
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>
              {error && (
                <div className="text-sm text-destructive space-y-1">
                  <p>{error}</p>
                  {(error.includes("does not exist") ||
                    error.includes("relation")) && (
                    <p className="text-muted-foreground">
                      The hero table may not exist. Run:{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        psql $DATABASE_URL -f scripts/init-hero.sql
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
