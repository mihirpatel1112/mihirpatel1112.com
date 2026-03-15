"use client";

import { useEffect, useRef, useState } from "react";
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
import { ArrowLeft, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

interface Project {
  _id: number;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  year?: string;
}

interface TagsMap {
  [id: number]: string;
}

let nextId = 1;
function genId() {
  return nextId++;
}

function toProjectRows(raw: Omit<Project, "_id">[]): Project[] {
  return raw.map((p) => ({ ...p, _id: genId() }));
}

export default function ProjectsEditorPage() {
  const [heading, setHeading] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [tagsMap, setTagsMap] = useState<TagsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/admin/projects");
        if (res.ok) {
          const data = await res.json();
          setHeading(data.heading ?? "");
          const rows = toProjectRows(data.projects ?? []);
          setProjects(rows);
          const map: TagsMap = {};
          rows.forEach((p) => {
            map[p._id] = (p.tags ?? []).join(", ");
          });
          setTagsMap(map);
        }
      } catch {
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  function addProject() {
    const id = genId();
    setProjects((prev) => [
      ...prev,
      {
        _id: id,
        title: "",
        description: "",
        tags: [],
        githubUrl: "",
        liveUrl: "",
        year: "",
      },
    ]);
    setTagsMap((prev) => ({ ...prev, [id]: "" }));
  }

  function removeProject(id: number) {
    setProjects((prev) => prev.filter((p) => p._id !== id));
    setTagsMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function moveProject(index: number, direction: "up" | "down") {
    const toIndex = direction === "up" ? index - 1 : index + 1;
    if (toIndex < 0 || toIndex >= projects.length) return;
    setProjects((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      next.splice(toIndex, 0, removed);
      return next;
    });
  }

  function updateProject(
    id: number,
    field: keyof Omit<Project, "_id">,
    value: string,
  ) {
    setProjects((prev) =>
      prev.map((p) => (p._id === id ? { ...p, [field]: value } : p)),
    );
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
        projects: projects.map((p) => ({
          title: p.title,
          description: p.description,
          tags: parseTags(tagsMap[p._id] ?? (p.tags ?? []).join(", ")),
          githubUrl: p.githubUrl || undefined,
          liveUrl: p.liveUrl || undefined,
          year: p.year || undefined,
        })),
      };
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ?? data.error ?? "Failed to save");
      }
      setHeading(data.heading ?? "");
      const rows = toProjectRows(data.projects ?? []);
      setProjects(rows);
      const map: TagsMap = {};
      rows.forEach((p) => {
        map[p._id] = (p.tags ?? []).join(", ");
      });
      setTagsMap(map);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save projects");
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
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">Edit Projects</h1>
            <p className="text-muted-foreground text-sm">
              Use the arrows to reorder. Hit Save to persist changes.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Projects Content</CardTitle>
            <CardDescription>
              Section heading and list shown on the /projects page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="projects-heading">Section Heading</Label>
                <Input
                  id="projects-heading"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="Projects I've Done or Been Doing"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Projects</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addProject}
                  >
                    <Plus className="size-4" />
                    Add Project
                  </Button>
                </div>

                {projects.map((project, index) => (
                  <div
                    key={project._id}
                    className="rounded-lg border p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => moveProject(index, "up")}
                          disabled={index === 0}
                          aria-label="Move up"
                        >
                          <ChevronUp className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => moveProject(index, "down")}
                          disabled={index === projects.length - 1}
                          aria-label="Move down"
                        >
                          <ChevronDown className="size-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground ml-1">
                          #{index + 1}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeProject(project._id)}
                        className="text-destructive"
                        aria-label="Remove project"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label>Title</Label>
                        <Input
                          value={project.title}
                          onChange={(e) =>
                            updateProject(project._id, "title", e.target.value)
                          }
                          placeholder="Project title"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Year</Label>
                        <Input
                          value={project.year ?? ""}
                          onChange={(e) =>
                            updateProject(project._id, "year", e.target.value)
                          }
                          placeholder="2025"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>Description</Label>
                      <textarea
                        value={project.description}
                        onChange={(e) =>
                          updateProject(
                            project._id,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Project description"
                        rows={3}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label>GitHub URL</Label>
                        <Input
                          value={project.githubUrl ?? ""}
                          onChange={(e) =>
                            updateProject(
                              project._id,
                              "githubUrl",
                              e.target.value,
                            )
                          }
                          placeholder="https://github.com/..."
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Live URL</Label>
                        <Input
                          value={project.liveUrl ?? ""}
                          onChange={(e) =>
                            updateProject(
                              project._id,
                              "liveUrl",
                              e.target.value,
                            )
                          }
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>Tags (comma-separated)</Label>
                      <Input
                        value={tagsMap[project._id] ?? ""}
                        onChange={(e) =>
                          setTagsMap((prev) => ({
                            ...prev,
                            [project._id]: e.target.value,
                          }))
                        }
                        placeholder="Next.js, TypeScript, Tailwind"
                        autoComplete="off"
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
                      Run:{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        psql $DATABASE_URL -f scripts/init-projects.sql
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
