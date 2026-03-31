import { NextResponse } from "next/server";

import { createBlogPost, getAllBlogPosts } from "@/lib/blog";

export async function GET() {
  try {
    const posts = await getAllBlogPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch blog posts";
    return NextResponse.json(
      { error: "Failed to fetch blog posts", details: message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, tags, published } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "title and slug are required" },
        { status: 400 },
      );
    }

    const post = await createBlogPost({
      title: String(title),
      slug: String(slug),
      content: content ? String(content) : "",
      excerpt: excerpt ? String(excerpt) : "",
      tags: Array.isArray(tags) ? tags.map(String) : [],
      published: Boolean(published),
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create blog post";
    return NextResponse.json(
      { error: "Failed to create blog post", details: message },
      { status: 500 },
    );
  }
}
