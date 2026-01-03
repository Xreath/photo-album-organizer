// HomePage - Main album list page with drag-and-drop reordering

import { useState } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { AlbumList } from '../components/albums/AlbumList'
import { DraggableAlbumList } from '../components/albums/DraggableAlbumList'
import { CreateAlbumModal } from '../components/albums/CreateAlbumModal'
import { EditAlbumModal } from '../components/albums/EditAlbumModal'
import { Button } from '../components/ui/Button'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState, AlbumIcon } from '../components/ui/EmptyState'
import { useAlbums } from '../hooks/useAlbums'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/ui/Toast'
import type { Album } from '../types/database'

export function HomePage() {
    const {
        albums,
        albumsByDate,
        hasCustomOrder,
        isLoading,
        error,
        createAlbum,
        updateAlbum,
        deleteAlbum,
        reorderAlbum,
        isCreating,
        isUpdating,
    } = useAlbums()

    const { signOut, user } = useAuth()
    const { showToast } = useToast()

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)

    // Logout handler
    const handleLogout = async () => {
        try {
            await signOut()
            showToast('success', 'Logged out successfully')
        } catch {
            showToast('error', 'Failed to log out')
        }
    }

    // Create album handler
    const handleCreate = async (name: string) => {
        try {
            await createAlbum({ name })
            showToast('success', 'Album created successfully!')
        } catch (err) {
            showToast('error', err instanceof Error ? err.message : 'Failed to create album')
            throw err
        }
    }

    // Edit album handler
    const handleEdit = (album: Album) => {
        setEditingAlbum(album)
    }

    const handleSaveEdit = async (albumId: string, name: string) => {
        try {
            await updateAlbum(albumId, { name })
            showToast('success', 'Album renamed successfully!')
        } catch (err) {
            showToast('error', err instanceof Error ? err.message : 'Failed to rename album')
            throw err
        }
    }

    // Delete album handler
    const handleDelete = async (albumId: string) => {
        try {
            await deleteAlbum(albumId)
            showToast('success', 'Album deleted successfully!')
        } catch (err) {
            showToast('error', err instanceof Error ? err.message : 'Failed to delete album')
            throw err
        }
    }

    // Reorder handler
    const handleReorder = async (albumId: string, oldIndex: number, newIndex: number) => {
        try {
            await reorderAlbum(albumId, oldIndex, newIndex)
            // Only show toast on first reorder when switching to custom order
            if (!hasCustomOrder) {
                showToast('info', 'Albums are now in custom order. Drag to rearrange!')
            }
        } catch (err) {
            showToast('error', err instanceof Error ? err.message : 'Failed to reorder album')
        }
    }

    return (
        <AppLayout isAuthenticated={true} onLogout={handleLogout}>
            {/* Header with title and create button */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Albums</h1>
                    <p className="text-gray-600 mt-1">
                        {albums.length === 0
                            ? 'Create your first album to get started'
                            : `${albums.length} album${albums.length === 1 ? '' : 's'}${hasCustomOrder ? ' • Drag to reorder' : ''}`}
                    </p>
                    {user && (
                        <p className="text-sm text-gray-500 mt-1">Signed in as {user.email}</p>
                    )}
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    New Album
                </Button>
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            )}

            {/* Error state */}
            {error && !isLoading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    <p className="font-medium">Error loading albums</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && albums.length === 0 && (
                <EmptyState
                    icon={<AlbumIcon />}
                    title="No albums yet"
                    description="Create your first album to start organizing your photos"
                    action={
                        <Button onClick={() => setShowCreateModal(true)}>
                            Create Your First Album
                        </Button>
                    }
                />
            )}

            {/* Album list - Use draggable version when there are albums */}
            {!isLoading && !error && albums.length > 0 && (
                hasCustomOrder || albums.length > 1 ? (
                    // Draggable list (always use when custom order or multiple albums)
                    <DraggableAlbumList
                        albums={albums}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onReorder={handleReorder}
                    />
                ) : (
                    // Regular list with date grouping (only for single album without custom order)
                    <AlbumList
                        albums={albums}
                        albumsByDate={albumsByDate}
                        hasCustomOrder={hasCustomOrder}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )
            )}

            {/* Create album modal */}
            <CreateAlbumModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={handleCreate}
                isCreating={isCreating}
            />

            {/* Edit album modal */}
            <EditAlbumModal
                isOpen={editingAlbum !== null}
                album={editingAlbum}
                onClose={() => setEditingAlbum(null)}
                onSave={handleSaveEdit}
                isUpdating={isUpdating}
            />
        </AppLayout>
    )
}
