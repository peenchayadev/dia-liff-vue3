<template>
  <div v-if="appointments.length > 0" class="space-y-3">
    <div v-for="appointment in appointments" :key="appointment.id"
      class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      @click="onViewDetails(appointment)">

      <!-- Status Bar -->
      <div class="h-1 w-full" :class="getStatusBarColor(appointment.status)">
      </div>

      <div class="p-5">
        <div class="flex items-start space-x-4">
          <!-- Appointment Image -->
          <div class="shrink-0">
            <div 
              v-if="appointment.media.length > 0"
              class="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
              <img 
                :src="appointment.media[0]?.url" 
                :alt="appointment.hospitalName || 'นัดหมาย'"
                class="w-full h-full object-cover" />
            </div>
            <div 
              v-else
              class="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
              <Icon icon="mdi:calendar" class="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <!-- Appointment Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <!-- Hospital & Doctor -->
                <h3 class="text-lg font-semibold text-gray-900 truncate">
                  {{ appointment.hospitalName || 'โรงพยาบาล' }}
                </h3>
                <p v-if="appointment.doctorName" class="text-base text-gray-600 truncate">
                  {{ appointment.doctorName }}
                </p>

                <!-- Date & Time -->
                <div class="flex items-center space-x-2 mt-2">
                  <Icon icon="mdi:calendar-outline" class="w-5 h-5 text-gray-400" />
                  <span class="text-base text-gray-600">
                    {{ formatAppointmentDate(appointment.appointmentDate) }}
                  </span>
                </div>

                <div v-if="appointment.startTime" class="flex items-center space-x-2 mt-1">
                  <Icon icon="mdi:clock-outline" class="w-5 h-5 text-gray-400" />
                  <span class="text-base text-gray-600">
                    {{ formatTime(appointment.startTime) }}
                    <span v-if="appointment.endTime">- {{ formatTime(appointment.endTime) }}</span>
                  </span>
                </div>

                <!-- Reason -->
                <p v-if="appointment.reason" class="text-base text-gray-500 mt-2 line-clamp-2">
                  {{ appointment.reason }}
                </p>
              </div>

              <!-- Status Badge & Actions -->
              <div class="flex flex-col items-end space-y-3">

                <div class="flex items-center space-x-2">
                  <button @click.stop="onViewDetails(appointment)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                    <Icon icon="mdi:eye" class="w-5 h-5" />
                  </button>
                  <button @click.stop="onDelete(appointment.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                    <Icon icon="mdi:delete-outline" class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else class="text-center py-12">
    <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
      <Icon icon="mdi:calendar-blank" class="w-10 h-10 text-gray-400" />
    </div>
    <h3 class="text-xl font-medium text-gray-900 mb-2">ยังไม่มีนัดหมาย</h3>
    <p class="text-gray-500 text-base">นัดหมายของคุณจะแสดงที่นี่</p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { dayjs } from '@/plugin/dayjs.plugin'
import type { IAppointment } from '@/models/Response/AppointmentResponse.model'
import { AppointmentStatusEnum } from '@/models/Response/AppointmentResponse.model'

interface Props {
  appointments: IAppointment[]
}

interface Emits {
  (e: 'view-details', appointment: IAppointment): void
  (e: 'delete', id: number): void
}

defineProps<Props>()
const emits = defineEmits<Emits>()

function onViewDetails(appointment: IAppointment): void {
  emits('view-details', appointment)
}

function onDelete(id: number): void {
  emits('delete', id)
}

function getStatusBarColor(status: AppointmentStatusEnum): string {
  switch (status) {
    case AppointmentStatusEnum.TODAY:
      return 'bg-green-500'
    case AppointmentStatusEnum.UPCOMING:
      return 'bg-blue-500'
    case AppointmentStatusEnum.PAST:
      return 'bg-gray-400'
    default:
      return 'bg-gray-300'
  }
}

function getStatusBadgeClass(status: AppointmentStatusEnum): string {
  switch (status) {
    case AppointmentStatusEnum.TODAY:
      return 'bg-green-100 text-green-800'
    case AppointmentStatusEnum.UPCOMING:
      return 'bg-blue-100 text-blue-800'
    case AppointmentStatusEnum.PAST:
      return 'bg-gray-100 text-gray-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

function getStatusText(status: AppointmentStatusEnum): string {
  switch (status) {
    case AppointmentStatusEnum.TODAY:
      return 'วันนี้'
    case AppointmentStatusEnum.UPCOMING:
      return 'กำลังจะถึง'
    case AppointmentStatusEnum.PAST:
      return 'ผ่านไปแล้ว'
    default:
      return 'ไม่ทราบ'
  }
}

function formatAppointmentDate(dateString: string | null): string {
  if (!dateString) return 'ไม่ระบุวันที่'

  const date = dayjs(dateString)
  return date.format('DD/MM/YYYY')
}

function formatTime(timeString: string | null): string {
  if (!timeString) return ''

  // Handle different time formats
  if (timeString.includes(':')) {
    return timeString
  }

  return timeString
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>