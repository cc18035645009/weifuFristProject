<template>
  <div class="Knowledge content" v-loading="loading">
    <el-card class="mt20">
      <el-container>
        <el-aside width="210px" style="border-right: 1px solid #eee">
          <div class="overH tr pb15" style="border-bottom: 1px solid #eee">
            <p class="tl pl20 fz12 w80 fl">知识库分类</p>
            <!--新增分类-->
            <i class="el-icon-plus cursor mr15 fz14" @click="handleKnowType(1)"></i>
            <!--删除分类-->
            <i class="el-icon-delete cursor mr15 fz14" @click="handleKnowType(2)"></i>
            <!--修改分类-->
            <i class="el-icon-edit cursor mr20 fz14" @click="handleKnowType(3)"></i>
          </div>
          <el-menu
            @select="selectType"
            default-active="1"
            text-color="#000"
            align="left"
            active-text-color="#409EFF">
            <el-submenu :index="''+ item.projectId" v-for="(item, index) in knowledgeType" :key="index">
              <template slot="title">{{ item.projectName }}</template>
              <el-menu-item :index="''+ i.id" v-for="(i, index) in item.knowledgeTypeList" :key="index">{{ i.type }}</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-container>
            <el-header height="40px">           
              <el-button type="primary" class="fl" icon="el-icon-plus" size="small" @click="handleKnowledge('', 3)">新增知识</el-button>              
              <el-row type="flex" justify="end">
                <el-col :span="7">
                  <el-input v-model="searchTitle" class="w10p" size="small" @change="closeEdit" placeholder="按标题模糊查询"></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button type="primary" icon="el-icon-search" size="small" class="fl" @click="handleKnowledge('', 4)">搜索</el-button>
                </el-col>
              </el-row>
            </el-header>
            <el-main>
              <el-table :data="knowledgeList" style="width: 100%" height="460">
                <el-table-column prop="id" label="ID" width="180"></el-table-column>
                <el-table-column prop="status" label="状态"  width="180"></el-table-column>
                <el-table-column prop="typeName" label="分类"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="content" label="内容明细" width="300"></el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                    <el-button @click="handleKnowledge(scope.row, 1)" type="text" size="small">编辑</el-button>
                    <el-button type="text" @click="handleKnowledge(scope.row, 0)" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                align="right"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[50, 100, 150]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="knowledgeTotal"
              ></el-pagination>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-card>
    <el-dialog title="编辑知识" :visible.sync="isEdit" width="40%" @close="closeEdit">
      <!--编辑知识-->
      <el-form size="small" ref="editForm" :model="editForm" :rules="knowRules" label-position="right" label-width="80px">
        <el-form-item label="分类">
          <el-input v-model="editForm.typeName" :disabled="true" class="fl w120"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title" class="w9p fl"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="editForm.content" :rows="4" class="fl w9p"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status" class="w120 fl" placeholder="">
            <el-option label="发布" value="2"></el-option>
            <el-option label="临时" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveEdit('editForm')" class="fr">保存更改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="新增知识" :visible.sync="isAdd" width="40%">
       <!--新增知识-->
      <el-form size="small" ref="addForm" :model="addForm" :rules="addknowRules" @close="closeAddKnow" label-position="right" label-width="80px">
        <el-form-item label="分类">
          <el-input v-model="addForm.typeId" :disabled="true" class="fl w120"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title" class="w9p fl"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="addForm.content" :rows="4" class="fl w9p"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="addForm.status" class="w120 fl" placeholder="">
            <el-option label="发布" value="2"></el-option>
            <el-option label="临时" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addKnowledge('addForm')" class="fr">新增知识</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--删除知识-->
    <el-dialog title="提示" :visible.sync="isDelete" width="30%">
      <span>确定删除知识吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteKow(knowId)">确 定</el-button>
      </span>
    </el-dialog>
    <!--新增知识分类-->
    <el-dialog title="添加知识库分类" :visible.sync="isAddKnowType" width="24%">
      <el-form label-position="right" :model="addKnowTypeForm" ref="addKnowTypeForm" v-if="isAddKnowType" size="small" label-width="100px">
        <el-form-item label="类型:">
          <el-select v-model="addKnowTypeForm.projectId" class="w150 fl">
            <el-option :label="item.projectName" :value="item.projectId" v-for="(item, index) in knowledgeType" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名:" prop="type" :rules="{ required: true, message: '请输入分类名称', trigger: 'blur' }">
          <el-input v-model="addKnowTypeForm.type"  class="w150 fl"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="fr" @click="saveKnowType">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--删除知识分类-->
    <el-dialog title="删除知识分类" :visible.sync="isDelKnowType" width="30%">
      <span>确定删除知识分类吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDelKnowType = false">取 消</el-button>
        <el-button type="primary" @click="deleteKnowType">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改知识库分类-->
    <el-dialog title="修改知识库分类" :visible.sync="isEditKnowType" width="24%">
      <el-form label-position="right" :model="editKnowTypeForm" ref="editKnowTypeForm" size="small" label-width="100px">
        <el-form-item label="分类ID:">
          <el-input v-model="editKnowTypeForm.id"  class="w150 fl" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="分类名:" prop="type" :rules="{ required: true, message: '请输入分类名称', trigger: 'blur' }">
          <el-input v-model="editKnowTypeForm.type"  class="w150 fl"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="fr" @click="saveEditType">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "Knowledge",
  data() {
    return {
      isDelete: false, //删除
      currentPage: 1, //当前页 
      pageSize: 50, // 每页显示个数
      knowledgeTotal: 0, // 总知识个数
      isEdit: false, // 是否编辑知识
      isAdd: false, // 是否添加知识
      editForm: {}, // 编辑知识表单
      knowId: '', // 知识id
      knowTypeId: '', // 导航知识分类id
      addForm: { // 新增知识表单
        title: '',
        content: '',
        status: '2',
        createUserId: '',
        typeId: ''
      }, 
      addknowRules: { // 添加知识验证
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }]
      },
      knowRules: { // 修改知识验证
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }]
      },
      knowledgeList: [], // 知识列表
      searchTitle: '', // 知识模糊搜索
      loading: false,
      createUserId: '', //创建者Id
      knowledgeType:[], // 知识大类
      isAddKnowType: false, // 是否添加知识库类
      addKnowTypeForm: { // 新增知识分类表单
       type: '',
       projectId: 1,
       createUserId: ''
      }, // 新增知识库类表单
      isDelKnowType: false, //是否删除知识类
      isEditKnowType: false, //是否修改知识库分类
      editKnowTypeForm: { // 修改知识分类
        id:'',
        type: '',
        projectId: 1,
        createUserId: ''
      }
    }
  },
  methods: {
    ...mapMutations({
      isSuper: 'isSuper',
      isCallCenter: "isCallCenter",
      isSpecial: 'isSpecial'
    }),
    getKnowledge(page, rows, title, typeId) { // 获取知识列表
      this.pageSize = rows
      let knowledgeData = {
        page: page,
        rows: rows,
        title: title,
        typeId: typeId
      }
      this.$axios.post(this.$api + 'knowledge/find', knowledgeData).then(res => {
        if(res.data.code === 200){
          this.knowledgeTotal = res.data.data.total
          let knowledgeList = res.data.data.rows
          knowledgeList.map(item => {
            item.status = item.status == '1' ? '临时' : '发布'
          })
          this.knowledgeList = knowledgeList
          console.log(this.knowledgeList)
        }
      })
    },
    getknowledgeType() { // 获取知识大类
      this.$axios.post(this.$api + 'knowledgeType/find', {type: ''}).then(res => {
        if(res.data.code === 200){
          this.knowledgeType = res.data.data
          console.log(this.knowledgeType)
          console.log(res.data)
        }
      })
    },
    selectType(index, indexPath) { // 选择侧边导航
      console.log(index, indexPath)
      this.knowTypeId = index
      this.editKnowTypeForm.id = index
      this.getKnowledge(this.currentPage, this.pageSize, '', this.knowTypeId)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.getKnowledge(this.currentPage, val, this.searchTitle, this.knowTypeId)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.getKnowledge(val, this.pageSize, this.searchTitle, this.knowTypeId)
    },
    closeEdit(){ // 关闭刷新页面
      this.getKnowledge(this.currentPage, this.pageSize, this.searchTitle, this.knowTypeId)
    },
    handleKnowledge(row, type) { // 操作编辑/删除
      console.log(row)
      if(type === 1){
        this.isEdit = true
        row.status = row.status === 1 ? '1' : '2'
        this.editForm = row
        console.log('编辑')
      }else if(type === 0){ // 删除知识
        this.isDelete = true
        this.knowId = row.id
      }else if(type === 3){ // 新增知识
        if(this.knowTypeId !== ''){
          this.isAdd = true
          this.addForm.typeId = this.knowTypeId
          console.log(this.knowTypeId)
        }else{
          this.$notify({
            title: '提示',
            message: '请选择左侧知识分类',
            position: 'top-left'
          })
        }
        
      }else if(type === 4){ //模糊搜索知识
        this.getKnowledge(this.currentPage, this.pageSize, this.searchTitle, this.knowTypeId)
      }
    },
    deleteKow(id) { // 删除知识
      this.$axios.get(this.$api + 'knowledge/delete?id=' + id).then(res => {
        if(res.data.code === 200){
          this.$message({
            message: "删除成功",
            type: "warning",
            duration: 1500
          })
          this.isDelete = false
          this.getKnowledge(this.currentPage, this.pageSize, this.searchTitle, this.knowTypeId)
        }
      })
    },
    saveEdit(editForm) { // 编辑知识保存
      this.$refs[editForm].validate((valid) => {
        if (valid) {
          this.isEdit = false
          let newOrUpdate = {
            id: this.editForm.id,
            title: this.editForm.title,
            content: this.editForm.content,
            typeId: this.editForm.typeId,
            status: this.editForm.status,
            createUserId: this.createUserId
          }
          this.$axios.post(this.$api + 'knowledge/newOrUpdate', newOrUpdate).then(res => {
            if(res.data.code === 200){
              this.getKnowledge(this.currentPage, this.pageSize, this.searchTitle, this.knowTypeId)
              this.$message({
                message: res.data.message,
                type: "success",
                duration: 1500
              })
            }
          })
        } else {
          this.$message({
            message: "请填写完整信息",
            type: "error",
            duration: 1500
          })
          return false;
        }
      })
    },
    addKnowledge(formName) { //新增知识
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isAdd = false
          this.addForm.createUserId = this.createUserId
          this.$axios.post(this.$api + 'knowledge/newOrUpdate', this.addForm).then(res => {
            if(res.data.code === 200){
              this.getKnowledge(1, this.pageSize, this.searchTitle, this.knowTypeId)
              this.$message({
                message: res.data.message,
                type: "success",
                duration: 1500
              })
            }
          })
        } else {
          this.$message({
            message: "请填写完整信息",
            type: "error",
            duration: 1500
          })
          return false;
        }
      })
    },
    closeAddKnow() { // 关闭知识
      console.log(111)
      this.addForm = { // 新增知识表单
        title: '',
        content: '',
        status: '2',
        createUserId: this.createUserId
      }
    },
    handleKnowType(type){ // 操作知识类
      switch (type) {
        case 1:
          this.isAddKnowType = true //新增知识类
          break;
        case 2:
          console.log(this.knowTypeId)
          if(this.knowTypeId !== ''){
            if(this.knowledgeList.length > 0){
              this.$notify({
                title: '提示',
                message: '有相关内容，不可以删除',
                position: 'top-left'
              })
            }else{
              this.isDelKnowType = true //删除知识类
            }
          }else{
            this.$notify({
              title: '提示',
              message: '请选择左侧知识分类',
              position: 'top-left'
            })
          }
          break;
        case 3:
          if(this.knowTypeId !== ''){
            this.isEditKnowType = true //编辑知识类
          }else{
            this.$notify({
              title: '提示',
              message: '请选择左侧知识分类',
              position: 'top-left'
            })
          }
          break;
      }
    },
    saveKnowType() { // 新增知识分类
      console.log(this.addKnowTypeForm)
      this.$refs['addKnowTypeForm'].validate((valid) => {
          if (valid) {
              this.$axios.post(this.$api + 'knowledgeType/newOrUpdate', this.addKnowTypeForm).then(res => {
                console.log(res)
                if(res.data.code === 200){
                    this.$message({
                      message: "添加成功",
                      type: "success",
                      duration: 1500
                  })
                  this.isAddKnowType = false
                  this.getknowledgeType()
                }
            })
          } else {
              return false
          }
      })
    },
    saveEditType() { // 修改知识分类
      console.log(this.editKnowTypeForm)
      this.$refs['editKnowTypeForm'].validate((valid) => {
          if (valid) {
              this.$axios.post(this.$api + 'knowledgeType/newOrUpdate', this.editKnowTypeForm).then(res => {
                console.log(res)
                if(res.data.code === 200){
                    this.$message({
                      message: "添加成功",
                      type: "success",
                      duration: 1500
                  })
                  this.isEditKnowType = false
                  this.getknowledgeType()
                }
            })
          } else {
              return false
          }
      })
    },
    deleteKnowType() { // 删除知识分类
      this.$axios.get(this.$api + 'knowledgeType/delete?id=' + this.knowTypeId).then(res => {
        console.log(res)
        if(res.data.code === 200){
          this.getknowledgeType()
          this.isDelKnowType = false
          this.knowTypeId = ''
        }
      })
    }
  },
  computed: {
    ...mapState(["step"])
  },
  mounted() {
    this.getknowledgeType()
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 500)
  },
  created() {
    this.isSuper(true)
    this.isSpecial(false)
    this.isCallCenter(false)
    this.createUserId = JSON.parse(localStorage.getItem('userInfo')).employeeId
    this.addKnowTypeForm.createUserId = JSON.parse(localStorage.getItem('userInfo')).employeeId
    this.isSuper(true)
    this.getKnowledge(1, 50, '', '')
  }
};
</script>

<style scoped>
.Knowledge >>> .el-card__body{padding: 10px 0 0 0;}
.Knowledge >>> .Knowledge .el-menu-item{text-align: left;}
.Knowledge >>> .el-menu-item.is-active{background: rgba(230, 247, 255, 1);border-right: 3px solid rgba(24, 144, 255, 1);}
</style>
<style>
.el-menu{border: 0;}
.el-submenu__title{font-weight: bold}
</style>

