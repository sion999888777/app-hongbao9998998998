import Socket from "../socket"
import { TYPES } from '../config'

const ws = new Socket()
ws.init()

/**
 * 获取用户个人信息
 * @param {*} data 
 */
export function getUserInfoSocket(data = {}) {
	let { OP_USER_CENTER, OP_USER_CENTER_REPLY } = TYPES.OP_USER_CENTER
	
	ws.send(data, OP_USER_CENTER)

	return new Promise((resolve, reject) => {
		ws.capture(OP_USER_CENTER_REPLY, (data) => {
			// console.warn('获取个人信息数据---->', data)
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}


/**
 * 修改个人信息
 * @param {*} data 
 */
export function modifyUserInfoSocket(data = {}) {
	let { OP_USER_CENTER_UPDATE, OP_USER_CENTER_UPDATE_REPLY } = TYPES.OP_USER_CENTER_UPDATE
	
	ws.send(data, OP_USER_CENTER_UPDATE)

	return new Promise((resolve, reject) => {
		ws.capture(OP_USER_CENTER_UPDATE_REPLY, (data) => {
			// console.warn('个人信息修改成功---->', data)
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

/**
 * 个人中心 - 等级任务 - 任务列表
 * @param {*} data 
 */
export function getTaskDataSocket(data = {}) {
	let { OP_USER_LEVEL_MGT_LIST, OP_USER_LEVEL_MGT_LIST_REPLY } = TYPES.OP_USER_LEVEL_MGT_LIST
	
	ws.send(data, OP_USER_LEVEL_MGT_LIST)
	
	return new Promise((resolve, reject) => {
	
		ws.capture(OP_USER_LEVEL_MGT_LIST_REPLY, (data) => {
			// console.warn('获取任务列表数据---->', data)
		
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

/**
 * 个人中心 - 等级任务 - 完成进度
 * @param {*} data 
 */
export function getCompleteDataSocket(data = {}) {
	let { OP_USER_LEVEL_MGT_DETAILS, OP_USER_LEVEL_MGT_DETAILS_REPLY } = TYPES.OP_USER_LEVEL_MGT_DETAILS
	
	ws.send(data, OP_USER_LEVEL_MGT_DETAILS)
	
	return new Promise((resolve, reject) => {
	
		ws.capture(OP_USER_LEVEL_MGT_DETAILS_REPLY, (data) => {
			// console.warn('获取完成进度数据---->', data)
			
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}


/**
 * 个人中心 - 我的道具
 * @param {*} data 
 */
export function getPropDataSocket(data = {}) {
	let { OP_USER_PROP, OP_USER_PROP_REPLY } = TYPES.OP_USER_PROP
	
	ws.send(data, OP_USER_PROP)
	
	return new Promise((resolve, reject) => {
		
		ws.capture(OP_USER_PROP_REPLY, (data) => {
			// console.warn('获取道具数据---->', data)
		
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

/**
 * 获取 个人中心 - 账户数据
 * @param {*} data 
 */
export function getAccountDataSocket(data = {}) {
	let { OP_USER_CAPITAL_FLOW, OP_USER_CAPITAL_FLOW_REPLY } = TYPES.OP_USER_CAPITAL_FLOW
	
	ws.send(data, OP_USER_CAPITAL_FLOW)
	
	return new Promise((resolve, reject) => {
		ws.capture(OP_USER_CAPITAL_FLOW_REPLY, (data) => {
			// console.warn('获取账户数据---->', data)
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

/**
 * 个人中心 - 我的营收- 游戏收入
 * @param {*} data 
 */
export function getGameIncomeDataSocket(data = {}) {
	let { OP_USER_GAME_REVENUE, OP_USER_GAME_REVENUE_REPLY } = TYPES.OP_USER_GAME_REVENUE
	
	ws.send(data, OP_USER_GAME_REVENUE)
	
	return new Promise((resolve, reject) => {
		ws.capture(OP_USER_GAME_REVENUE_REPLY, (data) => {
			// console.warn('个人中心-我的营收-游戏收入数据---->', data)
		
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}


/**
 * 个人中心 - 我的营收- 游戏收入
 * @param {*} data 
 */
export function getRoomIncomeDataSocket(data = {}) {
	let { OP_USER_ROOM_REVENUE, OP_USER_ROOM_REVENUE_REPLY } = TYPES.OP_USER_ROOM_REVENUE
	
	ws.send(data, OP_USER_ROOM_REVENUE)
	
	return new Promise((resolve, reject) => {
		ws.capture(OP_USER_ROOM_REVENUE_REPLY, (data) => {
			// console.warn('个人中心-我的营收-房主收入数据---->', data)
		
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}


/**
 * 个人中心 - 有问题找客服
 * @param {*} data 
 */
export function getContactDataSocket(data = {}) {
	let { OP_CUSTOMER_SERVICE, OP_CUSTOMER_SERVICE_REPLY } = TYPES.OP_CUSTOMER_SERVICE
	
	ws.send(data, OP_CUSTOMER_SERVICE)
	return new Promise((resolve, reject) => {
		ws.capture(OP_CUSTOMER_SERVICE_REPLY, (data) => {
			// console.warn('个人中心-有问题找客服---->', data)
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}


/**
 * 个人中心 - 退出
 * @param {*} data 
 */
export function loginOutSocket(data = {}) {
	let { OP_LOGOUT, OP_LOGOUT_REPLY } = TYPES.OP_LOGOUT
	
	ws.send(data, OP_LOGOUT)
	return new Promise((resolve, reject) => {
		ws.capture(OP_LOGOUT_REPLY, (data) => {
			// console.warn('个人中心-退出---->', data)
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

