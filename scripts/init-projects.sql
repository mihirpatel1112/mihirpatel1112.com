-- Projects section config
CREATE TABLE IF NOT EXISTS projects_config (
  id SERIAL PRIMARY KEY,
  heading TEXT
);

-- Individual projects
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  year TEXT,
  sort_order INT DEFAULT 0
);
