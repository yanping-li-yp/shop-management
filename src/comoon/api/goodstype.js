import request from '../config/request'

//菜单列表
export function goodsTypeList(params) {
  return request({ url: '/manage/goodsTypeList',method: 'post',data: params})
}

//保存菜单
export function goodsTypeSave(params) {
  return request({ url: '/manage/goodsTypeSave',method: 'post',data: params})
}

//删除菜单
export function goodsTypeDel(params) {
  return request({ url: '/manage/goodsTypeDel',method: 'post',data: params})
}
