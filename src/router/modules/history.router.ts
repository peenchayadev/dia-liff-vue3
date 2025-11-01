import type { ComponentOptions } from 'vue'

export default {
  path: '/history',
  name: 'HistoryPage',
  component: (): ComponentOptions => import('@/pages/history/HistoryPage.vue'),
  children: [
    {
      path: '',
      name: 'History',
      component: (): ComponentOptions => import('@/pages/history/pages/History.vue')
    }
  ]
}
