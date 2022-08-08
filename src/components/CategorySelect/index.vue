<template>
  <div>
    <!-- inline：代表的是行内表单，代表一行上可以放置多个表单元素 -->
    <!-- 把表单数据收集到cForm这个对象上 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类" >
        <!-- 双向绑定收集到的下拉框选中的数据 -->
        <!-- el-select中的v-model的值和el-option的value的值是相同的-->
        <!-- el-option中value的值是当选项被选中后向服务器发送的值，我们眼睛是看不到的，这里收集的就是id -->
        <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="show">
          <el-option :label="c1.name" :value="c1.id" v-for="c1 in list1" :key="c1.id" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="show">
          <el-option :label="c2.name" :value="c2.id" v-for="c2 in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="show">
          <el-option :label="c3.name" :value="c3.id" v-for="c3 in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      list1:[],
      list2:[],
      list3:[],
      //收集选中的一级分类的id（获取二级分类需要用到一级分类的id）
      cForm:{
        category1Id:'',
        category2Id:'',
        category3Id:''
      }
    };
  },
  props:['show'],
  mounted() {
    //组件挂载完毕就得发请求获取一级分类的数据
    this.getCategory1();
  },
  methods: {
    //组件挂载就获取一级分类的数据，这里封装为个函数
    async getCategory1() {
      let result = await this.$API.attr.reqGetCategory1();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    //一级分类的select的事件的回调(当一级分类的内容发生变化时，说明用户选择了一级分类了，此时需要获取二级分类的数据)
    async handler1(){
      //假如我一级分类选的手机，二级分类选的华为，此时我把一级分类改成书刊，此时二级分类的选中华为应该被清掉，也就是把list2清空，得重新根据我选的一级分类的书刊的id去获取书刊的二级分类的数据
      this.list2 = ''
      this.list3 = ''
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      //把1Id给父亲传过去
      this.$emit('getCategoryId',{categoryId:this.cForm.category1Id,level:1})
      //通过一级分类的id获取二级分类的数据
      let result = await this.$API.attr.reqGetCategory2(this.cForm.category1Id)
      if(result.code==200){
        this.list2 = result.data
      }
    },
    //根据二级分类获取三级分类的数据
    async handler2(){
      //清除三级分类的数据及id
      this.list3 = ''
      this.cForm.category3Id = ''
       //把2Id给父亲传过去
      this.$emit('getCategoryId',{categoryId:this.cForm.category2Id,level:2})
      let result = await this.$API.attr.reqGetCategory3(this.cForm.category2Id)
      if(result.code==200){
       this.list3 = result.data
      }
    },
    //三级分类事件的回调
    handler3(){
      //把3Id给父亲传过去
      this.$emit('getCategoryId',{categoryId:this.cForm.category3Id,level:3})
    }
  },
};
</script>

<style>
</style>