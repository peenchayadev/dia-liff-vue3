<template>
	<transition
		name="modal-fade"
		appear>
		<div
			v-if="isOpen"
			class="fixed inset-0 z-50 overflow-y-auto"
			@click="onClose">
			<div class="fixed inset-0 bg-black/50 transition-all duration-300" />
			<div class="flex min-h-full items-center justify-center p-4">
				<div
					class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300"
					@click.stop>
					<div class="p-6">
						<slot name="content" />
					</div>
					
					<!-- Actions Footer -->
					<div 
						v-if="$slots.actions"
						class="flex gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
						<slot name="actions" />
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup lang="ts">

const isOpen = defineModel<boolean>('isOpen', { required: true })

function onClose(): void {
	isOpen.value = false
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
