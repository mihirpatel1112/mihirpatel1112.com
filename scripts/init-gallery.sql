-- Gallery config (optional heading)
CREATE TABLE IF NOT EXISTS gallery_config (
  id SERIAL PRIMARY KEY,
  heading TEXT
);

-- Individual gallery photos (images stored in DB)
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  url TEXT,
  image_data BYTEA,
  content_type TEXT,
  alt_text TEXT DEFAULT '',
  sort_order INT DEFAULT 0
);

