import type { PriceDirection } from '@/types'

export function getPriceSeverity(direction?: PriceDirection): string | null {
    if (direction === 'up') return 'danger'
    if (direction === 'down') return 'success'
    return null
}

export function getPriceArrow(direction?: PriceDirection): string {
    if (direction === 'up') return '↑'
    if (direction === 'down') return '↓'
    return ''
}

export function hasPriceDirection(direction?: PriceDirection): boolean {
    return direction === 'up' || direction === 'down'
}