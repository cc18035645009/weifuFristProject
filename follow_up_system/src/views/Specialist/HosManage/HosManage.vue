<template>
  <div class="HosManaage" v-loading="loading">
    <el-container>
      <el-main style="padding-top: 10px">
        <el-container>
          <el-aside width="200px" style="height:600px">
            <el-tree
              ref="tree"
              :data="provinceList" 
              check-strictly
              highlight-current
              node-key="key"
              :props="defaultProps" 
              :expand-on-click-node="false"
              @node-click="handleNodeClick">
            </el-tree>
          </el-aside>
          <el-main style="padding:0">
            <el-row class="mt20 ml10">
              <el-col :span="3">
                <el-button type="primary" size="small" icon="el-icon-plus" class="fl">新增医院</el-button>
              </el-col>
              <el-col :span="3">
                <el-button type="primary" size="small" icon="el-icon-edit" class="fl">编辑</el-button>
              </el-col>
              <el-col :span="3">
                <el-button type="primary" size="small" icon="el-icon-delete" class="fl">删除</el-button>
              </el-col>
              <el-col :span="4">
                <el-input v-model="searchName" size="small" class="fl" placeholder="请输入医院名"></el-input>
              </el-col>
              <el-col :span="3">
                <el-button type="primary" size="small" icon="el-icon-search" @click="searchHos" class="fl">搜索</el-button>
              </el-col>
            </el-row>
            <!--医院列表-->
            <el-table :data="hosList" class="mt15" style="width: 100%" ref="hosList" height="540">
              <el-table-column prop="hospitalCode" label="医院编号"></el-table-column>
              <el-table-column prop="areaName" label="所属大区"></el-table-column>
              <el-table-column prop="provinceName" label="所属省份"></el-table-column>
              <el-table-column prop="cityName" label="所属城市"></el-table-column>
              <el-table-column prop="hospitalName" label="医院名称"></el-table-column>
            </el-table>
            <el-pagination
              align="right"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[50, 100, 150]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="hosTotal">
            </el-pagination>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "HosManaage",
  data() {
    return {
      loading: true,
      searchName:"",
      pageSize: 50, //每页显示个数
      currentPage: 1, //当前页
      provinceList: [], //省市列表
      provinceToList: [], // 有权限列表
      defaultProps: {
        label: function(data,node){
          if(data.provinceName){
            return data.provinceName
          }else if(data.cityName){
            return data.cityName
          }
        },
        children: 'cityList',
      },
      count: 1,
      hosList: [],// 医院列表
      hosTotal: 0, // 医院总数
      createUserId: '', //创建者id
      selectData:'', // 选择省市
      proId: ''
    }
  },
  methods: {
    ...mapMutations(['isSpecial', 'isSuper', 'isCallCenter']),
    getProvinces() { // 获取省市
      this.$axios.get(this.$api + 'hospital/getProvinces?projectId=1').then(res => {
        console.log(res)
        if(res.data.code === 200){
          this.provinceList = res.data.data
          this.loading = false
          console.log(this.provinceList)
        }
      })
    },
    handleNodeClick(data) { // 点击对应省市获取医院列表
      this.selectData = data
      if(data.provinceCode){
        console.log('provinceCode', data.provinceCode)
      }else if(data.cityCode){
        console.log('cityCode', data.cityCode)
      }
      this.getHosList(1, 50, this.proId, data, '')
    },
    getHosList(page, rows, projectId, place, hospitalName) { // 获取医院列表
      console.log(place)
      let hosData = {
        page: page,
        rows: rows,
        projectId: projectId,
        hospitalName: hospitalName
      }
      if(place !== ''){
        let placeType = place.provinceCode ? 'provinceCode' : 'cityCode'
        hosData[placeType] = place.provinceCode ? place.provinceCode : place.cityCode
      }
      console.log(hosData)
      this.$axios.post(this.$api + 'hospital/getList', hosData).then(res => { // 获取医院列表
        console.log(res)
        if(res.data.code === 200){
          this.hosList = res.data.data.rows
          this.hosTotal = res.data.data.total
        }
      })
    },
    searchHos(){ // 搜索医院名
      this.getHosList(this.currentPage, this.pageSize, this.proId, this.selectData, this.searchName)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.getHosList(this.currentPage, val, this.proId, this.selectData, this.searchName)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.getHosList(val, this.pageSize, this.proId, this.selectData, this.searchName)
    }
  },
  mounted() {
    this.proId = this.$route.query.proId
    this.createUserId = JSON.parse(localStorage.getItem('userInfo')).employeeId
    this.getProvinces()
    this.getHosList(1, 50, this.proId, '', '')
  },
  created(){
    this.isSpecial(true)
    this.isCallCenter(false)
    this.isSuper(false)
  }
}
</script>

<style scoped>
</style>
<style>
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{background-color: #cfe3fa;}
</style>
