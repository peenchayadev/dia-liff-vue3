import type { ComponentOptions } from 'vue'
import { 
  createMemoryHistory, 
  createRouter, 
  createWebHistory,
  type RouteLocationNormalized, 
  type Router, 
  type RouteRecordRaw 
} from 'vue-router'
import mainRouter from './modules/main.router'
import appointmentRouter from './modules/appointment.router'
import foodRouter from './modules/food.router'

export interface IRouteRedirect {
  name: string
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HomePage',
    component: (): ComponentOptions => import('@/pages/HomePage.vue')
  },
  mainRouter,
  appointmentRouter,
  foodRouter
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

export default router