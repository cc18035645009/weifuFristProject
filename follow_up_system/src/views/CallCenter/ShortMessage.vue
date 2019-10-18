<template>
  <div class="ShortMessage">
    <el-row :gutter="12" class="mt10">
      <el-col :span="24">
        <el-card shadow="always" class='ml20 mr20'>
          <el-form :inline="true" :model="formInline" label-width="100px" class="demo-form-inline mt20">
            <el-form-item label="选择项目">
              <el-select v-model="formInline.projectId" size="small" clearable>
                <el-option :label="item.projectName" :value="item.id" v-for="item in proList" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否回复">
              <el-select v-model="formInline.isReply" size="small" clearable>
                <el-option label="所有" value=""></el-option>
                <el-option label="有回复" value="1"></el-option>
                <el-option label="没回复" value="2"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="回复内容">
              <el-input v-model="formInline.user" size="small" clearable></el-input>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
            </el-form-item>
          </el-form>
           <el-table
            size='small'
            :data="tableData.rows"
            style="width: 100%">
            <el-table-column
              prop="id"
              label="患者ID">
            </el-table-column>
            <el-table-column
              prop="patientName"
              label="姓名">
            </el-table-column>
            <el-table-column
              prop="patientPhone"
              label="号码">
            </el-table-column>
            <el-table-column
              prop="classification"
              :formatter= 'classification'
              label="人群&活动分类">
            </el-table-column>
            <el-table-column
              prop="address"
              label="发送时间">
            </el-table-column>
            <el-table-column
              prop="messageContent"
              label="发送内容">
            </el-table-column>
            <el-table-column
              prop="address"
              label="回复时间">
            </el-table-column>
            <el-table-column
              prop="replyContent"
              label="回复内容">
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
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'

export default {
  name: 'ShortMessage',
  data() {
    return {
      loading:false,
      selectRows:'',
      tableData: {
          rows:[],
          total:0
          },
      currentPage4: 1,
      formInline: {
          projectId:'',
          user: '',
          isReply:''
        },
      proList:[],
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
    onSubmit() {
        console.log('submit!',this.formInline);
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
        this.$axios.post(that.$api + 'message/getList', data).then(res => { // 登录
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
      classification(row, column, cellValue, index){
        return cellValue?this.$serve.classification[cellValue]:''
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

  }
}
</script>
<style scoped >
.el-pagination{
  position:static;
}
</style>