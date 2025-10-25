<template>
	<div>
		<Navbar />
		<main class="h-full w-full max-w-[560px] mx-auto p-4 pb-[90px] overflow-y-auto bg-gray-50">
			<RouteTransition />
		</main>
		<MenuNavigation />
	</div>
</template>

<script setup lang="ts">
import MenuNavigation from '@/components/MenuNavigation.vue'
import Navbar from '@/components/Navbar.vue'
import RouteTransition from '@/components/transition/RouteTransition.vue'
</script>

<style scoped>

</style>
