<template>
  <div class="ae">
    <el-row :gutter="20">
      <el-col :span="6"><div class="grid-content bg-purple ae-left">
        <!-- 标题 -->
        <el-row>
            <el-col :span="24"><div class="grid-content bg-purple-dark  ae-left-title">
              <span>AE列表</span>
              </div></el-col>
        </el-row>
        <!-- table表格 -->
        <el-row>
          <el-col :span="24"><div class="grid-content bg-purple-dark ae-left-content">
                <el-table
                   stripe
                  :data="AetableData"
                  style="width: 100%">
                  <el-table-column
                    prop="ID"
                    label="ID"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="创建日期"
                   >
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="报告类型">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="报告">
                  </el-table-column>
               </el-table>
            </div></el-col>
        </el-row>
        <!-- 确定按钮 -->
        <el-row>
          <el-col :span="24"><div class="grid-content bg-purple-dark">
             <el-button type="primary">新建 AE</el-button>
          </div></el-col>
        </el-row>
        </div></el-col>
      <el-col :span="18"><div class="grid-content bg-purple">
       <el-form ref="form" :model="reportform"  :label-position="labelPosition"  >
         <!-- 1报告类型 -->
         <el-row class="Ae1">
            <el-col :span="24" class=""><div class="grid-content bg-purple-dark">
              <!-- <p>1. 报告类型</p> -->
              <p class="bgee pt5 pb5 pl15 fw">1. 报告类型</p>
              </div></el-col>
         </el-row>
         <el-row class="Ae1-1">
            <el-col :span="8"><div class="grid-content bg-purple ff ">
               <el-form-item label="首次/跟踪 :">
                <el-select v-model="reportform.FristReport" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              </div></el-col>
            <el-col :span="8"><div class="grid-content bg-purple-light ff">
                 <el-form-item label="报告类型 :">
                    <el-select v-model="reportform.Reporttype" placeholder="请选择活动区域">
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
              </div></el-col>
            <el-col :span="8"><div class="grid-content bg-purple ff">
                 <el-form-item label="报告单位类别 :">
                    <el-select v-model="reportform.Reportlevel" placeholder="请选择活动区域">
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
              </div></el-col>
         </el-row>
         <!-- 2患者信息 -->
         <el-row class="Ae2">
          <el-col :span="24"><div class="grid-content bg-purple-dark Ae2-1 ">
            <!-- <p>2. 患者详情</p> -->
            <p class="bgee pt5 pb5 pl15 fw">2. 患者详情</p>
            </div></el-col>
         </el-row>
         <el-row :gutter="20" class="Ae2-2">
            <el-col :span="5" class="fe"><div class="grid-content bg-purple ff"> <el-form-item label="患者姓名:">
                  <el-input v-model="reportform.name"></el-input>
                </el-form-item></div></el-col>
            <el-col :span="5"><div class="grid-content bg-purple ff"> <el-form-item label="联系方式:">
                  <el-input v-model="reportform.phone"></el-input>
                </el-form-item></div></el-col>
                  <el-col :span="5"><div class="grid-content bg-purple ff"> <el-form-item label="民族:">
                  <el-input v-model="reportform.Nationality"></el-input>
            </el-form-item></div></el-col>
            <el-col :span="8"><div class="grid-content bg-purple sele ff">  <el-form-item label="性别:">
                <el-select v-model="reportform.redio" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item></div></el-col>
          
         </el-row>
         <el-row :gutter="20" class="Ae2-3">
            <el-col :span="5" class="fe"><div class="grid-content bg-purple ff">
                   <el-form-item label="出身日期:">
                      <el-input v-model="reportform.BornData"></el-input>
                   </el-form-item>
              </div></el-col>
            <el-col :span="5"><div class="grid-content bg-purple ff">
                   <el-form-item label="身高cm :">
                      <el-input v-model="reportform.name"></el-input>
                   </el-form-item>
              </div></el-col>
            <el-col :span="5"><div class="grid-content bg-purple ff">
                 <el-form-item label="体重kg :">
                      <el-input v-model="reportform.name"></el-input>
                 </el-form-item>
              </div></el-col>
         </el-row>
         <el-row :gutter="20" class="Ae2-3">
            <el-col :span="5" class="fe"><div class="grid-content bg-purple ff">
                   <el-form-item label="原患疾病:">
                      <el-input v-model="reportform.oldPent"></el-input>
                   </el-form-item>
              </div></el-col>
            <el-col :span="5"><div class="grid-content bg-purple ff">
                   <el-form-item label="医院名称:">
                      <el-input v-model="reportform.hospital"></el-input>
                   </el-form-item>
              </div></el-col>
            <el-col :span="7"><div class="grid-content bg-purple ff">
                 <el-form-item label="病历号/门诊号:">
                      <el-input v-model="reportform.Medicalrecordnumber"></el-input>
                 </el-form-item>
              </div></el-col>
         </el-row>
         <el-row :gutter="20" class="Ae2-3">
            <el-col :span="10" class="fe"><div class="grid-content bg-purple ff">
                   <el-form-item label="既往药品不良反应/事件:">
                      <el-select v-model="reportform.reactionNo" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                      </el-select>
                   </el-form-item>
              </div></el-col>
            <el-col :span="10"><div class="grid-content bg-purple ff">
                   <el-form-item label="家族药品不良反应/事件:">
                      <el-select v-model="reportform.Familyreaction" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                      </el-select>
                    </el-form-item>
              </div></el-col>
         </el-row>
         <el-row class="Ae2-3">
            <el-col :span="16" class="ff"><div class="grid-content bg-purple-dark">
                <el-form-item label="相关重要信息:">
                  <el-checkbox-group v-model="reportform.type">
                    <el-checkbox label="吸烟史" name="type"></el-checkbox>
                    <el-checkbox label="饮酒史" name="type"></el-checkbox>
                    <el-checkbox label="妊娠期" name="type"></el-checkbox>
                    <el-checkbox label="肾病史" name="type"></el-checkbox>
                    <el-checkbox label="过敏史" name="type"></el-checkbox>
                    <el-checkbox label="其他" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div></el-col>
               <el-col :span="8"><div class="grid-content bg-purple-dark ff">
                    <el-form-item label="请说明:">
                      <el-input v-model="reportform.typeOther"></el-input>
                    </el-form-item>
                 </div></el-col>
         </el-row>
         <!-- 3怀疑药品 -->
         <div class="overH">
            <el-row>
              <el-col :span="24">
                <p class="bgee pt5 pb5 pl15 fw">3、怀疑药物如果已知，请列出商品名</p>
              </el-col>
            </el-row>
            <el-table :data="reportform.suspectedDrugAeYoumilinList"  style="width: 100%" class="dataTime" @row-click="suspectRow" size="mini" :highlight-current-row="true">
              <el-table-column label="药品名" align="left" >
                <template slot-scope="scope">
                  <el-input v-if="goodsEdit  && scope.$index == (reportform.suspectedDrugAeYoumilinList.length-1) " v-model="scope.row.suspectedDrug"  class="w10p" size="mini"></el-input>
                  <span v-else>{{ scope.row.suspectedDrug }}</span>
                </template>
              </el-table-column>
              <el-table-column label="批号" align="left" >
                <template slot-scope="scope">
                  <el-input v-if="goodsEdit && scope.$index == (reportform.suspectedDrugAeYoumilinList.length-1)" v-model="scope.row.batchNumber"  class="w10p" size="mini"></el-input>
                  <span v-else>{{ scope.row.batchNumber }}</span>
                </template>
              </el-table-column>
              <el-table-column label="适应症" align="left" >
                <template slot-scope="scope">
                  <el-input v-if="goodsEdit && scope.$index == (reportform.suspectedDrugAeYoumilinList.length-1)" v-model="scope.row.indication"  class="w10p" size="mini"></el-input>
                  <span v-else>{{ scope.row.indication }}</span>
                </template>
              </el-table-column>
              <el-table-column label="剂量、单位和频率" align="left" >
                <template slot-scope="scope">
                  <el-input v-if="goodsEdit && scope.$index == (reportform.suspectedDrugAeYoumilinList.length-1)" v-model="scope.row.unit"  class="w10p" size="mini"></el-input>
                  <span v-else>{{ scope.row.unit }}</span>
                </template>
              </el-table-column>
              <el-table-column label="给药途径" align="left">
                <template slot-scope="scope">
                  <el-input v-if="goodsEdit && scope.$index == (reportform.suspectedDrugAeYoumilinList.length-1)" v-model="scope.row.routeOfAdministration"  class="w10p" size="mini"></el-input>
                  <span v-else>{{ scope.row.routeOfAdministration }}</span>
                </template>
              </el-table-column>
              <el-table-column label="开始日期" align="left">
                <template slot-scope="scope">
                  <el-date-picker v-if="goodsEdit && scope.$index == (reportform.suspectedDrugAeYoumilinList.length-1)"  v-model="scope.row.startDate" type="date" class="w150" placeholder="" size="mini"></el-date-picker>
                  <span v-else>{{ scope.row.startDate | formatTimemin }}</span>
                </template>
              </el-table-column>
              <el-table-column label="结束日期" align="left">
                <template slot-scope="scope">
                  <el-date-picker v-if="goodsEdit && scope.$index == (reportform.suspectedDrugAeYoumilinList.length-1)"  v-model="scope.row.endDate" size="mini" class="w150" type="date" placeholder=""></el-date-picker>
                  <span v-else>{{ scope.row.endDate | formatTimemin }}</span>
                </template>
              </el-table-column>
              <el-table-column label="对怀疑药物所采取的措施" align="left">
                <template slot-scope="scope">
                  <el-input v-if="goodsEdit && scope.$index == (reportform.suspectedDrugAeYoumilinList.length-1)" v-model="scope.row.gmeasures" size="mini"  class="w10p"></el-input>
                  <span v-else>{{ scope.row.measures }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-row class="mt15 ccmt15">
              <el-col :span="3"><el-button type="primary" icon="el-icon-plus" size="mini" @click.stop="goodsHandle(1)">添加一行</el-button></el-col>
              <el-col :span="3"><el-button type="primary" icon="el-icon-delete" size="mini" @click.stop="goodsHandle(2)">删除选中的行</el-button></el-col>
              <el-col :span="2"><el-button type="primary" icon="el-icon-edit" size="mini" @click.stop="goodsHandle(3)">确认编辑</el-button></el-col>
            </el-row>
         </div>
        <!-- 4不良事件描述 -->
        <el-row class="mt20">
            <el-col :span="24">
              <p class="bgee pt5 pb5 pl15 fw">4、不良事件描述（不良事件的诊断 如果诊断未知，请列出症状）</p>
            </el-col>
        </el-row>
        <el-table :data="reportform.describeAeBaimidaList"  style="width: 100%" size="mini" class="dataTime" :highlight-current-row="true" @row-click="eventRow">
          <el-table-column label="不良事件描述" align="center" >
            <template slot-scope="scope">
              <el-input v-if="eventEdit && scope.$index == (reportform.describeAeBaimidaList.length-1)" v-model="scope.row.description" size="mini"  class="w10p"></el-input>
              <span v-else>{{ scope.row.description }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开始日期" align="left" >
            <template slot-scope="scope">
              <el-date-picker v-if="eventEdit && scope.$index == (reportform.describeAeBaimidaList.length-1)"  v-model="scope.row.startDate" type="date" class="w150" placeholder="" size="mini"></el-date-picker>
              <span v-else>{{ scope.row.startDate | formatTimemin }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束日期或持续时间" align="center" >
            <template slot-scope="scope">
              <el-date-picker v-if="eventEdit && scope.$index == (reportform.describeAeBaimidaList.length-1)"  v-model="scope.row.endtDate" type="date" class="w150" placeholder="" size="mini"></el-date-picker>
              <span v-else>{{ scope.row.endtDate | formatTimemin }}</span>
            </template>
          </el-table-column>
          <el-table-column label="强度" align="center" >
            <template slot-scope="scope">
              <el-input v-if="eventEdit && scope.$index == (reportform.describeAeBaimidaList.length-1)" v-model="scope.row.strength" size="mini"  class="w10p"></el-input>
              <span v-else>{{ scope.row.strength }}</span>
            </template>
          </el-table-column>
          <el-table-column label="*结果" align="center">
            <template slot-scope="scope">
              <el-input v-if="eventEdit && scope.$index == (reportform.describeAeBaimidaList.length-1)" v-model="scope.row.result" size="mini"  class="w10p"></el-input>
              <span v-else>{{ scope.row.result }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="mt15">
          <el-col :span="10" class="ccmet10">
            <el-form-item label="停药或减少药量后不良事件是否好转？" label-width="260px">
              <el-select v-model="reportform.improve" class="w150 fl" placeholder="">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="2"></el-option>
                <el-option label="不适用" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="重新用药以后不良事件是否再次出现？" label-width="260px">
              <el-select v-model="reportform.again" class="w150 fl" placeholder="">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="2"></el-option>
                <el-option label="不适用" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mt15">
          <el-col :span="4">
            <el-form-item label="*结果:" label-width="100px">
              <el-input v-model="reportform.result" class="w70"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <p class="lh30">1 = 恢复/治愈 | 2 = 恢复中/好转中 | 3 = 没有恢复/没有治愈4 = 恢复/治愈，具有后遗症 | 5 = 死亡 | 6 = 未知</p>
          </el-col>
        </el-row>
        <el-row class="mt15 ccmt15">
            <el-col :span="3"><el-button type="primary" icon="el-icon-plus" size="mini" @click.stop="eventHandle(1)">添加一行</el-button></el-col>
            <el-col :span="3"><el-button type="primary" icon="el-icon-delete" size="mini" @click.stop="eventHandle(2)">删除选中的行</el-button></el-col>
            <el-col :span="2"><el-button type="primary" icon="el-icon-edit" size="mini" @click.stop="eventHandle(3)">确认编辑</el-button></el-col>
        </el-row>
        <!-- 5影响性 -->
        <el-row class="mt20">
            <el-col :span="24">
              <p class="bgee pt5 pb5 pl15 fw">5. 影响性</p>
            </el-col>
        </el-row>
        <el-row class="Ae2-3">
            <el-col :span="24" class="ff"><div class="grid-content bg-purple-dark Ae2fe">
                <el-form-item label="对原疾病的影响:">
                  <el-checkbox-group v-model="reportform.influences">
                    <el-checkbox label="不明显" name="type"></el-checkbox>
                    <el-checkbox label="病程延长" name="type"></el-checkbox>
                    <el-checkbox label="病情加重" name="type"></el-checkbox>
                    <el-checkbox label="导致后遗症""" name="type"></el-checkbox>
                    <el-checkbox label="导致死亡" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div></el-col>
        </el-row>
        <!-- 6关联性评价 -->
        <el-row class="mt20">
            <el-col :span="24">
              <p class="bgee pt5 pb5 pl15 fw">6. 报告者信息</p>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="Ae1-1 ">
            <el-col :span="5" class="fe"><div class="grid-content bg-purple ff">
                   <el-form-item label="报告者姓名 :">
                      <el-input v-model="reportform.reportName"></el-input>
                   </el-form-item>
              </div></el-col>
            <el-col :span="5"><div class="grid-content bg-purple ff">
                   <el-form-item label="联系方式:">
                      <el-input v-model="reportform.reportPhone"></el-input>
                   </el-form-item>
              </div></el-col>
            <el-col :span="5"><div class="grid-content bg-purple ff">
                <el-form-item label="职业 :">
                    <el-input v-model="reportform.reportJobe"></el-input>
                </el-form-item>
            </div></el-col>
            <el-col :span="5"><div class="grid-content bg-purple ff">
                <el-form-item label="邮编 :">
                    <el-input v-model="reportform.reportEmail"></el-input>
                </el-form-item>
            </div></el-col>
        </el-row>
        <el-row :gutter="20" class="Ae2-3">
            <el-col :span="5" class="fe"><div class="grid-content bg-purple ff">
                   <el-form-item label="报告单位名称">
                      <el-input v-model="reportform.reportNuit"></el-input>
                   </el-form-item>
              </div></el-col>
            <el-col :span="5"><div class="grid-content bg-purple ff">
                   <el-form-item label="联系人 :">
                      <el-input v-model="reportform.unitPeople"></el-input>
                   </el-form-item>
              </div></el-col>
            <el-col :span="5"><div class="grid-content bg-purple ff">
                 <el-form-item label="电话 :">
                      <el-input v-model="reportform.unitPhone"></el-input>
                 </el-form-item>
              </div></el-col>
            <el-col :span="5"><div class="grid-content bg-purple ff">
                <el-form-item label="报告日期:">
                    <el-input v-model="reportform.unitReportData"></el-input>
                </el-form-item>
            </div></el-col>
        </el-row>
        <el-row class="Ae2-3">
            <el-col :span="17" class="ff"><div class="grid-content bg-purple-dark">
                <el-form-item label="生产信息来源:">
                  <el-checkbox-group v-model="reportform.omsgfromList">
                    <el-checkbox label="医疗机构" name="type"></el-checkbox>
                    <el-checkbox label="经营企业" name="type"></el-checkbox>
                    <el-checkbox label="个人" name="type"></el-checkbox>
                    <el-checkbox label="文献报道" name="type"></el-checkbox>
                    <el-checkbox label="上市后研究" name="type"></el-checkbox>
                    <el-checkbox label="其他" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div></el-col>
               <el-col :span="6"><div class="grid-content bg-purple-dark ff">
                    <el-form-item label="请说明:">
                      <el-input v-model="reportform.magFromqita"></el-input>
                    </el-form-item>
                 </div></el-col>
        </el-row>
        <!-- 7 关联性评价-->
        <el-row class="mt20">
            <el-col :span="24">
              <p class="bgee pt5 pb5 pl15 fw">7. 关联性评价</p>
            </el-col>
        </el-row>
        <el-row class="Ae2-3 dd23">
          <el-col :span="24" class="ff"><div class="grid-content bg-purple-dark df11">
              <el-form-item label="报告人评估:" >
                <el-radio-group v-model="reportform.Evaluation">
                  <el-radio :label="1">肯定</el-radio>
                  <el-radio :label="2">很可能</el-radio>
                  <el-radio :label="3">可能</el-radio>
                  <el-radio :label="4">可能无关</el-radio>
                  <el-radio :label="5">待评价</el-radio>
                  <el-radio :label="6">无法评价</el-radio>
                </el-radio-group>
              </el-form-item>
          </div></el-col>
        </el-row>
        <el-row class="Ae2-3">
          <el-col :span="24" class="ff"><div class="grid-content bg-purple-dark">  
             <el-form-item label="报告单位评价:">
                <el-radio-group v-model="reportform.EvaluationUnit">
                  <el-radio :label="1">肯定</el-radio>
                  <el-radio :label="2">很可能</el-radio>
                  <el-radio :label="3">可能</el-radio>
                  <el-radio :label="4">可能无关</el-radio>
                  <el-radio :label="5">待评价</el-radio>
                  <el-radio :label="6">无法评价</el-radio>
                </el-radio-group>
              </el-form-item>
          </div></el-col>
        </el-row>
        <el-row :gutter="20" class="Ae2f">
          <el-col :span="3"><div class="grid-content bg-purple">  <el-button type="primary">提交报告</el-button></div></el-col>
          <el-col :span="3"><div class="grid-content bg-purple"></div> <el-button type="success">审核通过</el-button></el-col>
          <el-col :span="2"><div class="grid-content bg-purple"> <el-button type="warning">驳回</el-button> </div></el-col>
          <el-col :span="3"><div class="grid-content bg-purple"> <el-button type="primary">发送邮件</el-button></div></el-col>
          <el-col :span="2"><div class="grid-content bg-purple"><el-button type="info" plain>取消</el-button></div></el-col>
        </el-row>
      </el-form>        
     </div></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['patientCode', 'aeId','mobile','name'],
  data() {
    return {
      labelPosition: 'right',
       AetableData: [{
            ID: '2016-05-02',
            name: '王小虎',
            address: '上海1518 弄',
            address: '上海1518 弄'
          },{
            ID: '2016-05-02',
            name: '王小虎',
            address: '上海1518 弄',
            address: '上海1518 弄'
          },{
            ID: '2016-05-02',
            name: '王小虎',
            address: '上海1518 弄',
            address: '上海1518 弄'
          },{
            ID: '2016-05-02',
            name: '王小虎',
            address: '上海1518 弄',
            address: '上海1518 弄'
          }],
       reportform: {
          name: '',
          FristReport: '', // 是否首次报告
          Reporttype: '', // 报告类型
          Reportlevel: '', // 报告级别
          name: '', // 姓名
          phone: '', // 电话
          redio: '', // 性别
          Nationality:  '', // 民主
          BornData: '',  // 出身日期
          oldPent: '', // 原患疾病
          hospital: '', // 医院名称
          Medicalrecordnumber:'', // 病历号
          Familyreaction:'', // 家族不良反应事件
          reactionNo: '', //不良反应事件
          type: [], // 相关重要信息
          typeOther: '', // 相关重要信息 其他
          suspectedDrugAeYoumilinList: [], // 怀疑产品
          describeAeBaimidaList: [], // 不良事件描述
          improve: '', // 用药以后是否有帮助
          again:'', // 是否又出现不良反应
          result:'', // 用药结果
          influences: [],// 对原疾病的影响
          reportName:'', // 报告人
          reportPhone:'', // 报给人电话
          reportJobe:'', // 报告人职业
          reportEmail:'', // 报告人邮编
          reportNuit:'' , // 报告单位名称
          unitPeople: '', // 报告联系人，
          unitPhone: '',// 报告单位电话
          unitReportData:'', // 报告日期
          omsgfromList: [], // 信息来源
          magFromqita: '', // 信息来源其他
          Evaluation: '', // 报告性评价
          EvaluationUnit: '', // 报告性单位评价
        },
        goodsEdit: false, // 新增药物
        eventSelect: '', // 不良事件选中 
        eventEdit: false, // 新增事件
    }
  },
  methods: {
     goodsHandle(type){ // 操作药物table
       console.log(this.goodsEdit)
      switch (type) {
        case 1: // 新增行
          let isEdit = false
          if(this.reportform.suspectedDrugAeYoumilinList.length > 0){
            let lastData = this.reportform.suspectedDrugAeYoumilinList[this.reportform.suspectedDrugAeYoumilinList.length - 1]
            Object.keys(lastData).forEach(function(key){
              if(lastData[key] != ''){
                isEdit = true
              }
            })
          }else{
            isEdit = true
          }
          if(isEdit){
            this.goodsEdit = true
            let newTable = {
              "suspectedDrug":"",
              "batchNumber":"",//批号
              "unit":"", //剂量、单位和频率
              "routeOfAdministration":"",
              "startDate":"",
              "endDate":"",
              "measures":"" //对怀疑药物所采取的措施
            }
            this.$set(this.reportform.suspectedDrugAeYoumilinList, this.reportform.suspectedDrugAeYoumilinList.length, newTable)
          }else{
            this.$message({
              message: "请先编辑信息",
              type: "error",
              duration: 1500
            })
            return false
          }
          break;
        case 2: // 删除行
          if(this.reportform.suspectedDrugAeYoumilinList.length > 0){
            if(this.suspectSelect != ''){
              let arr = this.reportform.suspectedDrugAeYoumilinList.filter(item => {
                return JSON.stringify(item) != JSON.stringify(this.suspectSelect) 
              })
              this.reportform.suspectedDrugAeYoumilinList = [...arr]
              console.log(this.reportform.suspectedDrugAeYoumilinList)
            }else{
              this.$message({
                message: "请先选择",
                type: "error",
                duration: 1500
              })
            }
          }else{
            this.$message({
              message: "请先创建行",
              type: "error",
              duration: 1500
            })
            return false
          }        
          break;
        case 3: // 确认编辑
          this.goodsEdit = false
          console.log('确认编辑')
          console.log(this.reportform.suspectedDrugAeYoumilinList)
          break;
      }
     },
     suspectRow(row, column, event){ // 怀疑药物选中行
      this.suspectSelect = row
     },
     eventRow(row, column, event){ // 不良事件选中行
      console.log(row)
      this.eventSelect = row
     },
     eventHandle(type){ // 不良事件描述table
        switch (type) {
          case 1: // 新建行
            let isEdit = false
            console.log('添加一行')
            if(this.reportform.describeAeBaimidaList.length > 0){
              let lastData  = this.reportform.describeAeBaimidaList[this.reportform.describeAeBaimidaList.length - 1]
              Object.keys(lastData).forEach(function(key){
                if(lastData[key] != ''){
                  isEdit = true
                }
              })
            }else{
              isEdit = true
            }
            if(isEdit){
              this.eventEdit = true
              let newTable = {
                "description":"",
                "startDate":"",
                "endtDate":"",
                "strength":"",
                "result":""
              }
              this.$set(this.reportform.describeAeBaimidaList, this.reportform.describeAeBaimidaList.length, newTable)
            }else{
              this.$message({
                message: "请先编辑信息",
                type: "error",
                duration: 1500
              })
              return false
            }
            break;
          case 2: // 删除行
            if(this.reportform.describeAeBaimidaList.length > 0){
              if(this.eventSelect !== ''){
                let arr = this.reportform.describeAeBaimidaList.filter(item => {
                  return JSON.stringify(item) != JSON.stringify(this.eventSelect) 
                })
                this.reportform.describeAeBaimidaList = [...arr]
                console.log(this.reportform.describeAeBaimidaList)
              }else{
                this.$message({
                  message: "请先选择行",
                  type: "error",
                  duration: 1500
                })
              }
            }else{
              this.$message({
                message: "请先创建行",
                type: "error",
                duration: 1500
              })
              return false
            }
            console.log('删除选中的行')
            break;
          case 3: // 确认编辑
            this.eventEdit = false
            console.log('确认编辑')
            break;
        }
     },
  },
  mounted(){
  }
}
</script>

<style scoped>
/* 公共样式 */
.fe {
  padding-left: 0 !important;
}
.ae {
  background: #e5e5e5;
  padding: 20px 0 37px 0;
}
.ae-left {
  padding: 0;
}
.ae-left-title {
  padding-left: 22px;
  height: 48px;
  line-height: 48px;
  border-bottom: 1px solid #f2f2f2;
  background: #ffffff;
}
.ae-left-title span {
  font-size: 20px;
  font-weight: 800;
}
.ae-left-content {
  background: #ffffff;
  padding-left: 23px;
  margin-bottom: 22px;
}
.ae-left-content
  .el-table
  .ae-left-content
  .el-table
  .el-table__body-wrapper
  tr
  td {
  text-align: center;
}
/* Ae1 */
.Ae1 {
  background: #828282;
}
.Ae1 p {
  font-family: PingFang SC;
  /* font-size: 12px; */
}
.Ae1-1 {
  background: #ffffff;
  padding-left: 60px;
  height: 64px;
  padding-top: 15px;
}
.Ae2 {
  background: #828282;
}
.Ae2-1 {
  margin-top: -13px;
}
.Ae2 p {
  font-family: PingFang SC;
  font-size: 13px;
}
.Ae2-2 {
  background: #ffffff;
  padding-left: 60px;
  padding-top: 15px;
}
.ff .el-input {
  width: 50% !important;
}
.Ae2-3 {
  background: #ffffff;
  padding-left: 60px;
}
.ff {
  font-weight: 600;
}
.overH {
  background: #ffffff;
}
.ccmt15 {
  padding-left: 10px;
}
.mt15 {
  margin: 0;
  padding-top: 2px;
  box-sizing: border-box;
  background: #ffffff;
}
.mt20 {
  margin: 0;
  background: #ffffff;
}
.Ae2fe .el-form-item {
  margin-bottom: 0 !important;
}
.dd23 {
  padding-top: 10px;
}
.df11 .el-form-item {
  margin-bottom: 0 !important;
}
.df11 .el-form-item__label {
  width: 100px !important;
}
.Ae2f{
  background: #ffffff;
  padding-left: 50px;
}
</style>
