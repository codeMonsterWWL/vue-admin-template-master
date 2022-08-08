<template>
  <div>
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom: 10px"
      @click="showDiaLog"
      >添加</el-button
    >
    <!-- 表格组件 
      data:表格组件将来需要展示的数据，一定是数组类型的
      border:给表格添加边框
      column的属性：
         label:显示的标题（字符串）
         width：对应列的宽度,这里给序号设置为80px，其余的仨自动均分
         align：对齐方式：left、centet、right
         prop：对应列内容的字段名
    -->
    <!-- 注意：1：elementUI中table组件，展示的数据是一列一列进行展示的  用 type="index"进行序号的展示-->
    <el-table style="width: 100%" border :data="list">
      <el-table-column label="序号" width="80" align="center" type="index">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <!-- 子把数组回传给父，父来决定子的样式，这里就是以图片的形式展示！ ,slot-scope="{row,$index}"这是解构出来了，因为vue把所有回传数据封装为一个对象-->
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 50px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
      当前第几页、数据总条数、每页展示的条数、连续页码数
      @size-change：当每页展示数据的条数发生变化时，触发该事件，并注入一个参数，你选择的size
      @current-change:当前页码发生变化时，触发该事件，并且给注入一个参数：你点击的页码
      注：长按标签名可以查看参数含义！！
     -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      :pager-count="7"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper,->,sizes , total"
      style="margin-top: 20px; textAlign: center"
    >
    </el-pagination>
    <!-- 
      对话框 
        :visible.sync：控制对话框的显示与隐藏
    -->
    <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。 -->
    <el-dialog :title="tmform.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form表单   :model="tmform"把表单的数据收集到tmform对象中，将来表单验证页需要这个属性-->
      <el-form style="width: 80%" :model="tmform" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmform.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 收集图片就不能用v-model了，因为不是表单元素
            action：设置图片上传的地址  ，这里不加/dev-api的话服务器不会帮我们代理转发
             :on-success:可以监测到图片是否上传成功，当图片上传成功，会触发该事件
              :before-upload：上传之前会触发该事件
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmform.logoUrl" :src="tmform.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    //自定义校验规则
     var validateTmName = (rule, value, callback) => {
      //小于2或者大于10  不符合 ，返回错误
      if(value.length<2||value.length>10){
        callback(new Error('名称为2-10字符'))
      }else{
        //放行
        callback()
      }
    };
    return {
      //当前是第几页
      page: 1,
      //当前页码展示数据的条数
      limit: 5,
      //数据总条数
      total: 0,
      //列表展示的数据
      list: [],
      //控制对话框显示与隐藏的属性
      dialogFormVisible: false,
      //收集品牌信息,对象身上的属性你不能瞎写，需要看接口文档，k不对的话，后台人员没办法得到v
      tmform: {
        tmName: "",
        logoUrl: "",
      },
      //表单验证规则
      rules:{
        //品牌名称的验证规则
        tmName: [
          //require:会否必须填写（true时前边会出现五角星） message：提示信息  trigger：用户行为的设置，啥时候触发校验（blur：失去焦点，change：发生变化时触发）
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          //长度2-10   ，change：文本发生变化时触发校验，下边这行是用的现成的规则，还可以自定义规则，演示一下
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
          //自定义校验规则
          { validator: validateTmName, trigger: 'change' }
        ],
        //logo的验证规则
        logoUrl: [
          { required: true, message: '请选择图片LOGO'}
        ],
      }
    };
  },
  mounted() {
    //封装为一个函数
    this.getPageList();
  },
  methods: {
    //获取品牌列表的数据
    //向服务器发请求时需要带参数，因此在data中初始化两个字段，代表给服务器传递的参数
    async getPageList() {
      let result = await this.$API.tradeMark.reqTradeMarkList(this.page,this.limit); //注意这里从$API获取api接口函数时要打点模块名字，因为$API里面有四个模块！
      if (result.code == 200) {
        //将data中初始化的数据换成服务器返回的数据
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    //当前页码发生变化时，触发该事件
    handleCurrentChange(pager) {
      //修改当前页的值
      this.page = pager;
      //重新发请求
      this.getPageList();
    },
    //当每页展示数据的条数发生变化时，触发该事件
    handleSizeChange(size) {
      //修改每页展示数据条数的值
      this.limit = size;
      //重发请求
      this.getPageList();
    },
    //点击最上边的添加品牌的按钮的回调
    showDiaLog() {
      this.dialogFormVisible = true;
      //清空数据
      this.tmform = { tmName: "", logoUrl: "" };
    },
    //修改品牌
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      //row就是当前用户选中的品牌的信息
      //将点击的品牌的信息赋值给tmform进行展示，因为el-dialog的数据来源于tmform，tmform是啥，el-dialog就展示啥
      // console.log(row)
      //这里将服务器返回的品牌的信息直接赋值给了tmform进行展示，也就是说tmform存储的即为服务器返回的品牌的信息。这会导致你边修改的同时，还没点确定呢，数据也被彻底的改了，即使你点取消，也无济于事了，所以这里用深拷贝，深拷贝后，你修改row的值不会影响tmform的值，因为指向的不是同一个内存地址，互不影响的
      this.tmform = {...row}//此时tmform里面就有了id属性，因为row里面有仨k：id、logourl、tmname
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      console.log('图片上传成功')
      //res是上传成功之后返回给前端的数据,res.data是服务器返回的真实的图片地址
      //file是上传成功后服务器返回给前端的数据
      //收集图片的数据，发请求时需要带给服务器
      this.tmform.logoUrl = res.data;
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //对话框中的确认按钮(添加品牌或者修改品牌)
    addOrUpdateTradeMark() {
      this.dialogFormVisible = false;
      //当全部校验通过后，再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success)=>{
        //success为true说明全部校验通过
        if(success){
          //发请求：有可能是添加品牌，也可能是修改品牌
           let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmform);
          if (result.code == 200) {
            //弹出提示：添加成功|修改成功
              this.$message({
              message:this.tmform.id?'修改成功':'添加成功',
              type:'success'
          });
          //重新获取新的列表
          //操作完了停留在当前页
          this.getPageList()
          }
        }else{
          console.log('填写不符合规则!')
          return false
        }
      })
    },
    //删除品牌
    deleteTradeMark(row){
      this.$confirm(`确定删除${row.tmName}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        //点击确定按钮触发then
        //向服务器发请求
        let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
        if(result.code==200){
          this.$message({
          type: 'success',
          message: '删除成功!'
         });
         //再次获取新的数据
         this.getPageList()
        }       
      }).catch(() => {
        //点击取消按钮触发catch
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  },
};
</script>
 

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>