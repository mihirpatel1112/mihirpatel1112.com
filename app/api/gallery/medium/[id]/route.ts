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
    let row;

    // Try to get medium variant
    const variantResult = await pool.query(
      "SELECT image_data, content_type FROM gallery_variants WHERE gallery_id = $1 AND variant_type = $2",
      [id, "medium"],
    );

    row = variantResult.rows[0];

    // If no medium, try full variant
    if (!row?.image_data) {
      const fullResult = await pool.query(
        "SELECT image_data, content_type FROM gallery_variants WHERE gallery_id = $1 AND variant_type = $2",
        [id, "full"],
      );
      row = fullResult.rows[0];
    }

    // If no variant, try old image_data column (backward compatibility)
    if (!row?.image_data) {
      const fallbackResult = await pool.query(
        "SELECT image_data, content_type FROM gallery WHERE id = $1 AND image_data IS NOT NULL",
        [id],
      );
      row = fallbackResult.rows[0];
    }

    if (!row?.image_data) {
      return new NextResponse(null, { status: 404 });
    }

    const contentType = row.content_type || "image/webp";
    return new NextResponse(new Blob([row.image_data]), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
