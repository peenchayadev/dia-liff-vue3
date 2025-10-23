<template>
  <router-view v-slot="{ Component }">
    <UseTransition>
      <slot :component="Component">
        <component
          :is="Component"
          ref="componentRef"
          v-bind="{
            ...componentProps,
            ...$attrs
          }" />
      </slot>
    </UseTransition>
  </router-view>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import UseTransition from './UseTransition.vue'

interface IProps {
  componentProps?: Record<string, unknown>
}

defineProps<IProps>()

const componentRef = useTemplateRef('componentRef')

defineExpose({ componentRef })
</script>

<style scoped>

</style>
