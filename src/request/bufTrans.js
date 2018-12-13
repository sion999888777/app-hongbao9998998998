import SyncStorage from "../util/syncStorage";
//const Protobuf = require("protobufjs")
const protobufRoot  = require("protobufjs").Root
//const ByteBuffer = require("bytebuffer")
import { AsyncStorage } from 'react-native'
// 用户信息
const auth = require("./proto/auth.json")

// 传递消息体
const message = require("./proto/message.json")


const rawHeaderLen = 16,
	packetOffset = 0,
	headerOffset = 4,
	verOffset = 6,
	opOffset = 8,
	seqOffset = 12;

const opAuth = 1,
	opAuthReply=2,
	opHeartbeat=3,
	opHeartbeatReply=4,
	opMessage=5,
	opMessageReply=6;


//将消息转换 buffer 传递给后端
export function sendMessage(obj, type) {
	const root = protobufRoot.fromJSON(message)
	const msgBody = root.lookupTypeOrEnum('MsgData')
	
	let data = {}
	
	data.to = 1
	data.from = SyncStorage.getItem('token')
	data.ctime = new Date().getTime()
	data.type = type
	
	
//	obj = new ByteBuffer()
//		.writeIString(encodeURI(JSON.stringify(obj)))
//		.flip()
	
	data.data = JSON.stringify(obj)
	
//	let errMsg = msgBody.verify(data)
//
//	if (errMsg) { console.warn('消息格式错误', errMsg) }
	
	const bodyBuf = msgBody.encode(msgBody.create(data)).finish()
	
	// let body = msgBody.decode(bodyBuf)
	// console.warn('解析报文', JSON.parse(body.data))
	
	let headerbuf = createHeaderBuf(bodyBuf.byteLength, type)
	
	 return mergeArrayBuffer(headerbuf, bodyBuf)
}

// 获取用户TOKEN请求体buf长度
async function getAuthBuf() {
	const root = protobufRoot.fromJSON(auth)
	const authReq = root.lookupType('auth.AuthReq')
	
	let token = await AsyncStorage.getItem('token').then()
	
	if (!token) return null
	let authInfo = {
		uid: '123',
		token
	}

	let authBuffer = authReq.encode(authReq.create(authInfo)).finish()
	
	return authBuffer
}


// 合并BUFF
function mergeArrayBuffer(buf1, buf2) {
	const u81 = new Uint8Array(buf1),
		u82 = new Uint8Array(buf2),
		res = new Uint8Array(buf1.byteLength + buf2.byteLength)
	res.set(u81, 0)
	res.set(u82, buf1.byteLength)
	return res.buffer
}



//用户认证
export async function regAuth() {
	const bodyBuf = await getAuthBuf()
	
	return mergeArrayBuffer(createHeaderBuf(bodyBuf.byteLength), bodyBuf)
}

// 生成头部 headerBuf
export function createHeaderBuf(bodyBufLength, type = opAuth) {
	let headerBuf = new ArrayBuffer(rawHeaderLen)
	let headerView = new DataView(headerBuf, 0)
	
	headerView.setInt32(packetOffset, rawHeaderLen + bodyBufLength)
	headerView.setInt16(headerOffset, rawHeaderLen)
	headerView.setInt16(verOffset, 1)
	headerView.setInt32(opOffset, type) // 接口类型
	headerView.setInt32(seqOffset, 1) // 头部信息
	
	return headerBuf
}

/*
* 接收 buffer
* 解析成 object
*/
export function processData(bufdata) {
	const dataView = new DataView(bufdata, 0)
	let packetLen = dataView.getInt32(packetOffset)
	let headerLen = dataView.getInt16(headerOffset)
	const ver = dataView.getInt16(verOffset)
	// 返回的消息类型
	const op = dataView.getInt32(opOffset)
	const seq = dataView.getInt32(seqOffset)
	
	// console.warn("packetLen=" + packetLen, "headerLen=" + headerLen, "ver=" + ver, "op=" + op, "seq=" + seq)
	
	// 消息解析
	const packetView = dataView;
	const msg = bufdata;
	let body = null;
	
	for (let offset = 0; offset < msg.byteLength; offset += packetLen) {
		packetLen = packetView.getInt32(offset)
		headerLen = packetView.getInt16(offset + headerOffset)
		body = msg.slice(offset + headerLen, offset + packetLen)

		try {
			body = JSON.parse(utf8ByteToUnicodeStr(new Uint8Array(body)))
		} catch(err) {
			console.warn('解析出错', err)
		}
	}

	return {
		body,
		type: op
	}
}

/**
 * utf8 byte to unicode string
 * @param utf8Bytes
 * @returns {string}
 */
function utf8ByteToUnicodeStr(utf8Bytes){
	var unicodeStr ="";
	for (var pos = 0; pos < utf8Bytes.length;){
		var flag= utf8Bytes[pos];
		var unicode = 0;
		if ((flag >>>7) === 0 ) {
			unicodeStr+= String.fromCharCode(utf8Bytes[pos]);
			pos += 1;
			
		} else if ((flag &0xFC) === 0xFC ){
			unicode = (utf8Bytes[pos] & 0x3) << 30;
			unicode |= (utf8Bytes[pos+1] & 0x3F) << 24;
			unicode |= (utf8Bytes[pos+2] & 0x3F) << 18;
			unicode |= (utf8Bytes[pos+3] & 0x3F) << 12;
			unicode |= (utf8Bytes[pos+4] & 0x3F) << 6;
			unicode |= (utf8Bytes[pos+5] & 0x3F);
			unicodeStr+= String.fromCharCode(unicode) ;
			pos += 6;
			
		}else if ((flag &0xF8) === 0xF8 ){
			unicode = (utf8Bytes[pos] & 0x7) << 24;
			unicode |= (utf8Bytes[pos+1] & 0x3F) << 18;
			unicode |= (utf8Bytes[pos+2] & 0x3F) << 12;
			unicode |= (utf8Bytes[pos+3] & 0x3F) << 6;
			unicode |= (utf8Bytes[pos+4] & 0x3F);
			unicodeStr+= String.fromCharCode(unicode) ;
			pos += 5;
			
		} else if ((flag &0xF0) === 0xF0 ){
			unicode = (utf8Bytes[pos] & 0xF) << 18;
			unicode |= (utf8Bytes[pos+1] & 0x3F) << 12;
			unicode |= (utf8Bytes[pos+2] & 0x3F) << 6;
			unicode |= (utf8Bytes[pos+3] & 0x3F);
			unicodeStr+= String.fromCharCode(unicode) ;
			pos += 4;
			
		} else if ((flag &0xE0) === 0xE0 ){
			unicode = (utf8Bytes[pos] & 0x1F) << 12;;
			unicode |= (utf8Bytes[pos+1] & 0x3F) << 6;
			unicode |= (utf8Bytes[pos+2] & 0x3F);
			unicodeStr+= String.fromCharCode(unicode) ;
			pos += 3;
			
		} else if ((flag &0xC0) === 0xC0 ){ //110
			unicode = (utf8Bytes[pos] & 0x3F) << 6;
			unicode |= (utf8Bytes[pos+1] & 0x3F);
			unicodeStr+= String.fromCharCode(unicode) ;
			pos += 2;
			
		} else{
			unicodeStr+= String.fromCharCode(utf8Bytes[pos]);
			pos += 1;
		}
	}
	return unicodeStr;
}