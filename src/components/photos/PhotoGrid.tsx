// PhotoGrid component - Displays photos in a responsive grid

import type { Photo } from '../../types/database'
import { PhotoCard } from './PhotoCard'

interface PhotoGridProps {
    photos: Photo[]
    getThumbnailUrl: (photo: Photo) => string
    onView: (photo: Photo) => void
    onDelete: (photoId: string) => Promise<void>
    onSetCover?: (photoId: string) => Promise<void>
}

export function PhotoGrid({ photos, getThumbnailUrl, onView, onDelete, onSetCover }: PhotoGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {photos.map((photo) => (
                <PhotoCard
                    key={photo.id}
                    photo={photo}
                    thumbnailUrl={getThumbnailUrl(photo)}
                    onView={onView}
                    onDelete={onDelete}
                    onSetCover={onSetCover}
                />
            ))}
        </div>
    )
}
