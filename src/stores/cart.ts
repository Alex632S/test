import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Good, CartItem } from '@/types'
import { getGoodKey } from './goods'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalPriceUsd = computed(() =>
    items.value.reduce(
      (sum, item) => sum + item.good.P * item.quantity,
      0,
    ),
  )

  const totalQuantity = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  const isEmpty = computed(() => items.value.length === 0)

  function addGood(good: Good): void {
    const key = getGoodKey(good)
    const existingItem = items.value.find((item) => item.key === key)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({ key, good, quantity: 1 })
    }
  }

  function removeGood(key: string): void {
    items.value = items.value.filter((item) => item.key !== key)
  }

  function changeQuantity(key: string, delta: number): void {
    const item = items.value.find((i) => i.key === key)
    if (!item) return

    item.quantity += delta
    if (item.quantity <= 0) removeGood(key)
  }

  function clearCart(): void {
    items.value = []
  }

  return {
    items,
    totalPriceUsd,
    totalQuantity,
    isEmpty,
    addGood,
    removeGood,
    changeQuantity,
    clearCart,
  }
})