<template>
  <div class="space-y-2">
    <label v-if="label" :for="selectId" class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <div class="relative">
      <select :id="selectId" v-model="selectedValue" :disabled="disabled" :class="selectClasses" @change="onChange"
        @focus="onFocus" @blur="onBlur">
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>
        <option v-for="option in normalizedOptions" :key="getOptionValue(option)" :value="getOptionValue(option)">
          {{ getOptionLabel(option) }}
        </option>
      </select>

      <!-- Dropdown icon -->
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <Icon icon="mdi:chevron-down" class="w-5 h-5 text-gray-400" />
      </div>
    </div>

    <!-- Helper text or error -->
    <div v-if="helperText || errorMessage" class="text-sm">
      <span v-if="errorMessage" class="text-red-600">
        {{ errorMessage }}
      </span>
      <span v-else-if="helperText" class="text-gray-500">
        {{ helperText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

interface SelectOption {
  label: string
  value: string | number
}

interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  options: SelectOption[] | string[] | Record<string, string>
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
  required: false
})

const emits = defineEmits<Emits>()

const selectedValue = ref(props.modelValue || '')
const isFocused = ref(false)
const selectId = `select-${Math.random().toString(36).substring(2, 11)}`

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  selectedValue.value = newValue || ''
}, { immediate: true })

// Normalize options to consistent format
const normalizedOptions = computed((): SelectOption[] => {
  if (Array.isArray(props.options)) {
    if (props.options.length > 0 && typeof props.options[0] === 'string') {
      return (props.options as string[]).map(option => ({
        label: option,
        value: option
      }))
    }
    return props.options as SelectOption[]
  } else if (props.options && typeof props.options === 'object') {
    // Handle Record<string, string> format (like GlucoseDailyPeriodsMap)
    return Object.entries(props.options).map(([key, value]) => ({
      label: value,
      value: key
    }))
  }

  return []
})

// Computed classes
const selectClasses = computed(() => {
  const baseClasses = [
    'block w-full rounded-xl border-0 py-3 pl-4 pr-10 text-gray-900 shadow-sm ring-1 ring-inset transition-all duration-200 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 appearance-none cursor-pointer'
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
  } else if (isFocused.value) {
    baseClasses.push('ring-blue-600')
  }

  if (props.disabled) {
    baseClasses.push('bg-gray-100 text-gray-500 cursor-not-allowed ring-gray-200')
  }

  return baseClasses.join(' ')
})

function getOptionValue(option: SelectOption): string | number {
  return option.value
}

function getOptionLabel(option: SelectOption): string {
  return option.label
}

function onChange(event: Event): void {
  const target = event.target as HTMLSelectElement
  const value = target.value
  selectedValue.value = value
  emits('update:modelValue', value)
  emits('change', value)
}

function onFocus(event: FocusEvent): void {
  isFocused.value = true
  emits('focus', event)
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false
  emits('blur', event)
}
</script>

<style scoped></style>