import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { reveal } from './directives/reveal'
import { i18n } from './i18n'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.directive('reveal', reveal)
app.mount('#app')
