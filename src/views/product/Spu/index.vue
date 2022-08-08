<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- 三级联动全局组件 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0" />
    </el-card>
    <el-card>
      <!-- 一下是有三个界面来回切换的：展示spu的表格、添加|修改spu、给点击的spu添加sku -->
      <!-- 展示spu的界面（按钮+表格+分页器） -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 8px"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu的sku列表"
                style="margin-right:10px"
                @click="showSkuList(row)"
              ></el-button>
              <el-popconfirm :title="`确认删除${row.spuName}？`" @onConfirm="deleteSpu(row)">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[2, 3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <!-- 添加|修改spu -->
      <spuForm v-show="scene == 1" @changeScene="changeScene" ref="spu" />
      <skuForm v-show="scene == 2" ref="sku" @changeSceneTo0="changeSceneTo0"/>
    </el-card>
    <el-dialog :title="`${spuName}的sku列表`" :visible.sync="dialogTableVisible" @close="closeDialog">
      <!-- 用table展示sku列表 -->
      <el-table :data="skuList" style="width:100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" >
        </el-table-column>
        <el-table-column prop="price" label="价格" width="80px">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="80px">
        </el-table-column>
        <el-table-column label="默认图片" width="200px">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" alt="" style="hegiht:100px;width:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import spuForm from "./spuForm";
import skuForm from "./skuForm";
export default {
  name: "Spu",
  components: {
    spuForm,
    skuForm,
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 3,
      //spu列表的数据
      records: [],
      total: 0,
      //scene：场景，控制显示哪个界面  0：展示数据界面  1：添加|修改spu界面   2：添加sku界面
      scene: 0,
      //控制对话框的显示与隐藏
      dialogTableVisible:false,
      //存储spu的名字，用于展示在对话框的title
      spuName:'',
      //存储服务器返回的sku列表的数据
      skuList:[],
      loading:true
    };
  },
  methods: {
    //三级联动组件把选中的三个分类的id传给父组件
    getCategoryId({ categoryId, level }) {
      //categoryId:获取到1、2、3级分类的id   level：区分是几级id
      if (level == 1) {
        this.category1Id = categoryId;
        //清除2、3级分类的id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        //清除3级id
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //获取spu类的列表数据进行展示
        this.getSpuList();
      }
    },
    //获取spu列表的数据
    async getSpuList() {
      //page   limit  category3Id
      let result = await this.$API.spu.reqGetSpuList(
        this.page,
        this.limit,
        this.category3Id
      );
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //修改page触发的回调
    handleCurrentChange(page) {
      //不用传参，直接接收参数就行了，饿了么封装好了
      this.page = page;
      this.getSpuList();
    },
    //limit改变触发的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //添加spu按钮的回调
    addSpu() {
      this.scene = 1;
      //通知子组件发俩请求：获取品牌 和 获取销售属性
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //修改spu的小图标的回调
    updateSpu(row) {
      this.isShowTable = false;
      this.scene = 1;
      //在父组件中可以通过给子组件打ref来获取子组件
      this.$refs.spu.initSpuData(row);
    },
    //添加|修改spu界面的取消按钮
    //按钮在子组件中，点击按钮后子组件需要告诉父组件，把scene=0，显示数据展示的界面
    changeScene({ flag }) {
      //flag是为了区分保存|修改  修改完留在当前页，添加完回到第一页
      this.scene = 0;
      if (flag == "修改") {
        this.getSpuList();
      } else {
        this.page = 1;
        this.getSpuList();
      }
    },
    //删除spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if(result.code==200){
        this.$message.success('删除成功')
        this.getSpuList()
      }
    },
    //添加sku
    addSku(row){
      this.scene = 2
      //父组件调用自组建的方法，让子组件发请求（三个请求） ,把这三个请求所需要的参数给子组件带过去
      this.$refs.sku.getData(this.category1Id,this.category2Id,row)
    },
    //skuForm界面切换到scene=0的界面
    changeSceneTo0(){
      this.scene = 0
    },
    //查看sku列表
    async showSkuList(row){
      this.dialogTableVisible = true
      this.spuName = row.spuName
      //发请求，获取该spu的sku列表的数据
      let result = await this.$API.spu.reqSkuList(row.id)
      if(result.code==200){
        this.skuList = result.data
        //loading效果结束
        this.loading = false
      }
    },
    //关闭dialog
    closeDialog(done){
      //loading属性再次变为真，不然你再点击其他的不会出现loading效果，因为loading再上一次点击显示过后就一直为false
      this.loading = true
      //清除sku列表的数据，去爽快的展示下一次你点击的sku的数据
      this.skuList = []
      //关闭dialog
      done()
    }
  },
};
</script>

<style scoped>
</style>