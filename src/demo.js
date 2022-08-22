import router from './router' //创建引用路由文件
import store from './store' //调用过去VUEX
import VueCookie from 'vue-cookie' //调用Cookie
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import {
  menuSeach
} from './comoon/api/menu.js' //直接API
NProgress.configure({
  showSpinner: false
}) // 进度条配置
let token = VueCookie.get('token'); //
let child = [] //字菜单路由
//新增路由
let menu = localStorage.getItem('menuList'); //菜单数据,每次用户登录更新、从layout.vue
let menuList=[]
if (menu != '') {
 menuList= JSON.parse(menu); //转化成JSON数组,序列化数组
} else {
  //网络请求
  menuSeach().then(function(response) {
    menuList = response.data;
    localStorage.setItem('menuList', JSON.stringify(response.data));
  })
}



//无限级路由 提取有URL地址的数据
function menuAraay(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].url != "#" && arr[i].url != "") {
      let data = {
        path: arr[i].url,
        name: arr[i].url.substr(1),
        component: arr[i].compont_path
      }
      child.push(data);
    } else {
      //如果一级菜单的地址是空，或是#代表他有二级菜单
      if (arr[i].submenu.length > 0) {
        menuAraay(arr[i].submenu); //给自身传递数据，循环
      }
    }
  }
}
//console.log(child);


//自动生成路由，主要是替换component
function createRoute(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].component) return
    //自动生成component
    let componentFun = import(`./views${arr[i].component}.vue`) //模板写法'' 字符串 ``解析变量
    arr[i].component = () => componentFun
  }
  return arr;
}
//错误捕捉，try catch
try{
menuAraay(menuList); //调用
  //生成我们所需要的路由JSON格式
  let baseRoutes = [{
    path: '/',
    name: '',
    redirect: "user",
    component: (resolve) => require(['./views/layout.vue'], resolve),
    children: createRoute(child)
  }]
  router.addRoutes(baseRoutes); //新增路由，添加路由规则
}catch(error){
  console.log(error);
}



//免登录(login,logout,reg);
let noneLogin = ['/login', '/logout', '/reg', '/404'] //0


//导航守卫，权限管理, 拦截器开启
router.beforeEach((to, from, next) => {
  //开启动加载条
  NProgress.start()
   //当前访问路径是否需要登录
    
     if (token == '' || token == null) {
       next('/login') //没有登录直接去登录
     } else {
    
       if(menuList!=''){
         next();
       }else{
         menuAraay(menuList); //调用
           //生成我们所需要的路由JSON格式
           let baseRoutes = [{
             path: '/',
             name: '',
             redirect: "user",
             component: (resolve) => require(['./views/layout.vue'], resolve),
             children: createRoute(child)
           }]
           router.addRoutes(baseRoutes); //新增路由，添加路由规则
           next({...to,repalce:true});
       }
      
     }
   }
})

//结束
router.afterEach(() => {
  //关闭加载条
  NProgress.done()
})
