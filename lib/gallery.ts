import pool from "./db";

export interface GalleryPhoto {
  id: number;
  url: string;
  caption: string;
  altText: string;
}

export interface GalleryData {
  heading: string;
  photos: GalleryPhoto[];
}

const DEFAULT_GALLERY: GalleryData = {
  heading: "Gallery",
  photos: [],
};

export async function getGalleryData(): Promise<GalleryData> {
  try {
    const [configRes, photosRes] = await Promise.all([
      pool.query("SELECT heading FROM gallery_config LIMIT 1"),
      pool.query(
        `SELECT g.id, g.url, g.image_data, COALESCE(g.alt_text, '') as "altText",
                CASE 
                  WHEN EXISTS(SELECT 1 FROM gallery_variants WHERE gallery_id = g.id) THEN true
                  WHEN g.image_data IS NOT NULL THEN true
                  ELSE false
                END as has_image
         FROM gallery g 
         ORDER BY g.sort_order ASC NULLS LAST, g.id ASC`,
      ),
    ]);

    const heading =
      (configRes.rows[0]?.heading as string) ?? DEFAULT_GALLERY.heading;
    const photos = photosRes.rows.map((r) => {
      const url = r.has_image
        ? `/api/gallery/image/${r.id}`
        : ((r.url as string) ?? "");
      return {
        id: r.id,
        url,
        caption: "",
        altText: r.altText ?? "",
      };
    });

    return { heading, photos };
  } catch {
    return DEFAULT_GALLERY;
  }
}

export async function setGalleryData(data: GalleryData): Promise<GalleryData> {
  const { heading, photos } = data;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const configResult = await client.query(
      "SELECT id FROM gallery_config LIMIT 1",
    );
    if (configResult.rows.length > 0) {
      await client.query(
        "UPDATE gallery_config SET heading = $1 WHERE id = $2",
        [heading ?? "", configResult.rows[0].id],
      );
    } else {
      await client.query("INSERT INTO gallery_config (heading) VALUES ($1)", [
        heading ?? "",
      ]);
    }

    const ids = photos.map((p) => p.id).filter((id) => id > 0);
    if (ids.length > 0) {
      for (const [index, p] of photos.entries()) {
        if (p.id > 0) {
          await client.query(
            "UPDATE gallery SET sort_order = $1, alt_text = $2 WHERE id = $3",
            [index, p.altText ?? "", p.id],
          );
        }
      }
      await client.query(
        "DELETE FROM gallery WHERE id NOT IN (SELECT unnest($1::int[]))",
        [ids],
      );
    } else {
      await client.query("DELETE FROM gallery");
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return getGalleryData();
}
