<template>
  <div class="SetQmain">
    <el-container v-loading="loadingNext">
      <el-header class="bgee lh40" height='40px'><p class="tl pl20">问卷设定T{{(active+1) > totalTs ? totalTs: (active+1)}}</p></el-header>
      <el-main>
        <el-steps :active="active" finish-status="success" class="mb40"  align-center>
          <el-step :title="'T' + item" v-for="(item, index) in totalTs" :key="index"></el-step>
        </el-steps>
        <el-form size="small" label-position="right" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="项目名称:">
                <el-input v-model="proName" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item :label="'T' + (active+1 > totalTs ? totalTs : active+1) + '次问卷:'" label-width="100px" prop="searchQ">
                <el-select class="fl" v-model="ruleForm.searchQ" 
                  filterable  
                  clearable 
                  @change="searchRes"
                  placeholder="搜索问卷名称"
                  :loading="loading">
                  <el-option
                    v-for="item in options4"
                    :key="item.id"
                    :label="item.followTemplateName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!--搜索问卷结果-->
        <qpage-detail v-if="isQpage"></qpage-detail>
      </el-main>
    </el-container>
    <el-button class="fl ml20 mb20" @click="next('ruleForm')">{{ active > (totalTs-1) ? '完成' : '下一步' }}</el-button>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex"
import qpageDetail from './QpageDetail'
export default {
  props: ['proName','proId'],
  name: "SetQmain",
  data() {
    return {
      isQpage: false, // 是否搜索问题
      loadingNext: false, // 下一步loading
      active: 0,
      Ts: '1',
      totalTs: 1,
      ruleForm: {
        searchQ: ""
      },
      rules: {
        // 表单规则验证
        searchQ: [{ required: true, message: "请选择", trigger: "change" }]
      },
      options4: [{value:1,label:1}],
      detail:{},
      list: [],
      loading: false,
      states: ["Alabama", "Alaska", "Arizona",
      "Arkansas", "California", "Colorado",
      "Connecticut", "Delaware", "Florida",
      "Georgia", "Hawaii", "Idaho", "Illinois",
      "Indiana", "Iowa", "Kansas", "Kentucky",
      "Louisiana", "Maine", "Maryland",
      "Massachusetts", "Michigan", "Minnesota",
      "Mississippi", "Missouri", "Montana",
      "Nebraska", "Nevada", "New Hampshire",
      "New Jersey", "New Mexico", "New York",
      "North Carolina", "North Dakota", "Ohio",
      "Oklahoma", "Oregon", "Pennsylvania",
      "Rhode Island", "South Carolina",
      "South Dakota", "Tennessee", "Texas",
      "Utah", "Vermont", "Virginia",
      "Washington", "West Virginia", "Wisconsin",
      "Wyoming"]
    }
  },
  components: {
    qpageDetail
  },
  methods: {
    ...mapMutations({
      isSuper: "isSuper",
      isSpecial: "isSpecial"
    }),
    next(formName) { // 下一步》》
      this.$refs[formName].validate((valid) => {
        if (valid) { 
          this.loadingNext = true
          this.isQpage = false
          if(this.active +1 >= this.totalTs){
            this.active = 0
            this.$emit('closeSetQmain') // 项目详情设定问卷关闭
          }else{
            let data = {
              paperId:this.ruleForm.searchQ,
              id:this.detail.stageList[this.active].id
            }
            this.$axios.post(this.$api + 'templateStage/bindPaper',data).then(res => {
              if(res.data.code == 200){
                this.loadingNext = false
                this.ruleForm.searchQ = ''
                this.active++
                this.ruleForm.searchQ = this.detail.stageList[this.active].paperId
                this.$message({
                    message: res.data.message,
                    type: 'success',
                    duration: 1500
                })
              }else{
                this.$message({
                    message: res.data.message,
                    type: 'error',
                    duration: 1500
                })
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    searchRes() { // 选中搜索值
      //this.isQpage = true
    },
    getT(){
      this.$axios.post(this.$api + 'template/getTemplateList',{}).then(res => {
        if(res.data.code == 200){
          this.options4 = res.data.data
        }
      })
    },
    getProDetail() { // 获取项目详情
      this.$axios.get(this.$api + 'project/getProjectById?id=' + this.proId).then(res => {
        if(res.data.code == 200){
          this.totalTs = res.data.data.stageList.length
          console.log(this.totalTs)
          this.detail = res.data.data
          this.ruleForm.searchQ = res.data.data.stageList[this.active].paperId
        }
      })
    }
  },
  // computed: {
  //   ...mapState({
  //       step: 'step'
  //   })
  // },
  mounted() {

  },
  created() {
    this.getT() //获取T次
    this.getProDetail()
  }
};
</script>

<style scoped>
</style>
