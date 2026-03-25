"use client";

import { ExternalLink, Pencil } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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

interface PageSetting {
  slug: string;
  enabled: boolean;
}

function decodePathSegment(seg: string): string {
  try {
    return decodeURIComponent(seg);
  } catch {
    return seg;
  }
}

/**
 * Drop Next.js dynamic / special segments (decode first so %5Bslug%5D is caught).
 */
function toPublicPath(path: string): string {
  const segs = path
    .normalize("NFC")
    .split("/")
    .filter(Boolean)
    .map(decodePathSegment)
    .filter((s) => {
      if (/[\[\]［］]/.test(s)) return false;
      if (s.startsWith("(") && s.endsWith(")")) return false;
      return true;
    });
  return segs.length ? `/${segs.join("/")}` : "/";
}

/** Public site URL for “View” (no dynamic segments). */
function safePageHref(path: string): string {
  const p = toPublicPath(path);
  return /[\[\]]/.test(p) ? "/" : p;
}

/**
 * Admin editor URL: only the first path segment (e.g. /blog/... → /admin/editor/blog).
 * Avoids nested junk and matches app/admin/editor/<name>/page.tsx.
 */
function getEditorPath(pagePath: string): string {
  const path = toPublicPath(pagePath);
  if (path === "/") return "/admin/editor/hero";
  const first = path.replace(/^\//, "").split("/")[0] || "home";
  const href = `/admin/editor/${first}`;
  return /[\[\]]/.test(href) ? "/admin/editor" : href;
}

function pathToSlug(path: string): string {
  return toPublicPath(path).replace(/^\//, "") || "home";
}

export default function EditorPage() {
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [settings, setSettings] = useState<PageSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [pagesRes, settingsRes] = await Promise.all([
          fetch("/api/admin/pages"),
          fetch("/api/admin/page-settings"),
        ]);
        if (!pagesRes.ok) throw new Error("Failed to fetch pages");
        const pagesData = await pagesRes.json();
        const raw: PageInfo[] = pagesData.pages ?? [];
        // Never feed <Link> literal dynamic segments (e.g. /blog/[slug]); dedupe by public path
        const seen = new Set<string>();
        const safe: PageInfo[] = [];
        for (const p of raw) {
          const path = toPublicPath(p.path);
          if (seen.has(path)) continue;
          seen.add(path);
          safe.push({ ...p, path });
        }
        setPages(safe);
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData.settings ?? []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const isEnabled = useCallback(
    (path: string) => {
      const slug = pathToSlug(path);
      const setting = settings.find((s) => s.slug === slug);
      return setting ? setting.enabled : true;
    },
    [settings],
  );

  async function togglePage(path: string) {
    const slug = pathToSlug(path);
    const current = isEnabled(path);
    setToggling(slug);
    try {
      const res = await fetch("/api/admin/page-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, enabled: !current }),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings ?? []);
      }
    } finally {
      setToggling(null);
    }
  }

  if (loading) {
    return (
      <Paper>
        <div className="flex justify-center items-center min-h-[40vh]">
          <p className="text-muted-foreground">Loading pages...</p>
        </div>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper>
        <div className="flex justify-center items-center min-h-[40vh]">
          <p className="text-destructive">{error}</p>
        </div>
      </Paper>
    );
  }

  return (
    <Paper>
      <div className="space-y-6">
        <div>
          <h1 className="font-semibold text-2xl">Page Editor</h1>
          <p className="mt-1 text-muted-foreground">
            Select a page to view or edit, or toggle visibility
          </p>
        </div>

        <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => {
            const slug = pathToSlug(page.path);
            const enabled = isEnabled(page.path);
            const viewHref = safePageHref(page.path);
            const isHome = viewHref === "/";
            const isToggling = toggling === slug;

            return (
              <Card
                key={viewHref}
                className={!enabled && !isHome ? "opacity-60" : ""}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <CardTitle>{page.title}</CardTitle>
                      <CardDescription>{viewHref}</CardDescription>
                    </div>

                    {/* Toggle switch — hidden for home page */}
                    {!isHome && (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        aria-label={
                          enabled
                            ? `Disable ${page.title} page`
                            : `Enable ${page.title} page`
                        }
                        disabled={isToggling}
                        onClick={() => togglePage(page.path)}
                        className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                          enabled ? "bg-primary" : "bg-input"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${
                            enabled ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <a
                      href={viewHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-4" />
                      View
                    </a>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <a href={getEditorPath(page.path)}>
                      <Pencil className="size-4" />
                      Edit
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Paper>
  );
}
