<template>
<!-- 项目选择 -->
  <div class="CheckPatient" ref="CheckPatient">
    <el-row :gutter="8" class="mt10 ml10">
      <el-col :span="5" :xs='24'>
        <el-card class="leftCard" style="height: 650px;">
          <el-form ref="form" :model="patientForm" size="mini" label-width="64px" label-position="right">
            <el-row>
              <el-col :span="12">
                <el-form-item label="省份:">
                  <el-select v-model="patientForm.provinceCode" filterable placeholder="" @focus="provinceS" @change="changePlace(1)">
                    <el-option
                      v-for="item in proveiceList"
                      :key="item.provinceCode"
                      :label="item.provinceName"
                      :value="item.provinceCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="城市:">
                  <el-select v-model="patientForm.cityCode" filterable placeholder="" @focus="cityS" @change="changePlace(2)">
                    <el-option
                      v-for="item in cityList"
                      :key="item.cityCode"
                      :label="item.cityName"
                      :value="item.cityCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="医院:">
                  <el-select v-model="patientForm.hospitalCode" filterable placeholder="" style="width: 100%" @focus="hospitalS">
                    <el-option
                      v-for="item in hosList"
                      :key="item.hospitalCode"
                      :label="item.hospitalName"
                      :value="item.hospitalCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="阶段:">
                  <el-select v-model="patientForm.templateStageId" placeholder="">
                    <el-option :label="item.followTemplateStageName" :value="item.id" v-for="(item ,index) in Ttimes" :key='index'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="患者ID:">
                  <el-input v-model="patientForm.id"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名:">
                  <el-input v-model="patientForm.patientName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别:">
                  <el-select v-model="patientForm.sex" placeholder="">
                    <el-option label="所有" value=""></el-option>
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="来源:">
                  <el-select v-model="patientForm.patientSource" placeholder="">
                    <el-option :label="item" :value="index" v-for="(item,index) in $serve.patientSource" :key='index' v-show='item'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="需AE:">
                  <el-select v-model="patientForm.region" placeholder="">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col :span="24">
                <el-form-item label="注册来源:" label-width="80px">
                  <el-select v-model="sizeForm.region" placeholder="" class="w10p">
                    <el-option label="电话注册" value="1"></el-option>
                    <el-option label="糖堂" value="2"></el-option>
                    <el-option label="有糖" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row> -->
            <!-- <el-row>
              <el-col :span="12">
                <el-form-item label="医生:">
                  <el-input v-model="patientForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="销售经理:" label-width="75px">
                  <el-input v-model="patientForm.name"></el-input>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row>
              <el-col :span="24">
                <el-form-item label="手机:">
                  <el-input v-model="patientForm.patientPhone"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="活跃类型:" label-width="75px">
                  <el-select v-model="patientForm.patientType" placeholder="">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in patientTypeList" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="dataTime">
              <el-col :span="14">
                <el-form-item label="下次随访:" label-width="75px">
                  <el-date-picker type="date" placeholder="" v-model="patientForm.followBeginDate" style="width: 100%"></el-date-picker>                  
                </el-form-item>
              </el-col>
              <el-col :span="1" class="tc lh27">
                <span>-</span>
              </el-col>
              <el-col :span="9">
                <el-form-item label-width="0">
                  <el-date-picker type="date" placeholder="" v-model="patientForm.followEndDate" style="width: 100%"></el-date-picker>                  
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="dataTime">
              <el-col :span="14">
                <el-form-item label="添加时间:" label-width="75px">
                  <el-date-picker type="date" placeholder="" v-model="patientForm.registerBeginDate" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="1" class="tc lh27">
                <span>-</span>
              </el-col>
              <el-col :span="9">
                <el-form-item label-width="0">
                  <el-date-picker type="date" placeholder="" v-model="patientForm.registerEndDate" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="end">
              <el-col :span="7">              
                <el-button type="primary" @click.stop="checkpatient" size="mini" icon="el-icon-search">查询</el-button>  
              </el-col>
              <el-col :span="7">
                <el-button type="primary" @click.stop="resetForm" size="mini" icon="el-icon-refresh-left">重置</el-button>              
              </el-col>
              <el-col :span="7">
                <el-button type="primary" @click.stop="addP = true" size="mini" icon="el-icon-plus">新增</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="19" :xs='24' class="h100">
        <!--搜索表单-->
        <el-card v-loading="loading">
          <el-table :data="patientList" size="mini" align="center" height="580px" style="width: 100%" @row-click="rowSelect" highlight-current-row @row-contextmenu="rightClick">
            <!-- <el-table-column prop="id" label="序号" width="50" align="center"></el-table-column> -->
            <el-table-column prop="projectName" label="所属项目" width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="id" label="患者ID" width="70" align="center"></el-table-column>
            <el-table-column prop="provinceName" label="省" width="80" show-overflow-tooltip align="center"></el-table-column>
            <!-- <el-table-column prop="cityName" label="市" width="80" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="commissioner" label="专员" width="80" align="center"></el-table-column> -->
            <el-table-column prop="hospitalName" label="就诊医院" show-overflow-tooltip align="center" width="150"></el-table-column>
            <el-table-column prop="patientName" label="姓名" width="90" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.patientName}} <span v-if="scope.row.isNewRegister == 1" :class="{badge:scope.row.isNewRegister == 1}" class="fz12">new</span></span>
              </template>
            </el-table-column>
            <el-table-column prop="sex" label="性别" width="50" align="center" :formatter="formatSex"></el-table-column>
            <el-table-column prop="years" label="年龄" width="60" align="center"></el-table-column>
            <el-table-column prop="patientType" label="活跃类型" align="center" show-overflow-tooltip width="80" :formatter="formatPatientType"></el-table-column>
            <el-table-column prop="templateStageName" label="阶段" width="50" align="center"></el-table-column>
            <el-table-column prop="nextFollowDate" label="下次随访时间" width="100" show-overflow-tooltip align="center" :formatter='setTime'></el-table-column>
            <el-table-column prop="unusualFollowDate" label="非常规预约"  width="100" show-overflow-tooltip :formatter='setTime' align="center"></el-table-column>
            <el-table-column prop="patientSource" label="导入数据" width="80" align="center">
              <template slot-scope="scope">
                {{scope.row.patientSource==3?'是':'否'}}
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="60">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="patientDetail(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 右键菜单 -->
          <context-menu class="right-menu" 
            :target="contextMenuTarget" 
            :show="contextMenuVisible" 
            @update:show="(show) => contextMenuVisible = show">
            <a href="javascript:;" @click="rightSelect(1)"><i class="el-icon-plus"></i>&nbsp;&nbsp;&nbsp;创建</a>
            <a href="javascript:;" @click="rightSelect(2)"><i class="el-icon-edit"></i>&nbsp;&nbsp;&nbsp;编辑</a>
            <a href="javascript:;" @click="rightSelect(3)"><i class="el-icon-delete"></i>&nbsp;&nbsp;&nbsp;放入回收站</a>
            <a href="javascript:;" @click="rightSelect(4)"><i class="el-icon-view"></i>&nbsp;&nbsp;&nbsp;打开回收站</a>
            <a href="javascript:;" @click="rightSelect(5)"><i class="el-icon-circle-close"></i>&nbsp;&nbsp;&nbsp;取消</a>
          </context-menu>
          <!--分页-->
          <el-pagination
              class="fr mb20 mt30"
              align="left"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[50, 100, 150]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="patientTotal"
            ></el-pagination>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="新增患者" :visible.sync="addP" width="70%">
      <add-patient v-if="addP" @close='closeDialog'></add-patient>
    </el-dialog>
    <el-dialog :visible.sync="isDetail" :fullscreen= true>
      <patient-detail v-if="isDetail" :patientCode = "patientCode" @closeDetail="isDetail = false" activeTab='follow' class='h100'></patient-detail>
    </el-dialog>
    <el-dialog title="回收站" :visible.sync="isRecycle" width="55%" class="recycle">
      <el-row class="mb15">
        <el-col :span="4"><el-button type="primary" size="mini" icon="el-icon-folder-remove" @click.stop="deleteRecycle" :disabled="recycleList.length <= 0">清空回收站</el-button></el-col>
        <el-col :span="4"><el-button type="primary" size="mini" icon="el-icon-refresh-left" @click.stop="recoveryPatient" :disabled="recycleList.length <= 0">恢复选中</el-button></el-col>
      </el-row>
      <!-- 回收站列表 -->
      <el-table :data="recycleList" v-if="isRecycle" size="mini" height="320" align="center" @row-click="rowRecyleSelect" highlight-current-row>
        <!-- <el-table-column prop="id" label="序号" width="50" align="center"></el-table-column> -->
        <el-table-column prop="projectName" label="所属项目" width="80" align="center"></el-table-column>
        <el-table-column prop="id" label="患者ID" width="100" align="center"></el-table-column>
        <el-table-column prop="provinceName" label="省" width="80" align="center"></el-table-column>
        <el-table-column prop="cityName" label="市" width="80" align="center"></el-table-column>
        <el-table-column prop="commissioner" label="专员" width="100" align="center"></el-table-column>
        <el-table-column prop="hospitalName" label="就诊医院" align="center" width="180"></el-table-column>
        <el-table-column prop="patientName" label="姓名" width="80" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import { component as ContextMenu } from '@xunlei/vue-context-menu'
import AddPatient from './AddPatient'
import PatientDetail from '../PatientDetail/PatientDetail'
export default {
  name: 'CheckPatient',
  data() {
    return {
      loading: false,
      addP: false, // 是否新增患者
      isDetail: false, // 患者详情
      currentPage: 1, //当前页 
      patientTotal: 0, // 总员工数
      pageSize: 50, // 每页显示个数
      proveiceList: [], // 省列表
      cityList: [], // 城市列表
      hosList: [], // 医院列表
      contextMenuVisible: false, // 右键菜单显示
      contextMenuTarget: '', // 触发右键事件的元素
      proId: '', // 项目id
      isRecycle:false, // 回收站
      recycleList:[], //回收站列表
      codeList:[], //回收站code列表
      patientForm: {
        provinceCode: "",
        cityCode: "",
        hospitalCode: "",
        templateStageId: "",
        patientType: "",
        projectId: "",
        patientBeginDate: "",
        patientEndDate: "",
        registerBeginDate: "",
        registerEndDate: "",
        patientName: "",
        commissioner: "",
        patientPhone: "",
        sex: "",
        id: "",
        patientSource: ""
      },
      patientList: [],
      patientTypeList: [ //患者类型
        {label: "所有", value: ""},{label: "活跃", value: "1"},{label: "活跃-暂时失联", value: "2"},{label: "非活跃", value: "3"},{label: "非活跃-拒访", value: "4"},
        {label: "非活跃-错号", value: "5"},{label: "非活跃-已过世", value: "6"},{label: "非活跃-空号", value: "7"},{label: "非活跃-停药", value: "9"},{label: "非活跃-非患者", value: "10"},
        {label: "非活跃-休眠", value: "11"}
      ],
      patientCode: '', // 患者code
      recycleCode: '', // 回收站患者code
      Ttimes:[],//左侧搜索T次
    }
  },
  computed: {
    
  },
  methods: {
    ...mapMutations(['isSpecial', 'isSuper', 'isCallCenter']),
    onSubmit() {
      console.log("submit!")
    },
    closeDialog(type) {
      if(type === 1){
        this.$nextTick(() => {
          this.getpatientList(1, 50, this.$route.query.proId)
        }) 
      }
      this.addP = false
    },
    formatSex: function (row, column) { // 过滤性别
      return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
    },
    rowSelect(row, column, event){ // 行被选中
      this.patientCode = row.patientCode
      console.log(row)
    },
    rightClick(row, column, event){ //鼠标右键点击
      console.log(row)
      this.contextMenuVisible = true
    },
    rightSelect(type){ // 右键菜单选中
      switch (type) {
        case 1:
          console.log('创建')
          this.addP = true
          this.contextMenuVisible = false
          break;
        case 2:
          console.log('编辑')
          if(this.patientCode != ''){
            this.isDetail = true
          }else{
            this.$message({
              message: "请选择员工",
              type: "warning",
              duration: 1500
            })
          }
          this.contextMenuVisible = false
          break;
        case 3:
          console.log('放入回收站')
          if(this.patientCode != ''){
            this.$axios.post(this.$api + 'patient/recoveryPatient', {patientCode: this.patientCode}).then(res => {
              console.log(res)
              if(res.data.code === 200){
                this.getpatientList(1, 50, this.$route.query.proId)
              }
            })
          }else{
            this.$message({
              message: "请选择员工",
              type: "warning",
              duration: 1500
            })
          }
          this.contextMenuVisible = false
          break;
        case 4: // 打开回收站
          this.loading = true
          this.isRecycle = true
          this.getRecycle()
          this.contextMenuVisible = false
          break;
        case 5:
          console.log('取消')
          this.contextMenuVisible = false
          break;
      }
    },
    rowRecyleSelect(row, column, event){ // 回收站行被选中
      this.recycleCode = row.patientCode
    },
    recoveryPatient(){ // 恢复回收站患者
      if(this.recycleCode != ''){
        this.$axios.post(this.$api + 'patient/returnPatient', { patientCode: this.recycleCode}).then(res => {
          if(res.data.code === 200){
            this.$message({
              message: "成功移出回收站",
              type: "success",
              duration: 1500
            })
            this.recycleCode = ''
            this.getRecycle()
            this.getpatientList(1, 50, this.$route.query.proId)
          }
        })
      }else{
        this.$message({
          message: "请选择员工",
          type: "warning",
          duration: 1500
        })
      }
    },
    deleteRecycle(){ // 清空回收站
      if(this.codeList.length > 0){
        this.$axios.post(this.$api + 'patient/deleteAllPatient', this.codeList).then(res => {
          if(res.data.code === 200){
            this.$message({
              message: "成功清空回收站",
              type: "success",
              duration: 1500
            })
            this.codeList = []
            this.getRecycle()
            this.getpatientList(1, 50, this.$route.query.proId)
          }
        })
      }
    },
    getRecycle(){ //获取回收站列表
      this.$axios.get(this.$api + 'patient/getRecoveryPatient?page=1&rows=50').then(res => {
        console.log(res)
        if(res.data.code === 200){
          let codeList = [] //回收站code列表
          this.recycleList = res.data.data.rows
          res.data.data.rows.map(item => {
            codeList.push(item.patientCode)
          })
          this.codeList = codeList
          this.loading = false
          console.log(res)
          console.log('回收站code列表', codeList)
        }
      })
    },
    patientDetail(row){ // 查看患者详情
      console.log(row)
      this.patientCode = row.patientCode
      this.isDetail = true
      this.contextMenuVisible = false
    },
    formatPatientType(row, column){ // 过滤患者类型
      let type = this.patientTypeList.find((item)=>item.value == row.patientType)
      return type?type.label:''
    },
    checkpatient() { // 查询随访患者
      console.log(this.proId)
      this.getpatientList(1, 50, this.$route.query.proId)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getpatientList(this.currentPage, val, this.proId)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`,this.proId)
      this.currentPage = val
      this.getpatientList(val, this.pageSize, this.proId)
    },
    provinceS(){ // 选择省份接口
      console.log('选择省')
      this.$axios.get(this.$api + 'patient/getProvince?projectId=1').then(res => {
        if(res.data.code === 200){
          this.proveiceList = res.data.data
          console.log(this.proveiceList)
        }
      })
    },
    cityS(){ // 选择市接口
      if(this.patientForm.provinceCode){
        this.$axios.get(this.$api + 'patient/getCity?provinceCode=' + this.patientForm.provinceCode + '&projectId=1').then(res => {
          if(res.data.code === 200){
            this.cityList = res.data.data
          }
          console.log(res)
        })
      }
      console.log("省code", this.patientForm.provinceCode)
    },
    hospitalS(){ // 医院列表
      if(this.patientForm.provinceCode && this.patientForm.cityCode){
        this.$axios.get(this.$api + 'patient/getHospital?provinceCode=' + this.patientForm.provinceCode + '&projectId=1' + '&cityCode=' + this.patientForm.cityCode).then(res => {
          if(res.data.code === 200){
            this.hosList = res.data.data
          }
        })
      }
    },
    changePlace(type){ // 切换地区
      if(type == 1){
        this.patientForm.cityCode = ''
        this.patientForm.hospitalCode = ''
      }else if(type == 2){
        this.patientForm.hospitalCode = ''
      }
    },
    resetForm(){ //重置表单
      console.log('重置表单')
      this.$nextTick(() => {
        this.patientForm = {
          provinceCode: "",
          cityCode: "",
          hospitalCode: "",
          templateStageId: "",
          patientType: "",
          followBeginDate: "",
          followEndDate: "",
          registerBeginDate: "",
          registerEndDate: "",
          patientName: "",
          commissioner: "",
          patientPhone: "",
          sex: "",
          id: "",
          patientSource: ""
        }
      })
    },
    getpatientList(page,rows, projectId) { // 获取患者列表
      this.loading = true
      this.patientForm.page = page
      this.patientForm.rows = rows
      this.patientForm.projectId = projectId
      this.patientForm.loginEmployeeId = JSON.parse(localStorage.getItem('userInfo')).employeeId
      console.log(this.patientForm)
      this.$axios.post(this.$api + 'patient/getPatientList', this.patientForm).then(res => {
        if(res.data.code === 200){
          setTimeout(() => {
            this.loading = false
            this.patientList = res.data.data.rows
            console.log(this.patientList)
            this.patientTotal = res.data.data.total
          }, 300)
        }
      })
    },
    getTtimes(id){ //获取搜索T次
      this.$axios.get(this.$api + 'project/getProjectById?id='+id).then(res => {
        if(res.data.code === 200){
          this.Ttimes = res.data.data.stageList
        }
      })
    },
    setTime(row, column, cellValue, index){
      return cellValue>=0?this.$serve.timemin(cellValue,'YMD'):''
    },
  },
  mounted(){
    this.proId = this.$route.query.proId
    console.log(this.proId)
    this.contextMenuTarget = this.$refs.CheckPatient
    this.getpatientList(1, 50, this.$route.query.proId)
    this.getTtimes(this.$route.query.proId)
  },
  watch:{
    '$route': function(to, from) {
      //console.log(to, from)
      this.$nextTick(() => {
        this.proId = to.query.proI
        this.patientForm.templateStageId = ''
        this.getpatientList(1,50, to.query.proId)
        this.getTtimes(to.query.proId)
      })
    }
  },
  created() {
    this.isSpecial(true)
    this.isCallCenter(false)
    this.isSuper(false)
  },
  components: {
    AddPatient,PatientDetail, ContextMenu
  }
}
</script>
<style scoped>
/* .CheckPatient >>> .el-input__inner{padding:0 0 0 7px;} */
.CheckPatient >>> .el-row{margin-right: 0 !important;margin-left: 0 !important;}
.dataTime >>> .el-input__inner{padding:0 0 0 23px;}
.dataTime >>> .el-input__prefix{left: 0;}
.leftCard >>> .el-card__body{padding:15px 10px 0 0}
.right-menu {position: fixed;background: #fff;border: solid 1px rgba(0, 0, 0, .2);z-index: 999;display: none;}
.right-menu a {width: 110px;height: 28px;line-height: 28px;text-align: left;display: block;color: #1a1a1a;font-size: 14px;}
.right-menu a:hover {background: #eee;color: #fff;}
.right-menu {border: 1px solid #eee;box-shadow: 0 0.5em 1em 0 rgba(0,0,0,.1);border-radius: 3px;}
.right-menu a {padding: 2px 2px 2px 15px;}
.right-menu a:hover {background: #409EFF;}
.recycle >>> .el-dialog__body{padding: 0 20px 20px;}
.badge{
  color: #f56c6c;
}
</style>