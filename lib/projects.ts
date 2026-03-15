import pool from "./db";

export interface Project {
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  year?: string;
}

export interface ProjectsData {
  heading: string;
  projects: Project[];
}

export async function getProjectsData(): Promise<ProjectsData> {
  const [configRes, projectsRes] = await Promise.all([
    pool.query("SELECT heading FROM projects_config LIMIT 1"),
    pool.query(
      'SELECT title, description, tags, github_url as "githubUrl", live_url as "liveUrl", year FROM projects ORDER BY sort_order ASC NULLS LAST, id ASC',
    ),
  ]);

  const heading = (configRes.rows[0]?.heading as string) ?? "";
  const projects = projectsRes.rows.map((r) => ({
    title: r.title ?? "",
    description: r.description ?? "",
    tags: Array.isArray(r.tags) ? r.tags : [],
    githubUrl: r.githubUrl ?? undefined,
    liveUrl: r.liveUrl ?? undefined,
    year: r.year ?? undefined,
  }));

  return { heading, projects };
}

export async function setProjectsData(
  data: ProjectsData,
): Promise<ProjectsData> {
  const { heading, projects } = data;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const configResult = await client.query(
      "SELECT id FROM projects_config LIMIT 1",
    );

    if (configResult.rows.length > 0) {
      await client.query(
        "UPDATE projects_config SET heading = $1 WHERE id = $2",
        [heading ?? "", configResult.rows[0].id],
      );
    } else {
      await client.query("INSERT INTO projects_config (heading) VALUES ($1)", [
        heading ?? "",
      ]);
    }

    await client.query("DELETE FROM projects");

    for (const [index, p] of projects.entries()) {
      await client.query(
        `INSERT INTO projects (title, description, tags, github_url, live_url, year, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          p.title,
          p.description ?? "",
          p.tags ?? [],
          p.githubUrl ?? null,
          p.liveUrl ?? null,
          p.year ?? null,
          index,
        ],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return getProjectsData();
}
