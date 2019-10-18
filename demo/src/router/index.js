import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '@/components/home/home'
import login from '@/components/login/login'
import echarts from '@/components/echarts/echarts'
import resource from '@/components/resource/resource'
import announcement from '@/components/announcement/announcement'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: home },
    { path: '/login', component: login },
    {
      path: '/home',
      component: home,
      // 子路由
      children: [
        { path: '/announcement', component: announcement },
        { path: '/echarts', component: echarts },
        { path: '/resource', component: resource }
      ]
    }
  ]
})
export default router
