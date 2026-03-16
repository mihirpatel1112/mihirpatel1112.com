"use client";

import { ArrowLeft } from "lucide-react";
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

export default function PageEditorPlaceholder({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState<string | null>(null);
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  if (!slug) return null;

  const pageTitle = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <Paper>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/editor">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Edit {pageTitle}</CardTitle>
            <CardDescription>
              Editor for this page is not yet available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/admin/editor">Back to Page List</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Paper>
  );
}
