<template>
  <button
    v-if="text"
    class="text-red-500 cursor-pointer hover:text-red-600">
    ลบ
  </button>

  <button
    v-else
    class="w-full px-4 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors duration-200 cursor-pointer">
    ลบ
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
