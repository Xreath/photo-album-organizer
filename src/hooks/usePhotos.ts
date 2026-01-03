// usePhotos hook - Photo state management for an album

import { useState, useEffect, useCallback } from 'react'
import type { Photo } from '../types/database'
import {
    getPhotosByAlbum,
    uploadPhoto as uploadPhotoService,
    uploadPhotos as uploadPhotosService,
    deletePhoto as deletePhotoService,
    getPhotoUrl,
    getThumbnailUrl,
} from '../services/photoService'

interface UsePhotosState {
    photos: Photo[]
    isLoading: boolean
    error: string | null
}

interface UploadProgress {
    current: number
    total: number
    percentage: number
}

interface UsePhotosReturn extends UsePhotosState {
    // Actions
    uploadPhoto: (file: File) => Promise<Photo>
    uploadPhotos: (files: File[]) => Promise<{ successful: Photo[]; failed: Array<{ file: File; error: string }> }>
    deletePhoto: (photoId: string) => Promise<void>
    refreshPhotos: () => Promise<void>
    // URL helpers
    getPhotoUrl: (photo: Photo) => string
    getThumbnailUrl: (photo: Photo, width?: number, height?: number) => string
    // Upload state
    isUploading: boolean
    uploadProgress: UploadProgress | null
    isDeleting: boolean
}

export function usePhotos(albumId: string): UsePhotosReturn {
    const [state, setState] = useState<UsePhotosState>({
        photos: [],
        isLoading: true,
        error: null,
    })

    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Fetch photos
    const fetchPhotos = useCallback(async () => {
        if (!albumId) return

        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const photos = await getPhotosByAlbum(albumId)
            setState({
                photos,
                isLoading: false,
                error: null,
            })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load photos'
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: message,
            }))
        }
    }, [albumId])

    useEffect(() => {
        fetchPhotos()
    }, [fetchPhotos])

    // Upload single photo
    const uploadPhoto = useCallback(async (file: File): Promise<Photo> => {
        setIsUploading(true)
        setUploadProgress({ current: 0, total: 1, percentage: 0 })

        try {
            const photo = await uploadPhotoService(albumId, file, (progress) => {
                setUploadProgress({ current: 0, total: 1, percentage: progress })
            })

            // Add to state
            setState(prev => ({
                ...prev,
                photos: [...prev.photos, photo],
            }))

            return photo
        } finally {
            setIsUploading(false)
            setUploadProgress(null)
        }
    }, [albumId])

    // Upload multiple photos
    const uploadPhotos = useCallback(async (files: File[]) => {
        setIsUploading(true)
        setUploadProgress({ current: 0, total: files.length, percentage: 0 })

        try {
            const result = await uploadPhotosService(albumId, files, (completed, total) => {
                setUploadProgress({
                    current: completed,
                    total,
                    percentage: Math.round((completed / total) * 100),
                })
            })

            // Add successful uploads to state
            if (result.successful.length > 0) {
                setState(prev => ({
                    ...prev,
                    photos: [...prev.photos, ...result.successful],
                }))
            }

            return result
        } finally {
            setIsUploading(false)
            setUploadProgress(null)
        }
    }, [albumId])

    // Delete photo
    const deletePhoto = useCallback(async (photoId: string): Promise<void> => {
        setIsDeleting(true)

        try {
            await deletePhotoService(photoId)

            // Remove from state
            setState(prev => ({
                ...prev,
                photos: prev.photos.filter(p => p.id !== photoId),
            }))
        } finally {
            setIsDeleting(false)
        }
    }, [])

    // URL helpers bound to photos
    const getPhotoUrlForPhoto = useCallback((photo: Photo) => {
        return getPhotoUrl(photo.storage_path)
    }, [])

    const getThumbnailUrlForPhoto = useCallback((photo: Photo, width = 300, height = 300) => {
        return getThumbnailUrl(photo.storage_path, width, height)
    }, [])

    return {
        ...state,
        uploadPhoto,
        uploadPhotos,
        deletePhoto,
        refreshPhotos: fetchPhotos,
        getPhotoUrl: getPhotoUrlForPhoto,
        getThumbnailUrl: getThumbnailUrlForPhoto,
        isUploading,
        uploadProgress,
        isDeleting,
    }
}
