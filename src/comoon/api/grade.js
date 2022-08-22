import request from '../config/request' //引入请求库
//菜单列表
export function gradeList(params) {
  return request({ url: '/manage/gradeList',method: 'post',data: params})
}

export function gradeSave(params) {
  return request({ url: '/manage/gradeSave',method: 'post',data: params})
}


export function gradeDel(params) {
  return request({ url: '/manage/gradeDel',method: 'post',data: params})
}