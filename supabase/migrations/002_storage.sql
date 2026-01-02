-- Photo Album Organizer: Storage Configuration
-- This migration creates the photos storage bucket and RLS policies

-- ============================================
-- STORAGE BUCKET
-- ============================================

-- Create the photos bucket (public for CDN access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'photos',
  'photos',
  true,
  20971520,  -- 20MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- ============================================
-- STORAGE RLS POLICIES
-- ============================================

-- Policy: Users can only upload to their own folder
CREATE POLICY "photos_storage_insert" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Anyone can read photos (public bucket for thumbnails/CDN)
CREATE POLICY "photos_storage_select" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'photos');

-- Policy: Users can only update their own files
CREATE POLICY "photos_storage_update" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can only delete their own files
CREATE POLICY "photos_storage_delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
