<template>
  <div>
    <el-container style="height: auto;">
      <el-aside :style="{'width':width+'px','min-height':height+'px','background-color':'#344056'}">
        <el-card style="height: 60px;border: 0rem;background-color: #344056;color: #FFF; text-align: center;">
          <span v-if="!iscollapse">管理控制台</span>
          <span v-else>
            <i class="el-icon-s-grid"></i>
          </span>
        </el-card>
        <el-menu background-color="#344056" text-color="#fff" active-text-color="#ffd04b" :default-active="activeIndex"
          :unique-opened="true" @select="handleSelect" :collapse="iscollapse">
          <div v-for="(item,i) in menuList" :key="item.id">
            <el-submenu :index="item.id" v-if="item.menu==1">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span v-if="!iscollapse">{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="(sub,s) in item.submenu" :key="sub.id" :index="sub.url">{{sub.title}}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item :index="item.url" v-else>
              <i class="el-icon-menu"></i>
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
          </div>

        </el-menu>
      </el-aside>
      <el-container>
        <el-header
          style="text-align: right; font-size: 12px;background: #FFF;box-shadow: 0 1px 57px 0 rgb(0 0 0 / 10%);">

          <el-breadcrumb style="margin-right: 0.75rem;">
            <i :class="icon" @click="small"></i>
          </el-breadcrumb>


          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in navList" :key="item">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logout()">注销</el-dropdown-item>
              <el-dropdown-item @click.native="clear()">清除缓存</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{name}}</span>
        </el-header>

        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="20%" :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

  .el-menu {
    border-right: none;
  }

  .el-breadcrumb {
    width: auto;
    height: 60px;
    line-height: 60px;
    float: left;
  }

  .el-menu-item-group__title {
    padding: 0rem;
  }
</style>
<script>
  import {
    menuSeach
  } from '../comoon/api/menu.js'
  export default {
    data() {
      return {
        height: 500,
        width: 200,
        iscollapse: false, //菜单显示隐藏
        dialogVisible: false,
        name: '',
        icon: 'el-icon-s-fold', //图标
        menuList: [],
        navList: [1, 2],
        activeIndex: '/index',
      }
    },

    methods: {
      //展开缩放
      small() {
        //判定
        if (this.iscollapse) {
          //展开
          this.width = 200;
          this.icon = "el-icon-s-fold";
          this.iscollapse = false;
        } else {
          //收起
          this.width = 66;
          this.icon = "el-icon-s-unfold";
          this.iscollapse = true;
        }

      },
      handleSelect(key, keyPath) {
        this.$router.push(key);
        //第一种方法
        //console.log(this.$router.options.routes[0].children[keyPath[0]].meta);

        //第二种面包屑获取方法
        var list = [];
        for (var i = 0; i < this.menuList.length; i++) {
          if (this.menuList[i]['submenu'] != undefined) {
            //获取一级菜单
            for (var j = 0; j < this.menuList[i]['submenu'].length; j++) {
              //获取二级菜单
              if (this.menuList[i]['submenu'][j]['url'] == keyPath[1]) {
                list[0] = this.menuList[i]['title'];
                list[1] = this.menuList[i]['submenu'][j]['title'];
              }
            }
          }
        }
        this.navList = list;
        // console.log(list);
      },
      //关闭对话框按钮
      handleClose() {
        this.dialogVisible = false;
      },
      //注销登录
      logout() {
        this.$confirm('确认注销登录？')
          .then(_ => {
            this.$cookie.delete('name');
            this.$cookie.delete('token');
            this.$cookie.delete('uid');
            localStorage.setItem('menuList', '');
            this.menuList = '';
            this.$router.push({
              path: '/login'
            }); //跳转到登录页面
          })
          .catch(_ => {});
      },
      clear() {
        var that = this;
        //清除菜单缓存，重新请求数据加载
        menuSeach().then(function(response) {
          //console.log("aaa");
          that.menuList = response.data;
          localStorage.setItem('menuList', JSON.stringify(response.data)); //把全局日志处理下
        })
        this.$message({
          showClose: true,
          message: '清除成功',
          type: 'success'
        });
        setTimeout(
          location.reload(),
          1000
        );
      }
    },
    //vue生命周期的起始状态
    mounted: function() {
      this.height = window.screen.height - 111;
      console.log(window.screen.height); //监控屏幕高度
      var that = this;
      // console.log(this.$router);
      //this.$store.state['pathName'] = '123345';
      // console.log(this.$store.state['pathName']); //vuex全局状态
      // console.log(localStorage.getItem('menuList'));
      let menu = localStorage.getItem('menuList'); //菜单数据,每次用户登录更新、从layout.vue
      if (menu != '') {
        that.menuList = JSON.parse(menu); //转化成JSON数组,序列化数组
      } else {
        menuSeach().then(function(response) {
          that.menuList = response.data;
          localStorage.setItem('menuList', JSON.stringify(response.data));
        })
      }

      //this.name = localStorage.getItem('name'); //获取会员真实用户名
      this.name = this.$cookie.get('name'); //改成cookie登录
    }

  };
</script>
