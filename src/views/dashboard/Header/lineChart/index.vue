<template>
  <!-- 先定义一个容器，存放折线图 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "lineChart",
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
              color:'purple'
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
                    color:'purple' //0%处的颜色
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
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>