import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './router'

// 引入elementplus UI组件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/reset.less'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
