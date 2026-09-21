<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGoodsStore } from '@/stores/goods'
import { useTickTimer } from '@/composables/useTickTimer'

import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'

const goodsStore = useGoodsStore()

const { dollarRate, isLoading } = storeToRefs(goodsStore)

const { secondsLeft, start, triggerNow } = useTickTimer({
    intervalMs: 15000,
    onTick: () => goodsStore.recalculatePricesForNewRate(),
})

start()

defineExpose({ triggerNow, start })
</script>

<template>
    <header class="sticky top-0 z-5 surface-0 border-bottom-1 surface-border shadow-1">
        <div class="flex justify-content-center align-items-center gap-1 py-3 max-w-7xl w-full">
            <div class="flex align-items-center gap-2">
                <label for="rate" class="font-medium">Курс:</label>
                <span class="w-6rem">
                    <InputNumber id="rate" v-model="dollarRate" :min="20" :max="80" :minFractionDigits="1"
                        :maxFractionDigits="1" />
                </span>
            </div>

            <span class="text-color-secondary">
                Обновление через: <b class="text-xl">{{ secondsLeft.toFixed(3) }}</b>
            </span>

            <Button icon="pi pi-refresh" :loading="isLoading" text severity="info" size="small" @click="triggerNow" />
        </div>
    </header>
</template>