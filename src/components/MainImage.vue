<template>
	<img
		:src="imageUrl"
		alt="profile-line"
		class="w-full h-full object-cover" />
</template>

<script setup lang="ts">
interface IProp {
	imageUrl: string
}

defineProps<IProp>()
</script>

<style scoped></style>
