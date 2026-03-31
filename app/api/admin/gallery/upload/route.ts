import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { processImage } from "@/lib/image-processor";
import pool from "@/lib/db";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
];

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
        {
          error:
            "Invalid file type. Use JPEG, PNG, WebP, GIF, or HEIC (iPhone).",
        },
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

    // Process image into variants (auto-converts HEIC to WebP)
    const { variants, originalWidth, originalHeight } = await processImage(
      buffer,
      file.type,
      "webp",
    );

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert main gallery entry
      const galleryResult = await client.query(
        `INSERT INTO gallery (content_type, alt_text, sort_order, width, height)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        ["image/webp", "", 9999, originalWidth, originalHeight],
      );
      const galleryId = galleryResult.rows[0].id;

      // Insert all variants
      for (const variant of variants) {
        await client.query(
          `INSERT INTO gallery_variants (gallery_id, variant_type, image_data, width, height, content_type, file_size)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            galleryId,
            variant.type,
            variant.data,
            variant.width,
            variant.height,
            "image/webp",
            variant.size,
          ],
        );
      }

      await client.query("COMMIT");

      const url = `/api/gallery/image/${galleryId}`;
      return NextResponse.json({ id: galleryId, url });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Gallery upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
