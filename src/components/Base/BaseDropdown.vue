<template>
  <div class="space-y-2">
    <label 
      v-if="label"
      :for="dropdownId"
      class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative" ref="dropdownRef">
      <!-- Trigger Button -->
      <button
        :id="dropdownId"
        type="button"
        :disabled="disabled"
        :class="triggerClasses"
        @click="toggleDropdown"
        @focus="onFocus"
        @blur="onBlur">
        
        <!-- Selected Value Display -->
        <span class="block truncate text-left">
          {{ displayValue || placeholder }}
        </span>
        
        <!-- Dropdown Icon -->
        <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Icon 
            :icon="isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'" 
            class="w-5 h-5 text-gray-400 transition-transform duration-200" />
        </span>
      </button>
      
      <!-- Dropdown Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0">
        <div
          v-if="isOpen"
          class="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl py-1 text-base ring-1 ring-gray-200 ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          
          <!-- Options -->
          <div
            v-for="option in normalizedOptions"
            :key="option.value"
            :class="getOptionClasses(option)"
            @click="selectOption(option)"
            @mouseenter="hoveredOption = option.value"
            @mouseleave="hoveredOption = null">
            
            <span class="block truncate">{{ option.label }}</span>
            
            <!-- Selected Check -->
            <span 
              v-if="selectedValue === option.value"
              class="absolute inset-y-0 right-0 flex items-center pr-4">
              <Icon icon="mdi:check" class="w-5 h-5 text-blue-600" />
            </span>
          </div>
          
          <!-- Empty State -->
          <div 
            v-if="normalizedOptions.length === 0"
            class="relative cursor-default select-none py-2 px-4 text-gray-500">
            ไม่มีตัวเลือก
          </div>
        </div>
      </Transition>
    </div>
    
    <!-- Helper text or error -->
    <div v-if="helperText || errorMessage" class="text-sm">
      <span 
        v-if="errorMessage"
        class="text-red-600">
        {{ errorMessage }}
      </span>
      <span 
        v-else-if="helperText"
        class="text-gray-500">
        {{ helperText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

interface DropdownOption {
  label: string
  value: string | number
}

interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  options: DropdownOption[] | string[] | Record<string, string>
  disabled?: boolean
  required?: boolean
  helperText?: string
  errorMessage?: string
  variant?: 'default' | 'filled' | 'outlined'
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  disabled: false,
  required: false,
  placeholder: 'เลือกตัวเลือก'
})

const emits = defineEmits<Emits>()

const selectedValue = ref(props.modelValue || '')
const isOpen = ref(false)
const isFocused = ref(false)
const hoveredOption = ref<string | number | null>(null)
const dropdownRef = ref<HTMLElement>()
const dropdownId = `dropdown-${Math.random().toString(36).substring(2, 11)}`

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  selectedValue.value = newValue || ''
}, { immediate: true })

// Normalize options to consistent format
const normalizedOptions = computed((): DropdownOption[] => {
  if (Array.isArray(props.options)) {
    if (props.options.length > 0 && typeof props.options[0] === 'string') {
      return (props.options as string[]).map(option => ({
        label: option,
        value: option
      }))
    }
    return props.options as DropdownOption[]
  } else if (props.options && typeof props.options === 'object') {
    // Handle Record<string, string> format (like GlucoseDailyPeriodsMap)
    return Object.entries(props.options).map(([key, value]) => ({
      label: value,
      value: key
    }))
  }
  
  return []
})

// Display value for selected option
const displayValue = computed(() => {
  if (!selectedValue.value) return ''
  
  const option = normalizedOptions.value.find(opt => opt.value === selectedValue.value)
  return option?.label || selectedValue.value
})

// Computed classes for trigger button
const triggerClasses = computed(() => {
  const baseClasses = [
    'relative w-full cursor-pointer rounded-xl border-0 py-3 pl-4 pr-10 text-left shadow-sm ring-1 ring-inset transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6'
  ]
  
  // Variant styles
  if (props.variant === 'filled') {
    baseClasses.push('bg-gray-50 ring-gray-200 focus:bg-white focus:ring-blue-600')
  } else if (props.variant === 'outlined') {
    baseClasses.push('bg-transparent ring-gray-300 focus:ring-blue-600')
  } else {
    baseClasses.push('bg-white ring-gray-300 focus:ring-blue-600')
  }
  
  // State styles
  if (props.errorMessage) {
    baseClasses.push('ring-red-300 focus:ring-red-600')
  } else if (isFocused.value || isOpen.value) {
    baseClasses.push('ring-blue-600')
  }
  
  if (props.disabled) {
    baseClasses.push('bg-gray-100 text-gray-500 cursor-not-allowed ring-gray-200')
  }
  
  // Placeholder styling
  if (!selectedValue.value) {
    baseClasses.push('text-gray-400')
  } else {
    baseClasses.push('text-gray-900')
  }
  
  return baseClasses.join(' ')
})

// Get option classes
function getOptionClasses(option: DropdownOption): string {
  const baseClasses = [
    'relative cursor-pointer select-none py-2 pl-4 pr-10 transition-colors duration-150'
  ]
  
  if (selectedValue.value === option.value) {
    baseClasses.push('bg-blue-100 text-blue-900')
  } else if (hoveredOption.value === option.value) {
    baseClasses.push('bg-gray-100 text-gray-900')
  } else {
    baseClasses.push('text-gray-900 hover:bg-gray-100')
  }
  
  return baseClasses.join(' ')
}

function toggleDropdown(): void {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

function selectOption(option: DropdownOption): void {
  selectedValue.value = option.value
  emits('update:modelValue', option.value)
  emits('change', option.value)
  isOpen.value = false
}

function onFocus(event: FocusEvent): void {
  isFocused.value = true
  emits('focus', event)
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false
  emits('blur', event)
}

// Close dropdown when clicking outside
function handleClickOutside(event: Event): void {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped></style>