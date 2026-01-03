-- Migration: Add album cover support
-- Run this in Supabase SQL Editor

-- Add cover_photo_id column to albums table
ALTER TABLE albums 
ADD COLUMN cover_photo_id UUID REFERENCES photos(id) ON DELETE SET NULL;

-- Add index for better performance
CREATE INDEX idx_albums_cover_photo ON albums(cover_photo_id);

-- Add comment
COMMENT ON COLUMN albums.cover_photo_id IS 'Optional cover photo for the album';
