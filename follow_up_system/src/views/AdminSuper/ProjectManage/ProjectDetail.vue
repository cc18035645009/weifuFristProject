<template>
  <!--项目详情-->
  <div class="ProjectDetail">
    <el-form size="small" :model="form" ref="proDetail"  label-position="right" label-width="100px">
      <el-container>
        <el-header>
          <el-row class="bgee pt10 pb10">
            <el-col :span="3">基础信息</el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-row>
            <el-col :span="4">
              <el-form-item label="项目名称">
                <el-input v-model="proDetail.projectName" :disabled="true" class="w120 fl"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="项目开始时间">
                <el-date-picker
                  :disabled="true"
                  v-model="proDetail.status"
                  type="datetime"
                  class="fl"
                  placeholder="选择日期时间"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="邮箱">
                <el-input v-model="proDetail.email" :disabled="true" class="w150 fl"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="电话接收短信">
                <el-input v-model="proDetail.phone" :disabled="true" class="w150 fl"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
      <!--T次设定-->
      <el-container>
        <el-header>
          <el-row class="bgee pt10 pb10">
            <el-col :span="3">T次设定</el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-row>
            <el-col :span="5">
              <el-form-item label="名称:" prop='name' :rules="{required: true, message: '不能为空', trigger: 'blur'}">
                <el-input v-model="form.name" class="w120 fl" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="(item,i) in form.Ttimes" :key='i'>
            <el-col :span="5">
              <el-form-item 
                :label="'T'+(i-0+1)"
                :prop="'Ttimes.'+i+'.days'"
                :rules="{required: true, message: '不能为空', trigger: 'blur'}"
              >
                <el-input v-model="item.days" class="w80 fl" :disabled="true"></el-input>
                <p class="fl ml5">天</p>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="是否启用:"
                :prop="'Ttimes.'+i+'.status'"
                :rules="{required: true, message: '不能为空', trigger: 'change'}"
              >
                <el-select v-model="item.status" class="w100 fl" placeholder :disabled="true">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
      <!--问卷设定-->
      <el-container v-if="false">
        <el-header class="bgee lh40" height="40px">
          <p class="tl pl20">默认问卷</p>
        </el-header>
        <el-main>
          <el-row>
            <el-col :span="3" class="tr">用药状态:</el-col>
            <el-col :span="16">
              <el-radio-group v-model="radio2" class="fl ml20">
                <el-radio :label="1">用药中</el-radio>
                <el-radio :label="2">暂停用药</el-radio>
                <el-radio :label="3">停止用药</el-radio>
                <el-radio :label="4">未启用，已处方</el-radio>
                <el-radio :label="5">非患者</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row class="mt20">
            <el-col :span="3" class="tr">使用剂量:</el-col>
            <el-col :span="16">
              <el-radio-group v-model="radio2" class="fl ml20">
                <el-radio :label="1">5ug/Qd</el-radio>
                <el-radio :label="2">5ug/Bid</el-radio>
                <el-radio :label="3">10ug/Qd</el-radio>
                <el-radio :label="4">10ug/Bid</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row class="mt20">
            <el-col :span="3" class="tr">之前控糖方案:</el-col>
            <el-col :span="16">
              <el-radio-group v-model="radio2" class="fl ml20">
                <el-radio :label="1">5ug/Qd</el-radio>
                <el-radio :label="2">5ug/Bid</el-radio>
                <el-radio :label="3">10ug/Qd</el-radio>
                <el-radio :label="4">10ug/Bid</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row class="mt20">
            <el-col :span="3" class="tr">之前治疗方案选择:</el-col>
            <el-col :span="16">
              <el-radio-group v-model="radio2" class="fl ml20">
                <el-radio :label="1">自己选择</el-radio>
                <el-radio :label="2">他人选择</el-radio>
                <el-radio :label="3">医生选择</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row class="mt20">
            <el-col :span="3" class="tr">不良反应:</el-col>
            <el-col :span="18">
              <el-checkbox-group v-model="checkList" class="fl ml20">
                <el-checkbox label="恶心呕吐"></el-checkbox>
                <el-checkbox label="食欲下降"></el-checkbox>
                <el-checkbox label="胃肠不适"></el-checkbox>
                <el-checkbox label="体重消瘦"></el-checkbox>
                <el-checkbox label="浑身乏力"></el-checkbox>
                <el-checkbox label="嗜睡"></el-checkbox>
                <br>
                <el-checkbox label="头晕"></el-checkbox>
                <el-checkbox label="低血糖"></el-checkbox>
                <el-checkbox label="血糖升高"></el-checkbox>
                <el-checkbox label="引起肥胖"></el-checkbox>
                <el-checkbox label="皮疹"></el-checkbox>
                <el-checkbox label="心悸"></el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
          <el-row class="mt20">
            <el-col :span="16">
              <el-form-item label="停药时间:" label-width="190px" size="small">
                <el-time-picker
                  type="fixed-time"
                  placeholder="选择时间"
                  v-model="sizeForm.date2"
                  class="w150 fl"
                ></el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="mt10">
            <el-col :span="3" class="tr">后续控糖方法:</el-col>
            <el-col :span="16">
              <el-radio-group v-model="radio2" class="fl ml20">
                <el-radio :label="1">口服药</el-radio>
                <el-radio :label="2">饮食运动</el-radio>
                <el-radio :label="3">胰岛素</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row class="mt20">
            <el-col :span="3" class="tr">对患教活动的建议:</el-col>
            <el-col :span="16">
              <el-radio-group v-model="radio2" class="fl ml20">
                <el-radio :label="1">增加回访频率</el-radio>
                <el-radio :label="2">减少回访频率</el-radio>
                <el-radio :label="3">增加短信服务</el-radio>
                <el-radio :label="4">患教活动通知</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row class="mt20">
            <el-col :span="7">
              <el-form-item label="下次非常规预约日期:" label-width="190px">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="sizeForm.date1"
                  class="w150"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="下次非常规预约时间:" label-width="150px">
                <el-select v-model="sizeForm.region" class="w120 fl" placeholder>
                  <el-option label="7:00~9:00" value="1"></el-option>
                  <el-option label="9:00~11:00" value="3"></el-option>
                  <el-option label="11:00~13:00" value="4"></el-option>
                  <el-option label="13:00~15:00" value="5"></el-option>
                  <el-option label="15:00~17:00" value="6"></el-option>
                  <el-option label="17:00~19:00" value="7"></el-option>
                  <el-option label="19:00~21:00" value="8"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="mt20" type="flex" justify="start">
            <el-col :span="5">
              <el-button type="primary" size="small">保存问卷</el-button>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" size="small">不良事件报告</el-button>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" size="small">工单报告</el-button>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
      <!--设定问卷-->
      <el-button
        type="primary"
        icon="el-icon-document"
        class="fl ml20 mb10"
        size="small"
        @click="addQpage('proDetail')"
      >添加问卷</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ['proId'],
  data() {
    return {
      proDetail:{}, //项目详情
      form: {
        name: "",
        Ttimes:[]
      },
      sizeForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      checkList: [],
      radio2: 3
    };
  },
  methods: {
    addQpage(formName) {
      // 添加问卷
      this.$emit("closeProDetail");
      return false
      this.$refs[formName].validate((valid) => {
        console.log('submit!',this.form);
          if (valid) {
            console.log('submit!',this.form);
            let data = {
              id:this.proId,
              followTemplateName:this.form.name,
              stageList:this.form.Ttimes
            }
            this.$axios.post(this.$api + 'template/setTemplate',data).then(res => {
              if(res.data.code == 200){
                this.$message({
                    message: res.data.message,
                    type: 'success',
                    duration: 1500
                })
                // 添加问卷
                this.$emit("closeProDetail");
              }else{
                this.$message({
                    message: res.data.message,
                    type: 'error',
                    duration: 1500
                })
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      
    },
    getProDetail() { // 获取项目详情
      this.$axios.get(this.$api + 'project/getProjectById?id=' + this.proId).then(res => {
        if(res.data.code == 200){
          this.proDetail = res.data.data
          this.form.Ttimes = res.data.data.stageList
          this.form.name = res.data.data.followTemplateName
        }
      })
    }
  },
  mounted(){
    this.getProDetail()
    console.log(this.proId)
  }
}
</script>
<style scoped>
</style>
<style>
.el-input.is-disabled .el-input__inner{color:#606266}
</style>



