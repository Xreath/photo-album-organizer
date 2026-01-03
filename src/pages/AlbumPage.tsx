// AlbumPage - View photos in an album

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { PhotoGrid } from '../components/photos/PhotoGrid'
import { PhotoUploader } from '../components/photos/PhotoUploader'
import { PhotoViewer } from '../components/photos/PhotoViewer'
import { Button } from '../components/ui/Button'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState, PhotoIcon } from '../components/ui/EmptyState'
import { usePhotos } from '../hooks/usePhotos'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/ui/Toast'
import { getAlbumById } from '../services/albumService'
import type { Album, Photo } from '../types/database'

export function AlbumPage() {
    const { albumId } = useParams<{ albumId: string }>()
    const navigate = useNavigate()
    const { signOut } = useAuth()
    const { showToast } = useToast()

    const [album, setAlbum] = useState<Album | null>(null)
    const [albumLoading, setAlbumLoading] = useState(true)
    const [albumError, setAlbumError] = useState<string | null>(null)

    const {
        photos,
        isLoading: photosLoading,
        error: photosError,
        uploadPhotos,
        deletePhoto,
        getPhotoUrl,
        getThumbnailUrl,
        isUploading,
        uploadProgress,
    } = usePhotos(albumId ?? '')

    const [viewingPhoto, setViewingPhoto] = useState<Photo | null>(null)

    // Fetch album details
    useEffect(() => {
        async function fetchAlbum() {
            if (!albumId) return

            setAlbumLoading(true)
            setAlbumError(null)

            try {
                const data = await getAlbumById(albumId)
                if (!data) {
                    setAlbumError('Album not found')
                } else {
                    setAlbum(data)
                }
            } catch (err) {
                setAlbumError(err instanceof Error ? err.message : 'Failed to load album')
            } finally {
                setAlbumLoading(false)
            }
        }

        fetchAlbum()
    }, [albumId])

    // Logout handler
    const handleLogout = async () => {
        try {
            await signOut()
            navigate('/login')
        } catch {
            showToast('error', 'Failed to log out')
        }
    }

    // Upload handler
    const handleUpload = async (files: File[]) => {
        const result = await uploadPhotos(files)

        if (result.successful.length > 0) {
            showToast('success', `Uploaded ${result.successful.length} photo${result.successful.length === 1 ? '' : 's'}`)
        }

        if (result.failed.length > 0) {
            showToast('error', `Failed to upload ${result.failed.length} photo${result.failed.length === 1 ? '' : 's'}`)
        }
    }

    // Delete handler
    const handleDelete = async (photoId: string) => {
        try {
            await deletePhoto(photoId)
            showToast('success', 'Photo deleted')

            // Close viewer if viewing deleted photo
            if (viewingPhoto?.id === photoId) {
                setViewingPhoto(null)
            }
        } catch (err) {
            showToast('error', err instanceof Error ? err.message : 'Failed to delete photo')
            throw err
        }
    }

    // View photo
    const handleView = (photo: Photo) => {
        setViewingPhoto(photo)
    }

    const isLoading = albumLoading || photosLoading
    const error = albumError || photosError

    return (
        <AppLayout isAuthenticated={true} onLogout={handleLogout}>
            {/* Back button and header */}
            <div className="mb-6">
                <Link to="/">
                    <Button variant="ghost" size="sm">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Albums
                    </Button>
                </Link>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            )}

            {/* Error */}
            {error && !isLoading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    <p className="font-medium">Error</p>
                    <p className="text-sm mt-1">{error}</p>
                    <Link to="/" className="text-sm text-red-600 hover:underline mt-2 inline-block">
                        ← Return to albums
                    </Link>
                </div>
            )}

            {/* Album content */}
            {!isLoading && !error && album && (
                <>
                    {/* Album header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">{album.name}</h1>
                        <p className="text-gray-600 mt-1">
                            {photos.length} photo{photos.length === 1 ? '' : 's'}
                        </p>
                    </div>

                    {/* Photo uploader */}
                    <PhotoUploader
                        onUpload={handleUpload}
                        isUploading={isUploading}
                        uploadProgress={uploadProgress}
                    />

                    {/* Empty state */}
                    {photos.length === 0 && !isUploading && (
                        <EmptyState
                            icon={<PhotoIcon />}
                            title="No photos yet"
                            description="Upload some photos to get started"
                        />
                    )}

                    {/* Photo grid */}
                    {photos.length > 0 && (
                        <PhotoGrid
                            photos={photos}
                            getThumbnailUrl={getThumbnailUrl}
                            onView={handleView}
                            onDelete={handleDelete}
                        />
                    )}
                </>
            )}

            {/* Photo viewer */}
            <PhotoViewer
                photo={viewingPhoto}
                photoUrl={viewingPhoto ? getPhotoUrl(viewingPhoto) : ''}
                photos={photos}
                onClose={() => setViewingPhoto(null)}
                onNavigate={setViewingPhoto}
                getPhotoUrl={getPhotoUrl}
            />
        </AppLayout>
    )
}
