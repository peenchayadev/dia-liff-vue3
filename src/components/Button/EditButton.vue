<template>
  <button
    v-if="text"
    class="text-blue-500 cursor-pointer hover:text-blue-600">
    แก้ไข
  </button>

  <button
    v-else
    class="w-full px-4 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors duration-200 cursor-pointer">
    แก้ไข
  </button>
</template>

<script setup lang="ts">
interface Props {
  text?: boolean
}

withDefaults(defineProps<Props>(), {
  text: false
})
</script>

<style scoped></style>