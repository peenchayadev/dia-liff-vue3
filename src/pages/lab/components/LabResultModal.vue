<template>
  <BaseModal v-model:isOpen="isOpen">
    <template #content>
      <div class="bg-white rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header - Sticky -->
        <div class="flex justify-between items-center p-4 border-b border-gray-100 flex-shrink-0 bg-white sticky top-0 z-10">
          <h2 class="text-lg font-semibold text-gray-900">{{ result.type }}</h2>
          <button @click="isOpen = false" class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <Icon icon="ph:x" class="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <!-- Content - Scrollable -->
        <div class="p-4 overflow-y-auto flex-1">
          <!-- Result Value -->
          <div class="mb-4">
            <div class="flex items-center gap-2 mb-1.5">
              <div class="text-2xl font-bold text-gray-900">
                {{ result.value }} {{ result.unit }}
              </div>
              <span class="px-2.5 py-0.5 text-xs rounded-full" :class="getStatusBadgeClass(result.status)">
                {{ getStatusText(result.status) }}
              </span>
            </div>

            <div v-if="result.referenceRange" class="text-sm text-gray-600">
              ค่าปกติ: {{ result.referenceRange }}
            </div>
          </div>

          <!-- Test Info -->
          <div class="grid grid-cols-1 gap-3 mb-4">
            <div>
              <div class="text-xs font-medium text-gray-700 mb-1">วันที่ตรวจ</div>
              <div class="text-sm text-gray-900">{{ formatDateTime(result.testDate) }}</div>
            </div>

            <div v-if="result.note">
              <div class="text-xs font-medium text-gray-700 mb-1">หมายเหตุ</div>
              <div class="text-sm text-gray-900">{{ result.note }}</div>
            </div>
          </div>

          <!-- Status Explanation -->
          <div class="mb-4 p-3 rounded-lg" :class="getStatusExplanationClass(result.status)">
            <div class="font-medium text-sm mb-1">{{ getStatusTitle(result.status) }}</div>
            <div class="text-xs leading-relaxed">{{ getStatusExplanation(result.status, result.type) }}</div>
          </div>

          <!-- Images -->
          <div v-if="result.media.length > 0" class="mb-4">
            <h3 class="text-xs font-medium text-gray-700 mb-2">รูปภาพผลแลป</h3>
            <div class="grid grid-cols-2 gap-2">
              <div v-for="media in result.media" :key="media.id"
                class="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                @click="openImageModal(media.url)">
                <img :src="media.url" :alt="`ผลแลป ${result.type}`"
                  class="w-full h-full object-cover hover:scale-105 transition-transform duration-200" loading="lazy" />
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div v-if="getRecommendations(result.status, result.type).length > 0" class="mb-4">
            <div class="text-xs font-medium text-gray-700 mb-2">คำแนะนำ</div>
            <ul class="space-y-1.5">
              <li v-for="(recommendation, index) in getRecommendations(result.status, result.type)" :key="index"
                class="flex items-start gap-2 text-xs text-gray-600">
                <Icon icon="ph:check-circle" class="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{{ recommendation }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Image Viewer Modal -->
      <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4"
        @click="closeImageModal">
        <div class="relative max-w-4xl max-h-full">
          <img :src="selectedImage" alt="ภาพผลแลป" class="max-w-full max-h-full object-contain rounded-lg" />
          <button @click="closeImageModal"
            class="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors">
            <Icon icon="mdi:close" class="w-6 h-6" />
          </button>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import dayjs from 'dayjs'
import type { ILabResult } from '@/models/Response/LabResponse.model'
import BaseModal from '@/components/Base/BaseModal.vue'

interface Props {
  result: ILabResult
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

// Reactive data
const isOpen = ref(true)

// Watch isOpen to emit close event
watch(isOpen, (newValue) => {
  if (!newValue) {
    emit('close')
  }
})
const selectedImage = ref<string>()

// Methods
function openImageModal(url: string) {
  selectedImage.value = url
}

function closeImageModal() {
  selectedImage.value = undefined
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'CRITICAL': return 'bg-red-600 text-white'
    case 'HIGH': return 'bg-red-100 text-red-800'
    case 'LOW': return 'bg-blue-100 text-blue-800'
    case 'NORMAL': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'CRITICAL': return 'วิกฤต'
    case 'HIGH': return 'สูงกว่าปกติ'
    case 'LOW': return 'ต่ำกว่าปกติ'
    case 'NORMAL': return 'ปกติ'
    default: return 'ไม่ทราบ'
  }
}

function getStatusExplanationClass(status: string): string {
  switch (status) {
    case 'CRITICAL': return 'bg-red-50 border border-red-200'
    case 'HIGH': return 'bg-orange-50 border border-orange-200'
    case 'LOW': return 'bg-blue-50 border border-blue-200'
    case 'NORMAL': return 'bg-green-50 border border-green-200'
    default: return 'bg-gray-50 border border-gray-200'
  }
}

function getStatusTitle(status: string): string {
  switch (status) {
    case 'CRITICAL': return '⚠️ ต้องรีบปรึกษาแพทย์'
    case 'HIGH': return '📈 สูงกว่าปกติ'
    case 'LOW': return '📉 ต่ำกว่าปกติ'
    case 'NORMAL': return '✅ อยู่ในเกณฑ์ปกติ'
    default: return 'ผลการตรวจ'
  }
}

function getStatusExplanation(status: string, type: string): string {
  const lowerType = type.toLowerCase()

  if (lowerType.includes('hba1c')) {
    switch (status) {
      case 'CRITICAL': return 'ค่า HbA1c อยู่ในระดับที่เสี่ยงต่อภาวะแทรกซ้อนสูง ควรปรึกษาแพทย์ทันที'
      case 'HIGH': return 'ค่า HbA1c สูงกว่าเป้าหมาย แสดงว่าการควบคุมน้ำตาลในช่วง 2-3 เดือนที่ผ่านมายังไม่ดีพอ'
      case 'LOW': return 'ค่า HbA1c ต่ำ อาจเสี่ยงต่อภาวะน้ำตาลในเลือดต่ำ'
      case 'NORMAL': return 'ค่า HbA1c อยู่ในเกณฑ์ปกติ แสดงว่าการควบคุมน้ำตาลดี'
    }
  }

  if (lowerType.includes('glucose')) {
    switch (status) {
      case 'CRITICAL': return 'ระดับน้ำตาลในเลือดอยู่ในระดับอันตราย ต้องได้รับการรักษาทันที'
      case 'HIGH': return 'ระดับน้ำตาลในเลือดสูงกว่าปกติ ควรปรับการรับประทานอาหารและออกกำลังกาย'
      case 'LOW': return 'ระดับน้ำตาลในเลือดต่ำ ควรรับประทานอาหารหรือเครื่องดื่มที่มีน้ำตาล'
      case 'NORMAL': return 'ระดับน้ำตาลในเลือดอยู่ในเกณฑ์ปกติ'
    }
  }

  // Default explanations
  switch (status) {
    case 'CRITICAL': return 'ค่าการตรวจอยู่ในระดับที่ต้องรีบปรึกษาแพทย์'
    case 'HIGH': return 'ค่าการตรวจสูงกว่าปกติ ควรติดตามและปรึกษาแพทย์'
    case 'LOW': return 'ค่าการตรวจต่ำกว่าปกติ ควรติดตามและปรึกษาแพทย์'
    case 'NORMAL': return 'ค่าการตรวจอยู่ในเกณฑ์ปกติ'
    default: return ''
  }
}

function getRecommendations(status: string, type: string): string[] {
  const lowerType = type.toLowerCase()
  const recommendations: string[] = []

  if (lowerType.includes('hba1c')) {
    if (status === 'HIGH' || status === 'CRITICAL') {
      recommendations.push(
        'ควบคุมการรับประทานอาหารให้เข้มงวดขึ้น',
        'เพิ่มการออกกำลังกายอย่างสม่ำเสมอ',
        'รับประทานยาตามแพทย์สั่งอย่างเคร่งครัด',
        'ตรวจวัดน้ำตาลในเลือดบ่อยขึ้น'
      )
    } else if (status === 'NORMAL') {
      recommendations.push(
        'รักษาการควบคุมน้ำตาลในระดับปัจจุบัน',
        'ออกกำลังกายสม่ำเสมอ',
        'รับประทานอาหারที่มีประโยชน์'
      )
    }
  }

  if (lowerType.includes('glucose')) {
    if (status === 'HIGH' || status === 'CRITICAL') {
      recommendations.push(
        'หลีกเลี่ยงอาหารที่มีน้ำตาลสูง',
        'ดื่มน้ำเปล่าให้เพียงพอ',
        'ออกกำลังกายเบาๆ หลังอาหาร'
      )
    } else if (status === 'LOW') {
      recommendations.push(
        'รับประทานอาหารหรือเครื่องดื่มที่มีน้ำตาลทันที',
        'หลีกเลี่ยงการงดอาหาร',
        'พกขนมหรือน้ำตาลไว้ติดตัว'
      )
    }
  }

  // General recommendations
  if (status !== 'NORMAL') {
    recommendations.push('ปรึกษาแพทย์เพื่อรับคำแนะนำเพิ่มเติม')
  }

  return recommendations
}

function formatDateTime(dateString: string): string {
  return dayjs(dateString).format('DD/MM/YYYY')
}
</script>