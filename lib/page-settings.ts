import pool from "./db";

export interface PageSetting {
  slug: string;
  enabled: boolean;
}

export async function getAllPageSettings(): Promise<PageSetting[]> {
  const res = await pool
    .query("SELECT slug, enabled FROM page_settings ORDER BY slug")
    .catch(() => ({ rows: [] as Array<{ slug: string; enabled: boolean }> }));
  return res.rows.map((r) => ({ slug: r.slug, enabled: r.enabled ?? true }));
}

export async function isPageEnabled(slug: string): Promise<boolean> {
  const res = await pool
    .query("SELECT enabled FROM page_settings WHERE slug = $1", [slug])
    .catch(() => ({ rows: [] as Array<{ enabled: boolean }> }));
  if (res.rows.length === 0) return true;
  return res.rows[0].enabled ?? true;
}

export async function setPageEnabled(
  slug: string,
  enabled: boolean,
): Promise<void> {
  await pool.query(
    `INSERT INTO page_settings (slug, enabled) VALUES ($1, $2)
     ON CONFLICT (slug) DO UPDATE SET enabled = EXCLUDED.enabled`,
    [slug, enabled],
  );
}
