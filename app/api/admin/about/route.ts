import { NextResponse } from "next/server";

import { getAboutData, setAboutData } from "@/lib/about";

export async function GET() {
  try {
    const data = await getAboutData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching about:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch about";
    return NextResponse.json(
      { error: "Failed to fetch about", details: message },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const current = await getAboutData();

    const data = await setAboutData({
      intro: body.intro !== undefined ? String(body.intro) : current.intro,
      hobbies:
        body.hobbies !== undefined && Array.isArray(body.hobbies)
          ? body.hobbies.map(String)
          : current.hobbies,
      books:
        body.books !== undefined && Array.isArray(body.books)
          ? body.books.map((b: { title?: string; author?: string }) => ({
              title: String(b.title ?? ""),
              author: String(b.author ?? ""),
            }))
          : current.books,
      socialLinks:
        body.socialLinks !== undefined && Array.isArray(body.socialLinks)
          ? body.socialLinks.map((link: { label?: string; url?: string }) => ({
              label: String(link.label ?? ""),
              url: String(link.url ?? ""),
            }))
          : current.socialLinks,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating about:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update about";
    return NextResponse.json(
      { error: "Failed to update about", details: message },
      { status: 500 },
    );
  }
}
