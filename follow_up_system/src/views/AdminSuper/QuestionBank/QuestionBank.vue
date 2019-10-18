<template>
  <div class="QuestionBank content" v-loading="loading">
    <el-card shadow="always" class="mt20 ml20 mr20">
      <el-form size="mini" class="ml30" >
        <el-row>
          <el-col :span="6">
            <el-form-item label="问题名称:">
              <el-input v-model="form.val" clearable class="w120 fl"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" class="fl" @click="serchList">查询</el-button>
              <el-button type="primary" icon="el-icon-plus" class="fl" @click="newQuest">新增</el-button>
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
        <el-table-column prop="kind" label="类别" width="150" align="center"></el-table-column>
        <el-table-column prop="question" label="问题名称" align="center"></el-table-column>
        <el-table-column prop="createTime" label="时间" width="150" align="center"></el-table-column>
        <el-table-column prop="suggestT" label="推荐T次" width="150" align="center"></el-table-column>
        <el-table-column prop="type" label="问题类型" width="150" align="center" :formatter='getType'></el-table-column>
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
      :title="editId?'编辑问题':'新增问题'"
      :visible.sync="dialogVisible"
      width="40%"
       v-loading='loading'
      >
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="问题" prop="question">
          <el-input  v-model="ruleForm2.question"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="kind">
          <el-input v-model="ruleForm2.kind"></el-input>
        </el-form-item>
        <el-form-item label="建议T次" prop="suggestT">
          <el-input  v-model="ruleForm2.suggestT" ></el-input>
        </el-form-item>
        <el-form-item label="问题类型" prop="type">
          <el-radio-group v-model="ruleForm2.type" @change="selcetType">
            <el-radio :label="1">单选</el-radio>
            <el-radio :label="2">多选</el-radio>
            <el-radio :label="3">填空</el-radio>
            <el-radio :label="4">时间</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="isShowInp">
          <el-form-item
            v-for="(n, index) in ruleForm2.baseQuestionOptionList"
            :label="'选项' + (index+1)"
            :key="n.key"
            :prop="'baseQuestionOptionList.' + index + '.questionOption'"
            :rules="{required: true, message: '不能为空', trigger: 'blur'}"
          >
            <el-input v-model="n.questionOption"></el-input>
            <i :class="[index==0?'el-icon-circle-plus':'el-icon-remove-outline','ml20', 'fz24', 'vm']" @click.prevent="index==0?addQuestionOption(ruleForm2.baseQuestionOptionList.length):removeQuestionOption(n)"></i>
          </el-form-item>
        </div>
        
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
  name: "QuestionBank",
  data() {
    return {
      loading: true, //页面loading
      form: {
        // name: '',
        val: ""
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
          type:'',
          kind:'',
          suggestT:'',
          question: '',
          baseQuestionOptionList: [{ 
            questionOption: '',
            flag: 'A',
            sort:1
          }]     
        },
      rules2: {
        type: [{ required: true, message: '请输入', trigger: 'change'}],
        kind: [{ required: true, message: '请输入', trigger: 'blur'}],
        suggestT: [{ required: true, message: '请输入', trigger: 'blur'}],
        question:[{ required: true, message: '请输入', trigger: 'blur'}],
        questionOption:[{ required: true, message: '请输入', trigger: 'blur'}]
      },
      isShowInp:true , //是否显示输入框
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
      if(n==3||n==4){
        this.ruleForm2.baseQuestionOptionList=[]
      }else{
        this.ruleForm2.baseQuestionOptionList = [{questionOption:'',flag:'A',sort:1}]
      }
      this.$nextTick(()=>{
        this.isShowInp = isShow
      }) 
    },
    addQuestionOption(i) {
      let arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        this.ruleForm2.baseQuestionOptionList.push({
          questionOption: '',
          flag: arr[i],
          sort:i+1
        });
      },
    removeQuestionOption(item){
      var index = this.ruleForm2.baseQuestionOptionList.indexOf(item)
      if (index !== -1) {
        this.ruleForm2.baseQuestionOptionList.splice(index, 1)
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getList(this.form.val, 1);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getList(this.form.val, val);
    },
    getList(type, page) {
      // 获取用户登录记录 rows:每页几条，type:查询类型， page：第几页
      let that = this;
      let data = {
        page: page,
        rows: that.pageSize?that.pageSize:that.$serve.rows,
        question: type
      };
      this.$axios.post(this.$api + "question/getQuestionList", data).then(res => {
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
      this.getList(this.form.val, 1);
    },
    getType(row, column, cellValue, index){
        return cellValue>=0?this.$serve.questType[cellValue]:''
      },
    editRow(index,data){ //编辑
      this.dialogVisible = true
      this.editId = data.rows[index].id
      this.$axios.get(this.$api + 'question/getById?id='+data.rows[index].id).then(res => {
          if(res.data.code == 200){
            let _data = res.data.data.questionRepository
            this.ruleForm2= { 
              type:_data.type,
              kind:_data.kind,
              suggestT:_data.suggestT,
              question: _data.question,
              questionId:_data.id,
              baseQuestionOptionList:res.data.data.optionList    
            }    
          }else {
            this.$message({
              message: res.data.message,
              type: "error",
              duration: 1500
            });
          }
        })
    },
    deleteRow(index,data){ //del问题
      this.$confirm('此操作将删除该题, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.get(this.$api + "question/delete?questionId="+data.rows[index].id).then(res => {
          if (res.data.code === 200) {
             this.getList(this.form.val, 1);
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
    newQuest(){
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
            type:this.ruleForm2.type,
            kind:this.ruleForm2.kind,
            suggestT:this.ruleForm2.suggestT,
            question:this.ruleForm2.question,
            baseQuestionOptionList:this.ruleForm2.baseQuestionOptionList,
            id:this.editId
          }
          this.$axios.post(that.$api + 'question/addQuestion', data).then(res => { 
            console.log(res)
            if(res.data.code === 200){         
                that.loading = false;
                that.dialogVisible = false;
                that.getList(that.form.val, 1);
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
    this.getList(this.form.val, 1);
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
