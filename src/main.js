import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn
})
app.use(router)
app.mount('#app')
