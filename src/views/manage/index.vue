<template>
  <div>
    <el-row>
      <el-button type="success" size="small" @click="addClick">添加</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="编号" width="180"></el-table-column>
      <el-table-column prop="name" label="用户名" width="180"></el-table-column>
      <el-table-column prop="rules" label="角色"></el-table-column>
       <el-table-column prop="last_ip" label="登录IP"></el-table-column>
       <el-table-column prop="last_login" label="登录时间"></el-table-column>
       <el-table-column prop="is_lock" label="状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="editClick(scope.row)" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="small" @click="delClick(scope.row.id)" icon="el-icon-delete">删除</el-button>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block" style="margin-top: 20px;">

      <el-pagination @size-change="handleSizeChange"
       background  @current-change="handleCurrentChange" :current-page="currentPage"
         :page-size="10" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog title="添加" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="消费金额">
          <el-input v-model="form.money" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<style>
  .demo {
    width: 500px;
    height: 500px;
    border: 1px solid #000000;
    background: #FFF;
    position: fixed;
    top: 20px;
    margin-left: 20%;
    z-index: 1000;
  }

  .close {
    width: 96%;
    margin: 0px 50px 0px 0px;
    height: 50px;
    padding: 0px;
    line-height: 50px;
    text-align: right;
  }
</style>
<script>
  import {
    mangeList,
  } from '../../comoon/api/admin.js'; //调用外部JS文件
  export default {
    data() {
      return {
        currentPage: 1,
        total:0,
        demo: false,
        dialogFormVisible: false,
        form: {
          name: '',
          money: 0,
        },
        formLabelWidth: 200,
        labelWidth: 200,
        tableData: [],
        rules: {
          name: [{
            required: true,
            message: '请输入活动名称',
            trigger: 'blur'
          }, ]
        }
      }
    },
    methods: {

      initData() {
        let that = this;
        let params = {
          page: 1
        }
        mangeList(params).then(res => {
          if (res.code == 200) {
            that.tableData = res.data.data;
            console.log(res.data.total);
            that.total=parseInt(res.data.total);
          }
          console.log(res);
        });
      },
      editClick(res) {
        console.log(res);
        this.form = res;
        this.dialogFormVisible = true;
        //this.demo=true;
      },
      addClick() {
        this.dialogFormVisible = true;
      },
      //删除事件
      delClick(id) {
        if (id == '') {
          this.$message.error('请传入ID');
          return;
        }
        let that = this;
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          gradeDel({
            id: id
          }).then(res => {
            if (res.code == 200) {
              var type = 'success';

              setTimeout(that.initData, 1000); //延迟加载

            } else {
              var type = 'error';
            }
            this.$message({
              type: type,
              message: res.msg
            });
          });
        })
      },
      //添加数据
      addData() {
        let that = this;
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            //提交数据接口
            gradeSave(this.form).then(res => {
              if (res.code == 200) {
                that.close(); //窗口处理
              }
              this.$message.success(res.msg);
            });
          }
        });
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },

      close() {
        this.dialogFormVisible = false;
        this.form = {};
      }

    },
    //初始化状态
    created: function() {
      this.initData();
    },
  }
</script>
