<template>
  <div class="PreviewAe" v-loading="loading">
    <el-container>
      <el-main class="mt15">
        <el-form size="small" :model="aeForm" label-position="right" label-width="110px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="*客户反馈编号:" label-width="120px">
                <el-input v-model="aeForm.customerFeedbackNumber" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="个人响应时间:">
                <el-input v-model="aeForm.personalResponseTime" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="*分类:">
                <el-select v-model="aeForm.classification" filterable class="w100" :disabled="true" placeholder>
                  <el-option :label="item.label" :value="item.value" v-for="(item, index) in classifications" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="是否升级处理">
                <el-select v-model="aeForm.upgradeOrNot" class="w100 fl" :disabled="true" placeholder="">
                  <el-option label="否" :value="1"></el-option>
                  <el-option label="是" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 1、患者详细资料 -->
          <el-row>
            <el-col :span="24">
              <p class="bgef colorW pt5 pb5 pl15">1、患者详细资料</p>
            </el-col>
          </el-row>
          <el-row class="mt20">
            <el-col :span="12">
              <el-form-item label="*患者身份识别:(姓名首字母缩写、医院编号)" label-width="300px">
                <el-input v-model="aeForm.patientIdentification" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-form-item label="出生日期或年龄:" label-width="120px">
                <el-input v-model="aeForm.birthday" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="性别:" label-width="80px">
                <el-select v-model="aeForm.sex" class="w100 fl" :disabled="true" placeholder="">
                  <el-option label="男" :value="1"></el-option>
                  <el-option label="女" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="体重:" label-width="80px">
                <el-input v-model="aeForm.weight" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item label-width="10px">
                <el-select v-model="aeForm.weightUnit" :disabled="true" class="w80 fl" placeholder="">
                  <el-option label="磅" value="1"></el-option>
                  <el-option label="千克" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="身高:" label-width="80px">
                <el-input v-model="aeForm.height" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item label-width="5px">
                <el-select v-model="aeForm.heightUnit" :disabled="true" class="w80 fl" placeholder="">
                  <el-option label="英寸" value="1"></el-option>
                  <el-option label="厘米" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-form-item label="民族:" label-width="120px">
                <el-input v-model="aeForm.nation" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="是否已经向监管当局报告？" label-width="190px">
                <el-select v-model="aeForm.reported" :disabled="true" class="w80 fl" placeholder="">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="该报告是否符合当地快速报告的要求？" label-width="260px">
                <el-select v-model="aeForm.meetLocalRapidReport" :disabled="true" class="w100 fl" placeholder="">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 2、报告者信息 -->
          <el-row>
            <el-col :span="24">
              <p class="bgef colorW pt5 pb5 pl15">2、报告者信息（例如医疗保健专业人员、律师等）</p>
            </el-col>
          </el-row>
          <el-row class="mt15">
            <el-col :span="4">
              <el-form-item label="报告者姓名:">
                <el-input v-model="aeForm.reporterName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="报告者地址:">
                <el-input v-model="aeForm.reporterAddress" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="电话号码:">
                <el-input v-model="aeForm.reporterPhone" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-form-item label="邮政编码:">
                <el-input v-model="aeForm.zipCode" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="国家:">
                <el-input v-model="aeForm.country" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="报告者身份:">
                <el-select v-model="aeForm.reporterIdentity" :disabled="true" class="w150 fl" placeholder="">
                  <el-option label="医生" :value="1"></el-option>
                  <el-option label="药剂师" :value="2"></el-option>
                  <el-option label="其他卫生专业人员" :value="3"></el-option>
                  <el-option label="律师" :value="4"></el-option>
                  <el-option label="非卫生专业人员" :value="5"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="详细说明:">
                <el-input v-model="aeForm.detailedDescription" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 3、怀疑药物如果已知 -->
          <div class="overH">
            <el-row>
              <el-col :span="24">
                <p class="bgef colorW pt5 pb5 pl15">3、怀疑药物如果已知，请列出商品名</p>
              </el-col>
            </el-row>
            <el-table :data="aeForm.suspectedDrugAeYoumilinList"  style="width: 100%" class="dataTime" size="mini" :highlight-current-row="true">
              <el-table-column prop="suspectedDrug" label="药品名" align="left"></el-table-column>
              <el-table-column prop="batchNumber" label="批号" align="left"></el-table-column>
              <el-table-column prop="indication" label="适应症" align="left"></el-table-column>
              <el-table-column prop="unit" label="剂量、单位和频率" align="left"></el-table-column>
              <el-table-column prop="routeOfAdministration" label="给药途径" align="left"></el-table-column>
              <el-table-column prop="startDate" label="开始日期" align="left"></el-table-column>
              <el-table-column prop="endDate" label="结束日期" align="left"></el-table-column>
              <el-table-column prop="measures" label="对怀疑药物所采取的措施" align="left"></el-table-column>
            </el-table>
          </div>
          <!-- 4、不良事件描述 -->
          <el-row class="mt20">
            <el-col :span="24">
              <p class="bgef colorW pt5 pb5 pl15">4、不良事件描述（不良事件的诊断 如果诊断未知，请列出症状）</p>
            </el-col>
          </el-row>
          <el-table :data="aeForm.describeAeBaimidaList"  style="width: 100%" size="mini" class="dataTime" :highlight-current-row="true">
            <el-table-column prop="description" label="不良事件描述" align="left"></el-table-column>
            <el-table-column prop="description" label="不良事件描述" align="left"></el-table-column>
            <el-table-column prop="startDate" label="开始日期" align="left"></el-table-column>
            <el-table-column prop="endtDate" label="结束日期或持续时间" align="left"></el-table-column>
            <el-table-column prop="strength" label="强度" align="left"></el-table-column>
            <el-table-column prop="result" label="序号" align="left"></el-table-column>
          </el-table>
          <el-row class="mt20">
            <el-col :span="6">
              <el-form-item label="停药或减少药量后不良事件是否好转？" label-width="260px">
                <el-select v-model="aeForm.improve" class="w150 fl" :disabled="true" placeholder="">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="2"></el-option>
                  <el-option label="不适用" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="重新用药以后不良事件是否再次出现？" label-width="260px">
                <el-select v-model="aeForm.again" class="w150 fl" :disabled="true" placeholder="">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="2"></el-option>
                  <el-option label="不适用" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <el-form-item label="*结果:" label-width="100px">
                <el-input v-model="aeForm.result" class="w70" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <p class="lh30">1 = 恢复/治愈 | 2 = 恢复中/好转中 | 3 = 没有恢复/没有治愈4 = 恢复/治愈，具有后遗症 | 5 = 死亡 | 6 = 未知</p>
            </el-col>
          </el-row>
          <!-- *5、不良事件相关过程描述 -->
          <el-row>
            <el-col :span="24">
              <p class="bgef colorW pt5 pb5 pl15">*5、不良事件相关过程描述（包括症状、体征、临床检验、程度、结束日期等）及处理情况：</p>
            </el-col>
          </el-row>
          <el-row class="mt15">
            <el-col :span="20">
              <el-form-item label-width="0">
                <el-input type="textarea" v-model="aeForm.processDescription" :disabled="true" :rows="4"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="报告者是否认为该事件可能由怀疑药物引起？" label-width="300px">
                <el-select v-model="aeForm.causedBySuspectedDrugs" :disabled="true" class="w80 fl" placeholder="">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="原因：">
                <el-input v-model="aeForm.reason" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 6、严重性 -->
          <el-row>
            <el-col :span="24">
              <p class="bgef colorW pt5 pb5 pl15">6、严重性</p>
            </el-col>
          </el-row>
          <el-row class="mt15">
            <el-col :span="4">
              <el-form-item label="该不良事件是否严重？" label-width="160px">
                <el-select v-model="aeForm.serious" :disabled="true" class="w80 fl" placeholder="">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="如果是，请选择下列标准:" label-width="180px">
                <el-select v-model="aeForm.severeStandard" :disabled="true" placeholder="" class="w10p">
                  <el-option label="死亡" :value="1"></el-option>
                  <el-option label="立即危及生命" :value="2"></el-option>
                  <el-option label="住院/延长住院" :value="3"></el-option>
                  <el-option label="有持续或显著的伤残或能力丧失" :value="4"></el-option>
                  <el-option label="先天异常/出生缺陷" :value="5"></el-option>
                  <el-option label="重要医学事件" :value="6"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="如果为'死亡'，请详细说明死亡原因:" label-width="260px">
                <el-input v-model="aeForm.causeOfDeath" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4" class="dataTime">
              <el-form-item  label="死亡日期:">
                <el-date-picker type="date" :disabled="true" placeholder="" v-model="aeForm.dateOfDeath" style="width: 100%"></el-date-picker>                  
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="是否进行尸检？" :disabled="true" label-width="180px">
                <el-select v-model="aeForm.autopsy" placeholder="" class="w10p">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 7、相关病史/并发症 -->
          <el-row>
            <el-col :span="24">
              <p class="bgef colorW pt5 pb5 pl15">7、相关病史/并发症（也包括药物反应、过敏、环境因素和（或）药物 & 酒精滥用情况</p>
            </el-col>
          </el-row>
          <el-row class="mt15">
            <el-col :span="20">
              <el-form-item label-width="0">
                <el-input type="textarea" v-model="aeForm.medicalHistory" :rows="4" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 8、合并用药 -->
          <div class="overH">
            <el-row>
              <el-col :span="24">
                <p class="bgef colorW pt5 pb5 pl15">8、合并用药（不包括处理该事件所用的药物）</p>
              </el-col>
            </el-row>
            <el-table :data="aeForm.combinedDrugAeYoumilinList"  style="width: 100%" size="mini" class="dataTime" :highlight-current-row="true">
              <el-table-column prop="combinedDrug" label="合并用药" align="left"></el-table-column>
              <el-table-column prop="indication" label="适应症" align="left"></el-table-column>
              <el-table-column prop="dailyDose" label="日剂量" align="left"></el-table-column>
              <el-table-column prop="routeOfAdministration" label="给药途径" align="left"></el-table-column>
              <el-table-column prop="startDate" label="开始日期" align="left"></el-table-column>
              <el-table-column prop="endDate" label="结束日期" align="left"></el-table-column>
            </el-table>
          </div>
          <!-- 9、填表人信息 -->
          <el-row class="mt15">
            <el-col :span="24">
              <p class="bgef colorW pt5 pb5 pl15">9、填表人信息</p>
            </el-col>
          </el-row>
          <el-row class="mt15">
            <el-col :span="6">
              <el-form-item label="ID & 手机号:">
                <el-input  v-model="aeForm.idOrPhone" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="padding-bottom: 100px">
              <el-form-item label="邮箱:">
                <el-input  v-model="aeForm.mailbox" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
const dbClassType = [ // 双百 百泌达AE分类|百达扬AE分类
  {label: "死亡", value: "1"},{label: "降糖效果不好", value: "2"},{label: "妊娠糖尿病", value: "3"},{label: "疗效不好", value: "4"},
  {label: "恶心呕吐", value: "5"},{label: "头晕乏力", value: "6"},{label: "高血糖", value: "7"},{label: "皮疹", value: "8"},
  {label: "低血糖", value: "9"},{label: "体重下降", value: "10"},{label: "腹泻", value: "11"},{label: "食欲减退", value: "12"},
  {label: "便秘", value: "13"},{label: "肠胃不适", value: "14"},{label: "注射部位不适", value: "15"},{label: "心慌", value: "16"},
  {label: "过敏", value: "17"},{label: "浑身无力", value: "18"},{label: "心脏不适", value: "19"},{label: "脱发", value: "20"},
  {label: "药液变色", value: "21"}
]
const ymlClassType = [ // 优泌淋AE分类
  {label: "死亡", value: "1"},{label: "妊娠糖尿病", value: "2"},{label: "血糖控制不佳", value: "3"},{label: "自行停药", value: "4"},
  {label: "副作用", value: "5"},{label: "漏打", value: "6"},{label: "自行更改剂量", value: "7"},{label: "住院", value: "8"},
  {label: "未按处方用药", value: "9"},{label: "注射部位不适", value: "10"},{label: "并发症", value: "11"},{label: "使用不便", value: "12"},
  {label: "漏液", value: "13"},{label: "手术", value: "14"},{label: "降糖效果不好", value: "15"},{label: "头晕", value: "16"},
  {label: "注射剂量不准确", value: "17"},{label: "注射笔故障", value: "18"},{label: "药品问题", value: "19"}
] 
export default {
  name: 'PreviewAe',
  props: ['patientCode'],
  data() {
    return {
      loading: false,
      goodsEdit: false, // 新增药物
      aeForm: { // AE表单
        combinedDrugAeYoumilinList: [], // 合并用药
        suspectedDrugAeYoumilinList: [], // 怀疑产品
        describeAeBaimidaList: [], // 不良事件描述
        id: '',
        code: '',
        customerFeedbackNumber: '',
        classification: '',
        upgradeOrNot: '',
        isFirstReport: '',
        followReportNumber: '',
        lilaiKnowDate: '',
        upgradeWorkOrder: '',
        patientCode: this.patientCode,
        patientName: '',
        birthday: '',
        years: '',
        sex: '',
        weight: '',
        weightUnit: '',
        height: '',
        heightUnit: '',
        nation: '',
        patientPhone: '',
        patientHistory: '',
        pastAdverseDrugEvents: '',
        familyAdverseDrugEvents: '',
        reporterName: '',
        reporterAddress: '',
        reporterPhone: '',
        reporterType: '',
        reporterOthers: '',
        familyRelationship: '',
        doctorMessage: '',
        doctorName: '',
        doctorDepartment: '',
        doctorPhone: '',
        adverseEventDescription: '',
        adverseEventResult: '',
        sequelae: '',
        deathTime: '',
        deathReason: '',
        dealWithSuspectDrug: '',
        doseChange: '',
        adverseEventChange: '',
        adverseEventReappear: '',
        reporterRelation: '',
        willingToReceiveFollow: '',
        filling_person: '',
        aeCommissioner: ''
      }, 
      classifications: [],// AE项目分类 
    }
  },
  methods: {
    getAe(){ // 根据患者code获得优泌淋ae报告
      this.$axios.get(this.$api + 'aeYoumilinReport/getByPatientCode?patientCode=' + this.patientCode).then(res => {
        console.log('获取AE报告', res)
      })
    },
    saveAe(){ // 保存AE报告
      let aeData = this.aeForm
      this.$axios.post(this.$api + 'aeBaimidaReport/newOne', aeData).then(res => {
        console.log(res)
      })
    },
    getAeDetail(id){ // 获取AE详情
      this.$axios.get(this.$api + 'aeBaimidaReport/getOneById?id=' + id).then(res => {
        if(res.data.code === 200){
          let aeData = res.data.data
          aeData.classification = JSON.stringify(aeData.classification)
          this.aeForm = aeData
          this.isAeList = false
          this.isAdd = true
          this.loading = false
        }
      })
    }
  },
  mounted(){
    this.classifications = dbClassType
    this.getAe()
    this.getAeDetail(this.$route.query.aeId)
  }
}
</script>

<style scoped>
.PreviewAe >>> .el-input__inner{padding:0 0 0 7px;}
.PreviewAe .dataTime >>> .el-input__inner{padding:0 0 0 23px;}
.PreviewAe .dataTime >>> .el-input__prefix{left: 0;}
.PreviewAe{overflow-y: scroll;height: 700px;}
</style>
