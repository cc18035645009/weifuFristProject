<template>
  <div class="ProjectManage content pb20" v-loading="loading">
    <!--运营中项目-->
    <el-card class="mt20">
      <el-container>
        <el-aside width="210px" style="border-right: 1px solid #eee">
          <div class="overH tr pb15" style="border-bottom: 1px solid #eee">
            <p class="tl pl20 fz12 w80 fl">项目列表</p>
            <!--新增项目-->
            <i class="el-icon-plus cursor mr15 fz14" @click="handleProType(1)"></i>
            <!--删除项目-->
            <i class="el-icon-delete cursor mr15 fz14" @click="handleProType(2)"></i>
             <!--编辑项目-->
            <i class="el-icon-edit cursor mr15 fz14" @click="handleProType(3)"></i>
          </div>
          <el-menu
            @select="selectType"
            @open="selectPro"
            @close='closeMenu'
            ref='menu'
            text-color="#000"
            unique-opened
            :default-openeds=[nowProjectId]
            active-text-color="#409EFF">
                
              <el-submenu :index="''+ item.id" v-for="(item, index) in projectList" :key="index" class="tl">
                <template slot="title">{{ item.projectName}}<span class="fz12 color9">{{ ' ID：'+item.id}}</span></template>
                <el-menu-item :index="''+ i.id" v-for="(i, index) in item.stageList" :key="index">{{ i.followTemplateStageName }}</el-menu-item>
              </el-submenu>

              <!-- <el-submenu :index="''+ item.id" v-for="(item, index) in projectList" :key="index" class="tl">
                <template slot="title">
                  <span>{{ item.projectName}}<span class="fz12 color9">{{ ' ID：'+item.id}}</span></span>
                </template>
                <el-menu-item-group title='项目'>
                  <el-menu-item @click="selectPro(item.id)" :index="''+ item.id" >{{ item.projectName}}<span class="fz12 color9">{{ ' ID：'+item.id}}</span></el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title='T次'>
                  <el-menu-item @click='selectType(i.id)' :index="''+ i.id" v-for="(i, index) in item.stageList" :key="index">{{ i.followTemplateStageName }}</el-menu-item>
                </el-menu-item-group>
              </el-submenu> -->

          </el-menu>
        </el-aside>

        <el-main :class="[nowProjectId?'':'noClick','w10p']">
          <!-- 项目detail -->
          <el-container class="w10p" v-show="!showT">
            <el-tabs @tab-click="handleClick" v-model="activeName" class="w10p">
              <el-tab-pane label="T次管理" name="first">
                <el-header height="auto">    
                  <div class="fz14 lh40">
                    <p class="fw fz16">项目详情</p>  
                    <p class="flex justs">
                      <span><span class="fw">目前状态：</span>{{projectListDetail.status}}</span>
                      <span><span>创建时间：</span>{{projectListDetail.createTime | formatTimemin}}</span>
                      <span><span>创建人：</span>{{projectListDetail.createUser}}</span>
                    </p>  
                  </div>   
                  <el-button type="primary" icon="el-icon-plus" size="small" :disabled='!nowProjectId' @click="newPop(1)">新增T次</el-button>     
                </el-header>

                <el-main class="w10p">
                  <el-table :data="projectListDetail.stageList" ref="singleTable" size="small" align="center" height="450">
                    <el-table-column prop="id" label="ID" width="150" align="center"></el-table-column>
                    <el-table-column prop="followTemplateStageName" label="T次名称" width="150" align="center"></el-table-column>
                    <el-table-column prop="days" label="随访天数" align="center" width="150"></el-table-column>
                    <el-table-column prop="paperName" label="问卷" align="center" width="150">
                      <template slot-scope="scope">
                        <span :class="scope.row.paperName?'colorblue':''" @click="scope.row.id?addPaper(scope.row.paperId):''">{{scope.row.paperName?scope.row.paperName:'无问卷'}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="100">
                      <template slot-scope="scope">
                        <el-button
                          @click.native.prevent="editRow(scope.$index, projectListDetail.stageList,'T')"
                          type="text"
                          size="small">
                          编辑
                        </el-button>
                        <span class="line ml10 mr10">|</span>
                        <el-button
                          @click.native.prevent="deleteRow(scope.$index, projectListDetail.stageList,'T')"
                          type="text"
                          size="small">
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-main>
              </el-tab-pane>
              <el-tab-pane label="数据分析" name="second">
                <div ref="funnel" style="width:60vw;height:500px;" class="mt20"></div>
                <h3>各大区入组趋势图：</h3>
                <div ref="line" style="width:60vw;height:500px;" class="mt20 mb40"></div>
                <div ref="cross" style="width:60vw;height:500px;"></div>
                <div ref="treemap" style="width:60vw;height:500px;" class="mt20 mb40"></div>
                <div ref="category" style="width:60vw;height:500px;"></div>
              </el-tab-pane>
              <el-tab-pane label="快照管理" name="three">
                快照管理
              </el-tab-pane>
            </el-tabs>           
          </el-container>
          <!-- T次 -->
          <el-container class="w10p" v-show="showT">
            <el-header height="auto">    
              <div class="fz14 lh40">
                <p class="fw fz16">T次详情</p>  
                <p class="flex justs">
                  <span><span class="fw">T次名称：</span>{{TListDetail.followTemplateStageName}}</span>
                  <span><span>随访天数：</span>{{TListDetail.days}}</span>
                  <span><span>对应问卷：</span>{{TListDetail.paperName}}</span>
                </p>  
              </div>   
              <el-button type="primary" icon="el-icon-plus" size="small" @click="newPop(2)" :disabled='!nowProjectId'>新增问题</el-button>     
            </el-header>

            <el-main class="w10p">
              <el-table :data="TListDetail.paperTo?TListDetail.paperTo.questionToList:[]" ref="singleTable" size="small" align="center" height="450">
                <el-table-column prop="questionRepository.id" label="ID" width="50" align="center"></el-table-column>
                <el-table-column prop="questionRepository.question" label="问题标题" width="150" align="center"></el-table-column>
                <el-table-column prop="questionRepository.type" label="问题类型" align="center" :formatter='setType' width="150"></el-table-column>
                <el-table-column prop="questionRepository.createTime" label="最后修改时间" align="center" width="150" :formatter='setTime'></el-table-column>
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
                      @click.native.prevent="editRow(scope.$index, TListDetail.paperTo.questionToList,'Q')"
                      type="text"
                      size="small">
                      详情
                    </el-button>
                    <span class="line ml10 mr10">|</span>
                    <el-button
                      @click.native.prevent="setPrecondition(scope.$index, TListDetail.paperTo.questionToList)"
                      type="text"
                      size="small">
                      设置前置条件
                    </el-button>
                    <span class="line ml10 mr10">|</span>
                    <el-button
                      @click.native.prevent="deleteRow(scope.$index, TListDetail.paperTo.questionToList,'Q')"
                      type="text"
                      size="small">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>            
          </el-container>

        </el-main>
      </el-container>
    </el-card>
    <!--项目详情-->
    <el-dialog :visible.sync="isProDetail" :fullscreen="true" @close="closeSetQmain">
      <project-detail @closeProDetail="addQpage" v-if="isShowPro" :proId="proId"></project-detail>
      <!--新增问卷-->
      <set-qmain v-if="isAddQpage" @closeSetQmain="closeSetQmain" :proName='proName' :proId="proId"></set-qmain>
    </el-dialog>
    <!--新增项目-->
    <el-dialog title="新增项目" :visible.sync="isAddPro" :fullscreen="true" @close="nextReset">
      <add-project :nextActive="nextActive" @closeDiaLog="closeDiaLog" v-if="isAddPro"></add-project>
    </el-dialog>
    <!-- 新增T次 -->
    <el-dialog
      :title="editId?'编辑T次':'新增T次'"
      :visible.sync="isNewT"
      width="40%"
       v-loading='loading'
      >
      <el-form :model="Tform" status-icon :rules="TRules" ref="Tform" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="followTemplateStageName">
          <el-input v-model="Tform.followTemplateStageName" placeholder='例：T1' clearable></el-input>
        </el-form-item>
        <el-form-item label="设置排序" prop="sort">
          <el-input  v-model="Tform.sort" placeholder='例：T1填写1，T2填写2' clearable ></el-input>
        </el-form-item>
        <el-form-item label="随访天数" prop="days">
          <el-input  v-model="Tform.days" clearable></el-input>
        </el-form-item>
        <el-form-item label="设置问卷" prop="paperId" class="mb5">
          <el-select v-model="Tform.paperId" placeholder="请选择" clearable>
            <el-option :label="item.paperName" :value="item.id" v-for="item in paperList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" class="mb5 colorblue cursor">
          <span @click="addPaper(false)">新增问卷</span>
        </el-form-item>
        <el-form-item label="设置状态" prop="status">
          <el-radio-group v-model="Tform.status" clearable>
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item class="tr">
          <el-button @click="isNewT = false">取 消</el-button>
          <el-button type="primary" @click="submitFormT('Tform')">提交</el-button>
        </el-form-item>
      </el-form>
      <!-- 新增or编辑问卷 -->
      <el-dialog
        title="问卷信息"
        :visible.sync="paperPop"
        width="40%"
        v-loading='loading'
        append-to-body
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
      <!-- 编辑项目 end -->
    </el-dialog>
    <!-- 新增T次 end -->
    <!-- 新增问题 -->
    <el-dialog
      :title="editId?'查看问题':'新增问题'"
      :visible.sync="dialogVisible"
      width="40%"
       v-loading='loading'
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
        <!-- <el-form-item label="排序" prop="sort" v-if="!isAdd">
          <el-input-number  v-model="ruleForm2.sort" :min='1' placeholder='请输入' clearable :disabled='isNoClick'></el-input-number>
        </el-form-item> -->
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
            <i :class="[index==0?'el-icon-circle-plus':'el-icon-remove-outline',isAdd&&!isNoClick?'':'noClick','ml20', 'fz24', 'vm']" @click.prevent="index==0?addQuestionOption(ruleForm2.baseQuestionOptionList.length):removeQuestionOption(n)"></i>
          </el-form-item>
        </div>
        
        <el-form-item class="tr">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" :disabled='isNoClick' @click="submitForm('ruleForm2')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增问题 end-->
    <!-- 编辑项目 -->
    <el-dialog
      title="项目基础信息"
      :visible.sync="isEditpro"
      width="40%"
       v-loading='loading'
      >
      <el-form :model="addProForm" status-icon :rules="addProFormR" ref="addProForm" label-width="130px" class="demo-ruleForm">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="addProForm.projectName" clearable></el-input>
        </el-form-item>
        <el-form-item label="项目开始时间" prop="startTime">
          <el-date-picker v-model="addProForm.startTime" type="datetime" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input  v-model="addProForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="短信接收电话" prop="phone">
          <el-input  v-model="addProForm.phone" clearable></el-input>
        </el-form-item>
        
        <el-form-item class="tr">
          <el-button @click="isEditpro = false">取 消</el-button>
          <el-button type="primary" @click="submitProForm('addProForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑项目 end -->
    <!-- 查看问卷 -->
      <el-dialog
        title="问卷信息"
        :visible.sync="isShowPaperDetail"
        width="40%"
        v-loading='loading'
        >
        <div class="lh30"><span class="fw">问卷名称：</span>{{onePaperDetail.paperName}}</div>
        <div class="lh30"><span class="fw">T次模板：</span>{{onePaperDetail.followTemplateStageName}}</div>
      </el-dialog>
    <!-- 查看问卷 end -->
    <!-- 设置前置条件 -->
    <el-dialog
      title="设置前置条件"
      :visible.sync="isPrecondition"
      width="40%"
       v-loading='loading'
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
  </div>
</template>

<script>
import ProjectDetail from './ProjectDetail'
import AddProject from './AddProject'
import SetQmain from './SetQpage/SetQmain'
import {mapState,mapMutations} from 'vuex'

export default {
  name: 'ProjectManage',
  data() {
    return {
      isProDetail: false, // 项目详情模块
      loading:false,
      isShowPro: true, // 是否展示详情部分
      isAddPro: false, // 添加项目
      isAddQpage: false, // 添加问卷
      value1: "",
      nextActive: false, // 下一步步骤
      nowTId:'',
      TList: {rows:[],total:0}, //T次列表
      TListDetail:{},
      proId: '', //  项目Id
      proName:'',
      nowProjectId:'',
      projectList:[],//项目列表
      projectListDetail:{},
      isEditpro:false,
      addProForm: { // 基础信息表单
          email: '',
          phone: '',
          startTime: '',
          projectName: '',
          id:'',
      },
      addProFormR: { // 基础信息验证
          projectName: [
              { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],
          startTime: [
              { required: true, message: '请输入项目开始时间', trigger: 'blur' }
          ],
          email: [
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ],
          phone: [
              { required: true, message: '请输入短信接收电话', trigger: 'blur' }
          ]
      },
      activeName:'first',
      showT:false, //显示T次详情
      isNewT:false,//新增T次弹窗
      Tform:{ //T次
        id:'',
        followTemplateStageName:'',
        sort:'',
        days:'',
        paperId:'',
        status:''
      },
      TRules: {
        followTemplateStageName: [{ required: true, message: '请输入', trigger: 'blur'}],
        sort: [{ required: true, message: '请输入', trigger: 'blur'}],
        days: [{ required: true, message: '请输入', trigger: 'blur'}],
        paperId:[{ required: false, message: '请输入', trigger: 'change'}],
        status:[{ required: true, message: '请输入', trigger: 'change'}],
      },
      paperList:[],//问卷list
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
      isShowInp:true , //是否显示输入框
      editId:'', //当前编辑id
      isAdd:false,//是新增问题，还是绑定问题
      allQuestionList:[], //所有问题列表
      oneQuestionDetail:{},//单个问题
      isNoClick:false,//点击详情禁止提交
      paperPop:false,//新增问卷
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
      onePaperDetail:{},//问卷详情
      isShowPaperDetail:false, //是否显示问卷详情
      templateList:[],//模板列表
      NoEdit:'',//是否编辑sort
      sort:'',//编辑当前行的sort
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
    }
  },
  methods: {
    ...mapMutations({
      setStep: 'setStep',
      isSuper: 'isSuper',
      isCallCenter: "isCallCenter",
      isSpecial: 'isSpecial'
    }),
    closeMenu(id,b){//禁止关闭菜单
     this.$refs.menu.open(''+id)
     this.selectPro(id);
    },
    nextReset() { // 新增项目下一步
      this.setStep(0)
      this.getTList()
      this.getProject()
    },
    getTList(val){ // 获取T列表
      let proData = {
        page: val,
        rows: this.$serve.rows,
        status: 1
      }
      this.$axios.post(this.$api + 'project/getProjectList', proData).then(res => {
        if(res.data.code == 200){
          res.data.data.rows.map(item => {
            item.createTime = this.$serve.timemin(item.createTime)
          })
          this.TList = res.data.data
        }
      })
    },
    addQpage() { // 新增问卷
      this.isShowPro = false
      this.isAddQpage = true
    },
    closeSetQmain() { // 设定问卷完毕
      this.isAddQpage = false
      this.isProDetail = false
      this.isShowPro = false
      this.getProject()
    },
    closeDiaLog() {
      this.isAddPro = false 
      this.getTList()
      this.getProject()
    },
    editRow(index,data,type){ //详情
      this.getAllQuestList()//获取所用的问题
      this.getAllPaperList()//获取所用的问卷
      if(type == 'Q'){
        this.editId = data[index].questionRepository.id
        this.dialogVisible = true
        this.isNoClick = true
        this.ruleForm2.sort = data[index].sort;
        this.getOneQuestDetail(data[index].questionRepository.id) //获取问题详情
      }else{ //T次编辑
        this.editId = data[index].id
        this.getToneById(data[index].id,true) //获取单个T次详情
        this.isNewT = true
      }
    },
    setPrecondition(index,data){ //打开前置条件弹窗
      this.isPrecondition = true
      if(data[index].drugStatus){
        this.preconditionForm.drugStatus = data[index].drugStatus;
      }
      this.preconditionForm.id = data[index].relationshipId;
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
                that.selectType(that.nowTId);
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
    deleteRow(index,data,type){ //del问题
      let isT = type == 'T'?true:false;
      this.$confirm('此操作将删除该'+(isT?'T次':'题')+', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(isT){  //del 项目删除T次
            this.$axios.get(this.$api + "templateStage/delete?id="+data[index].id).then(res => {
              if (res.data.code === 200) {
                this.getProject()
                this.selectPro(this.nowProjectId);
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
          }else{ //del 问卷解绑问题
            this.$axios.get(this.$api + "paper/deleteQuestion?id="+data[index].relationshipId).then(res => {
              if (res.data.code === 200) {
                this.selectType(this.nowTId);
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
          }
      }).catch(() => {});
    },
    getToneById(index,isEdit){
      this.$axios.post(this.$api + 'templateStage/getStageInfoById',{id:index}).then(res => {
        if(res.data.code == 200){
          this.TListDetail = res.data.data
          if(isEdit){
            this.Tform.followTemplateStageName =res.data.data.followTemplateStageName
            this.Tform.sort =res.data.data.sort
            this.Tform.days =res.data.data.days
            this.Tform.paperId =res.data.data.paperId
            this.Tform.status =res.data.data.status
            this.Tform.id =res.data.data.id //有id编辑
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
    selectType(index, indexPath) { // 选择侧边导航T次 
      this.showT = true //显示T次详情
      this.nowTId = index
      this.getToneById(index) //获取单个T次详情
      console.log(index,indexPath)
    },
    selectPro(index, indexPath) { // 选择侧边导航项目
      this.showT = false
      this.nowProjectId = index
      this.$axios.get(this.$api + 'project/getProjectById?id='+index).then(res => {
        if(res.data.code == 200){
          res.data.data.status = this.$serve.proStatus[res.data.data.status]
          this.projectListDetail = res.data.data
          this.addProForm.email =  res.data.data.email
          this.addProForm.phone =  res.data.data.phone
          this.addProForm.startTime =  res.data.data.startTime
          this.addProForm.projectName =  res.data.data.projectName
          this.addProForm.id = index
        }else {
          this.$message({
            message: res.data.message,
            type: "error",
            duration: 1500
          });
        }
      })
    },
    handleProType(type){ // 操作知识类
      switch (type) {
        case 1:
          this.isAddPro = true
          break;
        case 2:
          if(this.nowProjectId !== ''){
            let name = this.projectListDetail.projectName?this.projectListDetail.projectName:''
            let cue = name+' ID：'+this.nowProjectId
            this.$confirm('此操作将删除该项目 【'+cue+'】, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$axios.get(this.$api + 'project/deleteProject?id='+this.nowProjectId).then(res => {
                if(res.data.code == 200){
                  this.getProject()
                  this.$message({
                    type: 'success',
                    message: res.data.message
                  });
                }else {
                  this.$message({
                    message: res.data.message,
                    type: "error",
                    duration: 1500
                  });
                }
              })
            }).catch(() => {});
          }else{
            this.$notify({
              title: '提示',
              message: '请选择左侧项目',
              position: 'top-left'
            })
          }
          break;
          case 3:
          if(this.nowProjectId !== ''){
            this.isEditpro = true//打开编辑项目pop
          }else{
            this.$notify({
              title: '提示',
              message: '请选择左侧项目',
              position: 'top-left'
            })
          }
          break;
      }
    },
    newPop(type) { //1==新增T次弹窗，2==新增问题弹窗
      this.editId = ''
      if(type === 1){
        this.Tform.id = ''
        this.isNewT = true 
        this.getAllPaperList()//获取所用的问卷
        this.$nextTick(()=>{
          this.$refs['Tform'].resetFields();
        })  
      }else if(type === 2){ 
        this.dialogVisible = true
        this.isNoClick = false
        this.getAllQuestList()
        this.$nextTick(()=>{
          this.$refs['ruleForm2'].resetFields();
        })  
      }
    },
    getAllPaperList(){//获取所用的问卷
      this.$axios.post(this.$api + 'paper/getAllPaperList',{}).then(res => {
        if(res.data.code == 200){
          this.paperList = res.data.data
        }else {
          this.$message({
            message: res.data.message,
            type: "error",
            duration: 1500
          });
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
    submitFormT(formName) { //新增T次
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          let data = { 
              id:that.Tform.id,
              followTemplateStageName:that.Tform.followTemplateStageName,
              sort:that.Tform.sort,
              days:that.Tform.days,
              paperId:that.Tform.paperId,
              status:that.Tform.status,
              projectId:this.nowProjectId,
              createUserId:JSON.parse(localStorage.getItem('userInfo')).employeeId
          }
          this.$axios.post(that.$api + 'templateStage/newOrUpdate', data).then(res => { 
            if(res.data.code === 200){         
                that.loading = false;
                that.isNewT = false;
                that.getProject()
                that.selectPro(that.nowProjectId);
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
    addQuestionOption(i) { //选项
      let arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        this.ruleForm2.baseQuestionOptionList.push({
          questionOption: '',
          flag: arr[i],
          sort:i+1
        });
      },
    removeQuestionOption(item){ //删除选项
      var index = this.ruleForm2.baseQuestionOptionList.indexOf(item)
      if (index !== -1) {
        this.ruleForm2.baseQuestionOptionList.splice(index, 1)
      }
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
    submitForm(formName) { //新增or编辑问题
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
              id:this.editId
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
        paperId:this.TListDetail.paperId,
        list:arr,
        createUserId:JSON.parse(localStorage.getItem('userInfo')).employeeId
      }
      this.$axios.post(that.$api + 'paper/setPaper', _data).then(res => { 
        if(res.data.code === 200){         
            that.loading = false;
            that.dialogVisible = false;
            this.selectType(this.nowTId); //成功后重新获取问题列表
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
    getProject(val){//获取项目含T次
      this.$axios.get(this.$api + 'project/getProjects').then(res => {
        if(res.data.code == 200){
          this.projectList = res.data.data
          if(val){
            this.selectPro(res.data.data[0].id)
            this.nowProjectId = res.data.data[0].id+''
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
    submitProForm(formName) { //编辑项目
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true;
          let data = { 
              ...this.addProForm,
              createUserId:JSON.parse(localStorage.getItem('userInfo')).employeeId
          }
          this.$axios.post(that.$api + 'project/addOrUpdate', data).then(res => { 
            if(res.data.code === 200){         
                that.loading = false;
                that.isEditpro = false;
                that.getProject()
                that.selectPro(that.nowProjectId);
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
    handleClick(tab, event) {//tab切换
        console.log(tab, event);
      },
    addPaper(id){ //显示问卷弹窗
      if(id){
        this.isShowPaperDetail = true
        this.getOnePaper(id)
      }else{
        this.paperPop=true;
        this.getAllPaper()
        this.$nextTick(()=>{
          this.$refs['addPaperForm'].resetFields();
        })       
      }
    },
    getOnePaper(id){//获取单个问卷详情
      let that = this
      that.loading = true;
      this.$axios.post(that.$api + 'paper/getSettingInfo', {id:id}).then(res => { 
        if(res.data.code === 200){         
          console.log(res.data.data)
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
                that.getAllPaperList()
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
    templateChange(val){ //获取模板名字
      let obj ={}
      obj = this.templateList.find(item => item.id == val)
      this.addPaperForm.followTemplateName = obj.followTemplateName
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
        paperId:this.TListDetail.paperId,
        list:arr,
        createUserId:JSON.parse(localStorage.getItem('userInfo')).employeeId
      }
      this.$axios.post(that.$api + 'paper/setPaper', _data).then(res => { 
        if(res.data.code === 200){         
            that.loading = false;
            that.NoEdit=''
            that.sort=''
            this.selectType(this.nowTId); //成功后重新获取问题列表
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
    funnelChart(){ //漏斗图
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.funnel);
      let option = {
          title: {
              text: '项目整体依从性：',
              subtext: '数据分布'
          },
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c}%"
          },
          toolbox: {
              feature: {
                  dataView: {readOnly: false},
                  restore: {},
                  saveAsImage: {}
              }
          },
          legend: {
              data: ['入组','T1留存','T2留存','T3留存','T4留存']
          },
          series: [
              {
                  name: '预期',
                  type: 'funnel',
                  left: '10%',
                  width: '80%',
                  label: {
                      normal: {
                          formatter: '{b}预期'
                      },
                      emphasis: {
                          position:'inside',
                          formatter: '{b}预期: {c}%'
                      }
                  },
                  labelLine: {
                      normal: {
                          show: false
                      }
                  },
                  itemStyle: {
                      normal: {
                          opacity: 0.7
                      }
                  },
                  data: [
                      {value: 80.0, name: 'T2留存'},
                      {value: 65.0, name: 'T3留存'},
                      {value: 50.0, name: 'T4留存'},
                      {value: 95.0, name: 'T1留存'},
                      {value: 99.0, name: '入组'}
                  ]
              },
              {
                  name: '实际',
                  type: 'funnel',
                  left: '10%',
                  width: '80%',
                  maxSize: '80%',
                  label: {
                      normal: {
                          position: 'inside',
                          formatter: '{c}%',
                          textStyle: {
                              color: '#fff'
                          }
                      },
                      emphasis: {
                          position:'inside',
                          formatter: '{b}实际: {c}%'
                      }
                  },
                  itemStyle: {
                      normal: {
                          opacity: 0.5,
                          borderColor: '#fff',
                          borderWidth: 2
                      }
                  },
                  data: [
                      {value: 84.7, name: 'T2留存'},
                      {value: 70.9, name: 'T3留存'},
                      {value: 58.0, name: 'T4留存'},
                      {value: 95.7, name: 'T1留存'},
                      {value: 99.1, name: '入组'}
                  ]
              }
          ]
      };
      // 绘制图表
      myChart.setOption(option);
    },
    lineChart(){ //折线图
      var myChart = echarts.init(this.$refs.line);
      let option = option = {
          // title: {
          //     text: '各大区入组趋势图：'
          // },
          tooltip : {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross',
                  label: {
                      backgroundColor: '#6a7985'
                  }
              }
          },
          legend: {
              data:['中原区','西南区','西北区','苏皖区','上海区','山东区','南区','东南区','东北区','北京区']
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis : [
              {
                  type : 'category',
                  boundaryGap : false,
                  data : ['一月','二月','三月','四月','五月','六月']
              }
          ],
          yAxis : [
              {
                  type : 'value'
              }
          ],
          series : [
              {
                  name:'中原区',
                  type:'line',
                  stack: '总量',
                  areaStyle: {},
                  data:[327,253,381,443,436,485 ]
              },
              {
                  name:'西南区',
                  type:'line',
                  stack: '总量',
                  areaStyle: {},
                  data:[247,115,162 ,199 ,204 ,252 ]
              },
              {
                  name:'西北区',
                  type:'line',
                  stack: '总量',
                  areaStyle: {},
                  data:[84,46,50,61 ,74 ,99 ]
              },
              {
                  name:'苏皖区',
                  type:'line',
                  stack: '总量',
                  areaStyle: {normal: {}},
                  data:[102,85,84,201 ,171,167 ]
              },
              {
                  name:'上海区',
                  type:'line',
                  stack: '总量',
                  label: {
                      normal: {
                          show: true,
                          position: 'top'
                      }
                  },
                  areaStyle: {normal: {}},
                  data:[15,2,11 ,8,29,16 ]
              },
              {
                  name:'山东区',
                  type:'line',
                  stack: '总量',
                  areaStyle: {normal: {}},
                  data:[55,9,25,22,	63 ,41 ]
              },
              {
                  name:'南区',
                  type:'line',
                  stack: '总量',
                  areaStyle: {normal: {}},
                  data:[225,111,170 ,176 ,240,247 ]
              },
              {
                  name:'东南区',
                  type:'line',
                  stack: '总量',
                  areaStyle: {normal: {}},
                  data:[294,147,230 ,293,414 ,360 ]
              },
              {
                  name:'东北区',
                  type:'line',
                  stack: '总量',
                  areaStyle: {normal: {}},
                  data:[767,394,809,729,827,971]
              },
              {
                  name:'北京区',
                  type:'line',
                  stack: '总量',
                  areaStyle: {normal: {}},
                  data:[0,4,6,12,14 ,10 ]
              },
              
          ]
      };
      // 绘制图表
      myChart.setOption(option);
    },
    crossChart(){ //柱状图
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(this.$refs.cross);
      let option = {
          title: {
            text: '脱失人数及比例趋势'
          },
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross',
                  crossStyle: {
                      color: '#999'
                  }
              },
          },
          toolbox: {
              feature: {
                  dataView: {show: true, readOnly: false},
                  magicType: {show: true, type: ['line', 'bar']},
                  restore: {show: true},
                  saveAsImage: {show: true}
              }
          },
          legend: {
              data:['脱失人数','脱失比例']
          },
          xAxis: [
              {
                  type: 'category',
                  data: ['1周','2周','3周','4周','5周','6周','7周','8周','9周','10周','11周','12周','13周','14周','15周'],
                  axisPointer: {
                      type: 'shadow'
                  }
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  name: '脱失人数',
                  min: 0,
                  max: 500,
                  interval: 50,
                  axisLabel: {
                      formatter: '{value} 人'
                  }
              },
              {
                  type: 'value',
                  name: '脱失比例',
                  min: 0,
                  max: 5.5,
                  interval: 0.5,
                  axisLabel: {
                      formatter: '{value} %'
                  }
              }
          ],
          series: [
              {
                  name:'脱失人数',
                  type:'bar',
                  data:[115 ,167 ,272 ,249 ,168 ,204 ,151 ,197,	123, 91, 83, 76, 81 ,101, 122]
              },
              {
                  name:'脱失比例',
                  type:'line',
                  yAxisIndex: 1,
                  data:[2.2, 3.2, 5.2, 4.8, 3.2, 3.9, 2.9, 3.8, 2.3, 1.7, 1.6, 1.5, 1.5, 1.9, 2.3],                 
              },
          ]
      };
      // 绘制图表
      myChart.setOption(option);
    },
    treemapChart(){ //矩形树图
      var myChart = echarts.init(this.$refs.treemap);
      let option = {
          title: {
            text: '脱失原因占比'
          },
          series: [{
            type: 'treemap',
            data: [{
                name: '缺乏疗效',       
                value: 19.2
            },{
                name: '病情好转',          
                value: 37.2
            },{
                name: '不良反应',         
                value: 27.5
            },{
                name: '购买不便',            
                value: 2.1
            },{
                name: '价格原因',            
                value: 7.1
            },{
                name: '使用不便',            
                value: 6.9
            }]
        }]
      };
      myChart.setOption(option);
    },
    categoryChart(){ //正负条形图
      var myChart = echarts.init(this.$refs.category);
      let option = {
          title: {
            text: '风险干预及结果'
          },
          tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
          },
          legend: {
              data:['无需干预', '干预失败', '干预成功']
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis : [
              {
                  type : 'value'
              }
          ],
          yAxis : [
              {
                  type : 'category',
                  axisTick : {show: false},
                  data : ['缺乏疗效','病情好转','不良反应','购买不便','价格原因','使用不便']
              }
          ],
          series : [
              {
                  name:'干预成功',
                  type:'bar',
                  stack: '总量',
                  label: {
                      normal: {
                          show: true
                      }
                  },
                  data:[812, 2115, 969, 408, 179, 859]
              },
              {
                  name:'干预失败',
                  type:'bar',
                  stack: '总量',
                  label: {
                      normal: {
                          show: true,
                          position: 'left'
                      }
                  },
                  data:[-389, -864, -627, -141, -98, -251]
              }
          ]
      };
      // 绘制图表
      myChart.setOption(option);
    },
    setTime(row, column, cellValue, index){
        return cellValue>=0?this.$serve.timemin(cellValue):''
      },
    setType(row, column, cellValue, index){
      return cellValue>=0?this.$serve.questType[cellValue]:''
    },
  },
  components: {
    ProjectDetail,
    AddProject,
    SetQmain
  },
  computed: {
    ...mapState({
        step: 'step'
    })
  },
  created(){
    this.isSuper(true)
    this.isSpecial(false)
    this.isCallCenter(false)
    this.getTList()
    this.getProject(true)
  },
  mounted(){
    this.funnelChart() //漏斗图
    this.lineChart() //折线图
    this.crossChart()//柱状图
    this.treemapChart()//矩形树图
    this.categoryChart()//正负条形图
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 500)
  },

}
</script>

<style scoped>
.el-input,.el-select{
  width: 80%;
}
.is-opened >>> .el-submenu__title{
  background: rgb(232, 250, 255)
}
</style>
