<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 text-base">กำลังโหลดข้อมูลนัดหมาย...</p>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="hasError" class="text-center py-12">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon icon="mdi:alert-circle" class="w-8 h-8 text-red-600" />
      </div>
      <h3 class="text-xl font-medium text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
      <p class="text-gray-600 mb-4 text-base">ไม่สามารถโหลดข้อมูลนัดหมายได้</p>
      <button 
        @click="fetchData"
        class="px-6 py-3 bg-blue-600 text-white text-base rounded-lg hover:bg-blue-700 transition-colors">
        ลองใหม่
      </button>
    </div>
    
    <!-- Main Content -->
    <div v-else>
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">นัดหมายแพทย์</h1>
        <p class="text-gray-600 text-base">จัดการนัดหมายและดูรายละเอียดการนัด</p>
      </div>
      
      <!-- Summary Card -->
      <div class="mb-8">
        <AppointmentSummaryCard :summary="summary" />
      </div>
      
      <!-- Today's Appointments -->
      <div v-if="todayAppointments.length > 0" class="mb-8">
        <div class="flex items-center mb-4">
          <div class="w-2 h-6 bg-green-500 rounded-full mr-3"></div>
          <h2 class="text-xl font-bold text-gray-900">วันนี้</h2>
          <span class="ml-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            {{ todayAppointments.length }} นัด
          </span>
        </div>
        <AppointmentListCard
          :appointments="todayAppointments"
          @view-details="onViewDetails"
          @delete="onDelete" />
      </div>
      
      <!-- Upcoming Appointments -->
      <div v-if="upcomingAppointments.length > 0" class="mb-8">
        <div class="flex items-center mb-4">
          <div class="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
          <h2 class="text-xl font-bold text-gray-900">กำลังจะถึง</h2>
          <span class="ml-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            {{ upcomingAppointments.length }} นัด
          </span>
        </div>
        <AppointmentListCard
          :appointments="upcomingAppointments"
          @view-details="onViewDetails"
          @delete="onDelete" />
      </div>
      
      <!-- Past Appointments -->
      <div v-if="pastAppointments.length > 0" class="mb-8">
        <div class="flex items-center mb-4">
          <div class="w-2 h-6 bg-gray-400 rounded-full mr-3"></div>
          <h2 class="text-xl font-bold text-gray-900">ผ่านไปแล้ว</h2>
          <span class="ml-2 px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
            {{ pastAppointments.length }} นัด
          </span>
        </div>
        <AppointmentListCard
          :appointments="pastAppointments"
          @view-details="onViewDetails"
          @delete="onDelete" />
      </div>
      
      <!-- Empty State -->
      <div v-if="appointments.length === 0" class="text-center py-12">
        <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon icon="mdi:calendar-blank" class="w-10 h-10 text-gray-400" />
        </div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">ยังไม่มีนัดหมาย</h3>
        <p class="text-gray-500 text-base">นัดหมายของคุณจะแสดงที่นี่</p>
      </div>
    </div>
    
    <!-- Delete Modal -->
    <DeleteModal 
      ref="DeleteModalRef" 
      @confirm="deleteAppointment" />
    
    <!-- Appointment Detail Modal -->
    <AppointmentDetailModal
      :is-open="isDetailModalOpen"
      :appointment="selectedAppointment"
      @close="closeDetailModal"
      @delete="onDeleteFromDetail" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onActivated, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/Auth'
import AppointmentProvider from '@/resources/provider/Appointment.provider'
import type { IAppointmentProvider } from '@/resources/provider/Appointment.provider'
import type { IAppointment, IAppointmentSummary } from '@/models/Response/AppointmentResponse.model'
import { AppointmentStatusEnum } from '@/models/Response/AppointmentResponse.model'
import AppointmentSummaryCard from '../components/AppointmentSummaryCard.vue'
import AppointmentListCard from '../components/AppointmentListCard.vue'
import DeleteModal from '@/components/Modal/DeleteModal.vue'
import AppointmentDetailModal from '@/components/Modal/AppointmentDetailModal.vue'

const authStore = useAuthStore()
const appointmentService: IAppointmentProvider = new AppointmentProvider()

const DeleteModalRef = ref<InstanceType<typeof DeleteModal>>()

// State
const appointments = ref<IAppointment[]>([])
const summary = ref<IAppointmentSummary | null>(null)
const isLoading = ref<boolean>(false)
const hasError = ref<boolean>(false)
const selectedDeleteId = ref<number | null>(null)
const selectedAppointment = ref<IAppointment | null>(null)
const isDetailModalOpen = ref<boolean>(false)

// Computed appointments by status
const todayAppointments = computed(() => 
  appointments.value.filter(appointment => appointment.status === AppointmentStatusEnum.TODAY)
)

const upcomingAppointments = computed(() => 
  appointments.value.filter(appointment => appointment.status === AppointmentStatusEnum.UPCOMING)
)

const pastAppointments = computed(() => 
  appointments.value.filter(appointment => appointment.status === AppointmentStatusEnum.PAST)
)

// Fetch data functions
async function fetchAppointments(): Promise<void> {
  try {
    console.log('📅 Fetching appointments...')
    const response = await appointmentService.getAppointments()
    appointments.value = response.data
    console.log('✅ Appointments fetched:', response.data)
  } catch (error) {
    console.error('❌ Error fetching appointments:', error)
    throw error
  }
}

async function fetchSummary(): Promise<void> {
  try {
    console.log('📊 Fetching appointment summary...')
    const response = await appointmentService.getAppointmentSummary()
    summary.value = response.data
    console.log('✅ Summary fetched:', response.data)
  } catch (error) {
    console.error('❌ Error fetching summary:', error)
    throw error
  }
}

async function fetchData(): Promise<void> {
  // Check if user is authenticated
  if (!authStore.userToken.accessToken) {
    console.log('❌ No access token available, skipping fetch')
    hasError.value = true
    return
  }

  isLoading.value = true
  hasError.value = false
  
  try {
    console.log('🔄 Starting appointment data fetch...')
    await Promise.all([
      fetchAppointments(),
      fetchSummary()
    ])
    console.log('✅ All appointment data fetched successfully')
  } catch (error) {
    console.error('❌ Error in fetchData:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

// Event handlers
function onViewDetails(appointment: IAppointment): void {
  selectedAppointment.value = appointment
  isDetailModalOpen.value = true
}

function onDelete(id: number): void {
  selectedDeleteId.value = id
  DeleteModalRef.value?.onOpen()
}

function onDeleteFromDetail(): void {
  if (selectedAppointment.value) {
    selectedDeleteId.value = selectedAppointment.value.id
    closeDetailModal()
    DeleteModalRef.value?.onOpen()
  }
}

async function deleteAppointment(): Promise<void> {
  if (selectedDeleteId.value) {
    try {
      await appointmentService.deleteAppointment(selectedDeleteId.value)
      console.log('✅ Appointment deleted successfully')
      fetchData() // Refresh data
    } catch (error) {
      console.error('❌ Error deleting appointment:', error)
    }
  }
}

function closeDetailModal(): void {
  isDetailModalOpen.value = false
  selectedAppointment.value = null
}

// Lifecycle
onMounted((): void => {
  console.log('🔄 Appointment page mounted')
  fetchData()
})

onActivated((): void => {
  console.log('🔄 Appointment page activated')
  fetchData()
})

// Watch for auth changes
watch(() => authStore.userToken.accessToken, (newToken) => {
  console.log('🔑 Auth token changed in appointment page:', newToken ? 'Present' : 'Missing')
  if (newToken) {
    fetchData()
  }
})
</script>

<style scoped></style>