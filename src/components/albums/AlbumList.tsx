// AlbumList component - Displays albums grouped by date or as flat list

import type { Album } from '../../types/database'
import { AlbumCard } from './AlbumCard'

interface AlbumListProps {
    albums: Album[]
    albumsByDate: Map<string, Album[]>
    hasCustomOrder: boolean
    onEdit: (album: Album) => void
    onDelete: (albumId: string) => Promise<void>
}

export function AlbumList({
    albums,
    albumsByDate,
    hasCustomOrder,
    onEdit,
    onDelete,
}: AlbumListProps) {
    // If custom order is enabled, show flat list
    if (hasCustomOrder) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {albums.map((album) => (
                    <AlbumCard
                        key={album.id}
                        album={album}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        )
    }

    // Otherwise, show grouped by date
    const dateGroups = Array.from(albumsByDate.entries())

    return (
        <div className="space-y-8">
            {dateGroups.map(([date, dateAlbums]) => (
                <section key={date}>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        {date}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {dateAlbums.map((album) => (
                            <AlbumCard
                                key={album.id}
                                album={album}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}
