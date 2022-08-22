<template>
  <div>
    <!--
    blur true false  0,1
    <input type="checkbox" checked="checked" @change="demo" v-model="all" />全选
    <div v-for="item in selectList">
      <input type="checkbox" :checked="item.check" />{{item.name}}
    </div>
 -->


    <el-row>
      <el-button type="primary" size="small" @click="addData">添加</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="rule_name" label="菜单名称" width="500"></el-table-column>
      <el-table-column prop="rules" label="菜单ID" width="500"></el-table-column>
      <el-table-column fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="editClick(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="delClick(scope.row.id)">删除</el-button>
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="角色权限">
          <el-row v-for="(item,index) in menuList" :key="index">
            <el-checkbox :indeterminate="itemIndeterminate(item)" v-model="item.check"
              @change="handleCheckAllChange(item)">
              {{item.title}}
            </el-checkbox>
            <div style="margin: 15px 0;"></div>

            <!--group 组件-->
            <el-checkbox-group v-model="form.rules" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="it in item.submenu" :label="it.id" :key="it.id" @change="checknow(item,index)">
                {{it.title}}
              </el-checkbox>
            </el-checkbox-group>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  const cityOptions = [];
  import {
    rulesList,
    rulesDel,
    rulesSave
  } from '../../comoon/api/rules.js'
  export default {
    data() {
      return {
        tableData: [],
        form: {
          rules: [], //数据的双向绑定 [+3,2,4,5,6+]  str.split(,)
          name: '',
          id: '',
        },
        all: 0,
        selectList: [{
            id: 1,
            check: false,
            name: '语文'
          },
          {
            id: 2,
            check: false,
            name: '数学'
          }
        ],
        menuList: [],
        dialogVisible: false, //对话框显示状态
        checkAll: false,
        checkedCities: [],
        cities: cityOptions,
        isIndeterminate: true,
        rules: {
          name: [{
              required: true,
              message: '请输入活动名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 5,
              message: '长度在 3 到 5 个字符',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      demo() {
        console.log(this.all);
        for (var i = 0; i < this.selectList.length; i++) {
          this.selectList[i].check = this.all;
        }
      },
      //默认请求数据方法
      initData() {
        let menu = JSON.parse(localStorage.getItem('menuList'));
        //获取菜单
        for (var i = 0; i < menu.length; i++) {
          menu[i]['check'] = false;
        }
        //菜单
        this.menuList = menu;
        //角色列表
        rulesList({
          page: 1
        }).then(res => {
          console.log(res); //获取回调数据
          if (res.code == 200) {
            this.tableData = res.data.data;
          }
        })
      },
      //编辑
      editClick(row) {
        this.dialogVisible = true;
        let data = JSON.stringify(row);
        data = JSON.parse(data);
        data.rules = data.rules.split(',');
        this.form = data; //重新赋值

        //写死了
        /*this.menuList[0]['check'] = true;
        this.menuList[1]['check'] = true;
        this.menuList[2]['check'] = true;
        */
        let that = this;

        this.menuList.forEach(function(value, index, array) {
          if (that.form.rules.indexOf(array[index]['id']) > -1) {
            that.menuList[index]['check'] = true;
          }
        });
        console.log(this.menuList);
        //this.form.rules=this.form.rules.split(',');//39,1,7,37,21,11  分割，字符串转化成列表数组;
      },
      //添加
      addData() {
        this.dialogVisible = true;
      },
      //关闭
      handleClose() {
        let that = this;
        this.dialogVisible = false;
        this.menuList.forEach(function(value, index, array) {
          that.menuList[index]['check'] = false;
        });
        this.form.rules = [];
        this.form.id = '';
        this.form.name = '';
      },
      //删除
      delClick(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          rulesDel({id:id}).then(res => {
            if(res.code==200){
              this.initData();
            }
            this.$message({
              type: 'success',
              message: res.msg
            });
          });

        })

    },
    //提交
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          rulesSave(this.form).then(res => {
            if (res.code == 200) {
              this.handleClose(); //关闭
            }
            this.$message = ({
              type: 'success',
              message: res.msg
            })
            this.from = {}; //清除数据;
            //数据重新加载
            this.initData();
          });
        }
      })

    },
    itemIndeterminate(item) {
      // console.log(item);
    },
    //点击选择，当前点击的ID在已经选择的列表中，代表当前操作是相返的
    handleCheckAllChange(val) {

      console.log(val);

      // this.form.rules=["21","37","20"];
      //splice,delete,remove, prop,shift
      //delete this.form.rules[0];
      // this.form.rules.remove(0);
      // this.form.rules.splice(0,1);//
      let num = 0;
      //重复是-1代表没有添加，用push往里面添加，如果已经存在，splice删除
      if (val.check == true) {
        this.form.rules.push(val.id); //添加
        num = 1;
      } else {
        this.form.rules.splice(this.form.rules.indexOf(val.id), 1); //删除
      }

      for (let i = 0; i < val.submenu.length; i++) {
        if (num == 1) {
          if (this.form.rules.indexOf(val.submenu[i].id) < 0) {
            this.form.rules.push(val.submenu[i].id); //添加
          }
        } else {
          this.form.rules.splice(this.form.rules.indexOf(val.submenu[i].id), 1); //删除
        }

      }



    },

    //点击获取当前元素
    checknow(val, index) {
      console.log(index); //上级菜单所在位置
      console.log(val); //上级菜单数据
      var n = 0;
      for (let i = 0; i < val.submenu.length; i++) {
        //判定是否重复
        if (this.form.rules.indexOf(val.submenu[i].id) > -1) {
          n++;
        }
      }
      if (n > 0) {
        this.menuList[index]['check'] = true;
      } else {
        this.menuList[index]['check'] = false;
      }
    },
    //点击所当前所有元素
    handleCheckedCitiesChange(value) {
      console.log(value);
    }

  },
  //打开页面就做API请求
  mounted: function() {
    this.initData();
  }
  };
</script>
