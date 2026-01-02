-- Photo Album Organizer: Initial Schema
-- This migration creates the albums and photos tables with RLS policies

-- ============================================
-- ALBUMS TABLE
-- ============================================

CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) <= 255),
  position TEXT NOT NULL,
  has_custom_order BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for albums
CREATE INDEX albums_user_id_idx ON albums(user_id);
CREATE INDEX albums_user_id_position_idx ON albums(user_id, position);
CREATE INDEX albums_user_id_created_at_idx ON albums(user_id, created_at DESC);

-- Enable RLS for albums
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;

-- Albums RLS Policies
CREATE POLICY "albums_select_own" ON albums
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "albums_insert_own" ON albums
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "albums_update_own" ON albums
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "albums_delete_own" ON albums
  FOR DELETE
  USING (auth.uid() = user_id);

-- Updated at trigger for albums
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER albums_updated_at
  BEFORE UPDATE ON albums
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PHOTOS TABLE
-- ============================================

CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  position TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for photos
CREATE INDEX photos_album_id_idx ON photos(album_id);
CREATE INDEX photos_album_id_position_idx ON photos(album_id, position);

-- Enable RLS for photos
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Photos RLS Policies (access through album ownership)
CREATE POLICY "photos_select_own" ON photos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = photos.album_id
      AND albums.user_id = auth.uid()
    )
  );

CREATE POLICY "photos_insert_own" ON photos
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = photos.album_id
      AND albums.user_id = auth.uid()
    )
  );

CREATE POLICY "photos_update_own" ON photos
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = photos.album_id
      AND albums.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = photos.album_id
      AND albums.user_id = auth.uid()
    )
  );

CREATE POLICY "photos_delete_own" ON photos
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = photos.album_id
      AND albums.user_id = auth.uid()
    )
  );

-- Updated at trigger for photos
CREATE TRIGGER photos_updated_at
  BEFORE UPDATE ON photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
