import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
//超级管理员
import Staff from '../views/AdminSuper/StaffManage/Staff' // 员工管理
import Knowledge from '../views/AdminSuper/Knowledge/Knowledge' // 知识库
import PatientManage from '../views/AdminSuper/ProjectManage/ProjectManage' // 项目管理
import Login from '../views/Login/Login' // 登录页面
import QuestionnaireManage from '../views/AdminSuper/QuestionnaireManage/QuestionnaireManage' //问卷管理
import QuestionBank from '../views/AdminSuper/QuestionBank/QuestionBank' //问题库
import LoginList from '../views/AdminSuper/LoginList/LoginList' // 登录记录
import MailBox from '../views/AdminSuper/MailBox/MailBox' //邮箱管理
import DataExport from '../views/AdminSuper/DataExport/DataExport' //报表
//呼叫中心
import CallCenter from '../views/CallCenter/CallCenter' //呼叫中心
import ShortMessage from '../views/CallCenter/ShortMessage.vue'//呼叫中心-短信管理
import Email from '../views/CallCenter/Email.vue' //呼叫中心-邮件管理
//专员
import CheckPatient from '../views/Specialist/PatientManage/CheckPatient/CheckPatient' // 患者管理-查询患者 
import FollowTask from '../views/Specialist/FollowTask/FllowPatient/FollowPatient' // 随访任务
//AE报告
import PreviewAe from '../views/Specialist/PatientManage/PatientDetail/PreviewAe' // AE预览
import AeManage from '../views/Specialist/AeManage/AeManage' // Ae管理
//医院管理
import HosManage from '../views/Specialist/HosManage/HosManage.vue' //医院管理
//工单管理
import WorkOrder from '../views/Specialist/WorkOrder/WorkOrder.vue'
export default new Router({
  //mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/CheckPatient',
      name: 'CheckPatient',
      component:CheckPatient,
      meta: {
        title: '查询患者'
      }
    },
    {
      path: '/Staff',
      name: 'Staff',
      component:Staff,
      meta: {
        title: '员工管理'
      }
    },
    {
      path: '/Knowledge',
      name: 'Knowledge',
      component:Knowledge,
      meta: {
        title: '知识库'
      }
    },
    {
      path: '/PatientManage',
      name: 'PatientManage',
      component:PatientManage,
      meta: {
        title: '项目管理'
      }
    },
    {
      path: '/LoginList',
      name: 'LoginList',
      component: LoginList,
      meta: {
        title: '登录记录'
      }
    },
    {
      path: '/QuestionnaireManage',
      name: 'QuestionnaireManage',
      component: QuestionnaireManage,
      meta: {
        title: '问卷管理'
      }
    },
    {
      path: '/QuestionBank',
      name: 'QuestionBank',
      component: QuestionBank,
      meta: {
        title: '题库'
      }
    },
    {
      path: '/MailBox',
      name: 'MailBox',
      component: MailBox,
      meta: {
        title: '邮箱'
      }
    },
    {
      path: '/DataExport',
      name: 'DataExport',
      component: DataExport,
      meta: {
        title: '报表管理'
      }
    },
    {
      path: '/CallCenter',
      name: 'CallCenter',
      component: CallCenter,
      meta: {
        title: '呼叫中心'
      }
    },{
      path: '/ShortMessage',
      name: 'ShortMessage',
      component: ShortMessage,
      meta: {
        title: '短信管理'
      }
    },{
      path: '/Email',
      name: 'Email',
      component: Email,
      meta: {
        title: '邮件管理'
      }
    },{
      path: '/FollowTask',
      name: 'FollowTask',
      component: FollowTask,
      meta: {
        title: '随访任务'
      }
    },
    {
      path: '/PreviewAe',
      name: 'PreviewAe',
      component: PreviewAe,
      meta: {
        title: '预览AE'
      }
    },
    {
      path: '/AeManage',
      name: 'AeManage',
      component: AeManage,
      meta: {
        title: 'AE管理'
      }
    },
    {
      path: '/HosManage',
      name: 'HosManage',
      component: HosManage,
      meta: {
        title: '医院管理'
      }
    },
    {
      path: '/WorkOrder',
      name: 'WorkOrder',
      component: WorkOrder,
      meta: {
        title: '工单管理'
      }
    },
  ]
})