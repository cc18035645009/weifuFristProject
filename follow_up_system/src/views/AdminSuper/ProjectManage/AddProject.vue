<template>
  <div class="AddProject" v-loading="loading">
    <!-- <el-steps :active="step" finish-status="success"  align-center>
        <el-step title="基础信息"></el-step>
        <el-step title="新建模板"></el-step>
        <el-step title="模板T次设定"></el-step>
    </el-steps> -->
    <!--基础信息设置-->
    <el-container class="mt20" v-if="step == 0">
        <el-header>
            <el-row class="bgee pt10 pb10">
            <el-col :span="3">基础信息</el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-form :model="addProForm" :rules="addProFormR" ref="addProForm" size="small" label-width="120px" label-position='right'>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="项目名称:" prop="projectName">
                            <el-input v-model="addProForm.projectName"  class="w240 fl"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="项目开始时间:" prop="startTime" class=" w240" >
                            <el-date-picker v-model="addProForm.startTime" type="datetime" class="fl w240" placeholder="选择日期时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="计算方式:" prop="computeType">
                            <el-select v-model="addProForm.computeType" class="fl w240" placeholder="">
                                <el-option label="按入组时间计算" value="1"></el-option>
                                <el-option label="按第一次用药计算" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="邮箱:" prop="email">
                            <el-input v-model="addProForm.email" class="w240"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="邮箱密码:" prop="emailSecret">
                            <el-input class="w240" v-model="addProForm.emailSecret" show-password></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="8">
                        <el-form-item label="短信接收电话:" prop="phone">
                            <el-input v-model="addProForm.phone"  class="w240 fl"></el-input>
                        </el-form-item>
                    </el-col> -->
                </el-row>
                
            </el-form>
        </el-main>
    </el-container>
    <!--新建模板-->
    <el-container v-if="step == 1" class="mt20">
        <el-header>
            <el-row class="bgee pt10 pb10">
                <el-col :span="3">新建模板</el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-form size="small" :model="addTemForm" ref="addTemForm">
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="项目名称:">
                        <el-input v-model="addTemForm.projectName" :disabled="true" class="w150 fl"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="模板名称:" prop="followTemplateName" :rules="{ required: true, message: '请输入模板名称', trigger: 'blur' }">
                            <el-input v-model="addTemForm.followTemplateName"  class="w150 fl"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="是否启用:">
                            <el-select v-model="addTemForm.status" class="w100 fl" placeholder="">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="是否默认模板:">
                            <el-select v-model="addTemForm.isDefault" class="w100 fl" placeholder="">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-main>
    </el-container>
    <!--T次设定-->
    <el-container v-if="step >= 2" class="mt20">
        <el-header>
            <el-row class="bgee pt10 pb10">
                <el-col :span="3">T次模板设定</el-col>
            </el-row>
        </el-header>
        <el-main>
            <el-form size="small" :model="addTsForm" ref="addTsForm" label-width="120px" label-position="right">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="模板名称:">
                            <el-input v-model="addTemForm.followTemplateName"  class="w150 fl" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="mt20" v-for="(item, index) in addTsForm.stageList" :key="index">
                    <el-col :span="5">
                        <el-form-item :label="'T' + (index+1) + '用药第:'" :prop="'stageList.' + index + '.days'" :rules="{required: true, message: '用药时间不能为空', trigger: 'blur'}">
                            <el-input v-model="item.days"  class="w100 fl"></el-input>
                            <p class="fl ml5">天</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否启用:">
                            <el-select v-model="item.status" class="w100 fl" placeholder="">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="mt20">
                    <el-col :span="3">
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-plus" size="small" @click="addTs">增加T次</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-refresh" size="small" @click="reSet">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-main>
    </el-container>
    <el-button class="mt20 fl ml20" @click="next">{{ step >= 2 ? '完成' : '下一步'}}</el-button>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {
    name: 'AddProject',
    data() {
        return {
            loading: false,
            addProForm: { // 基础信息表单
                email: '',
                emailSecret:'',
                phone: '',
                startTime: '',
                projectName: '',
                createUserId: '',
                computeType: ''
            },
            addTemForm: { // 模板表单
                followTemplateName: '',
                projectName: '',
                status: '1',
                isDefault: '1',
                projectId: ''
            },
            addTsForm: { // Ts设置表单
                id: '',
                createUserId: '',
                stageList: [{
                    followTemplateStageName: "T1",
                    sort: 1,
                    days: '',
                    status: '1',
                    drugFlag: '1'
                },{
                    followTemplateStageName: "T2",
                    sort: 2,
                    days: '',
                    status: '1',
                    drugFlag: '1'
                }]
            },
            createUserId: '', // 创建者id
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
                emailSecret: [
                    { required: true, message: '请输入邮箱密码', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入短信接收电话', trigger: 'blur' }
                ],
                computeType: [
                    { required: true, message: '请选择计算方式', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState(['step'])
    },
    methods: {
        ...mapMutations({
            setStep: 'setStep'
        }),
        next() {
            if(this.step === 0){
                console.log('基础信息',this.addProForm)
                this.addProForm.createUserId = this.createUserId
                this.$refs['addProForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post(this.$api + 'project/addOrUpdate', this.addProForm).then(res => {
                            console.log(res)
                            if(res.data.code === 200){
                                this.loading = false
                                this.$message({
                                    message: "添加成功",
                                    type: "success",
                                    duration: 1500
                                })
                                this.$emit('closeDiaLog')
                                //this.setStep(this.step + 1)
                                this.addTemForm.projectName = this.addProForm.projectName
                                this.addTemForm.projectId = res.data.data.id
                            }
                        })
                    } else {
                        return false;
                    }
                })
            }else if(this.step === 1){
                this.$refs['addTemForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post(this.$api + 'template/addOrUpdate', this.addTemForm).then(res => {
                            console.log(res)
                            if(res.data.code === 200){
                                this.loading = false
                                this.$message({
                                    message: "添加成功",
                                    type: "success",
                                    duration: 1500
                                })
                                this.setStep(this.step + 1)
                                //this.tempId = res.data.data.id
                                this.addTsForm.id = res.data.data.id
                                console.log(this.addTsForm)
                            }
                        })
                    } else {
                        return false;
                    }
                })
                console.log('新建模板',this.addTemForm)
            }else if(this.step === 2){
                this.$refs['addTsForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post(this.$api + 'template/setTemplate', this.addTsForm).then(res => {
                            console.log(res)
                            if(res.data.code === 200){
                                this.loading = false
                                this.$message({
                                    message: "添加成功",
                                    type: "success",
                                    duration: 1500
                                })
                                console.log('模板T次设定',this.addTsForm)
                                this.$emit('closeDiaLog')
                            }
                        })
                        
                    } else {
                        return false
                    }
                })
            }
        },
        addTs() { // 增加Ts
            if(this.addTsForm.stageList.length < 5){
                this.addTsForm.stageList.push({
                    followTemplateStageName: 'T' + (this.addTsForm.stageList.length + 1),
                    sort: this.addTsForm.stageList.length + 1,
                    days: '',
                    status: '1',
                    drugFlag: '1'
                })
            }else{
                this.$message({
                    message: "已到最大T次",
                    type: "warning",
                    duration: 1500
                })
            }
        },
        reSet() { // 重置表单
            this.addTsForm.stageList = [{
                followTemplateStageName: "T1",
                sort: 1,
                days: '',
                status: '1',
                drugFlag: '1'
            },{
                followTemplateStageName: "T2",
                sort: 2,
                days: '',
                status: '1',
                drugFlag: '1'
            }]
        }
    },
    mounted() {
        
    },
    created() {
        this.createUserId =JSON.parse(localStorage.getItem('userInfo')).employeeId
        this.addTsForm.createUserId = JSON.parse(localStorage.getItem('userInfo')).employeeId
    }
}
</script>

<style scoped>

</style>
