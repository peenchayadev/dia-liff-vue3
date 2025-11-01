<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Skeleton Loading State -->
    <div v-if="isLoading">
      <!-- Header Skeleton -->
      <div class="mb-6 animate-pulse">
        <div class="h-8 bg-gray-200 rounded-lg w-40 mb-2"></div>
        <div class="h-5 bg-gray-200 rounded-lg w-64"></div>
      </div>

      <!-- Summary Cards Skeleton -->
      <div class="mb-8">
        <div class="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div class="flex items-center mb-4">
            <div class="w-2 h-6 bg-blue-300 rounded-full mr-3"></div>
            <div class="h-6 bg-gray-200 rounded-lg w-32"></div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="i in 4" :key="i" class="p-4 bg-gray-100 rounded-lg">
              <div class="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart Skeleton -->
      <div class="mb-8">
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100 animate-pulse">
            <div class="flex items-center mb-4">
              <div class="w-2 h-6 bg-blue-300 rounded-full mr-3"></div>
              <div class="h-6 bg-gray-200 rounded-lg w-40"></div>
            </div>
            <div class="flex gap-2">
              <div class="h-10 bg-gray-200 rounded-lg w-20"></div>
              <div class="h-10 bg-gray-200 rounded-lg w-24"></div>
              <div class="h-10 bg-gray-200 rounded-lg w-28"></div>
              <div class="h-10 bg-gray-200 rounded-lg w-24"></div>
            </div>
          </div>
          <div class="p-6 animate-pulse">
            <div class="h-72 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>

      <!-- History List Skeleton -->
      <div class="mb-8">
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100 animate-pulse">
            <div class="flex items-center mb-4">
              <div class="w-2 h-6 bg-purple-300 rounded-full mr-3"></div>
              <div class="h-6 bg-gray-200 rounded-lg w-32"></div>
            </div>
            <div class="flex gap-2">
              <div class="h-10 bg-gray-200 rounded-lg w-20"></div>
              <div class="h-10 bg-gray-200 rounded-lg w-20"></div>
              <div class="h-10 bg-gray-200 rounded-lg w-28"></div>
            </div>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-for="i in 5" :key="i" class="p-4 animate-pulse">
              <div class="flex justify-between items-start">
                <div class="flex-1 space-y-2">
                  <div class="flex items-center gap-3">
                    <div class="w-3 h-3 bg-gray-200 rounded-full"></div>
                    <div class="h-5 bg-gray-200 rounded w-24"></div>
                    <div class="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div class="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div class="h-6 bg-gray-200 rounded-full w-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="animate-fade-in">

      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">ประวัติสุขภาพ</h1>
        <p class="text-gray-600 text-base">ติดตามระดับน้ำตาลในเลือดของคุณ</p>
      </div>

      <!-- Health Summary Cards -->
      <div class="mb-8">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center mb-4">
            <div class="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
            <h2 class="text-xl font-bold text-gray-900">สรุปภาพรวม</h2>
          </div>

          <div v-if="healthSummary" class="grid grid-cols-2 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ healthSummary.totalRecords }}</div>
              <div class="text-sm text-gray-600 mt-1">ครั้งที่บันทึก</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ healthSummary.averageGlucose }}</div>
              <div class="text-sm text-gray-600 mt-1">ค่าเฉลี่ย mg/dL</div>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">{{ healthSummary.weeklyAverage }}</div>
              <div class="text-sm text-gray-600 mt-1">เฉลี่ยสัปดาห์นี้</div>
            </div>
            <div class="text-center p-4 bg-orange-50 rounded-lg">
              <div class="text-2xl font-bold text-orange-600">{{ healthSummary.monthlyAverage }}</div>
              <div class="text-sm text-gray-600 mt-1">เฉลี่ยเดือนนี้</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="mb-8">
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
                <h2 class="text-xl font-bold text-gray-900">กราฟระดับน้ำตาล</h2>
              </div>
            </div>

            <!-- Period Filter -->
            <div class="flex gap-2 overflow-x-auto">
              <button v-for="option in periodOptions" :key="option.value" @click="selectPeriod(option.value)" :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                selectedPeriod === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]">
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- Chart Canvas -->
          <div class="p-6 bg-linear-to-b from-white to-blue-50/30">
            <div v-if="chartData?.summary.count === 0" class="h-72 flex items-center justify-center">
              <div class="text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon icon="mdi:chart-line" class="w-8 h-8 text-gray-400" />
                </div>
                <div class="text-gray-500 text-sm">ไม่มีข้อมูลในช่วงเวลานี้</div>
              </div>
            </div>
            <div v-else class="relative h-72 bg-white rounded-lg p-4 shadow-inner">
              <canvas ref="chartCanvas" class="w-full h-full"></canvas>
            </div>
          </div>

          <!-- Chart Summary -->
          <div v-if="chartData?.summary" class="px-6 pb-6 pt-4 border-t border-gray-100">
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center p-3 bg-gray-50 rounded-lg">
                <div class="text-xs text-gray-500 mb-1">ค่าเฉลี่ย</div>
                <div class="text-xl font-bold text-gray-900">{{ chartData.summary.average }}</div>
                <div class="text-xs text-gray-400 mt-1">mg/dL</div>
              </div>
              <div class="text-center p-3 bg-red-50 rounded-lg">
                <div class="text-xs text-red-600 mb-1">สูงสุด</div>
                <div class="text-xl font-bold text-red-600">{{ chartData.summary.max }}</div>
                <div class="text-xs text-red-400 mt-1">mg/dL</div>
              </div>
              <div class="text-center p-3 bg-blue-50 rounded-lg">
                <div class="text-xs text-blue-600 mb-1">ต่ำสุด</div>
                <div class="text-xl font-bold text-blue-600">{{ chartData.summary.min }}</div>
                <div class="text-xs text-blue-400 mt-1">mg/dL</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- History List -->
      <div class="mb-8">
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="w-2 h-6 bg-purple-500 rounded-full mr-3"></div>
                <h2 class="text-xl font-bold text-gray-900">ประวัติการบันทึก</h2>
              </div>
            </div>

            <!-- History Period Filter -->
            <div class="flex gap-2 overflow-x-auto">
              <button v-for="option in historyPeriodOptions" :key="option.value"
                @click="selectHistoryPeriod(option.value)" :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  selectedHistoryPeriod === option.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]">
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- History Items -->
          <div class="divide-y divide-gray-100">
            <div v-for="item in historyItems" :key="item.id" class="p-4 hover:bg-gray-50 transition-colors">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-1">
                    <div class="w-3 h-3 rounded-full" :class="getStatusColor(item.status)"></div>
                    <span class="font-medium text-gray-900">{{ item.value }} mg/dL</span>
                    <span class="text-sm text-gray-500">{{ getPeriodText(item.period) }}</span>
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ formatDateTime(item.recordedAt) }}
                  </div>
                  <div v-if="item.note" class="text-sm text-gray-500 mt-1">
                    {{ item.note }}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-1 text-xs rounded-full" :class="getStatusBadgeClass(item.status)">
                    {{ getStatusText(item.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Load More -->
          <div v-if="hasMoreHistory" class="p-4 text-center border-t border-gray-100">
            <button @click="loadMoreHistory" :disabled="isLoadingMore"
              class="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 transition-all inline-flex items-center gap-2">
              <div v-if="isLoadingMore" class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>{{ isLoadingMore ? 'กำลังโหลด...' : 'โหลดเพิ่มเติม' }}</span>
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="!historyItems.length" class="p-8 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:chart-line" class="w-8 h-8 text-gray-400" />
            </div>
            <div class="text-gray-500">ยังไม่มีข้อมูลประวัติ</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { Icon } from '@iconify/vue'
import dayjs from 'dayjs'
import HistoryProvider, { type IHistoryProvider } from '@/resources/provider/History.provider'
import type {
  IGlucoseChartData,
  IGlucoseHistoryItem,
  IHealthSummary
} from '@/models/Response/HistoryResponse.model'

Chart.register(...registerables)

// Services
const historyService: IHistoryProvider = new HistoryProvider()

// Reactive data
const isLoading = ref(false)
const isLoadingMore = ref(false)
const chartCanvas = ref<HTMLCanvasElement>()
const chartInstance = ref<Chart>()

// Chart data
const selectedPeriod = ref<'today' | 'yesterday' | 'week' | 'month'>('today')
const chartData = ref<IGlucoseChartData>()

// History data
const selectedHistoryPeriod = ref<'today' | 'yesterday' | 'week' | 'month' | 'all'>('all')
const historyItems = ref<IGlucoseHistoryItem[]>([])
const currentPage = ref(1)
const hasMoreHistory = ref(true)

// Health summary
const healthSummary = ref<IHealthSummary>()

// Options
type PeriodOption = {
  label: string;
  value: 'today' | 'yesterday' | 'week' | 'month';
}

const periodOptions: PeriodOption[] = [
  { label: 'วันนี้', value: 'today' },
  { label: 'เมื่อวาน', value: 'yesterday' },
  { label: 'สัปดาห์นี้', value: 'week' },
  { label: 'เดือนนี้', value: 'month' }
]

const historyPeriodOptions: { label: string; value: 'today' | 'yesterday' | 'week' | 'month' | 'all' }[] = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'วันนี้', value: 'today' },
  { label: 'เมื่อวาน', value: 'yesterday' },
  { label: 'สัปดาห์นี้', value: 'week' },
  { label: 'เดือนนี้', value: 'month' }
]

// Methods
async function loadChartData() {
  try {
    const response = await historyService.getGlucoseChart(selectedPeriod.value)
    if (response.success) {
      chartData.value = response.data
      // renderChart will be called by watch
    }
  } catch (error) {
    console.error('Error loading chart data:', error)
  }
}

async function loadHistoryData(reset = false) {
  try {
    if (reset) {
      currentPage.value = 1
      historyItems.value = []
    }

    const period = selectedHistoryPeriod.value === 'all' ? undefined : selectedHistoryPeriod.value
    const response = await historyService.getGlucoseHistory(currentPage.value, 20, period)

    if (response.success) {
      if (reset) {
        historyItems.value = response.data.items
      } else {
        historyItems.value.push(...response.data.items)
      }

      hasMoreHistory.value = currentPage.value < response.data.pagination.totalPages
    }
  } catch (error) {
    console.error('Error loading history data:', error)
  }
}

async function loadHealthSummary() {
  try {
    const response = await historyService.getHealthSummary()
    if (response.success) {
      healthSummary.value = response.data
    }
  } catch (error) {
    console.error('Error loading health summary:', error)
  }
}

function renderChart() {
  if (!chartCanvas.value || !chartData.value) {
    console.log('Chart canvas or data not ready')
    return
  }

  // Destroy existing chart
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  // Create gradient for the line
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)')
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.01)')

  const datasets = chartData.value.datasets.map(dataset => ({
    ...dataset,
    backgroundColor: gradient,
    borderColor: '#3B82F6',
    borderWidth: 3,
    fill: true,
    tension: 0.4,
    pointRadius: 5,
    pointHoverRadius: 7,
    pointBackgroundColor: '#ffffff',
    pointBorderColor: '#3B82F6',
    pointBorderWidth: 2,
    pointHoverBorderWidth: 3
  }))

  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.value.labels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          displayColors: false,
          callbacks: {
            label: function (context) {
              return context.parsed.y + ' mg/dL'
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(0, 0, 0, 0.06)',
          },
          border: {
            display: false
          },
          ticks: {
            padding: 8,
            font: {
              size: 12
            },
            callback: function (value) {
              return value + ' mg/dL'
            }
          }
        },
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false
          },
          ticks: {
            padding: 8,
            font: {
              size: 11
            }
          }
        }
      }
    }
  })
}

async function selectPeriod(period: 'today' | 'yesterday' | 'week' | 'month') {
  selectedPeriod.value = period
  await loadChartData()
}

async function selectHistoryPeriod(period: 'today' | 'yesterday' | 'week' | 'month' | 'all') {
  selectedHistoryPeriod.value = period
  await loadHistoryData(true)
}

async function loadMoreHistory() {
  if (isLoadingMore.value || !hasMoreHistory.value) return

  isLoadingMore.value = true
  currentPage.value++
  await loadHistoryData(false)
  isLoadingMore.value = false
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'LOW': return 'bg-blue-500'
    case 'HIGH': return 'bg-red-500'
    case 'NORMAL': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'LOW': return 'bg-blue-100 text-blue-800'
    case 'HIGH': return 'bg-red-100 text-red-800'
    case 'NORMAL': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'LOW': return 'ต่ำ'
    case 'HIGH': return 'สูง'
    case 'NORMAL': return 'ปกติ'
    default: return 'ไม่ทราบ'
  }
}

function getPeriodText(period: string): string {
  const periodMap: { [key: string]: string } = {
    'MORNING_BEFORE': 'ก่อนอาหารเช้า',
    'MORNING_AFTER': 'หลังอาหารเช้า',
    'LUNCH_BEFORE': 'ก่อนอาหารกลางวัน',
    'LUNCH_AFTER': 'หลังอาหารกลางวัน',
    'DINNER_BEFORE': 'ก่อนอาหารเย็น',
    'DINNER_AFTER': 'หลังอาหารเย็น',
    'BEDTIME': 'ก่อนนอน'
  }
  return periodMap[period] || period
}

function formatDateTime(dateString: string): string {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm')
}

// Watch for chartData changes and render chart
watch([chartData, chartCanvas], () => {
  if (chartData.value && chartCanvas.value) {
    nextTick(() => {
      renderChart()
    })
  }
}, { deep: true })

// Lifecycle
onMounted(async () => {
  isLoading.value = true

  try {
    await Promise.all([
      loadHealthSummary(),
      loadHistoryData(true),
      loadChartData()
    ])
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>