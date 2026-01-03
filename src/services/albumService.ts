// Album service - CRUD operations for albums

import { supabase } from '../lib/supabase'
import type { Album, CreateAlbumInput, UpdateAlbumInput } from '../types/database'
import { generatePosition } from './orderingService'
import { normalizeAlbumName } from '../lib/validation'

/**
 * Fetches all albums for the current user
 * Returns albums sorted by position (if custom order) or created_at (if default)
 */
// Extended Album type with cover photo URL
export interface AlbumWithCover extends Album {
  coverPhotoUrl: string | null
}

/**
 * Fetches all albums for the current user with cover photo URLs
 */
export async function getAlbumsWithCovers(): Promise<AlbumWithCover[]> {
  const { data: albums, error } = await supabase
    .from('albums')
    .select('*')
    .order('position', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch albums: ${error.message}`)
  }

  if (!albums) return []

  // Fetch cover photos for albums that have them
  const albumsWithPhotos = await Promise.all(
    albums.map(async (album) => {
      if (!album.cover_photo_id) {
        return { ...album, coverPhotoUrl: null }
      }

      const { data: photo } = await supabase
        .from('photos')
        .select('storage_path')
        .eq('id', album.cover_photo_id)
        .single()

      if (!photo) {
        return { ...album, coverPhotoUrl: null }
      }

      const { data } = supabase.storage.from('photos').getPublicUrl(photo.storage_path)
      return { ...album, coverPhotoUrl: data.publicUrl }
    })
  )

  return albumsWithPhotos
}

/**
 * Fetches all albums for the current user (without cover URLs )
 */
export async function getAlbums(): Promise<Album[]> {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .order('position', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch albums: ${error.message}`)
  }

  return data ?? []
}

/**
 * Gets the cover photo URL for an album
 */
export async function getCoverPhotoUrl(album: Album): Promise<string | null> {
  if (!album.cover_photo_id) {
    return null
  }

  const { data: photo } = await supabase
    .from('photos')
    .select('storage_path')
    .eq('id', album.cover_photo_id)
    .single()

  if (!photo) {
    return null
  }

  const { data } = supabase.storage.from('photos').getPublicUrl(photo.storage_path)
  return data.publicUrl
}

/**
 * Fetches a single album by ID
 */
export async function getAlbumById(albumId: string): Promise<Album | null> {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .eq('id', albumId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw new Error(`Failed to fetch album: ${error.message}`)
  }

  return data
}

/**
 * Creates a new album
 */
export async function createAlbum(input: CreateAlbumInput): Promise<Album> {
  // Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('You must be logged in to create an album')
  }

  // Get the last album's position to generate the next position
  const { data: lastAlbum } = await supabase
    .from('albums')
    .select('position')
    .order('position', { ascending: false })
    .limit(1)
    .single()

  const position = generatePosition(lastAlbum?.position ?? null)
  const name = normalizeAlbumName(input.name)

  const { data, error } = await supabase
    .from('albums')
    .insert({
      user_id: user.id,
      name,
      position,
      has_custom_order: false,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create album: ${error.message}`)
  }

  return data
}

/**
 * Updates an existing album
 */
export async function updateAlbum(albumId: string, input: UpdateAlbumInput): Promise<Album> {
  const updateData: Record<string, unknown> = {}

  if (input.name !== undefined) {
    updateData.name = normalizeAlbumName(input.name)
  }

  if (input.position !== undefined) {
    updateData.position = input.position
  }

  if (input.cover_photo_id !== undefined) {
    updateData.cover_photo_id = input.cover_photo_id
  }

  const { data, error } = await supabase
    .from('albums')
    .update(updateData)
    .eq('id', albumId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update album: ${error.message}`)
  }

  return data
}

/**
 * Sets the cover photo for an album
 */
export async function setAlbumCover(albumId: string, photoId: string | null): Promise<Album> {
  return updateAlbum(albumId, { cover_photo_id: photoId })
}

/**
 * Deletes an album and all its photos
 */
export async function deleteAlbum(albumId: string): Promise<void> {
  // First, get all photos in this album to delete from storage
  const { data: photos } = await supabase
    .from('photos')
    .select('storage_path')
    .eq('album_id', albumId)

  // Delete photos from storage if any exist
  if (photos && photos.length > 0) {
    const paths = photos.map(p => p.storage_path.replace('photos/', ''))
    await supabase.storage.from('photos').remove(paths)
  }

  // Delete the album (photos will cascade delete)
  const { error } = await supabase
    .from('albums')
    .delete()
    .eq('id', albumId)

  if (error) {
    throw new Error(`Failed to delete album: ${error.message}`)
  }
}

/**
 * Updates the position of an album (for drag and drop)
 */
export async function updateAlbumPosition(albumId: string, newPosition: string): Promise<Album> {
  const { data, error } = await supabase
    .from('albums')
    .update({ position: newPosition })
    .eq('id', albumId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update album position: ${error.message}`)
  }

  return data
}

/**
 * Sets has_custom_order to true for all user's albums
 * Called after the first manual reorder
 */
export async function enableCustomOrder(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in')
  }

  const { error } = await supabase
    .from('albums')
    .update({ has_custom_order: true })
    .eq('user_id', user.id)

  if (error) {
    throw new Error(`Failed to enable custom order: ${error.message}`)
  }
}

/**
 * Groups albums by creation date for display
 */
export function groupAlbumsByDate<T extends Album>(albums: T[]): Map<string, T[]> {
  const groups = new Map<string, T[]>()

  for (const album of albums) {
    const date = new Date(album.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    if (!groups.has(date)) {
      groups.set(date, [])
    }
    groups.get(date)!.push(album)
  }

  return groups
}
