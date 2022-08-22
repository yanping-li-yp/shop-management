<template>
  <div>
    <el-row>
      <el-button type="primary" size="small" @click="addData">添加</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;margin-top:20px;" row-key="id" border
      :tree-props="{children: 'submenu', hasChildren: 'hasChildren'}">
      <el-table-column prop="id" label="编号" width="120"></el-table-column>
      <el-table-column prop="title" label="名称" width="120"></el-table-column>
      <el-table-column prop="pid" label="上级" width="120"></el-table-column>
      <el-table-column prop="url" label="URL地址" width="120"></el-table-column>
      <el-table-column prop="compont_path" label="路径" width="120"></el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" :active-value="1" :inactive-value="0"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" width="120"></el-table-column>
      <el-table-column prop="sort" label="排序" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <!--表单组件-->
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称" prop="title">
          <el-input v-model="ruleForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级">

          <el-select v-model="ruleForm.pid" placeholder="请选择">
            <el-option v-for="item in selectData" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="URL地址">
          <el-input v-model="ruleForm.url" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="路径">
          <el-input v-model="ruleForm.compont_path" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="ico图标">
          <el-input v-model="ruleForm.ico" autocomplete="off"></el-input>
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
    menuSeach,
    menuSave,
    menuDel,
  } from '../../comoon/api/menu.js'; //调用外部JS文件

  export default {
    data() {
      return {
        title: '添加',
        tableData: [],
        selectData: [],
        open: false,
        dialogVisible: false,
        ruleForm: {
          title: '',
          pid: '',
          url: '',
          compont_path: '',
          status: '',
          ico: '',
          sort: '',
          id: '',
        },
        rules: {
          title: [{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }],
        }

      }
    },

    methods: {
      //获取数据
      initData: function() {
        let params = {

        }
        menuSeach(params).then(res => {
          if (res.code == 200) {
            this.tableData = res.data;
            //下拉菜单选项
            this.selectData = [];
            this.selectData.push({
              title: '顶级栏目',
              id: 0
            });
            for (var i = 0; i < res.data.length; i++) {
              let data = {
                title: res.data[i].title,
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
            menuSave(this.ruleForm).then(res => {
              console.log(res);
              if (res.code == 200) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                });
                this.initData();
                this.dialogVisible = false;
                this.ruleForm = {};
              }
            });
          }
        });
        console.log(this.ruleForm);
      },
      //关闭按钮
      handleClose: function() {
        this.ruleForm = {};
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
          menuDel(params).then(res => {

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
