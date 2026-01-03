// PhotoCard component - Displays a single photo thumbnail with actions

import { useState } from 'react'
import type { Photo } from '../../types/database'
import { ConfirmDialog } from '../ui/ConfirmDialog'

interface PhotoCardProps {
    photo: Photo
    thumbnailUrl: string
    onView: (photo: Photo) => void
    onDelete: (photoId: string) => Promise<void>
    onSetCover?: (photoId: string) => Promise<void>
}

export function PhotoCard({ photo, thumbnailUrl, onView, onDelete, onSetCover }: PhotoCardProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await onDelete(photo.id)
            setShowDeleteConfirm(false)
        } catch {
            // Error handled in parent
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {/* Skeleton loader */}
                {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 skeleton" />
                )}

                {/* Error state */}
                {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                {/* Photo thumbnail */}
                <img
                    src={thumbnailUrl}
                    alt={photo.filename}
                    className={`w-full h-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={() => onView(photo)}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    loading="lazy"
                />

                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />

                {/* Delete button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        setShowDeleteConfirm(true)
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    aria-label="Delete photo"
                >
                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>

                {/* View button */}
                <button
                    onClick={() => onView(photo)}
                    className="absolute bottom-2 right-2 p-2 bg-white/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    aria-label="View full size"
                >
                    <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                </button>

                {/* Set as Cover button */}
                {onSetCover && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onSetCover(photo.id)
                        }}
                        className="absolute bottom-2 left-2 p-2 bg-white/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        aria-label="Set as album cover"
                        title="Set as album cover"
                    >
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Delete confirmation */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Photo"
                message="Are you sure you want to delete this photo? This action cannot be undone."
                confirmLabel="Delete"
                variant="danger"
                loading={isDeleting}
            />
        </>
    )
}
