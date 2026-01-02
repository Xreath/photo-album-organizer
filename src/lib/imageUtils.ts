// Image utilities for client-side compression and dimension extraction

import imageCompression from 'browser-image-compression'

const COMPRESSION_OPTIONS = {
    maxSizeMB: 2,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
    preserveExif: false,
}

export interface ImageDimensions {
    width: number
    height: number
}

/**
 * Compresses an image file before upload
 * @param file Original image file
 * @returns Compressed image file
 */
export async function compressImage(file: File): Promise<File> {
    try {
        const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS)
        return compressedFile
    } catch (error) {
        console.warn('Image compression failed, using original file:', error)
        return file
    }
}

/**
 * Gets the dimensions of an image file
 * @param file Image file
 * @returns Promise resolving to width and height
 */
export async function getImageDimensions(file: File): Promise<ImageDimensions> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)

        img.onload = () => {
            URL.revokeObjectURL(url)
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight,
            })
        }

        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error('Failed to load image for dimension extraction'))
        }

        img.src = url
    })
}

/**
 * Creates a thumbnail URL from a Supabase storage URL
 * @param originalUrl Original image URL
 * @param width Thumbnail width
 * @param height Thumbnail height
 * @returns Thumbnail URL with resize parameters
 */
export function getThumbnailUrl(
    originalUrl: string,
    width: number = 300,
    height: number = 300
): string {
    // Supabase Image Transformations URL format
    const url = new URL(originalUrl)
    url.searchParams.set('width', width.toString())
    url.searchParams.set('height', height.toString())
    url.searchParams.set('resize', 'cover')
    return url.toString()
}

/**
 * Gets the file extension from a filename
 * @param filename Original filename
 * @returns File extension (without dot)
 */
export function getFileExtension(filename: string): string {
    const parts = filename.split('.')
    return parts.length > 1 ? parts.pop()!.toLowerCase() : 'jpg'
}

/**
 * Generates a unique filename for storage
 * @param photoId Unique photo ID
 * @param originalFilename Original filename for extension
 * @returns Storage-safe filename
 */
export function generateStorageFilename(photoId: string, originalFilename: string): string {
    const ext = getFileExtension(originalFilename)
    return `${photoId}.${ext}`
}
