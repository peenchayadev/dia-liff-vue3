<template>
	<div>
		<div class="mb-4 flex items-center align-center">
			<div class="w-[72px] h-[72px] rounded-full bg-white overflow-hidden">
				<MainImage :imageUrl="authStore.user.imageUrl || ''" />
			</div>
			<p class="ml-4 text-[20px]">
				สวัสดีคุณ {{ lineName }}
			</p>
		</div>
		<div>
			<TodaySummaryCard />
		</div>
		<div class="my-6 ml-1">
			<p class="font-bold">
				ค่าระดับน้ำตาลในเลือดวันนี้
			</p>
		</div>
		<div class="mt-4">
			<DailyGlucoseCard />
		</div>
	</div>
</template>

<script setup lang="ts">
import MainImage from '@/components/MainImage.vue'
import { useAuthStore } from '@/stores/Auth'
import { computed } from 'vue'
import TodaySummaryCard from '../components/TodaySummaryCard.vue'
import DailyGlucoseCard from '../components/DailyGlucoseCard.vue'

const authStore = useAuthStore()

const lineName = computed((): string => {
	return authStore.user.displayName || ''
})
</script>

<style scoped></style>
