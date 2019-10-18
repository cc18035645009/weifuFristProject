<template>
  <div class="DataExport content">
    <el-card class="mt20 mb10">
      <el-form size="mini" class="ml30" style="width: 800px;">
        <el-row>
          <el-col :span="6">
            <el-form-item label="项目:">
              <el-select v-model="form.projectId" class="w100 fl" @change="getTtimes" clearable>
                <el-option :label="item.projectName" :value="item.id" v-for="(item,index) in proList" :key='index'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="T次:">
              <el-select v-model="form.sort" class="w100 fl" clearable>
                <!-- <el-option :label="item.followTemplateStageName" :value="item.sort" v-for="(item,index) in Ttimes" :key='index'></el-option> -->
                <el-option label="T1" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" class="fl" @click="search">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "DataExport",
  data() {
    return {
      loading: true, //页面loading
      proList:[],
      Ttimes:[],
      form: {
        projectId: '',
        sort:'',
      },
    };
  },
  methods: {
    ...mapMutations({
      isSuper: 'isSuper',
      isCallCenter: "isCallCenter",
      isSpecial: 'isSpecial'
    }),
    getPro(){
      this.$axios.get(this.$api + 'project/getProjects').then(res => {
        if(res.data.code === 200){
          this.proList = res.data.data
        }
      })
    },
    getTtimes(id){ //获取搜索T次
      this.form.sort = ''
      this.$axios.get(this.$api + 'project/getProjectById?id='+id).then(res => {
        if(res.data.code === 200){
          this.Ttimes = res.data.data.stageList
        }
      })
    },
    search() {
      // 搜索登录记录类型
      console.log(this.form); 
      // this.$serve.downExcel('patient/patientExcel',this.form,'数据','GET')
      window.open(this.$api + 'patient/patientExcel?projectId='+this.form.projectId+'&sort='+this.form.sort)
    }
  },
  mounted() {
    console.log(navigator.userAgent);
  },
  created() {
    this.isSuper(true)
    this.isSpecial(false)
    this.isCallCenter(false)
    this.getPro()
  }
};
</script>

<style scoped>
</style>
