import pool from "./db";

export interface AboutBook {
  title: string;
  author: string;
}

export interface AboutSocialLink {
  label: string;
  url: string;
}

export interface AboutCertification {
  name: string;
  issuer: string;
  issuedDate: string;
  credentialId: string;
  url: string;
}

export interface AboutData {
  intro: string;
  hobbies: string[];
  books: AboutBook[];
  socialLinks: AboutSocialLink[];
  certifications: AboutCertification[];
}

export async function getAboutData(): Promise<AboutData> {
  const [configRes, hobbiesRes, booksRes, socialLinksRes, certificationsRes] =
    await Promise.all([
      pool.query("SELECT intro FROM about_config LIMIT 1"),
      pool.query("SELECT name FROM about_hobbies ORDER BY id"),
      pool.query("SELECT title, author FROM about_books ORDER BY id"),
      pool.query(
        "SELECT label, url FROM about_social_links ORDER BY sort_order ASC NULLS LAST, id ASC",
      ),
      pool
        .query(
          "SELECT name, issuer, issued_date, credential_id, url FROM about_certifications ORDER BY sort_order ASC NULLS LAST, id ASC",
        )
        .catch(() => ({ rows: [] })),
    ]);

  const intro = (configRes.rows[0]?.intro as string) ?? "";
  const hobbies = hobbiesRes.rows.map((r) => r.name ?? "");
  const books = booksRes.rows.map((r) => ({
    title: r.title ?? "",
    author: r.author ?? "",
  }));
  const socialLinks = socialLinksRes.rows.map((r) => ({
    label: r.label ?? "",
    url: r.url ?? "",
  }));
  const certifications = certificationsRes.rows.map((r) => ({
    name: r.name ?? "",
    issuer: r.issuer ?? "",
    issuedDate: r.issued_date ?? "",
    credentialId: r.credential_id ?? "",
    url: r.url ?? "",
  }));

  return { intro, hobbies, books, socialLinks, certifications };
}

export async function setAboutData(data: AboutData): Promise<AboutData> {
  const { intro, hobbies, books, socialLinks, certifications } = data;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const configResult = await client.query(
      "SELECT id FROM about_config LIMIT 1",
    );
    if (configResult.rows.length > 0) {
      await client.query("UPDATE about_config SET intro = $1 WHERE id = $2", [
        intro ?? "",
        configResult.rows[0].id,
      ]);
    } else {
      await client.query("INSERT INTO about_config (intro) VALUES ($1)", [
        intro ?? "",
      ]);
    }

    await client.query("DELETE FROM about_hobbies");
    for (const h of hobbies) {
      if (h.trim()) {
        await client.query("INSERT INTO about_hobbies (name) VALUES ($1)", [
          h.trim(),
        ]);
      }
    }

    await client.query("DELETE FROM about_books");
    for (const b of books) {
      if (b.title.trim() || b.author.trim()) {
        await client.query(
          "INSERT INTO about_books (title, author) VALUES ($1, $2)",
          [b.title, b.author],
        );
      }
    }

    await client.query("DELETE FROM about_social_links");
    for (const [index, link] of socialLinks.entries()) {
      const label = link.label.trim();
      const url = link.url.trim();

      if (label || url) {
        await client.query(
          "INSERT INTO about_social_links (label, url, sort_order) VALUES ($1, $2, $3)",
          [label, url, index],
        );
      }
    }

    await client.query("DELETE FROM about_certifications");
    for (const [index, cert] of certifications.entries()) {
      const name = cert.name.trim();
      const issuer = cert.issuer.trim();
      if (name || issuer) {
        await client.query(
          "INSERT INTO about_certifications (name, issuer, issued_date, credential_id, url, sort_order) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            name,
            issuer,
            cert.issuedDate.trim(),
            cert.credentialId.trim(),
            cert.url.trim(),
            index,
          ],
        );
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return getAboutData();
}
