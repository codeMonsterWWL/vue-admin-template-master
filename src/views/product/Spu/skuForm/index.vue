<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{ spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格（元）"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input
          placeholder="重量（千克）"
          v-model="skuInfo.weight"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          placeholder="规格描述"
          rows="4"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id},${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id},${saleAttrValue.id}`"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="60"> </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img
                :src="row.imgUrl"
                alt=""
                style="height: 100px; weight: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="toDefault(spuImageList, row)"
                size="mini"
                >设置默认</el-button
              >
              <el-button type="success" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "skuForm",
  data() {
    return {
      spuImageList: [], //图片
      spuSaleAttrList: [], //销售属性
      attrInfoList: [], //平台属性
      //收集sku数据的字段
      skuInfo: {
        //第一类收集的数据：父组件给的数据,下面的三个
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：通过v-model收集的,下面的四个
        price: "",
        skuName: "",
        weight: "",
        skuDesc: "",
        //第三类：需要自己写代码收集，先收集在data中的imageList，spuSaleAttrList，attrInfoList中，在整理到参数中
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   imgName: "",
          //   imgUrl: "",
          //   isDefault: "",
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0,
          // },
        ],
      },
      spuName: "",
      //收集选中的图片
      imageList: [],
    };
  },
  methods: {
    //初始化页面
    async getData(category1Id, category2Id, spu) {
      //收集父组件传过来的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spuName = spu.spuName;
      //发三个请求
      //获取图片
      let result = await this.$API.spu.reqSpuImageList(spu.id);
      if (result.code == 200) {
        let list = result.data;
        //给每个图片添加isDefault字段
        list.forEach((element) => {
          element.isDefault = 0;
        });
        this.spuImageList = list;
      }
      //获取销售属性的数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      //获取平台属性
      let result3 = await this.$API.spu.reqAttrList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result3.code == 200) {
        this.attrInfoList = result3.data;
      }
    },
    //table复选框的回调
    handleSelectionChange(selection) {
      //selection是一个数组，存储着用户选中的行，但是缺少isDefault字段
      this.imageList = selection;
    },
    //设置默认
    toDefault(spuImageList, row) {
      spuImageList.forEach((element) => {
        element.isDefault = 0;
      });
      row.isDefault = 1;
      //收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //取消
    cancel() {
      this.$emit("changeSceneTo0");
      //清除数据
      Object.assign(this._data, this.$options.data());
    },
    //保存
    async save() {
      //整理参数
      //整理平台属性,我们是把选中的平台属性的id和属性值的id收集到了attrInfoList的attrIdAndValueId字段
      const { attrInfoList, skuInfo } = this;
      attrInfoList.forEach((element) => {
        if (element.attrIdAndValueId) {
          //如果这个平台属性中有attrIdAndValueId这个字段，说明用户已经选中该平台属性了，我们需要把选中的平台属性的id和属性值的id赋值给skuInfo的skuAttrValueList字段
          const [attrId, valueId] = element.attrIdAndValueId.split(","); //切割完了返回一个数组，再进行解构，拿到选中的平台属性的id和属性值的id
          //skuInfo.skuAttrValueList的数据结构是数组中套对象。所以我们得整理成一个对象，再塞到skuInfo.skuAttrValueList里面去
          let result = { attrId, valueId };
          skuInfo.skuAttrValueList.push(result);
        }
      });
      //整理销售属性，和上边的完全同理
      const { spuSaleAttrList } = this;
      spuSaleAttrList.forEach((element) => {
        if (element.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = element.attrIdAndValueId.split(",");
          let result = { saleAttrId, saleAttrValueId };
          skuInfo.skuSaleAttrValueList.push(result);
        }
      });
      //整理图片
      const { imageList } = this;
      skuInfo.skuImageList = imageList.map((item) => {
        //imageList里面有几张图片，就得返回几个对象，外层再包一个数组（因为map函数最终返回一个数组，数组里面的元素的数据结构取决于我们return后面怎么写），不就是服务器需要的skuInfo.skuImageList参数的数据结构吗？  再赋值给skuInfo.skuImageList最终带给服务器
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      //参数整理完毕，发请求
      let result = await this.$API.spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message.success("添加成功！");
        //跳转到scene == 0
        this.$emit("changeSceneTo0");
        //清除数据
        Object.assign(this._data, this.$options.data());
      }
    },
  },
};
</script>

<style>
</style>