<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Skeleton Loading State -->
    <div v-if="isLoading">
      <!-- Header Skeleton -->
      <div class="mb-6 animate-pulse">
        <div class="h-8 bg-gray-200 rounded-lg w-32 mb-2"></div>
        <div class="h-5 bg-gray-200 rounded-lg w-64"></div>
      </div>

      <!-- Filter Skeleton -->
      <div class="mb-8">
        <div class="bg-white rounded-xl shadow-sm p-4 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-32 mb-3"></div>
          <div class="flex gap-2">
            <div class="h-10 bg-gray-200 rounded-lg w-20"></div>
            <div class="h-10 bg-gray-200 rounded-lg w-24"></div>
            <div class="h-10 bg-gray-200 rounded-lg w-28"></div>
            <div class="h-10 bg-gray-200 rounded-lg w-24"></div>
          </div>
        </div>
      </div>

      <!-- Lab Results Skeleton -->
      <div class="mb-8">
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100 animate-pulse">
            <div class="flex items-center">
              <div class="w-2 h-6 bg-pink-300 rounded-full mr-3"></div>
              <div class="h-6 bg-gray-200 rounded-lg w-32"></div>
            </div>
          </div>

          <!-- Result Items Skeleton -->
          <div class="divide-y divide-gray-100">
            <div v-for="i in 3" :key="i" class="p-4 animate-pulse">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div class="flex-1 space-y-3">
                  <div class="flex items-center gap-2">
                    <div class="h-5 bg-gray-200 rounded w-24"></div>
                    <div class="h-5 bg-gray-200 rounded-full w-16"></div>
                  </div>
                  <div class="flex items-baseline gap-2">
                    <div class="h-8 bg-gray-200 rounded w-16"></div>
                    <div class="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div class="h-4 bg-gray-200 rounded w-32"></div>
                  <div class="flex gap-2">
                    <div class="h-10 bg-gray-200 rounded-lg flex-1"></div>
                    <div class="h-10 bg-gray-200 rounded-lg w-20"></div>
                  </div>
                </div>
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
        <h1 class="text-2xl font-bold text-gray-900 mb-2">ผลแลป</h1>
        <p class="text-gray-600 text-base">ติดตามผลการตรวจสุขภาพของคุณ</p>
      </div>

      <!-- Filter Section -->
      <div class="mb-8">
        <div class="bg-white rounded-xl shadow-sm p-4">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-sm font-medium text-gray-700">กรองตามประเภท:</span>
          </div>

          <div class="flex gap-2 overflow-x-auto">
            <button v-for="option in typeOptions" :key="option.value" @click="selectType(option.value)" :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              selectedType === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]">
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <div v-if="selectedType && chartData" class="mb-8">
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <div class="w-2 h-6 bg-purple-500 rounded-full mr-3"></div>
                <h2 class="text-xl font-bold text-gray-900">กราฟแนวโน้ม</h2>
              </div>
            </div>

            <!-- Period Filter -->
            <div class="flex gap-2 overflow-x-auto">
              <button v-for="option in chartPeriodOptions" :key="option.value" @click="selectChartPeriod(option.value)"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  chartPeriod === option.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]">
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- Chart Canvas -->
          <div class="p-6 bg-gradient-to-b from-white to-purple-50/30">
            <div v-if="!chartData?.labels.length" class="h-72 flex items-center justify-center">
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

          <!-- Reference Range -->
          <div v-if="chartData.referenceRange" class="px-6 pb-6 pt-4 border-t border-gray-100">
            <div class="bg-green-50 rounded-lg p-4 text-center">
              <div class="text-sm font-medium text-green-800 mb-1">ค่าปกติ</div>
              <div class="text-lg font-bold text-green-700">
                {{ chartData.referenceRange.min }} - {{ chartData.referenceRange.max }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lab Results List -->
      <div class="mb-8">
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center">
              <div class="w-2 h-6 bg-pink-500 rounded-full mr-3"></div>
              <h2 class="text-xl font-bold text-gray-900">รายการผลแลป</h2>
            </div>
          </div>

          <!-- Results -->
          <div class="divide-y divide-gray-100">
            <div v-for="result in labResults" :key="result.id" class="p-4">
              <div class="flex items-start gap-4">
                <!-- Status Icon -->
                <div class="flex-shrink-0 mt-1">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                    :class="getStatusBgClass(result.status)">
                    <Icon :icon="getStatusIcon(result.status)" class="w-5 h-5 text-white" />
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-semibold text-gray-900">{{ result.type }}</h3>
                    <span class="px-2 py-0.5 text-xs font-medium rounded-full"
                      :class="getStatusBadgeClass(result.status)">
                      {{ getStatusText(result.status) }}
                    </span>
                  </div>

                  <div class="flex items-baseline gap-2 mb-2">
                    <div class="text-2xl font-bold text-gray-900">
                      {{ result.value }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ result.unit }}
                    </div>
                    <div v-if="result.referenceRange" class="text-xs text-gray-400 ml-1">
                      (ปกติ: {{ result.referenceRange }})
                    </div>
                  </div>

                  <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Icon icon="mdi:calendar" class="w-4 h-4" />
                    <span>{{ formatDate(result.testDate) }}</span>
                  </div>

                  <div v-if="result.note" class="text-sm text-gray-500 mb-2">
                    {{ result.note }}
                  </div>

                  <!-- Media Count -->
                  <div v-if="result.media.length > 0" class="flex items-center gap-1 mb-3">
                    <div class="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      <Icon icon="mdi:image" class="w-3.5 h-3.5" />
                      <span>{{ result.media.length }} รูปภาพ</span>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-2">
                    <button @click="openResultDetail(result)"
                      class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <Icon icon="mdi:eye" class="w-4 h-4" />
                      <span>ดูรายละเอียด</span>
                    </button>
                    <button @click="deleteResult(result.id)"
                      class="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                      <Icon icon="mdi:delete" class="w-4 h-4" />
                      <span>ลบ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Load More -->
          <div v-if="hasMore" class="p-4 text-center border-t border-gray-100">
            <button @click="loadMore" :disabled="isLoadingMore"
              class="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 transition-all inline-flex items-center gap-2">
              <div v-if="isLoadingMore"
                class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>{{ isLoadingMore ? 'กำลังโหลด...' : 'โหลดเพิ่มเติม' }}</span>
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="!labResults.length" class="p-12 text-center">
            <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:flask-empty" class="w-10 h-10 text-purple-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">ยังไม่มีผลแลป</h3>
            <p class="text-sm text-gray-500 mb-4">ส่งรูปผลแลปผ่าน LINE Chat เพื่อเริ่มบันทึก</p>
            <div class="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
              <Icon icon="mdi:information" class="w-4 h-4" />
              <span>AI จะวิเคราะห์ผลแลปอัตโนมัติ</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Result Detail Modal -->
    <LabResultModal v-if="selectedResult" :result="selectedResult" @close="closeResultDetail" />

    <!-- Delete Confirmation Modal -->
    <DeleteModal ref="DeleteModalRef" @confirm="confirmDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { Icon } from '@iconify/vue'
import dayjs from 'dayjs'
import LabProvider, { type ILabProvider } from '@/resources/provider/Lab.provider'
import type { ILabResult, ILabChartData } from '@/models/Response/LabResponse.model'
import DeleteModal from '@/components/Modal/DeleteModal.vue'
import LabResultModal from '../components/LabResultModal.vue'

Chart.register(...registerables)

// Services
const labService: ILabProvider = new LabProvider()

// Reactive data
const isLoading = ref(false)
const isLoadingMore = ref(false)
const chartCanvas = ref<HTMLCanvasElement>()
const chartInstance = ref<Chart>()

// Lab results data
const labResults = ref<ILabResult[]>([])
const currentPage = ref(1)
const hasMore = ref(true)
const availableTypes = ref<string[]>([])
const DeleteModalRef = ref<InstanceType<typeof DeleteModal>>()

// Filters
const selectedType = ref<string>('')
const chartPeriod = ref(6)

// Chart data
const chartData = ref<ILabChartData>()

// Modals
const selectedResult = ref<ILabResult>()
const resultToDelete = ref<string>('')

// Options
const typeOptions = ref<{ label: string; value: string }[]>([])

const chartPeriodOptions = [
  { label: '3 เดือน', value: 3 },
  { label: '6 เดือน', value: 6 },
  { label: '1 ปี', value: 12 }
]

// Methods
async function loadLabResults(reset = false) {
  try {
    if (reset) {
      currentPage.value = 1
      labResults.value = []
    }

    const response = await labService.getLabResults(
      currentPage.value,
      10,
      selectedType.value || undefined
    )

    if (response.success) {
      if (reset) {
        labResults.value = response.data.items
        availableTypes.value = response.data.types
        updateTypeOptions()
      } else {
        labResults.value.push(...response.data.items)
      }

      hasMore.value = currentPage.value < response.data.pagination.totalPages
    }
  } catch (error) {
    console.error('Error loading lab results:', error)
  }
}

async function loadChartData() {
  if (!selectedType.value) {
    chartData.value = undefined
    return
  }

  try {
    const response = await labService.getLabChart(selectedType.value, chartPeriod.value)
    if (response.success) {
      chartData.value = response.data
      // renderChart will be called by watch
    }
  } catch (error) {
    console.error('Error loading chart data:', error)
  }
}

function updateTypeOptions() {
  typeOptions.value = [
    { label: 'ทั้งหมด', value: '' },
    ...availableTypes.value.map(type => ({ label: type, value: type }))
  ]
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

  // Create gradient for the main line
  const gradient = ctx.createLinearGradient(0, 0, 0, 400)
  gradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)')
  gradient.addColorStop(1, 'rgba(147, 51, 234, 0.01)')

  const mainDataset = {
    ...chartData.value.datasets[0],
    backgroundColor: gradient as any,
    borderColor: '#9333EA',
    borderWidth: 3,
    fill: true,
    tension: 0.4,
    pointRadius: 5,
    pointHoverRadius: 7,
    pointBackgroundColor: '#ffffff',
    pointBorderColor: '#9333EA',
    pointBorderWidth: 2,
    pointHoverBorderWidth: 3
  }

  const datasets: any[] = [mainDataset]

  // Add reference range lines if available
  if (chartData.value.referenceRange) {
    const { min, max } = chartData.value.referenceRange
    const labels = chartData.value.labels

    datasets.push({
      label: 'ค่าต่ำสุดปกติ',
      data: new Array(labels.length).fill(min),
      borderColor: 'rgba(34, 197, 94, 0.6)',
      backgroundColor: 'transparent',
      borderDash: [5, 5],
      borderWidth: 2,
      tension: 0,
      pointRadius: 0,
      pointHoverRadius: 0
    })

    datasets.push({
      label: 'ค่าสูงสุดปกติ',
      data: new Array(labels.length).fill(max),
      borderColor: 'rgba(239, 68, 68, 0.6)',
      backgroundColor: 'transparent',
      borderDash: [5, 5],
      borderWidth: 2,
      tension: 0,
      pointRadius: 0,
      pointHoverRadius: 0
    })
  }

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
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12
            }
          }
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
          displayColors: true
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(0, 0, 0, 0.06)'
          },
          border: {
            display: false
          },
          ticks: {
            padding: 8,
            font: {
              size: 12
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          border: {
            display: false
          },
          ticks: {
            padding: 8,
            font: {
              size: 11
            },
            maxRotation: 45,
            minRotation: 0,
            autoSkip: true,
            autoSkipPadding: 15
          }
        }
      }
    }
  }) as any
}

async function selectType(type: string) {
  selectedType.value = type
  await Promise.all([
    loadLabResults(true),
    loadChartData()
  ])
}

async function selectChartPeriod(period: number) {
  chartPeriod.value = period
  await loadChartData()
}

async function loadMore() {
  if (isLoadingMore.value || !hasMore.value) return

  isLoadingMore.value = true
  currentPage.value++
  await loadLabResults(false)
  isLoadingMore.value = false
}

function openResultDetail(result: ILabResult) {
  selectedResult.value = result
}

function closeResultDetail() {
  selectedResult.value = undefined
}

function deleteResult(id: string) {
  resultToDelete.value = id
  DeleteModalRef.value?.onOpen()
}

async function confirmDelete() {
  try {
    await labService.deleteLabResult(resultToDelete.value)

    // Reload data to update types and pagination
    await loadLabResults(true)

    // Reload chart if type is selected
    if (selectedType.value) {
      await loadChartData()
    }

    resultToDelete.value = ''
  } catch (error) {
    console.error('Error deleting lab result:', error)
  }
}

// Utility functions
function getStatusBgClass(status: string): string {
  switch (status) {
    case 'CRITICAL': return 'bg-red-600'
    case 'HIGH': return 'bg-orange-500'
    case 'LOW': return 'bg-blue-500'
    case 'NORMAL': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'CRITICAL': return 'bg-red-600 text-white'
    case 'HIGH': return 'bg-orange-100 text-orange-800'
    case 'LOW': return 'bg-blue-100 text-blue-800'
    case 'NORMAL': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getStatusIcon(status: string): string {
  switch (status) {
    case 'CRITICAL': return 'mdi:alert-circle'
    case 'HIGH': return 'mdi:arrow-up-circle'
    case 'LOW': return 'mdi:arrow-down-circle'
    case 'NORMAL': return 'mdi:check-circle'
    default: return 'mdi:help-circle'
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'CRITICAL': return 'วิกฤต'
    case 'HIGH': return 'สูง'
    case 'LOW': return 'ต่ำ'
    case 'NORMAL': return 'ปกติ'
    default: return 'ไม่ทราบ'
  }
}

function formatDate(dateString: string): string {
  return dayjs(dateString).format('DD/MM/YYYY')
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
    await loadLabResults(true)

    // Load chart if type is selected
    if (selectedType.value) {
      await loadChartData()
    }
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

  0%,
  100% {
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