<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable" />
    </el-card>
    <el-card>
      <!-- 展示数据的table -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 8px"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 展示平台属性的table -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 15px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
                style="margin-right:10px"
              ></el-button>
              <el-popconfirm :title="`确认删除${row.attrName}?`" @onConfirm ="deleteAttr(row.id)">
                 <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加|修改的界面的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里的结构需要用到span和input进行来回切换，input是编辑模式，span是查看模式，这里设置个flag -->
              <!-- 但是需要注意的是，一个属性的flag没办法控制着全部属性值的切换（所有的属性值要么都是编辑模式，要么都是查看模式） -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toSpan(row)"
                ref="input"
              ></el-input>
              <span
                v-if="!row.flag"
                @click="toInput(row)"
                style="display: block"
                >{{ row.valueName }}</span
              >
              <!-- style="display:block" 让span变为块元素独占一行，点击此行空白处也奏效 -->
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!--气泡确认框 -->
              <el-popconfirm
                :title="`确认删除${row.valueName}?`"
                @onConfirm="deleteAttrValue($index)"
              >
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
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList < 1 ? true : false"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接收平台属性的字段
      attrList: [],
      //是否显示表格
      isShowTable: true,
      //收集新增属性|修改属性使用的
      attrInfo: {
        attrName: "", //属性：例如 颜色
        attrValueList: [
          //属性值：例如 红色 黄色  蓝色  因为是多个，所以是数组,每一个属性值都是一个对象
          // {
          //   // 初始不应该有元素
          //   attrId: 0, //属性值归属于对应属性的id
          //   valueName: "", //属性值
          // },
        ],
        categoryId: 0, //category3Id
        categoryLevel: 3,
      },
    };
  },
  methods: {
    //子给父把一级二级三级的id传过来，父拿着id去获取商品列表
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        //置空二三级分类的id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        //置空三级分类的id
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //三级的id都有了  就可以发请求获取品牌属性了
        this.getAttrList();
      }
    },
    //获取属性的数据的方法
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值的按钮
    addAttrValue() {
      //向属性值的数组里面添加元素
      //attrId:是相应属性的id，目前是添加操作，还没有属性的id，目前而言带给服务器的id设为undefined
      //valueName:相应的属性值的名称
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //对于修改属性的时候，可以在已有的属性值之上新增新的属性值，例如，颜色：蓝色 红色，还可以加绿色等等（但是此时绿色这个属性值的attrId字段就得有值，且为颜色这个属性的id）
        valueName: "",
        //flag：给每一个属性值添加一个标记，用于切换查看模式与编辑模式，每个flag只控制自己的切换
        //当前flag是响应式数据（数据变化，试图跟着变），因为attrInfo.attrValueList已经在data中声明了，且这是push进数组的，vue可以监测到数组的变化,其实这个push不是原本的push，是经过vue加工过的
        flag: true, //初始显示编辑模式
      });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //添加属性按钮的回调
    addAttr() {
      //切换table的显示|隐藏
      this.isShowTable = false;
      //清除数据,不然上次想添加，填写好了，但是又取消了，但是下次点击添加还会有上次的残留的数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [
          //属性值：例如 红色 黄色  蓝色  因为是多个，所以是数组,每一个属性值都是一个对象
        ],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    //修改属性
    updateAttr(row) {
      //隐藏数据的表格，显示添加|修改的界面
      this.isShowTable = false;
      //将选中的属性赋值为attrInfo
      this.attrInfo = cloneDeep(row); //这么写后，attrInfo和attrList中的元素指向的是同一个对象，只要attrInfo变，attrList中的数据就跟着变，所以即使你点了取消修改，也还是修改数据了，所以正确的写法是将爱她突然List中点击的元素的数据克隆一份给attrInfo，用来进行修改前的数据展示，上次遇到这么问题是用的浅拷贝，这次不行了，由于数据结构当中存在对象里面套数组，数组里面又套对象，因此需要使用深拷贝解决这类问题,这是解决了数据修改同步的问题，但是好友一个问题，此时属性值身上没有flag标记，没法进行input和span的切换，所以（见下面）
      //在修改某一属性时，将相应的属性值元素添加上flag标记
      this.attrInfo.attrValueList.forEach((item) => {
        // item.flag = false 这样书写，可以给属性值添加flag字段，但是视图不会更新，因为flag不是响应式数据！！
        //$set:向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新 property，因为 Vue 无法探测普通的新增 property
        this.$set(item, "flag", false); //参数一：给谁添加  参数二：要添加的属性  参数三：属性值
      });
    },
    //失去焦点变成span
    toSpan(row) {
      //必须输入属性值，才能失去焦点变成查看模式，不然就变不回来了
      if (row.valueName.trim() == "") {
        //trim：去除字符串前后的空格
        this.$message.error("属性值不能为空！");
        return;
      }
      //新增的属性值不能重复
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        //some函数只要回调里出面一次true，就不往下比了，就返回true
        //row是当前正在输入的属性值，需要将row从attrInfo.attrValueList除去，不能自己和自己比较，不然一直有重复
        if (row !== item) {
          //不能自己和自己比
          return row.valueName.trim() == item.valueName.trim(); //前后的空格去掉  不然‘黄色’  和  ‘  黄色  ’被认为是不相同的
        }
      });
      if (isRepat) {
        this.$message.error("属性值不能重复！");
        return;
      }
      row.flag = false;
    },
    //获取焦点变成input
    toInput(row) {
      row.flag = true;
      //变成input时自动获取焦点。不然还得点一下  小bug！
      //注意必须使用nextTick  得等结构完整了之后才能拿到this.$refs.input，
      this.$nextTick(() => {
        // console.log(this.$refs.input)
        this.$refs.input.focus();
      });
    },
    //气泡确认框的确定按钮的回调
    //注意：最新的elementui的版本中的这个事件改名字了  之前叫onConfirm  现在叫Confirm ，我们这个项目用的是之前版本的elementui  所以得用onConfirm
    deleteAttrValue(index) {
      //这个删除的操作时不需要发请求的  ，都搞好了，点击保存的时候统一发请求
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存按钮
    async addOrUpdateAttr() {
      //整理参数
      //第一点：空的属性值不应该提交给服务器  第二点：提交给服务器的参数中吧不应该有flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          //留下属性值不为空的
          if (item.valueName.trim() != "") {
            //除去flag字段
            delete item.flag;
            return true; //哪个item让返回值为true就留下哪个item
          }
        }
      );
      //发请求
      let result = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
      if (result.code == 200) {
        this.$message({ message: "保存成功！", type: "success" });
        //展示表格
        this.isShowTable = true;
        //获取新的数据
        this.getAttrList();
      } else {
        this.$message.error("保存失败！");
      }
    },
    //删除属性
    async deleteAttr(attrId) {
      // console.log(attrId)
      let result = await this.$API.attr.reqDeleteAttr(attrId);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.getAttrList();
      }
    },
  },
};
</script>

<style scoped>
</style>