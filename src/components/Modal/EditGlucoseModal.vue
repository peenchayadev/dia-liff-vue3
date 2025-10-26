<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-100">
				<h2 class="text-xl font-semibold text-gray-900">แก้ไขค่าน้ำตาล</h2>
				<button
					@click="onClose"
					class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
					<Icon icon="mdi:close" class="w-5 h-5 text-gray-500" />
				</button>
			</div>

			<!-- Content -->
			<div class="p-6 space-y-6">
				<!-- Glucose Value -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						ค่าระดับน้ำตาล (mg/dL)
					</label>
					<input
						v-model.number="formData.value"
						type="number"
						placeholder="กรอกค่าระดับน้ำตาล"
						class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
						min="1"
						max="999" />
				</div>

				<!-- Period Selection -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						ช่วงเวลา
					</label>
					<select
						v-model="formData.period"
						class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white">
						<option value="">เลือกช่วงเวลา</option>
						<option
							v-for="(label, key) in GlucoseDailyPeriodsMap"
							:key="key"
							:value="key">
							{{ label }}
						</option>
					</select>
				</div>

				<!-- Note -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						หมายเหตุ (ไม่บังคับ)
					</label>
					<textarea
						v-model="formData.note"
						placeholder="เพิ่มหมายเหตุ..."
						rows="3"
						class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"></textarea>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex gap-3 p-6 border-t border-gray-100">
				<button
					@click="onClose"
					class="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors">
					ยกเลิก
				</button>
				<button
					@click="onConfirm"
					:disabled="!isFormValid"
					class="flex-1 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl font-medium transition-colors">
					บันทึก
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { GlucoseDailyPeriodsMap } from '@/models/Glucose/GlucoseDailyPeriods.enum'
import type { IGlucoseToday } from '@/models/Response/GlucoseResponse.model'

interface IProps {
	isOpen: boolean
	item?: IGlucoseToday | null
}

interface IEmits {
	(e: 'close'): void
	(e: 'confirm', data: { value: number; period: string; note?: string }): void
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const formData = reactive({
	value: 0,
	period: '',
	note: ''
})

const isFormValid = computed(() => {
	return formData.value > 0 && formData.period !== ''
})

// Watch for item changes to populate form
watch(() => props.item, (newItem) => {
	if (newItem) {
		formData.value = newItem.value
		formData.period = newItem.period
		formData.note = newItem.note || ''
	}
}, { immediate: true })

// Watch for modal open/close to reset form
watch(() => props.isOpen, (isOpen) => {
	if (!isOpen) {
		// Reset form when modal closes
		setTimeout(() => {
			formData.value = 0
			formData.period = ''
			formData.note = ''
		}, 300)
	}
})

function onClose(): void {
	emits('close')
}

function onConfirm(): void {
	if (isFormValid.value) {
		emits('confirm', {
			value: formData.value,
			period: formData.period,
			note: formData.note || undefined
		})
	}
}
</script>

<style scoped></style>