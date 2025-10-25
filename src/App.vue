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
import { computed, onMounted, ref } from 'vue'

import BlankLayout from './layouts/BlankLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import liff from '@line/liff'
import { initLiff, loginLiff } from './plugin/liff.plugin'
import { useAuthStore } from './stores/Auth'
import AuthProvider, { type IAuthProvider } from './resources/provider/Auth.provider'

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

		const lineProfile = await liff.getProfile()
		const accessToken = liff.getIDToken()
		
		if (!accessToken) {
			console.log('No LINE ID token available, redirecting to login')
			liff.login()
			return
		}

		console.log('Attempting to authenticate with LINE ID token...')
		const res = await authService.authLiff({
			accessToken: accessToken
		})
		
		if (res?.success !== false && res?.data?.jwt) {
			console.log('Authentication successful')
			authStore.stampLineIdToken(res.data.jwt)
			authStore.userToken.accessToken = res.data.jwt
			authStore.user = {
				id: null,
				uid: res.data.user?.lineUserId,
				imageUrl: lineProfile.pictureUrl || '',
				displayName: lineProfile.displayName
			}
		} else {
			console.error('Authentication failed:', res)
			throw new Error('Authentication failed')
		}
	} catch (error: any) {
		console.error('Auth LIFF error:', error)
		
		// If authentication fails, try to login again
		if (error.response?.status === 401 || error.message?.includes('expired')) {
			console.log('Token expired, redirecting to login...')
			liff.login()
		}
	}
}

async function initializeApp(): Promise<void> {
	try {
		await initLiff()
		if (liff.isLoggedIn()) {
			await authLiff()
			// Set up periodic token check (every 10 minutes)
			setInterval(async () => {
				try {
					const { refreshTokenIfNeeded } = await import('./plugin/liff.plugin')
					const refreshed = await refreshTokenIfNeeded()
					if (refreshed) {
						console.log('Token refreshed automatically')
						await authLiff()
					}
				} catch (error) {
					console.error('Auto refresh failed:', error)
				}
			}, 10 * 60 * 1000) // 10 minutes
		} else {
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
</script>

<style scoped>
</style>
