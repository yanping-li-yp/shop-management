import request from '../config/request.js' //封装的请求库

//登录接口
export function login(params){
  return request({ url: '/manage/login',method: 'post',data: params})
}

//登录接口
export function logout(params){
  return request({ url: '/manage/login',method: 'post',data: params})
}

//登录接口
export function mangeList(params){
  return request({ url: '/manage/mangeList',method: 'post',data: params})
}
