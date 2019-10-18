<template>
  <div class="Article" v-loading='loading'>
    <!-- <el-form size="mini" class="ml30" >
      <el-row>
        <el-col :span="8">
          <el-form-item label="手机:">
            <el-input v-model="form.mobile" clearable class="fl"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" class="fl" @click="serchList">查询</el-button>
            <el-button type="primary" icon="el-icon-plus" class="fl"  @click="dialogEmailVisible = true">新增</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form> -->
    <el-table
      :data="tableData.rows"
      ref="singleTable"
      class="ml10"
      size="mini"
      align="center" 
    >
      <el-table-column prop="title" label="文章标题" align="center"></el-table-column>
      <!-- <el-table-column prop="authorName" label="文章作者" align="center"></el-table-column> -->
      <el-table-column prop="userArticle.days" label="推送天数" align="center"></el-table-column>
      <el-table-column prop="createTime" label="文章创建时间" align="center" :formatter='setTime'></el-table-column>
      <el-table-column prop="userArticle.isRead" label="是否已读" align="center" :formatter='read'></el-table-column>
      <el-table-column prop="userArticle.isGood" label="是否点赞" align="center" :formatter='good'></el-table-column>
      <!-- <el-table-column label="编辑" align="center">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            type="text"
            size="small">
            删除
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.total"
      class="mt10 tr"
      >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name:'Article',
  props:['mobile'],
  data() {
    return {
      loading: true, //页面loading
      form: {
        mobile:''
      },
      tableData: {
          rows:[],
          total:0
          },
      currentPage: 1,
      pageSize: 0 ,// 每页显示个数
    }
  },
  created() {

  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getList(this.form, 1);
    },
    handleCurrentChange(val) {
      this.getList(this.form, val);
    },
    getList(form, page) {
      let that = this;
      let data = {
        page: page,
        rows: that.pageSize?that.pageSize:that.$serve.rows,
        //...form
        mobile:this.mobile
      };
      this.loading = true
      this.$axios.get(`https://bird.ioliu.cn/v1/?url=http://bmstest.bnd.microzan.com.cn/test/getArticle/getList2?page=${data.page}&rows=${data.rows}&mobile=${data.mobile}`,data ).then(res => {
        if (res.data.code === 200) {
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
    serchList() {
      // 搜索登录记录类型
      this.currentPage = 1
      this.getList(this.form, 1);
    },
    getType(row, column, cellValue, index){
        return cellValue>=0?this.$serve.questType[cellValue]:''
    },
    deleteRow(index,data){ //del问题
      this.$confirm('此操作将删除该题, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return false
          this.$axios.get(this.$api + "question/delete?questionId="+data.rows[index].id).then(res => {
          if (res.data.code === 200) {
             this.getList(this.form, 1);
             this.$message({
              type: 'success',
              message: res.data.message
            });
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
              duration: 1500
            });
          }
        })
      }).catch(() => {});
    },
    closeEmail(){
      console.log('关闭弹窗')
    },
    read(row, column, cellValue, index){
      return cellValue==1?'未读':'已读'
    },
    good(row, column, cellValue, index){
      return cellValue==1?'未点赞':'已点赞'
    },
    setTime(row, column, cellValue, index){
      return cellValue>=0?this.$serve.timemin(cellValue):''
    },
  },
  mounted() {
    this.getList(this.form, 1);
  },
  components: {
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
