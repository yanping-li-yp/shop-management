import request from '../config/request' //封装的请求库

// 菜单列表
export function menuSeach(params){
	return request({url: '/manage/menu', method: 'post', data:params})
}

// 保存菜单
export function menuSave(params){
	return request({url: '/manage/menuSave', method: 'post', data: params})
}

// 删除菜单
export function menuDel(params) {
	return request({url: '/manage/menuDel', method: 'post', data: params})
}