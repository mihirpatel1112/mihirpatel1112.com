import { NextResponse } from "next/server";

import { deleteBlogPost, getBlogPostById, updateBlogPost } from "@/lib/blog";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const post = await getBlogPostById(Number(id));
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch post";
    return NextResponse.json(
      { error: "Failed to fetch post", details: message },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, content, excerpt, tags, published } = body;

    const update: Parameters<typeof updateBlogPost>[1] = {};
    if (title !== undefined) update.title = String(title);
    if (slug !== undefined) update.slug = String(slug);
    if (content !== undefined) update.content = String(content);
    if (excerpt !== undefined) update.excerpt = String(excerpt);
    if (tags !== undefined)
      update.tags = Array.isArray(tags) ? tags.map(String) : [];
    if (published !== undefined) update.published = Boolean(published);

    const post = await updateBlogPost(Number(id), update);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update post";
    return NextResponse.json(
      { error: "Failed to update post", details: message },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const deleted = await deleteBlogPost(Number(id));
    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete post";
    return NextResponse.json(
      { error: "Failed to delete post", details: message },
      { status: 500 },
    );
  }
}
