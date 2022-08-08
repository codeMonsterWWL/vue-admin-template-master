<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0px; height: 400px">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <!-- v-model="activeName" @tab-click="handleClick" -->
        <!-- 头部左侧内容+主体部分 -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="sale">
            <el-row :gutter="10">
              <el-col :span="18">
                <SaleBarChart />
              </el-col>
              <el-col :span="6">
                <SaleList />
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="访问量" name="visit" :lazy="true">
            <el-row :gutter="10">
              <el-col :span="18">
                <VisitBarChart />
              </el-col>
              <el-col :span="6">
                <VisitList />
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <!-- 头部右侧内容 -->
        <div class="right">
          <span @click="today">今日</span>
          <span @click="week">本周</span>
          <span @click="month">本月</span>
          <span @click="year">本年</span>
          <el-date-picker
            v-model="date"
            value-format="yyyy-MM-dd"
            class="date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
          >
          </el-date-picker>
        </div>
      </div>
    </el-card>
    <el-card>
      <div slot="header"></div>
      <div></div>
    </el-card>
  </div>
</template>

<script>
import SaleBarChart from "./SaleBarChart";
import SaleList from "./SaleList";
import VisitBarChart from "./VisitBarChart";
import VisitList from "./VisitList";
import dayjs from "dayjs";
export default {
  name: "Sale",
  components: {
    SaleBarChart,
    SaleList,
    VisitBarChart,
    VisitList,
  },
  data() {
    return {
      activeName: "sale",
      date: [],
    };
  },
  methods: {
    // handleClick(tab, event) {
    //   console.log(tab, event);
    // },
    today() {
      let day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    week() {
      let start = dayjs().day(1).format("YYYY-MM-DD");
      let end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    month() {
      let start = dayjs().startOf("month").format("YYYY-MM-DD");
      let end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    year() {
      let start = dayjs().startOf("year").format("YYYY-MM-DD");
      let end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.date {
  width: 200px;
  margin: 0px 20px;
}
.right span {
  margin: 0px 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 260px;
}
.el-date-editor .el-range-input {
  width: 60%;
}
</style>