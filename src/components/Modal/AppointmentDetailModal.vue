<template>
  <BaseModal v-model:is-open="modalOpen">
    <template #content>
      <div v-if="appointment">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="getStatusHeaderClass(appointment.status)">
              <Icon icon="mdi:calendar-check" class="w-5 h-5" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">รายละเอียดนัดหมาย</h2>
              <p class="text-sm text-gray-500">{{ getStatusText(appointment.status) }}</p>
            </div>
          </div>
          <button
            @click="onClose"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <Icon icon="mdi:close" class="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <!-- Appointment Images -->
        <div v-if="appointment.media.length > 0" class="mb-6">
          <h3 class="text-sm font-medium text-gray-700 mb-3">ภาพนัดหมาย</h3>
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="media in appointment.media"
              :key="media.id"
              class="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
              @click="openImageViewer(media.url)">
              <img 
                :src="media.url" 
                :alt="appointment.hospitalName || 'นัดหมาย'"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-200" />
            </div>
          </div>
        </div>

        <!-- Appointment Details -->
        <div class="space-y-4">
          <!-- Hospital & Doctor -->
          <div v-if="appointment.hospitalName" class="flex items-start space-x-3">
            <Icon icon="mdi:hospital-building" class="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-gray-700">โรงพยาบาล</p>
              <p class="text-gray-900">{{ appointment.hospitalName }}</p>
            </div>
          </div>

          <div v-if="appointment.doctorName" class="flex items-start space-x-3">
            <Icon icon="mdi:doctor" class="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-gray-700">แพทย์</p>
              <p class="text-gray-900">{{ appointment.doctorName }}</p>
            </div>
          </div>

          <!-- Date & Time -->
          <div v-if="appointment.appointmentDate" class="flex items-start space-x-3">
            <Icon icon="mdi:calendar-outline" class="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-gray-700">วันที่นัด</p>
              <p class="text-gray-900">{{ formatAppointmentDate(appointment.appointmentDate) }}</p>
            </div>
          </div>

          <div v-if="appointment.startTime" class="flex items-start space-x-3">
            <Icon icon="mdi:clock-outline" class="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-gray-700">เวลา</p>
              <p class="text-gray-900">
                {{ formatTime(appointment.startTime) }}
                <span v-if="appointment.endTime">- {{ formatTime(appointment.endTime) }}</span>
              </p>
            </div>
          </div>

          <!-- Patient Info -->
          <div v-if="appointment.fullName" class="flex items-start space-x-3">
            <Icon icon="mdi:account-outline" class="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-gray-700">ชื่อผู้ป่วย</p>
              <p class="text-gray-900">
                {{ appointment.fullName }}
                <span v-if="appointment.age" class="text-gray-500">(อายุ {{ appointment.age }} ปี)</span>
              </p>
            </div>
          </div>

          <!-- Reason -->
          <div v-if="appointment.reason" class="flex items-start space-x-3">
            <Icon icon="mdi:clipboard-text-outline" class="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-gray-700">เหตุผลการนัด</p>
              <p class="text-gray-900">{{ appointment.reason }}</p>
            </div>
          </div>

          <!-- Details -->
          <div v-if="appointment.details" class="flex items-start space-x-3">
            <Icon icon="mdi:note-text-outline" class="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-gray-700">รายละเอียดเพิ่มเติม</p>
              <p class="text-gray-900 whitespace-pre-wrap">{{ appointment.details }}</p>
            </div>
          </div>

          <!-- Created Date -->
          <div class="flex items-start space-x-3 pt-4 border-t border-gray-100">
            <Icon icon="mdi:calendar-plus" class="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-gray-700">วันที่บันทึก</p>
              <p class="text-gray-500 text-sm">{{ formatCreatedDate(appointment.createdAt) }}</p>
            </div>
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
      <BaseButton
        variant="danger"
        size="md"
        full-width
        @click="onDelete">
        ลบนัดหมาย
      </BaseButton>
    </template>
  </BaseModal>

  <!-- Image Viewer Modal -->
  <div
    v-if="imageViewerOpen"
    class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4"
    @click="closeImageViewer">
    <div class="relative max-w-4xl max-h-full">
      <img 
        :src="currentImage" 
        alt="ภาพนัดหมาย"
        class="max-w-full max-h-full object-contain rounded-lg" />
      <button
        @click="closeImageViewer"
        class="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors">
        <Icon icon="mdi:close" class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { dayjs } from '@/plugin/dayjs.plugin'
import { BaseModal, BaseButton } from '@/components/Base'
import type { IAppointment } from '@/models/Response/AppointmentResponse.model'
import { AppointmentStatusEnum } from '@/models/Response/AppointmentResponse.model'

interface Props {
  isOpen: boolean
  appointment?: IAppointment | null
}

interface Emits {
  (e: 'close'): void
  (e: 'delete'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const modalOpen = ref(props.isOpen)
const imageViewerOpen = ref(false)
const currentImage = ref('')

// Watch for isOpen prop changes
watch(() => props.isOpen, (newValue) => {
  modalOpen.value = newValue
})

// Watch for modal close
watch(modalOpen, (newValue) => {
  if (!newValue) {
    emits('close')
  }
})

function onClose(): void {
  modalOpen.value = false
}

function onDelete(): void {
  emits('delete')
}

function openImageViewer(imageUrl: string): void {
  currentImage.value = imageUrl
  imageViewerOpen.value = true
}

function closeImageViewer(): void {
  imageViewerOpen.value = false
  currentImage.value = ''
}

function getStatusHeaderClass(status: AppointmentStatusEnum): string {
  switch (status) {
    case AppointmentStatusEnum.TODAY:
      return 'bg-green-100 text-green-600'
    case AppointmentStatusEnum.UPCOMING:
      return 'bg-blue-100 text-blue-600'
    case AppointmentStatusEnum.PAST:
      return 'bg-gray-100 text-gray-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

function getStatusText(status: AppointmentStatusEnum): string {
  switch (status) {
    case AppointmentStatusEnum.TODAY:
      return 'นัดหมายวันนี้'
    case AppointmentStatusEnum.UPCOMING:
      return 'นัดหมายที่กำลังจะถึง'
    case AppointmentStatusEnum.PAST:
      return 'นัดหมายที่ผ่านไปแล้ว'
    default:
      return 'นัดหมาย'
  }
}

function formatAppointmentDate(dateString: string | null): string {
  if (!dateString) return 'ไม่ระบุวันที่'
  
  const date = dayjs(dateString)
  return date.format('วันdddd ที่ DD MMMM YYYY')
}

function formatTime(timeString: string | null): string {
  if (!timeString) return ''
  return timeString
}

function formatCreatedDate(dateString: string): string {
  const date = dayjs(dateString)
  return date.format('DD/MM/YYYY เวลา HH:mm น.')
}
</script>

<style scoped></style>