<template>
  <div class="EmailList">
    <el-container>
      <el-aside style='width:auto'>
        <el-card class="box-card mt10">
          <div slot="header" class="clearfix">
            <span>邮件记录</span>
            <el-button style="float: right; padding: 3px 0" type="text" class="fl" icon="el-icon-plus" @click.stop="addEmail">新建邮件</el-button>
          </div>
          <el-table :data="tableData.rows" ref="tableData" style="width: 100%" size="mini" :highlight-current-row="true" @row-click="changeEmail">
            <el-table-column  prop="mailContent" label="发送内容" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="createTime" label="发送时间" align="center" width='100'></el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            layout="total, prev, pager, next, jumper"
            :total="tableData.total"
            class="mt10 tr"
            >
          </el-pagination>
        </el-card>
      </el-aside>
      <el-container class="ml30 mt10 w10p" v-loading="loading">
        <el-card :border='false' class="w10p posRel">
          <div :class="['fz12 posAbs cue colorW pt5 pr10 pb5 pl10 borRad',active==1?'':'no',]">发送邮件</div>
          <send-email @setActive='active = 1'></send-email>
        </el-card>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import SendEmail from "./SendEmail"
export default {
  name:'EmailList',
  props:['patientCode'],
  data() {
    return {
      loading: true, //页面loading
      tableData: {
          rows:[],
          total:0
          },
      currentPage: 1,

      active:''
    }
  },
  methods: {
    addEmail(){ // 新建
      this.$refs.tableData.setCurrentRow()
      this.$nextTick(()=>{
        this.$refs['msgForm'].resetFields();
      })
      this.loading = true
      setTimeout(()=>{
        this.loading = false
      },500)
    },
    changeEmail(row, event, column){ // 切换左侧
      this.msgForm = row
    },
    handleCurrentChange(val) {
      this.getList(this.form, val);
    },
    getList(form, page) {
      let that = this;
      let data = {
        page: page,
        rows: that.$serve.rows,
        toUserCode:this.patientCode,
        ...form
      };
      this.loading = true
      this.$axios.post(this.$api + "mail/getList", data).then(res => {
        if (res.data.code === 200) {
          res.data.data.rows.map(item => {
            item.createTime = that.$serve.timemin(item.createTime);
          });
          this.tableData = res.data.data;
          this.loading = false
        } else {
          this.$message({
            message: res.data.message,
            type: "error",
            duration: 1500
          });
          this.loading = false
        }
        console.log(res);
      });
    },
    getType(row, column, cellValue, index){
        return cellValue>=0?this.$serve.questType[cellValue]:''
    },
  },
  mounted() {
    this.getList({}, 1);
  },
  components: {
    SendEmail,
  }
}
</script>

<style scoped>
.el-pagination{
  position:static;
}
.line{
  vertical-align: initial;color: #409EFF;
}
.el-input{
  width: 80%;
}
</style>
