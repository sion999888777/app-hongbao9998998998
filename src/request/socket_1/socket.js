/*
import { regAuth, processData, sendMessage } from '../bufTrans'
import TYPES from '../config'

export const SocketContainer = () => {
	const that = {}
	let _socket = null
	
	// 心跳
	const heartCheck = {
		timeout: 10000,
		timeoutObj: null,
		serverTimeoutObj: null,
		
		reset: () => {
			clearTimeout(this.timeoutObj)
			clearTimeout(this.serverTimeoutObj)
			return this
		},
		
		start: () => {
			this.timeoutObj = setTimeout(()=> {
				console.log("发送ping")
				_socket.send({
					data:"ping",
				})
				this.serverTimeoutObj = setTimeout(() =>{
					_socket.close()
				}, this.timeout)
			}, this.timeout)
		}
	}
	
	// 初始化
	const init = () => {
		_socket = new WebSocket('ws://10.11.19.141:8091/api')
		_socket.binaryType = 'arraybuffer'
		
		_socket.onmessage((event) => {
			let res = processData(event.data)
			
			// 处理分发消息
			dispose(res)
		})
		
		_socket.onopen(()=>{
			// 链接打开 开始认证
			that.auth()
		})
		
		_socket.onerror(()=>{
			console.log('WebSocket连接打开失败')
		})
		
		_socket.onclose(()=> {
			console.log('WebSocket 已关闭！')
			
			reconnect()
		})
	}
	
	const send = (data) => {
		if (_socket) {
			let  params = sendMessage(data, type)
			_socket.send(params)
		}
	}
	
	const dispose = (res) => {
		const type = res.type
		const body = res.body
		
		switch (type) {
			case 2: // 认证结果
					that.onauth(body)
				break
			case 4: // 心跳返回
					heartCheck.reset().start()
		}
	}
	
	const request = (socket, data) => {
		socket.send()
	}
	
	// 重连
	const reconnect = () => {
		_socket && _socket.close() && (_socket = null)
		init()
	}
	
	// token 认证
	that.auth = async () => {
		let auth = await regAuth()
		_socket.send(auth)
	}
	
	// 处理认证返回
	that.onauth = async (res) => {
		if (res.status === 200) {
			console.warn('认证成功!')
		}
	}
	
	init()
	
	return that
}
*/

/*
export const Socket = new WebSocket(config.socketBase, options)
Socket.binaryType = 'arraybuffer'

// 发送消息
export function send(data, type) {
	let  params = sendMessage(data, type)
	let timer = null
	if (Socket.readyState === 1) {
		this.times = 0
		Socket.send(params)
	} else {
		timer = setduration(() => {
			if (Socket.readyState === 1) {
				clearduration(timer)
				timer = null
				Socket.send(params)
			}
		}, 100)
	}
}

// 获取消息
export function capture(type = 0, cb = () => {}) {
	Socket.addEventListener('message', (event) => {
		
		let data = processData(event.data)

		// console.warn('接收的消息TYPE = ', type)
		if (parseInt(data.type) == parseInt(type)) {
			cb(data)
		}
	})
}


// 打开链接
Socket.onopen = async () => {
	if (Socket.readyState === 1) {

		let auth = await regAuth()
		if (!auth) return Promise.reject()

		Socket.send(auth)
		let startTime = new Date().getSeconds()

		return Promise((resolve, reject) => {
			// 2457 重复登录
			capture(2, (res) => {
				if (res.body.status === 500) {
					SyncStorage.removeItem('token')

					return reject('登录已过期, 请重新登录!')
				} else {
					return resolve('认证成功!')
				}
			})
		})		
	}	
}

// 监听错误消息 重新链接
Socket.addEventListener('error', () => {
	// 不是自己关闭 并且 没有在链接中
	if (!this.isOwnClose && this.ws.readyState !== 0) {
		this.resetConnect()
	}
})

// 监听错误消息 重新链接
this.ws.addEventListener('close', (event) => {
	console.warn('服务器断开链接')
})

*/

/*
class SocketController {
	constructor() {
		//首次使用构造器实例
		if (!SocketController.instance) {
			
			this.socket = new WebSocket(config.socketBase, options)
			this.socket.binaryType = 'arraybuffer'
			// this.wx.readyState
			// 0: 表示正在链接
			// 1: 表示链接成功,可以通信了
			// 2: 表示链接正在关闭
			// 3: 表示链接已经关闭, 或者打开链接失败
			
			// 定时器
			this.timer = null
			
			// 重连次数
			this.times = 0
			
			// 链接状态
			this.connectState = false
			
			//将 this 挂载到 Socket 这个类的instance属性上
			Socket.instance = this
		}
		return SocketController.instance
	}
}







let task = []

function Socket() {
	const _socket = null
	const that = {}
	console.warn('===============================>1')
	let times = 0 // 重连次数
	let timer = null // 定时器
	// 重连间隔
	let duration = 1000
	
	that.init = () => {
		console.warn('===============================>2')
		const _socket = new SocketController()
		// 打开链接
		_socket.onopen = async () => {
			let auth = await regAuth()

			console.warn('auth----->', auth)
			if (auth) {
				_socket.send(auth)
				
				// 2457 重复登录
				capture(2, (res) => {
					if (res.body.status === 500) {
						// 登录已过期, 请重新登录!
						console.warn('认证以过期')
						
						SyncStorage.removeItem('token')
						clearTimer()
						close()
						
						that.connectState = false
					} else {
						console.warn('认证以过期')
						that.connectState = true
						times = 0
						
						// 如果任务栈有未发送任务
						if (task.length > 0) {
							task.forEach(params => {
								_socket.send(params)
							})

							task = []
						}
						// 登录成功!! 开启心跳
						// heartCheck.reset().start(this)
					}
				})
			}
		}
		
		// 监听错误消息 重新链接
		_socket.onerror = resetConnect
			
		
		// 监听错误消息 重新链接
		_socket.onclose = resetConnect
	}
	
	// 等待上一次链接返回结果之后 再重连
	const resetConnect = () => {
		close()
		clearTimer()
		
		timer = setTimeout(() => {
			times++
			// console.warn('重连次数', this.times, '链接状态', this.ws.readyState, '链接次数', this.times)
			
			if (times >= TIMES) {
				clearTimer()
				
				console.warn('服务器故障!!!!!!!')
				that.connectState = false
			} else {
				that.init()
			}
		}, duration)
	}
	
	// 发送消息
	that.send = (data, type) => {
		let params = sendMessage(data, type)
		let timer = null
		
		console.warn('===============================>3', that)
		if (that.connectState === true) {
			
			clearTimer(timer)
			timer = null
			times = 0
			_socket.send(params)
			
		} else {
			
			timer = setTimeout(() => {
					clearTimer(timer)
					timer = null
					console.warn('掉线之后 继续发送数据直到重新链接')

					// 如果堆栈中有 任务 并且没有连上 就将 事件放入到堆栈当中
					let assignment = task.find(item => item.type, type)
					if (!assignment) {
						task.push({type, params})
					}
			}, duration)
		}
	}
	
	// 获取消息
	that.capture = (type = 0, cb = () => {}) => {
		_socket.onmessage(event => {
			
			let data = processData(event.data)
			
			console.warn('接收的消息TYPE = ', parseInt(data.type))
			if (parseInt(data.type) == parseInt(type)) {
				cb(data)
			}
		})
	}
	
	const clearTimer = () => {
		if (timer) {
			clearTimeout(timer)
			timer = null
		}
	}
	
	// 关闭链接
	const close = () => {
		if (_socket) {
			_socket.close()
		}
	}
	
	return that
}

const ws = Socket()
export default ws

*/