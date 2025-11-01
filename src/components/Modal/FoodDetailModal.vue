<template>
  <BaseModal v-model:is-open="modalOpen">
    <template #content>
      <div v-if="props.foodAnalysis">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Icon icon="mdi:food-apple" class="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">รายละเอียด</h2>
              <p class="text-sm text-gray-500">ผลการวิเคราะห์จาก AI</p>
            </div>
          </div>
          <button
            @click="onClose"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <Icon icon="mdi:close" class="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <!-- Food Image -->
        <div v-if="props.foodAnalysis.media && props.foodAnalysis.media.length > 0" class="mb-6">
          <h3 class="text-sm font-medium text-gray-700 mb-3">รูปภาพอาหาร</h3>
          <div class="aspect-video rounded-xl overflow-hidden bg-gray-100">
            <img 
              :src="props.foodAnalysis.media[0]?.url" 
              :alt="props.foodAnalysis.foodName || 'อาหาร'"
              class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Food Information -->
        <div class="space-y-4">
          <!-- Food Name -->
          <div class="bg-gray-50 rounded-xl p-4">
            <div class="flex items-center space-x-3 mb-2">
              <Icon icon="mdi:food" class="w-5 h-5 text-orange-600" />
              <h3 class="text-base font-semibold text-gray-900">ชื่ออาหาร</h3>
            </div>
            <p class="text-base text-gray-700 ml-8">
              {{ props.foodAnalysis.foodName || 'ไม่ระบุชื่ออาหาร' }}
            </p>
          </div>

          <!-- Nutritional Information -->
          <div v-if="props.foodAnalysis.carbsGram || props.foodAnalysis.sugarGram" class="bg-blue-50 rounded-xl p-4">
            <div class="flex items-center space-x-3 mb-3">
              <Icon icon="mdi:nutrition" class="w-5 h-5 text-blue-600" />
              <h3 class="text-base font-semibold text-gray-900">ข้อมูลโภชนาการ</h3>
            </div>
            
            <div class="space-y-2 ml-8">
              <div v-if="props.foodAnalysis.carbsGram" class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <Icon icon="mdi:grain" class="w-4 h-4 text-amber-500" />
                  <span class="text-sm text-gray-700">คาร์โบไฮเดรต</span>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ props.foodAnalysis.carbsGram }} กรัม</span>
              </div>

              <div v-if="props.foodAnalysis.sugarGram" class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <Icon icon="mdi:cube-outline" class="w-4 h-4 text-red-500" />
                  <span class="text-sm text-gray-700">น้ำตาล</span>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ props.foodAnalysis.sugarGram }} กรัม</span>
              </div>
            </div>
          </div>

          <!-- AI Advice -->
          <div v-if="props.foodAnalysis.advice" class="bg-green-50 rounded-xl p-4">
            <div class="flex items-center space-x-3 mb-3">
              <Icon icon="mdi:lightbulb" class="w-5 h-5 text-green-600" />
              <h3 class="text-base font-semibold text-gray-900">คำแนะนำจาก AI</h3>
            </div>
            <p class="text-sm text-gray-700 ml-8 leading-relaxed">
              {{ props.foodAnalysis.advice }}
            </p>
          </div>
        </div>
      </div>
    </template>
    <template #actions>
      <BaseButton
        variant="outline"
        size="md"
        full-width
        @click="onClose">
        ปิด
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import BaseModal from '@/components/Base/BaseModal.vue'
import BaseButton from '@/components/Base/BaseButton.vue'
import type { IFoodAnalysis } from '@/models/Response/FoodResponse.model'

interface Props {
  isOpen: boolean
  foodAnalysis?: IFoodAnalysis | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

// Local reactive variable for modal state
const modalOpen = ref(false)

// Sync with parent prop
watch(() => props.isOpen, (newValue) => {
  modalOpen.value = newValue
}, { immediate: true })

// Watch modal close
watch(modalOpen, (newValue) => {
  if (!newValue && props.isOpen) {
    emits('close')
  }
})

function onClose(): void {
  modalOpen.value = false
  emits('close')
}
</script>

<style scoped></style>