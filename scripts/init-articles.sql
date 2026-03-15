-- Articles section config (single row for heading)
CREATE TABLE IF NOT EXISTS articles_config (
  id SERIAL PRIMARY KEY,
  heading TEXT
);

-- Individual articles
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  date_read TEXT
);
