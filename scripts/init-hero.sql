-- Hero content table (single row)
CREATE TABLE IF NOT EXISTS hero (
  id SERIAL PRIMARY KEY,
  greeting TEXT NOT NULL DEFAULT 'Hello, I''m',
  name TEXT NOT NULL DEFAULT 'Mihir Patel',
  bio TEXT NOT NULL DEFAULT 'I craft elegant solutions to complex problems, specializing in building beautiful and functional digital experiences.'
);

-- Seed initial row if table is empty
INSERT INTO hero (greeting, name, bio)
SELECT 'Hello, I''m', 'Mihir Patel', 'I craft elegant solutions to complex problems, specializing in building beautiful and functional digital experiences.'
WHERE NOT EXISTS (SELECT 1 FROM hero LIMIT 1);
