import type { ComponentOptions } from 'vue'

export default {
  path: '/appointment',
  name: 'AppointmentPage',
  component: (): ComponentOptions => import('@/pages/appointment/AppointmentPage.vue'),
  children: [
    {
      path: '',
      name: 'Appointment',
      component: (): ComponentOptions => import('@/pages/appointment/pages/Appointment.vue')
    }
  ]
}
