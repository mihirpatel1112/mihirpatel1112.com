CREATE TABLE IF NOT EXISTS about_social_links (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);
