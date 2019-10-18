<template>
  <div class="Follow">
    <el-container>
      <el-aside width="340px">
        <!-- 随访问卷阶段切换 -->
        <el-card class="box-card mt10">
            <div slot="header" class="clearfix">
              <span>随访问卷(点击可切换)</span>
            </div>
            <el-table :data="stageList" ref="stageTable" size="mini" :highlight-current-row="true" @row-click="changeStage">
              <el-table-column prop="templateStageName" label="随访阶段" align="center"></el-table-column>
              <el-table-column prop="followDate" label="需随访时间" align="center" :formatter="formatTime"></el-table-column>
              <el-table-column prop="status" label="当前状态" :formatter="formatStatus" align="center"></el-table-column>
            </el-table>
        </el-card>
        
        <!-- 电话日志 -->
        <el-card class="box-card mt10">
            <div slot="header" class="clearfix">
              <span>电话日志</span>
            </div>
            <el-table :data="phoneList" size="mini" :highlight-current-row="true">
              <el-table-column prop="createUserName" label="处理人" align="center" width="65"></el-table-column>
              <el-table-column prop="dealDate" label="处理日期" align="center" width="90" :formatter="formatTime"></el-table-column>
              <el-table-column prop="status" label="电话状态" :formatter="formatPhoneStatus" width="90" show-overflow-tooltip align="center"></el-table-column>
              <el-table-column prop="dealDate" label="预约日期" align="center" width="90" show-overflow-tooltip :formatter="formatTime">
                <template slot-scope="scope">
                  {{scope.row.orderDate | formatPrice}}<br/>{{timeArr[scope.row.timeSlot]}}
                </template>
              </el-table-column>
              <el-table-column prop="dealDate" label="操作" align="center" width="50" show-overflow-tooltip :formatter="formatTime">
                <template slot-scope="scope">
                  <el-button type='text' @click="delLog(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-card>
        
      </el-aside>
      <div v-loading="loading" class="ml30 mt10 w10p">
        <el-card :border='false' class="mb10 posRel" @click.native="active = 1">
          <div :class="['fz12 posAbs cue colorW pt5 pr10 pb5 pl10 borRad',active==1?'':'no',]">基本信息</div>
           <el-row class="pl60 pt20 pb10">
            <el-col :lg='6'>
              <p>随访阶段：<span style="color: red">{{ selectStage?selectStage.templateStageName:'' }}</span></p>
            </el-col>
            <el-col :lg='6'>
              <p>姓名：<span class="colorblue over inline" style="vertical-align: bottom;width:76px">{{ toneStatusF.patientName }}</span></p>
            </el-col>
            <el-col :lg='6'>
              <p>患者电话：<span class="colorblue">{{ toneStatusF.patientPhone }}</span></p>
            </el-col>
            <el-col :lg='6'>
              <p>项目：<span class="colorblue">{{ toneStatusF.projectName }}</span></p>
            </el-col>
           </el-row>
          <el-row class="pl60 pb10">
            <el-col :lg='6'>
              <p>患者来源：<span class="colorblue">{{ toneStatusF.patientSource?$serve.patientSource[toneStatusF.patientSource]:'' }}</span></p>
            </el-col>
            <el-col :lg='8' class="flex alic">
              <span>明星患者：</span>
              <el-radio-group v-model="isStarPatient" @change="setStarPatient">
                <el-radio :label="1" class="fz12">否</el-radio>
                <el-radio :label="2" class="fz12">是</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-card>

        <el-card :border='false' class="mb10 posRel">
          <div :class="['fz12 posAbs cue colorW pt5 pr10 pb5 pl10 borRad',active==2?'':'no',]">初始状态</div>
          <!-- T1初始化状态 -->
          <el-form size="small" class="pl60 pt20 clear" :model="toneStatusF" ref="toneStatusF" label-position="right">
            <el-row>
              <!-- <el-col :span="5">
                <el-form-item label="是否老患者:">
                  <el-select v-model="toneStatusF.isOld" class="w80 fl" placeholder>
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
              <el-col :lg="6">
                <el-form-item label="患者类型:" label-width="90px">
                  <el-select v-model="toneStatusF.patientStatus" class="w100" placeholder @focus="active = 2" :disabled='selectStage&&selectStage.status == 1?false:true'>
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in $serve.patientStatus" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="6">
                <el-form-item label="疾病类型:" label-width="90px">
                  <el-select v-model="toneStatusF.diseaseType" class="w100" placeholder @focus="active = 2" :disabled='selectStage&&selectStage.status == 1?false:true'>
                    <el-option :label="item.label" :value="item.value" v-for="(item,i) in $serve.diseaseType" :key='i'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="7">
                <el-form-item label="疾病阶段:" label-width="110px">
                  <el-select v-model="toneStatusF.diseaseStage" class="w100" placeholder @focus="active = 2" :disabled='selectStage&&selectStage.status == 1?false:true'>
                    <el-option :label="item.label" :value="item.value" v-for="(item,i) in $serve.diseaseStage" :key='i'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>     
            </el-row>
            <el-row >
              <el-col :lg="6">
                <el-form-item label="疗程:" label-width="90px">
                  <el-input-number size='mini' :min='1' class="w100" v-model="toneStatusF.periodOfTreatment" @focus="active = 2" :disabled='selectStage&&selectStage.status == 1?false:true'></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :lg="6" label-width="90px">
                <el-form-item label="是否需要随访:" >
                  <el-select v-model="toneStatusF.isInGroup" class="w90" placeholder @focus="active = 2" :disabled='selectStage&&selectStage.status == 1?false:true'>
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="7" class="dataTime">
                <el-form-item 
                label="开始使用时间:" 
                label-width="110px"
                prop="firstDrugDate"
                :rules="[{ required: true, message: '不能为空' ,trigger: ['blur', 'change']}]"
                >
                  <el-date-picker
                    :disabled='selectStage&&selectStage.status == 1?false:true'
                    @focus="active = 2"
                    type="date"
                    placeholder
                    class="w100"
                    v-model="toneStatusF.firstDrugDate"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :lg="4" class="ml20">
                <el-form-item>
                  <el-button type="primary" 
                  @click.stop="updateFirst('toneStatusF')" 
                  icon="el-icon-refresh-left" 
                  v-if='selectStage.sort == 1 && selectStage.status == 1'
                  >更新初始化状态</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form> 
        </el-card>

        <el-card :border='false' class="mb10 posRel">
          <div :class="['fz12 posAbs cue colorW pt5 pr10 pb5 pl10 borRad',active==3?'':'no',]">拨打状态</div>
          <!--保存电话日志-->
          <el-form size="small" :model="phoneForm" label-position="right" class="mt30 clear">
            <el-row class="mt10">
              <el-col :lg="7">
                <el-form-item label="本次拨打了:" label-width="150px">
                  <el-select v-model="phoneForm.phoneType" class="w120 fl" placeholder @focus="active = 3" >
                    <el-option label="患者手机" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="7">
                <el-form-item label="接听状态:" label-width="150px">
                  <el-select v-model="phoneForm.status" class="w120 fl" placeholder @focus="active = 3" >
                    <el-option :label="item.name" :value="item.id+''" v-for="(item,index) in $serve.status" :key='index'></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :lg="7" class="dataTime">
                <el-form-item label="下次非常规预约日期:" label-width="150px">
                  <el-date-picker
                    
                    @focus="active = 3"
                    type="date"
                    placeholder
                    class="w120"
                    v-model="phoneForm.orderDate"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :lg="7">
                <el-form-item label="下次非常规预约时间:" label-width="150px">
                  <el-select v-model="phoneForm.timeSlot" class="w120 fl" placeholder @focus="active = 3" clearable>
                    <el-option label="7:00~9:00" value="1"></el-option>
                    <el-option label="9:00~11:00" value="2"></el-option>
                    <el-option label="11:00~13:00" value="3"></el-option>
                    <el-option label="13:00~15:00" value="4"></el-option>
                    <el-option label="15:00~17:00" value="5"></el-option>
                    <el-option label="17:00~19:00" value="6"></el-option>
                    <el-option label="19:00~21:00" value="7"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="3" class="ml15 mr10">
                <el-form-item>
                  <!-- :disabled='selectStage&&selectStage.status == 1?false:true' -->
                  <el-button type="primary"  @click="active = 3"  class="fr" icon="el-icon-tickets" @click.stop="savePhone">保存电话日志</el-button>
                </el-form-item>
              </el-col>
              <!-- <el-col :lg="3">
                <el-form-item> 
                  <el-button type="danger" class="fr ml20" icon="el-icon-warning" @click="goAe">不良事件报告</el-button>
                </el-form-item>
              </el-col> -->
            </el-row>
          </el-form>
        </el-card>
        
        <el-card :border='false' class="mb10 posRel">
          <div :class="['fz12 posAbs cue colorW pt5 pr10 pb5 pl10 borRad',active==4?'':'no',]">用药状态</div>
          <!-- 用药状态 -->
          <el-form label-position="right" size="small" class="pl60 pt20">
            <el-form-item label="用药状态:">
              <el-select v-model="selectStage.drugStatus" @change="saveDrugStatus" @focus="active = 4" >
                <el-option label='用药中' :value="1"></el-option>
                <el-option label='暂停用药' :value="2"></el-option>
                <el-option label='停止用药' :value="3"></el-option>        
                <el-option label='未启用（已处方）' :value="4"></el-option>
                <el-option label='非患者' :value="5"></el-option>
                <el-option label='重新使用' :value="6"></el-option>         
                <el-option label='不依赖用药状态' :value="7"></el-option>     
              </el-select>
            </el-form-item> 
          </el-form>
        </el-card>

        <el-card :border='false' class="mb10 posRel clear pb30">
          <div :class="['fz12 posAbs cue colorW pt5 pr10 pb5 pl10 borRad',active==5?'':'no',]">随访问卷</div>
          <h3 class="pt30 pl60 mt20 lh40">{{ quesPaper.paperName }}</h3>
          <!--问卷-->
          <el-form label-position="top" size="small" v-loading="paperLoading" class="pl60">
            <el-form-item
              v-for="n in paperForm.answerList"
              :label="n.questionRepository.question+'：'"
              :key="n.key"
            >
              <!-- 单选 -->
              <el-radio-group v-model="n.optionId" v-if="n.questionRepository.type === 1" @change="setName">
                <el-radio v-for="(i, idx) in n.questionOption" :label="i.id" :key="idx" class="mb5">{{ i.questionOption }}<i class="el-icon-close ml10" v-if="n.optionId == i.id" @click.prevent="n.optionId = ''"></i></el-radio>
              </el-radio-group>
              <!-- 多选 -->
              <el-checkbox-group v-model="n.optionId" v-if="n.questionRepository.type === 2" @change="setName" >
                <el-checkbox v-for="(i, idx) in n.questionOption" :label="i.id" :key="idx">{{ i.questionOption }}</el-checkbox>
              </el-checkbox-group>
              <!-- 填空 -->
              <el-input @focus="active = 5" type="textarea" style="width: 600px" class="fl" v-model="n.answer" v-if="n.questionRepository.type === 3" :rows="4"  placeholder="请输入内容" ></el-input>
              <!-- 时间 -->
              <el-date-picker @focus="active = 5" type="date" v-if="n.questionRepository.type === 4" v-model="n.answer"></el-date-picker>
            </el-form-item>
            <el-row class="fr" type="flex" justify="start">
              <el-button type="primary" size="small" @click.stop="saveStageAnswer"  class="mr10" icon="el-icon-tickets">保存问卷</el-button>
              <el-button type="danger" size="small" class="mr10" icon="el-icon-warning" >不良事件报告</el-button>
              <el-button type="success" size="small">工单报告</el-button>
            </el-row>
          </el-form>
        </el-card>
        
        <!-- 右侧提示 start -->
        <!-- <div class="posFix right0 mr20 mt120">
          <div class="posRel mb20 bgf pl10 pb10 pr10 pt10 borRad boxSha" v-show='showBlood'>
            <i class="el-icon-error posAbs icon cursor fz18" @click="setPop('showBlood')"></i>
            <div class="fw fz12 mb5">血糖：</div>
            <div ref="line" style="width:316px;height:100px;" ></div>
          </div>
          <div class="posRel mb20 bgf pl10 pb10 pr10 pt10 borRad boxSha" v-show='showClock'>
            <i class="el-icon-error posAbs icon cursor fz18" @click="setPop('showClock')"></i>
            <div class="fw fz12 mb5">打卡：</div>
            <calendar style="width:316px;" :mobile='toneStatusF.patientPhone' v-if='showCalendar'></calendar>
          </div>
          
        </div> -->
        <!-- 右侧提示 end -->
      </div>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { setTimeout } from 'timers';
import { constants } from 'crypto';
import Calendar from './Calendar'
export default {
  name: "Follow",
  props: ["patientCode"],
  data() {
    return {
      paperLoading: false, // 用药状态问卷切换
      radio2: 3,
      loading: false,
      checkList: [],
      toneStatusF:{ // T1初始化状态
        patientCode: this.patientCode,
        firstDrugDate: '',
        // isOld: ''
        isInGroup: '',
        patientStatus:'',
        diseaseType:'',
        diseaseStage:'',
        periodOfTreatment:''
      }, 
      phoneList:[], // 电话日志
      phoneForm:{ // 电弧日志表单
        phoneType: '1',
        stageDataId: '',
        status: '1',
        orderDate: '',
        timeSlot: '',
        patientCode: this.patientCode
      }, 
      quesPaper:{ // T次对应问卷
        radio2:'',
        checkList: '',
        textarea: ''
      },
      paperForm: { // 问卷表单

      },
      stageList: [], // 随访阶段列表
      selectStage: {// 被选中随访阶段 
        drugStatus:'',
        status:'',
        sort:'',
        templateStageName:''
      } ,
      selectStageIndex:0,
      userBloodCurve:[],
      showBlood:true,
      showClock:true,
      showCalendar:false,
      active:1,//点击变色
      isStarPatient:1 ,//是否明星患者
      timeArr:["7:00~9:00","9:00~11:00","11:00~13:00","13:00~15:00","15:00~17:00","17:00~19:00","19:00~21:00"]
    }
  },
  computed: {},
  components: {
    Calendar
  },
  mounted() {
    this.getfollowStageData()
    this.getPatientDetail()
    console.log('随访code', this.patientCode)
  },
  methods: {
    getPatientDetail() {// 获取患者详情
      this.$axios.post(this.$api + "patient/getPatientInfoByCode", {patientCode: this.patientCode}).then(res => {
        if(res.data.code === 200){
          let detailForm = res.data.data
          detailForm.isInGroup = JSON.stringify(detailForm.isInGroup)
          detailForm.isOld = detailForm.isOld?JSON.stringify(detailForm.isOld):''
          detailForm.periodOfTreatment = detailForm.periodOfTreatment?parseInt(detailForm.periodOfTreatment):''
          this.isStarPatient = detailForm.isStarPatient?detailForm.isStarPatient:1
          this.toneStatusF = detailForm
          //this.getUserBloodCurve(detailForm.patientPhone)//获取血糖数据
          this.showCalendar = true
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
    checkRadio(item){
      console.log(item)
    },
    checkBoxs(item){
      console.log(item)
    },
    goAe(){ // 不良事件报告
      this.$emit('goAe')
    },
    changeStage(row, event, column) { // 切换状态显示对应随访信息
      console.log('选中T次阶段数据', row)
      this.selectStage = {...row}
      this.selectStageIndex = this.stageList.findIndex(res=>res.id == row.id)
      this.loading = true
      this.getPhoneHis(row.templateStageId)
      this.getPaperByDrugStatus(row.drugStatus, row.id)
      setTimeout(() => {
        this.loading = false;
      }, 300);
    },
    getPatientAnwser(id){ // 获取某个患者的某个T次回答详情
      this.$axios.get(this.$api + 'followStageData/getByStageDataId?stageDataId=' + id).then(res => {
        if(res.data.data.length !=0&&res.data.code === 200){
          console.log('某个患者的某个T次回答详情', res)
          this.paperForm.answerList.map((item ,index)=>{
            let oneQuetion = res.data.data.find( val => val.questionId == item.questionId)
            if(oneQuetion){
              item.questionId = oneQuetion.questionId
              item.questionName = oneQuetion.questionName
              if(oneQuetion.questionType ==2){
                item.optionId = oneQuetion.optionId?oneQuetion.optionId.split(',').map((item)=>parseInt(item)):[]
              }else{
                item.optionId = parseInt(oneQuetion.optionId)
              }
              item.optionName = oneQuetion.optionName
              item.answer = oneQuetion.answer
            }
          })       
        }
      })
    },
    saveDrugStatus(){ // 保存用药状态
      let statusData = {
        id: this.selectStage.id,
        drugStatus: this.selectStage.drugStatus
      }
      console.log(statusData)
      this.$axios.post(this.$api + 'followStageData/saveDrugStatus', statusData).then(res => {
        if(res.data.code === 200){
          this.getPaperByDrugStatus(this.selectStage.drugStatus, this.selectStage.id)
          this.getfollowStageData()//跟新左侧T次
        }
      })
    },
    setName(val){
      this.paperForm.answerList.map(item=>{  
        if(Array.isArray(item.optionId)&&Array.isArray(val)){//多选
          if(item.optionId.sort().toString() == val.sort().toString()){
            let arr = []
            val.map(n=>{
              arr.push(item.questionOption.find(j=>j.id == n).questionOption)
            })
            item.optionName = arr.join(',')
          }
        }else{//单选
          if(item.optionId == val){
            item.optionName = item.questionOption.find(n=>n.id==val)?item.questionOption.find(n=>n.id==val).questionOption:''
          }
        }
      })   
      this.active = 5
    },
    getPaperByDrugStatus(drugStatus, id){ // 根据用药状态获取问卷
      if(!drugStatus){
        this.paperForm = { // 问卷表单
            answerList:[]
          }
        return false
      }
      this.paperLoading = true
      this.$axios.get(this.$api + 'followStageData/getPaperByDrugStatus?paperId='+this.selectStage.paperId + '&drugStatus=' + drugStatus).then(res => {
        if(res.data.data.length != 0&&res.data.code === 200){
          console.log(res)
          this.quesPaper = res.data.data
          let answerArr = []
          
          res.data.data.questionToList.map((item)=>{
            let questionArr = []
            item.optionList.map((n)=>{
              questionArr.push({
                id:n.id,
                questionOption:n.questionOption
              })
            })
            answerArr.push({
              questionOption:questionArr,
              questionRepository:item.questionRepository,
              
              questionName:item.questionRepository.question,
              questionId:item.questionRepository.id,
              questionType:item.questionRepository.type,
              optionId:item.questionRepository.type === 2?[]:'',
              optionName:'',
              answer: ''
            })
          })
          console.log(answerArr)
          this.paperForm = { // 问卷表单
            answerList:answerArr
          }
          this.getPatientAnwser(id)
          console.log('选中T次问卷', this.quesPaper)
          setTimeout(() => {
            this.paperLoading = false
          }, 300)
        }
      })
    },
    delLog(row){//删除电话日志
      this.$axios.get(this.$api + 'telRecord/deleteOne?id='+row.id).then(res => {
        if(res.data.code === 200){
          this.$message({
            message: res.data.message,
            type: "success",
            duration: 1500
          })
          this.getPhoneHis(this.selectStage.templateStageId)
        }else{
          this.$message({
            message: res.data.message,
            type: "warning",
            duration: 1500
          })
        }
      })
    },
    savePhone(){ // 保存电话日志
      this.phoneForm.stageDataId =  this.selectStage.id
      this.phoneForm.createUserId = JSON.parse(localStorage.getItem('userInfo')).employeeId
      this.$axios.post(this.$api + 'telRecord/saveOne', this.phoneForm).then(res => {
        console.log(res)
        if(res.data.code === 200){
          this.$message({
            message: "保存电话日志成功",
            type: "success",
            duration: 2500
          })
          this.getPhoneHis(this.selectStage.templateStageId)
          this.getfollowStageData(true)//跟新左侧T次
        }else{
          this.$message({
            message: res.data.message,
            type: "warning",
            duration: 1500
          })
        }
      })
    },
    getfollowStageData(noUpFrom){ // 获取某个患者的T次数据
      this.$axios.get(this.$api + 'followStageData/getByPatientCode?patientCode=' + this.patientCode).then(res => {
        if(res.data.code === 200){
          if(res.data.data.length > 0){
            this.stageList = res.data.data
          //如果没有未完成的，自动展示已完成最后一条
          //  let idx = res.data.data.findIndex((item)=>item.status == 1) == -1 ? res.data.data.length-1 : res.data.data.findIndex((item)=>item.status == 1);
          //  this.$refs.stageTable.setCurrentRow(this.stageList[idx])
          //  this.selectStage = this.stageList[idx]  
          //  this.getPhoneHis(this.selectStage.templateStageId)
          //  this.getPaperByDrugStatus(this.stageList[idx].drugStatus, this.stageList[idx].id)
           this.selectStage = this.stageList[this.selectStageIndex]
           this.$refs.stageTable.setCurrentRow(this.selectStage)  
           this.getPhoneHis(this.selectStage.templateStageId)
           if(noUpFrom){
            return false
           }
           this.getPaperByDrugStatus(this.selectStage.drugStatus, this.selectStage.id)
          }
        }
      })
    },
    updateFirst(formName){ //更新初始化状态
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post(this.$api + 'patient/modifyPatient', this.toneStatusF).then(res => {
              if(res.data.code === 200){
                this.$message({
                  message: "保存成功",
                  type: "success",
                  duration: 1500
                })
                this.getPatientDetail() 
                this.getfollowStageData(true)//跟新左侧T次
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    saveStageAnswer(){ // 保存问卷答案
      let answer = this.quesPaper.questionToList
      console.log(this.paperForms)
      let answerList = this.paperForm.answerList.map((item)=>{
        if(Array.isArray(item.optionId)){
          item.optionId = item.optionId.join(',')
        }
        if(item.questionType == 4&&item.answer == null){
          item.answer = ''
        }
        return item
      })
      let answerData = {
        patientCode: this.patientCode,
        stageDataId:this.selectStage.id,
        answerList:answerList,
        createUserId:JSON.parse(localStorage.getItem('userInfo')).employeeId,
        patientId:this.toneStatusF.id
      }
      console.log('保存问卷字段·', this.paperForm)
      console.log(answerData)
      console.log('回答列表', this.quesPaper.questionToList)
      // this.savePhone()//保存问卷
      this.$axios.post(this.$api + 'followStageData/saveStageAnswer', answerData).then(res => {
        if(res.data.code === 200){
          this.$message({
            message: res.data.message,
            type: "success",
            duration: 1500
          })
          this.getfollowStageData() //保存答案后刷新左上角随访问卷
        }else{
          this.$message({
            message: res.data.message,
            type: "error",
            duration: 1500
          })
        }
      })
    },
    getPhoneHis(id){ // 获取患者某个T次的电话日志
      this.$axios.get(this.$api + 'telRecord/getListByPatient?patientCode=' + this.patientCode + '&followTemplateStageId='+id).then(res => {
        if(res.data.code === 200){
          this.phoneList = res.data.data
        }
      })
    },
    setPop(name){
        this[name] = false
    },
    setStarPatient(){//设置明星患者
      this.$axios.post(this.$api + 'patient/modifyPatient', {isStarPatient:this.isStarPatient,id:this.toneStatusF.id})
      .then(res => {
        if(res.data.code == 200){
          this.$message(that,res.data.message)
        }else{
          this.$message(that,res.data.message)
        }	
      }, response => {
        console.log("error");
      });	
    },
    getUserBloodCurve(mobile){//获取血糖数据
        let that = this
        this.$axios.get(`https://bird.ioliu.cn/v1/?url=http://bmstest.bnd.microzan.com.cn/test/blood/getUserBloodCurveData?days=90&mobile=${mobile}`)
        .then(res => {
          if(res.data.code == 200){
            console.log(res.data.data)
            that.userBloodCurve = res.data.data
            that.lineChart();//折线图
          }else{
            that.$message(that,res.data.message)
          }	
        }, response => {
          console.log("error");
        });	
      },
    lineChart(){ //折线图
      let myChart = echarts.init(this.$refs.line);
      let that = this
      let arr=[]
      that.userBloodCurve.map(function(item,i){
        arr.push(i)
      })
      let option = option = {
          tooltip : {
              trigger: "axis",
			        axisPointer: {
			            type: "line"
			        },
			        formatter: function (params) {
			        	console.log(params)
			            return `数值：${params[0].data.value} <br/>
			            		时间点：${params[0].data.params.pointString}<br/>
			            		日期：${params[0].data.params.dateString}` ;
			        }
          },
          grid: {
              left: '0%',
              right: '4%',
              bottom: '0%',
              top: '6%',
              containLabel: true
          },
         xAxis: {
			        type: 'category',
			        data: arr,
			        show:false
			    },
          yAxis : [
              {
                  type : 'value'
              }
          ],
          series: [{
			        data: that.userBloodCurve,//[{value :1,params :{name:'nihao',date:'饭前',time:'2019-20-10'}},{value :12,params :{name:'ooo',date:'饭前',time:'2019-20-10'}},{value :3,params :{name:'dgfa',date:'饭前',time:'2019-20-10'}}],
			        type: 'line',
					    name: '血糖',
			        symbolSize: 6,
			        markArea: {
	                data: [ [{
		                    name: '区域血糖值范围（4.4 - 7.8）',
		                    yAxis: '4.4'
		                }, {
		                    yAxis: '7.8'
										}]],
										itemStyle:{color:{
                      colorStops: [{
                          offset: 0, color: '#90EE90' // 0% 处的颜色
                      }, {
                          offset: 1, color: '#90EE90' // 100% 处的颜色
                      }],
                    }}
		            }
			    }]
      };
      // 绘制图表
      myChart.setOption(option);
    },
    
    formatStatus(row, column){ //过滤随访状态
      return row.status == 1 ? "未完成" : "已完成"
    },
    formatTime(row, column, cellValue, index){ // 过滤日期
      return this.$serve.timemin(cellValue,'YMD')
    },
    formatPhoneStatus(row, column, cellValue, index){ // 过滤电话接听状态
      return cellValue?this.$serve.status[cellValue-1].name:''
    }
  }
};
</script>

<style scoped>
.Follow .dataTime >>> .el-input__inner{padding:0 0 0 23px;}
.icon{top:-8px;right:-8px;}
.Follow >>> .el-calendar-day{height: 30px;}
.Follow  .el-card{overflow:inherit;}
.Follow >>> .el-calendar__header{padding: 0 0 5px 0;}
.Follow >>> .el-calendar__body{padding:0}
.mt120{margin-top:120px;}
.pl60{padding-left: 60px;}
.w90{width:90px}
</style>