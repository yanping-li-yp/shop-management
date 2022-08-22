import request from '../config/request'

//菜单列表
export function orderList(params) {
  return request({ url: '/manage/orderList',method: 'post',data: params})
}

//保存菜单
export function orderSave(params) {
  return request({ url: '/manage/orderSave',method: 'post',data: params})
}

//删除菜单
export function orderDel(params) {
  return request({ url: '/manage/orderDel',method: 'post',data: params})
}


//订单配送
export function orderSend(params) {
  return request({ url: '/manage/orderSend',method: 'post',data: params})
}
