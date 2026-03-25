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

interface Book {
  title: string;
  author: string;
}

interface Certification {
  name: string;
  issuer: string;
  issuedDate: string;
  credentialId: string;
  url: string;
}

interface CertificationRow extends Certification {
  _id: number;
}

interface AboutData {
  intro: string;
  hobbies: string[];
  books: Book[];
  socialLinks: SocialLink[];
  certifications: Certification[];
}

interface SocialLink {
  label: string;
  url: string;
}

interface SocialLinkRow extends SocialLink {
  _id: number;
}

let nextRowId = 1;

function toSocialLinkRows(links: SocialLink[]): SocialLinkRow[] {
  return links.map((link) => ({ ...link, _id: nextRowId++ }));
}

function toCertificationRows(certs: Certification[]): CertificationRow[] {
  return certs.map((cert) => ({ ...cert, _id: nextRowId++ }));
}

export default function AboutEditorPage() {
  const [intro, setIntro] = useState("");
  const [hobbiesInput, setHobbiesInput] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [certifications, setCertifications] = useState<CertificationRow[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await fetch("/api/admin/about");
        if (res.ok) {
          const data = await res.json();
          setIntro(data.intro ?? "");
          setHobbiesInput((data.hobbies ?? []).join(", "));
          setBooks(data.books ?? []);
          setCertifications(toCertificationRows(data.certifications ?? []));
          setSocialLinks(toSocialLinkRows(data.socialLinks ?? []));
        }
      } catch {
        setError("Failed to load about content");
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  function addBook() {
    setBooks((prev) => [...prev, { title: "", author: "" }]);
  }

  function removeBook(index: number) {
    setBooks((prev) => prev.filter((_, i) => i !== index));
  }

  function updateBook(index: number, field: keyof Book, value: string) {
    setBooks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)),
    );
  }

  function addCertification() {
    setCertifications((prev) => [
      ...prev,
      {
        _id: nextRowId++,
        name: "",
        issuer: "",
        issuedDate: "",
        credentialId: "",
        url: "",
      },
    ]);
  }

  function removeCertification(id: number) {
    setCertifications((prev) => prev.filter((c) => c._id !== id));
  }

  function updateCertification(
    id: number,
    field: keyof Certification,
    value: string,
  ) {
    setCertifications((prev) =>
      prev.map((c) => (c._id === id ? { ...c, [field]: value } : c)),
    );
  }

  function moveCertification(index: number, direction: "up" | "down") {
    const toIndex = direction === "up" ? index - 1 : index + 1;
    if (toIndex < 0 || toIndex >= certifications.length) return;
    setCertifications((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      next.splice(toIndex, 0, removed);
      return next;
    });
  }

  function addSocialLink() {
    setSocialLinks((prev) => [
      ...prev,
      { _id: nextRowId++, label: "", url: "" },
    ]);
  }

  function removeSocialLink(id: number) {
    setSocialLinks((prev) => prev.filter((link) => link._id !== id));
  }

  function updateSocialLink(
    id: number,
    field: keyof SocialLink,
    value: string,
  ) {
    setSocialLinks((prev) =>
      prev.map((link) =>
        link._id === id ? { ...link, [field]: value } : link,
      ),
    );
  }

  function moveSocialLink(index: number, direction: "up" | "down") {
    const toIndex = direction === "up" ? index - 1 : index + 1;
    if (toIndex < 0 || toIndex >= socialLinks.length) return;

    setSocialLinks((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      next.splice(toIndex, 0, removed);
      return next;
    });
  }

  function parseHobbies(str: string): string[] {
    return str
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        intro,
        hobbies: parseHobbies(hobbiesInput),
        books,
        certifications: certifications.map(
          ({ name, issuer, issuedDate, credentialId, url }) => ({
            name,
            issuer,
            issuedDate,
            credentialId,
            url,
          }),
        ),
        socialLinks: socialLinks.map(({ label, url }) => ({ label, url })),
      };
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ?? data.error ?? "Failed to save");
      }
      setIntro(data.intro ?? "");
      setHobbiesInput((data.hobbies ?? []).join(", "));
      setBooks(data.books ?? []);
      setCertifications(toCertificationRows(data.certifications ?? []));
      setSocialLinks(toSocialLinkRows(data.socialLinks ?? []));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save about content",
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
            <h1 className="text-2xl font-semibold">Edit About Page</h1>
            <p className="text-muted-foreground text-sm">
              Edit the intro, hobbies, books, certifications, and social links
              sections
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About Content</CardTitle>
            <CardDescription>
              Changes will appear on the /about page immediately after saving
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="about-intro">Intro Paragraph</Label>
                <textarea
                  id="about-intro"
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="Hi! I'm..."
                  rows={6}
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="about-hobbies">Hobbies (comma-separated)</Label>
                <Input
                  id="about-hobbies"
                  value={hobbiesInput}
                  onChange={(e) => setHobbiesInput(e.target.value)}
                  placeholder="Reading, Coding, Cloud Technologies"
                  autoComplete="off"
                  inputMode="text"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Books I&apos;ve Been Reading</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addBook}
                  >
                    <Plus className="size-4" />
                    Add Book
                  </Button>
                </div>

                {books.map((book, index) => (
                  <div key={index} className="rounded-lg border p-4 space-y-3">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeBook(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label>Title</Label>
                        <Input
                          value={book.title}
                          onChange={(e) =>
                            updateBook(index, "title", e.target.value)
                          }
                          placeholder="Book title"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Author</Label>
                        <Input
                          value={book.author}
                          onChange={(e) =>
                            updateBook(index, "author", e.target.value)
                          }
                          placeholder="Author name"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Certifications</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCertification}
                  >
                    <Plus className="size-4" />
                    Add Certification
                  </Button>
                </div>

                {certifications.map((cert, index) => (
                  <div
                    key={cert._id}
                    className="rounded-lg border p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => moveCertification(index, "up")}
                          disabled={index === 0}
                          aria-label="Move certification up"
                        >
                          <ChevronUp className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => moveCertification(index, "down")}
                          disabled={index === certifications.length - 1}
                          aria-label="Move certification down"
                        >
                          <ChevronDown className="size-4" />
                        </Button>
                        <span className="ml-1 text-sm text-muted-foreground">
                          #{index + 1}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeCertification(cert._id)}
                        className="text-destructive"
                        aria-label="Remove certification"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label>Certification Name</Label>
                        <Input
                          value={cert.name}
                          onChange={(e) =>
                            updateCertification(
                              cert._id,
                              "name",
                              e.target.value,
                            )
                          }
                          placeholder="AWS Solutions Architect"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Issuing Organization</Label>
                        <Input
                          value={cert.issuer}
                          onChange={(e) =>
                            updateCertification(
                              cert._id,
                              "issuer",
                              e.target.value,
                            )
                          }
                          placeholder="Amazon Web Services"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Issue Date</Label>
                        <Input
                          value={cert.issuedDate}
                          onChange={(e) =>
                            updateCertification(
                              cert._id,
                              "issuedDate",
                              e.target.value,
                            )
                          }
                          placeholder="Jan 2024"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Credential ID</Label>
                        <Input
                          value={cert.credentialId}
                          onChange={(e) =>
                            updateCertification(
                              cert._id,
                              "credentialId",
                              e.target.value,
                            )
                          }
                          placeholder="ABC123XYZ"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Credential URL</Label>
                      <Input
                        value={cert.url}
                        onChange={(e) =>
                          updateCertification(cert._id, "url", e.target.value)
                        }
                        placeholder="https://www.credly.com/badges/..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Social Links</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSocialLink}
                  >
                    <Plus className="size-4" />
                    Add Social Link
                  </Button>
                </div>

                {socialLinks.map((link, index) => (
                  <div
                    key={link._id}
                    className="rounded-lg border p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => moveSocialLink(index, "up")}
                          disabled={index === 0}
                          aria-label="Move social link up"
                        >
                          <ChevronUp className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => moveSocialLink(index, "down")}
                          disabled={index === socialLinks.length - 1}
                          aria-label="Move social link down"
                        >
                          <ChevronDown className="size-4" />
                        </Button>
                        <span className="ml-1 text-sm text-muted-foreground">
                          #{index + 1}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeSocialLink(link._id)}
                        className="text-destructive"
                        aria-label="Remove social link"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label>Label</Label>
                        <Input
                          value={link.label}
                          onChange={(e) =>
                            updateSocialLink(link._id, "label", e.target.value)
                          }
                          placeholder="LinkedIn"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>URL</Label>
                        <Input
                          value={link.url}
                          onChange={(e) =>
                            updateSocialLink(link._id, "url", e.target.value)
                          }
                          placeholder="https://linkedin.com/in/your-profile"
                        />
                      </div>
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
                      The about tables may not exist. Run:{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        psql $DATABASE_URL -f scripts/init-about.sql
                      </code>{" "}
                      or{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        psql $DATABASE_URL -f scripts/add-about-social-links.sql
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
