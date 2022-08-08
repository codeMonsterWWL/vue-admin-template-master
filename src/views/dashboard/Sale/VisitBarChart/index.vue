<template>
  <!-- 准备一个容器，放柱状图 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "barChart",
  mounted() {
    let barChart = echarts.init(this.$refs.charts);
    barChart.setOption({
      title: {
        text: "访问量趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [80042, 68524, 45672, 25467, 65897, 98754, 36574, 21456, 75245, 65412, 25874, 36541],
          barWidth: 30,
        },
      ],
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 300px;
}
</style>