import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import pool from "@/lib/db";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use JPEG, PNG, WebP, or GIF." },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max 5MB." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await pool.query(
      `INSERT INTO gallery (image_data, content_type, alt_text, sort_order)
       VALUES ($1, $2, '', 9999)
       RETURNING id`,
      [buffer, file.type],
    );
    const id = result.rows[0].id;
    const url = `/api/gallery/image/${id}`;
    return NextResponse.json({ id, url });
  } catch (error) {
    console.error("Gallery upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
