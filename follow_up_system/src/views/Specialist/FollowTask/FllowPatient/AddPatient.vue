<template>
  <div class="AddPatient">
    <!-- <el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button> -->
    <el-dialog title="新增患者" :visible.sync="dialogFormVisible" @close='close' width="53%">
      <el-form ref="form" :model="sizeForm" size="small" :inline="true"  label-position="right" class="mauto w10p overH">
        <div class="overH fl">
          <el-form-item label="省份:">
            <el-select v-model="sizeForm.region" class="w100" placeholder="">
              <el-option label="上海" value="shanghai"></el-option>
              <el-option label="北京" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="患者姓名:">
            <el-input v-model="sizeForm.name" class="w80"></el-input>
          </el-form-item>
          <el-form-item label="患者手机:">
            <el-input v-model="sizeForm.name" class="w120"></el-input>
          </el-form-item>
          <el-form-item label="家属手机:">
            <el-input v-model="sizeForm.name" class="w120"></el-input>
          </el-form-item>
        </div>
        <div class="overH fl">
          <el-form-item label="城市:">
            <el-select v-model="sizeForm.region" class="w100" placeholder="">
              <el-option label="上海" value="shanghai"></el-option>
              <el-option label="北京" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别:">
            <el-select v-model="sizeForm.region" class="w80" placeholder="">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="固定电话:">
            <el-input v-model="sizeForm.name" class="w50"></el-input>
          </el-form-item>
          <el-form-item label="-">
            <el-input v-model="sizeForm.name" class="w120"></el-input>
          </el-form-item>
          <el-form-item label="电子邮件:">
            <el-input v-model="sizeForm.name" class="w120"></el-input>
          </el-form-item>
        </div>
        <div class="overH fl">
          <el-form-item label="医院:">
            <el-select v-model="sizeForm.region" class="w100" placeholder="">
              <el-option label="上海" value="shanghai"></el-option>
              <el-option label="北京" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生年月:">
            <el-select v-model="sizeForm.region" class="w80" placeholder="">
              <el-option label="1994" value="shanghai"></el-option>
              <el-option label="2000" value="beijing"></el-option>
            </el-select>年
            <el-select v-model="sizeForm.region" class="w50" placeholder="">
              <el-option label="上海" value="shanghai"></el-option>
              <el-option label="北京" value="beijing"></el-option>
            </el-select>月
          </el-form-item>
          <el-form-item label="患者来源:">
            <el-select v-model="sizeForm.region" class="w80" placeholder="">
              <el-option label="门诊" value="1"></el-option>
              <el-option label="病房" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否需要随访:">
            <el-select v-model="sizeForm.region" class="w80" placeholder="">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="overH fl">
          <el-form-item label="销售经理:">
            <el-input v-model="sizeForm.name" class="w80"></el-input>
          </el-form-item>
          <el-form-item label="主治医生:">
            <el-input v-model="sizeForm.name" class="w80"></el-input>
          </el-form-item>
          <el-form-item label="是否入组:">
            <el-select v-model="sizeForm.region" class="w80" placeholder="">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属项目:">
            <el-select v-model="sizeForm.region" class="w100" placeholder="">
              <el-option label="百泌达" value="1"></el-option>
              <el-option label="百达扬" value="2"></el-option>
              <el-option label="优泌淋" value="3"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="overH fl">
          <el-form-item label="通讯省份:">
            <el-select v-model="sizeForm.region" class="w100" placeholder="">
              <el-option label="上海" value="shanghai"></el-option>
              <el-option label="北京" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="市:">
            <el-select v-model="sizeForm.region" class="w100" placeholder="">
              <el-option label="上海" value="shanghai"></el-option>
              <el-option label="北京" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址:">
            <el-input class="w150"></el-input>
          </el-form-item>
          <el-form-item label="邮编:">
            <el-input class="w100"></el-input>
          </el-form-item>
        </div>
        <div class="overH fl">
          <el-form-item label="初始使用日期:">
            <el-col :span="16">
              <el-date-picker type="date" v-model="sizeForm.date1" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="是否老患者:">
            <el-select v-model="sizeForm.region" class="w100" placeholder="">
              <el-option label="是" value="shanghai"></el-option>
              <el-option label="否" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
            <el-button @click.stop="cancel">取 消</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.stop="confirm">确 定</el-button>
          </el-form-item> -->
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="cancel">重置填写</el-button>
        <el-button type="primary" @click.stop="confirm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddPatient',
  data() {
    return {
      dialogFormVisible: true,
      sizeForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    }
  },
  methods: {
    cancel () { // 取消
      this.$emit('close')
    },
    confirm () { // 提交
      this.$emit('close', 1)
    },
    close () {
      this.dialogFormVisible = true
      this.$emit('close')
    }
  }
};
</script>
</script>

<style scoped>
</style>