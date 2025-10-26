<template>
	<div>
		<div class="mb-4 flex items-center align-center">
			<div class="w-[72px] h-[72px] rounded-full bg-white overflow-hidden">
				<MainImage :imageUrl="authStore.user.imageUrl || ''" />
			</div>
			<p class="ml-4 text-[20px]">สวัสดีคุณ {{ lineName }}</p>
		</div>
		<div>
			<TodaySummaryCard :item="items" />
		</div>
		<div class="my-6 ml-1">
			<p class="font-bold">ค่าระดับน้ำตาลในเลือดวันนี้</p>
		</div>
		<div class="w-full my-4">
			<TodayListCard
				:items="today"
				@delete="onDelete($event)"
				@edit="onEdit($event)" />
		</div>
	</div>
		<DeleteModal 
		ref="DeleteModalRef" 
		@confirm="deleteTodayRecord()"/>
		
		<EditGlucoseModal
			:is-open="isEditModalOpen"
			:item="selectedEditItem"
			@close="closeEditModal"
			@confirm="updateTodayRecord" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/Auth'
import { handleLoading } from '@/utils/HandleLoading'
import type { IGlucoseSummary, IGlucoseToday } from '@/models/Response/GlucoseResponse.model'
import GlucoseProvider from '@/resources/provider/Glucose.provider'
import type { IGlucoseProvider } from '@/resources/provider/Glucose.provider'
import MainImage from '@/components/MainImage.vue'
import TodaySummaryCard from '../components/TodaySummaryCard.vue'
import DeleteModal from '@/components/Modal/DeleteModal.vue'
import EditGlucoseModal from '@/components/Modal/EditGlucoseModal.vue'
import TodayListCard from '../components/TodayListCard.vue'

const authStore = useAuthStore()

const GlucoseService: IGlucoseProvider = new GlucoseProvider()

const DeleteModalRef = ref<InstanceType<typeof DeleteModal>>()

const lineName = computed((): string => {
	return authStore.user.displayName || ''
})

const selectedDeleteId = ref<string>('')
const selectedEditItem = ref<IGlucoseToday | null>(null)
const isEditModalOpen = ref<boolean>(false)

const today = ref<IGlucoseToday[]>([])
const items = ref<IGlucoseSummary>()

async function useFetchTodaySummary(): Promise<void> {
	const response = await GlucoseService.getTodaySummary()
	items.value = response.data
}

async function useFetchTodayList(): Promise<void> {
	const response = await GlucoseService.getTodayList()
	today.value = response.data
}

async function useDeleteTodayRecord(): Promise<void> {
	await GlucoseService.deleteTodayRecord(selectedDeleteId.value)
	fetch()
}

async function useUpdateTodayRecord(data: { value: number; period: string; note?: string }): Promise<void> {
	if (selectedEditItem.value) {
		await GlucoseService.updateTodayRecord(selectedEditItem.value.id, data)
		fetch()
	}
}

function deleteTodayRecord (): void {
	useDeleteTodayRecord()
}

function updateTodayRecord(data: { value: number; period: string; note?: string }): void {
	handleLoading(() => useUpdateTodayRecord(data))
	closeEditModal()
}

function fetch(): void {
	handleLoading(useFetchTodaySummary)
	handleLoading(useFetchTodayList)
}

function onDelete(id: string): void {
	selectedDeleteId.value = id
	DeleteModalRef.value?.onOpen()
}

function onEdit(item: IGlucoseToday): void {
	selectedEditItem.value = item
	isEditModalOpen.value = true
}

function closeEditModal(): void {
	isEditModalOpen.value = false
	selectedEditItem.value = null
}

onMounted((): void => {
	fetch()
})
</script>

<style scoped></style>
