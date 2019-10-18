<template>
<div class="resourceBox" style="overflow: auto">
  <div class="top">
    <el-row class="seekBox" >
    <el-row class="seeka">
      <input type="text"  placeholder="输入关键字" class="inputSeek"><span class="spanSeek" >搜索</span>
      <el-row class="filtrateBox">
        <span>按条件筛选：</span>
        <el-button size="mini">今天</el-button>
        <el-button size="mini">本周</el-button>
        <el-button size="mini">本月</el-button>
        <el-button size="mini">半年内</el-button>
        <el-date-picker class="time"
          size="mini"
          v-model="times"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-row>
      <el-row>
        <el-button type="text">查看全部></el-button>
      </el-row>
    </el-row>
  </el-row>
    <el-row class="cutOff"></el-row>
    <el-row class="tabeBoxB" style="padding-bottom: 0">
      <el-row>
        <el-button size="mini" @click="toLead">+导入资源</el-button>
        <el-button size="mini"><i class="iconfont ziyuanImg">&#xe602;</i> 资源分配</el-button>
        <el-button size="mini"><i class="iconfont ziyuanImg">&#xe641;</i> 资源分组</el-button>
      </el-row>
      <el-row class="wire"></el-row>
    </el-row>
  </div>
  <div class="tabeBox bottom" >
    <el-row class="tabeBoxA">
      <el-row class="tabe">
      <el-table
        v-loading="tableLoading"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="编号"
          width="120">
          <!--<template slot-scope="scope">{{ scope.row.date }}</template>-->
        </el-table-column>
        <el-table-column
          prop="name"
          label="客户名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="search"
          label="搜索词"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="phoneNumber"
          label="电话号码"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="getApproach"
          label="获取途径"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="clientSideType"
          label="客户端类型"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="创建时间"
          show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.time }}</template>
        </el-table-column>
      </el-table>
      <el-row v-if="!total" class="wu">
        <img src="../../assets/image/images_empty.png" alt="">
        <el-row>很抱歉！暂无资源</el-row>
      </el-row>
      <el-row v-if="total<=pageSize && total" class="foot">暂无更多！</el-row>
      <el-row class="paging" v-if="total>pageSize">
        <el-pagination
          background
          v-if="!tableLoading"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next"
          :total="total">
        </el-pagination>
      </el-row>
    </el-row>
    </el-row>
  </div>
  <el-dialog
    style="padding: 0px;"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="413px">
     <el-row class="dialogBox">
       <el-row class="dialogTitle" >
         <span >导入资源</span>
         <span class="shut iconfont" @click="shut">&#xe63f;</span>
       </el-row>
       <div class="fileBox"
           @dragover.prevent="dragover"
            @dragleave="dragleave($event)"
            @dragenter="dragenter($event)"
            @drop.prevent="dropFile($event)">
         <el-row v-if="fileBol">
          <el-row class="fontUploading" v-if="enterBol" >
            将资源文件拖拽至此，或<el-button type="text">点击上传</el-button>
            <span class="fileType"  >
                <input type="file" id="file1" name="file"   multiple="multiple" style="opacity: 0" @change="inputFile">
              </span>
          </el-row>
          <el-row class="fontUploading" v-if="!enterBol">请释放鼠标</el-row>
         </el-row>
         <el-row v-if="!fileBol">
           <i  class="iconfont wenjianImg" >&#xe66d;</i>
           <el-row class="fileName">
             <span v-text="fileName"></span>
             <i @click="fileShut" class="iconfont guanbi" >&#xe695;</i>
           </el-row>
         </el-row>
       </div>
       <el-row class="affirm">
         <el-button size="mini" @click="shut">取消</el-button>
         <el-button type="primary" :disabled="buttonBol" size="mini" @click="toUpload" v-text="buttonText"></el-button>
       </el-row>
     </el-row>
    </el-dialog>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogVisible2"
    width="413px">
    <el-row class="dialogBox">
      <el-row class="dialogTitle" >
        <span>上传资源</span>
        <span class="shut iconfont" @click="shutProgress">&#xe63f;</span>
      </el-row>
      <el-row class="fileBox progressBox">
        <span :style="'left:'+ (width - width/10) + '%;'" v-text="width + '%'"></span>
        <!--<el-row class="progressText"><i class="iconfont shuaxin">&#xe717;</i><span>(已上传29/30)</span></el-row>-->
        <el-row class="barBox">
          <p :style="'width:'+ width + '%;'"></p>
        </el-row>
      </el-row>
      <el-row class="affirm progress">
        <el-button type="primary"  size="mini" @click="cancel">取消上传</el-button>
      </el-row>
    </el-row>
  </el-dialog>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogVisible3"
    width="413px">
    <el-row class="dialogBox">
      <el-row class="dialogTitle error" >
        <span>失败原因</span>
      </el-row>
      <el-row class="errorImg"><i  class="iconfont cuowu">&#xe764;</i></el-row>
      <el-row class="errorText">抱歉！您上传的文件过大</el-row>
      <el-row class="errorButton">
        <el-button size="mini" @click="shutError">我知道了</el-button>
      </el-row>
    </el-row>
  </el-dialog>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogVisible4"
    width="413px">
    <el-row class="dialogBox">
      <el-row class="dialogTitle" >
        <span>上传成功</span>
        <span class="shut iconfont" @click="shutSucceed">&#xe63f;</span>
      </el-row>
      <el-row class="errorImg"><i  class="iconfont chenggong">&#xe645;</i></el-row>
      <el-row class="errorText">上传成功 {{succeedNumber}} 条，失败0条！</el-row>
      <el-row class="succeedButton">
        <el-button size="mini" @click="shutSucceed">关闭</el-button>
        <el-button size="mini" class="historyButton" @click="historyButton">查看历史记录</el-button>
      </el-row>
    </el-row>
  </el-dialog>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="dialogVisible5"
    width="413px">
    <el-row class="dialogBox">
      <el-row class="dialogTitle" >
        <span>上传失败 {{errorNumber}} 条</span>
        <span class="shut iconfont" @click="shutErrorAmount">&#xe63f;</span>
      </el-row>
      <el-row class="errorImg"><i  class="iconfont errorAmount">&#xe695;</i></el-row>
      <el-row class="errorText">上传成功 {{succeedNumber}} 条，失败 {{errorNumber}} 条！</el-row>
      <el-row class="succeedButton">
        <el-button size="mini" @click="shutErrorAmount">关闭</el-button>
        <el-button size="mini" class="errorAmountButton" @click="errorAmountButton">查看原因</el-button>
      </el-row>
    </el-row>
  </el-dialog>
</div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      times: '', // 时间段
      tableLoading: false, // 表格的加载状态
      tableData: [{
        id: '2016-05-03',
        name: '王小虎',
        search: '上海市普陀区金沙江路 1518 弄',
        phoneNumber: '12312132132',
        getApproach: 'aa',
        clientSideType: 'bb',
        time: '2016-05-03'
      }, {
        id: '2016-05-03',
        name: '王小虎',
        search: '上海市普陀区金沙江路 1518 弄',
        phoneNumber: '12312132132',
        getApproach: 'aa',
        clientSideType: 'bb',
        time: '2016-05-03'
      }, {
        id: '2016-05-03',
        name: '王小虎',
        search: '上海市普陀区金沙江路 1518 弄',
        phoneNumber: '12312132132',
        getApproach: 'aa',
        clientSideType: 'bb',
        time: '2016-05-03'
      }, {
        id: '2016-05-03',
        name: '王小虎',
        search: '上海市普陀区金沙江路 1518 弄',
        phoneNumber: '12312132132',
        getApproach: 'aa',
        clientSideType: 'bb',
        time: '2016-05-03'
      }, {
        id: '2016-05-03',
        name: '王小虎',
        search: '上海市普陀区金沙江路 1518 弄',
        phoneNumber: '12312132132',
        getApproach: 'aa',
        clientSideType: 'bb',
        time: '2016-05-03'
      }, {
        id: '2016-05-03',
        name: '王小虎',
        search: '上海市普陀区金沙江路 1518 弄',
        phoneNumber: '12312132132',
        getApproach: 'aa',
        clientSideType: 'bb',
        time: '2016-05-03'
      }, {
        id: '2016-05-03',
        name: '王小虎',
        search: '上海市普陀区金沙江路 1518 弄',
        phoneNumber: '12312132132',
        getApproach: 'aa',
        clientSideType: 'bb',
        time: '2016-05-03'
      }, {
        id: '2016-05-03',
        name: '王小虎',
        search: '上海市普陀区金沙江路 1518 弄',
        phoneNumber: '12312132132',
        getApproach: 'aa',
        clientSideType: 'bb',
        time: '2016-05-03'
      }, {
        id: '2016-05-03',
        name: '王小虎',
        search: '上海市普陀区金沙江路 1518 弄',
        phoneNumber: '12312132132',
        getApproach: 'aa',
        clientSideType: 'bb',
        time: '2016-05-03'
      }, {
        id: '2016-05-03',
        name: '王小虎',
        search: '上海市普陀区金沙江路 1518 弄',
        phoneNumber: '12312132132',
        getApproach: 'aa',
        clientSideType: 'bb',
        time: '2016-05-03'
      }
      ], // 表格数据数组
      multipleSelection: [], // 选中数据数组
      currentPage: 1, // 当前页码
      total: 100, // 总数据条数
      pageSize: 200, // 一页多少条数据
      dialogVisible: false, // 文件拖拽的弹出层是否显示
      enterBol: true, // 显示释放鼠标还是 点击上传文字
      file: '', // 要上传的文件
      fileName: '', // 要上传文件的名字
      fileBol: true, // 显示文件图片 和文件名
      buttonText: '确定', // 按钮文字
      buttonBol: true, // 按钮是否可点击
      dialogVisible2: false, // 上传进度弹出层是否显示
      dialogVisible3: false, //  上传错误原因
      dialogVisible4: false, // 上传成功弹出层是否显示
      dialogVisible5: false, // 上传失败条数弹出层是否显示
      width: 0, // 进度条长度
      succeedNumber: 10, // 上传成功条数
      errorNumber: 0, // 上传失败条数
      source: null // 取消上传
    }
  },
  methods: {
    handleSelectionChange (val) {
      // 当选择项发生变化时会触发该事件
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      // 点击改变每页 多少条数据时触发
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      // 页码改变时触发
      console.log(`当前页: ${val}`)
    },
    toLead () {
      // 点击导入资源按钮 弹出文件拖拽
      this.dialogVisible = true
    },
    shut () {
      // 关闭文件拖拽弹出层
      this.dialogVisible = false
      this.fileShut()
    },
    toUpload () {
      // 开始上传文件
      var _this = this
      let cancelToken = axios.CancelToken // Axios使我修改axios原型链了。
      _this.source = cancelToken.source()
      this.shut()
      this.dialogVisible2 = true
      var formData = new window.FormData() // vue 中使用 window.FormData(),否则会报 'FormData isn't definded'
      formData.append('file', this.file) // 'userfile' 这个名字要和后台获取文件的名字一样;
      formData.onabort = this.cancelUpload
      axios({
        url: 'http://106.14.116.198:9003/api/fileUpload',
        method: 'post',
        cancelToken: _this.source.token, // 取消事件
        onUploadProgress: function (progressEvent) { // 原生获取上传进度的事件
          if (progressEvent.lengthComputable) {
            // 属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
            // 如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
            var item = Math.round((progressEvent.loaded) * 100 / progressEvent.total)
            _this.width = item
            console.log(_this.width)
          }
        },
        data: formData
      }).then(res => {
        _this.dialogVisible2 = false
        // 如果上传成功返回全部数据成功
        // _this.errorNumber  _this.succeedNumber接收接口返回的数据
        if (_this.errorNumber === 0) {
          _this.dialogVisible4 = true
        } else {
          _this.dialogVisible5 = true
        }
      })
        .catch(function (error) {
          if (axios.isCancel(error)) { // 主要是这里
            // util.notification('success', '成功', '取消上传镜像操作成功')
            _this.dialogVisible2 = false
            console.log('成功')
          }
        })
    },
    cancel () {
      let that = this
      if (that.source) { // 我先判断soucre是否存在，因为如果我打开弹框不作任何操作，点击取消按钮没有这一层判断的话，that.source.cancel('取消上传');会报错。
        that.source.cancel('取消上传') // "取消上传"这几个字，会在上面catch（）的error中输出的，可以console看一下。
      }
    },
    dropFile (e) {
      // 文件被拖拽放到拖拽区域后获取文件
      var oFile = e.dataTransfer.files[0]
      this.fileBol = false
      this.fileName = oFile.name
      this.file = oFile
      this.buttonText = '开始上传'
      this.buttonBol = false
      return false
    },
    dragenter (e) {
      // 当被鼠标拖动的对象进入其容器范围内时触发此事件
      this.enterBol = false
    },
    dragleave (e) {
      //  当被鼠标拖动的对象离开其容器范围内时触发此事件
      this.enterBol = true
    },
    dragover () {
      // 当某被拖动的对象在另一对象容器范围内拖动时触发此事件
      return false
    },
    fileShut () {
      // 点击文件名 后面的 取消图标 去除当前显示文件重新选取文件
      this.fileBol = true
      this.enterBol = true
      this.buttonText = '确定'
      this.buttonBol = true
    },
    inputFile (e) {
      // 点击文字按钮选着获取文件
      var oFile = e.target.files[0]
      this.fileBol = false
      this.fileName = oFile.name
      this.file = oFile
      this.buttonText = '开始上传'
      this.buttonBol = false
    },
    shutProgress () {
      // 关闭上传进度弹出层
      this.dialogVisible2 = false
    },
    cancelUpload () {
      // 取消上传
      // alert('上传成功！')
      console.log('aaaa') // 用作取消上传功能
    },
    shutError () {
      // 关闭失败原因弹出层
      this.dialogVisible3 = false
    },
    shutSucceed () {
      // 关闭成功弹出层
      this.dialogVisible4 = false
    },
    historyButton () {
      // 查看历史记录
      this.dialogVisible4 = false
      alert('查看历史记录')
      // this.dialogVisible3 = false
    },
    shutErrorAmount () {
      // 关闭失败条数弹出层
      this.dialogVisible5 = false
    },
    errorAmountButton () {
      // 查看失败原因
      this.dialogVisible5 = false
      this.dialogVisible3 = true
    }
  }
}
</script>
<style>
  .el-dialog__body,.el-dialog__header{
    padding: 0;
  }
  .el-dialog__headerbtn .el-dialog__close{
    display: none;
  }
  .dialogBox{
    height: 331px;
    border-radius: 100px;
    position: relative;
  }
  .dialogTitle{
    height: 56px;
    background-color: #eee;
    line-height: 56px;
    font-size: 16px;
    color: #333333;
    padding: 0 25px;
    position: relative;
  }
  .shut{
    position: absolute;
    right: 20px;
  }
  .fileBox{
    width: 376px;
    height: 173px;
    border-radius: 10px;
    border: 1px dashed #EEEEEE;
    margin: 18px auto;
  }
  .wenjianImg{
    position: absolute;
    font-size: 32px;
    color:#1E8EF2;
    top: 50px;
    left: 171px;
  }
  .fileName{
    text-align: center;
    font-size: 16px;
    color: #333333;
    position: absolute;
    top: 103px;
    width: 100%;
  }
  .guanbi{
    position: relative;
    top: -10px;
    left: 10px;
    font-size: 20px;
  }
  .fileType{
    width: 60px;
    display: inline-block;
    overflow: hidden;
    position: absolute;
    top: 8px;
    left: 247px;
  }
  .fontUploading{
    font-size: 16px;
    text-align: center;
    margin-top: 105px;
    color: #999999;
  }
  .affirm{
    text-align: center;
    margin-top: 28px;
  }
  .resourceBox{
    background: #fff;
    height: 100%;
    position: relative;
  }
  .top{
    width: 100%;
    height: 392px;
    position: absolute;
    top: 0;
  }
  .bottom{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding-top: 392px !important;
  }
  .seekBox{
    height: 276px;
    padding-top: 80px;
  }
  .seeka{
    width: 674px;
    margin: 0 auto;
  }
.inputSeek{
  width: 578px;
  height: 46px;
  outline: none;
  padding: 0;
  padding-left: 22px;
  -webkit-appearance: none;
  border-radius: 4px 0 0 4px;
  border: 2px solid #7D7D7D;
  border-right: 0px solid rgba(0,0,0,0) ;
  font-size: 16px;
}
  .inputSeek::-webkit-input-placeholder {
    /* placeholder颜色  */
    color: #999999;
    /* placeholder字体大小  */
    font-size: 16px;
  }
  .spanSeek{
    background: #F79A30;
    width:70px ;
    height: 50px;
    line-height: 48px;
    text-align: center;
    font-size:16px ;
    color: #fff;
    display: inline-block;
    border-radius: 0 4px 4px 0;
  }
  .filtrateBox,.tabeBox{
    padding-top: 26px;
    font-size: 14px;
    color:#999999;
  }
  .filtrateBox .el-button{
    font-size: 12px;
    margin-left: 0px;
    padding: 7px 10px;
  }
  .time{
    width: 200px;
  }
  .cutOff{
   height: 12px;
    background-color: #F0F2F5;
  }
  .tabe{
    border: 1px solid #E5E5E5;
    padding-bottom: 28px;
    border-radius:5px;
    box-shadow:0px 2px 10px 0px #E5E5E5 ;
  }
  .tabeBoxA{
    height: 100%;
    overflow: auto;
    padding: 0px 30px 20px 30px;
  }
  .tabeBoxB{
    padding: 26px 30px;
  }
  .el-checkbox{
    margin-right: 20px;
  }
  .wire{
    background: #313131;
    margin: 24px 0;
    height: 1px;
    opacity: 0.5;
    margin-right: 96px;
  }
  .el-table__body td,.el-table th{
    text-align: center;
  }
  .el-table thead tr th{
    height:56px ;
    background: #333C48;
    color: #fff;
  }
  .el-table thead tr th:nth-of-type(1){
    border-radius: 5px 0 0 0;
  }
  .el-table thead tr th:nth-of-type(8){
    border-radius: 0 5px 0 0;
  }
  .foot,.paging{
    text-align: center;
    margin-top: 28px;
  }
  .wu{
    text-align: center;
    padding: 100px 0 50px 0 ;
    background: #fff;
    z-index: 2;
    position: relative;
    top: -60px;
  }
  .wu .el-row{
   margin-top: 20px;
  }
  .progressBox{
    border: 0px;
  }
  .shuaxin{
    font-size: 18px;
    color: #26CF82;
    vertical-align: top;
    line-height: 18px;
    margin: 2px 5px;
  }
  .progressBox span{
    font-size: 16px;
    color: #333333;
    line-height: 18px;
  }
  .progressText{
    position: absolute;
    top: 60px;
  }
  .barBox{
    position: absolute;
    top:88px ;
    height: 20px;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    background-color: #D7D7D9;
  }
  .barBox p {
    background: #26CF82;
    height: 20px;
    margin: 0;
  }
  .progressBox span {
   position: absolute;
    top:70px;
  }
  .cuowu{
    font-size: 56px;
    color: #FF142C;
  }
  .chenggong{
    font-size: 68px;
    color: #26CF82;
  }
  .errorAmount{
    font-size: 56px;
    color: #FF142C;
  }
  .error{
    background: #F8A1A5;
    color: #FF142C;
  }
  .errorImg{
    position: absolute;
    text-align: center;
    width: 100%;
    top: 112px;
  }
  .errorText{
    position: absolute;
    text-align: center;
    font-size: 16px;
    width: 100%;
    top: 194px;
    color: #333333;
  }
  .errorButton,.succeedButton{
    position: absolute;
    text-align: center;
    width: 100%;
    top: 267px;
  }
  .ziyuanImg{
    font-size: 13px;
  }
</style>
<style deep>
  .el-dialog {
    margin-top: 30vh !important;
    border-radius: 10px !important;
    overflow: hidden !important;
  }
  .fontUploading .el-button--text{
    font-size: 16px !important;
  }
  .progress .el-button--primary{
    background: #EEEEEE !important;
    border-color: #EEEEEE !important;
    color: #333 !important;
    width: 234px !important;
  }
  .errorButton .el-button{
    background-color: #626262 !important;
    color: #fff !important;
    border-color:#626262 !important;
  }
  .historyButton{
    background-color: #26CF82 !important;
    color: #fff !important;
    border-color:#26CF82 !important;
  }
  .errorAmountButton{
    background-color: #FF0000 !important;
    color: #fff !important;
    border-color:#FF0000 !important;
  }
</style>
