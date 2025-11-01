<template>
	<div class="fixed bottom-0 left-0 right-0 mx-auto bg-white border-t border-gray-200 w-full z-20">
		<div class="flex justify-around items-center h-[70px] px-2 relative">
			<router-link
				v-for="(item, i) in menu"
				:key="`menu-item-${i}`"
				:to="item.to"
				class="flex flex-col items-center transition-all duration-300 transform min-w-0 flex-1"
				:class="[
          isActive(item.to.name) 
          ? 'text-sky-500 scale-105' 
          : 'text-gray-400 hover:text-sky-500 hover:scale-105']">
				<Icon
					:icon="item.icon"
					class="text-[20px] mb-1" />
				<p class="text-[10px] text-center leading-tight">
          {{ item.name }}
        </p>
			</router-link>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import type { IMenu } from '@/models/Global.model'

const route = useRoute()

const menu = ref<IMenu[]>([
	{ name: 'หน้าแรก', to: { name: 'Main' }, icon: 'lucide:house' },
	{ name: 'นัดหมาย', to: { name: 'Appointment' }, icon: 'lucide:calendar' },
	{ name: 'อาหาร', to: { name: 'Food' }, icon: 'lucide:utensils' },
	{ name: 'ประวัติ', to: { name: 'History' }, icon: 'lucide:chart-column-increasing' },
	{ name: 'ผลแลป', to: { name: 'Lab' }, icon: 'lucide:flask-conical' }
])

const isActive = computed(
	() =>
		(routeName: string): boolean =>
			route.name === routeName
)
</script>

<style scoped></style>
