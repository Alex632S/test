import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  ApiData,
  NamesMap,
  Category,
  Good,
  PriceDirection,
} from '@/types'
import { GoodsField } from '@/types'

export function getGoodKey(good: Good): string {
  return `${good[GoodsField.GroupId]}-${good[GoodsField.ProductId]}`
}

function buildCategories(rawGoods: Good[], names: NamesMap): Category[] {
  const categoryMap = new Map<number, Category>()

  for (const good of rawGoods) {
    const groupId = good[GoodsField.GroupId]
    const productId = good[GoodsField.ProductId]

    const groupEntry = names[String(groupId)]
    const nameEntry = groupEntry?.B?.[String(productId)]

    const categoryName = groupEntry?.G ?? `Группа ${groupId}`

    good.productName = nameEntry?.N ?? `Товар ${productId}`
    good.categoryName = categoryName

    if (!categoryMap.has(groupId)) {
      categoryMap.set(groupId, {
        id: groupId,
        name: categoryName,
        goods: [],
      })
    }
    categoryMap.get(groupId)!.goods.push(good)
  }

  return [...categoryMap.values()].sort((a, b) => a.id - b.id)
}

function comparePrices(previousRub: number | undefined, currentRub: number): PriceDirection {
  if (previousRub == null) return 'same'
  if (currentRub > previousRub) return 'up'
  if (currentRub < previousRub) return 'down'
  return 'same'
}

export const useGoodsStore = defineStore('goods', () => {
  const categories = ref<Category[]>([])
  const dollarRate = ref(60)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  let previousPricesRub: Record<string, number> = {}

  const allGoods = computed<Good[]>(() =>
    categories.value.reduce<Good[]>(
      (goods, category) => goods.concat(category.goods),
      [],
    ),
  )

  async function loadGoodsFromServer(): Promise<Good[]> {
    isLoading.value = true
    errorMessage.value = null

    try {
      const [apiData, namesMap] = await Promise.all([
        fetch('/data').then((r) => r.json() as Promise<ApiData>),
        fetch('/names').then((r) => r.json() as Promise<NamesMap>),
      ])

      if (!apiData.Success) {
        errorMessage.value = apiData.Error || 'Ошибка данных'
        return []
      }

      categories.value = buildCategories(apiData.Value.Goods, namesMap)

      const currentPrices: Record<string, number> = {}
      for (const good of allGoods.value) {
        const key = getGoodKey(good)
        const priceRub = good[GoodsField.PriceUsd] * dollarRate.value
        good.direction = comparePrices(previousPricesRub[key], priceRub)
        currentPrices[key] = priceRub
      }
      previousPricesRub = currentPrices

      return allGoods.value
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      return []
    } finally {
      isLoading.value = false
    }
  }


  function recalculatePricesForNewRate(): void {
    const currentPrices: Record<string, number> = {}
    const newRate = Math.floor(Math.random() * 61) + 20

    for (const good of allGoods.value) {
      const key = getGoodKey(good)
      const priceRub = good[GoodsField.PriceUsd] * newRate
      good.direction = comparePrices(previousPricesRub[key], priceRub)
      currentPrices[key] = priceRub
    }

    dollarRate.value = newRate
    previousPricesRub = currentPrices
  }

  function updateDollarRateManually(value: number): void {
    dollarRate.value = value
  }

  return {
    categories,
    dollarRate,
    isLoading,
    errorMessage,
    allGoods,
    loadGoodsFromServer,
    recalculatePricesForNewRate,
    updateDollarRateManually,
  }
})