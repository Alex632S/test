<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGoodsStore } from '@/stores/goods'
import { useCartStore } from '@/stores/cart'
import { GoodsField } from '@/types'
import { getPriceSeverity, getPriceArrow, hasPriceDirection } from '@/utils/price'

import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'

const goodsStore = useGoodsStore()
const cartStore = useCartStore()

const { dollarRate } = storeToRefs(goodsStore)
const { items } = storeToRefs(cartStore)

const totalPriceRub = computed(() => cartStore.totalPriceUsd * dollarRate.value)
</script>

<template>
    <div class="lg:sticky lg:top-5rem">
        <Card>
            <template #title>
                <div class="flex align-items-center justify-content-between">
                    <span>Корзина</span>
                    <Tag v-if="!cartStore.isEmpty" :value="String(cartStore.totalQuantity)" severity="info" rounded />
                </div>
            </template>

            <template #content>
                <div v-if="cartStore.isEmpty" class="text-color-secondary text-center py-4">
                    Пока пусто
                </div>

                <div v-else class="flex flex-column gap-3">
                    <div v-for="item in items" :key="item.key"
                        class="flex justify-content-between align-items-start gap-2 pb-3 border-bottom-1 surface-border">
                        <div class="flex-1">
                            <div class="font-medium text-sm">{{ item.good.productName }}</div>

                            <Tag class="mt-2" severity="warning" :value="item.good.categoryName" />

                            <div class="flex align-items-center gap-2 mt-1">
                                <span class="text-xs text-color-secondary tabular-nums">
                                    {{ (item.good[GoodsField.PriceUsd] * dollarRate).toFixed(2) }} ₽
                                </span>
                                <Tag v-if="hasPriceDirection(item.good.direction)"
                                    :severity="getPriceSeverity(item.good.direction)!"
                                    :value="getPriceArrow(item.good.direction)" rounded />
                            </div>

                            <div class="flex align-items-center gap-2 mt-2">
                                <Button icon="pi pi-minus" size="small" severity="secondary" text rounded
                                    @click="cartStore.changeQuantity(item.key, -1)" />
                                <span class="text-sm tabular-nums w-2rem text-center">
                                    {{ item.quantity }}
                                </span>
                                <Button icon="pi pi-plus" size="small" severity="secondary" text rounded
                                    @click="cartStore.changeQuantity(item.key, +1)" />
                            </div>
                        </div>

                        <Button icon="pi pi-trash" severity="danger" text rounded size="small" aria-label="Удалить"
                            @click="cartStore.removeGood(item.key)" />
                    </div>

                    <div class="mt-2 pt-2 surface-border">
                        <div class="flex gap-1 mt-1">
                            <span class="text-sm">Общая стоимость <b>₽</b>:</span>
                            <b class="tabular-nums">{{ totalPriceRub.toFixed(2) }}</b>
                        </div>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>