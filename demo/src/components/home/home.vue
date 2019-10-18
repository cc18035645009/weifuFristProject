
<template>
  <el-container  class="box">
  <el-header class="header">
     <el-row  >
         <el-col :span="12">
            <div class="grid-content bg-purple header-left">
              <!-- - - -->
                <i>logo</i>
               <span>上海网络科技有限公司</span>
            </div>
          </el-col>
         <el-col :span="12" >
           <div class="header-right-right">
             <!-- 注销 -->
             <div class="header-right-Logout">
               <el-popover
                 placement="top"
                 width="40"
                 trigger="hover"
                 >
                  <div style="text-align: right; margin: 0" class="zhuxiao" >
                       <i class="iconfont">&#xe61a;</i>
                       <el-button type="text" @click="open7">注销</el-button>
                  </div>
                  <el-button slot="reference">您好，欢迎您</el-button>
               </el-popover>
             </div>
             <!-- 设置 -->
             <div class="header-right-set">
               <img src="../../assets/image/set.png" alt="">
               <el-popover
                 placement="top"
                 width="10px"
                 trigger="click"
                 >
                  <div style="text-align: center" class="zhuxiao" >
                       <i class="iconfont">&#xe623;</i>
                       <!-- 嵌套的表单 -->
                       <el-button type="text" @click="dialogFormVisible = true">修改密码</el-button>
                       <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
                        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
                          <el-form-item label="密码" prop="pass">
                            <el-input type="password" v-model="ruleForm2.pass" autocomplete="off"></el-input>
                          </el-form-item>
                          <el-form-item label="确认密码" prop="checkPass">
                            <el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
                          </el-form-item>
                          <el-form-item label="年龄" prop="age">
                            <el-input v-model.number="ruleForm2.age"></el-input>
                          </el-form-item>
                          <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
                            <el-button @click="resetForm('ruleForm2')">重置</el-button>
                          </el-form-item>
                        </el-form>
                       </el-dialog>
                  </div>
                  <el-button slot="reference">设置</el-button>
               </el-popover>
             </div>
             <!-- 公告 -->
             <div class="header-right-announcement"></div>
           </div>
         </el-col>
     </el-row>
  </el-header>
  <el-container >
    <!-- 侧边栏 -->
    <el-aside  width="198px" class="el-menu-box">
         <el-menu
            :router="true"
            class="el-menu-vertical-demo"
            background-color="#333C48"
            text-color="#fff"
            active-text-color="#ffd04b">
            <div class="el-menu-item-1" index="5"  >
              <img src="../../assets/image/liebiao.png" alt=""></div>
            <el-submenu index="1">
                <template slot="title">
                  <span >首页</span>
                </template>
                <el-menu-item index="/echarts" >
                  <span>图表</span>
                </el-menu-item>
                  <el-menu-item index="/announcement" >
                  <span>公告</span>
                </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                   <span >客户资源</span>
                </template>
                <el-menu-item index="/resource" >
                   <span >客户资料</span>
                </el-menu-item>
            </el-submenu>
            <el-menu-item  index="3">
              <span >客户管理</span>
            </el-menu-item>
            <el-menu-item index="4" >
              <span >知识库</span>
            </el-menu-item>
              <el-menu-item index="6" >
              <span >权限管理</span>
            </el-menu-item>
            <el-menu-item  index="7">
              <span >通讯管理</span>
            </el-menu-item>
            <el-menu-item index="8" >
              <span >统计分析</span>
            </el-menu-item>
         </el-menu>
    </el-aside>
    <!-- 主体 -->
    <!-- 主体侧边栏 -->
    <el-main class="conent-right">
      <!-- 子路由出口 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

</template>

<script>
import '@/assets/css/index.css'
export default {
  data () {
    return {
      gridData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      ruleForm2: {
        pass: '',
        checkPass: '',
        age: ''
      }
    }
  },
  methods: {
    open7 () {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style second>
/* header */
.el-header {
  padding: 0;
}

.box {
  height: 100%;
}
.header {
  background: #333c48;
  height: 61px;
  box-sizing: border-box;
  overflow: hidden;
}

.content {
  background: #bbb;
}

.header-left {
  height: 61px;
  width: 50%;
  margin-left: 65px;
}
.header-left i {
  height: 24px;
  width: 26px;
  line-height: 61px;
  vertical-align: middle;
  margin-right: 11px;
  color: #ffffff;
}
.header-left span {
  height: 16px;
  width: 162px;
  line-height: 61px;
  font-size: 16px;
  color: #ffffff;
}
.header-right-Logout {
  width: 104px;
  height: 61px;
  float: right;
  margin-right: 42px;
  text-align: center;
}
.header-right-set {
  height: 60px;
  width: 100px;
  background: #1d242d;
  float: right;
  line-height: 61px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
}
.header-right-set img {
  height: 20px;
  width: 20px;
  margin-top: 21px;
  margin-left: 19px;
}

/*侧边栏*/
.content-left .el-menu {
  border-right: 0;
  height: 100%;
  box-sizing: border-box;
}
.content-left {
  background: #eee;
}
.el-menu-item-1 {
  background: #333c48;
  height: 62px;
  text-align: center;
  padding-top: 8px;
  box-sizing: border-box;
}
.el-menu-item-1 img {
  height: 46px;
}
.el-menu-item {
  text-align: center;
  font-size: 16px;
}
/*主体侧边栏*/
.el-menu-vertical-demo {
  height: 100%;
  overflow: hidden;
}
.el-main .el-submenu {
  font-size: 16px;
}
.el-main .el-submenu span {
  font-size: 14px;
}
.list {
  height: 56px;
  line-height: 56px;
  text-align: center;
}
.userlist {
  background: #ffffff;
  height: 56px;
  padding-left: 30px;
  line-height: 56px;
  box-sizing: border-box;
  border-bottom: 1px solid red;
  width: 100px;
  border-right: 1px solid #ddd;
}
/* .el-main {
  padding-left: 160px;
} */
.qiuqiuni {
  height: 100%;
}
.conent-aside {
  height: 100%;
}
</style>
<style deep>
.el-menu-box .el-menu-item.is-active {
  background: #f79a30 !important;
}
.el-menu-item-1 {
  background: #51576a !important;
  margin-bottom: 14px !important;
}
.el-menu-item {
  height: 62px !important;
  line-height: 62px !important;
}
.el-main {
  padding: 0px !important;
  margin: 0px !important;
  box-sizing: border-box !important;
}
.el-main .el-menu {
  width: 198px !important;
  /* height: 100% !important; */
}
/*主体侧边栏*/
.el-main .el-submenu {
  font-size: 16px !important;
  background: #ffffff !important;
}
.el-main .el-submenu span {
  font-size: 14px !important;
}
.el-main .el-menu {
  width: 160px !important;
}
.el-submenu__title {
  padding: 0 30px !important;
}
.el-menu-item-2 {
  margin-bottom: 11px !important;
  border-bottm: 1px solid #aaa;
}
.conent-aside .el-menu-item.is-active {
  background: #aaa !important;
}
/* .el-header .el-button:focus,
.el-button:hover {
  background: #ffffff !important;
} */
.el-header .el-button {
  background: #333c48 !important;
  border: 0px !important;
  height: 17px !important;
  width: 104px !important;
  color: #ffffff !important;
  margin-top: 13px !important;
}
.header-right-Logout {
  text-align: center !important;
}
.el-header .zhuxiao .el-button {
  height: 14px !important;
  width: 30px !important;
  background: #ffffff !important;
  color: #666666 !important;
  margin: 0 !important;
  padding: 0 !important;
}
.zhuxiao {
  height: 42px !important;
  width: 80px !important;
  background: #ffffff !important;
}
.el-header .el-message-box--center .el-message-box__btns .el-button--primary {
  background: #ffffff !important;
  color: #666666 !important;
}
.el-header .el-message-box--center .el-message-box__btns .el-button--small {
  background: #ffffff !important;
  color: #666666 !important;
}
.el-popover {
  background: #ffffff !important;
  height: 46px !important;
  width: 80px !important;
  top: 60px !important;
  margin: 0px !important;
  padding: 0px !important;
  color: #666666 !important;
  min-width: 0 !important;
  line-height: 42px !important;
  padding-right: 25px !important;
}
.header-right-set .el-popover__reference {
  background: #1d242d !important;
  width: 2px !important;
}
.el-header .set-xiugai .el-button {
  height: 16px !important;
  width: 30px !important;
}
.set-xiugai .el-popover {
  z-index: 999 !important;
}
.set-xiugai {
  height: 16px !important;
  width: 32px !important;
  box-sizing: border-box !important;
  margin-right: 20px !important;
}
.set-el-popover {
  width: 8px !important;
}
.el-header .header-right-set .el-button span {
  margin-left: -12px !important;
}
.el-aside .el-submenu__icon-arrow {
  display: none !important;
}
.el-submenu__title {
  text-align: center !important;
}
</style>
