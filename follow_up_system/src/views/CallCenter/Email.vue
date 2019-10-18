<template>
  <div class="Email">
    <el-card shadow="always" class="mt10 ml20 mr20">
      <el-form :inline="true" :model="formInline" class="demo-form-inline mt20 ml10">
        <el-form-item label="邮件标题">
          <el-input v-model="formInline.mailSubject" clearable placeholder="邮件标题" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        size='mini'
        :data="tableData.rows"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="收件人">
        </el-table-column>
        <el-table-column
          prop="name"
          label="抄送">
        </el-table-column>
        <el-table-column
          prop="address"
          label="发送日期">
        </el-table-column>
        <el-table-column
          prop="address"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="address"
          label="邮件内容">
        </el-table-column>
        <el-table-column
          prop="address"
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
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'

export default {
  name: 'Email',
  data() {
    return {
      tableData: {
          rows:[],
          total:0
          },
        currentPage4: 1,
        formInline: {
          mailSubject: '',
        },
        selectRows:'',
        judgePowers: '' //权限列表
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
        this.$axios.post(that.$api + 'mail/getList', data).then(res => { // 登录
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
  },
  created() {
    this.isSpecial(false)
    this.isSuper(false)
    this.isCallCenter(true)
    this.getList()
    this.judgePowers = JSON.parse(localStorage.getItem('judgePowers'))
  },
  components: {

  }
}
</script>
<style scoped>
.el-pagination{
  position:static;
}
</style>