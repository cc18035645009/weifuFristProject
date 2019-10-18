<template>
  <div class="Staff content" v-loading="loading">
    <el-card class="mt20">
      <el-container>
        <el-aside width="210px" align="left" style="border-right: 1px solid #eee">
          <div class="overH tr pb10 pt5" style="border-bottom: 1px solid #eee">
            <p class="tl pl20 fz12 w80 fl">员工组</p>
            <!--新增员工分类-->
            <i class="el-icon-plus cursor mr15 fz14" @click="handleStaffType(1)"></i>
            <!--删除员工分类-->
            <i class="el-icon-delete cursor mr15 fz14" @click="handleStaffType(2)"></i>
            <!--设置分类权限-->
            <i v-if="judgePowers.PowerM" class="el-icon-lock cursor mr20 fz14" @click="handleStaffType(3)"></i>
          </div>
          <el-menu
            @select="handleSelect"
            text-color="#000"
            default-active="0"
            active-text-color="#409EFF">
            <el-menu-item :index="'' + index" v-for="(item, index) in roleList" :key="index">
              <!-- <i class="el-icon-menu"></i> -->
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <el-container>
            <el-main>
              <!--操作表格-->
              <el-button
                class="fl mt30 ml20"
                type="primary"
                icon="el-icon-plus"
                @click="isAddStaff = true"
                size="mini"
              >新增员工</el-button>
              <el-row class="mt30 ml20 pl20 mr20" type="flex" justify="space-between">
                <el-col :span="3">
                  <el-select v-model="lively" size="small" class="w100" @change="searchLive">
                    <el-option label="活跃" value="1"></el-option>
                    <el-option label="不活跃" value="2"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="10">
                  <el-input placeholder="搜索" v-model="searchTxt" @change="searchStaff" class="input-with-select" size="small">
                  <el-select v-model="searchType" slot="prepend" placeholder="请选择" size="small" style="width: 90px">
                    <el-option label="员工号" value="code"></el-option>
                    <el-option label="姓名" value="name"></el-option>
                  </el-select>
                  <el-button type="primary" slot="append" icon="el-icon-search" size="small" @click="searchStaff"></el-button>
                </el-input>
                </el-col>
              </el-row>
              <!--表格-->
              <el-table :data="stafList" ref="singleTable" align="left" height="470">
                <!-- <el-table-column prop="id" label="UID" width="50" align="center"></el-table-column> -->
                <el-table-column prop="code" label="员工号" width="150" align="center"></el-table-column>
                <el-table-column prop="loginName" label="登录名" align="center" width="150"></el-table-column>
                <el-table-column prop="name" label="真实姓名" width="150" align="center"></el-table-column>
                <el-table-column prop="mobile" label="联系电话" width="150" align="center"></el-table-column>
                <el-table-column prop="isMultiPoint" label="多点登录" width="120" align="center">
                  <template slot-scope="scope">
                    <i :class="scope.row.isMultiPoint == 2 ? 'el-icon-check' : 'el-icon-close'" class="fz14"></i>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" v-if="judgePowers.Staff">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="reWrite(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click.stop="handlePower(scope.row, 0)">区域权限</el-button>
                    <el-button type="text" size="small" @click.stop="handlePower(scope.row, 1)" v-if="judgePowers.DataExport">导出权限</el-button>
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
                :total="stafTotal"
              ></el-pagination>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-card>
    <!--新增员工-->
    <el-dialog title="添加新员工" :visible.sync="isAddStaff" width="26%" @close="closeNewStaff('addStaForm')">
      <el-form :model="addStaForm" ref="addStaForm" :rules="addStaffRules" label-position="right" class="mauto">
        <el-form-item label="登录名:" prop="loginName" :label-width="formLabelWidth">
          <el-input v-model="addStaForm.loginName" class="w240 fl"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名:" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addStaForm.name" class="w240 fl"></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码:" prop="password" :label-width="formLabelWidth">
          <el-input v-model="addStaForm.password" class="w240 fl"></el-input>
        </el-form-item> -->
        <el-form-item label="手机号码:" prop="mobile" :label-width="formLabelWidth">
          <el-input v-model="addStaForm.mobile" class="w240 fl"></el-input>
        </el-form-item>
        <el-form-item label="多点登录:" :label-width="formLabelWidth">
          <el-select v-model="addStaForm.isMultiPoint" class="w80 fl" placeholder>
            <el-option label="否" value="1"></el-option>
            <el-option label="是" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addStaff('addStaForm')" :disabled="isSucAddStaff" class="fr mr15">新增员工</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--编辑员工-->
    <el-dialog title="修改员工信息" :visible.sync="isRewrite" width="26%">
      <el-form :model="rewriteForm" label-position="right" class="mauto">
        <el-form-item label="密码:" :label-width="formLabelWidth">
          <el-input v-model="rewriteForm.password" class="w240 fl"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" :label-width="formLabelWidth">
          <el-input v-model="rewriteForm.mobile" class="w240 fl"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名:" :label-width="formLabelWidth">
          <el-input v-model="rewriteForm.name" class="w240 fl"></el-input>
        </el-form-item>
        <el-form-item label="多点登录:" :label-width="formLabelWidth">
          <el-select v-model="rewriteForm.isMultiPoint" class="w80 fl" placeholder>
            <el-option label="否" value="1"></el-option>
            <el-option label="是" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:" :label-width="formLabelWidth">
          <el-select v-model="rewriteForm.status" class="w120 fl" placeholder>
            <el-option label="活跃" value="1"></el-option>
            <el-option label="不活跃" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="修改组:" :label-width="formLabelWidth">
          <el-select v-model="rewriteForm.roleId" class="w120 fl" placeholder>
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in roleList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="reWriteStaff" class="fr mr15">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--报表导出权限-->
    <el-dialog title="导出报表权限管理" :visible.sync="isExport">
      <el-container class="elportCont">
        <el-header height="30px">
          <el-row class="bgee pt10 pb10">
            <el-col :span="8">
              <p>报表大类</p>
            </el-col>
            <el-col :span="16">
              <p>细分报表</p>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-form :model="form" class="mauto" label-position="right">
            <el-form-item label="百泌达:" label-width="170px">
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="新入组统计（按省）"></el-checkbox>
                <el-checkbox label="23 center"></el-checkbox>
                <el-checkbox label="TOP50-按医院"></el-checkbox>
                <el-checkbox label="TOP50-按医生"></el-checkbox>
                <el-checkbox label="PAP"></el-checkbox>
                <el-checkbox label="PAP-city"></el-checkbox>
                <el-checkbox label="AllRowData"></el-checkbox>
                <el-checkbox label="停药报表"></el-checkbox>
                <el-checkbox label="回卡统计"></el-checkbox>
                <el-checkbox label="患者入组"></el-checkbox>
                <el-checkbox label="类型统计"></el-checkbox>
                <el-checkbox label="停药统计"></el-checkbox>
                <el-checkbox label="FAQ统计"></el-checkbox>
                <el-checkbox label="工作量统计"></el-checkbox>
                <el-checkbox label="ae报告Data"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="优泌淋:" label-width="170px">
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="ROWDATA-AE"></el-checkbox>
                <el-checkbox label="ROWDATA-PC"></el-checkbox>
                <el-checkbox label="ROWDATA-患者"></el-checkbox>
                <el-checkbox label="ROWDATA-患者-加密"></el-checkbox>
                <el-checkbox label="ROWDATA-IB"></el-checkbox>
                <el-checkbox label="FAQ统计"></el-checkbox>
                <el-checkbox label="外呼明细"></el-checkbox>
                <el-checkbox label="医院入组"></el-checkbox>
                <el-checkbox label="回卡统计"></el-checkbox>
                <el-checkbox label="类型统计"></el-checkbox>
                <el-checkbox label="停药统计"></el-checkbox>
                <el-checkbox label="FAQ统计"></el-checkbox>
                <el-checkbox label="工作量统计"></el-checkbox>
                <el-checkbox label="ae报告Data"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="百达扬:" label-width="170px">
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="ROWDATA-患者"></el-checkbox>
                <el-checkbox label="ROWDATA-患者-加密"></el-checkbox>
                <el-checkbox label="AE报表"></el-checkbox>
                <el-checkbox label="IB呼入"></el-checkbox>
                <el-checkbox label="OB呼出"></el-checkbox>
                <el-checkbox label="邮件报表"></el-checkbox>
                <el-checkbox label="医院报表"></el-checkbox>
                <el-checkbox label="删除报表"></el-checkbox>
                <el-checkbox label="短信导出"></el-checkbox>
                <el-checkbox label="FAQ统计"></el-checkbox>
                <el-checkbox label="回卡统计"></el-checkbox>
                <el-checkbox label="升级工单"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-dialog>
    
    <!--设置医院权限-->
    <el-dialog :visible.sync="isHos" :fullscreen="true" class="hospital">
      <hospital v-if="isHos" :proId="proId" :employeeId="employeeId" :employeeCode="employeeCode"></hospital>
    </el-dialog>
    <!--设置区域权限-->
    <el-dialog title="设置区域权限" :visible.sync="isArea" width="40%">
      <el-form v-if="isArea" :model="proForm" ref="proForm">
        <el-form-item label="选择项目" :rules="{ required: true, message: '请选择项目', trigger: 'blur' }" prop="proId">
          <el-select v-model="proForm.proId" class="w240 fl" placeholder="请选择项目">
            <el-option :label="item.projectName" :value="item.id" v-for="(item, index) in proList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.stop="goAreaPower">下一步</el-button>
          <el-button @click.stop="isArea = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--添加员工组-->
    <el-dialog title="添加新组" :visible.sync="isAddStaffType" width="24%">
      <el-form v-if="isAddStaffType" :model="addStaffTypeForm" ref="addStaffTypeForm">
        <!-- <el-form-item label="组ID:" prop="id" :rules="{ required: true, message: '请填写组ID', trigger: 'blur' }">
          <el-input v-model="addStaffTypeForm.id"  class="w120 fl"></el-input>
        </el-form-item> -->
        <el-form-item label="组名:" prop="name" :rules="{ required: true, message: '请填写组名', trigger: 'blur' }">
          <el-input v-model="addStaffTypeForm.name"  class="w120 fl"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.stop="setStaffType(1)" class="fr">创建组</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--设置员工组权限-->
    <el-dialog title="设置组权限" :visible.sync="isStaffTypePower" class="StaffTypePower" width='60%'>
      <staff-type-power v-if="isStaffTypePower" :roleId="roleId"></staff-type-power>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex"
import Hospital from './Hospital'
import StaffTypePower from './StaffTypePower'
import { parse } from 'path';
import { constants } from 'crypto';
export default {
  data() {
    return {
      searchTxt: "",
      searchType: 'name', // 搜索类型
      loading: true,
      lively: '1', // 1活跃，2不活跃
      isExport: false, // 是否导出员工权限
      isRewrite: false, // 是否修改员工信息
      checkList: ["复选框A"], // 选中复选框
      currentPage: 1, //当前页 
      stafTotal: 0, // 总员工数
      pageSize: 50, // 每页显示个数
      stafList: [], //员工列表
      proList: [], // 项目列表
      roleId: 1, // 角色id，1为坐席，2专员，3区域经理 4超级管理员
      isAddStaff: false, // 新增员工
      isAddStaffType: false, //新增员工组
      isStaffTypePower: false, //设置组权限
      staffDetail: {}, // 员工详情
      proForm:{ // 选择项目表单
        proId: ''
      }, 
      addStaffTypeForm: { // 添加员工组
        name: ''
      },
      rewriteForm: {}, // 编辑员工表单
      isArea: false, // 设置区域权限
      addStaffRules: { // 新增员工校验
        name: [
          { required: true, message: '请输入员工真实姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入员工密码', trigger: 'blur' }
        ],
        loginName: [
          { required: true, message: '请输入员工登录名字', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入员工手机号', trigger: 'blur' }
        ],
      },
      addStaForm: { // 新增员工
        name: "",
        // password: "",
        roleId: this.roleId,
        loginName: "",
        mobile: "",
        isMultiPoint: "1"
      },
      form: [],
      isHos: false, // 医院
      proId: '', // 项目id
      employeeId: '', // 选中员工id
      employeeCode: '', // 选中员工code
      formLabelWidth: "100px",
      roleList:[], // 角色组列表
      roleName:'', //角色名字
      isSucAddStaff: false //重复点击新建员工
    };
  },
  created() {
    this.isSuper(true)
    this.isSpecial(false)
    this.isCallCenter(false)
    this.getStaffList(this.currentPage, 50, this.roleId, this.lively)
    this.getProList(1)
    this.getAllRole()
  },
  computed: {
    ...mapState(["judgePowers", "loginInfo"])
  },
  mounted() {
    //console.log('员工管理', localStorage.getItem('judgePowers'))
    // this.judgePowers = JSON.parse(localStorage.getItem('judgePowers'))
    // console.log('员工管理', this.judgePowers)
    //console.log(this.judgePowers)
  },
  methods: {
    ...mapMutations(['isSuper',"isSpecial","isCallCenter"]),
    getAllRole(){ //获取所有角色
      this.$axios.get(this.$api + 'role/getAll').then(res => {
        if(res.data.code === 200){
          this.roleList = res.data.data
          //this.roleName = this.roleList[this.roleId-1].name
        }
        console.log(res)
      })
    },
    getProList(status){ // 获取项目列表
      let proData = {
        page: 1,
        rows: 50,
        status: status
      }
      this.$axios.post(this.$api + 'project/getProjectList', proData).then(res => {
        if(res.data.code == 200){
          this.proList = res.data.data.rows
          console.log(this.proList)
        }
      })
    },
    addRole(){ // 新增角色组
      this.$axios.post(this.$api + 'role/newOneOrModify', this.addStaffTypeForm).then(res => {
        if(res.data.code === 200){
          this.getAllRole()
          this.isAddStaffType = false
          console.log('创建组')
        }
        console.log(res)
      })
    },
    handleStaffType(type){ // 设置员工分类
      switch (type) {
        case 1:
          this.isAddStaffType = true
          console.log('新增员工类')
          break;
        case 2:
          console.log(this.roleName)
          console.log(this.roleId)
          if(this.roleId != ''){
            if(this.stafList.length > 0){
              this.$notify({
                title: '提示',
                message: '有相关内容不可以删除',
                position: 'top-left'
              })
            }else{
              this.$confirm('此操作将永久删除 ' + "\"" + this.roleName  + '\" 组, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$axios.post(this.$api + 'role/delete?id=' + this.roleId).then(res => {
                  console.log(res)
                  this.roleId = 4
                  this.addStaffTypeForm.name = ''
                  this.getAllRole()
                  this.getStaffList(this.currentPage, this.pageSize, this.roleId, this.lively)
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  })
                })
              }).catch(() => {
                return false        
              })
            }
          }else{
            this.$notify({
              title: '提示',
              message: '请选择员工组',
              position: 'top-left'
            })
          }
          break;
        case 3:
          this.isStaffTypePower = true
          console.log('设置员工类权限')
          break;
      }
    },
    setStaffType(type){ // 保存设置员工分类
      switch (type) {
        case 1:
          this.$refs['addStaffTypeForm'].validate((valid) => {
            if (valid) {
              this.addRole()
            } else {
              console.log('error submit!!')
              return false;
            }
          })
          break;
        case 3:
          this.isStaffTypePower = false
          console.log('设置组权限')
          break;
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.getStaffList(1, val, this.roleId, this.lively);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getStaffList(val, this.pageSize, this.roleId, this.lively);
    },
    searchStaff() { // 搜索员工
      this.getStaffList(1, 50, this.roleId, this.lively)
    },
    reWrite(row) { // 编辑/员工详情
      this.$axios.post(this.$api + 'employee/getOne', {id: row.id}).then(res => {
        if(res.data.code === 200){
          this.staffDetail =JSON.parse(JSON.stringify(res.data.data))
          console.log(res)
          this.isRewrite = true
          res.data.data.roleId = parseInt(res.data.data.roleId)
          res.data.data.isMultiPoint = JSON.stringify(res.data.data.isMultiPoint)
          res.data.data.status = JSON.stringify(res.data.data.status)
          this.rewriteForm = res.data.data
        }
      })
      console.log(row)
    },
    handlePower(row, type){ //操作权限
      this.employeeId = row.id
      this.employeeCode = row.code
      if(type === 0){ // 设置区域权限
        this.isArea = true
        console.log(row, '设置区域权限')
      }else{
        console.log(row, '导出权限')
      }
    },
    goAreaPower(){
      this.$refs.proForm.validate((valid) => {
        if (valid) {
          this.proId = this.proForm.proId
          this.isArea = false
          this.isHos = true
        } else {
          return false
        }
      })
    },
    closeNewStaff(addStaForm){ // 重置新增员工表单
      this.$refs[addStaForm].resetFields()
    },
    getStaffList(page, rows, roleId, status) { // 获取员工列表 page:页数, rows:每页条数, roleId:角色id
      this.pageSize = rows
      let employeeData = {
        page: page,
        rows: rows,
        status: status,
        roleId: roleId
      }
      let type = this.searchType
      employeeData[type] = this.searchTxt
      this.$axios.post(this.$api + "employee/getList", employeeData).then(res => { // 员工列表
        if (res.data.code === 200) {
          //this.loginData = res.data.data
          this.stafTotal = res.data.data.total
          this.stafList = res.data.data.rows
          this.loading = false
        } else {
          this.$message({
            message: res.data.message,
            type: "error",
            duration: 1500
          })
        }
      })
    },
    handleSelect(index, indexPath) {
      console.log(index, indexPath, this.roleList[index].name)
      this.roleName = this.roleList[index].name
      this.employeeCode = ''
      this.roleId = this.roleList[index].id
      this.loading = true
      this.getStaffList(1, this.pageSize, this.roleId, this.lively)
    },
    addStaff(addStaForm) { // 新增员工
      this.addStaForm.roleId = this.roleId
      this.$refs[addStaForm].validate((valid) => {
        if (valid) {
          //this.addStaForm.isMultiPoint = parseInt(this.addStaForm.isMultiPoint)
          if(this.addStaForm.mobile&&this.$serve.testPhone(this.addStaForm.mobile)){
            this.$message({
                message: "手机号格式错误！",
                type: "success",
                duration: 1500
              })
            return false
          }
          this.isSucAddStaff = true
          this.$axios.post(this.$api + 'employee/addOrUpdate', this.addStaForm).then(res => {
            if(res.data.code === 200){
              this.$message({
                message: "添加员工成功",
                type: "success",
                duration: 1500
              })
              this.isSucAddStaff = false
              this.isAddStaff = false
              this.addStaForm.isMultiPoint = '1'
              this.getStaffList(this.currentPage, this.pageSize, this.roleId, this.lively)
            }else{
              this.$message({
                message: "新增失败",
                type: "err",
                duration: 1500
              })
              return false
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
    reWriteStaff() { // 编辑员工
      let reWriteData = {
        name: this.rewriteForm.name,
        roleId: this.rewriteForm.roleId,
        password: this.rewriteForm.password,
        mobile: this.rewriteForm.mobile,
        id: this.rewriteForm.id,
        isMultiPoint: parseInt(this.rewriteForm.isMultiPoint),
        status: parseInt(this.rewriteForm.status)
      }
      if(reWriteData.mobile&&this.$serve.testPhone(reWriteData.mobile)){
        this.$message({
            message: "手机号格式错误！",
            type: "success",
            duration: 1500
          })
        return false
      }
      let bmsLogin = {
        employeeId:this.loginInfo.employeeId,
        employeeCode: this.loginInfo.employeeCode,
        type: 2,
        loginInfo: navigator.userAgent
      }
      if(this.staffDetail.password !== this.rewriteForm.password){
        console.log('修改密码')
        this.$axios.post(this.$api + 'bmsLogin/newOne', bmsLogin).then( res => { // 记录修改密码信息
          console.log(res)
        })
      }
      if(this.staffDetail.status !== parseInt(this.rewriteForm.status) && this.staffDetail.status === 1){
        bmsLogin.type = 3
        this.$axios.post(this.$api + 'bmsLogin/newOne', bmsLogin).then( res => { // 记录修改不活跃信息
          console.log(res)
        })
        console.log('变为不活跃')
      }
      this.$axios.post(this.$api + 'employee/addOrUpdate', reWriteData).then(res => {
        if(res.data.code === 200){
          this.isRewrite = false
          this.getStaffList(1, 50, this.roleId, this.lively)
          this.$message({
            message: res.data.message,
            type: "success",
            duration: 1500
          })
        }else{
          this.$message({
            message: res.data.message,
            type: "error",
            duration: 1500
          })
        }
        console.log(res)
      })
      // 修改员工信息
    },
    searchLive() { // 活跃/不活跃切换
      this.getStaffList(1, 50, this.roleId, this.lively)
    }
  },
  components: {
    Hospital,StaffTypePower
  }
}
</script>

<style scoped>
.el-main {padding: 0;}
.el-table {width: 95%;margin: 20px auto 0;}
.elportCont {height: 450px;overflow: hidden;}
.Staff >>> .el-card__body{padding: 10px 0 0 0;}
.Staff >>> .Staff .el-menu-item{text-align: center;}
.Staff >>> .el-menu-item.is-active{background: rgba(230, 247, 255, 1);border-right: 3px solid rgba(24, 144, 255, 1);}
.hospital >>> .el-dialog__header{padding: 0;}
.StaffTypePower >>> .el-dialog__header{font-size: 14px;padding: 15px 0 0 15px;}
.StaffTypePower >>> .el-dialog__title {font-size: 14px;}
.StaffTypePower >>> .el-dialog__body{font-size: 13px;padding: 10px 20px 20px 20px;}
</style>
<style>
.input-with-select .el-input-group__append {background-color: #409EFF;color: white;}
.el-table__body tr.current-row>td,.el-table__body tr.hover-row.current-row>td{background-color: rgba(230, 247, 255, 1); font-weight: bold;color: rgb(64, 158, 255);}
.el-pagination{margin: 20px 20px 10px 0;}
</style>

