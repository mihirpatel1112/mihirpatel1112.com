-- About page config (intro paragraph)
CREATE TABLE IF NOT EXISTS about_config (
  id SERIAL PRIMARY KEY,
  intro TEXT
);

-- Hobbies
CREATE TABLE IF NOT EXISTS about_hobbies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

-- Books
CREATE TABLE IF NOT EXISTS about_books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL
);

-- Social links
CREATE TABLE IF NOT EXISTS about_social_links (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);
