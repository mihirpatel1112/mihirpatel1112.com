import { NextResponse } from "next/server";

import { getGalleryData, setGalleryData } from "@/lib/gallery";

export async function GET() {
  try {
    const data = await getGalleryData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch gallery";
    return NextResponse.json(
      { error: "Failed to fetch gallery", details: message },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const current = await getGalleryData();

    const data = await setGalleryData({
      heading:
        body.heading !== undefined ? String(body.heading) : current.heading,
      photos:
        body.photos !== undefined && Array.isArray(body.photos)
          ? body.photos.map((p: Record<string, unknown>) => ({
              id: Number(p.id) || 0,
              url: "",
              caption: "",
              altText: String(p.altText ?? ""),
            }))
          : current.photos,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating gallery:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update gallery";
    return NextResponse.json(
      { error: "Failed to update gallery", details: message },
      { status: 500 },
    );
  }
}
