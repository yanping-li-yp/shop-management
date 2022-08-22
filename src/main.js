// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import VueCookie from 'vue-cookie' //调用Cookie
import * as echarts from 'echarts'

import router from './router' //创建引用路由文件
import store from './store' //调用过去
import permission from './permission.js' //导航守卫

//axios.defaults.baseURL = '/api'  //默认地址
Vue.prototype.$http = axios;
Vue.prototype.$host = "http://shop.ueoa.net/";
Vue.prototype.$echarts = echarts

Vue.use(VueCookie); //进行绑定
Vue.use(ElementUI);
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,//调用
  store,
  components: {
    App,
  },
  template: '<App/>'
})
