import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { store, key } from './store/index'
import '@/styles/index.scss'
import api from '@/api'

const app = createApp(App)

app.config.globalProperties.$api = api

app.use(router)
app.use(store, key)
app.mount('#app')



