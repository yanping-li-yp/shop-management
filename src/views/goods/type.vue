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
      <el-table-column prop="name" label="商品名称" width="120"></el-table-column>
      <el-table-column prop="real_name" label="产品编号" width="120"></el-table-column>
      <el-table-column prop="phone" label="所属分类" width="120"></el-table-column>
      <el-table-column prop="tuijian" label="零售价" width="120">
        <template slot-scope="scope">
          <el-row>
            {{scope.row.tuijian==null?"无":scope.row.tuijian}}
          </el-row>
        </template>

      </el-table-column>
      <el-table-column prop="balance" label="成本价" width="100"></el-table-column>
      <el-table-column prop="point" label="市场价" width="120"></el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" active-color="#02538C"
            inactive-color="#B9B9B9" @change="changeSwitch(scope.row)" />
        </template>

      </el-table-column>
      <el-table-column prop="group_id" label="排序" width="120"></el-table-column>
      <el-table-column prop="reg_time" label="库存" width="200"></el-table-column>
      <el-table-column prop="reg_time" label="状态" width="200"></el-table-column>
      <el-table-column fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="editClick(scope.row)" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="small" @click="delClick(scope.row.id)" icon="el-icon-delete">删除</el-button>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background layout="prev, pager, next" :total="total" @current-change="Page"
      style="margin-top: 30px;float: right;">
    </el-pagination>


    <el-dialog :title="dailog_title" width="50%" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="商品名称" :label-width="formLabelWidth" prop="name">
          <el-input size="small" v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品编号" :label-width="formLabelWidth" prop="password">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" :label-width="formLabelWidth" prop="repassword">
          <el-input v-model="form.repassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="零售价" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="成本价" :label-width="formLabelWidth">
          <el-input v-model="form.real_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="市场价" :label-width="formLabelWidth">
          <el-input v-model="form.balance" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-color="#02538C"
            inactive-color="#B9B9B9" />
        </el-form-item>

        <el-form-item label="库存" :label-width="formLabelWidth">
          <el-input v-model="form.balance" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item label="商品详情" :label-width="formLabelWidth">
          <WangEditor v-if="show" :isClear="isClear" :wangEditorContent.sync="detail"></WangEditor>
        </el-form-item>



        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="form.balance" autocomplete="off"></el-input>
        </el-form-item>


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
    userList,
    userSave,
    userDel
  } from '../../comoon/api/user.js'
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
        isClear:false,
        detail:'',
        checkList: [{
            id: 1,
            checked: false
          },
          {
            id: 2,
            checked: false
          },
          {
            id: 3,
            checked: false
          },
        ], //全选demo
        dailog_title: '添加',
        getRowKeys: '',
        value: [],
        options: [],
        tableData: [],
        total: 1,
        pagenum: 1,
        dialogFormVisible: false, //弹窗
        form: {
          id: '',
          name: '',
          password: '',
          repassword: '',
          phone: '',
          real_name: '',
          status: 1,
          balance: '',
          address: '',
        }, //数据
        delid: [], //删除ID
        formLabelWidth: '100px',
        rules: {
          name: [{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }],
          repassword: [{
            required: true,
            message: '确认密码不能为空',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: '手机号码不能为空',
            trigger: 'blur'
          }],
        },
      }
    },

    methods: {
      //初始化获取数据
      initData() {
        this.findAlldata();
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
            userSave(params).then(res => {
              //代表添加
              this.$message({
                message: res.msg,
                duration: 1000,
                type: 'success'
              });
              if (res.code == 200) {

                this.form = []; //数据清空
                this.dialogFormVisible = false;
                this.findAlldata() //数据调用
              }
            })
          }
        });
      },

      //原生写法
      demo() {
        for (var i = 0; i < this.checkList.length; i++) {
          this.checkList[i].checked = true;
        }
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
      handleChange(value) {
        console.log(value);
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
        userDel(params).then(res => {
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
      },
      //编辑
      editClick(params) {
        this.dialogFormVisible = true; //打开弹窗
        this.dailog_title = '编辑' //弹窗名称
        this.form['id'] = params.id; //提交ID是编辑  没有提交ID是添加数据
        this.form['name'] = params.name;
        this.form['status'] = params.status;
        this.form['tel'] = params.tel;
        this.form['balance'] = params.balance;
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
        userList(params).then(res => {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].status = parseInt(res.data.data[i].status); //数据从string转化成Int
          }
          console.log(res.data.data);
          this.tableData = res.data.data;
          this.total = res.data.totalPage;
        });
      }
    },
    created: function() {
      this.initData();
    }

  }
</script>
