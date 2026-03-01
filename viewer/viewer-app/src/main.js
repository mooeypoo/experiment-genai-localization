import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import App from './app/AppShell.vue'
import router from './router.js'
import 'primeicons/primeicons.css'
import './styles/base.css'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(router)
app.mount('#app')
