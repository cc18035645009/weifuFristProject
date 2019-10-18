<template>
  <div class="NewOrFollow">
    <el-card shadow="always">
      <el-form :inline="true" :model="formInline" class="demo-form-inline ml10">
        <el-form-item label="姓名">
          <el-input v-model="formInline.patientName" clearable size="small"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="formInline.patientPhone" clearable size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addPatient = true" size="small">新增</el-button>
        </el-form-item>
      </el-form>
      <div>患者列表(单击查询明细，双击跟进)</div>
      <el-table
        highlight-current-row
        size='mini'
        :data="tableData.rows"
        style="width: 100%"
        @row-click='clickPatient'
        @row-dblclick='dblClickPatient1'
        >
        <el-table-column
          width="80"
          prop="patientName"
          label="姓名">
        </el-table-column>
        <el-table-column
          width="100"
          prop="patientPhone"
          label="患者手机">
        </el-table-column>
        <el-table-column
          width="100"
          prop="familyPhone"
          label="家属手机">
        </el-table-column>
        <el-table-column
          width="50"
          prop="sex"
          label="性别">
          <template slot-scope="scope">
            {{scope.row.sex ==1?'男':'女'}}
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          prop="provinceName"
          label="省市">
          <template slot-scope="scope">
            {{scope.row.provinceName}}({{scope.row.cityName}})
          </template>
        </el-table-column>
        <el-table-column
          prop="hospitalName"
          label="就诊医院">
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
    <el-card shadow="always" class="mt10">
      <div>呼叫记录(点击可跟进)</div>
      <el-table
        size='mini'
        :data="table2Data.rows"
        style="width: 100%"
        @row-click='dblClickPatient2'
        >
        <el-table-column
          prop="callType"
          :formatter='getCallType'
          label="来电类型">
        </el-table-column>
        <el-table-column
          prop="askType"
          :formatter='getAskType'
          label="咨询类型">
        </el-table-column>
        <el-table-column
          prop="createTime"
          :formatter='createTime'
          label="咨询创建时间">
        </el-table-column>
        <el-table-column
          prop="followCommissioner"
          label="最后跟进">
        </el-table-column>
        <el-table-column
          prop="followStatus"
          :formatter="getFollowStatus"
          label="跟进状态">
        </el-table-column>      
      </el-table>
    </el-card>

    <el-dialog title="新增患者" :visible.sync="addPatient" width="70%" class="add" append-to-body>
      <add-patient v-if="addPatient" @close='closeDialog'></add-patient>
    </el-dialog>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import AddPatient from '../Specialist/PatientManage/CheckPatient/AddPatient'
export default {
  name: 'NewOrFollow',
  data() {
    return {
      tableData: {
        rows:[],
        total:0
        },
      currentPage4: 1,
      formInline: {
        patientName: '',
        patientPhone:''
      },
      selectRows:'',
      judgePowers: '', //权限列表
      table2Data: {
        rows:[],
        total:0
        },
      addPatient:false
    };
  },
  methods: {
     ...mapMutations([
      'isSuper',
      'isSpecial',
      'isCallCenter'
    ]),
    handleSizeChange(val) {
      this.selectRows = val //用户控制rows
      this.getList({...this.formInline}) //查询
    },
    handleCurrentChange(val) {
      this.getList({...this.formInline ,page:val}) //用户选择页数
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    onSubmit() {
        this.currentPage4 = 1
        this.getList({...this.formInline}) //查询
      },
    getList(val={}){    
        let that = this
        this.loading = true
        let data = {
              page:1,
              rows:that.selectRows?that.selectRows:that.$serve.rows,
              ...val
            }
        this.$axios.post(that.$api + 'patient/getPatientList', data).then(res => { // 登录
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
    clickPatient(row, column, event){
      let data = {
          page:1,
          rows:50,
          callNumber:row.patientPhone
        }
      this.$axios.post(this.$api + 'call/getList', data).then(res => { // 登录
          if(res.data.code === 200){         
              this.loading = false;
              this.table2Data = res.data.data
          }else{
              this.loading = false
              this.$message({
                  message: res.data.message,
                  type: 'error',
                  duration: 1500
              })
              return false
          } 
      })
    },
    dblClickPatient1(row, column, event){
      this.$emit('patientDetail',{patientCode:row.patientCode,patientId:row.id})
    },
    dblClickPatient2(row, column, event){
      this.$emit('patientDetail',{patientCode:row.patientCode,patientId:row.patientId})
    },
    closeDialog(type) {
        this.$nextTick(() => {
          this.getList()
        }) 
      this.addPatient = false
    },
    getCallType(row, column, cellValue, index){
      return cellValue>=0?this.$serve.callType[cellValue]:''
    },
    getAskType(row, column, cellValue, index){
      return cellValue>=0?this.$serve.askType[cellValue]:''
    },
    createTime(row, column, cellValue, index){
      return cellValue?this.$serve.timemin(cellValue,'YMDHM'):''
    },
    getFollowStatus(row, column, cellValue, index){
      return cellValue?this.$serve.followStatus[cellValue]:''
    },
  },
  created() {
    this.isSpecial(false)
    this.isSuper(false)
    this.isCallCenter(true)
    this.getList()
    this.judgePowers = JSON.parse(localStorage.getItem('judgePowers'))
  },
  components: {
    AddPatient
  }
}
</script>
<style scoped>
.el-pagination{
  position:static;
}

</style>