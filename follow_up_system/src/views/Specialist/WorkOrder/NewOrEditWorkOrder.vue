<template>
  <div class="WorkOrder">
    <el-form size="small" :model="workForm" ref="workForm" :rules='workFormRules' label-position="top" class='clear'>
      <el-container class="mr10 ml10">
        <el-aside style='width:400px'>
          <el-card class="box-card mt10">
            <el-row>
              <el-col>
                <el-form-item label="工单范围：" prop='workOrderCope'>
                  <el-radio-group v-model="workForm.workOrderCope" clearable @change="changeWork">
                    <el-radio :label="1">内部工单</el-radio>
                    <el-radio :label="2">外部工单</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="客户：" prop='patientId'>
                  <el-select v-model="workForm.patientId" clearable placeholder="请选择" filterable remote :remote-method="getPatient" :loading="loading">
                    <el-option
                      v-for="item in patientOptions"
                      :key="item.id"
                      :label="item.patientName"
                      :value="item.id"
                      >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="处理人：" prop='dealEmployeeId'>
                  <el-select v-model="workForm.dealEmployeeId" clearable placeholder="请选择" multiple filterable style='width:350px'>
                    <el-option
                      v-for="item in dealEmployeeOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="抄送给：">
                  <el-select v-model="workForm.copyEmployeeId" clearable placeholder="请选择" multiple filterable style='width:350px'>
                    <el-option
                      v-for="item in copyEmployeeOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="类型：">
                  <el-select v-model="workForm.workOrderType" clearable placeholder="请选择">
                    <el-option
                      v-for="(item,index) in $serve.workOrderType"
                      v-show="index"
                      :key="index"
                      :label="item"
                      :value="index">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="优先级：">
                  <el-select v-model="workForm.priorityLevel" clearable placeholder="请选择">
                    <el-option
                      v-for="(item,index) in $serve.priorityLevel"
                      v-show="index"
                      :key="index"
                      :label="item"
                      :value="index">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="要求完成时间：">
                  <el-date-picker
                    v-model="workForm.shouldFinishTime"
                    :picker-options="pickerOptions" 
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="标签：">
                  <el-select v-model="workForm.label" clearable placeholder="请选择" multiple filterable allow-create style='width:350px'>
                    <el-option
                      v-for="item in labelOptions"
                      :key="item.id"
                      :label="item.labelName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-aside>
        <el-container class="ml10 mt10 w10p">
          <!-- 新增 -->
          <el-card :border='false' class="w10p posRel">
            <el-row>
              <el-col>
                <el-form-item label="主题：" prop="subject">
                  <el-input v-model="workForm.subject"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="描述：">
                  <el-input type="textarea" :rows="5" v-model="workForm.content"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="fr" type="flex" justify="start">
              <el-button type="primary" class="mr10" @click.stop="submit('workForm')" size="small" icon="el-icon-check">提交</el-button>
              <el-button type="success" class="mr10" @click.stop="submit('workForm')" size="small" icon="el-icon-finished">提交并处理完毕</el-button>
              <el-button type="info" @click.stop="$emit('closeDetail')" size="small" icon="el-icon-close">取消</el-button>
            </el-row>
          </el-card>
          <!-- 详情 -->
          <!-- <div class="w10p">
            <el-card :border='false' class="w10p posRel mb10 fz14">
              <div slot="header" class="clearfix">
                <span>MC01&nbsp;于&nbsp;<span class="color9">2019-08-22 14:22</span>&nbsp;<span class="colorRed">发布工单：</span></span>
              </div>
              <div class="lh30">主题：该患者需要进行人工干预，马上用药到期 </div>
              <div>描述：无</div>
            </el-card>
          </div> -->
        </el-container>
      </el-container>
    </el-form>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {
  props:['editId'],
  name:'WorkOrder',
  data() {
    return {
      loading:false,
      workForm: { // 发送消息表单
        workOrderCope:'',
        patientId: '',
        dealEmployeeId:[],
        copyEmployeeId:[],
        workOrderType:'',
        priorityLevel:'',
        shouldFinishTime:'',
        subject:'',
        content:'',
        label:[],
        createEmployeeId:JSON.parse(localStorage.getItem('userInfo')).employeeId
      },
      workFormRules:{
        patientId:[{ required: true,message: '请选择', trigger: 'blur'}],
        dealEmployeeId:[{ required: true,message: '请选择', trigger: 'blur'}],
        workOrderCope:[{ required: true,message: '请选择', trigger: 'blur'}],
        subject:[{ required: true,message: '请选择', trigger: 'blur'}],
      },
      patientOptions:[],
      dealEmployeeOptions:[],
      copyEmployeeOptions:[],
      labelOptions:[],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;//当天之后的时间可选
        },
      },
      detail:{}
    }
  },
  methods: {
    ...mapMutations(['isSpecial', 'isSuper', 'isCallCenter']),
    changeWork(val){
      console.log(val)
      this.workForm.dealEmployeeId = ''
      this.dealEmployeeOptions = []
      if(val == 1){
        this.getDealEmployee()
      }else{
        this.dealEmployeeOptions = [{id:'-1',name:'志愿者'}]
      }
    },
    getLabel(){
      this.$axios.get(this.$api + 'workOrderQilu/getLabels').then(res => { 
        if(res.data&&res.data.code === 200){
          this.labelOptions = res.data.data
        }else{
            this.$message({
                message: res.data.message,
                type: 'error',
                duration: 1500
            })
        } 
      }).catch(function (error) {})
    },
    getDealEmployee(){
      this.$axios.get(this.$api + 'employee/getListWithoutPage').then(res => { 
          if(res.data&&res.data.code === 200){    
            this.dealEmployeeOptions = res.data.data
            this.copyEmployeeOptions = res.data.data
          }else{
              this.$message({
                  message: res.data.message,
                  type: 'error',
                  duration: 1500
              })
          } 
      }).catch(function (error) {})
    },
    getPatient(val){
      if(val){
        this.loading = true;
        let data = {
          projectId:this.$route.query.proId,
          rows:20,
          page:1,
          patientName:val
        }
        this.$axios.post(this.$api + 'patient/getPatientList',data).then(res => { 
            if(res.data&&res.data.code === 200){    
              this.patientOptions = res.data.data.rows
            }else{
                this.$message({
                    message: res.data.message,
                    type: 'error',
                    duration: 1500
                })
            } 
            this.loading = false;
        }).catch(function (error) {})
      }else{
        this.patientOptions = []
      }
    },
    submit(formName){ // 发送消息
    console.log(this.workForm)
      let data = {
        ...this.workForm,
        copyEmployeeId:this.workForm.copyEmployeeId.join(','),
        dealEmployeeId:this.workForm.dealEmployeeId.join(','),
        label:this.workForm.label.join(','),
      }
      this.$refs[formName].validate((valid) => {
          let url = this.editId?'workOrderQilu/modify':'workOrderQilu/newOne'
          if (valid) {
            this.$axios.post(this.$api + url, data).then(res => {
              if(res.data.code === 200){
                this.$refs[formName].resetFields();
                this.$message({
                  message: "保存成功",
                  type: "success",
                  duration: 1500
                })
                this.$emit('closeDetail')
                this.$emit('getList',{status:1,copyEmployeeId:'',dealEmployeeId:JSON.parse(localStorage.getItem('userInfo')).employeeId})
              }else{
                this.$message({
                  message: res.data.message,
                  type: "error",
                  duration: 1500
                })
              }
            })
          } else {
            console.log('error submit!!');
          }
        });
    },
    getDetail(){
      this.$axios.get(this.$api + 'workOrderQilu/getDetail?id='+this.editId).then(res => {
        if(res.data.code === 200){
          let allData = res.data.data
          const isEmpty =(val)=>{
            if(val){
              console.log(val.split(','))
              return val.split(',').map((item)=>item = Number(item))
            }else{
              return []
            }
          }
          this.workForm = { 
            id:this.editId,
            workOrderCope: allData.workOrderCope,
            patientId: allData.patientId,
            dealEmployeeId: isEmpty(allData.dealEmployeeId),
            copyEmployeeId: isEmpty(allData.copyEmployeeId),
            workOrderType: allData.workOrderType,
            priorityLevel: allData.priorityLevel,
            shouldFinishTime: allData.shouldFinishTime,
            subject: allData.subject,
            content: allData.content,
            label: isEmpty(allData.label),
            createEmployeeId: allData.createEmployeeId
          }
          if(allData.workOrderCope == 2){
            this.dealEmployeeOptions = [{id:'-1',name:'志愿者'}]
          }
          this.patientOptions = [{id:allData.patientId,patientName:allData.patientName}]
          this.detail = res.data.data
        }else{
          this.$message({
            message: res.data.message,
            type: "error",
            duration: 1500
          })
        }
      })
    }
  },
  mounted(){
    
  },
  created(){
    this.isSpecial(true)
    this.isCallCenter(false)
    this.isSuper(false)
    this.getDealEmployee()//处理人
    this.getLabel()
    if(this.editId){
      this.getDetail()
    }
  }
}
</script>

<style scoped>
.el-card{overflow:inherit;}
.colorRed{color:red}
</style>
