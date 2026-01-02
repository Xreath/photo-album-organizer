# Data Model: Photo Album Organizer

**Feature**: 001-photo-album-organizer  
**Date**: 2026-01-02  
**Phase**: 1 - Design

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      User       │       │      Album      │       │      Photo      │
│  (auth.users)   │       │                 │       │                 │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (UUID) PK    │──┐    │ id (UUID) PK    │──┐    │ id (UUID) PK    │
│ email           │  │    │ user_id (FK)    │  │    │ album_id (FK)   │
│ created_at      │  └───>│ name            │  └───>│ storage_path    │
│ ...             │       │ position        │       │ filename        │
└─────────────────┘       │ created_at      │       │ position        │
                          │ updated_at      │       │ file_size       │
                          │ has_custom_order│       │ created_at      │
                          └─────────────────┘       │ updated_at      │
                                                    └─────────────────┘
```

**Relationships**:
- User (1) → Album (many): One user owns many albums
- Album (1) → Photo (many): One album contains many photos
- No Album → Album relationship (flat structure enforced)

## Database Schema

### Table: `albums`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT gen_random_uuid() | Unique album identifier |
| `user_id` | `uuid` | FK → auth.users(id), NOT NULL | Owner of the album |
| `name` | `text` | NOT NULL, max 255 chars | Album display name |
| `position` | `text` | NOT NULL | Fractional index for ordering |
| `has_custom_order` | `boolean` | NOT NULL, DEFAULT false | True after first manual reorder |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT now() | Album creation timestamp |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT now() | Last modification timestamp |

**Indexes**:
- `albums_user_id_idx` on `user_id` (FK queries)
- `albums_user_id_position_idx` on `(user_id, position)` (sorted listing)
- `albums_user_id_created_at_idx` on `(user_id, created_at DESC)` (date grouping)

### Table: `photos`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT gen_random_uuid() | Unique photo identifier |
| `album_id` | `uuid` | FK → albums(id) ON DELETE CASCADE, NOT NULL | Parent album |
| `storage_path` | `text` | NOT NULL | Path in Supabase Storage |
| `filename` | `text` | NOT NULL | Original filename |
| `position` | `text` | NOT NULL | Fractional index for ordering |
| `file_size` | `integer` | NOT NULL | File size in bytes |
| `width` | `integer` | NULL | Image width in pixels |
| `height` | `integer` | NULL | Image height in pixels |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT now() | Upload timestamp |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT now() | Last modification timestamp |

**Indexes**:
- `photos_album_id_idx` on `album_id` (FK queries)
- `photos_album_id_position_idx` on `(album_id, position)` (sorted listing)

### Cascade Delete Rules

- When an album is deleted → all photos in that album are deleted (CASCADE)
- When a user is deleted → all albums owned by that user are deleted (CASCADE via trigger)
- Photo storage files are cleaned up via database trigger or application logic

## Row-Level Security (RLS) Policies

### Table: `albums`

```sql
-- Enable RLS
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own albums
CREATE POLICY "albums_select_own" ON albums
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert albums for themselves
CREATE POLICY "albums_insert_own" ON albums
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own albums
CREATE POLICY "albums_update_own" ON albums
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own albums
CREATE POLICY "albums_delete_own" ON albums
  FOR DELETE
  USING (auth.uid() = user_id);
```

### Table: `photos`

```sql
-- Enable RLS
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see photos in their own albums
CREATE POLICY "photos_select_own" ON photos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = photos.album_id
      AND albums.user_id = auth.uid()
    )
  );

-- Policy: Users can only insert photos into their own albums
CREATE POLICY "photos_insert_own" ON photos
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = photos.album_id
      AND albums.user_id = auth.uid()
    )
  );

-- Policy: Users can only update photos in their own albums
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

-- Policy: Users can only delete photos in their own albums
CREATE POLICY "photos_delete_own" ON photos
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM albums
      WHERE albums.id = photos.album_id
      AND albums.user_id = auth.uid()
    )
  );
```

## Supabase Storage

### Bucket: `photos`

**Configuration**:
- Public: Yes (for image serving via CDN)
- File size limit: 20MB
- Allowed MIME types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`

**Path Structure**:
```
photos/
└── {user_id}/
    └── {album_id}/
        └── {photo_id}.{ext}
```

**Example**:
```
photos/a1b2c3d4-user-uuid/e5f6g7h8-album-uuid/i9j0k1l2-photo-uuid.jpg
```

### Storage RLS Policies

```sql
-- Policy: Users can only upload to their own folder
CREATE POLICY "photos_storage_insert" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can read any photo in public bucket (thumbnails via CDN)
-- Note: Actual data access is protected by photos table RLS
CREATE POLICY "photos_storage_select" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'photos');

-- Policy: Users can only delete their own files
CREATE POLICY "photos_storage_delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

## Validation Rules

### Album

| Field | Rule | Error Message |
|-------|------|---------------|
| `name` | Required, non-empty | "Album name is required" |
| `name` | Max 255 characters | "Album name must be 255 characters or less" |
| `name` | Trim whitespace | (Silent normalization) |

### Photo

| Field | Rule | Error Message |
|-------|------|---------------|
| `file` | Required | "Please select a file to upload" |
| `file` | Max 20MB | "File size must be 20MB or less" |
| `file` | Valid image type (JPEG, PNG, GIF, WebP) | "Only JPEG, PNG, GIF, and WebP images are allowed" |

## State Transitions

### Album Ordering State

```
┌───────────────────┐     First manual      ┌───────────────────┐
│  has_custom_order │      reorder          │  has_custom_order │
│      = false      │ ───────────────────>  │      = true       │
│  (sorted by date) │                       │ (sorted by pos)   │
└───────────────────┘                       └───────────────────┘
```

- **Initial state**: `has_custom_order = false`, albums displayed grouped by `created_at`
- **After first drag**: `has_custom_order = true` for all user's albums, displayed by `position`
- **Irreversible**: Once custom order is enabled, date grouping is not restored

## TypeScript Types

```typescript
// Generated from Supabase schema

export interface Album {
  id: string;
  user_id: string;
  name: string;
  position: string;
  has_custom_order: boolean;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  album_id: string;
  storage_path: string;
  filename: string;
  position: string;
  file_size: number;
  width: number | null;
  height: number | null;
  created_at: string;
  updated_at: string;
}

export interface AlbumWithPhotos extends Album {
  photos: Photo[];
}

// Input types for mutations
export interface CreateAlbumInput {
  name: string;
}

export interface UpdateAlbumInput {
  name?: string;
  position?: string;
}

export interface CreatePhotoInput {
  album_id: string;
  file: File;
}

export interface UpdatePhotoInput {
  position?: string;
}
```
