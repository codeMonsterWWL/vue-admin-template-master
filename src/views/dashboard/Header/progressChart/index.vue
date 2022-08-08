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
      xAxis: {
        show: false, //隐藏x轴
        //最小值与最大值的设置
        min:0,
        max:100
      },
      yAxis: {
        show: false, //隐藏y轴
        type: "category", //在y轴均分，柱状图就横过来了

      },
      series: [
        {
          type: "bar",
          data: [78],
          //柱状图的宽度
          barWidth:10,
          color:'yellowgreen',
          //背景颜色的设置
          showBackground:true,
          backgroundStyle:{
            color:'#eee'
          },
          //文本的设置
          label:{
            show:true,
            formatter:'|',
            position:'right'
          }
        },
      ],
      //布局
      grid: {
        left: 3,
        top: 3,
        right: 3,
        bottom: 3,
      },
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