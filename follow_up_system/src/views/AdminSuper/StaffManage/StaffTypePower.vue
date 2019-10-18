<template>
  <div class="StaffTypePower">
    <el-form>
      <!--标题头-->
      <el-row class="mb20">
        <el-col :span="3">
          <p>ID</p>
        </el-col>
        <el-col :span="5">
          <p>权限名</p>
        </el-col>
        <el-col :span="7">
          <p>功能描述</p>
        </el-col>
        <el-col :span="5">
          <p>权限</p>
        </el-col>
        <!-- <el-col :span="5">
          <p>权限</p>
        </el-col> -->
      </el-row>
      <!--内容-->
      <el-row v-for="(item, index) in powersList" :key="index" class="rowList pt10 pb10 flex alic">
        <el-col :span="3">
          <p>{{item.id}}</p>
        </el-col>
        <el-col :span="5">
          <p>{{item.name}}</p>
        </el-col>
        <el-col :span="7">
          <p>{{item.description}}</p>
        </el-col>
        <el-col :span="6">
          <el-checkbox v-model="checked" @change="handleCheck($event, itm)" v-for="(itm,i) in powersList[index].resourceSonList" :key="i" :label="itm.id">{{itm.name}}</el-checkbox>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import {mapActions} from 'vuex'
export default {
  props: ['roleId'],
  data() {
    return{
      powersList: [], //所有权限对象
      checked: [],
      rolePowerList: [] //角色对应权限
    }
  },
  methods:{
    ...mapActions(['getResourceForRole']),
    handleCheck(val, item){ // 复选框选择
      item.roleId = this.roleId
      if(val === true){
        console.log('新增权限', item)
        this.setResourceForRole(item)
      }else{
        this.deleteResourceForRole(item)
        console.log('删除权限', item)
      }
    },
    getAllPower(){ // 获取角色所有权限
      this.$axios.get(this.$api + 'resource/getAll').then(res => { 
        if(res.data.code === 200){
          this.powersList = res.data.data
        }
      })
    },
    setResourceForRole(item){ // 新增权限
      let addData = {
        resourceSonId: item.id,
        resourceId: item.resourceId,
        roleId: item.roleId
      }
      this.$axios.post(this.$api + 'resource/setResourceForRole', addData).then(res => {
        console.log(res)
        this.getResourceForRole({id:this.roleId,isShow:false}).then((res)=>{
          let checkedList = []
          let rolePowerList = res
          this.rolePowerList = rolePowerList
          rolePowerList.map(item => {
            checkedList.push(item.id)
          })
          this.checked = checkedList
        })
      })
    },
    deleteResourceForRole(item){ // 删除权限
      this.$axios.get(this.$api + 'resource/deleteResourceForRole?roleId=' + this.roleId + '&resourceSonId=' + item.id).then(res => {
        if(res.data.code === 200){
          this.getResourceForRole({id:this.roleId,isShow:false}).then((res)=>{
            let checkedList = []
            let rolePowerList = res
            this.rolePowerList = rolePowerList
            rolePowerList.map(item => {
              checkedList.push(item.id)
            })
            this.checked = checkedList
          })
        }
      })
    }
  },
  mounted() {
    this.getResourceForRole({id:this.roleId,isShow:false}).then((res)=>{
      let checkedList = []
      let rolePowerList = res
      this.rolePowerList = rolePowerList
      rolePowerList.map(item => {
        checkedList.push(item.id)
      })
      this.checked = checkedList
    })
  },
  created(){
    this.getAllPower()
  }
}
</script>
<style scoped>
.StaffTypePower{height: 460px; overflow-y: scroll;}
.StaffTypePower >>> .el-checkbox{width:100%;}
.StaffTypePower >>> .el-checkbox__label{float: left;margin-right: 5px;font-size: 13px;}
.StaffTypePower::-webkit-scrollbar {
  width: 6px;
  height: 1px;
}
.rowList{border-bottom: 1px solid rgba(204,204,204,1); width: 98%}
.StaffTypePower::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: #535353de;
}
.StaffTypePower::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 10px;
  background: #EDEDED;
}
</style>

