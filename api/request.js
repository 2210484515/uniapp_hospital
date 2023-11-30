const http = {
	baseUrl: 'http://172.16.3.52:81',
	//请求方法
	request(config) {
		//config:请求配置对象,参照uniapp文档
		config.url = this.baseUrl + config.url
		//创建一个Promise对象，在里面发送请求
		return new Promise((resolve, reject) => {
			uni.request(config)
				.then(res => {
					const response = res.data
					resolve(response)
				})
				.catch(err => {
					errorHandle(err)
					reject(err)
				})
		})
	},
	get(url, data) {
		return this.request({
			url: url,
			data: data,
			method: "GET"
		})
	},
	post(url, data) {
		return this.request({
			url: url,
			data: data,
			method: "POST"
		})
	}
}
//请求拦截器
const beforeRequest = (config) => {
	//请求之前做的操作
	console.log('请求拦截器:', config)
	config.header = {}
	//判断该接口是否需要携带token
	if (config.auth) {
		if (uni.getStorageSync('token')) {
			//在请求头添加token
			config.header['token'] =  uni.getStorageSync('token')
				if (uni.getStorageSync('communityId')) {
					config.header['community_id'] = uni.getStorageSync('communityId')
				}
		} else {
			//没有登陆,无访问权限，重定向到登录页面
			
			uni.showModal({
				title: '提示',
				content: '您尚未登录，无访问权限，请登录',
				success(res) {
					if (res.confirm) {
						// 确定按钮被点击
						uni.navigateTo({
							url: '/pages/login/loginPhone'
						})
					} else {
						uni.navigateTo({
						url: '/pages/login/loginPhone'
						})
					}
				}
			})
		}
	}
	return config
}


//响应拦截器
const beforeResponse = (response) => {
	console.log('响应拦截器:', response)
	return response
}

//异常处理器
const errorHandle = (err) => {
	console.log('网络异常,请求失败!', err)
}

export default http
