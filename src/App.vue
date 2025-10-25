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
			await loginLiff()
			return
		}

		const lineProfile = await liff.getProfile()
		const accessToken = await liff.getIDToken()
		
		if (!accessToken) {
			liff.login()
			return
		}

		const res = await authService.authLiff({
			accessToken: accessToken
		})
		
		authStore.stampLineIdToken(res.data.jwt)
		authStore.userToken.accessToken = res.data.jwt
		authStore.user = {
			id: null,
			uid: res.data.user?.lineUserId,
			imageUrl: lineProfile.pictureUrl || '',
			displayName: lineProfile.displayName
		}
	} catch (error: any) {
		console.error('Auth LIFF error:', error)
		}
	}

async function initializeApp(): Promise<void> {
	try {
		await initLiff()
		if (liff.isLoggedIn()) {
			await authLiff()
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
