import router from './router'
import store from './store'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import VueCookie from 'vue-cookie' //调用Cookie
NProgress.configure({
  showSpinner: false
}) // 进度条配置
const whiteList = ['/login'] // 免登录白名单



router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const adminToken = VueCookie.get('token'); //以
  if (adminToken) {
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      //放到全局状态
      if (store.getters.addRoutes.length > 0) {
        //已经请求
        next()
      } else {
        //数据请求
        store.dispatch('getUserInfo').then(() => {
          let routes = store.getters.addRoutes //全局属性
          router.addRoutes(routes)
          next({...to,replace: true})
        }).catch(() => {
          store.dispatch('logout').then(() => {
            next({
              path: '/login'
            })
          })
        })
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }

})

router.afterEach(() => {
  NProgress.done()
})
