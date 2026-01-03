// DraggableAlbumCard - Album card with drag-and-drop support

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Link } from 'react-router-dom'
import type { Album } from '../../types/database'
import { Button } from '../ui/Button'
import { ConfirmDialog } from '../ui/ConfirmDialog'

interface DraggableAlbumCardProps {
    album: Album
    onEdit: (album: Album) => void
    onDelete: (albumId: string) => Promise<void>
    isDragging?: boolean
}

export function DraggableAlbumCard({ album, onEdit, onDelete }: DraggableAlbumCardProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: album.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
    }

    const formattedDate = new Date(album.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await onDelete(album.id)
            setShowDeleteConfirm(false)
        } catch {
            // Error handling done in parent
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                className={`album-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group ${isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
                    }`}
            >
                {/* Album preview - clickable to open */}
                <Link
                    to={`/albums/${album.id}`}
                    className="block aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 relative hover:from-blue-100 hover:to-indigo-200 transition-colors"
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-blue-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>

                    {/* Open indicator on hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
                        <span className="px-3 py-1.5 bg-white/90 rounded-full text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                            Open Album →
                        </span>
                    </div>
                </Link>

                {/* Album info and actions */}
                <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <Link to={`/albums/${album.id}`} className="block">
                                <h3 className="font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">
                                    {album.name}
                                </h3>
                            </Link>
                            <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
                        </div>

                        {/* Drag handle - small button */}
                        <div
                            {...attributes}
                            {...listeners}
                            className="p-2 rounded-lg hover:bg-gray-100 cursor-grab active:cursor-grabbing flex-shrink-0"
                            title="Drag to reorder"
                        >
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                            </svg>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(album)}
                            aria-label={`Edit ${album.name}`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(true)}
                            aria-label={`Delete ${album.name}`}
                            className="text-red-600 hover:bg-red-50"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete confirmation */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Album"
                message={`Are you sure you want to delete "${album.name}"? This will permanently remove the album and all photos inside it.`}
                confirmLabel="Delete Album"
                variant="danger"
                loading={isDeleting}
            />
        </>
    )
}
