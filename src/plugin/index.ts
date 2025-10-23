import router from '../router'
import type { App } from 'vue'
import dayjs from './dayjs.plugin'
import pinia from './pinia.plugin'

export default function registerPlugins(app: App<Element>): App<Element> {
	return app
  .use(router)
  .use(dayjs)
  .use(pinia)
}
