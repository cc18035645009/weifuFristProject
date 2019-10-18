import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { Message } from 'element-ui';
import serve from './common'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    isSuper: false, // 是否为超级管理员
    isSpecial: false, // 是否为专员
    isCallCenter: false, // 是否为专员
    step: 0, // 新建项目步骤
    proId: [], // 项目id
    proDetail: '', // 项目详情
    judgePowers:[], // 角色权限列表
    loginInfo: 3, //登录信息
    allPowers:[] //所有权限
  },
  getters: {
    allPowerIds(state){ // 所有权限id列表
      let ids = []
      state.allPowers.map(item =>{
        item.resourceSonList.map(itm => {
          // ids.push(itm.id)
          ids.push(itm.url)
        })
      })
      return Array.from(new Set(ids))
    }
  },
  mutations: {
    isSuper(state, payload){
      state.isSuper = payload
    },
    isSpecial(state, payload){
      state.isSpecial = payload
    },
    setTabbar(state, payload){
      state[payload.name] = payload.status
    },
    isCallCenter(state, payload){
        state.isCallCenter = payload
    },
    setStep(state, payload){
      state.step = payload
    },
    setProId(state, payload) {
      state.proId = payload
      console.log(state.proId)
    },
    setjudgePowers(state, payload){ //设置角色权限
      state.judgePowers = payload
      console.log(state.judgePowers)
    },
    setLoginInfo(state, payload){ //设置用户登录信息
      state.loginInfo = payload
    },
    setAllPowers(state, payload){ //获取所有权限
      state.allPowers = payload
    }
  },
  actions: {
    getAllPowers({commit}){ // 获取所有权限
      axios.get(serve.api + 'resource/getAll').then(res => {
        if(res.data&&res.data.code === 200){
          commit('setAllPowers', res.data.data)
        }else{
          Message({
              message: '登录超时，将返回登录页',
              type: 'error',
              duration: 1500
          })
          localStorage.removeItem('userInfo') //清除本地用户信息
          localStorage.removeItem('powers') //清除本地权限列表
          localStorage.removeItem('powersAll') //清除本地权限详细列表
          localStorage.removeItem('judgePowers') //清除权限判断列表
          localStorage.removeItem("command") // 清除项目id
          this.$router.replace('/')
        }
      })
    },
    getResourceForRole ({commit},playload) {//获取权限树    
      return new Promise((resolve,reject)=>{
        axios.get(serve.api+"resource/getResourceForRole?roleId="+playload.id)
        .then((res) => {
          if (res.data.code == 200) {
            if(playload.isShow){
              localStorage.setItem('powersAll', JSON.stringify(res.data.data)) 
              let powerList = []
              res.data.data.map(item => {
                if(item){
                  powerList.push(item.url)
                } 
              })
              powerList = Array.from(new Set(powerList))
              localStorage.setItem('powers', JSON.stringify(powerList))  
              let judgePowrs = {
                  // "powerM": powerList.indexOf(1) !== -1, //权限管理
                  // "highUserM": powerList.indexOf(2) !== -1, //高级用户管理
                  // "userManage": powerList.indexOf(3) !== -1, //用户管理
                  // "myset": powerList.indexOf(4) !== -1, //我的设置
                  // "msgSend": powerList.indexOf(6) !== -1, //短信群发
                  // "emailM": powerList.indexOf(7) !== -1, //邮件管理
                  // // "patientHighM": powerList.indexOf(7) !== -1, ///患者高级管理
                  // "activeMsg": powerList.indexOf(8) !== -1, //活动短信
                  // "callM": powerList.indexOf(9) !== -1, //呼叫管理
                  // "knowLeadgeM": powerList.indexOf(17) !== -1, //知识库管理
                  // "knowLeadgeS": powerList.indexOf(11) !== -1, //速查百宝箱  
                  // "dataExport":  powerList.indexOf(22) !== -1, //数据导出     

                  // "followTask":  powerList.indexOf('/FollowTask') !== -1, //随访管理
                  // "aeManage":  powerList.indexOf('/AeManage') !== -1, //随访管理
                  // "hosManage":  powerList.indexOf('/HosManage') !== -1, //医院管理
                  // "shortMessage ":  powerList.indexOf('/ShortMessage ') !== -1, //短信管理
              }    
              this.getters.allPowerIds.map((item)=>{
                console.log(item)
                  judgePowrs[item?item.split('/')[1]:'null'] = powerList.indexOf(item) !== -1
              })                 
              localStorage.setItem('judgePowers', JSON.stringify(judgePowrs))
              commit('setjudgePowers', judgePowrs) //重新录入权限
            }
            resolve(res.data.data)
          }else{
            Message({
                message: res.data.message,
                type: 'success',
                duration: 1500
            })
          }
        })
        .catch((error) => {
          Message({
              message: error,
              type: 'success',
              duration: 1500
          })
          reject(error)
        });   
      })
    },
  }
})
