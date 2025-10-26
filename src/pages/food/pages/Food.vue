<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 text-base">กำลังโหลดข้อมูลอาหาร...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="text-center py-12">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon icon="mdi:alert-circle" class="w-8 h-8 text-red-600" />
      </div>
      <h3 class="text-xl font-medium text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
      <p class="text-gray-600 mb-4 text-base">ไม่สามารถโหลดข้อมูลอาหารได้</p>
      <button @click="fetchData"
        class="px-6 py-3 bg-blue-600 text-white text-base rounded-lg hover:bg-blue-700 transition-colors">
        ลองใหม่
      </button>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">วิเคราะห์อาหาร</h1>
        <p class="text-gray-600 text-base">ดูผลการวิเคราะห์อาหารจาก AI</p>
      </div>

      <!-- Summary Card -->
      <div class="mb-8">
        <FoodSummaryCard :summary="summary" />
      </div>

      <!-- Food Analyses List -->
      <div v-if="foodAnalyses && foodAnalyses.length > 0" class="mb-8">
        <div class="flex items-center mb-4">
          <div class="w-2 h-6 bg-orange-500 rounded-full mr-3"></div>
          <h2 class="text-xl font-bold text-gray-900">รายการวิเคราะห์อาหาร</h2>
          <span class="ml-2 px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
            {{ foodAnalyses?.length || 0 }} รายการ
          </span>
        </div>
        <FoodListCard :food-analyses="foodAnalyses || []" @view-details="onViewDetails" />
      </div>

      <!-- Empty State -->
      <div v-if="!foodAnalyses || foodAnalyses.length === 0" class="text-center py-12">
        <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon icon="mdi:food-apple" class="w-10 h-10 text-gray-400" />
        </div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">ยังไม่มีการวิเคราะห์อาหาร</h3>
        <p class="text-gray-500 text-base">ส่งรูปอาหารผ่าน LINE เพื่อให้ AI วิเคราะห์</p>
      </div>
    </div>

    <!-- Food Detail Modal -->
    <FoodDetailModal :is-open="isDetailModalOpen" :food-analysis="selectedFoodAnalysis" @close="closeDetailModal" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onActivated, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '@/stores/Auth'
import FoodProvider from '@/resources/provider/Food.provider'
import type { IFoodProvider } from '@/resources/provider/Food.provider'
import type { IFoodAnalysis, IFoodSummary } from '@/models/Response/FoodResponse.model'
import FoodDetailModal from '@/components/Modal/FoodDetailModal.vue'
import FoodListCard from '../components/FoodListCard.vue'
import FoodSummaryCard from '../components/FoodSummaryCard.vue'

const authStore = useAuthStore()
const foodService: IFoodProvider = new FoodProvider()

// State
const foodAnalyses = ref<IFoodAnalysis[]>([])
const summary = ref<IFoodSummary | null>(null)
const isLoading = ref<boolean>(false)
const hasError = ref<boolean>(false)
const selectedFoodAnalysis = ref<IFoodAnalysis | null>(null)
const isDetailModalOpen = ref<boolean>(false)

// Fetch data functions
async function fetchFoodAnalyses(): Promise<void> {
  try {
    console.log('🍎 Fetching food analyses...')
    const response = await foodService.getFoodAnalyses()
    foodAnalyses.value = response.data || []
    console.log('✅ Food analyses fetched:', response.data)
  } catch (error) {
    console.error('❌ Error fetching food analyses:', error)
    foodAnalyses.value = []
    throw error
  }
}

async function fetchSummary(): Promise<void> {
  try {
    console.log('📊 Fetching food summary...')
    const response = await foodService.getFoodSummary()
    summary.value = response.data || { total: 0, today: 0, thisWeek: 0 }
    console.log('✅ Food summary fetched:', response.data)
  } catch (error) {
    console.error('❌ Error fetching food summary:', error)
    summary.value = { total: 0, today: 0, thisWeek: 0 }
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
    console.log('🔄 Starting food data fetch...')
    await Promise.all([fetchFoodAnalyses(), fetchSummary()])
    console.log('✅ All food data fetched successfully')
  } catch (error) {
    console.error('❌ Error in fetchData:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

// Event handlers
function onViewDetails(foodAnalysis: IFoodAnalysis): void {
  console.log('🔍 Opening food detail modal with:', foodAnalysis)
  selectedFoodAnalysis.value = foodAnalysis
  isDetailModalOpen.value = true
}

function closeDetailModal(): void {
  isDetailModalOpen.value = false
  selectedFoodAnalysis.value = null
}

// Lifecycle
onMounted((): void => {
  console.log('🔄 Food page mounted')
  fetchData()
})

onActivated((): void => {
  console.log('🔄 Food page activated')
  fetchData()
})

// Watch for auth changes
watch(
  () => authStore.userToken.accessToken,
  (newToken) => {
    console.log('🔑 Auth token changed in food page:', newToken ? 'Present' : 'Missing')
    if (newToken) {
      fetchData()
    }
  }
)
</script>

<style scoped></style>
