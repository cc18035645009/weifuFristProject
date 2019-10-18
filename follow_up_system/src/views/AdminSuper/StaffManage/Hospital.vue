<template>
  <div class="Hospital" v-loading="loading">
    <el-container>
      <!-- <el-header class="bgee lh40" height="40px">
        <p class="tl pl20">设置用户地区及医院权限</p>
      </el-header> -->
      <el-main style="padding-top: 10px">
        <el-container>
          <el-aside width="200px" style="height:600px">
            <p class="bgee tl pt5 pb5 pl10">地区选择</p>
            <el-tree
              ref="tree"
              :data="provinceList" 
              show-checkbox 
              check-strictly
              @check="checkHos" 
              highlight-current
              node-key="key"
              :props="defaultProps" 
              :expand-on-click-node="false"
              @node-click="handleNodeClick">
            </el-tree>
          </el-aside>
          <el-main style="padding:0">
            <p class="bgee tl pt5 pb5 pl10">医院选择</p>
            <el-row class="mt20 ml10">
              <el-col :span="4">
                <el-input v-model="searchName" size="small" class="fl" placeholder="请输入医院名"></el-input>
              </el-col>
              <el-col :span="3">
                <el-button type="primary" size="small" icon="el-icon-search" @click="searchHos" class="fl">搜索</el-button>
              </el-col>
            </el-row>
            <!--医院列表-->
            <el-table :data="hosList" style="width: 100%" ref="hosList" @select="selectHos" height="540">
              <el-table-column type="selection" width="55"></el-table-column>
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
  name: "Hospital",
  props: ['proId', 'employeeId', 'employeeCode'],
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
      hosListCode: [], //医院code列表
      hosPowerListCode: [], // 有权限医院code列表
      hosTotal: 0, // 医院总数
      createUserId: '', //创建者id
      selectData:'' // 选择省市
    }
  },
  methods: {
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
      this.getStaffPower()
      this.getHosList(1, 50, this.proId, data, '')
    },
    checkHos(data, node) { // 复选设置医院权限
      console.log(data, node)
      let selected = node.checkedNodes.length && node.checkedNodes.indexOf(data) !== -1
      if(selected){
        if(data.cityCode ){
          console.log('增加市区权限', data.cityCode)
          this.setStaffPower('cityCode', data.cityCode, 1)
          return false
        }else{
          console.log('增加省份权限', data.provinceCode)
          this.setStaffPower('provinceCode', data.provinceCode, 1)
          return false
        }
      }else{
        if(data.cityCode){
          console.log('删除市区权限', data.cityCode)
          this.setStaffPower('cityCode', data.cityCode, 0)
          return false
        }else{
          this.setStaffPower('provinceCode', data.provinceCode, 0)
          console.log('删除省份权限', data.provinceCode)
          return false
        }
      }
    },
    selectHos(rows, row) { // 单选指定医院权限
      let selected = rows.length && rows.indexOf(row) !== -1
      console.log(selected, row.hospitalCode)
      if(selected){
        console.log('赋权限', row.hospitalCode)
        this.setStaffPower('hospitalCode', row.hospitalCode, 1)
      }else{
        console.log('删除权限', row.hospitalCode)
        this.setStaffPower('hospitalCode', row.hospitalCode, 0)
      }
    },
    setStaffPower(powerType, code, type) { // 操作员工权限
      let powerData = {
        employeeId: this.employeeId,
        employeeCode: this.employeeCode,
        createUserId: this.createUserId,
        provinceCode: powerType === 'provinceCode' ? code : '',
        cityCode: powerType === 'cityCode' ? code : '',
        hospitalCode: powerType === 'hospitalCode' ? code : '',
        projectId:this.proId
      }
      console.log(powerData)
      if(type === 1){ // 设置员工权限
        console.log('设置员工权限',powerData)
        this.$axios.post(this.$api + 'employeeHospital/add', powerData).then(res => {
          console.log(res)
          if(res.data.code === 200){
            this.getStaffPower()
          }
        })
      }else{ // 删除员工权限
        console.log('删除员工权限',powerData)
        this.$axios.post(this.$api + 'employeeHospital/delete', powerData).then(res => {
          console.log(res)
          if(res.data.code === 200){
            this.getStaffPower()
          }
        })
      }
    },
    getStaffPower() { // 获取员工权限
      this.$axios.get(this.$api + 'employeeHospital/getListByEmployeeId?employeeId=' + this.employeeId).then(res => {
        if(res.data.code === 200){
          let provinceToList = res.data.data.provinceToList
          this.provinceToList = provinceToList
          // this.$nextTick(() => {
          //   this.$refs.hosList.toggleRowSelection(this.hosList[1],true)
          // })
          console.log('有权限列表', this.provinceToList)
          let hosPowerListCode = [] // 有权限医院列表
          let powerKeys = [] // 有权限省市key数组
          if(provinceToList.length > 0){ // 遍历有权限医院code
            for(let i=0; i< provinceToList.length; i++){
              powerKeys.push(provinceToList[i].key)
              if(provinceToList[i].cityToList.length > 0){
                for(let j=0; j< provinceToList[i].cityToList.length; j++){
                  powerKeys.push(provinceToList[i].cityToList[j].key)
                  if(provinceToList[i].cityToList[j].hospitalList.length > 0){
                    for(let k=0; k<provinceToList[i].cityToList[j].hospitalList.length; k++){
                      hosPowerListCode.push(provinceToList[i].cityToList[j].hospitalList[k].hospitalCode)
                    }
                  }
                }
              }              
            }
          }
          console.log('有权限医院code', hosPowerListCode)
          console.log(powerKeys)
          this.hosPowerListCode = hosPowerListCode
          console.log(powerKeys)
          this.$refs.tree.setCheckedKeys(powerKeys)
        }else{
          return false
        }
      })
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
      this.$axios.post(this.$api + 'hospital/getList', hosData).then(res => { // 获取医院列表接口
        console.log(res)
        if(res.data.code === 200){
          let hosListCode = [] //设置医院列表code集合
          let hosRowSelect = [] // 医院权限默认选中
          this.hosList = res.data.data.rows
          this.hosTotal = res.data.data.total
          for(let i=0; i<this.hosList.length; i++){
            hosListCode.push(this.hosList[i].hospitalCode)
          }
          this.hosListCode = hosListCode
          console.log('所有医院code', this.hosListCode)
          console.log('有医院权限code', this.hosPowerListCode)
          if(this.hosPowerListCode.length > 0){
            for(let i=0; i<this.hosPowerListCode.length; i++){
              //console.log(this.hosListCode.indexOf(this.hosPowerListCode[i]))
              hosRowSelect.push(this.hosListCode.indexOf(this.hosPowerListCode[i]))
            }
          }
          console.log(hosRowSelect)
          this.$nextTick(() => {
            if(hosRowSelect.length > 0 ){ //显示已添加权限医院select
              for(let i=0; i<hosRowSelect.length; i++){
                this.$refs.hosList.toggleRowSelection(this.hosList[hosRowSelect[i]],true)
              }
            }
          })
        }
      })
    },
    searchHos(){ // 搜索医院名
      this.getStaffPower()
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
    console.log(this.proId)
    console.log(this.employeeCode)
    this.createUserId = JSON.parse(localStorage.getItem('userInfo')).employeeId
    this.getProvinces()
    this.getStaffPower()
    this.getHosList(1, 50, this.proId, '', '')
  },
  created() {}
};
</script>

<style scoped>
</style>
<style>
.Hospital tr th:nth-child(1) .cell{display: none;}
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{background-color: #cfe3fa;}
</style>
