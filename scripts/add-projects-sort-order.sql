-- Add sort_order for existing projects tables
ALTER TABLE projects ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
UPDATE projects SET sort_order = id WHERE sort_order = 0;
