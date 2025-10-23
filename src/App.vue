<template>
	<UseTransition>
		<DefaultLayout
			v-if="pageReady && layoutName === 'default'"
			class="layout-default" />
		<BlankLayout
			v-else-if="pageReady && layoutName === 'blank'"
			class="layout-blank" />
	</UseTransition>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { 
	ref,
	computed, 
	onMounted
} from 'vue'
import liff from '@line/liff'
import { 
	initLiff, 
	loginLiff 
} from './plugin/liff.plugin'
import { useAuthStore } from './stores/Auth'
import { handleLoading } from './utils/HandleLoading'
import AuthProvider, { type IAuthProvider } from './resources/provider/Auth.provider'
import BlankLayout from './layouts/BlankLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import UseTransition from './components/transition/UseTransition.vue'

const route = useRoute()

const authStore = useAuthStore()

const authService: IAuthProvider = new AuthProvider()

const pageReady = ref<boolean>(false)

const layoutName = computed((): string => {
	const layout = route.meta?.layout as string
	return layout?.toLowerCase() || 'default'
})

async function authWithLiff(): Promise<void> {
	if (liff.isLoggedIn()) {
		const lineProfile = await liff.getProfile()
		const accessToken = await liff.getIDToken()

		if (!accessToken) {
			await loginLiff()
			return
		}

		try {
			const response = await authService.authLiff({
				accessToken
			})

			authStore.stampLineIdToken(response.data.jwt)
			authStore.userToken.accessToken = response.data.jwt
			authStore.user = {
				id: null,
				uid: response.data.user?.lineUserId,
				imageUrl: lineProfile.pictureUrl || '',
				displayName: lineProfile.displayName
			}
		} catch (error) {
			console.error('Failed to authenticate with Liff:', error)
		}
	} else {
		await loginLiff()
	}
}

async function authLogin(): Promise<void> {
	handleLoading(authWithLiff)
}

async function initializeApp(): Promise<void> {
	await initLiff()

	if (!liff.isLoggedIn()) {
		await loginLiff()

		setTimeout(async () => {
			if (liff.isLoggedIn()) {
				await authLogin()
			}
		}, 1000)
	}
}

function initApp(): void {
	handleLoading(initializeApp)
}

onMounted((): void => {
	pageReady.value = true
	initApp()
})
</script>

<style scoped>
</style>
