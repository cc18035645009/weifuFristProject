<template>
  <div class="PatientDetail" style="height: 100%; background: white;" v-loading="loading">
    <el-tabs v-model="activeTabNum" class="overH" @tab-click="changTab">
      <el-tab-pane label="基本资料" name="basic">
        <el-form ref="form" :model="basicForm":rules='basicFormRules' size="small" label-position="right" label-width="90px" class="mauto w10p overH">
          
          <el-card class="box-card mt10">
            <div slot="header" class="clearfix">
              <span>基本资料</span>
            </div>
            <el-row>
              <el-col :lg="4">
                <el-form-item label="患者姓名:">
                  <el-input v-model="basicForm.patientName" class="w100"></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="4">
                <el-form-item label="性别:">
                  <el-select v-model="basicForm.sex" class="w100" placeholder>
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="4" class="dataTime">
                <el-form-item label="出生年月:" label-width="90px">
                  <el-date-picker type="date" v-model="basicForm.birthday" class="w120"></el-date-picker> 
                </el-form-item>
              </el-col>
              <el-col :lg="4">
                <el-form-item label="省份:">
                  <el-select v-model="basicForm.provinceCode" class="w100" filterable placeholder="" @focus="checkPlace(1)" @change="changePlace(1)">
                    <el-option
                      v-for="item in proveiceList"
                      :key="item.provinceCode"
                      :label="item.provinceName"
                      :value="item.provinceCode">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="4">
                <el-form-item label="城市:">
                  <el-select v-model="basicForm.cityCode" class="w100" filterable placeholder @focus="checkPlace(2)" @change="changePlace(2)">
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
          </el-card>

          <el-card class="box-card mt10">
            <div slot="header" class="clearfix">
              <span>就诊信息</span>
            </div>
            <el-row>
              <el-col :lg="4">
                <el-form-item label="就诊医院:">
                  <!-- <el-select v-model="basicForm.hospitalCode" class="w10p" placeholder filterable @focus="checkPlace(3)">
                    <el-option
                      v-for="item in hosList"
                      :key="item.hospitalCode"
                      :label="item.hospitalName"
                      :value="item.hospitalCode">
                    </el-option>
                  </el-select> -->
                  {{basicForm.hospitalName}}
                </el-form-item>
              </el-col>
              <el-col :lg="4">
                <el-form-item label="主治医生:">
                  <el-input v-model="basicForm.attendDoctor" class="w80"></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="4">
                <el-form-item label="患者来源:">
                  <el-select v-model="basicForm.patientSource" class="w100" placeholder>
                    <el-option :label="item" :value="index+''" v-for="(item,index) in $serve.patientSource" :key='index' v-show='item'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>

          <el-card class="box-card mt10">
            <div slot="header" class="clearfix">
              <span>入组信息</span>
            </div>
            <el-row>
              <el-col :lg="4">
                <el-form-item label="活跃类型:">
                  <el-select v-model="basicForm.patientType" class="w100" placeholder >
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in $serve.patientType" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="4">
                <el-form-item label="所属专员:">
                  <el-input v-model="basicForm.commissioner" class="w100"></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="4">
                <el-form-item label="注册来源:">
                  <el-select v-model="basicForm.registerType" class="w120" placeholder>
                    <el-option label="电话注册" value="1"></el-option>
                    <el-option label="微信端注册" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="5">
                <el-form-item label="平台:">
                  <el-select v-model="basicForm.platform" style="width:170px" :disabled="true" placeholder>
                    <el-option label="生命阳光患者关爱平台" value="生命阳光患者关爱平台"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="3">
                <el-form-item label="销售代表:">
                  <el-input v-model="basicForm.represent" class="w100"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :lg="4" class="dataTime">
                <el-form-item label="首次用药:">
                  <el-date-picker
                    type="date"
                    placeholder
                    class="w100"
                    v-model="basicForm.firstDrugDate"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :lg="4">
                <el-form-item label="疾病类型:">
                  <el-select v-model="basicForm.diseaseType" class="w120" placeholder>
                    <el-option :label="item.label" :value="item.value" v-for="(item,i) in $serve.diseaseType" :key='i'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="4">
                <el-form-item label="疾病阶段:">
                  <el-select v-model="basicForm.diseaseStage" class="w120" placeholder>
                    <el-option :label="item.label" :value="item.value" v-for="(item,i) in $serve.diseaseStage" :key='i'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="5">
                <el-form-item label="疗程:">
                  <el-input-number size='mini' :min='1' class="w120" v-model="basicForm.periodOfTreatment"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :lg="4">
                <el-form-item label="是否随访:">
                  <el-select v-model="basicForm.isInGroup" class="w120" placeholder>
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :lg="4">
                <el-form-item label="所属项目:" >
                  {{basicForm.projectName}}
                </el-form-item>
              </el-col>
              <el-col :lg="4" class="dataTime">
                <el-form-item label="入组时间:">
                  <el-date-picker
                    :disabled='true'
                    type="date"
                    placeholder
                    class="w100"
                    v-model="basicForm.createTime"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :lg="4">
                <el-form-item label="服务需求:" >
                  <el-select v-model="basicForm.serviceModel" multiple :disabled='true' placeholder="请选择" style="width:355px">
                    <el-option label="随访" value="随访"></el-option>
                    <el-option label="邮寄资料" value="邮寄资料"></el-option>
                    <el-option label="电话" value="电话"></el-option>
                    <el-option label="短信" value="短信"></el-option>
                    <el-option label="电子邮件" value="电子邮件"></el-option>
                    <el-option label="微信" value="微信"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>

          <el-card class="box-card mt10">
            <div slot="header" class="clearfix">
              <span>联系方式</span>
            </div>
            <el-row>
              <el-col :lg="4">
                <el-form-item label="家属手机:" prop='familyPhone'>
                  <el-input v-model.number="basicForm.familyPhone" class="w100"></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="4">
                <el-form-item label="固定电话:" prop='fixedPhone'>
                  <el-input v-model.number="basicForm.fixedPhone" class="w100"></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="6">
                <el-form-item label="患者手机:" prop='patientPhone'>
                  <el-input v-model.number="basicForm.patientPhone" class="w100"></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="4">
                <el-form-item label="电子邮件:">
                  <el-input v-model="basicForm.email" class="w120"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>

          <!-- <el-row> 
            <el-col :lg="3">
              <el-form-item label="患者ID:">
                <el-input v-model="basicForm.patientCode" class="w100" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
          </el-row>
          <el-row>
            <el-col :lg="4">
              <el-form-item label="通讯省份:">
                <el-select v-model="basicForm.comProvinceCode" class="w100" placeholder filterable @focus="checkPlace(4)" @change="changePlace(3)">
                  <el-option
                    v-for="item in comProvinceList"
                    :key="item.provinceCode"
                    :label="item.provinceName"
                    :value="item.provinceCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="3">
              <el-form-item label="市:">
                <el-select v-model="basicForm.comCityCode" class="w100" filterable placeholder @focus="checkPlace(5)">
                  <el-option
                    v-for="item in comCityList"
                    :key="item.cityCode"
                    :label="item.cityName"
                    :value="item.cityCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="6">
              <el-form-item label="地址:">
                <el-input v-model="basicForm.comAddress" class="w10p"></el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="3">
              <el-form-item label="邮编:">
                <el-input v-model="basicForm.zipCode" class="w100"></el-input>
              </el-form-item>
            </el-col>
          </el-row> -->

          <el-form-item v-if="judgePowers.UpdatePatientInfo" class="fr mt20">
            <el-button type="success" @click.stop="rewriteBasic('form')">更新</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="随访" name="follow">
        <follow :patientCode="patientCode" v-if="activeTabNum == 'follow'" @goAe="activeTabNum = 'ae'"></follow>
      </el-tab-pane>
      <el-tab-pane label="呼入咨询" name="callCenter">
        <call-center :patientCode="patientCode" :patientId='patientId' v-if="activeTabNum == 'callCenter'" :mobile='basicForm.patientPhone'></call-center>
      </el-tab-pane>
      <el-tab-pane label="短信" name="message">
        <notice :patientCode="patientCode" v-if="activeTabNum == 'message'" :phone="basicForm.patientPhone"></notice>
      </el-tab-pane>
      <el-tab-pane label="AE报告" name="ae">
        <ae :patientCode="patientCode" :aeId="aeId" v-if="activeTabNum == 'ae'" :name='basicForm.patientName' :mobile='basicForm.patientPhone' ></ae>
      </el-tab-pane>
      <el-tab-pane label="邮件" name="email">
        <email-list v-if="activeTabNum == 'email'" :patientCode="patientCode"></email-list>
      </el-tab-pane>
      <!-- <el-tab-pane label="积分" name="bloodSugar">
        <blood-sugar v-if="activeTabNum == 'bloodSugar'" :mobile='basicForm.patientPhone'></blood-sugar>
      </el-tab-pane>
      <el-tab-pane label="打卡" name="clock">
        <clock v-if="activeTabNum == 'clock'" :mobile='basicForm.patientPhone'></clock>
      </el-tab-pane>
      <el-tab-pane label="赠药" name="giveDrug">
        <give-drug v-if="activeTabNum == 'giveDrug'" :mobile='basicForm.patientPhone'></give-drug>
      </el-tab-pane>
      <el-tab-pane label="文章" name="article">
        <article-list v-if="activeTabNum == 'article'" :mobile='basicForm.patientPhone'></article-list>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import CallCenter from "./CallCenter"
import Notice from "./Notice"
import Ae from "./AE"
import EmailList from "./EmailList"
import Follow from "./Follow"
import BloodSugar from './BloodSugar'
import Clock from './Clock'
import GiveDrug from './GiveDrug'
import ArticleList from './ArticleList'
import { mapState } from "vuex"
var checkTel = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('电话不能为空'));
    }
    setTimeout(() => {
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'));
      } else {
        callback();
      }
    }, 1000);
  };
 var checkPhone = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('手机不能为空'));
    }
    let regIdPhone = /^1\d{10}$/; 
    setTimeout(()=>{
      if(!regIdPhone.test(value)){
        callback(new Error('手机格式错误'));
      }else{
        callback()
      }
    },1000)
  };
export default {
  props: ["patientCode", "detailType", "aeId", 'activeTab','patientId'],
  data() {
    return {
      activeTabNum: "follow",
      loading: true,
      basicForm: { //用户基本信息
      },
      basicFormRules:{
        // fixedPhone:[{ required: false,validator:checkTel, trigger: 'blur'}],
        // familyPhone:[{ required: false,validator:checkPhone, trigger: 'blur'}],
        // patientPhone:[{ required: false,validator:checkPhone, trigger: 'blur'}]
      },
      dialogEmailVisible: false,
      proveiceList: [], // 省列表
      comProvinceList:[], // 通讯省列表
      cityList: [], // 城市列表
      comCityList: [], // 通讯城市列表
      hosList: [] // 医院列表
    }
  },
  computed: {
    ...mapState(["judgePowers"])
  },
  components: {
    CallCenter,
    Notice,
    Ae,
    Follow,
    EmailList,
    BloodSugar,
    Clock,
    GiveDrug,
    ArticleList
  },
  methods: {
    getPatientDetail() {// 获取患者详情
      this.$axios.post(this.$api + "patient/getPatientInfoByCode", {patientCode: this.patientCode}).then(res => {
        if(res.data.code === 200){
          let detailForm = res.data.data
          detailForm.patientType = detailForm.patientType
          detailForm.registerType = JSON.stringify(detailForm.registerType)
          detailForm.sex = JSON.stringify(detailForm.sex)
          detailForm.isInGroup = JSON.stringify(detailForm.isInGroup)
          detailForm.patientSource = JSON.stringify(detailForm.patientSource)
          detailForm.serviceModel = ['随访']//detailForm.serviceModel != '' ? JSON.parse(detailForm.serviceModel) : ''
          detailForm.platform = '生命阳光患者关爱平台'
          detailForm.periodOfTreatment = detailForm.periodOfTreatment?parseInt(detailForm.periodOfTreatment):''
          this.basicForm = detailForm
          this.checkPlace(1)
          this.checkPlace(2)
          this.checkPlace(3)
          this.checkPlace(4)
          this.checkPlace(5)
        }else{
          this.$message({
            message: res.data.message,
            type: "error",
            duration: 1500
          })
          this.$emit('closeDetail')
        }
      })
    },
    confirm() { // 提交
      console.log('提交信息成功')
    },
    changTab(name) { // 切换tab
      if(name.name == "basic"){
        this.getPatientDetail()
      }
    },
    checkPlace(type){ // 省市区联动
      if(type === 1){
        this.$axios.get(this.$api + 'patient/getProvince?projectId=1').then(res => { //获取省
          if(res.data.code === 200){
            this.proveiceList = res.data.data
          }
        })
      }else if(type === 2){
        if(this.basicForm.provinceCode){
          this.$axios.get(this.$api + 'patient/getCity?provinceCode=' + this.basicForm.provinceCode + '&projectId=1').then(res => { //获取市
            if(res.data.code === 200){
              this.cityList = res.data.data
            }
            console.log(res)
          })
        }
        console.log("省code", this.basicForm.provinceCode)
      }else if(type ===3 ){
        if(this.basicForm.provinceCode && this.basicForm.cityCode){ //获取医院
          this.$axios.get(this.$api + 'patient/getHospital?provinceCode=' + this.basicForm.provinceCode + '&projectId='+this.basicForm.projectId + '&cityCode=' + this.basicForm.cityCode).then(res => {
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
        if(this.basicForm.comProvinceCode){ //获取通讯市区
          this.$axios.get(this.$api + 'patient/getCity?provinceCode=' + this.basicForm.comProvinceCode + '&projectId=1').then(res => {
            if(res.data.code === 200){
              this.comCityList = res.data.data
            }
          })
        }
      }
    },
    rewriteBasic(formName){ //修改基本信息
      this.basicForm.serviceModel = JSON.stringify(this.basicForm.serviceModel)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post(this.$api + 'patient/modifyPatient', this.basicForm).then(res => {
            console.log(res)
            if(res.data.code === 200){
              this.$message({
                message: "保存成功",
                type: "success",
                duration: 1500
              })
              this.getPatientDetail()
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    changePlace(type){ // 切换地区
      if(type === 1){
        this.basicForm.cityCode = ''
        this.basicForm.hospitalCode = ''
      }else if(type === 2){
        this.basicForm.hospitalCode = ''
      }else if(type === 3){
        this.basicForm.comCityCode = ''
      }
    }
  },
  mounted() {
    this.getPatientDetail()
    console.log(this.patientCode);
    let that = this;
    that.loading = false;
    if(this.detailType === 'AE'){
      this.activeTabNum = 'ae'
    }
    this.activeTabNum = this.activeTab
  }
};
</script>

<style scoped>
.PatientDetail .dataTime >>> .el-input__inner {
  padding: 0 0 0 23px;
}
</style>
<style>
</style>
