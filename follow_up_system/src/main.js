import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router/router'
import axios from 'axios'
import store from './serve/store'
import './assets/style.css'
import serve from './serve/common'
Vue.use(ElementUI)
axios.defaults.withCredentials=true

Vue.prototype.$axios=axios
Vue.prototype.$api=serve.api
Vue.prototype.$serve=serve
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  localStorage.setItem('backName', from.name)
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if(localStorage.getItem('userInfo')){
    let ok = JSON.parse(localStorage.getItem('powersAll'))?JSON.parse(localStorage.getItem('powersAll')).findIndex((item)=>item.url == to.path):'';
    if(ok == -1){
      Vue.prototype.$message({
          message: '无权访问',
          type: 'error',
          duration: 1500
      })
      localStorage.removeItem('userInfo') //清除本地用户信息
      localStorage.removeItem('powers') //清除本地权限列表
      localStorage.removeItem('powersAll') //清除本地权限详细列表
      localStorage.removeItem('judgePowers') //清除权限判断列表
      localStorage.removeItem("command") // 清除项目id
      next('/')
    }else{
      next()
    }
  }else{
    console.log(to)
    if(to.path === '/'){
      next()
    }else{
      next('/')
    }
  }
  //next()
})

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
})