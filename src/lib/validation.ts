// Validation utilities for album and photo operations

const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
]

const MAX_FILE_SIZE_MB = 20
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

const MAX_ALBUM_NAME_LENGTH = 255

export interface ValidationResult {
    valid: boolean
    error?: string
}

/**
 * Validates an album name
 */
export function validateAlbumName(name: string): ValidationResult {
    const trimmed = name.trim()

    if (!trimmed) {
        return { valid: false, error: 'Album name is required' }
    }

    if (trimmed.length > MAX_ALBUM_NAME_LENGTH) {
        return { valid: false, error: `Album name must be ${MAX_ALBUM_NAME_LENGTH} characters or less` }
    }

    return { valid: true }
}

/**
 * Normalizes an album name (trims whitespace)
 */
export function normalizeAlbumName(name: string): string {
    return name.trim()
}

/**
 * Validates a file is an allowed image type
 */
export function validateImageType(file: File): ValidationResult {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: 'Only JPEG, PNG, GIF, and WebP images are allowed',
        }
    }

    return { valid: true }
}

/**
 * Validates a file is within the size limit
 */
export function validateFileSize(file: File): ValidationResult {
    if (file.size > MAX_FILE_SIZE_BYTES) {
        return {
            valid: false,
            error: `File size must be ${MAX_FILE_SIZE_MB}MB or less`,
        }
    }

    return { valid: true }
}

/**
 * Validates a file for upload (type and size)
 */
export function validateImageFile(file: File): ValidationResult {
    const typeResult = validateImageType(file)
    if (!typeResult.valid) {
        return typeResult
    }

    const sizeResult = validateFileSize(file)
    if (!sizeResult.valid) {
        return sizeResult
    }

    return { valid: true }
}

/**
 * Validates multiple files for upload
 */
export function validateImageFiles(files: File[]): ValidationResult {
    if (files.length === 0) {
        return { valid: false, error: 'Please select a file to upload' }
    }

    for (const file of files) {
        const result = validateImageFile(file)
        if (!result.valid) {
            return { valid: false, error: `${file.name}: ${result.error}` }
        }
    }

    return { valid: true }
}

export { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_MB, MAX_FILE_SIZE_BYTES, MAX_ALBUM_NAME_LENGTH }
