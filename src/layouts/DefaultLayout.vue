<template>
	<div class="min-h-screen flex flex-col bg-gray-50">
		<Navbar />
		<main class="flex-1 w-full max-w-[560px] mx-auto p-4 pb-[90px] overflow-y-auto">
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