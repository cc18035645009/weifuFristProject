<template>
  <div class="Notice">
    <el-container>
      <el-aside style='width:auto'>
        <el-card class="box-card mt10">
          <div slot="header" class="clearfix">
            <span>短信记录</span>
            <el-button style="float: right; padding: 3px 0" type="text" class="fl" icon="el-icon-plus" @click.stop="addMsg">新建短信</el-button>
          </div>
          <el-table :data="tableData" ref="tableData" style="width: 100%" size="mini" :highlight-current-row="true" @row-click="changeMsg">
            <el-table-column prop="patientPhone" label="发往号码" align="center" width='100' ></el-table-column>
            <el-table-column  prop="messageContent" label="发送内容" width='100' show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="date" label="发送时间" align="center" width='100'></el-table-column>
          </el-table>
        </el-card>
      </el-aside>
      <el-container class="ml30 mt10 w10p" v-loading="loading">
        <el-card :border='false' class="w10p posRel">
          <div :class="['fz12 posAbs cue colorW pt5 pr10 pb5 pl10 borRad',active==1?'':'no',]">发送短信</div>
          <el-form size="small" :model="msgForm" ref="msgForm" :rules='msgFormRules' label-position="right" label-width="110px" class='pt20 pl30 clear'>
            <el-row>
              <el-col :span="5">
                <el-form-item label="手机号码：" prop='patientPhone'>
                  <el-input v-model="msgForm.patientPhone" style='width:120px' @focus='active = 1'></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="5">
                <el-form-item label="发送时间:">
                  <el-date-picker v-model="msgForm.dataTime" type="datetime"  placeholder="不填为立即发送"></el-date-picker>
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="模板：">
                  <el-select v-model="mode" placeholder="请选择" @focus='active = 1' @change="modeChange" style='width:120px'>
                    <el-option
                      v-for="item in modeArr"
                      :key="item.value"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16">
                <el-form-item label="发送内容：" prop='messageContent'>
                  <el-input type="textarea" :rows="5" v-model="msgForm.messageContent" @focus='active = 1'></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fr">
              <el-col :span="2">
                <el-button type="success" @click.stop="sendMsg('msgForm')" size="small" icon="el-icon-position">发送消息</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-container>
    </el-container>
  </div>
</template>

<script>
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
  props:['patientCode', 'phone'],
  name:'Notice',
  data() {
    return {
      loading:false,
      msgForm: { // 发送消息表单
        patientPhone: this.phone,
        patientCode: this.patientCode,
        messageContent: '',
        // dataTime: ''
      },
      msgFormRules:{
        patientPhone:[{ required: true,validator:checkPhone, trigger: 'blur'}],
        messageContent:[{ required: true, message: '请输入', trigger: 'blur'}],
      },
      msgList:[], // 短信列表
      tableData: [],
      active:'',
      mode:0,
      modeArr:[
        {name:'失访',content:'尊敬的用户，生命阳光服务热线（021-61829950）将于近期给您致电随访，届时请您保持手机畅通。我们将竭诚为您提供从诊疗到康复的全程咨询服务及药品援助支持（工作时间周一至周日9：00—18：00）。',id:0},
        {name:'来电（需要跟进的用户）',content:'尊敬的用户，感谢您致电生命阳光服务热线（400-159-0519）。您的问题我们已记录，将尽快给您答复。',id:1},
        {name:'齐普怡项目短信介绍',content:'尊敬的用户，为继承和弘扬白求恩的伟大精神，北京白求恩公益基金会和齐鲁制药有限公司，共同发起设立“生命阳光-白求恩•血液肿瘤患者关爱与援助公益项目”，您可以通过微信公众号内搜索“生命阳光患者关爱平台”，关注并加入项目，我们将为您提供从诊疗到康复的全程咨询服务及药品援助支持。如有任何项目相关问题，欢迎您拨打项目热线 ：400-159-0519（周一至周日9：00-18：00）。',id:2}
      ]
    }
  },
  methods: {
    addMsg(){ // 新建
      this.$refs.tableData.setCurrentRow()
      this.$nextTick(()=>{
        this.$refs['msgForm'].resetFields();
      })
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },500)
    },
    changeMsg(row, event, column){ // 切换左侧
      this.msgForm = row
    },
    modeChange(val){
      this.msgForm.messageContent = this.modeArr[val].content
    },
    sendMsg(formName){ // 发送消息
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post(this.$api + 'message/sendMsg', this.msgForm).then(res => {
              if(res.data.code === 200){
                this.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 1500
                })
                this.getMsgList(1, 50, '')
              }
            })
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
              duration: 1500
            })
          }
        });
    },
    getMsgList(page, row, isReply){ // 获取短信列表
      let msgData = {
        page: page,
        rows: row,
        patientCode: this.patientCode,
        isReply: isReply,
        projectId: this.$route.query.proId
      }
      this.$axios.post(this.$api + 'message/getList', msgData).then(res => {
        if(res.data.code === 200){
          console.log('获取短信列表', res)
          this.msgList = res.data.data.rows
        }
      })
    }
  },
  mounted(){
    this.getMsgList(1, 50, '')
  }
}
</script>

<style scoped>
.el-card{overflow:inherit;}
</style>
