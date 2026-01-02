// EditAlbumModal component - Modal for renaming an album

import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { validateAlbumName } from '../../lib/validation'
import type { Album } from '../../types/database'

interface EditAlbumModalProps {
    isOpen: boolean
    album: Album | null
    onClose: () => void
    onSave: (albumId: string, name: string) => Promise<void>
    isUpdating: boolean
}

export function EditAlbumModal({
    isOpen,
    album,
    onClose,
    onSave,
    isUpdating,
}: EditAlbumModalProps) {
    const [name, setName] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Reset form when album changes
    useEffect(() => {
        if (album) {
            setName(album.name)
            setError(null)
        }
    }, [album])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!album) return

        // Validate
        const validation = validateAlbumName(name)
        if (!validation.valid) {
            setError(validation.error ?? 'Invalid album name')
            return
        }

        setError(null)

        try {
            await onSave(album.id, name)
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update album')
        }
    }

    const handleClose = () => {
        setName('')
        setError(null)
        onClose()
    }

    const hasChanges = album && name.trim() !== album.name

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Rename Album">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="edit-album-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Album Name
                    </label>
                    <input
                        id="edit-album-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter album name..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        autoFocus
                        disabled={isUpdating}
                        maxLength={255}
                    />
                    {error && (
                        <p className="mt-1 text-sm text-red-600">{error}</p>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isUpdating}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={isUpdating}
                        disabled={!name.trim() || !hasChanges}
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
