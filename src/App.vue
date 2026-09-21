<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGoodsStore } from '@/stores/goods'

import AppHeader from '@/components/AppHeader.vue'
import GoodsList from '@/components/GoodsList.vue'
import CartPanel from '@/components/CartPanel.vue'

const goodsStore = useGoodsStore()
const { isLoading, errorMessage } = storeToRefs(goodsStore)

onMounted(async () => {
  await goodsStore.loadGoodsFromServer()
})
</script>

<template>
  <div class="flex flex-column w-9 mx-auto min-h-screen">
    <AppHeader />

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