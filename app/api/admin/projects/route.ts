import { NextResponse } from "next/server";
import { getProjectsData, setProjectsData } from "@/lib/projects";

export async function GET() {
  try {
    const data = await getProjectsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching projects:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch projects";
    return NextResponse.json(
      { error: "Failed to fetch projects", details: message },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const current = await getProjectsData();

    const data = await setProjectsData({
      heading:
        body.heading !== undefined ? String(body.heading) : current.heading,
      projects:
        body.projects !== undefined && Array.isArray(body.projects)
          ? body.projects.map((p: Record<string, unknown>) => ({
              title: String(p.title ?? ""),
              description: String(p.description ?? ""),
              tags: Array.isArray(p.tags) ? p.tags.map(String) : [],
              githubUrl: p.githubUrl ? String(p.githubUrl) : undefined,
              liveUrl: p.liveUrl ? String(p.liveUrl) : undefined,
              year: p.year ? String(p.year) : undefined,
            }))
          : current.projects,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating projects:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update projects";
    return NextResponse.json(
      { error: "Failed to update projects", details: message },
      { status: 500 },
    );
  }
}
