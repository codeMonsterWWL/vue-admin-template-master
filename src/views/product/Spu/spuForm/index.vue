  <template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="3"
          placeholder="SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- action:图片上传的地址，list-type:文件列表类型 ，:on-preview预览图片时触发   :on-remove删除图片时触发
        file-list：这个字段的值为存储图片的地方（数组，数组里面的元素务必要有name和url属性）   :on-preview预览    :on-remove删除
        -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
            v-for="unSelect in unSelectSaleAttr"
            :key="unSelect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- table展示的是当前spu自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="100">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- tag是类似于面包屑的小标签 -->
              <el-tag
                v-for="(tag, index) in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="handleClose(row, index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- input是点击添加时的input输入框 -->
              <!--  @keyup.enter.native="handleInputConfirm" -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <!-- button是添加的按钮 ，这里和上边就是span和input的切换，和当时我们自己写的一个道理（编辑模式和查看模式）-->
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteAttr(spu.spuSaleAttrList, $index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "spuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //修改spu的时候：spu被赋值为服务器返回的数据先进行展示，同时也可以收集到用户修改后的最新的数据
      //添加spu的时候，没有发请求，spu是一个空对象，数据收集到哪里啊？收集的数据有哪些字段啊，所以这里把spu的初始值改成这个模板，不写成空对象了
      spu: {
        category3Id: 0,
        tmId: "",
        description: "",
        spuName: "",
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarkList: [], //存储品牌的信息
      spuImageList: [], //存储spu的图片
      saleAttrList: [], //存储平台属性,这个存储的是全部的销售属性，其实也就三个，切记不是该spu所拥有的，是全部的！！！全部的就三个！！
      // inputVisible:false,//控制input和span的切换
      attrIdAndAttrName: "", //收集未选择的销售属性的id
    };
  },
  methods: {
    //照片墙删除的回调
    handleRemove(file, fileList) {
      //file：被删除的这张照片   fileList：删完了剩余的图片
      //收集照片墙的数据  （对于照片墙显示的图片是有name和url字段的，因为要显示出来必要要有这两个字段，但是对于服务器来说是不需要这两个字段的，所以说提交服务器的时候需要处理一下这两个字段）
      this.spuImageList = fileList;
    },
    //照片墙预览的回调
    handlePictureCardPreview(file) {
      //将图片的地址赋值给这个属性
      this.dialogImageUrl = file.url;
      //控制dialog的显示与隐藏
      this.dialogVisible = true;
    },
    //图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    //初始化spuForm的数据
    async initSpuData(spu) {
      //获取spu信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取品牌的数据
      let trademarkResult = await this.$API.spu.reqTradeMarkList();
      if (trademarkResult.code == 200) {
        this.tradeMarkList = trademarkResult.data;
      }
      //获取spu图片的数据
      let imageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (imageResult.code == 200) {
        let listArr = imageResult.data;
        //由于照片墙显示的图片的数据需要是数组，数组里面的元素(每个元素都是一个对象)需要有name和url字段，所以需要把服务器返回的数据进行修改一下,得整出这两个字段
        //给数组的每个元素添加name和url这两个字段！
        listArr.forEach((element) => {
          element.name = element.imgName;
          element.url = element.imgUrl;
        });
        //加工完后再把数据赋值给data中的响应式数据
        this.spuImageList = listArr;
      }
      //获取平台全部的销售属性(三个：颜色、版本、尺码)
      let attrResult = await this.$API.spu.reqBaseSaleAttrList();
      if (attrResult.code == 200) {
        this.saleAttrList = attrResult.data;
      }
    },
    //添加销售属性
    addSaleAttr() {
      //已经收集到了新添加的销售属性的数据，在attrIdAndAttrName中
      //把收集到的销售属性的数据进行分割，添加到spu.spuSaleAttrList里面
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":"); //数组按照顺序解构！！
      //整理一下数据
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      this.attrIdAndAttrName = "";
    },
    //添加属性值的按钮的回调
    addSaleAttrValue(row) {
      //点击添加属性值按钮的时候，需要由button展示成input，通过当前销售属性的inputVisible控制
      //挂载在销售属性上的响应式数据inputVisible控制着button与input的切换，
      this.$set(row, "inputVisible", true);
      //还需要收集input的值，收集到当前销售属性的inputValue上,但是row上没有这个字段，得先加上这个字段
      this.$set(row, "inputValue", "");
    },
    //input失去焦点的回调
    handleInputConfirm(row) {
      //把需要添加到spuSaleAttrValueList的字段解构出来
      const { baseSaleAttrId, inputValue } = row;
      //新增的属性值的名字不能为空
      if (inputValue.trim() == "") {
        this.$message.error("属性值不能为空！");
        return;
      }
      //新增的属性值不能和已有的重复
      let result = row.spuSaleAttrValueList.some(
        (item) => item.saleAttrValueName.trim() == inputValue.trim()
      ); //一真即真，只要有重复，就返回true
      if (result) {
        this.$message.error("属性值不能重复！");
        return;
      }
      //整理一下，这里的k-v中的k不能瞎写，要和spuSaleAttrValueList已有的属性值的字段一致
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      //往spuSaleAttrValueList里面塞，塞进去，新添加的属性值就能以面包屑的样子呈现出来了
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      //由input变为button
      row.inputVisible = false;
    },
    //删除某个属性的某个属性值
    handleClose(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    //删除某个属性
    deleteAttr(spuSaleAttrList, $index) {
      spuSaleAttrList.splice($index, 1);
    },
    //保存按钮的回调
    async addOrUpdateSpu() {
      //整理参数 ：需要整理照片墙的参数，对于图片需要携带imgName与imgUrl字段
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      //发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message.success("保存成功");
        //通知父组件回到scene==0的界面
        this.$emit("changeScene",{flag:this.spu.id?'修改':'添加'});
      }
      //清除数据
      Object.assign(this._data,this.$options.data())
    },
    //点击添加spu按钮的时候发俩请求初始化页面
    async addSpuData(category3Id) {
      //添加spu的时候收集三级分类的id
      this.spu.category3Id = category3Id
      //获取品牌的数据
      let trademarkResult = await this.$API.spu.reqTradeMarkList();
      if (trademarkResult.code == 200) {
        this.tradeMarkList = trademarkResult.data;
      }
      //获取平台全部的销售属性(三个：颜色、版本、尺码)
      let attrResult = await this.$API.spu.reqBaseSaleAttrList();
      if (attrResult.code == 200) {
        this.saleAttrList = attrResult.data;
      }
    },
    //取消按钮
    cancel(){
      this.$emit('changeScene',{flag:''})
      //清除数据
      //Object.assign是es6中新增的方法，合并对象，
      //组件实例身上的this._data，可以操作data中的响应式数据
      //this.$options可以说去配置对象，配置对象的data函数执行，返回的响应式数据为空，再赋值为响应式数据
      Object.assign(this._data,this.$options.data())
    }
  },
  computed: {
    //计算出未选择的销售属性
    unSelectSaleAttr() {
      //全部销售属性一共三个：颜色，版本，尺寸，  存放在saleAttrList这个数组中
      //当前spu已经拥有了的销售属性：  在spu.spuSaleAttrList:Array这个数组里面
      //思路：从全部的属性中过滤掉spu已经拥有了的
      return this.saleAttrList.filter((item) => {
        //这里得用every，得是当前的item的name值和spu拥有的属性中全都不相等，才能返回true，留下这个item
        return this.spu.spuSaleAttrList.every(
          (element) => item.name != element.saleAttrName
        );
      });
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>