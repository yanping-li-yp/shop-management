<template>
  <div>
    <el-row>
      <el-button type="primary" size="small" @click="addData">添加</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;margin-top:20px;" row-key="id" border
      :tree-props="{children: 'submenu', hasChildren: 'hasChildren'}">

      <el-table-column prop="name" label="名称" width="120"></el-table-column>
      <el-table-column prop="parent_id" label="上级" width="120"></el-table-column>
     <el-table-column prop="img" label="图片" width="320">
        <template slot-scope="scope">
        <el-image
           style="width: 100px; height: 100px"
           :src="scope.row.img"
           :preview-src-list="scope.row.imgs">
         </el-image>
        </template>
     </el-table-column>

      <el-table-column prop="status" label="状态"  >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" :active-value="1" :inactive-value="0"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="sort" label="排序" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" top="5vh" :before-close="handleClose">
      <!--表单组件-->
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="上级">
          <el-select v-model="ruleForm.parent_id" placeholder="请选择">
            <el-option v-for="item in selectData" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="类型分类">
          <el-input v-model="ruleForm.type_id" autocomplete="off"></el-input>
        </el-form-item>

       <el-form-item label="商品图片">
         <el-upload action="#" list-type="picture-card" :http-request="httpRequest"
           :on-preview="handlePictureCardPreview" :before-upload="beforeAvatarUpload" :on-remove="handleRemove"
           :on-change="handleChange" :file-list="imglist">
           <i class="el-icon-plus"></i>
         </el-upload>
         <el-dialog :visible.sync="dialogimg" :modal="false">
           <img width="100%" :src="dialogImageUrl" alt="">
         </el-dialog>
       </el-form-item>


        <el-form-item label="状态" prop="status">
          <el-switch v-model="ruleForm.status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>

        <el-form-item label="排序" prop="status">
          <el-input v-model="ruleForm.sort" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="submit()">提交</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<style>
  .open {
    background: #FFFDEF;
    border: 1px solid #000000;
    height: 400px;
    width: 500px;
    position: absolute;
    top: 100px;
    margin-left: 300px;
    z-index: 1000;
  }
</style>

<script>
  import {
    goodsCategoryList,
    goodsCategorySave,
    goodsCategoryDel,
  } from '../../comoon/api/category.js'; //调用外部JS文件

  export default {
    data() {
      return {
        imglist: [],
        viewlist: [],
        dialogimg: false,
        dialogImageUrl:'',

        title: '添加',
        tableData: [],
        selectData: [],
        open: false,
        dialogVisible: false,
        ruleForm: {
          name: '',
          parent_id: '',
          imgs:[],
          status: '',
          sort: '',
          id: '',
        },
        rules: {
          name: [{
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          }],
        }

      }
    },

    methods: {
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
      //改变
      handleChange(item) {
        console.log(item);
        this.viewlist.push(item.url);
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
        let formdata = new FormData() //上传阿里云，七牛云存储
        formdata.append('file', item.file) //img
        let that = this;
        this.$http.post('http://shop.ueoa.net/file/upload', formdata).then(res => {
          if (res.data.code == 200) {
            that.ruleForm.imgs.push(res.data.data.url);
          }
        })
      },

      //获取数据
      initData: function() {
        let params = {

        }
        goodsCategoryList(params).then(res => {
          if (res.code == 200) {
            this.tableData = res.data;
            //下拉菜单选项
            this.selectData = [];
            this.selectData.push({
              title: '顶级栏目',
              id: '0'
            });
            for (var i = 0; i < res.data.length; i++) {
              let data = {
                title: res.data[i].name,
                id: res.data[i].id
              }
              this.selectData.push(data);
            }
          }
        });
      },
      //添加弹窗
      addData: function() {
        this.title = '添加';
        this.dialogVisible = true; //显示弹窗
      },
      //提交数据
      submit: function() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            goodsCategorySave(this.ruleForm).then(res => {
              console.log(res);
              if (res.code == 200) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                });
                this.initData();
                this.handleClose();
              }
            });
          }
        });
        console.log(this.ruleForm);
      },
      //关闭按钮
      handleClose: function() {
        this.ruleForm = {};
        this.ruleForm.imgs = [];
        this.imglist = [];
        this.viewlist = [];
        this.dialogVisible = false;
      },
      //编辑
      edit: function(res) {
        this.title = '编辑';
        res.pid = parseInt(res.pid); //数据类型 string转化成int
        res.status = parseInt(res.status); //数据类型 string转化成int
        let data = JSON.stringify(res); //转换成字符串
        this.ruleForm = JSON.parse(data); //转换成JSON 给编辑框进入赋值
        this.dialogVisible = true;
        let params= JSON.parse(data);
        console.log(res);
        console.log(params.imgs.length);

        if (params.imgs.length > 0) {
          for (let i = 0; i < params.imgs.length; i++) {
            this.imglist.push({
              url: params.imgs[i]
            }); //打开预览
            this.viewlist.push(params.imgs[i]); //比对预览数据
          }
        }

      },
      //删除(ID)
      del: function(id) {
        console.log(id);
        let params = {
          id: id
        }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //确定
          goodsCategoryDel(params).then(res => {

            if (res.code == 200) {
              //重新加载数据
              this.initData();
              var type = "success";
            } else {
              var type = "error";
            }

            this.$message({
              type: type,
              message: res.msg
            });
          });
        });
      },
    },
    //初始化操作
    created: function() {
      this.initData();
    }
  }
</script>

<style>
</style>
