-- Add image_data and content_type for DB-stored images
-- Run: psql $DATABASE_URL -f scripts/migrate-gallery-to-db-storage.sql

ALTER TABLE gallery ADD COLUMN IF NOT EXISTS image_data BYTEA;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS content_type TEXT;
ALTER TABLE gallery ALTER COLUMN url DROP NOT NULL;
