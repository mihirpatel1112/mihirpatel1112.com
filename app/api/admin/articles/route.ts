import { NextResponse } from "next/server";

import { getArticlesData, setArticlesData } from "@/lib/articles";

export async function GET() {
  try {
    const data = await getArticlesData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching articles:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch articles";
    return NextResponse.json(
      { error: "Failed to fetch articles", details: message },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { heading, articles } = body;

    const current = await getArticlesData();
    const data = await setArticlesData({
      heading: heading !== undefined ? String(heading) : current.heading,
      articles:
        articles !== undefined && Array.isArray(articles)
          ? articles
          : current.articles,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating articles:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update articles";
    return NextResponse.json(
      { error: "Failed to update articles", details: message },
      { status: 500 },
    );
  }
}
