<template>
<!-- 随访任务 -->
  <div class="FollowPatient" v-loading="loading">
    <el-row :gutter="8" class="mt10 ml10">
      <el-col :span="5" :xs='24'>
        <el-card class="leftCard" style="height: 650px;">
          <el-form ref="followForm" :model="followForm" size="mini" label-width="64px" label-position="right">
            <el-row>
              <el-col :span="12">
                <el-form-item label="省份:">
                  <el-select v-model="followForm.provinceCode" filterable placeholder="" @focus="provinceS" @change="changePlace(1)">
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
                  <el-select v-model="followForm.cityCode" filterable placeholder="" @focus="cityS" @change="changePlace(2)">
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
                  <el-select v-model="followForm.hospitalCode" filterable placeholder="" style="width: 100%" @focus="hospitalS">
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
                  <el-select v-model="followForm.templateStageId" placeholder="">
                    <el-option :label="item.followTemplateStageName" :value="item.id" v-for="(item ,index) in Ttimes" :key='index'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="患者ID:">
                  <el-input v-model="followForm.id"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名:">
                  <el-input v-model="followForm.patientName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别:">
                  <el-select v-model="followForm.sex" placeholder="">
                    <el-option label="所有" value=""></el-option>
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="来源:">
                  <el-select v-model="followForm.patientSource" placeholder="">
                    <el-option :label="item" :value="index" v-for="(item,index) in $serve.patientSource" :key='index' v-show='item'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="手机:">
                  <el-input v-model="followForm.patientPhone"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="活跃类型:" label-width="75px">
                  <el-select v-model="followForm.patientType" placeholder="">
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in patientTypeList" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="dataTime">
              <el-col :span="14">
                <el-form-item label="下次随访:" label-width="75px">
                  <el-date-picker type="date" placeholder="" v-model="followForm.followBeginDate" style="width: 100%"></el-date-picker>                  
                </el-form-item>
              </el-col>
              <el-col :span="1" class="tc lh27">
                <span>-</span>
              </el-col>
              <el-col :span="9">
                <el-form-item label-width="0">
                  <el-date-picker type="date" placeholder="" v-model="followForm.followEndDate" style="width: 100%"></el-date-picker>                  
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="dataTime">
              <el-col :span="14">
                <el-form-item label="添加时间:" label-width="75px">
                  <el-date-picker type="date" placeholder="" v-model="followForm.registerBeginDate" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="1" class="tc lh27">
                <span>-</span>
              </el-col>
              <el-col :span="9">
                <el-form-item label-width="0">
                  <el-date-picker type="date" placeholder="" v-model="followForm.registerEndDate" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="dataTime">
              <el-col :span="14">
                <el-form-item label="非常预约:" label-width="75px">
                  <el-date-picker type="date" placeholder="" v-model="followForm.unusualFollowBeginDate" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="1" class="tc lh27">
                <span>-</span>
              </el-col>
              <el-col :span="9">
                <el-form-item label-width="0">
                  <el-date-picker type="date" placeholder="" v-model="followForm.unusualFollowEndDate" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start">
              <el-col :span="12">
                <el-form-item>
                  <el-button type="success" @click.stop="checkFollow">查询</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-button type="success" @click="resetForm" class="fl" size="mini">重置条件</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="19" :xs='24' class="h100">
        <!--搜索表单-->
        <el-card>
          <el-table :data="followList" size="mini" align="center" height="580px">
            <!-- <el-table-column prop="id" label="序号" width="50" align="center"></el-table-column> -->
            <el-table-column prop="projectName" label="所属项目" show-overflow-tooltip width="100" align="center"></el-table-column>
            <el-table-column prop="id" label="患者ID" width="70" align="center"></el-table-column>
            <el-table-column prop="provinceName" label="省" width="80" align="center"></el-table-column>
            <!-- <el-table-column prop="cityName" label="市" width="80" align="center"></el-table-column>
            <el-table-column prop="commissioner" label="专员" width="80" align="center"></el-table-column> -->
            <el-table-column prop="hospitalName" label="就诊医院" width="120" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="patientName" label="姓名" width="90" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.patientName}} <span v-if="scope.row.isNewRegister == 1" :class="{badge:scope.row.isNewRegister == 1}" class="fz12">new</span></span>
              </template>
            </el-table-column>
            <el-table-column prop="patientType" label="活跃类型" align="center" :formatter="formatPatientType"></el-table-column>
            <el-table-column prop="templateStageName" label="阶段" width="50" align="center"></el-table-column>
            <el-table-column prop="nextFollowDate" label="下次随访时间" width="100" show-overflow-tooltip :formatter='setTime' align="center"></el-table-column>
            <el-table-column prop="unusualFollowDate" label="非常规预约" width="100" show-overflow-tooltip :formatter='setTime' align="center"></el-table-column>
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
              :total="followTotal"
            ></el-pagination>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="isDetail" :fullscreen= true>
      <patient-detail v-if="isDetail" @closeDetail='isDetail = false' :patientCode="patientCode" activeTab='follow'></patient-detail>
    </el-dialog>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import PatientDetail from '../../PatientManage/PatientDetail/PatientDetail'
export default {
  name: 'CheckPatient',
  data() {
    return {
      loading: false,
      currentPage: 1, //当前页 
      followTotal: 0, // 总员工数
      pageSize: 50, // 每页显示个数
      addP: false, // 是否新增患者
      isDetail: false, // 患者详情
      proList: [], //项目列表
      proveiceList: [], //省份列表
      cityList:[], //市列表
      hosList:[], //医院列表
      patientCode: '', // 患者code
      followForm: {
        provinceCode: "",
        cityCode: "",
        hospitalCode: "",
        templateStageId: "",
        patientType: "",
        followBeginDate: "",
        followEndDate: "",
        registerBeginDate: "",
        registerEndDate: "",
        unusualFollowBeginDate:'',
        unusualFollowEndDate:'',
        patientName: "",
        commissioner: "",
        patientPhone: "",
        sex: "",
        id: "",
        patientSource: ""
      },
      followList: [], //随访患者列表
      Ttimes:[],//左侧搜索T次
      patientTypeList: [ //患者类型
        {label: "所有", value: ""},{label: "活跃", value: "1"},{label: "活跃-暂时失联", value: "2"},{label: "非活跃", value: "3"},{label: "非活跃-拒访", value: "4"},
        {label: "非活跃-错号", value: "5"},{label: "非活跃-已过世", value: "6"},{label: "非活跃-空号", value: "7"},{label: "非活跃-停药", value: "9"},{label: "非活跃-非患者", value: "10"},
        {label: "非活跃-休眠", value: "11"}
      ],
    }
  },
  computed: {
    
  },
  methods: {
    ...mapMutations(['isSpecial', 'isSuper', 'isCallCenter']),
    onSubmit() {
      console.log("submit!");
    },
    formatSex: function (row, column) { // 过滤性别
      return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
    },
    formatPatientType(row, column){ // 过滤患者类型
      let type = this.patientTypeList.find((item)=>item.value == row.patientType)
      return type?type.label:''
    },
    checkFollow() { // 查询随访患者
      this.getFollowList(this.currentPage, this.pageSize, this.proId)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getFollowList(this.currentPage, val, this.proId)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getFollowList(val, this.pageSize, this.proId)
    },
    provinceS(){ // 选择省份接口
      console.log('选择省')
      this.$axios.get(`${this.$api}patient/getProvince?projectId=1`).then(res => {
        if(res.data.code === 200){
          this.proveiceList = res.data.data
          console.log(this.proveiceList)
        }
      })
    },
    cityS(){ // 选择市接口
      if(this.followForm.provinceCode){
        this.$axios.get(`${this.$api}patient/getCity?provinceCode=${this.followForm.provinceCode}&projectId=1`).then(res => {
          if(res.data.code === 200){
            this.cityList = res.data.data
          }
          console.log(res)
        })
      }
      console.log("省code", this.followForm.provinceCode)
    },
    hospitalS(){ // 医院列表
      if(this.followForm.provinceCode && this.followForm.cityCode){
        this.$axios.get(`${this.$api}patient/getHospital?provinceCode=${this.followForm.provinceCode}&projectId=1&cityCode=${this.followForm.cityCode}`).then(res => {
          if(res.data.code === 200){
            this.hosList = res.data.data
          }
        })
      }
    },
    changePlace(type){ // 切换地区
      if(type == 1){
        this.followForm.cityCode = ''
        this.followForm.hospitalCode = ''
      }else if(type == 2){
        this.followForm.hospitalCode = ''
      }
    },
    patientDetail(row){ // 查看患者详情
      console.log(row)
      this.patientCode = row.patientCode
      this.isDetail = true
    },
    resetForm(){ //重置表单
      console.log('重置表单')
      this.$nextTick(() => {
        this.followForm = {
          provinceCode: "",
          cityCode: "",
          hospitalCode: "",
          templateStageId: "",
          patientType: "",
          followBeginDate: "",
          followEndDate: "",
          registerBeginDate: "",
          registerEndDate: "",
          unusualFollowBeginDate:'',
          unusualFollowEndDate:'',
          patientName: "",
          commissioner: "",
          patientPhone: "",
          sex: "",
          id: "",
          patientSource: ""
        }
      })
    },
    getFollowList(page,rows, projectId) { // 获取患者列表
      this.followForm.page = page
      this.followForm.rows = rows
      this.followForm.projectId = projectId
      this.followForm.loginEmployeeId = JSON.parse(localStorage.getItem('userInfo')).employeeId
      console.log(this.followForm)
      this.loading = true
      this.$axios.post(`${this.$api}patient/getFollowList`, this.followForm).then(res => {
        setTimeout(() => {
          this.loading = false
        }, 500)
        if(res.data.code === 200){
          this.followList = res.data.data.data.rows
          console.log(this.followList)
          this.followTotal = res.data.data.data.total
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
    console.log(this.$route.query.proId)
    this.getFollowList(1, 50, this.proId)
    this.getTtimes(this.$route.query.proId)
  },
  created() {
    this.isSpecial(true)
    this.isCallCenter(false)
    this.isSuper(false)
  },
  watch:{
    '$route': function(to, from) {
      this.$nextTick(() => {
        this.getTtimes(to.query.proId)
      })
    }
  },
  components: {
    PatientDetail
  }
}
</script>
<style scoped>
.FollowPatient >>> .el-input__inner{padding:0 0 0 7px;}
.FollowPatient  >>> .el-row{margin-right: 0 !important;margin-left: 0 !important;}
.dataTime >>> .el-input__inner{padding:0 0 0 23px;}
.dataTime >>> .el-input__prefix{left: 0;}
.leftCard >>> .el-card__body{padding:15px 10px 0 0}
.badge{
  color: #f56c6c;
}
</style>