<template>
<!-- 问卷管理  -->
  <div class="QuestionnaireManage content" v-loading="loading">
    <el-card shadow="always" class="mt20 ml20 mr20">
      <el-form size="mini" class="ml30" >
        <el-row>
          <el-col :span="6">
            <el-form-item label="问卷名称:">
              <el-input v-model="form.val"  class="w120 fl"></el-input>
              <!-- <el-select v-model="form.val" class="w100 fl" placeholder>
                <el-option label="登录" value="1"></el-option>
                <el-option label="修改密码" value="2"></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
                  <el-form-item label="工号:">
                      <el-input v-model="form.name"  class="w120 fl"></el-input>
                  </el-form-item>
          </el-col>-->
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" class="fl" @click="searchList">查询</el-button>
              <el-button type="primary" icon="el-icon-plus" class="fl" @click="addPaper">新增</el-button>
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
        <el-table-column prop="paperName" label="问卷名称" width="150" align="center"></el-table-column>
        <el-table-column prop="createTime" label="时间" width="150" align="center"></el-table-column>
        <el-table-column prop="followTemplateStageName" label="模板名称" align="center"></el-table-column>
        <el-table-column label="编辑" align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData,'edit')"
              type="text"
              size="small">
              编辑
            </el-button>
            <span class="line ml10 mr10">|</span>
            <el-button
              @click.native.prevent="addQuetion(scope.$index, tableData)"
              type="text"
              size="small">
              添加问题
            </el-button>
            <span class="line ml10 mr10">|</span>
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData,'del')"
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
    <!-- 新增or编辑问卷 -->
      <el-dialog
        title="问卷信息"
        :visible.sync="paperPop"
        width="40%"
        v-loading='loading'
        >
        <el-form :model="addPaperForm" status-icon :rules="addPaperFormR" ref="addPaperForm" label-width="130px" class="demo-ruleForm">
          <el-form-item label="问卷名称" prop="paperName">
            <el-input v-model="addPaperForm.paperName" clearable></el-input>
          </el-form-item>
          <!-- <el-form-item label="T次模板" prop="followTemplateStageId">
            <el-select v-model="addPaperForm.followTemplateStageId" @change="templateChange" clearable>
              <el-option :label="item.followTemplateName" :value="item.id" v-for="item in templateList" :key="item.id"></el-option>
            </el-select>
          </el-form-item> -->
          
          <el-form-item class="tr">
            <el-button @click="paperPop = false">取 消</el-button>
            <el-button type="primary" @click="submitPaperForm('addPaperForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 编辑问卷 end -->
      <!-- 问卷添加问题 -->
      <el-dialog
        title="问题列表"
        :visible.sync="questionPop"
        width="80%"
        v-loading='loading'
        >
        <el-button type="primary" icon="el-icon-plus" size="small" @click="newPop" class="ml50">新增问题</el-button>  
        <el-main class="w10p">
          <el-table :data="TListDetail.questionToList?TListDetail.questionToList:[]" ref="singleTable" size="small" align="center" height="450" style="width: 100%">
            <el-table-column prop="questionRepository.id" label="ID" width="80" align="center"></el-table-column>
            <el-table-column prop="questionRepository.question" label="问题标题" width="300" align="center"></el-table-column>
            <el-table-column prop="questionRepository.type" label="问题类型" align="center" width="90" :formatter='setType'></el-table-column>
            <el-table-column prop="questionRepository.createTime" label="最后修改时间" align="center" width="120" :formatter='setTime'></el-table-column>
            <el-table-column prop="sort" label="排序" align="center" width="250">
              <template slot-scope="scope">
                <span v-show="NoEdit != scope.row.relationshipId">{{scope.row.sort}}<i class="el-icon-edit ml10 cursor" @click="NoEdit=scope.row.relationshipId"></i></span>
                <span v-show="NoEdit == scope.row.relationshipId">
                  <el-input-number size='mini' :min='1' v-model="sort"></el-input-number>
                  <i class="cursor ml10 colorblue" @click="savaSort(scope.row)">保存</i>
                  <i class="cursor ml10 colorblue" @click="NoEdit=''">取消</i>
                </span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="editRow(scope.$index, TListDetail.questionToList)"
                  type="text"
                  size="small">
                  详情
                </el-button>
                <span class="line ml10 mr10">|</span>
                <el-button
                  @click.native.prevent="setPrecondition(scope.$index, TListDetail.questionToList)"
                  type="text"
                  size="small">
                  设置前置条件
                </el-button>
                <span class="line ml10 mr10">|</span>
                <el-button
                  @click.native.prevent="deleteRowQ(scope.$index, TListDetail.questionToList)"
                  type="text"
                  size="small">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>         
        <div class="tr">
          <el-button @click="questionPop = false">返 回</el-button>
        </div>
        <!-- 设置前置条件 -->
        <el-dialog
          title="设置前置条件"
          :visible.sync="isPrecondition"
          width="40%"
          v-loading='loading'
          append-to-body
          >
          <el-form label-position='top' :model="preconditionForm" status-icon :rules="preconditionFormR" ref="preconditionForm" label-width="130px" class="demo-ruleForm">
            <el-form-item label="用药状态" prop="drugStatus">
              <el-radio-group v-model="preconditionForm.drugStatus" class="lh30">
                <el-radio :label="1">用药中</el-radio>
                <el-radio :label="2">暂停用药</el-radio>
                <el-radio :label="3">停止用药</el-radio>
                <el-radio :label="4">未启用（已处方）</el-radio>
                <el-radio :label="5">非患者</el-radio>
                <el-radio :label="6">重新使用</el-radio>
                <el-radio :label="7">不依赖用药状态</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item class="tr">
              <el-button @click="isPrecondition = false">取 消</el-button>
              <el-button type="primary" @click="submitPreconditionForm('preconditionForm')">提交</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 设置前置条件 end -->
        <!-- 新增问题 -->
        <el-dialog
          :title="editId?'查看问题':'新增问题'"
          :visible.sync="dialogVisible"
          width="40%"
          v-loading='loading'
          append-to-body
          >
          <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
            <el-form-item label="问题" prop="questionId" v-if="!isAdd">
              <el-select v-model="ruleForm2.questionId" filterable placeholder='如果搜不到，点击右侧' :disabled='isNoClick' @change="getOneQuestDetail" clearable>
                <el-option
                  v-for="item in allQuestionList"
                  :key="item.id"
                  :label="item.question"
                  :value="item.id">
                </el-option>
              </el-select>
              <i class="el-icon-sort ml20 fz16 cursor" :class="isNoClick?'noClick':''" @click="clearVal(true,'ruleForm2')"></i>
            </el-form-item>
            <el-form-item label="排序" prop="sort" v-if="!isAdd">
              <el-input-number  v-model="ruleForm2.sort" :min='1' placeholder='请输入' clearable :disabled='isNoClick'></el-input-number>
            </el-form-item>
            <el-form-item label="问题" prop="question" v-if="isAdd">
              <el-input  v-model="ruleForm2.question" placeholder='请输入' clearable :disabled='isNoClick'></el-input>
              <i class="el-icon-sort ml20 fz16 cursor" @click="clearVal(false,'ruleForm2')"></i>
            </el-form-item>
            <el-form-item label="类别" prop="kind">
              <el-input v-model="ruleForm2.kind" :disabled='isNoClick?isNoClick:!isAdd' clearable></el-input>
            </el-form-item>
            <el-form-item label="建议T次" prop="suggestT">
              <el-input  v-model="ruleForm2.suggestT" :disabled='isNoClick?isNoClick:!isAdd' clearable></el-input>
            </el-form-item>
            <el-form-item label="问题类型" prop="type">
              <el-radio-group v-model="ruleForm2.type" @change="selcetType" :disabled='isNoClick?isNoClick:!isAdd' clearable>
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
                <el-input v-model="n.questionOption" :disabled='isNoClick?isNoClick:!isAdd' clearable></el-input>
                <i :class="[index==0?'el-icon-circle-plus':'el-icon-remove-outline',isAdd&&!isNoClick?'':'noClick','ml20', 'fz24', 'vm']" @click.prevent="index==0?addQuestionOption(index):removeQuestionOption(n)"></i>
              </el-form-item>
            </div>
            
            <el-form-item class="tr">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" :disabled='isNoClick' @click="submitForm('ruleForm2')">提交</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 新增问题 end-->
      </el-dialog>
      <!-- 问卷添加问题 end -->
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "QuestionnaireManage",
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
      pageSize: 0, // 每页显示个数
      paperPop:false,
      templateList:[],
      onePaperDetail:{},
      addPaperForm: { // 问卷表单
          id:'',
          paperName: '',
          followTemplateStageId:'',
          followTemplateName:''
      },
      addPaperFormR: { // 问卷验证
          paperName: [
              { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],
          followTemplateStageId: [
              { required: false, message: '请输入项目开始时间', trigger: 'change' }
          ],
      },
      questionPop:false,
      TListDetail:{},
      NoEdit:'',//是否编辑sort
      sort:'',//编辑当前行的sort
      allQuestionList:[],
      editId:'',
      dialogVisible:false,
      ruleForm2: { //新增问题
          type:'',
          kind:'',
          suggestT:'',
          question: '',
          questionId:'',
          sort:'',
          baseQuestionOptionList: [{ 
            questionOption: '',
            flag: 'A',
            sort:1
          }]     
        },
      rules2: {//新增问题
        type: [{ required: true, message: '请输入', trigger: 'change'}],
        kind: [{ required: true, message: '请输入', trigger: 'blur'}],
        sort: [{ required: true, message: '请输入', trigger: 'blur'}],
        suggestT: [{ required: true, message: '请输入', trigger: 'blur'}],
        question:[{ required: true, message: '请输入', trigger: 'blur'}],
        questionId: [{ required: true, message: '请输入', trigger: 'change'}],
        questionOption:[{ required: true, message: '请输入', trigger: 'blur'}]
      },
      isShowInp:true,
      oneQuestionDetail:{},
      isPrecondition:false,//是否显示设置前置条件弹窗
      preconditionForm: { // 前置条件表单
          drugStatus: '',
          id:''
      },
      preconditionFormR: { // 前置条件验证
          drugStatus: [
              { required: true, message: '请输入项目名称', trigger: 'change' }
          ]
      },
      isNoClick:false,//点击详情禁止提交
      isAdd:false,//是新增问题，还是绑定问题
    };
  },
  methods: {
    ...mapMutations({
      isSuper: 'isSuper',
      isCallCenter: "isCallCenter",
      isSpecial: 'isSpecial'
    }),
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.getList(this.form.val, 1);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getList(this.form.val, val);
    },
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
          flag: arr[i+1],
          sort:i+2
        })
      },
    getList(type, page) {
      //  rows:每页几条，type:查询类型， page：第几页
      let that = this;
      let data = {
        page: page,
        rows: that.pageSize?that.pageSize:that.$serve.rows,
        paperName: type
      };
      this.$axios.post(this.$api + "paper/getPaperList", data).then(res => {
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
    searchList() {
      // 搜索
      this.currentPage = 1
      this.getList(this.form.val, 1);
    },
    templateChange(val){ //获取模板名字
      let obj ={}
      obj = this.templateList.find(item => item.id == val)
      this.addPaperForm.followTemplateName = obj.followTemplateName
    },
    deleteRow(index,data,type){ //编辑
      if(type == 'del'){ //删除
        this.$confirm('此操作将删除该问卷, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.get(this.$api + "paper/deletePaper?paperId="+data.rows[index].id).then(res => {
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
      }else{//编辑
        this.paperPop = true
        this.getAllPaper()
        this.addPaperForm.id = data.rows[index].id;
        this.loading = true;
        this.getOnePaper(data.rows[index].id)
      }
    },
    deleteRowQ(index,data){ //del问题
      this.$confirm('此操作将删除该题, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        //del 问卷解绑问题
        this.$axios.get(this.$api + "paper/deleteQuestion?id="+data[index].relationshipId).then(res => {
          if (res.data.code === 200) {
            this.getQuestionOnPaper(this.editId);
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
     getOnePaper(id){//获取单个问卷详情
      let that = this
      that.loading = true;
      this.$axios.post(that.$api + 'paper/getSettingInfo', {id:id}).then(res => { 
        if(res.data.code === 200){         
          that.loading = false;
          that.onePaperDetail = res.data.data
          that.addPaperForm.paperName = res.data.data.paperName
          that.addPaperForm.followTemplateStageId = res.data.data.followTemplateStageId
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
    getAllPaper(){ //所有模板
      let that = this
      that.loading = true;
      this.$axios.post(that.$api + 'template/getTemplateList', {}).then(res => { 
        if(res.data.code === 200){         
          that.loading = false;
          that.templateList = res.data.data
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
    addQuestionOption(i) { //选项
      let arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        this.ruleForm2.baseQuestionOptionList.push({
          questionOption: '',
          flag: arr[i+1],
          sort:i+2
        });
      },
    addPaper(){ //打开弹窗
      this.paperPop = true
      this.getAllPaper()
      this.$nextTick(()=>{
          this.$refs['addPaperForm'].resetFields();
        })    
    },
    submitPaperForm(formName){ //新增问卷or编辑
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          let data = { 
              ...this.addPaperForm,
              createUserId:JSON.parse(localStorage.getItem('userInfo')).employeeId
          }
          this.$axios.post(that.$api + 'paper/addOrUpdate', data).then(res => { 
            if(res.data.code === 200){         
                that.loading = false;
                that.paperPop = false;
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
    addQuetion(index,data){
      let id = data.rows[index].id;
      this.editId = id
      this.questionPop = true;
      this.getQuestionOnPaper(id)
    },
    getQuestionOnPaper(id){//获取问卷
      let that = this
      that.loading = true;
      this.$axios.post(that.$api + 'paper/getSettingInfo', {id:id}).then(res => { 
        if(res.data.code === 200){         
          that.loading = false;
          that.TListDetail = res.data.data
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
     newPop() { 
      this.dialogVisible = true
      this.isNoClick = false
      this.getAllQuestList()
      this.$nextTick(()=>{
        this.$refs['ruleForm2'].resetFields();
      })  
    },
    setTime(row, column, cellValue, index){
      return cellValue>=0?this.$serve.timemin(cellValue):''
    },
    setType(row, column, cellValue, index){
      return cellValue>=0?this.$serve.questType[cellValue]:''
    },
    savaSort(rows){
      let reg = /^[0-9]*$/;
      let that = this
      let arr = []
      if(!reg.test(this.sort)){
        this.$message({
          message: '请输入数字',
          type: 'warning'
        });
        return false
      }
      arr.push({
        questionId:rows.questionRepository.id,
        sort:this.sort
        }) 
      let _data ={
        paperId:this.TListDetail.id,
        list:arr,
        createUserId:JSON.parse(localStorage.getItem('userInfo')).employeeId
      }
      this.$axios.post(that.$api + 'paper/setPaper', _data).then(res => { 
        if(res.data.code === 200){         
            that.loading = false;
            that.NoEdit=''
            that.sort=''
            this.getQuestionOnPaper(this.editId); //成功后重新获取问题列表
            that.$message({
                message: '修改成功',
                type: 'success',
                duration: 1500
            })
        }else{
            that.loading = false
            that.$message({
                message: res.data.message,
                type: 'error',
                duration: 1500
            })
        } 
      })
    },
    getAllQuestList(){
      //获取所用的问题
      this.$axios.post(this.$api + 'question/getAllQuestion',{}).then(res => {
        if(res.data.code == 200){
          this.allQuestionList = res.data.data
        }else {
          this.$message({
            message: res.data.message,
            type: "error",
            duration: 1500
          });
        }
      })
    },
     clearVal(val,formName){
      this.isAdd = val
      this.$refs[formName].resetFields();
    },
    submitForm(formName) { //新增or绑定问题
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          if(this.isAdd){ //新增问题
            let data = {
              type:this.ruleForm2.type,
              kind:this.ruleForm2.kind,
              suggestT:this.ruleForm2.suggestT,
              question:this.ruleForm2.question,
              baseQuestionOptionList:this.ruleForm2.baseQuestionOptionList,
            }
            this.$axios.post(that.$api + 'question/addQuestion', data).then(res => {  //新增问题
              if(res.data.code === 200){         
                  that.loading = false;
                  that.dialogVisible = false;
                  that.$message({
                      message: res.data.message,
                      type: 'success',
                      duration: 1500
                  })
                  that.$confirm('是否添加该题到当前问卷中?', '提示', { //询问是否把该题加到问卷
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    that.questBindPaper(formName,res.data.data.id)
                  }).catch(() => {});
                  that.$refs[formName].resetFields();
              }else{
                  that.loading = false
                  that.$message({
                      message: res.data.message,
                      type: 'error',
                      duration: 1500
                  })
              } 
            })
          }else{ //问卷绑定问题
            that.questBindPaper(formName)
          }
          
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    questBindPaper(formName,id){ //问卷绑定问题
      let that = this
      let arr = []
      arr.push({
        questionId:id?id:this.ruleForm2.questionId,
        sort:this.ruleForm2.sort
        }) 
      let _data ={
        paperId:this.TListDetail.id,
        list:arr,
        createUserId:JSON.parse(localStorage.getItem('userInfo')).employeeId
      }
      this.$axios.post(that.$api + 'paper/setPaper', _data).then(res => { 
        if(res.data.code === 200){         
            that.loading = false;
            that.dialogVisible = false;
            this.getQuestionOnPaper(this.editId); //成功后重新获取问题列表
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
        } 
      })
    },
    setPrecondition(index,data){ //打开前置条件弹窗
      this.isPrecondition = true
      if(data[index].drugStatus){
        this.preconditionForm.drugStatus = data[index].drugStatus;
      }
      this.preconditionForm.id = data[index].relationshipId;

    },
    getOneQuestDetail(id){ //问题详情
      this.$axios.get(this.$api + 'question/getById?id='+id).then(res => {
          if(res.data.code == 200){
            let _data = res.data.data.questionRepository
            this.oneQuestionDetail = res.data.data
            this.ruleForm2= { 
              ...this.ruleForm2,
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
    submitPreconditionForm(formName){ //设置前置条件
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          let data = { 
              ...this.preconditionForm,
          }
          this.$axios.post(that.$api + 'paper/setPreconditions', data).then(res => { 
            if(res.data.code === 200){         
                that.loading = false;
                that.isPrecondition = false;
                that.getQuestionOnPaper(that.editId);
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
    editRow(index,data){ //详情
      this.getAllQuestList()//获取所用的问题
      this.editId = data[index].questionRepository.id
      this.dialogVisible = true
      this.isNoClick = true
      this.ruleForm2.sort = data[index].sort;
      this.getOneQuestDetail(data[index].questionRepository.id) //获取问题详情
    },
  },
  mounted() {
    let that = this;
    this.getList(this.form.val, 1);
    console.log(navigator.userAgent);
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
.el-pagination{
  position:static;
}
.el-input,.el-select{
  width: 80%;
}
.ml50{margin-left: 50px;}
</style>
