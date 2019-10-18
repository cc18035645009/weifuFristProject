<template>
  <div class="AddPatient">
    <el-form ref="addForm" :model="addForm" size="small" :inline="true" label-position="right" class="mauto w10p overH">
      <el-row>
        <el-col :span="6">
          <el-form-item label="销售经理:" label-width="120px">
            <el-input v-model="addForm.salesManager" class="w100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="主治医生:" label-width="80px">
            <el-input v-model="addForm.attendDoctor" class="w100"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="7">
          <el-form-item label="是否入组:" label-width="90px">
            <el-select v-model="addForm.isInGroup" class="w80" placeholder="">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="所属项目:" prop="projectId" :rules="{required: true, message: '必填项', trigger: 'blur'}">
            <el-select v-model="addForm.projectId" class="w100" placeholder="">
              <el-option :label="item.projectName" :value="item.id" v-for="(item,index) in proList" :key='index'></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="省份:" label-width="120px" prop="provinceCode" :rules="{required: true, message: '必填项', trigger: 'blur'}">
            <el-select v-model="addForm.provinceCode" class="w100" filterable placeholder="" @focus="checkPlace(1)" @change="changePlace(1)">
              <el-option
                v-for="item in proveiceList"
                :key="item.provinceCode"
                :label="item.provinceName"
                :value="item.provinceCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="城市:" label-width="80px" prop="cityCode" :rules="{required: true, message: '必填项', trigger: 'blur'}">
            <el-select v-model="addForm.cityCode" class="w100" filterable placeholder="" @focus="checkPlace(2)" @change="changePlace(2)">
              <el-option
                v-for="item in cityList"
                :key="item.cityCode"
                :label="item.cityName"
                :value="item.cityCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="就诊医院:" label-width="90px" prop="hospitalCode" :rules="{required: false, message: '必填项', trigger: 'blur'}">
            <el-select v-model="addForm.hospitalCode" class="w10p" filterable placeholder="" @focus="checkPlace(3)">
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
        <el-col :span="6">
          <el-form-item label="患者姓名:" label-width="120px" prop="patientName" :rules="{required: true, message: '必填项', trigger: 'blur'}">
            <el-input v-model="addForm.patientName" class="w100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="性别:" label-width="80px">
            <el-select v-model="addForm.sex" class="w100" placeholder="">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="dataTime">
          <el-form-item label="出生年月:" label-width="90px">
            <el-date-picker type="date" v-model="addForm.birthday" class="w120"></el-date-picker> 
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="患者手机:" label-width="120px" prop="patientPhone" :rules="{required: true, message: '必填项', trigger: 'blur'}">
            <el-input v-model="addForm.patientPhone" class="w100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="lh27">
          <el-form-item label="固定电话:" label-width="80px">
            <el-input v-model="addForm.fixedPhoneL" style="width: 70px;"></el-input>
          </el-form-item>
        <!-- </el-col>
        <el-col :span="1" class="tc lh27"> -->
          <span>-</span>
        <!-- </el-col>
        <el-col :span="7"> -->
          <el-form-item>
            <el-input v-model="addForm.fixedPhoneR" class="w120"></el-input>
          </el-form-item>
        </el-col>
        
      </el-row>
      <el-row>
        <el-col :span="6" >
          <el-form-item label="电子邮件:" label-width="120px">
            <el-input v-model="addForm.email" class="w100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="家属手机:" label-width="80px">
            <el-input v-model="addForm.familyPhone" class="w100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="患者来源:" label-width="90px" prop="patientSource" :rules="{required: true, message: '必填项', trigger: 'blur'}">
            <el-select v-model="addForm.patientSource" class="w80" :disabled="$route.path == '/CallCenter'">
              <el-option :label="item" :value="index" v-for="(item,index) in $serve.patientSource" :key='index' v-show="item" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="通讯省份:" label-width="120px">
            <el-select v-model="addForm.comProvinceCode" class="w100" filterable placeholder="" @focus="checkPlace(4)" @change="changePlace(3)">
              <el-option
                v-for="item in comProvinceList"
                :key="item.provinceCode"
                :label="item.provinceName"
                :value="item.provinceCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="市:"  label-width="80px">
            <el-select v-model="addForm.comCityCode" class="w100" filterable placeholder="" @focus="checkPlace(5)">
              <el-option
                v-for="item in comCityList"
                :key="item.cityCode"
                :label="item.cityName"
                :value="item.cityCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="地址:" label-width="90px">
            <el-input class="w150" v-model="addForm.comAddress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="邮编:">
            <el-input class="w100" v-model="addForm.zipCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" class="dataTime">
          <el-form-item label="初始使用日期:" label-width="120px">
            <el-date-picker type="date" v-model="addForm.firstDrugDate" class="w120"></el-date-picker> 
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否需要随访:" prop="isInGroup" :rules="{required: true, message: '必填项', trigger: 'blur'}">
            <el-select v-model="addForm.isInGroup" class="w80" placeholder="">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="注册人身份:">
            <el-select v-model="addForm.registerType" class="w100" placeholder="">
              <el-option label="电话注册" value="1"></el-option>
              <el-option label="微信端注册" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="服务方式及需求:" label-width="120px">
            <el-select v-model="addForm.serviceModel" multiple placeholder="请选择" size="small" style="width: 400px">
              <el-option label="邮寄资料" value="邮寄资料"></el-option>
              <el-option label="电话" value="电话"></el-option>
              <el-option label="短信" value="短信"></el-option>
              <el-option label="电子邮件" value="电子邮件"></el-option>
              <el-option label="微信" value="微信"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.stop="resetForm">重置填写</el-button>
      <el-button type="primary" @click.stop="confirm">保存</el-button>
    </div>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {
  name: 'AddPatient',
  data() {
    return {
      addForm: { // 新增表单
        projectId: '',
        patientSource: 2,
        isInGroup: '1',
        registerType: '',
        createUserId: '',
        firstDrugDate: '',
        patientName: '',
        sex: '',
        birthday: '',
        provinceCode: '',
        cityCode: '',
        hospitalCode: '',
        patientPhone: '',
        fixedPhoneL:'',
        fixedPhoneR:'',
        fixedPhone: '',
        familyPhone: '',
        email: '',
        comProvinceCode: '',
        comCityCode: '',
        comAddress: '',
        zipCode: '',
        isOld: '',
        serviceModel: '',
        salesManager: '',
        attendDoctor: '',
        drugFlag: '',
        projectId: ''
      },
      proveiceList: [], // 省列表
      comProvinceList:[], // 通讯省列表
      cityList: [], // 城市列表
      comCityList: [], // 通讯城市列表
      hosList: [],// 医院列表
      proList:[]
    }
  },
  computed: {
    ...mapState(['proId'])
  },
  created(){
    this.getProList()
  },
  mounted(){
    
  },
  methods: {
    resetForm () { // 重置表单
      this.addForm = {
        patientSource: '',
        isInGroup: '1',
        registerType: '',
        createUserId: JSON.parse(localStorage.getItem('userInfo')).employeeId,
        firstDrugDate: '',
        patientName: '',
        sex: '',
        birthday: '',
        provinceCode: '',
        cityCode: '',
        hospitalCode: '',
        patientPhone: '',
        fixedPhoneL:'',
        fixedPhoneR:'',
        fixedPhone: '',
        familyPhone: '',
        email: '',
        comProvinceCode: '',
        comCityCode: '',
        comAddress: '',
        zipCode: '',
        isOld: '',
        serviceModel: '',
        salesManager: '',
        attendDoctor: '',
        drugFlag: '',
        projectId: this.proId
      }
    },
    confirm() { // 提交
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          this.addForm.fixedPhone = this.addForm.fixedPhoneL + "-" + this.addForm.fixedPhoneR
          this.addForm.createUserId = JSON.parse(localStorage.getItem('userInfo')).employeeId
          this.addForm.serviceModel = JSON.stringify(this.addForm.serviceModel)
          this.addForm.projectId = this.proId
          console.log(this.addForm)
          this.$axios.post(this.$api + 'patient/savePatient', this.addForm).then(res => {
            console.log(res)
            if(res.data.code === 200){
              console.log(this.proId)
              this.$message({
                message: "新增患者成功",
                type: "success",
                duration: 1500
              })
              this.$emit('close', 1)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    checkPlace(type){ // 省市区联动
      if(type === 1){
        console.log('选择省')
        this.$axios.get(this.$api + 'patient/getProvince?projectId=1').then(res => { //获取省
          if(res.data.code === 200){
            this.proveiceList = res.data.data
            console.log(this.proveiceList)
          }
        })
      }else if(type === 2){
        if(this.addForm.provinceCode){
          this.$axios.get(this.$api + 'patient/getCity?provinceCode=' + this.addForm.provinceCode + '&projectId=1').then(res => { //获取市
            if(res.data.code === 200){
              this.cityList = res.data.data
            }
            console.log(res)
          })
        }
        console.log("省code", this.addForm.provinceCode)
      }else if(type ===3 ){
        if(this.addForm.provinceCode && this.addForm.cityCode){ //获取医院
          this.$axios.get(this.$api + 'patient/getHospital?provinceCode=' + this.addForm.provinceCode + '&projectId='+this.proId+'&cityCode=' + this.addForm.cityCode).then(res => {
            if(res.data.code === 200){
              this.hosList = res.data.data
            }
          })
        }
      }else if(type === 4){
        this.$axios.get(this.$api + 'patient/getProvince?projectId=1').then(res => { //获取通讯省
          if(res.data.code === 200){
            this.comProvinceList = res.data.data
          }
        })
      }else if(type === 5){
        if(this.addForm.comProvinceCode){ //获取通讯市区
          this.$axios.get(this.$api + 'patient/getCity?provinceCode=' + this.addForm.comProvinceCode + '&projectId=1').then(res => {
            if(res.data.code === 200){
              this.comCityList = res.data.data
            }
          })
        }
        console.log("省code", this.addForm.provinceCode)
      }
    },
    changePlace(type){ // 切换地区
      if(type === 1){
        this.addForm.cityCode = ''
        this.addForm.hospitalCode = ''
      }else if(type === 2){
        this.addForm.hospitalCode = ''
      }else if(type === 3){
        this.addForm.comCityCode = ''
      }
    },
    getProList() {
      let proData = {
        page: 1,
        rows: 50,
        status: 1
      };
      this.$axios.post(this.$api + "project/getProjectList", proData).then(res => { // 获取项目列表
          if (res.data.code == 200) {
            this.proList = res.data.data.rows      
          }
        });
    },
  }
};
</script>


<style scoped>
.AddPatient .dataTime >>> .el-input__inner{padding:0 0 0 23px;}
.AddPatient >>> .el-form--inline .el-form-item{margin-right:0;}
</style>