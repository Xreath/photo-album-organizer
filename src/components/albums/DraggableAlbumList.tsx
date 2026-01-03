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
import type { AlbumWithCover } from '../../services/albumService'
import { DraggableAlbumCard } from './DraggableAlbumCard'

interface DraggableAlbumListProps {
    albums: AlbumWithCover[]
    onEdit: (album: AlbumWithCover) => void
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
                        <div className="album-card bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden w-64">
                            {/* Album preview with cover */}
                            <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
                                {activeAlbum.coverPhotoUrl ? (
                                    <>
                                        <img
                                            src={activeAlbum.coverPhotoUrl}
                                            alt={activeAlbum.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {/* Album info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 truncate">{activeAlbum.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(activeAlbum.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
