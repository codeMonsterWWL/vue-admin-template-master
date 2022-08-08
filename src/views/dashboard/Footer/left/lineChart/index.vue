<template>
  <div >
    <div class="header">
      <span style="margin-right:15px">搜索用户数</span>
      <svg t="1659237200243" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2230" width="18" height="18"><path d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z" p-id="2231"></path></svg>
      </div>
    <div class="main">
      <span class="title">12343</span>
      <span class="content">17.1</span>
      <svg t="1659238756672" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7672" width="16" height="16"><path d="M703.280488 365.511671c-4.329609 10.697643-13.921058 17.040095-25.236777 17.040095L544.234145 382.551766 544.234145 835.109955c0 17.838274-14.398942 32.296567-32.232099 32.296567-17.838274 0-32.236192-14.458293-32.236192-32.296567L479.765855 382.551766l-134.206608 0c-11.314697 0-20.906146-6.342452-25.234731-17.040095-4.330632-10.69969-2.081405-22.148439 5.92085-30.334889l166.241208-170.104189c5.333472-5.459339 11.773138-8.1711 19.315928-8.1711 7.543813 0 13.982456 2.742461 19.316951 8.201799l166.241208 170.068374C705.358823 343.358115 707.610096 354.813005 703.280488 365.511671z" p-id="7673" fill="#d81e06"></path></svg>
      <svg t="1659238930431" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9051" width="16" height="16"><path d="M697.359638 689.069835l-166.241208 170.145122c-5.335519 5.459339-11.773138 8.191566-19.316951 8.191566-7.54279 0-13.982456-2.732228-19.315928-8.191566l-166.241208-170.145122c-8.002254-8.18645-10.251481-19.718087-5.92085-30.417777 4.329609-10.697643 13.921058-17.203824 25.234731-17.203824l134.206608 0 0-452.229708c0-17.838274 14.397918-32.296567 32.236192-32.296567 17.833157 0 32.232099 14.458293 32.232099 32.296567l0 452.229708L678.04371 641.448234c11.31572 0 20.908192 6.506181 25.236777 17.203824C707.610096 669.351748 705.358823 680.883385 697.359638 689.069835z" p-id="9052" fill="#1afa29"></path></svg>
    </div>
    <div class="footer">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
import * as  echarts from 'echarts'
export default {
   mounted() {
    //挂载完毕，获取dom，初始化echarts实例
    let lineChart = echarts.init(this.$refs.charts);
    //配置
    lineChart.setOption({
        xAxis:{
          show:false,  //隐藏x轴
          type:'category'  //不加这句话的话，那么数据默认是按从小到大排列，并不是按照我们自己在data中写的数据的顺序在x轴依次向右排开的
        },
        yAxis:{
          show:false //隐藏y轴
        },
        tooltip:{},
        series:[
          {
            type:'line',
            data:[10,20,60,90,5,45,65,70,20],
            smooth:true,//平滑
            //设置拐点的样式
            itemStyle:{
              opacity:0
            },
            //线条的样式
            lineStyle:{
              color:'skyblue'
            },
            //填充颜色的设置
            areaStyle:{
              color:{
                type:'linear',
                x:0,
                y:0,
                x2:0,
                y2:1,
                colorStops:[
                  {
                    offset:0,
                    color:'skyblue' //0%处的颜色
                  },
                  {
                    offset:1,
                    color:'white'  //100%处的颜色
                  }
                ],
                global:false  //缺省为false
              }
            }
          }
        ],
        //布局
        grid:{
          left:3,
          top:3,
          right:3,
          bottom:3
        }
    });
  },
}
</script>

<style scoped>
.header{
  display: flex;
  align-items: center;
}
.title{
  margin-right: 30px;
}
.main{
  margin: 10px 0;
}
.charts{
  width: 100%;
  height: 50px;
}
</style>