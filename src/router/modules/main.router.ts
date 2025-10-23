import type { ComponentOptions } from 'vue'

export default {
	path: '/main',
	name: 'MainPage',
	component: (): ComponentOptions => import('@/pages/main/MainPage.vue'),
	children: [
		{
			path: '',
			name: 'Main',
			component: (): ComponentOptions => import('@/pages/main/pages/Main.vue')
		}
	]
}
