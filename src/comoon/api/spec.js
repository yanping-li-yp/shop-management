import request from '../config/request'

//菜单列表
export function specList(params) {
  return request({ url: '/manage/specList',method: 'post',data: params})
}

//保存菜单
export function specSave(params) {
  return request({ url: '/manage/specSave',method: 'post',data: params})
}

//删除菜单
export function specDel(params) {
  return request({ url: '/manage/specDel',method: 'post',data: params})
}
