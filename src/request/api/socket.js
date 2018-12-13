import ws from "../../request/socket";
import { TYPES, message_type } from '../../request/config'

// export const ws = new Socket()
// ws.init()

// 获取红包详情
export function getPacketDetail(data) {
	let { OP_PACKET_DETAIL, OP_PACKET_DETAIL_REPLY } = TYPES.OP_PACKET_DETAIL
	ws.send(data, OP_PACKET_DETAIL)
	
	return new Promise((resolve, reject) => {
		ws.capture(OP_PACKET_DETAIL_REPLY, (data) => {
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

// 大厅
export function getRoomList(page = 0 , type = 1) {
	let data = {"page": page, "pageSize": 20 }
	let typeTo = 0, // 发送消息 唯一标识符
		typeBack = 0 // 接收对应的消息 唯一标识符
	
	if (type === 1) {
		// 大厅列表
		
		typeTo = TYPES.OP_ROOM_HALL_LIST.OP_ROOM_HALL_LIST
		typeBack = TYPES.OP_ROOM_HALL_LIST.OP_ROOM_HALL_LIST_REPLY
	} else if (type === 2) {
		// 包间列表
		
		typeTo = TYPES.OP_ROOM_PRIVATE_LIST.OP_ROOM_PRIVATE_LIST
		typeBack = TYPES.OP_ROOM_PRIVATE_LIST.OP_ROOM_PRIVATE_LIST_REPLY
	}
	
	// 大厅
	console.warn('发送数据请求')
	ws.send(data, typeTo)
	
	return new Promise((resolve, reject) => {
		ws.capture(typeBack, (data) => {
			// console.warn('退出房间返回数据-->', data)
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject([])
			}
		})
	})
}

// roomGaming 房间是否在游戏中: 0 在；1 不在
// public static final String OP_GO_GAME_HOME_TITLE = "返回游戏主页面";
//     public static final int OP_GO_GAME_HOME_LIST = 0x118;
//     public static final int OP_GO_GAME_HOME_LIST_REPLY = 0x119;


// 进入房间
//OP_ROOM_ENTER
export function entranceRoom(data = {}) {
	let { OP_ROOM_ENTER, OP_ROOM_ENTER_REPLY } = TYPES.OP_ROOM_ENTER
	
	ws.send(data, OP_ROOM_ENTER)
	
	return new Promise((resolve, reject) => {
		ws.capture(OP_ROOM_ENTER_REPLY, (data) => {
			
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

// 表情
export function sendChatEmoji(data = {}) {
	let { OP_ROOM_CHAT_EMOJI, OP_ROOM_CHAT_EMOJI_REPLY } = TYPES.OP_ROOM_CHAT_EMOJI
	
	ws.send(data, OP_ROOM_CHAT_EMOJI)
	
	// return new Promise((resolve, reject) => {
	// 	ws.capture(OP_ROOM_CHAT_EMOJI_REPLY, (data) => {
			
	// 		if (data.body.status === 200) {
	// 			resolve(data.body.result)
	// 		} else {
	// 			reject(data.body.msg)
	// 		}
	// 	})
	// })
}

/*
* 退出房间
* @param = {}
*/
export function exitRoom(data = {}) {
	let { OP_ROOM_OUT, OP_ROOM_OUT_REPLY } = TYPES.OP_ROOM_OUT
	ws.send(data, OP_ROOM_OUT)
	
	return new Promise((resolve, reject) => {
		ws.capture(OP_ROOM_OUT_REPLY, (data) => {
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

// 初始化房间信息 消息广播
export function initRoomDetail() {
	let { OP_ROOM_INIT, OP_ROOM_INIT_REPLY} = TYPES.OP_ROOM_INIT

	ws.send({}, OP_ROOM_INIT)
	
	return new Promise((resolve, reject) => {
		ws.capture(OP_ROOM_INIT_REPLY, (data) => {
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}


// 固定语言聊天
export function sendSysMsg(msg) {
	let { OP_CHAT_TEXT_LIST, OP_CHAT_TEXT_LIST_REPLY} = TYPES.OP_CHAT_TEXT_LIST

	ws.send({chatText: msg}, OP_CHAT_TEXT_LIST)
	
	return new Promise((resolve, reject) => {
		ws.capture(OP_CHAT_TEXT_LIST_REPLY, (res) => {
			if (res.body.status === 200) {
				resolve(res.body.result)
			} else {
				reject(res.body.msg)
			}
		})
	})
}


// 发送红包
export const sendPacket = (data) => {
		const { OP_SEND_PACKET, OP_SEND_PACKET_REPLY } = TYPES.OP_SEND_PACKET
		ws.send(data, OP_SEND_PACKET)

		return new Promise((resolve, reject) => {
			ws.capture(OP_SEND_PACKET_REPLY, (res) => {
				if (res.body.status === 200) {
					let msg = message_type[String(res.body.result.type)] || ''

					resolve({...res.body.result, msg})
				} else {
					reject(res.body.msg)
				}
			})
		})
}



/*
* 抢红包
* @param {pacId: 红包ID, roomId: id}
*/
export function getPacket(data = {}) {
	let { OP_GET_PACKET, OP_GET_PACKET_REPLY } = TYPES.OP_GET_PACKET
	ws.send(data, OP_GET_PACKET)
	
	return new Promise((resolve, reject) => {
		ws.capture(OP_GET_PACKET_REPLY, (data) => {
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

/*
* 拆红包
* @param {pacId: 红包ID, roomId: id}
*/
export function openPacket(data = {}) {
	let { OP_OPEN_PACKET, OP_OPEN_PACKET_REPLY } = TYPES.OP_OPEN_PACKET
	ws.send(data, OP_OPEN_PACKET)
	
	return new Promise((resolve, reject) => {
		ws.capture(OP_OPEN_PACKET_REPLY, (data) => {
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

/*
* 查看红包详情
* @param {pacId: 红包ID, roomId: id}
*/
export function packetDetail(data = {}) {
	let { OP_PACKET_DETAIL, OP_PACKET_DETAIL_REPLY } = TYPES.OP_PACKET_DETAIL
	ws.send(data, OP_PACKET_DETAIL)
	
	return new Promise((resolve, reject) => {
		ws.capture(OP_PACKET_DETAIL_REPLY, (data) => {
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

/*
* 查看红包详情
* @param {pacId: 红包ID, roomId: id}
*/
export function canExitRoom(data = {}) {
	let { OP_CAN_EXIT_ROOM, OP_CAN_EXIT_ROOM_REPLY } = TYPES.OP_CAN_EXIT_ROOM
	ws.send(data, OP_CAN_EXIT_ROOM)
	
	return new Promise((resolve, reject) => {
		ws.capture(OP_CAN_EXIT_ROOM_REPLY, (data) => {
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

// OP_CAN_EXIT_ROOM
/**
 * 获取建房卡信息
 * @param {} data 
 */ 
export function getRoomCardSocket(data = {}) {
	let { OP_ROOM_CARD_LIST, OP_ROOM_CARD_LIST_REPLY } = TYPES.OP_ROOM_CARD_LIST
	
	ws.send(data, OP_ROOM_CARD_LIST)

	return new Promise((resolve, reject) => {
		ws.capture(OP_ROOM_CARD_LIST_REPLY, (data) => {
			// console.warn('获取建房卡对应的建房时需要的初始数据---->', data)
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

export function getUserHistoryRoom(data = {}) {
	let { OP_USER_HISTORY_ROOM, OP_USER_HISTORY_ROOM_REPLY } = TYPES.OP_USER_HISTORY_ROOM
	
	ws.send(data, OP_USER_HISTORY_ROOM)

	return new Promise((resolve, reject) => {
		ws.capture(OP_USER_HISTORY_ROOM_REPLY, (data) => {
			// console.warn('获取建房卡对应的建房时需要的初始数据---->', data)
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

// OP_USER_HISTORY_ROOM

/**
 * 获取建房卡对应的建房时需要的初始数据
 * @param {*} data 
 */
export function getRoomCarInitDataSocket(data = {}) {
	let { OP_ROOM_CARD_BASIC, OP_ROOM_CARD_BASIC_REPLY } = TYPES.OP_ROOM_CARD_BASIC
	
	ws.send(data, OP_ROOM_CARD_BASIC)
	
	return new Promise((resolve, reject) => {
		ws.capture(OP_ROOM_CARD_BASIC_REPLY, (data) => {
			// console.warn('获取建房卡对应的建房时需要的初始数据---->', data)
		
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}



/**
 * 添加房间
 * @param {} data 
 */
export function addRoomSocket(data = {}) {
	let { OP_ROOM_ADD, OP_ROOM_ADD_REPLY } = TYPES.OP_ROOM_ADD
	
	ws.send(data, OP_ROOM_ADD)
	
	return new Promise((resolve, reject) => {
		ws.capture(OP_ROOM_ADD_REPLY, (data) => {
			// console.warn('添加房间---->', data)
		
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

/**
 * 获取房间信息
 * @param {*} data 
 */
export function getRoomInfoSocket(data = {}) {
	let { OP_ROOM_DETAIL, OP_ROOM_DETAIL_REPLY } = TYPES.OP_ROOM_DETAIL

	ws.send(data, OP_ROOM_DETAIL)
	return new Promise((resolve, reject) => {
		
		ws.capture(OP_ROOM_DETAIL_REPLY, (data) => {
			// console.warn('获取房间信息成功---->')
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}


/**
 * 修改房间信息
 * @param {} data 
 */
export function modifyRoomInfoSocket(data = {}) {
	console.warn("99999999999999999999999")
	let { OP_ROOM_UPDATE, OP_ROOM_UPDATE_REPLY } = TYPES.OP_ROOM_UPDATE

	ws.send(data, OP_ROOM_UPDATE)
	return new Promise((resolve, reject) => {
		
		ws.capture(OP_ROOM_UPDATE_REPLY, (data) => {
			console.warn('修改房间信息返回码---->', OP_ROOM_UPDATE_REPLY)
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

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
				console.warn('resolve', data.body.result)
				
				resolve(data.body.result)
			} else {
				console.warn('reject', data.body.msg)

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


/**
 * 大厅房间查询
 * @param {*} data 
 */
export function publicRoomSearchSocket(data = {}) {
	let { OP_ROOM_SEARCH_HALL_LIST, OP_ROOM_SEARCH_HALL_LIST_REPLY } = TYPES.OP_ROOM_SEARCH_HALL_LIST_TITLE
	
	ws.send(data, OP_ROOM_SEARCH_HALL_LIST)
	return new Promise((resolve, reject) => {
		ws.capture(OP_ROOM_SEARCH_HALL_LIST_REPLY, (data) => {
			// console.warn('大厅房间查询---->', data)
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}


/**
 * 包间房间查询
 * @param {*} data 
 */
export function privateRoomSearchSocket(data = {}) {
	let { OP_ROOM_SEARCH_PRIVATE_LIST, OP_ROOM_SEARCH_PRIVATE_LIST_REPLY } = TYPES.OP_ROOM_SEARCH_PRIVATE_LIST_TITLE
	
	ws.send(data, OP_ROOM_SEARCH_PRIVATE_LIST)
	return new Promise((resolve, reject) => {
		ws.capture(OP_ROOM_SEARCH_PRIVATE_LIST_REPLY, (data) => {
			// console.warn('包间房间查询---->', data)
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

/**
 * 房间详情 - 房间记录
 * @param {*} data 
 */
export function roomRecordDataSocket(data = {}) {
	let { OP_ROOM_RECORD, OP_ROOM_RECORD_REPLY } = TYPES.OP_ROOM_RECORD_TITLE
	
	ws.send(data, OP_ROOM_RECORD)
	return new Promise((resolve, reject) => {
		ws.capture(OP_ROOM_RECORD_REPLY, (data) => {
			// console.warn('房间详情-房间记录---->', data)
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}


/**
 * 个人中心 - 我的账户 - 充值 - 获取支付渠道
 * @param {} data 
 */
export function getPaymentChannelSocket(data = {}) {
	let { OP_CAPITALFLOW_RECHARGE_GET_CHANNEL, OP_CAPITALFLOW_RECHARGE_GET_CHANNEL_REPLY } = TYPES.OP_CAPITALFLOW_RECHARGE_GET_CHANNEL
	
	ws.send(data, OP_CAPITALFLOW_RECHARGE_GET_CHANNEL)
	return new Promise((resolve, reject) => {
		ws.capture(OP_CAPITALFLOW_RECHARGE_GET_CHANNEL_REPLY, (data) => {
			// console.warn('获取支付渠道---->', data)
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}

/**
 * 个人中心 - 我的账户 - 充值 - 获取支付 商户
 * @param {} data 
 */
export function getPaymentMerchantSocket(data = {}) {
	let { OP_CAPITALFLOW_RECHARGE_GET_MERCHANT, OP_CAPITALFLOW_RECHARGE_GET_MERCHANT_REPLY } = TYPES.OP_CAPITALFLOW_RECHARGE_GET_MERCHANT

	ws.send(data, OP_CAPITALFLOW_RECHARGE_GET_MERCHANT)
	return new Promise((resolve, reject) => {
		ws.capture(OP_CAPITALFLOW_RECHARGE_GET_MERCHANT_REPLY, (data) => {
			// console.warn('获取支付 商户---->', data)
			
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}


/**
 * 个人中心 - 我的账户 - 充值 - 获取支付地址
 * @param {} data 
 */
export function getPaymentAddressSocket(data = {}) {
	let { OP_CAPITALFLOW_RECHARGE_GET_PAYURL, OP_CAPITALFLOW_RECHARGE_GET_PAYURL_REPLY } = TYPES.OP_CAPITALFLOW_RECHARGE_GET_PAYURL

	ws.send(data, OP_CAPITALFLOW_RECHARGE_GET_PAYURL)
	return new Promise((resolve, reject) => {
		ws.capture(OP_CAPITALFLOW_RECHARGE_GET_PAYURL_REPLY, (data) => {
			// console.warn('获取支付地址---->', data)
			
			if (data.body.status === 200) {
				resolve(data.body.result)
			} else {
				reject(data.body.msg)
			}
		})
	})
}



