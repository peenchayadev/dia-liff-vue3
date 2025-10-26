<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="onClick">
    
    <!-- Loading spinner -->
    <Icon 
      v-if="loading"
      icon="mdi:loading" 
      class="w-5 h-5 animate-spin" />
    
    <!-- Left icon -->
    <Icon 
      v-else-if="iconLeft && !loading"
      :icon="iconLeft" 
      class="w-5 h-5" />
    
    <!-- Button text -->
    <span v-if="$slots.default || text">
      <slot>{{ text }}</slot>
    </span>
    
    <!-- Right icon -->
    <Icon 
      v-if="iconRight && !loading"
      :icon="iconRight" 
      class="w-5 h-5" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  text?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  iconLeft?: string
  iconRight?: string
  fullWidth?: boolean
  rounded?: boolean
}

interface Emits {
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  rounded: false
})

const emits = defineEmits<Emits>()

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
  ]
  
  // Size classes
  if (props.size === 'sm') {
    baseClasses.push('px-3 py-2 text-sm gap-2')
  } else if (props.size === 'lg') {
    baseClasses.push('px-6 py-4 text-lg gap-3')
  } else {
    baseClasses.push('px-4 py-3 text-base gap-2')
  }
  
  // Border radius
  if (props.rounded) {
    baseClasses.push('rounded-full')
  } else {
    baseClasses.push('rounded-xl')
  }
  
  // Width
  if (props.fullWidth) {
    baseClasses.push('w-full')
  }
  
  // Variant styles
  if (props.variant === 'primary') {
    baseClasses.push('bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm')
  } else if (props.variant === 'secondary') {
    baseClasses.push('bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm')
  } else if (props.variant === 'outline') {
    baseClasses.push('border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 shadow-sm')
  } else if (props.variant === 'ghost') {
    baseClasses.push('text-gray-700 hover:bg-gray-100 focus:ring-gray-500')
  } else if (props.variant === 'danger') {
    baseClasses.push('bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm')
  }
  
  return baseClasses.join(' ')
})

function onClick(event: MouseEvent): void {
  if (!props.disabled && !props.loading) {
    emits('click', event)
  }
}
</script>

<style scoped></style>