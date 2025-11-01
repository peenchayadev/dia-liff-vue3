<template>
  <div class="relative">
    <!-- Tab Container -->
    <div class="relative bg-gray-100 p-1 rounded-2xl overflow-hidden">
      <!-- Animated Background -->
      <div 
        class="absolute top-1 bottom-1 bg-white rounded-xl shadow-sm transition-all duration-300 ease-out"
        :style="backgroundStyle">
      </div>
      
      <!-- Tab Buttons -->
      <div class="relative flex">
        <button
          v-for="(tab, index) in computedTabs"
          :key="tab.value"
          ref="tabRefs"
          @click="selectTab(tab.value, index)"
          :class="[
            'relative flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ease-out',
            'flex items-center justify-center space-x-2',
            selectedValue === tab.value
              ? 'text-gray-900 z-10'
              : 'text-gray-600 hover:text-gray-800'
          ]">
          
          <!-- Tab Icon (optional) -->
          <Icon 
            v-if="tab.icon"
            :icon="tab.icon" 
            class="w-4 h-4" />
          
          <!-- Tab Label -->
          <span>{{ tab.label }}</span>
          
          <!-- Count Badge -->
          <span 
            v-if="tab.count !== undefined"
            :class="[
              'px-2 py-0.5 text-xs rounded-full font-medium transition-all duration-300',
              selectedValue === tab.value
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-200 text-gray-600'
            ]">
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>
    
    <!-- Ripple Effect -->
    <div 
      v-if="rippleStyle"
      class="absolute pointer-events-none bg-blue-200 rounded-full opacity-30 animate-ping"
      :style="rippleStyle">
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

export interface FilterTab {
  label: string
  value: string
  count?: number
  icon?: string
}

interface Props {
  modelValue: string
  tabs?: FilterTab[]
  options?: { label: string; value: string }[]
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const selectedValue = ref(props.modelValue)
const tabRefs = ref<HTMLElement[]>([])
const backgroundStyle = ref({})
const rippleStyle = ref<any>(null)

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  selectedValue.value = newValue
  updateBackgroundPosition()
})

// Watch for tab changes
watch(selectedValue, (newValue) => {
  emits('update:modelValue', newValue)
  emits('change', newValue)
})

// Computed tabs
const computedTabs = computed(() => {
  if (props.tabs) return props.tabs
  if (props.options) return props.options.map(opt => ({ ...opt, count: undefined, icon: undefined }))
  return []
})

// Update background position
async function updateBackgroundPosition(): Promise<void> {
  await nextTick()
  
  const selectedIndex = computedTabs.value.findIndex(tab => tab.value === selectedValue.value)
  if (selectedIndex === -1 || !tabRefs.value[selectedIndex]) return
  
  const selectedTab = tabRefs.value[selectedIndex]
  const container = selectedTab.parentElement
  
  if (!container) return
  
  const containerRect = container.getBoundingClientRect()
  const tabRect = selectedTab.getBoundingClientRect()
  
  const left = tabRect.left - containerRect.left
  const width = tabRect.width
  
  backgroundStyle.value = {
    left: `${left}px`,
    width: `${width}px`
  }
}

// Select tab with animation
async function selectTab(value: string, index: number): Promise<void> {
  // Create ripple effect
  if (tabRefs.value[index]) {
    const tab = tabRefs.value[index]
    const rect = tab.getBoundingClientRect()
    
    rippleStyle.value = {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    }
    
    // Remove ripple after animation
    setTimeout(() => {
      rippleStyle.value = null
    }, 600)
  }
  
  selectedValue.value = value
  await updateBackgroundPosition()
}

// Initialize position
watch(() => [props.tabs, props.options], () => {
  nextTick(() => {
    updateBackgroundPosition()
  })
}, { immediate: true })
</script>

<style scoped>
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ripple 0.6s ease-out;
}
</style>