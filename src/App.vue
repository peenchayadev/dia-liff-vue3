<template>
	<!-- Loading Screen -->
	<div v-if="!pageReady" class="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
		<div class="text-center">
			<div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
			<p class="text-gray-600">กำลังเข้าสู่ระบบ...</p>
		</div>
	</div>

	<!-- Main App -->
	<DefaultLayout v-else-if="layoutName === 'default'" class="layout-default" />
	<BlankLayout v-else-if="layoutName === 'blank'" class="layout-blank" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted, onUnmounted, ref } from 'vue'

import BlankLayout from './layouts/BlankLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import liff from '@line/liff'
import { initLiff, loginLiff } from './plugin/liff.plugin'
import { useAuthStore } from './stores/Auth'
import AuthProvider, { type IAuthProvider } from './resources/provider/Auth.provider'
import { tokenManager } from './utils/TokenManager'

const route = useRoute()

const authStore = useAuthStore()

const authService: IAuthProvider = new AuthProvider()

const isInit = ref<boolean>(false)
const pageReady = ref<boolean>(false)

const layoutName = computed((): string => {
	const layout = route.meta?.layout as string
	return layout?.toLowerCase() || 'default'
})

async function authLiff(): Promise<void> {
	try {
		if (!liff.isLoggedIn()) {
			console.log('LIFF not logged in, attempting login...')
			await loginLiff()
			return
		}

		console.log('✅ LIFF logged in, getting user profile...')
		const lineProfile = await liff.getProfile()

		if (!lineProfile.userId || !lineProfile.displayName) {
			console.log('❌ Missing LINE profile data, redirecting to login')
			liff.login()
			return
		}

		console.log(`🔍 Got LINE profile: ${lineProfile.userId}`)
		console.log('Attempting to authenticate with LINE profile...')

		const res = await authService.authLiff({
			lineUserId: lineProfile.userId,
			displayName: lineProfile.displayName,
			pictureUrl: lineProfile.pictureUrl
		})

		if (res?.success !== false && res?.data?.jwt) {
			console.log('✅ Authentication successful')
			authStore.stampLineIdToken(res.data.jwt)
			authStore.userToken.accessToken = res.data.jwt
			authStore.user = {
				id: null,
				uid: res.data.user?.lineUserId,
				imageUrl: lineProfile.pictureUrl || '',
				displayName: lineProfile.displayName
			}
		} else {
			console.error('❌ Authentication failed:', res)
			throw new Error('Authentication failed')
		}
	} catch (error: any) {
		console.error('Auth LIFF error:', error)

		// If authentication fails, redirect to login immediately
		if (error.response?.status === 401 || error.message?.includes('expired')) {
			console.log('Authentication failed - redirecting to login')
			liff.login()
		} else {
			// For other errors, also redirect to login
			console.log('Authentication error - redirecting to login')
			liff.login()
		}
	}
}

async function initializeApp(): Promise<void> {
	try {
		await initLiff()

		// Check if we already have a valid JWT token
		if (authStore.userToken.accessToken && authStore.user.uid) {
			console.log('✅ Already authenticated, skipping LIFF auth')
			pageReady.value = true
			tokenManager.startTokenMonitoring()
			return
		}

		if (liff.isLoggedIn()) {
			console.log('✅ LIFF logged in, proceeding with authentication')
			await authLiff()
			// Start token monitoring for our JWT tokens
			tokenManager.startTokenMonitoring()
		} else {
			console.log('🔄 LIFF not logged in, attempting login')
			await loginLiff()
			setTimeout(async () => {
				if (liff.isLoggedIn()) {
					await authLiff()
				}
			}, 1000)
		}
	} catch (error) {
		console.error('App initialization error:', error)
	} finally {
		isInit.value = true
		pageReady.value = true
	}
}

onMounted(async (): Promise<void> => {
	await initializeApp()
})

onUnmounted((): void => {
	// Clean up token monitoring
	tokenManager.stopTokenMonitoring()
})
</script>

<style scoped></style>
