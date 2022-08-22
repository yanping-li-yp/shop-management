import request from '../config/request'

//菜单列表
export function goodsCategoryList(params) {
  return request({ url: '/manage/goodsCategoryList',method: 'post',data: params})
}

//保存菜单
export function goodsCategorySave(params) {
  return request({ url: '/manage/goodsCategorySave',method: 'post',data: params})
}

//删除菜单
export function goodsCategoryDel(params) {
  return request({ url: '/manage/goodsCategoryDel',method: 'post',data: params})
}
