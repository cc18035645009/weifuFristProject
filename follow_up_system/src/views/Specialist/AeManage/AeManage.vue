<template>
  <div class="AeM">
    <el-container>
      <el-row :gutter="8" class="mt10 ml10">
        <el-col :span="5">
          <el-card class="leftCard" style="height: 650px;">
            <el-form ref="form" :model="aeFormS" size="mini" label-width="75px" label-position="right">
              <el-row>
                <el-col>
                  <el-form-item label="事件结果:">
                    <el-select v-model="aeFormS.status" placeholder="">
                      <el-option label="所有" value="1"></el-option>
                      <el-option label="未上报" value="2"></el-option>
                      <el-option label="已上报" value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="省份:">
                    <el-select v-model="aeFormS.patientProvinceCode" filterable placeholder="" @focus="provinceS" @change="changePlace(1)">
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
                    <el-select v-model="aeFormS.patientCityCode" filterable placeholder="" @focus="cityS" @change="changePlace(2)">
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
                    <el-select v-model="aeFormS.patientHospitalCode" filterable placeholder="" style="width: 100%" @focus="hospitalS">
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
                <el-col :span="24">
                  <el-form-item label="患者ID:">
                    <el-input v-model="aeFormS.patientCode"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="dataTime">
                <el-col :span="14">
                  <el-form-item label="创建时间:" label-width="75px">
                    <el-date-picker type="date" placeholder="" v-model="aeFormS.startDate" style="width: 100%"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="1" class="tc lh27">
                  <span>-</span>
                </el-col>
                <el-col :span="9">
                  <el-form-item label-width="0">
                    <el-date-picker type="date" placeholder="" v-model="aeFormS.endDate" style="width: 100%"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row type="flex" justify="end">
                <el-col :span="7">              
                  <el-button type="primary" @click.stop="getAe" size="mini" icon="el-icon-search">查询</el-button>  
                </el-col>
                <el-col :span="8">
                  <el-button type="primary" @click.stop="resetForm" size="mini" icon="el-icon-refresh-left">重置</el-button>              
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="19">
          <!--搜索表单-->
          <el-card v-loading="loading">
            <el-table :data="aeList" size="mini" style="width: 100%;" align="center" height="550" @row-dblclick="rowSelect" highlight-current-row>
              <el-table-column prop="reporterIdentity" label="报告ID" align="center"></el-table-column>
              <el-table-column prop="patientCode" label="患者ID" align="center"></el-table-column>
              <el-table-column prop="patientProvinceName" label="省" align="center"></el-table-column>
              <el-table-column prop="patientCityName" label="市" align="center"></el-table-column>
              <el-table-column prop="patientCommissioner" label="患者专员" align="center"></el-table-column>
              <el-table-column prop="aeCommissioner" label="AE专员" align="center"></el-table-column>
              <el-table-column prop="patientHospitalName" label="就诊医院" align="center"></el-table-column>
              <el-table-column prop="sex" label="姓名" align="center"></el-table-column>
              <el-table-column prop="birthday" label="不良事件结果" align="center"></el-table-column>
              <el-table-column prop="patientType" label="获知时间日期" align="center"></el-table-column>
              <el-table-column prop="templateStageName" label="状态" align="center"></el-table-column>
              <el-table-column prop="date" label="客户反馈编号" align="center"></el-table-column>
              <el-table-column prop="date" label="分类" align="center"></el-table-column>
              <el-table-column prop="date" label="创建日期" align="center"></el-table-column>
              <el-table-column prop="date" label="上报日期" align="center"></el-table-column>
              <!-- <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="aeDetail(scope.row)">详情</el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <!--分页-->
            <!-- <el-pagination
                class="fl mb20 mt30"
                align="left"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[50, 100, 150]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="patientTotal"
              ></el-pagination> -->
          </el-card>
        </el-col>
      </el-row>
    </el-container>
    <!-- 详情 -->
    <el-dialog :visible.sync="isDetail" :fullscreen= true>
      <patient-detail v-if="isDetail" :patientCode = "patientCode" :aeId="aeId" activeTab='ae' detailType="AE" @closeDetail="isDetail = false"></patient-detail>
    </el-dialog>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import patientDetail from '../PatientManage/PatientDetail/PatientDetail'
export default {
  name: 'AeM',
  data() {
    return {
      loading: false,
      currentPage: 1, //当前页 
      patientTotal: 0, // 总员工数
      pageSize: 50, // 每页显示个数
      proveiceList: [], // 省列表
      cityList: [], // 城市列表
      hosList: [], // 医院列表
      aeList: [], // AE列表
      isDetail: false, // 详情
      aeFormS: { // 查询AE表单
        page: '',
        rows: '',
        aeCommissioner: '',
        status: '',
        patientProvinceCode: '',
        patientCityCode: '',
        patientHospitalCode: '',
        patientCode: '',
        classification: '',
        code: '',
        startDate: '',
        endDate: ''
      },
      patientCode: '',
      aeId: ''
    }
  },
  methods: {
    ...mapMutations(['isSpecial', 'isSuper', 'isCallCenter']),
    changePlace(type){ // 切换地区
      if(type == 1){
        this.aeFormS.patientCityCode = ''
        this.aeFormS.patientHospitalCode = ''
      }else if(type == 2){
        this.aeFormS.patientHospitalCode = ''
      }
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
      if(this.aeFormS.patientProvinceCode){
        this.$axios.get(this.$api + 'patient/getCity?provinceCode=' + this.aeFormS.patientProvinceCode + '&projectId=1').then(res => {
          if(res.data.code === 200){
            this.cityList = res.data.data
          }
          console.log(res)
        })
      }
      console.log("省code", this.aeFormS.patientProvinceCode)
    },
    hospitalS(){ // 医院列表
      if(this.aeFormS.patientProvinceCode && this.aeFormS.patientCityCode){
        this.$axios.get(this.$api + 'patient/getHospital?provinceCode=' + this.aeFormS.patientProvinceCode + '&projectId=1' + '&cityCode=' + this.aeFormS.patientCityCode).then(res => {
          if(res.data.code === 200){
            this.hosList = res.data.data
          }
        })
      }
    },
    getAe(){ // 获取AE列表 
      this.aeFormS.page = this.currentPage
      this.aeFormS.rows = this.pageSize
      this.loading = true
      this.$axios.post(this.$api + 'aeBaimidaReport/getList', this.aeFormS).then(res => {
        if(res.data.code === 200){
          this.loading = false
          this.aeList = res.data.data.rows
        }
      })
    },
    rowSelect(row, column, event){ // 行选择
      console.log(row)
      this.patientCode = row.patientCode
      this.aeId = row.id
      console.log(this.patientCode)
      this.isDetail = true
    },
    aeDetail(row){ // AE详情
      console.log(row)
      if(this.patientCode != ''){
        console.log('hahah')
      }
    },
    resetForm(){ // 重置表单
      this.aeFormS = { // 查询AE表单
        page: this.currentPage,
        rows: this.pageSize,
        aeCommissioner: '',
        status: '',
        patientProvinceCode: '',
        patientCityCode: '',
        patientHospitalCode: '',
        patientCode: '',
        classification: '',
        code: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  mounted(){
    this.getAe()
  },
  created(){
    this.isSpecial(true)
    this.isCallCenter(false)
    this.isSuper(false)
  },
  components:{
    patientDetail
  }
}
</script>

<style scoped>
.AeM >>> .el-input__inner{padding:0 0 0 7px;}
.AeM  >>> .el-row{margin-right: 0 !important;margin-left: 0 !important;}
.AeM .dataTime >>> .el-input__inner{padding:0 0 0 23px;}
.AeM .dataTime >>> .el-input__prefix{left: 0;}
.leftCard >>> .el-card__body{padding:15px 10px 0 0}
.AeM >>> .el-table__body{table-layout:auto !important;}
</style>
