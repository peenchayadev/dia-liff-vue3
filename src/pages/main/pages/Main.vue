<template>
	<div>
		<!-- Loading State -->
		<div v-if="isLoading" class="flex items-center justify-center py-12">
			<div class="text-center">
				<div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
				<p class="text-gray-600">กำลังโหลดข้อมูล...</p>
			</div>
		</div>
		
		<!-- Error State -->
		<div v-else-if="hasError" class="text-center py-12">
			<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Icon icon="mdi:alert-circle" class="w-8 h-8 text-red-600" />
			</div>
			<h3 class="text-lg font-medium text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
			<p class="text-gray-600 mb-4">
				{{ !authStore.userToken.accessToken ? 'กรุณาเข้าสู่ระบบใหม่' : 'ไม่สามารถโหลดข้อมูลได้' }}
			</p>
			<button 
				@click="handleRetry"
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
				{{ !authStore.userToken.accessToken ? 'เข้าสู่ระบบ' : 'ลองใหม่' }}
			</button>
		</div>
		
		<!-- Main Content -->
		<div v-else>
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
		
		<!-- Modals -->
		<DeleteModal 
			ref="DeleteModalRef" 
			@confirm="deleteTodayRecord()"/>
		
		<EditGlucoseModal
			:is-open="isEditModalOpen"
			:item="selectedEditItem"
			@close="closeEditModal"
			@confirm="updateTodayRecord" />
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onActivated, onDeactivated, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
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
const isLoading = ref<boolean>(false)
const hasError = ref<boolean>(false)

async function useFetchTodaySummary(): Promise<void> {
	try {
		console.log('📊 Fetching today summary...')
		const response = await GlucoseService.getTodaySummary()
		items.value = response.data
		console.log('✅ Today summary fetched:', response.data)
	} catch (error) {
		console.error('❌ Error fetching today summary:', error)
	}
}

async function useFetchTodayList(): Promise<void> {
	try {
		console.log('📋 Fetching today list...')
		const response = await GlucoseService.getTodayList()
		today.value = response.data
		console.log('✅ Today list fetched:', response.data)
	} catch (error) {
		console.error('❌ Error fetching today list:', error)
	}
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

async function fetch(): Promise<void> {
	// Check if user is authenticated
	if (!authStore.userToken.accessToken) {
		console.log('❌ No access token available, skipping fetch')
		hasError.value = true
		return
	}

	isLoading.value = true
	hasError.value = false
	
	try {
		console.log('🔄 Starting data fetch...')
		await Promise.all([
			useFetchTodaySummary(),
			useFetchTodayList()
		])
		console.log('✅ All data fetched successfully')
	} catch (error) {
		console.error('❌ Error in fetch:', error)
		hasError.value = true
	} finally {
		isLoading.value = false
	}
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

function handleRetry(): void {
	if (!authStore.userToken.accessToken) {
		// Redirect to login or refresh auth
		console.log('🔄 No token, need to re-authenticate')
		window.location.reload()
	} else {
		fetch()
	}
}

onMounted((): void => {
	console.log('🔄 Main page mounted')
	console.log('👤 Auth store user:', authStore.user)
	console.log('🔑 Auth store token:', authStore.userToken.accessToken ? 'Present' : 'Missing')
	fetch()
})

onActivated((): void => {
	console.log('🔄 Main page activated')
	console.log('👤 Auth store user:', authStore.user)
	console.log('🔑 Auth store token:', authStore.userToken.accessToken ? 'Present' : 'Missing')
	
	// Only fetch if we don't have data or if there's an error
	if (!items.value || !today.value.length || hasError.value) {
		console.log('📊 No data or error state, fetching...')
		fetch()
	} else {
		console.log('✅ Data already available, skipping fetch')
	}
})

onDeactivated((): void => {
	console.log('⏸️ Main page deactivated')
})

// Watch for auth changes
watch(() => authStore.userToken.accessToken, (newToken) => {
	console.log('🔑 Auth token changed:', newToken ? 'Present' : 'Missing')
	if (newToken) {
		console.log('✅ Token available, fetching data')
		fetch()
	}
})
</script>

<style scoped></style>
