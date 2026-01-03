// Photo service - CRUD operations for photos

import { supabase } from '../lib/supabase'
import type { Photo } from '../types/database'
import { generatePosition } from './orderingService'
import { compressImage, getImageDimensions, generateStorageFilename } from '../lib/imageUtils'

/**
 * Fetches all photos for an album
 */
export async function getPhotosByAlbum(albumId: string): Promise<Photo[]> {
    const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('album_id', albumId)
        .order('position', { ascending: true })

    if (error) {
        throw new Error(`Failed to fetch photos: ${error.message}`)
    }

    return data ?? []
}

/**
 * Gets a single photo by ID
 */
export async function getPhotoById(photoId: string): Promise<Photo | null> {
    const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('id', photoId)
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            return null
        }
        throw new Error(`Failed to fetch photo: ${error.message}`)
    }

    return data
}

/**
 * Uploads a photo to an album
 */
export async function uploadPhoto(
    albumId: string,
    file: File,
    onProgress?: (progress: number) => void
): Promise<Photo> {
    // Get current user for storage path
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        throw new Error('You must be logged in to upload photos')
    }

    // Compress the image
    onProgress?.(10)
    const compressedFile = await compressImage(file)

    // Get image dimensions
    onProgress?.(20)
    const dimensions = await getImageDimensions(compressedFile)

    // Generate unique ID and storage path
    const photoId = crypto.randomUUID()
    const filename = generateStorageFilename(photoId, file.name)
    const storagePath = `${user.id}/${albumId}/${filename}`

    // Upload to Supabase Storage
    onProgress?.(30)
    const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(storagePath, compressedFile, {
            cacheControl: '3600',
            upsert: false,
        })

    if (uploadError) {
        throw new Error(`Failed to upload photo: ${uploadError.message}`)
    }

    onProgress?.(70)

    // Get the last photo's position
    const { data: lastPhoto } = await supabase
        .from('photos')
        .select('position')
        .eq('album_id', albumId)
        .order('position', { ascending: false })
        .limit(1)
        .single()

    const position = generatePosition(lastPhoto?.position ?? null)

    // Create photo record
    onProgress?.(90)
    const { data, error } = await supabase
        .from('photos')
        .insert({
            id: photoId,
            album_id: albumId,
            storage_path: storagePath,
            filename: file.name,
            position,
            file_size: compressedFile.size,
            width: dimensions.width,
            height: dimensions.height,
        })
        .select()
        .single()

    if (error) {
        // Try to clean up the uploaded file
        await supabase.storage.from('photos').remove([storagePath])
        throw new Error(`Failed to create photo record: ${error.message}`)
    }

    onProgress?.(100)
    return data
}

/**
 * Uploads multiple photos to an album
 */
export async function uploadPhotos(
    albumId: string,
    files: File[],
    onProgress?: (completed: number, total: number) => void
): Promise<{ successful: Photo[]; failed: Array<{ file: File; error: string }> }> {
    const successful: Photo[] = []
    const failed: Array<{ file: File; error: string }> = []

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        try {
            const photo = await uploadPhoto(albumId, file)
            successful.push(photo)
        } catch (err) {
            failed.push({
                file,
                error: err instanceof Error ? err.message : 'Upload failed',
            })
        }
        onProgress?.(i + 1, files.length)
    }

    return { successful, failed }
}

/**
 * Deletes a photo
 */
export async function deletePhoto(photoId: string): Promise<void> {
    // First get the photo to find the storage path
    const photo = await getPhotoById(photoId)

    if (!photo) {
        throw new Error('Photo not found')
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
        .from('photos')
        .remove([photo.storage_path])

    if (storageError) {
        console.warn('Failed to delete from storage:', storageError.message)
        // Continue anyway - the file might already be deleted
    }

    // Delete the database record
    const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId)

    if (error) {
        throw new Error(`Failed to delete photo: ${error.message}`)
    }
}

/**
 * Updates photo position (for drag and drop)
 */
export async function updatePhotoPosition(photoId: string, newPosition: string): Promise<Photo> {
    const { data, error } = await supabase
        .from('photos')
        .update({ position: newPosition })
        .eq('id', photoId)
        .select()
        .single()

    if (error) {
        throw new Error(`Failed to update photo position: ${error.message}`)
    }

    return data
}

/**
 * Gets the public URL for a photo
 */
export function getPhotoUrl(storagePath: string): string {
    const { data } = supabase.storage.from('photos').getPublicUrl(storagePath)
    return data.publicUrl
}

/**
 * Gets a thumbnail URL for a photo
 */
export function getThumbnailUrl(storagePath: string, width = 300, height = 300): string {
    const { data } = supabase.storage.from('photos').getPublicUrl(storagePath, {
        transform: {
            width,
            height,
            resize: 'cover',
        },
    })
    return data.publicUrl
}
