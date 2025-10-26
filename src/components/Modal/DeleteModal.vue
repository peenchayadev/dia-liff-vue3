<template>
	<BaseModal v-model:is-open="isOpen">
		<template #content>
			<div class="flex items-center justify-center mb-4">
				<div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
					<Icon
						icon="lucide:trash-2"
						class="w-6 h-6 text-red-600" />
				</div>
			</div>

			<h3 class="text-lg font-semibold text-gray-900 text-center mb-2">ยืนยันการลบ</h3>

			<p class="text-gray-600 text-center mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้? <br>การดำเนินการนี้ไม่สามารถยกเลิกได้</p>
		</template>
		<template #actions>
			<SecondaryButton @click="onClose()" />
			<DeleteButton
				@click="onConfirm()" />
		</template>
	</BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import DeleteButton from '../Button/DeleteButton.vue'
import SecondaryButton from '../Button/SecondaryButton.vue'
import BaseModal from '@/components/Base/BaseModal.vue'

interface IEmits {
	confirm: []
}

interface IExpose {
	onOpen: () => void
	onClose: () => void
}

const emit = defineEmits<IEmits>()

const isOpen = ref<boolean>(false)

defineExpose<IExpose>({
	onOpen,
	onClose
})

function onOpen(): void {
	isOpen.value = true
}

function onClose(): void {
	isOpen.value = false
}

function onConfirm(): void {
	emit('confirm')
	onClose()
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
	transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative {
	transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
	opacity: 0;
}

.modal-fade-enter-from .relative,
.modal-fade-leave-to .relative {
	transform: scale(0.95) translateY(-10px);
}

.modal-fade-enter-to,
.modal-fade-leave-from {
	opacity: 1;
}

.modal-fade-enter-to .relative,
.modal-fade-leave-from .relative {
	transform: scale(1) translateY(0);
}
</style>
