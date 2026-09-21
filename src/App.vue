<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGoodsStore } from '@/stores/goods'
import { useTickTimer } from '@/composables/useTickTimer'

import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'

import GoodsList from '@/components/GoodsList.vue'
import CartPanel from '@/components/CartPanel.vue'

const goodsStore = useGoodsStore()

const { dollarRate, isLoading, errorMessage } = storeToRefs(goodsStore)

const { secondsLeft, start, triggerNow } = useTickTimer({
  intervalMs: 15000,
  onTick: () => goodsStore.recalculatePricesForNewRate(),
})

onMounted(async () => {
  await goodsStore.loadGoodsFromServer()
  start()
})
</script>

<template>
  <div class="flex flex-column w-9 mx-auto min-h-screen">
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

    <main class="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
      <div v-if="isLoading" class="text-center p-8 text-color-secondary">
        Загрузка…
      </div>
      <div v-else-if="errorMessage" class="p-4 text-red-500">
        {{ errorMessage }}
      </div>

      <div v-else class="grid">
        <div class="col-12 lg:col-8">
          <GoodsList />
        </div>
        <div class="col-12 lg:col-4">
          <CartPanel />
        </div>
      </div>
    </main>
  </div>
</template>