<template>
  <div class="space-y-2">
    <label 
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="inputId"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :min="min"
        :max="max"
        :step="step"
        :class="inputClasses"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput" />
      
      <!-- Icon -->
      <div 
        v-if="icon"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon :icon="icon" class="w-5 h-5 text-gray-400" />
      </div>
      
      <!-- Clear button -->
      <button
        v-if="clearable && inputValue && !disabled && !readonly"
        type="button"
        @click="clearInput"
        class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <Icon icon="mdi:close-circle" class="w-5 h-5 text-gray-400 hover:text-gray-600" />
      </button>
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
import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: 'text' | 'number' | 'email' | 'password' | 'tel'
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  icon?: string
  clearable?: boolean
  helperText?: string
  errorMessage?: string
  min?: number | string
  max?: number | string
  step?: number | string
  variant?: 'default' | 'filled' | 'outlined'
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'input', event: Event): void
  (e: 'clear'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  variant: 'default',
  clearable: false,
  disabled: false,
  readonly: false,
  required: false
})

const emits = defineEmits<Emits>()

const inputValue = ref(props.modelValue || '')
const isFocused = ref(false)
const inputId = `input-${Math.random().toString(36).substring(2, 11)}`

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue || ''
})

// Computed classes
const inputClasses = computed(() => {
  const baseClasses = [
    'block w-full rounded-xl border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6'
  ]
  
  // Add padding for icon
  if (props.icon) {
    baseClasses.push('pl-10')
  } else {
    baseClasses.push('px-4')
  }
  
  // Add padding for clear button
  if (props.clearable && inputValue.value && !props.disabled && !props.readonly) {
    baseClasses.push('pr-10')
  } else if (!props.icon) {
    baseClasses.push('pr-4')
  }
  
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
  
  if (props.readonly) {
    baseClasses.push('bg-gray-50 cursor-default')
  }
  
  return baseClasses.join(' ')
})

function onFocus(event: FocusEvent): void {
  isFocused.value = true
  emits('focus', event)
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false
  emits('blur', event)
}

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  inputValue.value = value
  emits('update:modelValue', value)
  emits('input', event)
}

function clearInput(): void {
  inputValue.value = ''
  emits('update:modelValue', '')
  emits('clear')
}
</script>

<style scoped></style>