"use client";

import { ExternalLink, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import Paper from "@/components/paper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PageInfo {
  path: string;
  title: string;
}

function getEditorPath(pagePath: string): string {
  if (pagePath === "/") return "/admin/editor/hero";
  const slug = pagePath.replace(/^\//, "") || "home";
  return `/admin/editor/${slug}`;
}

export default function EditorPage() {
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch("/api/admin/pages");
        if (!res.ok) throw new Error("Failed to fetch pages");
        const data = await res.json();
        setPages(data.pages ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, []);

  if (loading) {
    return (
      <Paper>
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-muted-foreground">Loading pages...</p>
        </div>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper>
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-destructive">{error}</p>
        </div>
      </Paper>
    );
  }

  return (
    <Paper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Page Editor</h1>
          <p className="text-muted-foreground mt-1">
            Select a page to view or edit
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Card key={page.path}>
              <CardHeader>
                <CardTitle>{page.title}</CardTitle>
                <CardDescription>{page.path}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link
                    href={page.path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-4" />
                    View
                  </Link>
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link href={getEditorPath(page.path)}>
                    <Pencil className="size-4" />
                    Edit
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Paper>
  );
}
