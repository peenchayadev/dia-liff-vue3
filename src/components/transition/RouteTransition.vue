<template>
	<router-view v-slot="{ Component }">
		<slot :component="Component">
			<component :is="Component" />
		</slot>
	</router-view>
</template>

<script setup lang="ts">
interface IProps {
	componentProps?: Record<string, unknown>
}

defineProps<IProps>()
</script>

<style scoped></style>
