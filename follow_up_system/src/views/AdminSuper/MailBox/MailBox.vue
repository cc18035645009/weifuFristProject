<template>
  <div class="MailBox content" v-loading="loading">
    <el-card shadow="always" class="mt20 ml20 mr20">
      <el-form size="mini" class="ml30" >
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名:">
              <el-input v-model="form.userName" clearable class="fl"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱:">
              <el-input v-model="form.mail" clearable class="fl"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" class="fl" @click="serchList">查询</el-button>
              <el-button type="primary" icon="el-icon-plus" class="fl" @click="newEmail">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="tableData.rows"
        ref="singleTable"
        class="ml10"
        size="mini"
        align="center" 
      >
        <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="mail" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="createTime" label="时间" align="center"></el-table-column>
        <el-table-column label="编辑" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="editRow(scope.$index, tableData)"
              type="text"
              size="small">
              编辑
            </el-button>
            <span class="line ml10 mr10">|</span>
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
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
    </el-card>
    <!--新增 start-->
    <el-dialog
      :title="editId?'编辑邮箱':'新增邮箱'"
      :visible.sync="dialogVisible"
      width="40%"
       v-loading='loading'
      >
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="userName">
          <el-input  v-model="ruleForm2.userName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="ruleForm2.mail"></el-input>
        </el-form-item>

        <el-form-item class="tr">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
     <!--新增 end-->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "MailBox",
  data() {
    return {
      loading: true, //页面loading
      form: {
        userName: '',
        mail: ""
      },
      tableData: {
          rows:[],
          total:0
          },
      currentPage: 1,
      pageSize: 0 ,// 每页显示个数
      dialogVisible:false,
      editId:'',//编辑row的id
      ruleForm2: {
          userName:'',
          mail:'',   
        },
      rules2: {
        userName: [{ required: true, message: '请输入', trigger: 'change'}],
        mail: [{ required: true, message: '请输入', trigger: 'blur'}],
      },
    };
  },
  methods: {
    ...mapMutations({
      isSuper: 'isSuper',
      isCallCenter: "isCallCenter",
      isSpecial: 'isSpecial'
    }),
    selcetType(n){ //控制选项显隐
      let isShow = n==3?false:true;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getList(this.form, 1);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getList(this.form, val);
    },
    getList(form, page) {
      // 获取用户登录记录 rows:每页几条，type:查询类型， page：第几页
      let that = this;
      let data = {
        page: page,
        rows: that.pageSize?that.pageSize:that.$serve.rows,
        ...form
      };
      this.$axios.post(this.$api + "mailBox/getPageList", data).then(res => {
        if (res.data.code === 200) {
          res.data.data.rows.map(item => {
            item.createTime = that.$serve.timemin(item.createTime);
          });
          this.tableData = res.data.data;
        } else {
          this.$message({
            message: res.data.message,
            type: "error",
            duration: 1500
          });
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
    editRow(index,data){ //编辑
      this.dialogVisible = true
      this.editId = data.rows[index].id
      this.ruleForm2= {
        userName:data.rows[index].userName,
        mail:data.rows[index].mail, 
      } 
    },
    deleteRow(index,data){ //del
      this.$confirm('此操作将删除该邮箱, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get(this.$api + "mailBox/deleteMail?id="+data.rows[index].id).then(res => {
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
    newEmail(){
      this.dialogVisible = true;
      this.editId = '';
      this.$nextTick(()=>{
        this.$refs['ruleForm2'].resetFields();
      })
    },
    submitForm(formName) { //新增or编辑
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          let data = {
            userName:this.ruleForm2.userName,
            mail:this.ruleForm2.mail,
            id:this.editId
          }
          this.$axios.post(that.$api + 'mailBox/newOne', data).then(res => { 
            console.log(res)
            if(res.data.code === 200){         
                that.loading = false;
                that.dialogVisible = false;
                that.getList(that.form, 1);
                that.$message({
                    message: res.data.message,
                    type: 'success',
                    duration: 1500
                })
                that.$refs[formName].resetFields();
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
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
  mounted() {
    let that = this;
    this.getList(this.form, 1);
    setTimeout(function() {
      that.loading = false;
    }, 300);
  },
  created() {
    this.isSuper(true)
    this.isSpecial(false)
    this.isCallCenter(false)
  }
};
</script>

<style scoped>
.el-table {
  width: 80%;
}
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
