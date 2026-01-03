// DraggableAlbumList - Sortable album grid with drag-and-drop

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
import type { Album } from '../../types/database'
import { DraggableAlbumCard } from './DraggableAlbumCard'
import { AlbumCard } from './AlbumCard'

interface DraggableAlbumListProps {
    albums: Album[]
    onEdit: (album: Album) => void
    onDelete: (albumId: string) => Promise<void>
    onReorder: (albumId: string, oldIndex: number, newIndex: number) => Promise<void>
}

export function DraggableAlbumList({
    albums,
    onEdit,
    onDelete,
    onReorder,
}: DraggableAlbumListProps) {
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

        const oldIndex = albums.findIndex((a) => a.id === active.id)
        const newIndex = albums.findIndex((a) => a.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
            await onReorder(active.id as string, oldIndex, newIndex)
        }
    }

    const activeAlbum = activeId ? albums.find((a) => a.id === activeId) : null

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={albums.map((a) => a.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {albums.map((album) => (
                        <DraggableAlbumCard
                            key={album.id}
                            album={album}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            </SortableContext>

            {/* Drag overlay - shows the dragged item */}
            <DragOverlay>
                {activeAlbum ? (
                    <div className="transform rotate-3 shadow-2xl">
                        <AlbumCard
                            album={activeAlbum}
                            onEdit={() => { }}
                            onDelete={async () => { }}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
