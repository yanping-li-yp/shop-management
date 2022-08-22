<template>
  <div>
    <el-row>
      <el-input style="width:200px;" placeholder="请输入用户名或手机号"></el-input>
      <el-button type="primary" size="small" icon="el-icon-search">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus" size="small" style="margin-left:20px;"
        @click="dialogFormVisible = true">添加</el-button>
      <el-button type="danger" icon="el-icon-delete" size="small" @click="delDialog">删除</el-button>
    </el-row>
    <el-table ref="multiTable" class="dark" :data="tableData" tooltip-effect="dark"
      style="width: 100%;margin-top: 20px;" row-key="id" @selection-change="handleSelectionChange"
      @select-all="selectAll">
      <el-table-column type="selection" width="60" align="center"></el-table-column>
      <el-table-column prop="id" label="编号" width="80"></el-table-column>
      <el-table-column prop="name" label="商品名称" width="220"></el-table-column>
      <el-table-column prop="goods_no" label="产品编号" width="120"></el-table-column>
      <el-table-column prop="img" label="图片" width="120">
         <template slot-scope="scope">
         <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.img"
            :preview-src-list="scope.row.imgs">
          </el-image>
         </template>
      </el-table-column>

      <el-table-column prop="category_id" label="所属分类" width="120"></el-table-column>
      <el-table-column prop="sell_price" label="零售价" width="120"></el-table-column>
      <el-table-column prop="cost_price" label="成本价" width="100"></el-table-column>
      <el-table-column prop="market_price" label="市场价" width="120"></el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" active-color="#02538C"
            inactive-color="#B9B9B9" @change="changeSwitch(scope.row)" />
        </template>

      </el-table-column>
      <el-table-column prop="sort" label="排序" width="120"></el-table-column>
      <el-table-column prop="store_nums" label="库存" width="200"></el-table-column>
      <el-table-column prop="create_time" label="添加时间" width="200"></el-table-column>
      <el-table-column fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="editClick(scope.row)" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="small" @click="delClick(scope.row.id)" icon="el-icon-delete">删除</el-button>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :page-size="10" :total="total" @current-change="Page"
      style="margin-top: 30px;float: right;">
    </el-pagination>


    <el-dialog :title="dailog_title" width="50%" top="10px" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form ref="form" :model="form" :rules="rules">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础参数" name="one">
            <el-form-item label="商品名称" :label-width="formLabelWidth" prop="name">
              <el-input size="small" v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="产品编号" :label-width="formLabelWidth">
              <el-input v-model="form.goods_no" autocomplete="off"></el-input>
            </el-form-item>


            <el-form-item label="所属分类" :label-width="formLabelWidth">
              <el-input v-model="form.category_id" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="零售价" :label-width="formLabelWidth">
              <el-input v-model="form.sell_price" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="成本价" :label-width="formLabelWidth">
              <el-input v-model="form.cost_price" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="市场价" :label-width="formLabelWidth">
              <el-input v-model="form.market_price" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="状态" :label-width="formLabelWidth">
              <el-switch v-model="form.is_online" :active-value="1" :inactive-value="0" active-color="#02538C"
                inactive-color="#B9B9B9" />
            </el-form-item>

            <el-form-item label="库存" :label-width="formLabelWidth">
              <el-input v-model="form.store_nums" autocomplete="off"></el-input>
            </el-form-item>

          </el-tab-pane>

          <el-tab-pane label="内容详情" name="two">

            <el-form-item label="商品图片" :label-width="formLabelWidth">
              <el-upload action="#" list-type="picture-card" :http-request="httpRequest"
                :on-preview="handlePictureCardPreview" :before-upload="beforeAvatarUpload" :on-remove="handleRemove"
                :on-change="handleChange" :file-list="imglist">
                <!--:on-remove="(file, fileList) => {handleRemove(file, fileList, index)}"-->
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" :modal="false">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>

            <el-form-item label="商品详情" :label-width="formLabelWidth">
              <WangEditor v-if="show" :isClear="isClear" :wangEditorContent.sync="form.content"></WangEditor>
            </el-form-item>



            <el-form-item label="排序" :label-width="formLabelWidth">
              <el-input v-model="form.sort" autocomplete="off"></el-input>
            </el-form-item>

          </el-tab-pane>




        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog"> 取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style type="text/css">

</style>

<script>
  import WangEditor from '@/components/editor/WangEditor.vue'
  import {
    goodsList,
    goodsSave,
    goodsDel
  } from '../../comoon/api/goods.js'
  export default {
    props: {
      show: {
        type: Boolean,
        default: true
      },
      size: {
        type: String,
        default: 'small'
      },
    },
    components: {
      WangEditor
    },
    data() {
      return {
        activeName: 'one',//tab切换
        dialogImageUrl: '',
        imglist: [],
        viewlist: [],
        dialogVisible: false,
        isClear: false,
        detail: '',
        dailog_title: '添加',
        getRowKeys: '',
        value: [],
        dd: [],
        options: [],
        tableData: [],
        total: 1,
        pagenum: 1,
        dialogFormVisible: false, //弹窗
        form: {
          id: '',
          name: '',
          goods_no: '',
          category_id: '',
          phone: '',
          imgs: [],
          sell_price: '',
          market_price: 1,
          cost_price: '',
          store_nums: '',
          sort: '',
          content: '',
        }, //数据
        delid: [], //删除ID
        formLabelWidth: '100px',
        rules: {
          name: [{
            required: true,
            message: '标题不能为空',
            trigger: 'blur'
          }],

        },
      }
    },

    methods: {
      //代码
      handleClick(e){
        console.log(e);
      },
      //初始化获取数据
      initData() {
        this.findAlldata();
      },
      //删除图片
      handleRemove(file, fileList) {
        console.log(this.viewlist);
        console.log(this.form.imgs);
        let index = this.viewlist.indexOf(file.url);
        console.log(index);
        this.viewlist.splice(index, 1); //把预览图删除
        this.form.imgs.splice(index, 1); //把提交给服务器的数据删除
        console.log(file);
        console.log(this.viewlist);
        console.log(this.form.imgs);
      },
      //预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

      beforeAvatarUpload(file) { //文件上传之前调用做一些拦截限制
        // console.log(file);
        const isJPG = true;
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      httpRequest(item) {
        //console.log(item);
        let formdata = new FormData() //上传阿里云，七牛云存储
        formdata.append('file', item.file) //img
        let that = this;
        this.$http.post('http://shop.ueoa.net/file/upload', formdata).then(res => {
          if (res.data.code == 200) {
            that.form.imgs.push(res.data.data.url);
          }
        })
      },
      //提交参数 添加跟编辑数据接口用一个
      submit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            let params = this.form;
            if (params['status'] == true) {
              params['status'] = 1;
            } else {
              params['status'] = 0;
            }
            goodsSave(params).then(res => {
              //代表添加
              this.$message({
                message: res.msg,
                duration: 1000,
                type: 'success'
              });
              if (res.code == 200) {
                this.form = {}; //数据清空
                this.form.img = [];
                this.dialogFormVisible = false;
                this.findAlldata() //数据调用
              }
            })
          }
        });
      },

   
      //利用ui
      selectAll(val) {
        console.log(val);
        for (var i = 0; i < val.length; i++) {
          console.log(val[i].id); //获取选择的ID
          this.delid.push(val[i].id); //所有ID放到data参数里面
        }
      },
      handleSelectionChange(val) {

      },
      //改变
      handleChange(item) {
        console.log(item);
        this.viewlist.push(item.url);
      },
      changeSwitch(value) {
        console.log(value);
      },
      //确认删除弹窗
      delDialog() {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delClick(); //全部删除
        })
      },

      //根据ID删除数据
      delClick(id = 0) {
        let params = '';
        if (id != 0) {
          params = {
            id: id
          }
        } else {
          params = {
            id: this.delid
          }
        }
        //接口封装 删除功能
        goodsDel(params).then(res => {
          if (res.code == 200) {
            //代表添加
            this.$message({
              message: res.msg,
              duration: 1000,
              type: 'success'
            });
            this.delid = []; //给删除字段清空
            this.findAlldata(); //重新获取参数
          }
        });
      },

      //窗口关闭
      closeDialog() {
        this.dialogFormVisible = false;
        this.form = {};
        this.form.imgs = [];
        this.imglist = [];
        this.viewlist = [];
      },
      //编辑
      editClick(params) {
        this.dialogFormVisible = true; //打开弹窗
        this.dailog_title = '编辑' //弹窗名称
        this.form = params;
        console.log(this.viewlist);
        if (params.imgs.length > 0) {
          for (let i = 0; i < params.imgs.length; i++) {
            this.imglist.push({
              url: params.imgs[i]
            }); //打开预览
            this.viewlist.push(params.imgs[i]); //比对预览数据
          }
        }
      },

      //分页
      Page(e) {
        console.log(e);
        this.pagenum = e; //得到页数
        this.findAlldata();
      },
      //查询
      findAlldata() {
        //统一接口
        let params = {
          page: this.pagenum
        };
        //接口封装
        goodsList(params).then(res => {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].status = parseInt(res.data.data[i].status); //数据从string转化成Int
          }
          console.log(res.data.data);
          this.tableData = res.data.data;
          this.total = parseInt(res.data.total);
        });
      }
    },
    created: function() {
      this.initData();
    }

  }
</script>
<style>
  .el-dialog__body{
    padding: 0px 20px 10px;
  }
</style>
