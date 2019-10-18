<template>
  <div class="CallCenter">
    <el-container>
      <el-aside style='width:auto'>
        <el-card class="box-card mt10">
          <div slot="header" class="clearfix">
            <span>呼叫记录日志(点击可切换编辑和跟进)</span>
            <el-button style="float: right; padding: 3px 0" type="text" class="fl" icon="el-icon-plus" @click.stop="addCall">新建呼叫</el-button>
          </div>
         <el-table :data="callList" ref="callTable" style="width: 100%" size="mini" :highlight-current-row="true" @row-click="changeCall">
            <el-table-column prop="callType" label="来电类型" align="center" :formatter="formatCallType"></el-table-column>
            <el-table-column prop="askType" label="咨询类型" align="center" :formatter="formatAskType"></el-table-column>
            <el-table-column  prop="createTime" label="咨询创建时间" width="120" align="center" :formatter="formatTime"></el-table-column>
            <el-table-column  prop="dealStatus" label="处理状态" align="center" :formatter="formatDealStatus"></el-table-column>
          </el-table>
        </el-card>
      </el-aside>
      <el-container v-loading="loading" class="ml30 mt10">
        <el-card :border='false'>
          <!--保存呼叫记录-->
          <el-form size="small" :model="callForm" label-position="right" label-width="110px">
            <el-row class="posRel pt30 pl30">
              <div :class="['fz12 posAbs cue colorW pt5 pr10 pb5 pl10 borRad',active==1?'':'no',]" style="margin-left:-20px;">基本信息</div>
              <el-col :lg="5">
                <el-form-item label="来电电话:">
                  <el-input v-model="callForm.callNumber" style='width:90px' @focus="active = 1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="6">
                <el-form-item label="来电者类型:">
                  <el-select v-model="callForm.callerType" class="w150 fl" @focus="active = 1">
                    <el-option label="患者本人" value="1"></el-option>
                    <el-option label="患者家属" value="2"></el-option>
                    <el-option label="医务人" value="3"></el-option>
                    <el-option label="专员" value="4"></el-option>
                    <el-option label="志愿者" value="5"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="5">
                <el-form-item label="来电类型:">
                  <el-select v-model="callForm.callType" class="w100 fl" @focus="active = 1">
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="转接" value="2"></el-option>
                    <el-option label="挂断" value="3"></el-option>
                    <el-option label="测试" value="4"></el-option>
                    <el-option label="错号" value="5"></el-option>
                    <el-option label="骚扰" value="6"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="6">
                <el-form-item label="信息获取渠道:">
                  <el-select v-model="callForm.newsSource" class="w150 fl" @focus="active = 1">
                    <el-option label="微信" value="1"></el-option>
                    <el-option label="短信" value="2"></el-option>
                    <el-option label="电话" value="3"></el-option>
                    <el-option label="病友" value="4"></el-option>
                    <el-option label="医生" value="5"></el-option>
                    <el-option label="网络" value="6"></el-option>
                    <el-option label="报纸" value="7"></el-option>
                    <el-option label="其他" value="8"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="mt10 pl30">
              <el-col :lg="5">
                <el-form-item label="是否用药:">
                  <el-select v-model="callForm.isDrug" class="w100 fl" @focus="active = 1">
                    <el-option label="用药中" value="1"></el-option>
                    <el-option label="已停药" value="2"></el-option>
                    <el-option label="未用药" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="6">
                <el-form-item label="咨询类型:">
                  <el-select v-model="callForm.askType" @focus="active = 1" class="w150 fl">
                    <el-option-group
                      v-for="group in consults"
                      :key="group.label"
                      :label="group.label">
                      <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="5">
                <el-form-item label="药物:">
                  <el-select v-model="callForm.drug" style="width:150px;" @focus="active = 1">
                    <el-option label="齐普乐" value="1"></el-option>
                    <el-option label="齐普怡" value="2"></el-option>
                    <el-option label="齐普乐+齐普怡" value="3"></el-option>
                    <el-option label="其他" value="4"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :lg="5">
                <el-form-item label="注射笔:">
                  <el-select v-model="callForm.injectionPen" class="w120 fl" @focus="active = 1">
                    <el-option label="优伴笔" value="1"></el-option>
                    <el-option label="经典笔" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row class="posRel pt30 pl30">
              <div :class="['fz12 posAbs cue colorW pt5 pr10 pb5 pl10 borRad',active==2?'':'no',]" style="margin-left:-20px;">咨询内容</div>
              <el-col :lg="5">
                <el-form-item label="FAQ:">
                  <el-select v-model="callForm.knowledgeTypeName" class="w150 fl" @focus="faqS(1)" @change="knowContS(1)">
                    <el-option :label="item.type" :value="item.id" v-for="(item, index) in faqList" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="14">
                <el-form-item label-width="10px">
                  <el-select v-model="knowlTitleId" style="width: 100%" @focus="faqS(2)" @change="knowContS(2)">
                    <el-option :label="item.title" :value="item.id" v-for="(item, index) in faqTitles" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="mb10 pl30">
              <el-col :lg="19">
                <div style="margin-left: 100px;" v-for="(item, index) in showFaqs" :key="index">
                  <p class="bgef colorW pt5 pb5 pl10">
                    {{ item.title }} <span class="inline fr mr10"><i class="el-icon-close cursor" @click.stop="removeFaq(item, index)"></i></span>
                  </p>
                  <p class="mt15 mb15">{{ item.content }}</p>
                </div>
              </el-col>
            </el-row>
            <el-row class="pl30">
              <el-col :lg="15">
                <el-form-item label="咨询问题描述:">
                  <el-input type="textarea" :rows="4" v-model="callForm.problemDescription" @focus="active = 2"></el-input>
                </el-form-item>
              </el-col>
            </el-row>           
            <el-row class="pl30">
              <el-col :lg="13">
                <el-form-item label="不良反应(多选):">
                  <el-select v-model="callForm.reaction" multiple placeholder="请选择" @focus="active = 2" class="fl" style="width: 100%" @change="multipleS">
                    <el-option
                      v-for="item in ADRs"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="6">
                <el-form-item label-width="20px">
                  <el-input placeholder="选填其他不良反应" v-model="callForm.reactionOthers" @focus="active = 2"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="posRel pt30 pl30">
              <div :class="['fz12 posAbs cue colorW pt5 pr10 pb5 pl10 borRad',active==3?'':'no',]" style="margin-left:-20px;">咨询内容</div>
              <el-col :lg="5">
                <el-form-item label="处理状态:">
                  <el-select v-model="callForm.dealStatus" @focus="active = 3" style="width:150px;">
                    <el-option label="待处理" value="1"></el-option>
                    <el-option label="处理中" value="2"></el-option>
                    <el-option label="完成" value="3"></el-option>
                    <el-option label="内部升级" value="4"></el-option>
                    <el-option label="外部升级" value="5"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="pl30">
              <el-col :lg="15">
                <el-form-item label="处理方案:">
                  <el-input type="textarea" :rows="4" v-model="callForm.dealWays" @focus="active = 3"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fr">
              <el-form-item label-width="0">
                <el-button type="success" @click.stop="saveCall" icon="el-icon-phone-outline">保存呼叫记录</el-button>
              </el-form-item>
            </el-row>
          </el-form>
          <!--电话日志记录-->
          <!-- <el-container class="mt20">
            <el-header height="40px">
              <el-row class="bgee pt10 pb10 pl20">
                <el-col :lg="4">电话日志记录</el-col>
              </el-row>
            </el-header>
            <el-main>
              <el-form label-position="right" :model="phoneForm" label-width="110px" size="small">
                <el-row>
                  <el-col :lg="3">
                    <el-form-item label-width="0">
                      <el-button type="primary" icon="el-icon-notebook-2">保存电话日志</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :lg="15">
                    <el-form-item label="外呼详情:">
                      <el-input type="textarea" :rows="4"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :lg="5">
                    <el-form-item label="处理状态:">
                      <el-select v-model="phoneForm.region" placeholder="">
                        <el-option label="接通" value="1"></el-option>
                        <el-option label="未接通" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="5">
                    <el-form-item label="跟进状态:">
                      <el-select v-model="phoneForm.region" placeholder="">
                        <el-option label="待处理" value="1"></el-option>
                        <el-option label="处理中" value="2"></el-option>
                        <el-option label="完成" value="3"></el-option>
                        <el-option label="内部升级" value="3"></el-option>
                        <el-option label="外部升级" value="3"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-main>
          </el-container> -->
        </el-card>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { setTimeout } from 'timers';
export default {
  props:['patientCode','patientId','mobile'],
  data() {
    return {
      loading: false,
      dialogFormVisible: true,
      radio2: 3,
      checkList: [],
      callForm: { // 呼叫记录表单
        id: '',
        patientCode: this.patientCode,
        patientId:this.patientId,
        callNumber: '',
        callType: '',
        callerType: '',
        newsSource: '',
        isDrug: '',
        askType: '',
        drug: '',
        // injectionPen: '',
        knowledgeTypeId: '',
        knowledgeId: '',
        problemDescription: '',
        dealWays: '',
        reaction: '',
        dealStatus: '',
        createUserId: '',
        updateUserId: '',
        reactionOthers: ''
      },
      faqList:[], // FAQ类型列表
      faqTitles:[], // FAQ问题标题列表
      knowlTitleId: '', // FAQ问题详情
      showFaqs: [], // 显示得FAQ问题列表
      phoneForm: { // 电话日志表单
        regin: ''
      },
      callList: [], // 呼叫信息列表
      consults: [{ // 咨询类型列表
        label: '产品相关>>',
        options: [{
          value: '1',
          label: '价格咨询'
        }, {
          value: '2',
          label: '不良反应咨询'
        }, {
          value: '3',
          label: '购药渠道咨询'
        }, {
          value: '4',
          label: '医保报销'
        }]
      }, {
        label: '疾病治疗>>',
        options: [{
          value: '5',
          label: '用药咨询'
        }, {
          value: '6',
          label: '适应症相关咨询'
        }, {
          value: '7',
          label: '治疗方案咨询'
        }, {
          value: '8',
          label: '用药疗程咨询'
        }]
      }, {
        label: '齐普乐援助>>',
        options: [{
          value: '9',
          label: '援助进度查询及催促'
        }, {
          value: '10',
          label: '援助流程咨询'
        }, {
          value: '11',
          label: '申请物料下载及填写咨询'
        }, {
          value: '12',
          label: '项目药房咨询'
        }, {
          value: '13',
          label: '随访未接通再次呼入'
        }]
      }, {
        label: '齐普怡援助>>',
        options: [{
          value: '14',
          label: '援助进度查询及催促'
        }, {
          value: '15',
          label: '援助流程咨询'
        }, {
          value: '16',
          label: '申请物料下载及填写咨询'
        }, {
          value: '17',
          label: '项目药房咨询'
        }, {
          value: '18',
          label: '随访未接通再次呼入'
        }]
      }, {
        label: '微信公众号相关>>',
        options: [{
          value: '19',
          label: '注册咨询'
        }, {
          value: '20',
          label: '补充资料咨询'
        }, {
          value: '21',
          label: '爱打卡咨询'
        }, {
          value: '22',
          label: '专家说'
        }]
      }, {
        label: '其他>>',
        options: [{
          value: '23',
          label: '合作咨询'
        }]
      }],
      value7: '',
      ADRs: [{
        value: '恶心呕吐',
        label: '恶心呕吐'
      }, {
        value: '腹泻',
        label: '腹泻'
      }, {
        value: '便秘',
        label: '便秘'
      }, {
        value: '发热感染',
        label: '发热感染'
      }, {
        value: '中性细胞减少',
        label: '中性细胞减少'
      }, {
        value: '血小板减少',
        label: '血小板减少'
      }, {
        value: '贫血',
        label: '贫血'
      }, {
        value: '周围神经病变',
        label: '周围神经病变'
      }, {
        value: '皮疹',
        label: '皮疹'
      }, {
        value: '身体乏力',
        label: '身体乏力'
      }, {
        value: '食欲下降',
        label: '食欲下降'
      }, {
        value: '其他',
        label: '其他'
      }],
      active:1,
    }
  },
  methods: {
    multipleS() {
      console.log(this.callForm.reaction)
    },
    getListByPatient(){ // 获取某个患者的呼叫信息列表
      this.$axios.get(`${this.$api}call/getListByPatient?patientCode=${this.patientCode}`).then(res => {
        if(res.data.code === 200){
          console.log('呼叫信息列表', res.data)
          let callList = res.data.data
          callList.map((item, index) => {
            item.askType =  JSON.stringify(item.askType)
            item.callType = JSON.stringify(item.callType)
            item.callerType = JSON.stringify(item.callerType)
            item.dealStatus = JSON.stringify(item.dealStatus)
            item.drug = JSON.stringify(item.drug)
            item.newsSource = JSON.stringify(item.newsSource)
            item.isDrug = JSON.stringify(item.isDrug)
            item.knowledgeContent = JSON.parse(item.knowledgeContent)
            item.knowledgeTypeName = ''
            item.reaction = JSON.parse(item.reaction)
          })
          this.callList = callList
        }
      })
    },
    saveCall(){ // 保存电话记录
      this.loading = true
      this.callForm.id = ''
      this.callForm.createUserId = JSON.parse(localStorage.getItem('userInfo')).employeeId
      this.callForm.updateUserId = JSON.parse(localStorage.getItem('userInfo')).employeeId
      this.callForm.knowledgeContent = JSON.stringify(this.showFaqs) 
      this.callForm.reaction = JSON.stringify(this.callForm.reaction)
      console.log('电话表单', this.callForm)
      this.$axios.post(`${this.$api}call/saveOrModify`, this.callForm).then(res => {
        console.log(res)
        if(res.data.code === 200){
          this.loading = false
          this.$message({
            message: "保存呼叫成功",
            type: "success",
            duration: 1500
          })
          this.getListByPatient()
        }else{
          this.$message({
            message: res.data.message,
            type: "error",
            duration: 1500
          })
        }
      })
    },
    changeCall(row, event, column){ // 切换左侧电话记录
      this.callForm = row
      this.showFaqs = row.knowledgeContent
    },
    getknowledgeType() { // 查询知识分类
      this.$axios.post(`${this.$api}knowledgeType/findByProjectId`, {projectId: this.$route.query.proId}).then(res => {
        if(res.data.code === 200){
          this.faqList = res.data.data
          console.log('呼叫中心知识大类', res.data.data)
        }
      })
    },
    faqS(type){ // 搜索faq类型列表
      this.active = 2
      if(type === 1){
        this.getknowledgeType()
      }else if(type === 2){
        if(this.callForm.knowledgeTypeName != ''){
          let knowData = {
            page: 1,
            rows: 50,
            typeId: this.callForm.knowledgeTypeName
          }
          this.$axios.post(`${this.$api}knowledge/find`, knowData).then(res => {
            console.log('问题标题列表', res)
            if(res.data.code === 200){
              this.faqTitles = res.data.data.rows
            }
          })
        }
      }
    },
    knowContS(type){ // 选中知识显示
      if(type === 1){
        this.knowlTitleId = ''
      }else if(type === 2){
        console.log(this.knowlTitleId)
        let arrDetail = ''
        for(let i=0; i<this.faqTitles.length; i++){
          if(this.faqTitles[i].id === this.knowlTitleId ){
            console.log(this.faqTitles[i])
            arrDetail = this.faqTitles[i]
          }
        }
        if(this.showFaqs.length === 0){
          this.$set(this.showFaqs, this.showFaqs.length, arrDetail)
        }else{
          let flag = true
          for(let i=0; i<this.showFaqs.length; i++){
            if(this.showFaqs[i].id === this.knowlTitleId){
              flag = false
            }
          }
          if(flag){
            console.log('可以添加')
            this.$set(this.showFaqs, this.showFaqs.length, arrDetail)
          }else{
            console.log('抱歉')
          }
        }
      }
    },
    removeFaq(item, index){ // 移除显示知识
      console.log('移除该知识', item)
      this.showFaqs.splice(index, 1)
    },
    formatTime(row, column){ // 过滤日期
      return this.$serve.timemin(row.createTime)
    },
    formatCallType(row, column){ // 过滤来电类型
      return row.callType == 1 ? '正常' : row.callType == 2 ? '转接' : row.callType == 3 ? '挂断' : row.callType == 4 ? '测试' : row.callType == 5 ? '错号' : '骚扰'
    },
    formatAskType(row, column){ // 过滤咨询类型
      let askType = row.askType
      let ask = ''
        switch (row.askType) {
          case "1": 
            ask = '价格'
            break;
          case "2": 
            ask = '疗效'
            break;
          case "3": 
            ask = '适应症'
            break;
          case "4": 
            ask = '保存'
            break;
          case "5": 
            ask = '购买渠道'
            break;
          case "6": 
            ask = '血糖控制'
            break;
          case "7": 
            ask = '并发症'
            break;
          case "8": 
            ask = '妊娠糖尿病'
            break;
          case "9": 
            ask = '1型糖尿病'
            break;
          case "10": 
            ask = '2型糖尿病'
            break;
          case "11": 
            ask = '患者支持项目'
            break;
          case "12": 
            ask = '促销'
            break;
          case "13": 
            ask = 'PAP'
            break;
          case "14": 
            ask = '注册会员'
            break;
          case "15": 
            ask = '终止会员'
            break;
          case "16": 
            ask = '注射笔使用'
            break;
          case "17": 
            ask = '注射笔坏笔更换'
            break;
          case "18": 
            ask = '注射笔的购买'
            break;
          case "19": 
            ask = '针头'
            break;
          case "20": 
            ask = '冰包'
            break;
          case "21": 
            ask = '血糖仪'
            break;
          case "22": 
            ask = '血糖试纸'
            break;
          case "23": 
            ask = '询问优泌乐相关'
            break;
          case "24": 
            ask = '非三生产品'
            break;
          case "25": 
            ask = '专员来电'
            break;
          case "26": 
            ask = '服务商变更'
            break;
          case "27": 
            ask = 'AE/PC部门来电'
            break;
          case "28": 
            ask = '医保'
            break;
          case "29": 
            ask = '合作'
            break;
          case "30": 
            ask = '微信相关'
            break;
        }
        return ask
    },
    formatDealStatus(row, column){ //过滤处理状态
      let arr = []
      return row.dealStatus == 1 ? '待处理' : row.dealStatus == 2 ? '处理中' : row.dealStatus == 3 ? '已完成' : row.dealStatus == 4 ? '内部升级' : '外部升级'
    },
    addCall(){ // 新建呼叫
      this.$refs.callTable.setCurrentRow()
      this.callForm = {
        patientCode: this.patientCode,
        patientId:this.patientId,
        callNumber:this.mobile
      }
      this.showFaqs = []
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },500)
    }
  },
  mounted(){
    setTimeout(()=>{
      this.callForm.callNumber=this.mobile
    },1000)
    this.getListByPatient()
  }
}
</script>

<style scoped>

</style>
<style>
.el-card{overflow:inherit;}
.el-select-group__title{color: black;font-weight: bold;font-size: 13px;}
</style>
