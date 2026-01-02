// Ordering utilities using fractional indexing
// This allows O(1) insertions without renumbering other items

import { generateKeyBetween, generateNKeysBetween } from 'fractional-indexing'

/**
 * Generates a position key for a new item at the end of the list
 * @param lastPosition The position of the current last item, or null if list is empty
 */
export function generatePosition(lastPosition: string | null): string {
    return generateKeyBetween(lastPosition, null)
}

/**
 * Generates a position key between two existing items
 * @param before Position of the item that will be before the new position
 * @param after Position of the item that will be after the new position
 */
export function getPositionBetween(before: string | null, after: string | null): string {
    return generateKeyBetween(before, after)
}

/**
 * Generates N position keys between two positions
 * @param before Position of the item that will be before all new positions
 * @param after Position of the item that will be after all new positions
 * @param n Number of positions to generate
 */
export function generateNPositions(
    before: string | null,
    after: string | null,
    n: number
): string[] {
    return generateNKeysBetween(before, after, n)
}

/**
 * Calculates the new position for an item being moved in a list
 * @param items Array of items with position property, sorted by position
 * @param fromIndex Current index of the item being moved
 * @param toIndex Target index for the item
 * @returns New position string for the moved item
 */
export function calculateMovePosition<T extends { position: string }>(
    items: T[],
    fromIndex: number,
    toIndex: number
): string {
    // If moving to the same position, return current position
    if (fromIndex === toIndex) {
        return items[fromIndex].position
    }

    // Remove the item from consideration to get the remaining items
    const remainingItems = items.filter((_, i) => i !== fromIndex)

    // Calculate the new position based on neighbors at target index
    if (toIndex === 0) {
        // Moving to the beginning
        const afterPosition = remainingItems.length > 0 ? remainingItems[0].position : null
        return generateKeyBetween(null, afterPosition)
    } else if (toIndex >= remainingItems.length) {
        // Moving to the end
        const beforePosition = remainingItems.length > 0
            ? remainingItems[remainingItems.length - 1].position
            : null
        return generateKeyBetween(beforePosition, null)
    } else {
        // Moving to the middle
        // When moving down (fromIndex < toIndex), we need to account for the removed item
        const adjustedIndex = fromIndex < toIndex ? toIndex : toIndex - 1
        const beforePosition = remainingItems[adjustedIndex].position
        const afterPosition = remainingItems[adjustedIndex + 1]?.position ?? null
        return generateKeyBetween(beforePosition, afterPosition)
    }
}

/**
 * Generates initial positions for a list of items
 * @param count Number of positions to generate
 * @returns Array of position strings
 */
export function generateInitialPositions(count: number): string[] {
    return generateNKeysBetween(null, null, count)
}
