<template>
  <!--问卷详情-->
  <div class="QpageDetail">
    <el-container>
        <el-header class="bgee lh40" height='40px'><p class="tl pl20">问卷详情</p></el-header>
        <el-main>           
          <el-form>
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
                  <el-checkbox label="嗜睡"></el-checkbox><br/>
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
                  <el-time-picker type="fixed-time" placeholder="选择时间" v-model="sizeForm.date2" class="w150 fl"></el-time-picker>
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
                  <el-date-picker type="date" placeholder="选择日期" v-model="sizeForm.date1" class="w150"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="下次非常规预约时间:" label-width="150px">
                  <el-select v-model="sizeForm.region" class="w120 fl" placeholder="">
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
          </el-form>
        </el-main>
      </el-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "QpageDetail",
  data() {
    return {
      form: {
        name: "",
        region: "",
        passWord: ""
      },
      rules: {
        // 表单规则验证
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        passWord: [{ required: true, message: "请输入密码", trigger: "change" }]
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
      radio2: 3,
    }
  },
  methods: {
  },
  computed: {
    
  },
  mounted() {
    let that = this;
    setTimeout(function() {
      that.loading = false;
    }, 300);
  },
  created() {
  }
};
</script>

<style scoped>
</style>
