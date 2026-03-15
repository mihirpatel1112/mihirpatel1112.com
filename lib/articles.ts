import pool from "./db";

export interface Article {
  title: string;
  description: string;
  url: string;
  tags: string[];
  dateRead: string;
}

export interface ArticlesData {
  heading: string;
  articles: Article[];
}

export async function getArticlesHeading(): Promise<string> {
  const result = await pool.query(
    "SELECT heading FROM articles_config LIMIT 1",
  );
  const row = result.rows[0];
  return row?.heading ?? "";
}

export async function getArticles(): Promise<Article[]> {
  const result = await pool.query(
    'SELECT title, description, url, tags, date_read as "dateRead" FROM articles ORDER BY date_read DESC NULLS LAST',
  );
  return result.rows.map((row) => ({
    title: row.title ?? "",
    description: row.description ?? "",
    url: row.url ?? "",
    tags: Array.isArray(row.tags) ? row.tags : [],
    dateRead: row.dateRead ?? "",
  }));
}

export async function getArticlesData(): Promise<ArticlesData> {
  const [heading, articles] = await Promise.all([
    getArticlesHeading(),
    getArticles(),
  ]);
  return { heading, articles };
}

export async function setArticlesData(
  data: ArticlesData,
): Promise<ArticlesData> {
  const { heading, articles } = data;

  // Update or insert config
  const configResult = await pool.query(
    "SELECT id FROM articles_config LIMIT 1",
  );
  if (configResult.rows.length > 0) {
    await pool.query("UPDATE articles_config SET heading = $1 WHERE id = $2", [
      heading ?? "",
      configResult.rows[0].id,
    ]);
  } else {
    await pool.query("INSERT INTO articles_config (heading) VALUES ($1)", [
      heading ?? "",
    ]);
  }

  // Replace all articles
  await pool.query("DELETE FROM articles");
  for (const a of articles) {
    await pool.query(
      `INSERT INTO articles (title, description, url, tags, date_read)
       VALUES ($1, $2, $3, $4, $5)`,
      [a.title, a.description ?? "", a.url, a.tags ?? [], a.dateRead ?? ""],
    );
  }

  return getArticlesData();
}
