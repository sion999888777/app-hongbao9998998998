import JSEncrypt from 'jsencrypt'

import Request from '../request'
const http = new Request()

// 登录
export const login = (data) => {
	
	const requireEncryptStr = ['phoneNum', 'password']
	data.phoneNum = String(data.phoneNum).replace(/\+/g, '')

	return encrypt(data, requireEncryptStr)
		.then((encryptData) => {
			return http.post('/appLogin', encryptData)
		})
}

// 注册
export const register = (data) => {
	// 需要加密的字段
	const requireEncryptStr = ["phone", "password"]
	
	data.phone = String(data.phone).replace(/\+/g, '')
	return encrypt(data, requireEncryptStr)
		.then((encryptData) => {
			return http.post('/appRegister', encryptData)
		})
}

// 重置密码
export const resetPassword = (data) => {
	// 需要加密的字段
	const requireEncryptStr = ['phone', 'newPassword']
	data.phone = String(data.phone).replace(/\+/g, '')

	return encrypt(data, requireEncryptStr)
		.then((encryptData) => {
			return http.post('/appResetPassword', encryptData)
		})
}

// 找回密码
export const findPassword = (data) => {
	// 需要加密的字段
	const requireEncryptStr = ['phoneNum']
	data.phoneNum = String(data.phoneNum).replace(/\+/g, '')

	return encrypt(data, requireEncryptStr)
		.then((encryptData) => {
			return http.post('/appVertifyCode', encryptData)
		})
}

// 获取短信验证码
export const getSmsCode = (data) => {
	// 需要加密的字段
	const requireEncryptStr = ['phoneNum']
	
	const reg = /^((\+86|0086))?1[3,5,6,7,8]\d{9}$/
	let phoneNum =  data.phoneNum

	// 判断是否是国际号码 0 国际 1国内
	data.isInternational = reg.test(String(phoneNum).replace(/\s+/g, '')) ? 1 : 0
	data.phoneNum = String(phoneNum).replace(/\+/g, '')

	return encrypt(data, requireEncryptStr)
		.then((encryptData) => {
			return http.post('/smsCode', encryptData)
		})
}

/**
 * 个人中心 - 修改手机号 - 验证 旧手机号的短信验证码是否正确
 * @param {*} data 
 */
export const verifyCodeHttp = (data) => {
	// 需要加密的字段
	const requireEncryptStr = ['phoneNum']

	return encrypt(data, requireEncryptStr)
		.then((encryptData) => {
			return http.post('/appVertifyCode', encryptData)
		})
}


/*
* JSEncrypt 公钥加密方法
* @param 对象
* return resolve(加密之后的对象)
*/
function encrypt(encryptData = {}, requireEncryptStr = []) {
	return new Promise((resolve, reject) => {
		http
			.post('/appPublicKey')
			.then(res => {
				if (res.status !== "200") {
					return reject(res.msg)
				}
				
				let encrypt = new JSEncrypt()
				
				// 设置公钥规则
				encrypt.setPublicKey(res.data)
				
				let Obj = {}
				
				Object.keys(encryptData)
					.forEach(v => {
						// 只给需要加密的属性加密
						if (requireEncryptStr.find(val => val === v)) {
							Obj[v] = encrypt.encrypt(encryptData[v])
						} else {
							Obj[v] = encryptData[v]
						}
				})
				
				// 加密后的对象
				return resolve(Obj)
		})
		.catch(err => {
			return reject(err)
		})
	})
}

/********************************************** */


