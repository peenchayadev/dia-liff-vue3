<template>
	<div v-if="items.length > 0" class="space-y-3">
		<div
			v-for="(item, i) in items"
			:key="`${i}-items`"
			class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
			
			<!-- Status Bar -->
			<div 
				class="h-1 w-full"
				:class="getStatusBarColor(item.status)">
			</div>
			
			<div class="p-5">
				<div class="flex items-center justify-between">
					<!-- Left Side - Time & Period -->
					<div class="flex items-center space-x-4">
						<div class="flex flex-col">
							<div class="flex items-center space-x-2">
								<Icon 
									icon="mdi:clock-outline" 
									class="w-4 h-4 text-gray-400" />
								<span class="text-lg font-semibold text-gray-900">
									{{ dayjs(item.recordedAt).format('HH:mm') }}
								</span>
							</div>
							<span class="text-sm text-gray-500 mt-1">
								{{ formatGlucoseDailyPeriods(item.period) }}
							</span>
						</div>
					</div>

					<!-- Right Side - Value & Actions -->
					<div class="flex items-center space-x-4">
						<!-- Glucose Value -->
						<div class="text-right">
							<div class="flex items-center space-x-2">
								<span 
									class="text-2xl font-bold"
									:class="getValueColor(item.status)">
									{{ item.value }}
								</span>
								<span class="text-sm text-gray-500">mg/dL</span>
							</div>
							<div class="flex items-center justify-end mt-1">
								<span 
									class="text-xs px-2 py-1 rounded-full font-medium"
									:class="getStatusBadgeClass(item.status)">
									{{ getStatusText(item.status) }}
								</span>
							</div>
						</div>

						<!-- Actions -->
						<div class="flex items-center space-x-2">
							<button
								@click="onEdit(item)"
								class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
								<Icon icon="mdi:pencil" class="w-5 h-5" />
							</button>
							<button
								@click="onDelete(item.id)"
								class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
								<Icon icon="mdi:delete-outline" class="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>

				<!-- Note (if exists) -->
				<div v-if="item.note" class="mt-4 pt-4 border-t border-gray-100">
					<div class="flex items-start space-x-2">
						<Icon icon="mdi:note-text-outline" class="w-4 h-4 text-gray-400 mt-0.5" />
						<span class="text-sm text-gray-600">{{ item.note }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Empty State -->
	<div v-else class="text-center py-12">
		<div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
			<Icon icon="mdi:chart-line" class="w-8 h-8 text-gray-400" />
		</div>
		<h3 class="text-lg font-medium text-gray-900 mb-2">ยังไม่มีข้อมูลวันนี้</h3>
		<p class="text-gray-500">เริ่มบันทึกค่าระดับน้ำตาลในเลือดของคุณ</p>
	</div>
</template>

<script setup lang="ts">
import { dayjs } from '@/plugin/dayjs.plugin'
import { Icon } from '@iconify/vue'
import type { IGlucoseToday } from '@/models/Response/GlucoseResponse.model'
import { formatGlucoseDailyPeriods } from '@/models/Glucose/GlucoseDailyPeriods.enum'
import { GlucoseStatusEnum } from '@/models/Glucose/GlucoseStatus.enum'

interface IProps {
	items: IGlucoseToday[]
}

interface IEmits {
	(e: 'delete', id: string): void
	(e: 'edit', item: IGlucoseToday): void
}

const emits = defineEmits<IEmits>()

defineProps<IProps>()

function onDelete(id: string): void {
	emits('delete', id)
}

function onEdit(item: IGlucoseToday): void {
	emits('edit', item)
}

function getStatusBarColor(status: GlucoseStatusEnum): string {
	switch (status) {
		case GlucoseStatusEnum.LOW:
			return 'bg-blue-500'
		case GlucoseStatusEnum.NORMAL:
			return 'bg-green-500'
		case GlucoseStatusEnum.HIGH:
			return 'bg-red-500'
		default:
			return 'bg-gray-300'
	}
}

function getValueColor(status: GlucoseStatusEnum): string {
	switch (status) {
		case GlucoseStatusEnum.LOW:
			return 'text-blue-600'
		case GlucoseStatusEnum.NORMAL:
			return 'text-green-600'
		case GlucoseStatusEnum.HIGH:
			return 'text-red-600'
		default:
			return 'text-gray-600'
	}
}

function getStatusBadgeClass(status: GlucoseStatusEnum): string {
	switch (status) {
		case GlucoseStatusEnum.LOW:
			return 'bg-blue-100 text-blue-800'
		case GlucoseStatusEnum.NORMAL:
			return 'bg-green-100 text-green-800'
		case GlucoseStatusEnum.HIGH:
			return 'bg-red-100 text-red-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
}

function getStatusText(status: GlucoseStatusEnum): string {
	switch (status) {
		case GlucoseStatusEnum.LOW:
			return 'ต่ำ'
		case GlucoseStatusEnum.NORMAL:
			return 'ปกติ'
		case GlucoseStatusEnum.HIGH:
			return 'สูง'
		default:
			return 'ไม่ทราบ'
	}
}
</script>

<style scoped></style>
