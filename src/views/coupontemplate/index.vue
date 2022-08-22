<template>
  <div>
    <el-row>
      <el-button type="success" size="small" @click="addClick">添加</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="编号" width="180"></el-table-column>
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="value" label="面额"></el-table-column>
      <el-table-column prop="point" label="所需积分"></el-table-column>
      <el-table-column prop="money" label="需满金额"></el-table-column>
      <el-table-column prop="valid_days" label="有效期"></el-table-column>
      <el-table-column fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="success" size="small" @click="editClick(scope.row)" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="生成" placement="top-start">
            <el-button type="primary" size="small" @click="sendClick(scope.row)" icon="el-icon-document-add">
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" size="small" @click="delClick(scope.row.id)" icon="el-icon-delete"></el-button>
          </el-tooltip>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block" style="margin-top: 20px;">

      <el-pagination @size-change="handleSizeChange" background @current-change="handleCurrentChange"
        :current-page="currentPage" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="添加" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="模板名称" prop="name" :label-width="labelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="面值" prop="value" :label-width="labelWidth">
          <el-input v-model="form.value" placeholder="代金券在购买时所抵金额" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="消费金额" prop="money" :label-width="labelWidth">
          <el-input v-model="form.money" placeholder="订单需满足的最低消费金额(必需为整数)才能使用" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="兑换所需积分" prop="point" placeholder="兑换所需积分只能是数字，必须大于等于0,0表示不能兑换" :label-width="labelWidth">
          <el-input v-model="form.point" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="兑换有效期" prop="valid_days" :label-width="labelWidth">
          <el-input v-model="form.valid_days" placeholder="自兑换日期起，有效的天数,至少是一天" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </div>
    </el-dialog>

    <!--生成优惠劵-->
    <el-dialog title="生成优惠劵" :visible.sync="dialogSendVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="名称" :label-width="labelWidth">
          <span>{{form.name}}</span>
        </el-form-item>
        <el-form-item label="面值" prop="value" :label-width="labelWidth">
          <span>{{form.value}}</span>
        </el-form-item>
        <el-form-item label="有效时间" prop="time" :label-width="labelWidth">
          <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"
            v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="张数" prop="num" :label-width="labelWidth">
          <el-input size="small" placeholder="请输入数字" style="width: 200px;" v-model="form.num" autocomplete="off">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary" @click="addSendData">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    couponTemList,
    couponTemSave,
    couponTemDel,
    couponTemAct
  } from '../../comoon/api/coupont.js'; //调用外部JS文件
  export default {
    data() {
      return {
        currentPage: 1,
        total: 0,
        demo: false,
        dialogSendVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          money: 0,
          point: 0,
        },
        labelWidth: '100px',
        tableData: [],
        rules: {
          name: [{
            required: true,
            message: '请输入活动名称',
            trigger: 'blur'
          }],
          value: [{
            required: true,
            message: '请输入面额',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '必须为数字'
          }
          ],
          money: [{
            required: true,
            message: '请输入消费金额',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '必须为数字'
          }
          ],
          point: [{
            required: true,
            message: '请输入积分',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '必须为数字'
          }
          ],
          valid_days: [{
            required: true,
            message: '请输入兑换有效期',
            trigger: 'blur'
          }],
          time: [{
            required: true,
            message: '请选择时间',
            trigger: 'blur'
          }],
          numer: [{
              required: true,
              message: '请输入数字',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {

      initData() {
        let that = this;
        let params = {
          page: 1
        }
        couponTemList(params).then(res => {
          if (res.code == 200) {
            that.tableData = res.data.data;
            console.log(res.data.total);
            that.total = parseInt(res.data.total);
          }
  
        });
      },
      //编辑
      editClick(res) {

        this.form = res;
        this.dialogFormVisible = true;
        //this.demo=true;
      },
      //添加
      addClick() {
        this.dialogFormVisible = true;
      },
      //生成优惠劵
      sendClick(res) {
        this.form =res;
        this.dialogSendVisible = true;
      },
      //批量创建
      addSendData() {
        let that = this;
        couponTemAct(this.form).then(res => {
          that.message(res.code, res.msg);
          if (res.code == 200) {
            that.form={
              num:0
            };
            that.close();
          }
        });
      },
      message(code, msg) {
        if (code == 200) {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
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
          couponTemDel({
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
            couponTemSave(this.form).then(res => {
              if (res.code == 200) {
                that.close(); //窗口处理
                that.initData();
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

        this.dialogSendVisible = false;
        this.dialogFormVisible = false;
        this.form = {};

        console.log(this.form);
      }

    },
    //初始化状态
    created: function() {
      this.initData();
    },
  }
</script>
