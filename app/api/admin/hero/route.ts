import { NextResponse } from "next/server";
import { getHeroContent, updateHeroContent } from "@/lib/hero";

export async function GET() {
  try {
    const content = await getHeroContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error("Error fetching hero:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { greeting, name, bio } = body;

    const content = await updateHeroContent({
      ...(greeting !== undefined && { greeting: String(greeting) }),
      ...(name !== undefined && { name: String(name) }),
      ...(bio !== undefined && { bio: String(bio) }),
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error updating hero:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update hero";
    return NextResponse.json(
      {
        error: "Failed to update hero",
        details: message,
      },
      { status: 500 },
    );
  }
}
