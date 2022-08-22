<template>
  <div>
    <el-row>
      <el-input type="text" style="width: 200px;" placeholder="请输入面额"></el-input>

      <el-button type="success" size="small">搜索</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="编号" width="100"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="account" label="账号" width="150"></el-table-column>
      <el-table-column prop="password" label="密码" width="150"></el-table-column>
      <el-table-column prop="value" label="面额"></el-table-column>
      <el-table-column prop="send_text" label="是否发放"></el-table-column>
      <el-table-column prop="status_text" label="状态"></el-table-column>
      <el-table-column prop="user_id" label="发放用户"></el-table-column>
      <el-table-column prop="time" label="起始日期" width="320"></el-table-column>
      <el-table-column fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="info" v-if="scope.row.is_send=0" size="small" @click="sendClick(scope.row)" icon="el-icon-delete">发放</el-button>
          <el-button type="danger" size="small" @click="delClick(scope.row.id)" icon="el-icon-delete">删除</el-button>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block" style="margin-top: 20px;">

      <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange"
        :current-page="currentPage" :page-size="currentPageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog title="发放" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm" :label-width="labelWidth">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="面额">
          <el-input v-model="form.value" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="会员">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendData">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    couponList,
    couponSave,
    couponDel,
    couponSend
  } from '../../comoon/api/coupont.js'; //调用外部JS文件
  export default {
    data() {
      return {
        currentPage: 1,
        currentPageSize: 10,
        total: 0,

        dialogFormVisible: false,
        form: {
          name: '',
          money: 0,
        },
        formLabelWidth: 200,
        labelWidth: '100px',
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
          page: this.currentPage,
          pagesize: this.currentPageSize
        }
        couponList(params).then(res => {
          if (res.code == 200) {
            let map = res.data.data;
            let send_arr = ['未发放', '已发放'];
            let status_arr = ['未使用', '已使用'];
            map.forEach(function(item, index) {
              map[index]['send_text'] = send_arr[item['is_send']];
              map[index]['status_text'] = status_arr[item['status']];
              map[index]['time'] = item['start_time'] + ' - ' + item['end_time'];
            })

            that.tableData = map;
            that.total = parseInt(res.data.total);
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
      //发放
      sendClick(res) {
        this.form = res;
        this.dialogFormVisible = true;
      },
      async sendData() {
        console.log(this.form);
        let params = {
          id: this.form.id,
          name: this.form.username
        }

        let res = await couponSend(params);
        this.$message(res.msg);
        if (res.code == 200) {
          this.close();
          this.initData();
        }
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
          couponDel({
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

      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.currentPageSize = val;

      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.initData(); //进行分页请求数据
      },

      close() {
        this.dialogFormVisible = false;
        this.form = {};
        this.page = 1;
        this.initData();
      }

    },
    //初始化状态
    created: function() {
      this.initData();
    },
  }
</script>
