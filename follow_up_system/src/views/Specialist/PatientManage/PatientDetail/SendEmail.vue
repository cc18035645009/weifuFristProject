<template>
  <div class="SendEmail">

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="mt20 pl20">
      
      <el-form-item label="收件邮箱：" prop="toMail">
        <el-select  v-model="ruleForm.toMail" class="w10p" multiple placeholder="请选择" @focus='$emit("setActive")'>
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.userName"
            :value="item.mail">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="抄送：">
        <el-select  v-model="ruleForm.csMail" class="w10p" multiple placeholder="请选择" @focus='$emit("setActive")'>
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.userName"
            :value="item.mail">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="主题：" prop="mailSubject">
        <el-input v-model="ruleForm.mailSubject" @focus='$emit("setActive")'></el-input>
      </el-form-item>

      <el-form-item label="附件：">
        <!-- 
        :action="this.$api+'upload/uploadFile'" 
        :on-success='successFile'
        :on-remove="handleFileRemove"
        :file-list="fileList"
        -->
        <el-upload
          :before-upload='getFile'
          name='fileList'
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-remove="handleFileRemove"
          :file-list="fileList"
          >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>

      <el-upload
        class="upload posAbs"
        :action="this.$api+'upload/uploadPicture'"
        name='file'
        accept='image/jpeg, image/png, image/jpg'
        :show-file-list='false'
        :on-success='successImg'
        >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>

      <el-form-item label="内容：" prop="mailContent">
        <quill-editor  
          v-model="ruleForm.mailContent"
          class="editor"
          ref='QuillEditor'
          :options="editorOption" 
          @blur="onEditorBlur($event)" 
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)">
        </quill-editor>
      </el-form-item>

      <el-form-item class="tr">
        <el-button type="primary" @click="submitForm('ruleForm')" class="mt10" size="small">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')" class="mt10" size="small">重置</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
  // ["blockquote", "code-block"], // 引用  代码块
  [{ header: 1 }, { header: 2 }], // 1、2 级标题
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
  // [{ script: "sub" }, { script: "super" }], // 上标/下标
  // [{ indent: "-1" }, { indent: "+1" }], // 缩进
  // [{'direction': 'rtl'}],                         // 文本方向
  [{ size: ["small", false, "large", "huge"] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  // [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  ["clean"], // 清除文本格式
  ["image"] // 链接、图片、视频 ["link", "image", "video"]
];
export default {
  name:'SendEmail',
  data() {
    return {
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        placeholder: "您想说点什么？",
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".upload input").click();
                  console.log(value)
                } else {
                  this.quill.format("image", false);
                }
              },
              link: function(value) {
                if (value) {
                  var href = prompt('请输入url');
                  this.quill.format("link", href);
                } else {
                  this.quill.format("link", false);
                }
              },
            }
          }
        }
      },
      fileList:[],
      ruleForm: {
        toMail:[],
        mailSubject:'',
        mailContent:'',
        csMail:[]
      },
      rules: {
        toMail: [
          { required: true, message: '请选择收件', trigger: 'change' }
        ],
        mailSubject: [
          { required: true, message: '请输入主题', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ],
        mailContent:[
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      options: [],
    }
  },
  methods: {
    onEditorBlur(editor){//失去焦点事件    
 	    },
    onEditorFocus(editor){//获得焦点事件
      this.$emit("setActive")
    },
    onEditorChange({editor,html,text}){//编辑器文本发生变化
        //this.content可以实时获取到当前编辑器内的文本内容
        console.log(this.content);
    },
    handleFileRemove(file, fileList){ //删文件
      this.fileList = fileList
    },
    getFile(file){
      this.fileList.push(file)
      console.log(file)
    },
    successFile(response, file, fileList){//上传文件
      if(response.code == 200){
        this.fileList.push({
          name:file.name,
          status:'success',
          uid:file.uid,
          raw:response.data
        })
      }
    },
    mailList(){
      this.$axios.post(this.$api + 'mailBox/getList',{}).then(res => { // 登录
          if(res.data.code === 200){   
            this.options = res.data.data
          }else{
              this.$message({
                  message: res.data.message,
                  type: 'error',
                  duration: 1500
              })
          }
      }).catch(function (error) {})
    },
    successImg(response, file, fileList){
      console.log(response, file, fileList)
      let quill = this.$refs.QuillEditor.quill
      let index = quill.getSelection().index;
      quill.insertEmbed(index, 'image', this.$serve.img+response.data);
      quill.setSelection(index + 1)
    },
    submitForm(formName) {
      let that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // let files = []
            // this.fileList.map((item)=>{
            //   files.push(this.$serve.file+item.raw)
            // })
            // let data = {
            //   ...that.ruleForm,
            //   projectId:this.$route.query.proId,
            //   toMail:this.ruleForm.toMail.join(';'),
            //   csMail:this.ruleForm.csMail.join(';'),
            //   filePath:files.join(',')
            // }
          
            let data1 = new FormData()
            this.fileList.map((item)=>{
              data1.append('fileList',item)                                         
            })
            data1.append('toMail',this.ruleForm.toMail.join(';'))
            if(this.ruleForm.csMail.length>0){
              data1.append('csMail',this.ruleForm.csMail.join(';'))
            }
            data1.append('csMail',this.ruleForm.csMail.join(';'))
            data1.append('mailSubject',this.ruleForm.mailSubject)
            data1.append('mailContent',this.ruleForm.mailContent)
            data1.append('projectId',this.$route.query.proId)
            this.$axios.post(this.$api + "mail/sendMail",data1,{headers:{'Content-Type':'multipart/form-data'}}).then(res => {
              if (res.data.code === 200) {
                this.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 1500
                });
                this.resetForm(formName)
              } else {
                this.$message({
                  message: res.data.message,
                  type: "error",
                  duration: 1500
                });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm.mailContent = ''
      this.fileList = []
      this.ruleForm.csMail = ''
    },
  },
  created() {
    this.mailList()
  },
  components: {
    quillEditor
  }
}
</script>

<style scoped>
.editor {
  line-height: normal !important;
  height: 500px;
  margin-bottom: 60px;
}
.upload{z-index:-1}


.SendEmail >>> .ql-snow .ql-tooltip[data-mode=link]::before {
  content: "请输入链接地址:";
}
.SendEmail >>> .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
}

.SendEmail >>> .ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
}

.SendEmail >>> .ql-snow .ql-picker.ql-size .ql-picker-label::before,
.SendEmail >>> .ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.SendEmail >>> .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.SendEmail >>> .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
  content: '10px';
}
.SendEmail >>> .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.SendEmail >>> .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
  content: '18px';
}
.SendEmail >>> .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.SendEmail >>> .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
  content: '32px';
}

.SendEmail >>> .ql-snow .ql-picker.ql-header .ql-picker-label::before,
.SendEmail >>> .ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.SendEmail >>> .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.SendEmail >>> .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: '标题1';
}
.SendEmail >>> .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.SendEmail >>> .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: '标题2';
}
.SendEmail >>> .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.SendEmail >>> .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: '标题3';
}
.SendEmail >>> .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.SendEmail >>> .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: '标题4';
}
.SendEmail >>> .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.SendEmail >>> .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: '标题5';
}
.SendEmail >>> .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.SendEmail >>> .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: '标题6';
}

.SendEmail >>> .ql-snow .ql-picker.ql-font .ql-picker-label::before,
.SendEmail >>> .ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
.SendEmail >>> .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.SendEmail >>> .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
  content: '衬线字体';
}
.SendEmail >>> .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
.SendEmail >>> .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
  content: '等宽字体';
}
.SendEmail >>> .ql-align-center{
  text-align: center;
}
.SendEmail >>> .ql-align-right{
  text-align: right;
}
.SendEmail >>> .ql-align-left{
  text-align: left;
}
</style>
