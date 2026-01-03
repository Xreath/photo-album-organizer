// useAlbums hook - Album state management and operations

import { useState, useEffect, useCallback } from 'react'
import type { Album, CreateAlbumInput, UpdateAlbumInput } from '../types/database'
import type { AlbumWithCover } from '../services/albumService'
import {
    getAlbumsWithCovers,
    createAlbum as createAlbumService,
    updateAlbum as updateAlbumService,
    deleteAlbum as deleteAlbumService,
    updateAlbumPosition,
    enableCustomOrder,
    groupAlbumsByDate,
} from '../services/albumService'
import { calculateMovePosition } from '../services/orderingService'

interface UseAlbumsState {
    albums: AlbumWithCover[]
    isLoading: boolean
    error: string | null
    hasCustomOrder: boolean
}

interface UseAlbumsReturn extends UseAlbumsState {
    // Grouped albums for display (when not using custom order)
    albumsByDate: Map<string, AlbumWithCover[]>
    // Actions
    createAlbum: (input: CreateAlbumInput) => Promise<Album>
    updateAlbum: (albumId: string, input: UpdateAlbumInput) => Promise<Album>
    deleteAlbum: (albumId: string) => Promise<void>
    reorderAlbum: (albumId: string, oldIndex: number, newIndex: number) => Promise<void>
    refreshAlbums: () => Promise<void>
    // Loading states for individual operations
    isCreating: boolean
    isUpdating: boolean
    isDeleting: boolean
    isReordering: boolean
}

export function useAlbums(): UseAlbumsReturn {
    const [state, setState] = useState<UseAlbumsState>({
        albums: [],
        isLoading: true,
        error: null,
        hasCustomOrder: false,
    })

    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isReordering, setIsReordering] = useState(false)

    // Fetch albums on mount
    const fetchAlbums = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const albums = await getAlbumsWithCovers()
            const hasCustomOrder = albums.some(album => album.has_custom_order)

            setState({
                albums,
                isLoading: false,
                error: null,
                hasCustomOrder,
            })
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load albums'
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: message,
            }))
        }
    }, [])

    useEffect(() => {
        fetchAlbums()
    }, [fetchAlbums])

    // Create album
    const createAlbum = useCallback(async (input: CreateAlbumInput): Promise<Album> => {
        setIsCreating(true)

        try {
            const newAlbum = await createAlbumService(input)

            // Refresh albums to get proper cover data
            await fetchAlbums()

            return newAlbum
        } finally {
            setIsCreating(false)
        }
    }, [fetchAlbums])

    // Update album
    const updateAlbum = useCallback(async (albumId: string, input: UpdateAlbumInput): Promise<Album> => {
        setIsUpdating(true)

        try {
            const updatedAlbum = await updateAlbumService(albumId, input)

            // Refresh albums to get updated cover data
            await fetchAlbums()

            return updatedAlbum
        } finally {
            setIsUpdating(false)
        }
    }, [fetchAlbums])

    // Delete album
    const deleteAlbum = useCallback(async (albumId: string): Promise<void> => {
        setIsDeleting(true)

        try {
            await deleteAlbumService(albumId)

            // Remove album from state
            setState(prev => ({
                ...prev,
                albums: prev.albums.filter(album => album.id !== albumId),
            }))
        } finally {
            setIsDeleting(false)
        }
    }, [])

    // Reorder album (drag and drop)
    const reorderAlbum = useCallback(async (
        albumId: string,
        oldIndex: number,
        newIndex: number
    ): Promise<void> => {
        if (oldIndex === newIndex) return

        setIsReordering(true)

        // Get current albums
        const currentAlbums = state.albums

        // Calculate new position using fractional indexing
        const newPosition = calculateMovePosition(currentAlbums, oldIndex, newIndex)

        // Optimistically update the UI
        const reorderedAlbums = [...currentAlbums]
        const [movedAlbum] = reorderedAlbums.splice(oldIndex, 1)
        const updatedAlbum = { ...movedAlbum, position: newPosition, has_custom_order: true }
        reorderedAlbums.splice(newIndex, 0, updatedAlbum)

        setState(prev => ({
            ...prev,
            albums: reorderedAlbums,
            hasCustomOrder: true, // Once reordered, always show custom order
        }))

        try {
            // Persist to database
            await updateAlbumPosition(albumId, newPosition)

            // Enable custom order for all albums (first time reordering)
            if (!state.hasCustomOrder) {
                await enableCustomOrder()
            }
        } catch (err) {
            // Revert on error
            setState(prev => ({
                ...prev,
                albums: currentAlbums,
            }))
            throw err
        } finally {
            setIsReordering(false)
        }
    }, [state.albums, state.hasCustomOrder])

    // Compute grouped albums when not using custom order
    const albumsByDate = state.hasCustomOrder
        ? new Map<string, AlbumWithCover[]>()
        : groupAlbumsByDate(state.albums)

    return {
        ...state,
        albumsByDate,
        createAlbum,
        updateAlbum,
        deleteAlbum,
        reorderAlbum,
        refreshAlbums: fetchAlbums,
        isCreating,
        isUpdating,
        isDeleting,
        isReordering,
    }
}
