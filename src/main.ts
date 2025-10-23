import { createApp } from 'vue'
import App from './App.vue'
import registerPlugins from './plugin'

import './assets/css/style.css'
import './assets/css/fonts.css'

const app = registerPlugins(createApp(App))

app.mount('#app')
