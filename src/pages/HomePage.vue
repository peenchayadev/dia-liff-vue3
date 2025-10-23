<template>
  <div/>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { 
  useRouter, 
  type Router 
} from 'vue-router'

const router : Router = useRouter()

onMounted((): void => {
  router.replace({ name: 'Main' })
})
</script>

<style scoped>
</style>