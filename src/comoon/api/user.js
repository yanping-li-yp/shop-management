import request from '../config/request'

export function userList(params) {
	return request({url: '/manage/userlist', method: 'post', data: params})
}

// 添加数据
export function userSave(params) {
	return request({url: '/manage/userSave', method: 'post', data: params})
}

export function userDel(params) {
  return request({ url: '/manage/userDel',method: 'post',data: params})
}