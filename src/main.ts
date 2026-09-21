import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'primeicons/primeicons.css'

import PrimeVue from 'primevue/config'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'


import '../src/assets/main.css'

async function bootstrap() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      onUnhandledRequest: 'warn',
    })
  }

  const app = createApp(App)

  app.use(createPinia())
  app.use(PrimeVue)
  app.mount('#app')
}

bootstrap()
