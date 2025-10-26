<template>
  <button
  class="w-full px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200 cursor-pointer">
    {{ label }}
  </button>
</template>

<script setup lang="ts">
interface IProps {
  label?: string
}

withDefaults(defineProps<IProps>(), {
  label: 'ยกเลิก'
})
</script>

<style scoped>

</style>