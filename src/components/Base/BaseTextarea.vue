<template>
  <div class="space-y-2">
    <label 
      v-if="label"
      :for="textareaId"
      class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <textarea
        :id="textareaId"
        v-model="textValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        :maxlength="maxLength"
        :class="textareaClasses"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"></textarea>
      
      <!-- Character count -->
      <div 
        v-if="maxLength && showCharCount"
        class="absolute bottom-2 right-3 text-xs text-gray-400">
        {{ textValue.length }}/{{ maxLength }}
      </div>
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

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  rows?: number
  maxLength?: number
  showCharCount?: boolean
  helperText?: string
  errorMessage?: string
  variant?: 'default' | 'filled' | 'outlined'
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'input', event: Event): void
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  variant: 'default',
  resize: 'vertical',
  showCharCount: false,
  disabled: false,
  readonly: false,
  required: false
})

const emits = defineEmits<Emits>()

const textValue = ref(props.modelValue || '')
const isFocused = ref(false)
const textareaId = `textarea-${Math.random().toString(36).substring(2, 11)}`

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  textValue.value = newValue || ''
})

// Computed classes
const textareaClasses = computed(() => {
  const baseClasses = [
    'block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6'
  ]
  
  // Resize behavior
  if (props.resize === 'none') {
    baseClasses.push('resize-none')
  } else if (props.resize === 'vertical') {
    baseClasses.push('resize-y')
  } else if (props.resize === 'horizontal') {
    baseClasses.push('resize-x')
  } else {
    baseClasses.push('resize')
  }
  
  // Add padding for character count
  if (props.maxLength && props.showCharCount) {
    baseClasses.push('pb-8')
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
  const target = event.target as HTMLTextAreaElement
  textValue.value = target.value
  emits('update:modelValue', target.value)
  emits('input', event)
}
</script>

<style scoped></style>