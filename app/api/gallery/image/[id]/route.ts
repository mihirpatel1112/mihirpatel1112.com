import { NextResponse } from "next/server";

import pool from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = parseInt((await params).id, 10);
  if (Number.isNaN(id)) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const result = await pool.query(
      "SELECT image_data, content_type FROM gallery WHERE id = $1 AND image_data IS NOT NULL",
      [id],
    );
    const row = result.rows[0];
    if (!row?.image_data) {
      return new NextResponse(null, { status: 404 });
    }

    const contentType = row.content_type || "image/jpeg";
    return new NextResponse(row.image_data as Buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
