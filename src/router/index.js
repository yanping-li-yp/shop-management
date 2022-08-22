import Vue from 'vue'
import Router from 'vue-router'
import Index from "../views/index/index.vue";
//import List from "../components/user/List";
import layout from "../views/layout.vue"
import routes from '../comoon/config/router.js';
Vue.use(Router)
//引用/comoon/config/router.js方法
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({ routes})
