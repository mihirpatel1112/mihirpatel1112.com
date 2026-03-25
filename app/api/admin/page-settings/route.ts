import { NextResponse } from "next/server";

import { getAllPageSettings, setPageEnabled } from "@/lib/page-settings";

export async function GET() {
  try {
    const settings = await getAllPageSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch page settings";
    return NextResponse.json(
      { error: "Failed to fetch page settings", details: message },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const slug = String(body.slug ?? "").trim();
    const enabled = Boolean(body.enabled);

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    await setPageEnabled(slug, enabled);
    const settings = await getAllPageSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update page setting";
    return NextResponse.json(
      { error: "Failed to update page setting", details: message },
      { status: 500 },
    );
  }
}
