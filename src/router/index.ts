import type { ComponentOptions } from 'vue'
import { 
  createMemoryHistory, 
  createRouter, 
  createWebHistory,
  type RouteLocationNormalized, 
  type Router, 
  type RouteRecordRaw 
} from 'vue-router'

export interface IRouteRedirect {
  name: string
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HomePage',
    component: (): ComponentOptions => import('@/pages/HomePage.vue')
  },
]

export const routerConfig = {
  history: import.meta.env.VITEST ? createMemoryHistory() : createWebHistory(),
  routes
}

const router: Router = createRouter(routerConfig)

const DEFAULT_TITLE: string = 'Dia-Liff'

router.afterEach((to: RouteLocationNormalized): void => {
  document.title = to?.meta?.title ? `${DEFAULT_TITLE} | ${to.meta.title}` : DEFAULT_TITLE
})

// router.beforeEach((
//   to: RouteLocationNormalized,
//   _from: RouteLocationNormalized,
//   next: NavigationGuardNext): void => {
//   const userStore = useAuthStore()
//   const userToken: string = userStore?.userToken?.accessToken
//   if (to?.meta?.auth && !userToken) {
//     router.replace({ name: 'LoginPage' })
//     return
//   }
//   next()
// })

export default router