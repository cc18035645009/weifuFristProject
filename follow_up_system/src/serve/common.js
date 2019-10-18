import Vue from 'vue'
//正式
const api = 'https://suifang-api.microzan.com.cn/' //'https://suifang-api.microzan.com.cn/' 'http://192.168.137.1:8000/' 
const file = ''
const img = ''

// const api = 'https://suifang-api.beta.microzan.com.cn/' 
// const file = 'https://suifang-files.beta.microzan.com.cn'
// const img = 'https://suifang-images.beta.microzan.com.cn'

const rows = 10

//获取地址栏参数
const getQueryString = (name) => {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}
const change = (t) => {
    if (t < 10) {
        return "0" + t;
    } else {
        return t;
    }
}
const timestampToTime = (timestamp, ss) => {
    let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = change(date.getDate()) + '';
    let h = change(date.getHours()) + ':';
    let m = change(date.getMinutes());//+ ':'
    let s = change(date.getSeconds());
    if (ss) {
        return Y + M + D + ' ' + h + m;//+ s
    } else if (timestamp == null) {
        return " ";
    }
    return Y + M + D;
}

const timemin = (timestamp,ss) => {
    if (!timestamp) {return '';}
    let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear();
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let D = change(date.getDate());
    let h = change(date.getHours());
    let m = change(date.getMinutes()) ;
    let s = change(date.getSeconds());
    if(ss == 'YMDHMS'){
        return Y + '-' + M  + '-' + D  + ' ' + h + ':' + m + ':' + s;
    }else if(ss == 'YMDHM'){
        return Y + '-' + M  + '-' + D  + ' ' + h + ':' + m;
    }else if(ss == 'HM'){
        return  h + ':' + m;
    }
    return Y + '-' + M  + '-' + D;
}
const downExcel=(url='',data={},name='excel',method='POST')=>{ //导出
    let oReq = new XMLHttpRequest();        
        oReq.open(method, api+url+'?projectId='+data.projectId+'&sort='+data.sort, true);        
        oReq.responseType = "blob";       
         oReq.setRequestHeader("Content-Type","application/json");  
         oReq.withCredentials = true;      
         oReq.onload = function (oEvent) {            
          var content = oReq.response;            
          var elink = document.createElement('a');            
          elink.download = name+'.xls';    
          elink.style.display = 'none';               
           var blob = new Blob([content], { type: 'application/vnd.ms-excel'}) 
           elink.href = URL.createObjectURL(blob);            
           document.body.appendChild(elink);            
           elink.click();            
           document.body.removeChild(elink);        
    };       
          oReq.send(JSON.stringify({...data}));
  }

const testPhone = (phone = '')=>{
    const reg = /^1\d{10}$/
    return !reg.test(phone)
}

Vue.filter('formatTimemin', function (timestamp) { //时间分过滤器
    return timemin(timestamp,'YMD')
})
Vue.filter('formatPrice', function (val1 = '0', val2 = '') { //时间过滤器
    return timestampToTime(val1, val2)
})
Vue.filter('src', function (val1 = '0', val2 = '') { // 图片max过滤
    return img + val1
})
Vue.filter('srcMin', function (val1) { // 图片min过滤
    return imgMin + val1
})

const askType = ['价格','疗效','适应症','保存','购买渠道','血糖控制','并发症','妊娠糖尿病','型糖尿病','型糖尿病','患者支持项目','促销','PAP','注射笔使用','注射笔坏笔更换','注射笔的购买','针头','冰包','血糖仪','血糖试纸','询问优泌乐相关','非三生产品','专员来电','服务商变更','AE/PC部门来电','医保','合作','微信相关']
const callerType = ['','患者本人','家属','医生','专员']
const callType = ['','正常','转接','挂断','测试','错号','骚扰']
const followStatus = ['','待处理','处理中','完成','内部升级','外部升级',]
const classification = ['','百泌达短信','百达扬短信','优泌淋短信',]
const questType = ['','单选' ,'多选','填空','时间']
const proStatus = ['','运营中','停止运营','历史项目']
const overStandard = ['','不超标','超标']
const measuringPoint = ['凌晨' ,'早餐前','早餐后','午餐前','午餐后','晚餐前','晚餐后','睡前','随机']
const clockType = ['未打卡','打卡']
const giveType = ['','9赠3','18赠6']
const spec = ['','12.5mg','25mg']
const isFirst = ['','首次','二次']
const patientSource = ['','微信','电话','导入']
const patientStatus = [{label: "纯新发", value: 1},{label: "难以复发", value: 2},{label: "经治转诊", value: 3},{label: "竞品转化", value: 4}]
const diseaseStage = [{label: "诱导期", value: 1},{label: "巩固期", value: 2},{label: "维持期", value: 3}]
const diseaseType = [{label: "多发性骨髓瘤", value: 1},{label: "淋巴瘤", value:2},{label: "浆细胞瘤", value: 3},{label: "定粉样变性", value: 4}]
const status = [{name:'本人成功',id:1},{name:'家属成功',id:2},{name:'预约',id:3},{name:'拒访',id:4},{name:'已过世',id:5},{name:'无法接通',id:6},{name:'无人接听',id:7},{name:'错号',id:8},{name:'空号',id:9},{name:'本次无需随访',id:10},{name:'跳至下一阶段',id:11},]
const article = ['','产品主题','疾病主题']
const patientType = [{label: "所有", value: ""},{label: "活跃", value: 1},{label: "活跃-暂时失联", value: 2},{label: "非活跃", value: 3},{label: "非活跃-拒访", value: 4},
{label: "非活跃-错号", value: 5},{label: "非活跃-已过世", value: 6},{label: "非活跃-空号", value: 7},{label: "非活跃-停药", value: 9},{label: "非活跃-非患者", value: 10},
{label: "非活跃-休眠", value: 11}]
const workOrderType = ['','联系方式复核','赠药问题','脱失干预','潜在患者','投诉个案','媒体公关来电']
const priorityLevel = ['','p1','p2','p3','p4','p5']
export default {
    getQueryString,
    api,
    askType,
    timestampToTime,
    img,
    file,
    rows,
    timemin,
    callerType,
    followStatus,
    classification,
    questType,
    proStatus,
    testPhone,
    overStandard,
    measuringPoint,
    clockType,
    callType,
    status,
    giveType,
    spec,
    isFirst,
    article,
    patientStatus,
    diseaseStage,
    diseaseType,
    patientSource,
    patientType,
    downExcel,
    workOrderType,
    priorityLevel
}