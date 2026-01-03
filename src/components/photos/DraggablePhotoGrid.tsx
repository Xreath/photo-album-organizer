// DraggablePhotoGrid - Sortable photo grid with drag-and-drop

import { useState } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    DragOverlay,
    type DragStartEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable'
import type { Photo } from '../../types/database'
import { DraggablePhotoCard } from './DraggablePhotoCard'
import { PhotoCard } from './PhotoCard'

interface DraggablePhotoGridProps {
    photos: Photo[]
    getThumbnailUrl: (photo: Photo) => string
    onView: (photo: Photo) => void
    onDelete: (photoId: string) => Promise<void>
    onReorder: (photoId: string, oldIndex: number, newIndex: number) => Promise<void>
}

export function DraggablePhotoGrid({
    photos,
    getThumbnailUrl,
    onView,
    onDelete,
    onReorder,
}: DraggablePhotoGridProps) {
    const [activeId, setActiveId] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement before starting drag
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        setActiveId(null)

        if (!over || active.id === over.id) {
            return
        }

        const oldIndex = photos.findIndex((p) => p.id === active.id)
        const newIndex = photos.findIndex((p) => p.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
            await onReorder(active.id as string, oldIndex, newIndex)
        }
    }

    const activePhoto = activeId ? photos.find((p) => p.id === activeId) : null

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {photos.map((photo) => (
                        <DraggablePhotoCard
                            key={photo.id}
                            photo={photo}
                            thumbnailUrl={getThumbnailUrl(photo)}
                            onView={onView}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </SortableContext>

            {/* Drag overlay - shows the dragged photo */}
            <DragOverlay>
                {activePhoto ? (
                    <div className="transform rotate-3 shadow-2xl">
                        <PhotoCard
                            photo={activePhoto}
                            thumbnailUrl={getThumbnailUrl(activePhoto)}
                            onView={() => { }}
                            onDelete={async () => { }}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
