import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

router.beforeEach((to,from,next)=>{
  const user = window.localStorage.getItem("user");
  if(!user && to.path !== '/login'){
    next('/login');
  }
  else if(user && to.path === '/login'){
    next('/home');
  }
  else next();
})

app.use(router).use(createPinia()).use(ElementPlus).mount('#app')
