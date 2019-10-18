<template>
  <div class="LoginList content" v-loading="loading">
    <el-card class="mt20 mb10">
      <el-form size="mini" class="ml30" style="width: 800px;">
        <el-row>
          <el-col :span="6">
            <el-form-item label="记录类型:">
              <el-select v-model="form.val" class="w100 fl" placeholder>
                <el-option label="登录" value="1"></el-option>
                <el-option label="修改密码" value="2"></el-option>
                <el-option label="修改不活跃" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
                  <el-form-item label="工号:">
                      <el-input v-model="form.name"  class="w120 fl"></el-input>
                  </el-form-item>
          </el-col>-->
          <el-col :span="3">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" class="fl" @click="serchLogin">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="loginList"
        ref="singleTable"
        size="mini"
        height="490"
        align="center"
        highlight-current-row
      >
        <el-table-column prop="employeeCode" label="工号" width="80" align="center"></el-table-column>
        <el-table-column prop="createTime" label="时间" width="150" align="center"></el-table-column>
        <el-table-column prop="loginInfo" label="详细信息记录" align="center"></el-table-column>
      </el-table>
      <el-pagination
        align="right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[50, 100, 150]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalList"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "LoginList",
  data() {
    return {
      loading: true, //页面loading
      form: {
        // name: '',
        val: "1"
      },
      loginList: [], // 登录记录列表
      currentPage: 3,
      loginData: "", // 登陆记录总
      totalList: 0, // 总记录数
      pageSize: 0 // 每页显示个数
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
      this.getList(val, this.form.val, 1);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getList(this.pageSize, this.form.val, val);
    },
    getList(rows, type, page) {
      // 获取用户登录记录 rows:每页几条，type:查询类型， page：第几页
      this.loading = true
      this.pageSize = rows;
      let that = this;
      let bmsLogin = {
        page: page,
        rows: rows,
        type: type
      };
      this.$axios.post(this.$api + "bmsLogin/getList", bmsLogin).then(res => {
        if (res.data.code === 200) {
          this.loading = false
          this.loginData = res.data.data;
          this.totalList = res.data.data.total;
          let rowsList = res.data.data.rows;
          rowsList.map(item => {
            item.createTime = that.$serve.timemin(item.createTime);
          });
          this.loginList = rowsList;
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
    serchLogin() {
      // 搜索登录记录类型
      console.log(this.form);
      this.getList(50, this.form.val, 1);
    }
  },
  mounted() {
    let that = this;
    this.getList(50, this.form.val, 1);
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
</style>
