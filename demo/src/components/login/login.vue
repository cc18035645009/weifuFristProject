<template>
       <el-container >
      <el-aside  width="1226px">
      </el-aside>
      <el-main>
         <div class="content">
           <div class="box">
            <div class="box-top" >
              <span>CRM管理系统</span>
            </div>
            <div class="box-input" >
               <img src="../../assets/image/icon_account.png" alt="">
               <input v-model="username" type="text" value="请输入您的账号">
            </div>
            <div class="box-button" >
               <img src="../../assets/image/icon_password.png" alt="">
               <input type="password" value="请输入您的密码" v-model="password">
            </div>
            <div class="checkbox">
                   <div class="float-right">
                     <span>忘记密码?</span>
                   </div>
                  <input type="checkbox"> 记住密码
            </div>
            <div class="button">
               <a href="javascript:;" @click.prevent="loginClick">登录</a>
            </div>
          </div>
         </div>
      </el-main>
    </el-container>
</template>

<script>
// import axios from '@/node_modules/axios/dist/axios.js'
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    // 点击登录
    loginClick () {
      // let loginName = this.username
      // let loginPassword = this.password
      // 获取用户的输入名字和密码
      // axios.post('../data.json', {
      //   loginName,
      //   loginPassword
      // }).then(res => {
      //   console.log(res)
      // })
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
/* .el-container {
  width: 1200px;
  height: 500px;
  background-color: #ccc;
  margin: 0 auto;
} */
/* 超小屏 */
.el-container {
  height: 1008px;
  padding: 0;
  margin: 0;
}
.el-aside img {
  height: 100%;
  width: 100%;
}
.row-bg {
  height: 100%;
}
.content {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.box {
  height: 352px;
  width: 430px;
  margin: 0 auto;
  margin-top: 254px;
  /* background: #ccc; */
}
.box-top {
  text-align: center;
  font-size: 36px;
  color: orange;
}
.box-input {
  display: flex;
  margin-top: 32px;
  border-bottom: 1px solid #aaa;
  width: 394px;
  padding: 10px;
  height: 44px;
  font-size: 16px;
  line-height: 44px;
}
.box-input img {
  height: 24px;
  width: 24px;
  margin-top: 10px;
}
.box-input input {
  border: #ffffff;
  margin-left: 14px;
  height: 20px;
  margin-top: 10px;
}
.box-button {
  display: flex;
  margin-top: 32px;
  border-bottom: 1px solid #aaa;
  width: 394px;
  padding: 10px;
  height: 44px;
  font-size: 16px;
  line-height: 44px;
}
.box-button img {
  height: 24px;
  width: 24px;
  margin-top: 10px;
}
.box-button input {
  border: #ffffff;
  margin-left: 14px;
  height: 20px;
  margin-top: 10px;
}
.checkbox {
  height: 10px;
  width: 420px;
  padding: 10px;
  margin-bottom: 54px;
}
.float-right {
  float: right;
  color: orange;
  margin-right: 20px;
}
.button {
  height: 48px;
  width: 410px;
  background: #f79a30;
  text-align: center;
  line-height: 48px;
  border-radius: 30px;
}
</style>
<style deep>
.el-aside {
  padding: 0 !important;
  margin: 0 !important;
  background-image: url(../../assets/image/bg-left.png);
  overflow: hidden;
}
.el-main {
  padding: 0 !important;
  margin: 0 !important;
  background-image: url(../../assets/image/bg-right.png);
}
</style>
