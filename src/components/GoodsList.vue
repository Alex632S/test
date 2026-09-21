<script setup lang="ts">
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useGoodsStore } from '@/stores/goods'
import { useCartStore } from '@/stores/cart'
import { GoodsField } from '@/types'
import { getPriceSeverity, getPriceArrow, hasPriceDirection } from '@/utils/price'

import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Panel from 'primevue/panel'

const goodsStore = useGoodsStore()
const cartStore = useCartStore()

const { dollarRate, categories } = storeToRefs(goodsStore)

const collapsedCategories = reactive<Record<number, boolean>>({})

function toggleCategory(categoryId: number): void {
    collapsedCategories[categoryId] = !collapsedCategories[categoryId]
}
</script>

<template>
    <div class="flex flex-column gap-3">
        <Panel v-for="category in categories" :key="category.id" toggleable
            :collapsed="!collapsedCategories[category.id]" @update:collapsed="toggleCategory(category.id)">
            <template #header>
                <div class="flex align-items-center gap-2">
                    <span class="font-bold">{{ category.name }}</span>
                    <Tag :value="String(category.goods.length)" severity="secondary" rounded />
                </div>
            </template>

            <div class="flex flex-column">
                <div v-for="good in category.goods" :key="`${good[GoodsField.GroupId]}-${good[GoodsField.ProductId]}`"
                    class="flex align-items-center gap-3 py-2 border-bottom-1 surface-border">
                    <div class="flex-1">
                        <span class="font-medium">{{ good.productName }}</span>
                        <span class="text-color-secondary text-sm ml-1">
                            ({{ good[GoodsField.Stock] }})
                        </span>
                    </div>

                    <div class="flex align-items-center gap-2">
                        <span class="tabular-nums">
                            {{ (good[GoodsField.PriceUsd] * dollarRate).toFixed(2) }} ₽
                        </span>
                        <Tag v-if="hasPriceDirection(good.direction)" :severity="getPriceSeverity(good.direction)!"
                            :value="getPriceArrow(good.direction)" rounded />
                    </div>

                    <Button label="В корзину" icon="pi pi-cart-plus" size="small" @click="cartStore.addGood(good)" />
                </div>
            </div>
        </Panel>
    </div>
</template>