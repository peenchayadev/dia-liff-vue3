<template>
	<div v-if="items.length > 0">
		<div
			class="bg-white rounded-2xl shadow-sm p-4 mb-2"
			v-for="(item, i) in items"
			:key="`${i}-items`">
			<div class="flex justify-between">
				<div class="flex flex-col">
					<p>
						{{ dayjs(item.recordedAt).format('HH:mm') }}
					</p>
					<p>
						{{ formatGlucoseDailyPeriods(item.period) }}
					</p>
				</div>
				<div class="flex flex-col">
					<p>{{ item.value }} mg/dL</p>
					<div class="flex gap-2">
						<p>แก้ไข</p>
						<DeleteButton text  @click="onDelete(item.id)" />
					</div>
				</div>
			</div>
		</div>
	</div>
	<div v-else>
		<div class="text-center py-8">
			<p>ไม่มีข้อมูลค่าระดับน้ำตาลในเลือดวันนี้</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { dayjs } from '@/plugin/dayjs.plugin'
import DeleteButton from '@/components/Button/DeleteButton.vue'
import type { IGlucoseToday } from '@/models/Response/GlucoseResponse.model'
import { formatGlucoseDailyPeriods } from '@/models/Glucose/GlucoseDailyPeriods.enum'

interface IProps {
	items: IGlucoseToday[]
}

interface IEmits {
	(e: 'delete', id: string): void
}

const emits = defineEmits<IEmits>()

defineProps<IProps>()

function onDelete(id: string): void {
	emits('delete', id)
}
</script>

<style scoped></style>
