<template>
  <div>
    <el-card>
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <div class="left-header">
          <span>线上热门搜索</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i><i class="el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <!-- 折线图部分 -->
      <el-row :gutter="10">
        <el-col :span="12">
          <LineChart />
        </el-col>
        <el-col :span="12">
          <LineChart />
        </el-col>
      </el-row>
      <!-- 表格 :default-sort="{ prop: 'date', order: 'descending' }" -->
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column label="排名" width="80" type="index">
        </el-table-column>
        <el-table-column label="搜索关键字" width="180"> </el-table-column>
        <el-table-column label="用户数" sortable> </el-table-column>
        <el-table-column label="周涨幅" sortable> </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next" :total="1000" class="pag"> </el-pagination>
    </el-card>
  </div>
</template>

<script>
import LineChart from "./lineChart";
export default {
  components: {
    LineChart,
  },
  data() {
    return {
      tableData: [{}, {}],
    };
  },
};
</script>

<style scoped>
.left-header {
  display: flex;
  justify-content: space-between;
}
.pag{
  text-align: center;
}
</style>