<template>
  <div class="Login" v-loading="loading">
    <el-form label-position="right" class="formLogin" ref="form" :model="form" :rules="rules">
        <h1 class="loginStyle tc mb20">MicroCall</h1>
        <el-row>
            <el-col :span="4">
                <p class="loginStyle">登录名</p>
            </el-col>
            <el-col :span="16">
                <el-form-item prop="loginName">
                    <input type="text" class="formInput" v-model="form.loginName" />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="4">
                <p class="loginStyle">密码</p>
            </el-col>
            <el-col :span="16">
                <el-form-item prop="password">
                    <input type="password" class="formInput" v-model="form.password" />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="4">
                <p style="color:#2d3a4b">.</p>
            </el-col>
            <el-col :span="16">
                <el-form-item>
                    <el-button type="primary" style="width: 100%" @click="submitLogin('form')">登录</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
  </div>
</template>

<script>
import {mapState,mapMutations, mapGetters ,mapActions} from 'vuex'
export default {
    name: 'Login',
    data() {
    return {
        loading: true, //页面loading
        form: {
            loginName: '',
            password: ''
        },
        rules: { // 表单规则验证
            loginName: [
                { required: true, message: '请输入用户名', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'change' }
            ]
        }
    }
  },
  methods: {
    ...mapMutations(['isSuper','isSpecial','isCallCenter','setRolePowers', 'setLoginInfo', 'setjudgePowers']),
    ...mapActions(['getResourceForRole','getAllPowers']),
    submitLogin(formName){
        let that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$axios.post(that.$api + 'login/login', that.form).then(res => { // 登录// roleId: 4超级管理员
                if(res.data.code === 200){
                    let loginData = res.data.data
                    this.getAllPowers()
                    this.setLoginInfo(res.data.data)
                    localStorage.setItem("userInfo", JSON.stringify(res.data.data))
                    that.loading = false
                    that.$message({
                        message: '登录成功',
                        type: 'success',
                        duration: 1000
                    })
                    let bmsLogin = {
                        employeeId:res.data.data.employeeId,
                        employeeCode:res.data.data.employeeCode,
                        type: 1,
                        loginInfo: navigator.userAgent
                    }
                    this.getResourceForRole({id:res.data.data.roleId,isShow:true}).then(()=>{
                        if(loginData.roleId === "4"){ // 管理员
                            that.$router.push('/Staff')
                        }else if(loginData.roleId === "2"){ // 专员
                            that.$router.push('/CheckPatient')
                        }else if(loginData.roleId === "1"){
                            that.$router.push('/CallCenter')
                        }
                    })

                    that.$axios.post(that.$api + 'bmsLogin/newOne', bmsLogin).then( res => { // 记录登录信息
                        console.log(res)
                    })
                    
                }else{
                    that.loading = false
                    that.$message({
                        message: res.data.message,
                        type: 'error',
                        duration: 1500
                    })
                    localStorage.removeItem('userInfo') //清除本地用户信息
                    localStorage.removeItem('powers') //清除本地权限列表
                    localStorage.removeItem('powersAll') //清除本地权限详细列表
                    localStorage.removeItem('judgePowers') //清除权限判断列表
                    localStorage.removeItem("command") // 清除项目id
                    return false
                }
            })
          } else {
            return false
          }
        })
    }
  },
  mounted() {
    let that = this
    setTimeout(function(){
        that.loading = false
    },200)
  },
  computed: {
    // ...mapGetters(['allPowerIds'])
  },
  created() {
    this.isSuper(false)
    this.isSpecial(false)
    this.isCallCenter(false)
  }
}
</script>

<style scoped>
.Login{width: 100%; height: 100vh; background-color: #2d3a4b;;overflow: hidden;}
.formLogin{position: relative;width: 500px;max-width: 100%;padding: 160px 35px 0;margin: 0 auto;overflow: hidden;}
.loginStyle{color: white; line-height: 40px;}
.formInput{
    color: white; 
    background-color: #2d3a4b;
    width: 94%; 
    height: 40px; 
    border-radius: 5px;
    border: 1px solid hsla(0,0%,100%,.1);
    padding-left: 10px;
    padding-right: 10px;
    background: rgba(0,0,0,.1);
}
</style>
