-- Blog section config
CREATE TABLE IF NOT EXISTS blog_config (
  id SERIAL PRIMARY KEY,
  heading TEXT
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  slug TEXT NOT NULL UNIQUE,
  published_at TEXT
);
