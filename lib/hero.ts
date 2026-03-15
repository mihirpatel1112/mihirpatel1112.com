import pool from "./db";

export interface HeroContent {
  greeting: string;
  name: string;
  bio: string;
}

const DEFAULT_HERO: HeroContent = {
  greeting: "Hello, I'm",
  name: "Mihir Patel",
  bio: "I craft elegant solutions to complex problems, specializing in building beautiful and functional digital experiences.",
};

export async function getHeroContent(): Promise<HeroContent> {
  try {
    const result = await pool.query(
      "SELECT greeting, name, bio FROM hero LIMIT 1",
    );
    const row = result.rows[0];
    if (!row) return DEFAULT_HERO;
    return {
      greeting: row.greeting ?? DEFAULT_HERO.greeting,
      name: row.name ?? DEFAULT_HERO.name,
      bio: row.bio ?? DEFAULT_HERO.bio,
    };
  } catch {
    return DEFAULT_HERO;
  }
}

export async function updateHeroContent(
  updates: Partial<HeroContent>,
): Promise<HeroContent> {
  const current = await getHeroContent();
  const merged: HeroContent = {
    greeting: updates.greeting ?? current.greeting,
    name: updates.name ?? current.name,
    bio: updates.bio ?? current.bio,
  };

  const result = await pool.query(
    `UPDATE hero SET greeting = $1, name = $2, bio = $3
     WHERE id = (SELECT id FROM hero LIMIT 1)
     RETURNING greeting, name, bio`,
    [merged.greeting, merged.name, merged.bio],
  );

  if (result.rowCount === 0) {
    await pool.query(
      "INSERT INTO hero (greeting, name, bio) VALUES ($1, $2, $3)",
      [merged.greeting, merged.name, merged.bio],
    );
  }

  return merged;
}
