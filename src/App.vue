<template>
	<DefaultLayout
		v-if="pageReady && layoutName === 'default'"
		class="layout-default" />
	<BlankLayout
		v-else-if="pageReady && layoutName === 'blank'"
		class="layout-blank" />
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

const authService : IAuthProvider = new AuthProvider()

const isInit = ref<boolean>(false)
const pageReady = ref<boolean>(false)

const layoutName = computed((): string => {
	const layout = route.meta?.layout as string
	return layout?.toLowerCase() || 'default'
})

async function authLiff (): Promise<void> {
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

<style scoped>
</style>
