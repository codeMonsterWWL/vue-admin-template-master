<template>
  <div>
    <el-card>
      <div slot="header">
        <div class="header">
          <span> 销售额类别占比 </span>
          <el-radio-group size="small" v-model="value">
            <el-radio-button label="全部渠道"></el-radio-button>
            <el-radio-button label="线上"></el-radio-button>
            <el-radio-button label="门店"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div>
        <div class="charts" ref="charts"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    let mycharts = echarts.init(this.$refs.charts);
    mycharts.setOption({
      title: {
        text: "Direct",
        subtext: 735,
        left: "center",
        top: "center",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    });
    //绑定事件
    mycharts.on("mouseover",(params)=>{
      //获取鼠标移上去的那条数据
      const { name ,value} = params.data
      //重新设置标题
      mycharts.setOption({
        title:{
          text:name,
          subtext:value
        }
      })
    });
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>