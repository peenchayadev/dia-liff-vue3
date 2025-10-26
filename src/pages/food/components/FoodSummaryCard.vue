<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">สรุปการวิเคราะห์อาหาร</h2>
      <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
        <Icon icon="mdi:food-apple" class="w-6 h-6 text-orange-600" />
      </div>
    </div>
    
    <div class="grid grid-cols-3 gap-4">
      <!-- Total -->
      <div class="text-center p-5 bg-gray-50 rounded-xl">
        <div class="text-3xl font-bold text-gray-900">{{ summary?.total || 0 }}</div>
        <div class="text-base text-gray-600 mt-1">ทั้งหมด</div>
      </div>
      
      <!-- Today -->
      <div class="text-center p-5 bg-orange-50 rounded-xl">
        <div class="text-3xl font-bold text-orange-600">{{ summary?.today || 0 }}</div>
        <div class="text-base text-orange-600 mt-1">วันนี้</div>
      </div>
      
      <!-- This Week -->
      <div class="text-center p-5 bg-blue-50 rounded-xl">
        <div class="text-3xl font-bold text-blue-600">{{ summary?.thisWeek || 0 }}</div>
        <div class="text-base text-blue-600 mt-1">สัปดาห์นี้</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { IFoodSummary } from '@/models/Response/FoodResponse.model'

interface Props {
  summary?: IFoodSummary | null
}

defineProps<Props>()
</script>

<style scoped></style>