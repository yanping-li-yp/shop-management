import request from '../config/request'

//菜单列表
export function goodsList(params) {
  return request({ url: '/manage/goodsList',method: 'post',data: params})
}

//保存菜单
export function goodsSave(params) {
  return request({ url: '/manage/goodsSave',method: 'post',data: params})
}

//删除菜单
export function goodsDel(params) {
  return request({ url: '/manage/goodsDel',method: 'post',data: params})
}
