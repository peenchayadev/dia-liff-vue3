<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">สรุปนัดหมาย</h2>
      <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
        <Icon icon="mdi:calendar-check" class="w-6 h-6 text-blue-600" />
      </div>
    </div>
    
    <div class="grid grid-cols-2 gap-4">
      <!-- Total -->
      <div class="text-center p-5 bg-gray-50 rounded-xl">
        <div class="text-3xl font-bold text-gray-900">{{ summary?.total || 0 }}</div>
        <div class="text-base text-gray-600 mt-1">ทั้งหมด</div>
      </div>
      
      <!-- Today -->
      <div class="text-center p-5 bg-green-50 rounded-xl">
        <div class="text-3xl font-bold text-green-600">{{ summary?.today || 0 }}</div>
        <div class="text-base text-green-600 mt-1">วันนี้</div>
      </div>
      
      <!-- Upcoming -->
      <div class="text-center p-5 bg-blue-50 rounded-xl">
        <div class="text-3xl font-bold text-blue-600">{{ summary?.upcoming || 0 }}</div>
        <div class="text-base text-blue-600 mt-1">กำลังจะถึง</div>
      </div>
      
      <!-- Past -->
      <div class="text-center p-5 bg-gray-50 rounded-xl">
        <div class="text-3xl font-bold text-gray-500">{{ summary?.past || 0 }}</div>
        <div class="text-base text-gray-500 mt-1">ผ่านไปแล้ว</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { IAppointmentSummary } from '@/models/Response/AppointmentResponse.model'

interface Props {
  summary?: IAppointmentSummary | null
}

defineProps<Props>()
</script>

<style scoped></style>