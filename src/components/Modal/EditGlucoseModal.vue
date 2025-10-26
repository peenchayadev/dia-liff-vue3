<template>
	<BaseModal v-model:is-open="modalOpen">
		<template #content>
			<!-- Header -->
			<div class="flex items-center justify-between mb-6">
				<div class="flex items-center space-x-3">
					<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
						<Icon icon="mdi:pencil" class="w-5 h-5 text-blue-600" />
					</div>
					<div>
						<h2 class="text-xl font-semibold text-gray-900">แก้ไขค่าน้ำตาล</h2>
						<p class="text-sm text-gray-500">ปรับปรุงข้อมูลระดับน้ำตาลในเลือด</p>
					</div>
				</div>
				<button
					@click="onClose"
					class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
					<Icon icon="mdi:close" class="w-5 h-5 text-gray-400" />
				</button>
			</div>

			<!-- Form Content -->
			<div class="space-y-6">
				<!-- Glucose Value -->
				<BaseTextField
					v-model="formData.value"
					label="ค่าระดับน้ำตาล (mg/dL)"
					type="number"
					placeholder="กรอกค่าระดับน้ำตาล"
					icon="mdi:water-outline"
					:min="1"
					:max="999"
					required
					:error-message="valueError"
					helper-text="ค่าปกติ: 80-180 mg/dL" />

				<!-- Period Selection -->
				<BaseDropdown
					v-model="formData.period"
					label="ช่วงเวลาการวัด"
					placeholder="เลือกช่วงเวลา"
					:options="GlucoseDailyPeriodsMap"
					required
					:error-message="periodError"
					helper-text="เลือกช่วงเวลาที่ทำการวัด" />

				<!-- Note -->
				<BaseTextarea
					v-model="formData.note"
					label="หมายเหตุ"
					placeholder="เพิ่มหมายเหตุเพิ่มเติม (ไม่บังคับ)"
					:rows="3"
					:max-length="200"
					show-char-count
					helper-text="บันทึกข้อมูลเพิ่มเติม เช่น อาการ หรือสิ่งที่สังเกตเห็น" />
			</div>
		</template>

		<template #actions>
			<BaseButton
				variant="outline"
				size="md"
				full-width
				@click="onClose">
				ยกเลิก
			</BaseButton>
			<BaseButton
				variant="primary"
				size="md"
				full-width
				:disabled="!isFormValid"
				:loading="isSubmitting"
				@click="onConfirm">
				บันทึกการแก้ไข
			</BaseButton>
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { BaseModal, BaseTextField, BaseTextarea, BaseButton } from '@/components/Base'
import BaseDropdown from '@/components/Base/BaseDropdown.vue'
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

const modalOpen = ref(props.isOpen)
const isSubmitting = ref(false)

const formData = reactive({
	value: 0,
	period: '',
	note: ''
})

// Watch for isOpen prop changes
watch(() => props.isOpen, (newValue) => {
	modalOpen.value = newValue
})

// Watch for modal close
watch(modalOpen, (newValue) => {
	if (!newValue) {
		emits('close')
	}
})

// Form validation
const isFormValid = computed(() => {
	return formData.value > 0 && formData.value <= 999 && formData.period !== ''
})

// Error messages
const valueError = computed(() => {
	if (formData.value <= 0) return 'กรุณากรอกค่าระดับน้ำตาล'
	if (formData.value > 999) return 'ค่าระดับน้ำตาลสูงเกินไป'
	return ''
})

const periodError = computed(() => {
	if (!formData.period) return 'กรุณาเลือกช่วงเวลา'
	return ''
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
			isSubmitting.value = false
		}, 300)
	}
})

function onClose(): void {
	modalOpen.value = false
}

async function onConfirm(): Promise<void> {
	if (isFormValid.value && !isSubmitting.value) {
		isSubmitting.value = true
		
		try {
			emits('confirm', {
				value: Number(formData.value),
				period: formData.period,
				note: formData.note || undefined
			})
		} finally {
			isSubmitting.value = false
		}
	}
}
</script>

<style scoped></style>