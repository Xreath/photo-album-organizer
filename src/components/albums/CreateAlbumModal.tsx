// CreateAlbumModal component - Modal for creating a new album

import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { validateAlbumName } from '../../lib/validation'

interface CreateAlbumModalProps {
    isOpen: boolean
    onClose: () => void
    onCreate: (name: string) => Promise<void>
    isCreating: boolean
}

export function CreateAlbumModal({
    isOpen,
    onClose,
    onCreate,
    isCreating,
}: CreateAlbumModalProps) {
    const [name, setName] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate
        const validation = validateAlbumName(name)
        if (!validation.valid) {
            setError(validation.error ?? 'Invalid album name')
            return
        }

        setError(null)

        try {
            await onCreate(name)
            // Reset form on success
            setName('')
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create album')
        }
    }

    const handleClose = () => {
        setName('')
        setError(null)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Create New Album">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="album-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Album Name
                    </label>
                    <input
                        id="album-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter album name..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        autoFocus
                        disabled={isCreating}
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
                        disabled={isCreating}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={isCreating}
                        disabled={!name.trim()}
                    >
                        Create Album
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
