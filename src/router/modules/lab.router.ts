import type { ComponentOptions } from 'vue'

export default {
  path: '/lab',
  name: 'LabPage',
  component: (): ComponentOptions => import('@/pages/lab/LabPage.vue'),
  children: [
    {
      path: '',
      name: 'Lab',
      component: (): ComponentOptions => import('@/pages/lab/pages/Lab.vue')
    }
  ]
}