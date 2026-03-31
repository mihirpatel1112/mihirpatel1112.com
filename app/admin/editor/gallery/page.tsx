"use client";

import { ArrowLeft, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Photo {
  _id: number;
  id?: number;
  url: string;
  caption: string;
  altText: string;
}

let nextId = 1;
function genId() {
  return nextId++;
}

function toPhotoRows(
  raw: Array<Omit<Photo, "_id"> & { id?: number }>,
): Photo[] {
  return raw.map((p) => ({
    ...p,
    _id: p.id ?? genId(),
  }));
}

export default function GalleryEditorPage() {
  const [heading, setHeading] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/admin/gallery");
        if (res.ok) {
          const data = await res.json();
          setHeading(data.heading ?? "");
          const rows = toPhotoRows(data.photos ?? []);
          setPhotos(rows);
        }
      } catch {
        setError("Failed to load gallery");
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  function addPhoto() {
    const id = genId();
    setPhotos((prev) => [
      ...prev,
      { _id: id, url: "", caption: "", altText: "" },
    ]);
  }

  function removePhoto(id: number) {
    setPhotos((prev) => prev.filter((p) => p._id !== id));
  }

  function movePhoto(index: number, direction: "up" | "down") {
    const toIndex = direction === "up" ? index - 1 : index + 1;
    if (toIndex < 0 || toIndex >= photos.length) return;
    setPhotos((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      next.splice(toIndex, 0, removed);
      return next;
    });
  }

  function updatePhoto(
    id: number,
    field: keyof Omit<Photo, "_id">,
    value: string,
  ) {
    setPhotos((prev) =>
      prev.map((p) => (p._id === id ? { ...p, [field]: value } : p)),
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        heading,
        photos: photos
          .filter((p) => p.id != null && p.id > 0)
          .map((p) => ({ id: p.id, altText: p.altText })),
      };
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ?? data.error ?? "Failed to save");
      }
      setHeading(data.heading ?? "");
      const rows = toPhotoRows(data.photos ?? []);
      setPhotos(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save gallery");
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
            <h1 className="text-2xl font-semibold">Edit Gallery</h1>
            <p className="text-muted-foreground text-sm">
              Upload images directly. Use arrows to reorder. Hit Save to
              persist.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gallery Content</CardTitle>
            <CardDescription>
              Section heading and photos shown on the /gallery page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="gallery-heading">Section Heading</Label>
                <Input
                  id="gallery-heading"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="Gallery"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Photos</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPhoto}
                  >
                    <Plus className="size-4" />
                    Add Photo
                  </Button>
                </div>

                {photos.map((photo, index) => (
                  <div
                    key={photo._id}
                    className="rounded-lg border p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => movePhoto(index, "up")}
                          disabled={index === 0}
                          aria-label="Move up"
                        >
                          <ChevronUp className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => movePhoto(index, "down")}
                          disabled={index === photos.length - 1}
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
                        onClick={() => removePhoto(photo._id)}
                        className="text-destructive"
                        aria-label="Remove photo"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>
                        Image {uploadingId === photo._id && "(uploading…)"}
                      </Label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif"
                        disabled={uploadingId === photo._id}
                        className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground file:cursor-pointer hover:file:bg-primary/90"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          setUploadingId(photo._id);
                          setError(null);
                          try {
                            const fd = new FormData();
                            fd.append("file", f);
                            const res = await fetch(
                              "/api/admin/gallery/upload",
                              {
                                method: "POST",
                                body: fd,
                              },
                            );
                            const data = await res.json();
                            if (!res.ok)
                              throw new Error(data.error ?? "Upload failed");
                            setPhotos((prev) =>
                              prev.map((p) =>
                                p._id === photo._id
                                  ? { ...p, url: data.url, id: data.id }
                                  : p,
                              ),
                            );
                          } catch (err) {
                            setError(
                              err instanceof Error
                                ? err.message
                                : "Upload failed",
                            );
                          } finally {
                            setUploadingId(null);
                          }
                          e.target.value = "";
                        }}
                      />
                    </div>

                    {photo.url && photo.id && (
                      <div className="rounded border overflow-hidden max-w-[200px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/api/gallery/thumbnail/${photo.id}`}
                          alt={photo.altText || "Preview"}
                          className="w-full h-auto object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <Label>Alt text (accessibility)</Label>
                      <Input
                        value={photo.altText}
                        onChange={(e) =>
                          updatePhoto(photo._id, "altText", e.target.value)
                        }
                        placeholder="Describe the photo for screen readers"
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
                        psql $DATABASE_URL -f scripts/init-gallery.sql
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
