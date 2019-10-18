<template>
  <div id="app">
    <el-menu
      ref="menu"
      v-show="isSuper || isSpecial || isCallCenter"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="rgba(0, 24, 46, 1)"
      text-color="rgba(255, 255, 255, 0.5)"
      active-text-color="#fff"
      >
      <!--超级管理员-->
      <img src="./assets/logo.png" alt="" width="170" class="mt10 fl"> 
      <el-menu-item v-if="isSuper" index="/Staff">
        <router-link to="/Staff" class="inline">员工管理</router-link>
      </el-menu-item>
      <el-menu-item v-if="isSuper" index="/PatientManage">
        <router-link to="/PatientManage" class="inline">项目管理</router-link>
      </el-menu-item>
      <el-menu-item v-if="isSuper && judgePowers.Knowledge" index="/Knowledge">
        <router-link to="/Knowledge" class="inline">知识库</router-link>
      </el-menu-item>
      <el-menu-item v-if="isSuper" index="/LoginList">
        <router-link to="/LoginList" class="inline">登录记录</router-link>
      </el-menu-item>
      <el-menu-item v-if="isSuper" index="/QuestionnaireManage">
        <router-link to="/QuestionnaireManage" class="inline">问卷管理</router-link>
      </el-menu-item>
      <el-menu-item v-if="isSuper" index="/QuestionBank">
        <router-link to="/QuestionBank" class="inline">题库</router-link>
      </el-menu-item>
      <el-menu-item v-if="isSuper" index="/MailBox">
        <router-link to="/MailBox" class="inline">邮箱</router-link>
      </el-menu-item>
      <el-menu-item v-if="isSuper" index="/DataExport">
        <router-link to="/DataExport" class="inline">报表</router-link>
      </el-menu-item>
      <!-- <el-menu-item v-if="isSuper" index="/1">
        <a href="http://admintest.bnd.microzan.com.cn">线上平台</a>
      </el-menu-item>
      <el-menu-item v-if="isSuper" index="/2">
        <a href="https://dakang-admin.beta.microzan.com.cn">赠药管理</a>
      </el-menu-item>
      <el-menu-item v-if="isSuper" index="/3">
        <a href="https://dxy-admin.beta.microzan.com.cn">物流跟踪</a>
      </el-menu-item> -->
      <!--专员-->
      <div class="fl lh60 cursor ml30" style="outline: none" v-if="isSpecial">
        <el-dropdown @command="handleCommand" trigger="click">
          <span class="el-dropdown-link colorW">
            <span>{{ commandName }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="w120 proList">
            <el-dropdown-item :command="item" v-for="(item, index) in proList" :key="index">
              <router-link :to="{path: '/CheckPatient', query:{proId: item.id}}" class="dropName">{{ item.projectName }}</router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-menu-item index='/FollowTask' v-if="isSpecial&&judgePowers.FollowTask" >
        <router-link :to="'/FollowTask?proId=' + this.proId" class="inline">随访任务</router-link>
      </el-menu-item>
      <el-menu-item index="/AeManage" v-if="isSpecial&&judgePowers.AeManage">
        <router-link :to="'/AeManage?proId=' + this.proId" class="inline">AE管理</router-link>
      </el-menu-item>
      <!-- <el-menu-item index="3" v-if="isSpecial">
        <router-link to="/3" class="inline">异常报告管理</router-link>
      </el-menu-item> -->
      <el-menu-item index="/WorkOrder" v-if="isSpecial&&judgePowers.WorkOrder">
        <router-link :to="'/WorkOrder?proId=' + this.proId" class="inline">工单管理</router-link>
      </el-menu-item>
      <el-menu-item index="/HosManage" v-if="isSpecial&&judgePowers.HosManage">
        <router-link :to="'/HosManage?proId=' + this.proId" class="inline">医院管理</router-link>
      </el-menu-item>
      <!--呼叫中心 start-->
      <el-menu-item v-if="isCallCenter" index="/CallCenter">
        <router-link to="/CallCenter" class="inline">呼叫中心</router-link>
      </el-menu-item>
      <el-menu-item v-if="isCallCenter&&judgePowers.ShortMessage" index="/ShortMessage">
        <router-link to="/ShortMessage" class="inline">短信管理</router-link>
      </el-menu-item>
      <el-menu-item v-if="isCallCenter && judgePowers.EmailM" index="/Email">
        <router-link to="/Email" class="inline">邮件管理</router-link>
      </el-menu-item>
      <!-- 右上角的导航 -->
      <div class="fr lh60 cursor">
        <el-dropdown @command="handleCommandR">
          <span class="el-dropdown-link lh60 inline">
            <span class="mr10 colorW">工号：{{loginInfo.loginName+' 【'+loginInfo.employeeCode+'】'}}</span>
            <i class="el-icon-setting pr20 colorW" size="20"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="w130px">
            <el-dropdown-item icon="el-icon-edit-outline" v-if="judgePowers.Myset">
              <span @click="setInfo">个人设置</span>
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-phone-outline" v-if="judgePowers.CallCenter">
              <router-link to="/CallCenter">呼叫中心</router-link>
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-view" command="patient">
              <span>患者管理</span>
            </el-dropdown-item>
            <el-dropdown-item :icon="loginInfo.loginName =='科比'?'el-icon-check':'el-icon-menu'" v-if="loginInfo.roleId == 4">
              <router-link to="/Staff">超管模式</router-link>
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-warning">
              <span  @click="loginOut">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>
    <!--个人信息 start-->
    <el-dialog title="个人信息" :visible.sync="dialogVisible" width="30%" v-loading="loading">
      <el-form
        :model="ruleForm2"
        status-icon
        :rules="rules2"
        ref="ruleForm2"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="登陆名" prop="name">
          <el-input v-model.number="ruleForm2.name"></el-input>
        </el-form-item>
        <el-form-item label="旧密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm2.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="tr">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--个人信息 end-->
    <router-view/>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "app",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error("两次输入密码不一致!"))
      } else {
        callback();
      }
    };
    return {
      //activeIndex: '/CheckPatient'
      dialogVisible: false,
      loading: false,
      commandName: '',
      firstId: '', //项目第一个id
      proList: [], //项目列表
      proId: '', //项目id
      ruleForm2: {
        name: "",
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      rules2: {
        name: [{ required: true, message: "请输入", trigger: "blur" }],
        oldPass: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 1, max: 11, message: "长度在 1 到 11 个字符", trigger: "blur" }
        ],
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      },

      timmer: null,//超时退出 定时器
      lastTime:null//超时退出 最后时间
    }
  },
  methods: {
    ...mapActions(['getAllPowers','getResourceForRole']),
    ...mapMutations(['setProId', 'setLoginInfo', 'setjudgePowers']),
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    loginOut(){ // 退出登录
      let outData = {
        id:this.loginInfo.employeeId,
        isOnline:1
      }
      this.$axios.post(this.$api + 'login/offline', outData).then(res => {
        console.log(res)
        if(res.data.code === 200){
          this.setLoginInfo('')
          localStorage.removeItem('userInfo') //清除本地用户信息
          localStorage.removeItem('powers') //清除本地权限列表
          localStorage.removeItem('powersAll') //清除本地权限详细列表
          localStorage.removeItem('judgePowers') //清除权限判断列表
          localStorage.removeItem("command") // 清除项目id
          this.$router.push('/')
        }else{
          this.$message({
              message: res.data.message,
              type: 'error',
              duration: 1500
          })
          localStorage.removeItem('userInfo') //清除本地用户信息
          localStorage.removeItem('powers') //清除本地权限列表
          localStorage.removeItem('powersAll') //清除本地权限详细列表
          localStorage.removeItem('judgePowers') //清除权限判断列表
          localStorage.removeItem("command") // 清除项目id
          this.$router.push('/')
        }
      })
    },
    submitForm(formName) { // 个人设置
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          that.loading = true;
          let data = {
            loginName: this.ruleForm2.name,
            password: this.ruleForm2.oldPass,
            newPassword: this.ruleForm2.pass
          };
          this.$axios.post(that.$api + "employee/updatePassword", data).then(res => {
              // 登录
              console.log(res);
              if (res.data.code === 200) {
                that.loading = false;
                this.dialogVisible = false;
                that.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 1500
                });
              } else {
                that.loading = false;
                that.$message({
                  message: res.data.message,
                  type: "error",
                  duration: 1500
                });
                return false;
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCommand(command) {// 患者管理项目选择
      this.$refs.menu.activeIndex = ''
      this.commandName = command.projectName
      this.proId = command.id
      localStorage.setItem("command", JSON.stringify(command))
      this.setProId(command.id)
    },
    handleCommandR(command){ // 跳转患者管理页面
      localStorage.removeItem('command')
      if(command === 'patient'){
        this.$router.push({path: '/CheckPatient', query:{proId:this.firstId}})
        this.getProList(1)
      }
    },
    setInfo() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs["ruleForm2"].resetFields()
      });
    },
    getProList(status) {
      let proData = {
        page: 1,
        rows: 50,
        status: status
      };
      this.$axios.post(this.$api + "project/getProjectList", proData).then(res => { // 获取项目列表
          if (res.data.code == 200) {
            this.proList = res.data.data.rows
            this.firstId = res.data.data.rows[0].id        
            if(localStorage.getItem('command')){
              this.proId = JSON.parse(localStorage.getItem('command')).id
              this.commandName = JSON.parse(localStorage.getItem('command')).projectName
            }else{
              this.proId = res.data.data.rows[0].id
              this.commandName = res.data.data.rows[0].projectName
            }
            this.setProId(res.data.data.rows[0].id)
            console.log(this.proList)
          }
        });
    },
    currentTime(){ // 超时退出     
      const currentTime = new Date();
      if (currentTime - this.lastTime > 1000 * 60 * 30 ) {
        this.lastTime = currentTime
        if (this.$route.path != '/') {
          this.$message({
              message: '登录超时，将返回登录页',
              type: 'error',
              duration: 1500
          })
          setTimeout(() => {
            this.loginOut()
          }, 2000)
        }
      } else {
        this.lastTime = currentTime;
      }
    }
  },
  computed: {
    ...mapState(["isSuper","isSpecial","isCallCenter", "loginInfo", "judgePowers"])
  },
  mounted() {
    this.$nextTick(() => {
      if(localStorage.getItem('userInfo')){
        this.setLoginInfo(JSON.parse(localStorage.getItem('userInfo')))
        this.getResourceForRole({id:JSON.parse(localStorage.getItem('userInfo')).roleId,isShow:true})
      }
      if(localStorage.getItem('judgePowers')){
        this.setjudgePowers(JSON.parse(localStorage.getItem('judgePowers')))
      }
    })

    setTimeout(() => {
      this.$refs.menu.defaultActive = localStorage.getItem('index')
    }, 100)
  },
  created() {
    //超时退出 start
    this.lastTime = new Date();
  
    window.addEventListener('resize', () => {
      this.currentTime();
    })

    window.addEventListener('click', () => {
      this.currentTime();
    })
      
    window.addEventListener('scroll', () => {
      if (this.timmer) {
        clearTimeout(this.timmer);
      }
      this.timmer = setTimeout(() => {
        this.currentTime();
      }, 3000)
    }, true)

    window.addEventListener('mousemove', () => {
      if (this.timmer) {
        clearTimeout(this.timmer);
      }
      this.timmer = setTimeout(() => {
        this.currentTime();
      }, 3000)
    }, true)
    //超时退出 end

    if(localStorage.getItem('userInfo')&&JSON.parse(localStorage.getItem('userInfo')).roleId){
      this.getAllPowers()
      this.getProList(1)
    }
  },
  watch: {
    $route() {
      let i = this.$route.path;
      localStorage.setItem('index',i)
      setTimeout(() => {
        this.$refs.menu.activeIndex = i
        console.log(i)
      }, 100)
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: rgba(240, 242, 245, 1);
  width: 100%;
  min-height: 100%;
  background: #f1f1f1;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {width: 200px;min-height: 400px;}
.lh60 {line-height: 60px;outline: none;}
.w130px {width: 130px;}
.el-menu--horizontal .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal .el-menu-item:not(.is-disabled):hover{
  background-color: rgb(0, 24, 46) !important;
}
.el-menu-demo{width: 98% !important;margin: 0 auto;padding-left: 1%;padding-right: 1%;font-weight: bold}
.el-table__body-wrapper::-webkit-scrollbar {width: 6px;height: 6px;}
.el-table__body-wrapper::-webkit-scrollbar-thumb {border-radius: 10px;-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);background: #535353;}
 .el-table__body-wrapper::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 10px;
  background: #EDEDED;
}
.has-gutter th, .el-table th>.cell{font-weight: bold; font-size: 14px;color: black;}
.proList .el-dropdown-menu__item{padding:0;overflow: hidden;}
.proList .el-dropdown-menu__item .router-link-active{padding:0; width: 100px; display: inline-block;}
.dropName{padding: 0; width: 100px; text-align: center; display: inline-block;}
.cell{white-space: nowrap !important;}
</style>

