<template>
  <button
    class="w-full px-4 py-2.5 text-white bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors duration-200 cursor-pointer">
    {{ label }}
  </button>
</template>

<script setup lang="ts">
interface IProps {
  label: string
}

withDefaults(defineProps<IProps>(), {
  label: 'ยืนยัน'
})
</script>

<style scoped>

</style>