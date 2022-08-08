<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="info"
            icon="el-icon-bottom"
            size="mini"
            v-if="row.isSale"
            @click="toCancelSale(row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-top"
            size="mini"
            v-else
            @click="toOnSale(row.id)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="$message('正在开发中.....')"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="Detail(row.id)"
          ></el-button>
          <el-popconfirm :title="`确定删除${row.skuName}吗？`" @onConfirm="deleteSku(row.id)" style="margin-left:10px">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              slot="reference"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器  -->
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev,pager,next,jumper,->,sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ detail.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ detail.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ detail.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="attr in detail.skuAttrValueList"
            :key="attr.id"
            style="margin-right: 5px"
            >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="300px">
            <el-carousel-item
              v-for="item in detail.skuImageList"
              :key="item.id"
            >
              <img
                :src="item.imgUrl"
                alt=""
                style="height: 300px; width: 100%"
              />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template> 

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 5,
      total: 0,
      records: [], //存储sku列表的数据
      detail: {},
      show: false,
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    //获取sku列表的数据
    async getSkuList() {
      let result = await this.$API.sku.reqSkuList(this.page, this.limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //当前页变化时
    handleCurrentChange(page) {
      this.page = page;
      this.getSkuList();
    },
    //limit发生变化时
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    //下架
    async toCancelSale(skuId) {
      let result = await this.$API.sku.reqCancelSale(skuId);
      if (result.code == 200) {
        this.$message.success("下架成功");
        this.getSkuList();
      }
    },
    //上架
    async toOnSale(skuId) {
      let result = await this.$API.sku.reqOnSale(skuId);
      if (result.code == 200) {
        this.$message.success("上架成功");
        this.getSkuList();
      }
    },
    //详情
    async Detail(skuId) {
      //打开抽屉
      this.show = true;
      //获取数据
      let result = await this.$API.sku.reqSkuDetail(skuId);
      if (result.code == 200) {
        this.detail = result.data;
      }
    },
    //删除sku
    async deleteSku(skuId) {
      let result = await this.$API.sku.reqDeleteSku(skuId);
      if (result.code == 200) {
        this.$message.success('删除成功！')
        this.getSkuList()
      }
    },
  },
};
</script>

<style scoped>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}
</style>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>