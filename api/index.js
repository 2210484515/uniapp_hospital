//封装具体的接口调用
import http from './request.js'


//获取排队信息
export function getQueue(params) {
	return http.get('/dev-api/system/information/Nowlist?' + params, "")
}
//获取科室信息
export function getDepartment(params) {
	return http.get('/dev-api/system/department/' + params)
} 
//获取医生信息
export function getDoctor(params) {
	return http.get('/dev-api/system/doc/' + params)
}
