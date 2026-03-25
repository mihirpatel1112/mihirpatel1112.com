import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

async function findPages(
  dir: string,
  basePath: string,
  pages: { path: string; title: string }[],
): Promise<void> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === "admin") continue; // Skip admin pages
        const newBase = basePath
          ? `${basePath}/${entry.name}`
          : `/${entry.name}`;
        await findPages(fullPath, newBase, pages);
      } else if (
        entry.name === "page.tsx" ||
        entry.name === "page.js" ||
        entry.name === "page.ts"
      ) {
        const routePath = basePath || "/";
        // Next.js <Link> cannot use literal dynamic segments like /blog/[slug]
        if (/\[/.test(routePath)) {
          continue;
        }
        const title =
          routePath === "/"
            ? "Home"
            : (routePath
                .split("/")
                .filter(Boolean)
                .pop()
                ?.replace(/-/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase()) ?? routePath);
        pages.push({ path: routePath, title });
      }
    }
  } catch (err) {
    console.error("Error reading directory:", err);
  }
}

export async function GET() {
  try {
    const appDir = path.join(process.cwd(), "app");
    const pages: { path: string; title: string }[] = [];
    await findPages(appDir, "", pages);

    pages.sort((a, b) => {
      if (a.path === "/") return -1;
      if (b.path === "/") return 1;
      return a.path.localeCompare(b.path);
    });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 },
    );
  }
}
