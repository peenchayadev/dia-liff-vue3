<template>
  <div v-if="foodAnalyses && foodAnalyses.length > 0" class="space-y-3">
    <div v-for="foodAnalysis in props.foodAnalyses" :key="foodAnalysis.id"
      class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      @click="onViewDetails(foodAnalysis)">

      <!-- Status Bar -->
      <div class="h-1 w-full bg-orange-500"></div>

      <div class="p-5">
        <div class="flex items-start space-x-4">
          <!-- Food Image -->
          <div class="shrink-0">
            <div 
              v-if="foodAnalysis.media && foodAnalysis.media.length > 0"
              class="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
              <img 
                :src="foodAnalysis.media[0]?.url" 
                :alt="foodAnalysis.foodName || 'อาหาร'"
                class="w-full h-full object-cover" />
            </div>
            <div 
              v-else
              class="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
              <Icon icon="mdi:food" class="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <!-- Food Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <!-- Food Name -->
                <h3 class="text-lg font-semibold text-gray-900 truncate">
                  {{ foodAnalysis.foodName || 'ไม่ระบุชื่ออาหาร' }}
                </h3>

                <!-- Nutritional Info -->
                <div v-if="foodAnalysis.carbsGram || foodAnalysis.sugarGram" class="mt-2 space-y-1">
                  <div v-if="foodAnalysis.carbsGram" class="flex items-center space-x-2">
                    <Icon icon="mdi:grain" class="w-5 h-5 text-amber-500" />
                    <span class="text-base text-gray-600">
                      คาร์โบไฮเดรต: {{ foodAnalysis.carbsGram }} กรัม
                    </span>
                  </div>

                  <div v-if="foodAnalysis.sugarGram" class="flex items-center space-x-2">
                    <Icon icon="mdi:cube-outline" class="w-5 h-5 text-red-500" />
                    <span class="text-base text-gray-600">
                      น้ำตาล: {{ foodAnalysis.sugarGram }} กรัม
                    </span>
                  </div>
                </div>

                <!-- Advice Preview -->
                <p v-if="foodAnalysis.advice" class="text-base text-gray-500 mt-2 line-clamp-2">
                  {{ foodAnalysis.advice }}
                </p>
              </div>

              <!-- Actions -->
              <div class="flex flex-col items-end space-y-3">
                <span class="text-sm px-3 py-1.5 rounded-full font-medium bg-orange-100 text-orange-700">
                  วิเคราะห์แล้ว
                </span>

                <div class="flex items-center space-x-2">
                  <button @click.stop="onViewDetails(foodAnalysis)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                    <Icon icon="mdi:eye" class="w-5 h-5" />
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
      <Icon icon="mdi:food-apple" class="w-10 h-10 text-gray-400" />
    </div>
    <h3 class="text-xl font-medium text-gray-900 mb-2">ยังไม่มีการวิเคราะห์อาหาร</h3>
    <p class="text-gray-500 text-base">ส่งรูปอาหารผ่าน LINE เพื่อให้ AI วิเคราะห์</p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { IFoodAnalysis } from '@/models/Response/FoodResponse.model'

interface Props {
  foodAnalyses: IFoodAnalysis[]
}

interface Emits {
  (e: 'view-details', foodAnalysis: IFoodAnalysis): void
}

const props = withDefaults(defineProps<Props>(), {
  foodAnalyses: () => []
})
const emits = defineEmits<Emits>()

function onViewDetails(foodAnalysis: IFoodAnalysis): void {
  emits('view-details', foodAnalysis)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}
</style>