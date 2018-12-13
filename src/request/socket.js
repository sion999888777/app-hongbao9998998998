import {
	AsyncStorage,
	DeviceEventEmitter,
	Alert
} from 'react-native'
import { regAuth, processData, sendMessage } from './bufTrans'
// 基础配置
window.navigator.userAgent = 'ReactNative'

import config from './config'

const options = {
	jsonp: false
}

// 允许重连次数
const TIMES = 10

// 验证 token 超时时间 5s
const TIME_OUT = 5000

// 心跳间隔时间
const HEART_TIME= 3000
let task = []




class Socket {
	constructor() {
		//首次使用构造器实例
		// if (!Socket.instance) {
			
			// this.ws = new WebSocket(config.socketBase, options)
			// this.ws.binaryType = 'arraybuffer'
			this.ws = null
			// this.wx.readyState
			// 0: 表示正在链接
			// 1: 表示链接成功,可以通信了
			// 2: 表示链接正在关闭
			// 3: 表示链接已经关闭, 或者打开链接失败
			
			// 定时器
			this.timer = null
			
			// 重连次数
			this.times = 0

			// 心跳次数
			this.heartTimes = 0

			// 心跳定时器
			this.heartTimer = null
			
			// 重连间隔
			this.duration = 4500

			// 链接状态
			this.connectState = false

			this.isOwnClose = false
			
			// 认证状态
			this.authToken = false
			//将 this 挂载到 Socket 这个类的instance属性上
			// Socket.instance = this
		// }

		// return Socket.instance
	}
	
	
	init(task = []) {
		
		// if (!this.connectState) {
		// 	console.warn('--------->初始化失败')
		// 	return this
		// }
		
		
		// 自动调用
		this.ws = new WebSocket(config.socketBase, options)
		this.ws.binaryType = 'arraybuffer'
		
		// 打开链接
		this.ws.onopen = async () => {
			
			if (this.ws.readyState === 1) {
				this.regAuthToken()
					.then(res => {
						console.warn('认证成功返回=', res)
						this.heartbeat()
						this.heartbeatResult()
					})
					.catch(err => console.warn('认证失败'))
				
			} else {
				this.resetConnect()
			}
		}
		
		// 监听错误消息 重新链接
		this.ws.onerror = () => {
			// 不是自己关闭 并且 没有在链接中
			this.resetConnect()
		}
		
		// 监听错误消息 重新链接
		this.ws.onclose = () => {

			console.warn('监听到 socket 关闭!')
			if (!this.isOwnClose) {
				this.resetConnect()
			}
		}
	}

	// token
	regAuthToken = async () => {
		let token = await AsyncStorage.getItem('token').then()

		if (!token) {
			this.close()
			return Promise.reject('token不存在请登录')
		}

		

		let auth = await regAuth()
		this.ws.send(auth)

		const startTime = new Date().getTime()
		let authTimer = null
		let result = false
		// 2457 重复登录
		return new Promise((resolve, reject) => {
			authTimer = setInterval(() => {
			let nowTime = new Date().getTime()

			if (result === true) {
				clearInterval(authTimer)
				authTimer = null
			}

			if (nowTime - startTime >= TIME_OUT && !result) {
				clearInterval(authTimer)
				authTimer = null
				
				Alert.alert(
					'提示', 
					'请求超时!',
					[
						{text: '确定', onPress: () => { console.warn('确定')}}
					]
				)
				DeviceEventEmitter.emit('err', '请求超时!')
				return reject('请求超时')
			}
		}, 500)
			
			this.capture(2, (res) => {

				result = true
				this.clearTimer()
				clearInterval(authTimer)
				authTimer = null
		
				if (res.body.status !== 200) {
					// 登录已过期, 请重新登录!
					this.authToken = false
					this.close()
					
					AsyncStorage.removeItem('token')
					DeviceEventEmitter.emit('tokenPastDue', '认证已过期请登录再试')
					
					return reject('认证已过期请登录再试')
				} else {
					this.authToken = true
					this.connectState = true
					this.times = 0
					// DeviceEventEmitter.emit('auth', JSON.stringify(res.body.result))
					DeviceEventEmitter.emit('ChangeUI', { auto: true})
					return resolve('认证成功!')
				}
			})
		})
	}
	
	
	// 等待上一次链接返回结果之后 再重连
	resetConnect = (task = []) => {
		if (!this.ws) return false

		this.close()
		console.warn('socket-->重连!')

		this.timer = setTimeout(() => {
				this.times++
				// console.warn('重连次数', this.times, '链接状态', this.ws.readyState, '链接次数', this.times)

				if (this.times >= TIMES) {
					DeviceEventEmitter.emit('err', '服务器异常!')
					Alert.alert(
						'提示',
						'服务器异常!',
						[
							{text: '确定'}
						]
					)
					
					this.clearTimer()
					this.connectState = false
				} else {
					this.init(task)
				}
			}, this.duration)
	}
	
	// 发送消息
	send(data, type) {
		let  params = sendMessage(data, type)

		
		let timer = null
		if (this.connectState === true) {
			clearTimeout(timer)
			timer = null
			this.times = 0
			
			this.ws.send(params)

		} else {

			timer = setTimeout(() => {
				
				clearTimeout(timer)
				timer = null


					// 如果堆栈中有 任务 并且没有连上 就将 事件放入到堆栈当中
					let assignment = task.find(item => item.type, type)
					if (!assignment) {
						task.push({type, params})
					}
					console.warn('堆栈-->', console.warn(JSON.stringify(task)))

					this.resetConnect()
			}, 1000)
		}
	}
	
	// 获取消息
	capture(type = 0, cb = () => {}) {
		this.ws.addEventListener('message', (event) => {
		
			let data = processData(event.data)

			if (parseInt(data.type) == parseInt(type)) {
				cb(data)
			}
		})
	}
	
	clearTimer(timer = this.timer) {
		if (timer) {
			clearTimeout(timer)
			clearInterval(timer)
			this.timer = null
		}
	}
	
	// 关闭链接
	close() {
		console.warn('关闭服务器')

		this.clearTimer()
		this.clearTimer(this.heartTimer)

		this.isOwnClose = true
		this.connectState = false
		this.ws.close()
	}

	heartbeat() {
		this.clearTimer(this.heartTimer)

		this.heartTimer = setInterval(() => {
			// console.warn('在吗?')
			this.heartTimes++

			if (this.heartTimes >= 10) {
				DeviceEventEmitter.emit('err', '服务器已断开链接!')
				
				Alert.alert(
					'提示', 
					'服务器已断开链接!',
					[
						{text: '确定', onPress: () => { console.warn('确定')}}
					]
				)
				
				this.clearTimer(this.heartTimer)
				this.heartTimes = 0
				this.close()
			}

			this.send({type: 3}, 3)
		}, HEART_TIME)
	}

	heartbeatResult = () => {
		this.capture(4, (res) => {
			if (res.body.status === 200) {
				// console.warn('在呢')
				this.heartTimes = 0
			}
		})
	}

//	// 心跳
//	heartbeat() {
//		this.clearTimer()
//		setduration(() => {
//			this.send({type: 0x3}, 3)
//			this.capture(4, (res) => {
//				// console.warn('心跳'+new Date().getTime(), res.body.status)
//			})
//
//		}, 10000000)
//	}
}

const ws = new Socket()

ws.init()

export default ws
