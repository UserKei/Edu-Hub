import './assets/main.css'
// import 'vue-sonner/lib/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

const app = createApp(App)

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-CN': zhCN
  }
})

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
