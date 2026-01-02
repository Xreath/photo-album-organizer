# API Contracts: Photo Album Organizer

**Feature**: 001-photo-album-organizer  
**Date**: 2026-01-02  
**Phase**: 1 - Design

## Overview

This application uses Supabase as the backend, which provides:
- **Authentication**: Supabase Auth (email/password)
- **Database**: PostgreSQL with auto-generated REST and GraphQL APIs
- **Storage**: Supabase Storage with signed URLs

All data access goes through Supabase client SDK, which handles authentication tokens automatically.

## Authentication API

### Sign Up

```typescript
// Request
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword123'
});

// Response (success)
{
  user: {
    id: 'uuid',
    email: 'user@example.com',
    created_at: '2026-01-02T00:00:00Z'
  },
  session: {
    access_token: 'jwt-token',
    refresh_token: 'refresh-token',
    expires_in: 3600
  }
}

// Response (error)
{
  error: {
    message: 'User already registered',
    status: 400
  }
}
```

### Sign In

```typescript
// Request
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword123'
});

// Response (success)
{
  user: { ... },
  session: { ... }
}

// Response (error)
{
  error: {
    message: 'Invalid login credentials',
    status: 400
  }
}
```

### Sign Out

```typescript
// Request
const { error } = await supabase.auth.signOut();

// Response (success): error is null
// Response (error): error object with message
```

### Get Current User

```typescript
// Request
const { data: { user } } = await supabase.auth.getUser();

// Response
{
  user: {
    id: 'uuid',
    email: 'user@example.com',
    ...
  } | null
}
```

## Albums API

### List Albums

```typescript
// Request: Ordered by position (custom order) or created_at (default)
const { data, error } = await supabase
  .from('albums')
  .select('*')
  .order('position', { ascending: true });

// Response (success)
{
  data: [
    {
      id: 'album-uuid-1',
      user_id: 'user-uuid',
      name: 'Summer Vacation',
      position: 'a0',
      has_custom_order: true,
      created_at: '2026-01-02T00:00:00Z',
      updated_at: '2026-01-02T00:00:00Z'
    },
    ...
  ],
  error: null
}
```

### Get Album by ID

```typescript
// Request
const { data, error } = await supabase
  .from('albums')
  .select('*')
  .eq('id', albumId)
  .single();

// Response (success)
{
  data: {
    id: 'album-uuid',
    name: 'Summer Vacation',
    ...
  },
  error: null
}

// Response (not found or unauthorized)
{
  data: null,
  error: {
    message: 'Row not found',
    code: 'PGRST116'
  }
}
```

### Create Album

```typescript
// Request
const { data, error } = await supabase
  .from('albums')
  .insert({
    name: 'New Album',
    position: 'a0',  // First position or calculated
    user_id: userId  // From auth.uid()
  })
  .select()
  .single();

// Response (success)
{
  data: {
    id: 'new-album-uuid',
    name: 'New Album',
    position: 'a0',
    has_custom_order: false,
    created_at: '2026-01-02T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z'
  },
  error: null
}
```

### Update Album

```typescript
// Request (rename)
const { data, error } = await supabase
  .from('albums')
  .update({ name: 'Updated Name', updated_at: new Date().toISOString() })
  .eq('id', albumId)
  .select()
  .single();

// Request (reorder)
const { data, error } = await supabase
  .from('albums')
  .update({ position: 'a0V', updated_at: new Date().toISOString() })
  .eq('id', albumId)
  .select()
  .single();
```

### Delete Album

```typescript
// Request
const { error } = await supabase
  .from('albums')
  .delete()
  .eq('id', albumId);

// Response (success): error is null
// Note: Photos are cascade deleted, but storage files need cleanup
```

### Bulk Update Album Order

```typescript
// Request (update has_custom_order flag for all user's albums)
const { error } = await supabase
  .from('albums')
  .update({ has_custom_order: true })
  .eq('user_id', userId);

// Request (batch position updates via RPC)
const { error } = await supabase.rpc('update_album_positions', {
  updates: [
    { id: 'album-1', position: 'a0' },
    { id: 'album-2', position: 'a1' },
    { id: 'album-3', position: 'a2' }
  ]
});
```

## Photos API

### List Photos in Album

```typescript
// Request
const { data, error } = await supabase
  .from('photos')
  .select('*')
  .eq('album_id', albumId)
  .order('position', { ascending: true });

// Response (success)
{
  data: [
    {
      id: 'photo-uuid-1',
      album_id: 'album-uuid',
      storage_path: 'photos/user-uuid/album-uuid/photo-uuid-1.jpg',
      filename: 'beach.jpg',
      position: 'a0',
      file_size: 2048576,
      width: 1920,
      height: 1080,
      created_at: '2026-01-02T00:00:00Z',
      updated_at: '2026-01-02T00:00:00Z'
    },
    ...
  ],
  error: null
}
```

### Get Photo by ID

```typescript
// Request
const { data, error } = await supabase
  .from('photos')
  .select('*')
  .eq('id', photoId)
  .single();
```

### Upload Photo

```typescript
// Step 1: Upload file to storage
const filePath = `${userId}/${albumId}/${photoId}.${ext}`;
const { error: uploadError } = await supabase.storage
  .from('photos')
  .upload(filePath, file, {
    contentType: file.type,
    upsert: false
  });

// Step 2: Create photo record
const { data, error } = await supabase
  .from('photos')
  .insert({
    album_id: albumId,
    storage_path: `photos/${filePath}`,
    filename: file.name,
    position: nextPosition,
    file_size: file.size,
    width: imageWidth,   // From client-side extraction
    height: imageHeight  // From client-side extraction
  })
  .select()
  .single();
```

### Update Photo Position

```typescript
// Request
const { data, error } = await supabase
  .from('photos')
  .update({ position: newPosition, updated_at: new Date().toISOString() })
  .eq('id', photoId)
  .select()
  .single();
```

### Delete Photo

```typescript
// Step 1: Get photo to find storage path
const { data: photo } = await supabase
  .from('photos')
  .select('storage_path')
  .eq('id', photoId)
  .single();

// Step 2: Delete from database (RLS enforces ownership)
const { error: dbError } = await supabase
  .from('photos')
  .delete()
  .eq('id', photoId);

// Step 3: Delete from storage
const { error: storageError } = await supabase.storage
  .from('photos')
  .remove([photo.storage_path.replace('photos/', '')]);
```

## Storage API

### Get Public URL (for display)

```typescript
// Original image
const { data } = supabase.storage
  .from('photos')
  .getPublicUrl(storagePath);
// Returns: https://project.supabase.co/storage/v1/object/public/photos/...

// Thumbnail (300x300)
const thumbnailUrl = `${data.publicUrl}?width=300&height=300&resize=cover`;
```

### Upload with Progress

```typescript
// Using XMLHttpRequest for progress tracking
const xhr = new XMLHttpRequest();
xhr.upload.addEventListener('progress', (e) => {
  const percent = (e.loaded / e.total) * 100;
  onProgress(percent);
});

// Or use fetch with ReadableStream (modern browsers)
```

## Error Handling

### Standard Error Response Shape

```typescript
interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}
```

### Common Error Codes

| Code | Meaning | User Message |
|------|---------|--------------|
| `PGRST116` | Row not found | "Album not found" |
| `23505` | Unique violation | "An album with this name already exists" (if unique) |
| `42501` | RLS policy violation | "You don't have permission to access this" |
| `23503` | Foreign key violation | "Cannot delete album with photos" |
| `413` | Payload too large | "File size exceeds the 20MB limit" |

## Rate Limits

Supabase default limits (adjustable in project settings):
- Database: 500 requests/second
- Storage uploads: 100 files/minute
- Auth: 30 requests/minute per IP

For this personal app, defaults are sufficient.
