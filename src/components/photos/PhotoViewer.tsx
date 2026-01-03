// PhotoViewer component - Full-size photo lightbox

import { useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Photo } from '../../types/database'

interface PhotoViewerProps {
    photo: Photo | null
    photoUrl: string
    photos: Photo[]
    onClose: () => void
    onNavigate: (photo: Photo) => void
}

export function PhotoViewer({
    photo,
    photoUrl,
    photos,
    onClose,
    onNavigate,
}: PhotoViewerProps) {
    const [isLoading, setIsLoading] = useState(true)

    const currentIndex = photo ? photos.findIndex(p => p.id === photo.id) : -1
    const hasPrev = currentIndex > 0
    const hasNext = currentIndex < photos.length - 1

    const goToPrev = useCallback(() => {
        if (hasPrev) {
            setIsLoading(true)
            onNavigate(photos[currentIndex - 1])
        }
    }, [hasPrev, currentIndex, photos, onNavigate])

    const goToNext = useCallback(() => {
        if (hasNext) {
            setIsLoading(true)
            onNavigate(photos[currentIndex + 1])
        }
    }, [hasNext, currentIndex, photos, onNavigate])

    // Keyboard navigation
    useEffect(() => {
        if (!photo) return

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    onClose()
                    break
                case 'ArrowLeft':
                    goToPrev()
                    break
                case 'ArrowRight':
                    goToNext()
                    break
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [photo, onClose, goToPrev, goToNext])

    // Reset loading state when photo changes
    useEffect(() => {
        if (photo) {
            setIsLoading(true)
        }
    }, [photo?.id])

    if (!photo) return null

    return createPortal(
        <div
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
                aria-label="Close viewer"
            >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Photo info */}
            <div className="absolute top-4 left-4 text-white/70 text-sm z-10">
                <p>{photo.filename}</p>
                <p>{currentIndex + 1} of {photos.length}</p>
            </div>

            {/* Previous button */}
            {hasPrev && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        goToPrev()
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                    aria-label="Previous photo"
                >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Next button */}
            {hasNext && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        goToNext()
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                    aria-label="Next photo"
                >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Loading spinner */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin w-12 h-12 text-white/50" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                </div>
            )}

            {/* Main image */}
            <img
                src={photoUrl}
                alt={photo.filename}
                className={`max-w-full max-h-full object-contain transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                onClick={(e) => e.stopPropagation()}
                onLoad={() => setIsLoading(false)}
            />
        </div>,
        document.body
    )
}
