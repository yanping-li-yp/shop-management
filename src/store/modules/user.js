import {
  menuSeach
} from '../../comoon/api/menu.js'

export default {
  state: {
    addRoutes: [] //路由全局属性
  },
  mutations: {
    setRoute(state, route) {
      state.addRoutes = route
    }
  },
  actions: {
    //获取dispatch(getUserInfo)
    getUserInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        //调用数据请求
        menuSeach().then(res => {
          if (res.code == 200) {
            let routes = res.data //数据源
            let baseRoutes = [{
              path: '/',
              component: (resolve) => require(['@/views/layout.vue'], resolve),
              children: []
            }, ]
            routes.forEach(function(item, index, array) {
              //一级
              if (item.url != "#" && item.url != "") {
                item.path = item.url;
                item.name = item.url.substr(1);
                item.component = (resolve) => require([`@/views${item.compont_path}.vue`], resolve)
                baseRoutes[0].children.push(item)
              } else {
                //二级循环
                item.submenu.forEach(function(sitem, index, array) {
                  sitem.path = sitem.url;
                  sitem.name = sitem.url.substr(1);
                  sitem.component = (resolve) => require([`@/views${sitem.compont_path}.vue`], resolve)
                  baseRoutes[0].children.push(sitem)
                });
              }
            })
            commit('setRoute', baseRoutes)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    //注销
    logout({
      commit
    }) {
      commit('setRoute', '');
    }


  }
}
