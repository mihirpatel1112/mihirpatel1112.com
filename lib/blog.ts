import pool from "./db";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

function rowToPost(row: Record<string, unknown>): BlogPost {
  return {
    id: row.id as number,
    title: (row.title as string) ?? "",
    slug: (row.slug as string) ?? "",
    content: (row.content as string) ?? "",
    excerpt: (row.excerpt as string) ?? "",
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    published: (row.published as boolean) ?? false,
    createdAt: (row.created_at as Date)?.toISOString() ?? "",
    updatedAt: (row.updated_at as Date)?.toISOString() ?? "",
  };
}

function rowToSummary(row: Record<string, unknown>): BlogPostSummary {
  return {
    id: row.id as number,
    title: (row.title as string) ?? "",
    slug: (row.slug as string) ?? "",
    excerpt: (row.excerpt as string) ?? "",
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    published: (row.published as boolean) ?? false,
    createdAt: (row.created_at as Date)?.toISOString() ?? "",
    updatedAt: (row.updated_at as Date)?.toISOString() ?? "",
  };
}

export async function getAllBlogPosts(): Promise<BlogPostSummary[]> {
  const result = await pool.query(
    `SELECT id, title, slug, excerpt, tags, published, created_at, updated_at
     FROM blog_posts
     ORDER BY created_at DESC`,
  );
  return result.rows.map(rowToSummary);
}

export async function getPublishedBlogPosts(): Promise<BlogPostSummary[]> {
  const result = await pool.query(
    `SELECT id, title, slug, excerpt, tags, published, created_at, updated_at
     FROM blog_posts
     WHERE published = true
     ORDER BY created_at DESC`,
  );
  return result.rows.map(rowToSummary);
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const result = await pool.query(
    `SELECT id, title, slug, content, excerpt, tags, published, created_at, updated_at
     FROM blog_posts
     WHERE slug = $1`,
    [slug],
  );
  if (result.rows.length === 0) return null;
  return rowToPost(result.rows[0]);
}

export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const result = await pool.query(
    `SELECT id, title, slug, content, excerpt, tags, published, created_at, updated_at
     FROM blog_posts
     WHERE id = $1`,
    [id],
  );
  if (result.rows.length === 0) return null;
  return rowToPost(result.rows[0]);
}

export async function createBlogPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  published: boolean;
}): Promise<BlogPost> {
  const result = await pool.query(
    `INSERT INTO blog_posts (title, slug, content, excerpt, tags, published)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, title, slug, content, excerpt, tags, published, created_at, updated_at`,
    [
      data.title,
      data.slug,
      data.content,
      data.excerpt,
      data.tags,
      data.published,
    ],
  );
  return rowToPost(result.rows[0]);
}

export async function updateBlogPost(
  id: number,
  data: Partial<{
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    tags: string[];
    published: boolean;
  }>,
): Promise<BlogPost | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (data.title !== undefined) {
    fields.push(`title = $${idx++}`);
    values.push(data.title);
  }
  if (data.slug !== undefined) {
    fields.push(`slug = $${idx++}`);
    values.push(data.slug);
  }
  if (data.content !== undefined) {
    fields.push(`content = $${idx++}`);
    values.push(data.content);
  }
  if (data.excerpt !== undefined) {
    fields.push(`excerpt = $${idx++}`);
    values.push(data.excerpt);
  }
  if (data.tags !== undefined) {
    fields.push(`tags = $${idx++}`);
    values.push(data.tags);
  }
  if (data.published !== undefined) {
    fields.push(`published = $${idx++}`);
    values.push(data.published);
  }

  if (fields.length === 0) return getBlogPostById(id);

  values.push(id);
  const result = await pool.query(
    `UPDATE blog_posts SET ${fields.join(", ")}
     WHERE id = $${idx}
     RETURNING id, title, slug, content, excerpt, tags, published, created_at, updated_at`,
    values,
  );
  if (result.rows.length === 0) return null;
  return rowToPost(result.rows[0]);
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  const result = await pool.query(
    "DELETE FROM blog_posts WHERE id = $1 RETURNING id",
    [id],
  );
  return result.rowCount != null && result.rowCount > 0;
}
