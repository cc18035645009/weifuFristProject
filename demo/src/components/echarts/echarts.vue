<template>
 <el-container>
   <div class="asideLeft">
     <!-- 侧边栏上的 “客户管理列表” -->
     <div class="aside-top" >
       <span>客户管理列表</span>
     </div>
     <!-- 侧边栏 -->
     <div class="aside-bottom">
        <el-aside width="160px">
          <el-menu
              class="el-menu-vertical-demo">
              <el-submenu index="a1">
                <template slot="title">
                  <span>我的客户</span>
                </template>
                  <el-menu-item index="a1-1">新客户资源</el-menu-item>
                  <el-menu-item index="a1-2">意向客户</el-menu-item>
                  <el-menu-item index="a1-3">重点客户</el-menu-item>
                  <el-menu-item index="a1-4">已开客户</el-menu-item>
                  <el-menu-item index="a1-5">客户交接</el-menu-item>
                  <el-menu-item index="a1-6">客户交接</el-menu-item>
              </el-submenu>
              <el-submenu index="a2">
                <template slot="title">
                  <span>签约客户</span>
                </template>
                  <el-menu-item index="a2-1">客户交接</el-menu-item>
                  <el-menu-item index="a2-2">交接记录</el-menu-item>
              </el-submenu>
              <el-submenu index="a3">
                <template slot="title">
                  <span>公海客户</span>
                </template>
                  <el-menu-item index="a3-1">选项1</el-menu-item>
                  <el-menu-item index="a3-2">选项2</el-menu-item>
              </el-submenu>
              <el-submenu index="a4">
                <template slot="title">
                  <span>流失客户</span>
                </template>
              </el-submenu>
          </el-menu>
     </el-aside>
     </div>
   </div>
  <el-main>
    <div class="echarts">
      <!-- 退出的弹框 -->
      <!-- <div class="tuichu" >
        <i class="iconfont">&#xe61a;</i>
        <span>注销</span>
        </div> -->
        <!-- 顶部的三个盒子 -->
      <div class="echarts-top">
        <div class="top1"> <span>首页 X</span></div>
        <div class="top2"> <span>意向客户 X</span></div>
        <div class="top3"> <span>重点客户 X</span></div>
      </div>
      <!-- 中部的饼图 -->
      <div class="echarts-content" ref="echarts-content">
      </div>
      <!-- 底部的柱状图 -->
      <div class="echarts-bottom">
        <div id="echarts-bottom-left" ref="echarts_bottom_left"></div>
        <div id="echarts-bottom-right"  ref="echarts_bottom_right"></div>
      </div>
    </div>
  </el-main>
</el-container>
</template>
<script type="text/javascript">
import echarts from '../../../node_modules/echarts/lib/echarts.js'

export default {
  data () {
    return {
    }
  },
  mounted () {
    this.myChart2()
    this.myChart3()
  },
  methods: {
    myChart2 () {
      let myChart = echarts.init(this.$refs['echarts_bottom_left'])
      let option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }]
      }
      myChart.setOption(option)
    },
    myChart3 () {
      let myChart = echarts.init(this.$refs['echarts_bottom_right'])
      let option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }]
      }
      myChart.setOption(option)
    }
  }
}
</script>
<style second lang="less">
body {
  height: 100%;
}
.aside-bottom {
  min-height: 100%;
  background-color: #fff;
}
.aside-top {
  height: 56px;
  width: 130px;
  line-height: 56px;
  padding-left: 30px;
  background: #ffffff;
}
.el-container {
  height: 100%;
}
.el-main {
  background: #f0f2f5;
  position: relative;
}
/*头部*/
.echarts-top {
  display: flex;
  margin-bottom: 10px;
  .top1 {
    height: 26px;
    width: 65px;
    text-align: center;
    line-height: 26px;
    border: 1px solid orange;
    border-radius: 5px;
    margin-right: 8px;
    background: #ffffff;
  }
  .top2 {
    width: 91px;
    height: 26px;
    text-align: center;
    line-height: 26px;
    border: 1px solid #aaa;
    border-radius: 5px;
    margin-right: 8px;
    background: #ffffff;
  }
  .top3 {
    width: 91px;
    height: 26px;
    text-align: center;
    line-height: 26px;
    border: 1px solid #aaa;
    border-radius: 5px;
    margin-right: 8px;
    background: #ffffff;
  }
}

/* .tuichu {
  height: 40px;
  width: 81px;
  background: #ffffff;
  position: absolute;
  top: 6px;
  right: 51px;
  text-align: center;
  line-height: 40px;
  border-radius: 8px;
} */

/*饼图*/
.echarts-content {
  height: 442px;
  width: 1476px;
  background: #ffffff;
  margin-bottom: 14px;
}
/*柱状图*/
.echarts-bottom {
  width: 1478px;
  height: 476px;
  background: #ffffff;
  display: flex;
}
#echarts-bottom-left {
  margin: 23px 31px 25px 17px;
  background: #ddd;
  height: 426px;
  width: 689px;
}
#echarts-bottom-right {
  margin: 23px 31px 25px 23px;
  background: #ccc;
  height: 427 px;
  width: 689px;
}
</style>
<style deep scoped>
.asideLeft {
  height: 100% !important;
}
.el-menu-item.is-active {
  /* background: #f2f1f8 !important; */
}
.el-aside {
  min-height: 100% !important;
  overflow: hidden;
}
.el-submenu__title:hover {
  font-size: 16px !important;
}
.el-submenu .el-menu-item {
  font-size: 14px !important;
}
.el-main .echarts {
  padding: 20px !important;
}
</style>
