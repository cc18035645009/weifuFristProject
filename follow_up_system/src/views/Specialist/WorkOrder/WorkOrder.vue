<template>
  <div class="WorkOrder">
    <el-container class="mr10 ml10" v-if="!isShowDetail">
      <el-aside style='width:auto'>
        <el-card class="box-card mt10">
          <div slot="header" class="clearfix">
            <span>工单记录</span>
            <el-button style="float: right; padding: 3px 0" type="text" class="fl" icon="el-icon-plus" @click.stop="addWork">新建工单</el-button>
          </div>
          <el-menu
            :default-active="active"
            class="el-menu-vertical-demo"
            @select="selectMenu"
            >
            <el-menu-item index="1" class="flex alic">
              <span slot="title">我的未完成工单</span>
            </el-menu-item>
            <el-menu-item index="2" class="flex alic">
              <span slot="title">我的已完成工单</span>
            </el-menu-item>
            <el-menu-item index="3" class="flex alic">
              <span slot="title">抄送给我的工单</span>
            </el-menu-item>
            <el-menu-item index="4" class="flex alic">
              <span slot="title">我创建的工单</span>
            </el-menu-item>
            <el-menu-item index="5" class="flex alic">
              <span slot="title">暂停工单</span>
            </el-menu-item>
            <el-menu-item index="6" class="flex alic" v-if="judgePowers.AllWorkOrder">
              <span slot="title">所有工单</span>
              <!-- <span slot="title" class="flex1 flex"><span class="flex1">所有工单</span><span>4</span></span> -->
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-aside>
      <el-container class="ml10 mt10 w10p">
        <el-card :border='false' class="w10p posRel">
          <div class="fz16 fw borderbe0 pb15">{{['','我的未完成工单','我的已完成工单','抄送给我的工单','我创建的工单','暂停工单','所有工单'][active]}}</div>
           <el-table :data="tableData.rows" ref="tableData" class="mt10" style="width: 100%" size="mini" :highlight-current-row="true">
            <el-table-column prop="id" label="ID" align="center" width='100' ></el-table-column>
            <el-table-column prop="createTime" label="创建日期" align="center" width='100' >
              <template slot-scope="scope">
                {{scope.row.createTime | formatTimemin}}
              </template>
            </el-table-column>
            <el-table-column  prop="subject" label="主题" width='300' show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="patientName" label="患者" align="center" width='100' ></el-table-column>
            <el-table-column prop="workOrderType" label="类型" align="center" width='100'>
              <template slot-scope="scope">
                {{$serve.workOrderType[scope.row.workOrderType]}}
              </template>
            </el-table-column>
            <el-table-column prop="priorityLevel" label="优先级" align="center" width='100' >
              <template slot-scope="scope">
                {{$serve.priorityLevel[scope.row.priorityLevel]}}
              </template>
            </el-table-column>
            <el-table-column prop="shouldFinishTime" label="需求完成时间" align="center" width='100' >
              <template slot-scope="scope">
                {{scope.row.createTime | formatTimemin}}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="工单状态" align="center" width='100' >
              <template slot-scope="scope">
                {{['','未完成','暂停','完成'][scope.row.status]}}
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button type="text" size="small" v-if="(nowInfo.roleId == 4 && scope.row.status == 1) || (nowInfo.employeeId == scope.row.createEmployeeId && scope.row.status == 1)" @click="edit(scope.row)">修改</el-button> 
                <el-divider direction="vertical" v-if="nowInfo.roleId == 4 || nowInfo.employeeId == scope.row.createEmployeeId"></el-divider>
                <el-button type="text" size="small" @click="lookDetail(scope.row)">查看</el-button> 
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.total"
            class="mt10 tr"
            >
          </el-pagination>
        </el-card>
      </el-container>
    </el-container>
    <new-orEdit-work-order v-else @closeDetail='closeDetail' @getList='getList' :editId='editId'></new-orEdit-work-order>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import NewOrEditWorkOrder from './NewOrEditWorkOrder'

export default {
  props:['patientCode', 'phone'],
  name:'WorkOrder',
  data() {
    return {
      currentPage: 1,
      pageSize: 0 ,// 每页显示个数
      tableData: {
        rows:[],
        total:0
      },
      form:{
        status:'',
        copyEmployeeId:'',
        dealEmployeeId:''
      },
      msgList:[], // 工单列表
      active:'1',
      isShowDetail:false,
      nowInfo:{},//当前登录用户信息
      editId:''
    }
  },
  methods: {
    ...mapMutations(['isSpecial', 'isSuper', 'isCallCenter']),
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getList(this.form, 1);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getList(this.form, val);
    },
    getList(form, page) {
      let that = this;
      let data = {
        page: page?page:this.currentPage,
        rows: that.pageSize?that.pageSize:that.$serve.rows,
        ...form
      };
      this.$axios.post(this.$api + "workOrderQilu/getList", data).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data;
        } else {
          this.$message({
            message: res.data.message,
            type: "error",
            duration: 1500
          });
        }
        console.log(res);
      });
    },
    selectMenu(index){
      console.log(index)
      let employeeId =  JSON.parse(localStorage.getItem('userInfo')).employeeId
      this.tableData = []
      this.active = index
      switch(parseInt(index)){
        case 1:
          this.form = {
            status:1,
            copyEmployeeId:'',
            dealEmployeeId:employeeId
          }
          break;
        case 2:
          this.form = {
            status:3,
            copyEmployeeId:'',
            dealEmployeeId:employeeId
          }
          break;
        case 3:
          this.form = {
            status:'',
            copyEmployeeId:employeeId,
            dealEmployeeId:'' 
          }
          break;
        case 4:
          this.form = {
            status:'',
            copyEmployeeId:'',
            dealEmployeeId:'',
            createEmployeeId:employeeId
          }
          break;
        case 5:
          this.form = {
            status:2,
            copyEmployeeId:'',
            dealEmployeeId:employeeId
          } 
          break;
         case 6:
          this.form = {
            status:'',
            copyEmployeeId:'',
            dealEmployeeId:''
          }
          break;
      }
      this.getList(this.form)
    },
    addWork(){ // 新建
      this.editId = ''
      this.isShowDetail = true
    },
    edit(row){
      this.editId = row.id
      this.isShowDetail = true
    },
    lookDetail(row){ // 查看患者详情
      this.editId = row.id
      
      this.isShowDetail = true
    },
    closeDetail(){
      this.isShowDetail = false
    }
  },
  mounted(){
    
  },
  computed: {
    ...mapState(["judgePowers"])
  },
  created(){
    this.isSpecial(true)
    this.isCallCenter(false)
    this.isSuper(false)
    let info =  JSON.parse(localStorage.getItem('userInfo'))
    this.nowInfo = info
    this.form = {
      status:1,
      copyEmployeeId:'',
      dealEmployeeId:info.employeeId
    }
    this.getList(this.form)
  },
  components:{
    NewOrEditWorkOrder
  }
}
//修改为志愿者外部工单不行，处理完毕没写，暂停没写
</script>

<style scoped>
.el-card{overflow:inherit;}
</style>
