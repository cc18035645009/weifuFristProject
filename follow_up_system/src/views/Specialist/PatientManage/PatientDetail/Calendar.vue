<template>
  <div class='Calendar timePop bgf color3'>
    <div class='box1' :style="{ width:sysW*7+'px'}">
      <div class='dateBox fw'>{{ year }} - {{ month}} </div>
      <div v-for='(item,j) in weekArr' :key='j'>
        <div :style="{ width:sysW+'px' }" class='lh30 mb5 fw'>{{ item }}</div>
      </div>
      <div v-for='(item,i) in arr' :key='i'>
        <div :style='{ marginLeft:i == 0 ? sysW*marLet+"px":"" ,width: sysW +"px" }' :class="'clock'+item.status">
        {{ item.day }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name:'Calendar',
  props:['mobile'],
  data() {
    return {
      arr: [],
      sysW: null,
      weekArr: ['日', '一', '二', '三', '四', '五', '六'],
      year: null,
      month:null,
      marLet:0
    }
  },
  created() {   
  },
  methods: {
    getClock(year,month,mobile){
      let that = this
      this.$axios.get(`https://bird.ioliu.cn/v1/?url=http://bmstest.bnd.microzan.com.cn/test/clock/queryUserClockDate?year=${year}&month=${month}&mobile=${mobile}`)
        .then(res => {
          if(res.data.code == 200){
            this.init(res.data.data)
          }else{
            this.init()
            that.$toast(that,res.data.message)
          }	
        }, response => {
          console.log("error");
        });	 
    },
    init(data){
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      let months = date.getMonth() + 1;
      let now = date.getDate() ;//获取今日日期
      //最后一天是几号,有data取data，没有取当月最大天数
      let d = new Date(year, months, 0);
      let lastDay = data ? data.length : d.getDate() + 1;
      //获取现今年份
      this.year = year;
      //今天星期几
      let nowDay = new Date(year, month, now).getDay();
      //根据得到今月的最后一天日期遍历 得到所有日期
      for (let i = 1; i < lastDay ; i++) {
          let val =  data ? data[i].date : year + '-' + (months > 9 ? months : '0' + months) + '-' + (i > 9 ? i : '0' + i);
          this.arr.push({ day: i, date: val ,status:data[i].status});
      }
      this.sysW =  500 / 12,//更具屏幕宽度变化自动设置宽度
      this.marLet = nowDay
      //获取现今月份
      this.month = month > 9 ? month+1 : '0' + (month+1)
    }

  },
  mounted() {
    this.getClock('2019','8',this.mobile)
  },
  components: {

  }
}
</script>

<style scoped>
.timePop{
  width: 100%;
  z-index: 6;
  text-align: center;
}
.box1 .dateBox{
  width: 100%;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
}
.box1{
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
}
.box1>div{
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
}
.img{
  width:20px;height:20px;
}
.clock0{
  background:url('../../../../assets/images/no.png') no-repeat center center;
  background-size:50%;
}
.clock1{
 background:url('../../../../assets/images/dui.png') no-repeat center center;
 background-size:50%;
}
</style>
