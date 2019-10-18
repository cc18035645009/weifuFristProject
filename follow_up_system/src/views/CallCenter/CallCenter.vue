<template>
  <div class="CallCenter" v-loading='loading'>
    <el-row :gutter="12" class="mt10">
      <el-col :span="5" class="ml20">
        <el-card shadow="always" class="leftFrom">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
            <el-form-item label="处理状态" prop="handle">
              <el-select v-model="ruleForm.handle" placeholder="请选择" size="small" clearable>
                <el-option label="所有" value=""></el-option>
                <el-option label="待处理" value="1"></el-option>
                <el-option label="处理中" value="2"></el-option>
                <el-option label="完成" value="3"></el-option>
                <el-option label="内部升级" value="4"></el-option>
                <el-option label="外部升级" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="跟进状态" prop="following">
              <el-select v-model="ruleForm.following" placeholder="请选择" size="small" clearable>
                <el-option label="所有" value=""></el-option>
                <el-option label="待处理" value="1"></el-option>
                <el-option label="处理中" value="2"></el-option>
                <el-option label="完成" value="3"></el-option>
                <el-option label="内部升级" value="4"></el-option>
                <el-option label="外部升级" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电话类型" prop="phoneTyoe">
              <el-select v-model="ruleForm.phoneTyoe" placeholder="请选择" size="small" clearable>
                <el-option label="所有" value=""></el-option>
                <el-option label="正常" value="1"></el-option>
                <el-option label="转接" value="2"></el-option>
                <el-option label="挂断" value="3"></el-option>
                <el-option label="测试" value="4"></el-option>
                <el-option label="错号" value="5"></el-option>
                <el-option label="骚扰" value="6"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="患者类型" prop="patientType">
              <el-select v-model="ruleForm.patientType" placeholder="请选择" size="small" clearable>
                <el-option :label="item.projectName" :value="item.id" v-for="item in proList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间" >
              <el-col :span="24">
                <el-form-item prop="startTime">
                  <el-date-picker type="date" placeholder="开始日期" v-model="ruleForm.startTime" style="width: 100%;" size="mini"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="entTime">
                  <el-date-picker type="date"  placeholder="结束日期" v-model="ruleForm.entTime" style="width: 100%;" size="mini"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="来电号码" prop="callNumber">
              <el-input v-model="ruleForm.callNumber" placeholder='来电号码,模糊查询' size="small" clearable></el-input>
            </el-form-item>
            <el-form-item label="专员编号" prop="commissioner">
              <el-input v-model="ruleForm.commissioner" placeholder='专员编号,模糊查询' size="small" clearable></el-input>
            </el-form-item>
            <el-row>
              <el-button type="primary" @click="submitForm('ruleForm')" size="mini" icon='el-icon-search'>查询</el-button>
              <el-button type="primary" @click="resetForm('ruleForm')" size="mini" icon='el-icon-refresh'>重置</el-button>
              <el-button type="primary" @click="addPatient = true" size="mini" icon='el-icon-service' class="mt10">新增/跟进</el-button>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card shadow="always">
           <el-table
            size='mini'
            :data="tableData.rows"
            style="width: 100%">
            <el-table-column
              prop="id"
              label="患者ID">
            </el-table-column>
            <el-table-column
              prop="callerType"
              :formatter='callerType'
              label="患者类型">
            </el-table-column>
            <el-table-column
              prop="address"
              label="省">
            </el-table-column>
            <el-table-column
              prop="address"
              label="市">
            </el-table-column>
            <el-table-column
              prop="callNumber"
              label="来电号码">
            </el-table-column>
            <el-table-column
              prop="address"
              label="呼叫创建">
            </el-table-column>
            <el-table-column
              prop="followStatus"
              :formatter='followStatus'
              label="最后跟进">
            </el-table-column>
            <el-table-column
              prop="address"
              label="患者专员">
            </el-table-column>
            <el-table-column
              prop="address"
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="createTime"
              :formatter='createTime'
              label="创建日期">
            </el-table-column>
            <el-table-column
              prop="callType"
              label="电话类型">
            </el-table-column>
            <el-table-column
              prop="dealStatus"
              label="处理状态">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="patientDetail(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage4"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.total"
            class="mt20 tr"
            >
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="新增患者" :visible.sync="addPatient" width="70%" class="add">
      <new-or-follow @patientDetail='patientDetail'></new-or-follow>
    </el-dialog>
    <el-dialog :visible.sync="isDetail" :fullscreen= true>
      <patient-detail v-if="isDetail" :patientCode = "patientCode" :patientId='patientId' @closeDetail="isDetail = false" activeTab='callCenter' class='h100'></patient-detail>
    </el-dialog>

  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import PatientDetail from '../Specialist/PatientManage/PatientDetail/PatientDetail'
import NewOrFollow from './NewOrFollow'
export default {
  name: 'CallCenter',
  data() {
    return {
      loading:false,
       ruleForm: {
          handle: '',
          following: '',
          phoneTyoe:'',
          patientType:'',
          startTime: '',
          entTime: '',
          callNumber: '',
          commissioner:''
        },
        rules: {
          handle: [{ required: false, message: '请选择', trigger: 'change' }],
          following:[{ required: false, message: '请选择', trigger: 'change' }],
          phoneTyoe:[{ required: false, message: '请选择', trigger: 'change' }],
          patientType:[{ required: false, message: '请选择', trigger: 'change' }],
          startTime: [
            { required: false, message: '请选择日期', trigger: 'change' }
          ],
          entTime: [
            { required: false,  message: '请选择时间', trigger: 'change' }
          ],
          callNumber: [
            { required: false, message: '请输入', trigger: 'blur' },
            { min: 1, max: 11, message: '长度在 1 到 11 个字符', trigger: 'blur' }
          ],
          commissioner:[{ required: false, message: '请输入', trigger: 'blur' }]
        },
        proList:[],
        selectRows:'',
        tableData:{
          rows:[],
          total:0
        },
        currentPage4: 1,
        addPatient:false,
        isDetail: false,
        patientCode:'',
        patientId:''
    };
  },
  methods: {
    ...mapMutations([
      'isSuper',
      'isSpecial',
      'isCallCenter'
    ]),
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.currentPage4 = 1
            this.getList()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleSizeChange(val) {
       this.selectRows = val //用户控制rows
       this.getList()
      },
      handleCurrentChange(val) {
        this.getList({page:val}) //用户选择页数
      },
      getList(val={}){    
        let that = this
        this.loading = true
        let data = {
              page:1,
              rows:that.selectRows?that.selectRows:that.$serve.rows,
              dealStatus:this.ruleForm.handle,
              followStatus:this.ruleForm.following,
              callType:this.ruleForm.phoneTyoe,
              projectId:this.ruleForm.patientType,
              startDate:this.ruleForm.startTime,
              endDate:this.ruleForm.entTime,
              callNumber:this.ruleForm.callNumber,
              commissioner:this.ruleForm.commissioner,
              ...val
            }
        this.$axios.post(that.$api + 'call/getList', data).then(res => { // 登录
            console.log(res)
            if(res.data.code === 200){         
                that.loading = false;
                that.tableData = res.data.data
            }else{
                that.loading = false
                that.$message({
                    message: res.data.message,
                    type: 'error',
                    duration: 1500
                })
                return false
            } 
        })
      },
      getProList(){ // 获取项目列表
        let proData = {
          page: 1,
          rows: 50,
          status: 1
        }
        this.$axios.post(this.$api + 'project/getProjectList', proData).then(res => {
          if(res.data.code == 200){
            this.proList = res.data.data.rows
          }
        })
      },
      patientDetail(row){ // 查看患者详情
        this.patientCode = row.patientCode
        this.patientId = row.patientId
        this.isDetail = true
      },
      callerType(row, column, cellValue, index){
        return cellValue>=0?this.$serve.callerType[cellValue]:''
      },
      followStatus(row, column, cellValue, index){
        return cellValue>=0?this.$serve.followStatus[cellValue]:''
      },
      createTime(row, column, cellValue, index){
        return cellValue?this.$serve.timemin(cellValue):''
      },
  },
  created() {
    this.isSpecial(false)
    this.isSuper(false)
    this.isCallCenter(true)
    this.getList()
    this.getProList()
  },
  components: {
    PatientDetail,NewOrFollow
  }
}
</script>
<style scoped >
.el-pagination{
  position:static;
}
.leftFrom >>> .el-card__body{padding:15px;}
.add >>> .el-dialog__body{padding:5px 15px 15px 15px;}
</style>