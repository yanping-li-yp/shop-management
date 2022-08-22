import request from '../config/request'

//全局列表
export function Api(url,params,method='post') {
  return request({ url: url,method:method,data: params})
}

//优惠劵模板列表
export function couponTemList(params) {
  return request({ url: '/manage/couponTemList',method: 'post',data: params})
}


//优惠劵模板保存
export function couponTemSave(params) {
  return request({ url: '/manage/couponTemSave',method: 'post',data: params})
}



//批量生成优惠劵
export function couponTemAct(params) {
  return request({ url: '/manage/couponTemAct',method: 'post',data: params})
}

//优惠劵模板删除
export function couponTemDel(params) {
  return request({ url: '/manage/couponTemDel',method: 'post',data: params})
}



//优惠劵列表
export function couponList(params) {
  return request({ url: '/manage/couponList',method: 'post',data: params})
}


//优惠劵保存
export function couponSave(params) {
  return request({ url: '/manage/couponSave',method: 'post',data: params})
}


//优惠劵删除
export function couponDel(params) {
  return request({ url: '/manage/couponDel',method: 'post',data: params})
}


//优惠劵发放
export function couponSend(params) {
  return request({ url: '/manage/couponSend',method: 'post',data: params})
}
