/*
* 取随机数
*/
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)


/*
* 休眠等待
*/
export const sleep = async time => new Promise(resolve => setTimeout(resolve, time))

/*
*  get请求表单序列化
*/
export function param(data) {
	let url = ''
	for (let k in data) {
		let value = data[k] !== undefined ? data[k] : ''
		url += '&' + k + '=' + encodeURIComponent(value)
	}
	return url ? url.substring(1) : ''
}

/*
*  延迟函数
*/
export function debounce(func, delay) {
	let timer = null
	
	return function (...args) {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			func.apply(this, args)
		}, delay)
	}
}

/*
*  千位分隔符
*/

export function formatText(str, size = 3, delimiter = ',') {
	let _str = str.toString()
	/*
		如果_size是3
		reg = /\d{1,3}(?=(\d{3})+$)/g
		这个正则的意思：匹配连续的三个数字，但是这些三个数字不能是字符串的开头1-3个字符
	*/
	const reg = new RegExp('\\d{1,'+size+'}(?=(\\d{'+size+'})+$)', 'g')
	/*
		$0: 匹配的结果
		$1: (-?) 匹配前面的-号
		$2:(\d+)匹配中间的数字
		$3: ((\.\d+)?)匹配小数点后面的数字
	*/
	return _str.replace(/^(-?)(\d+)((\.\d+)?)$/, ($0, $1, $2, $3) => ($1 + $2.replace(reg, '$&'+delimiter) + $3))
}

/*
*  表单验证
*/

export function formValidator(form, rules, fun) {
	function vali(val, msg, reg, required = true) {
		if(required) { //必须
			if(!val || !reg.test(val)) {
				fun(msg)
				return false
			} else {
				return true
			}
		} else { //非必须
			if(!val) {
				return true
			} else if (!reg.test(val)) {
				fun(msg)
				return false
			} else {
				return true
			}
		}
	}
	let rtn = true
	for(let key in form) {
		rtn = rtn && vali(form[key], rules[key].message, rules[key].reg, rules[key].required)
		if(!rtn) {return false}
	}
	return true
}

/*
*  过滤非数字字符
*  fixed保留小数位
*/

export function filterNumber(value, fixed = 2) {
	return value.replace(/\.?|^0/g, '')
}

/*
* 组合成包含所有组合的数组
*/
export const powerset = arr => arr.reduce((a, v) => a.concat(a.map(r => [v].concat(r))), [[]])

/*
*  随机化数组的顺序
*/
export const shuffle = arr => arr.sort(() => Math.random() - 0.5)


/*
*  RGB到十六进制
*/

export const rgbToHex = (r, g, b) => ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')


/*
* URL参数 转对象
*/
export const getUrlParameters = url =>
	url.match(/([^?=&]+)(=([^&]*))/g)
		.reduce((a, v) => (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1), a), {})


/*
*  两点之间的距离
*/
export const distance = (pos1 = {x0: 0, y0: 0}, pos2 = {x1: 0, y1: 0}) => Math.hypot(pos2.x1 - pos1.x0, pos2.y1 - pos1.y0);

/*
*  数组之间的区别
*   difference([1,2,3], [1,2]) -> [3]
*/
export const difference = (a, b) => {
	const s = new Set(b)
	return a.filter(x => !s.has(x))
}

/*
*  多维数组解构
*  deepFlatten([1,[2],[[3],4],5]) -> [1,2,3,4,5]
*/
export const deepFlatten = arr => arr.reduce((a, v) => a.concat(Array.isArray(v) ? deepFlatten(v) : v), [])


/*
* 日期格式化
* date--> 可以是 时间戳 和 标准的日期格式
* fmt 年月日时分秒 --> 'yyyy-MM-dd hh:mm:ss'
* ex --> format(new Date(), 'yyyy-MM-dd hh:mm:ss')
* -----> 2018-05-04 17:21:02
*/

export function format(date, fmt) {
	// let difference = 1000*60*60*8	// 8小时对应的时间戳的值
	// let data = date + difference
	date = new Date(date)

	let o = {
		'M+': date.getMonth() + 1, // 月份
		'd+': date.getDate(), // 日
		'h+': date.getHours(), // 小时
		// 'h+': date.getHours(),
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		'S': date.getMilliseconds() // 毫秒
	}
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	for (let k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
	}
	return fmt
}



// 異步數組 順步執行
export function promiseStep(arr = []) {
	arr.reduce((acc, cur) => acc.then(cur), Promise.resolve())
}

/*
 *  通用版 单一请求 多个Promise同步化
 *  fun  ----> 异步函数
 *  arr  ----> 异步函数需要的参数数组
 *  handler -> 异步函数的回调
 */
function syncasynFun(fun, arr = [], handler = () => {}) {
	if (typeof fun !== 'function') {
		throw new TypeError('第一个参数必须是一个函数-.-')
	}
	if (!Array.isArray(arr)) {
		throw new TypeError('第二个参数必须是数组')
	}
	handler = typeof fun === 'function' ? handler : () => {}
	const errors = []
	
	function asynFun(index) {
		if (index >= arr.length) {
			return errors.length > 0 ? Promise.reject(errors) : Promise.resolve()
		}
		
		return fun(arr[index])
			.then(data => handler(data))
			.catch(err => {
				// console.log(err)
				errors.push(arr[index])
				return asynFun(index + 1)
			})
			.then(() => asynFun(index + 1))
	}
	
	return asynFun(0)
}

/*
* 将特殊字符转 html 编码防止脚本注入
*/
export function htmlEncodeByRegExp(str) {
	if (str.length <= 0) {
		return ''
	}
	const reg = [/&/g, /</g, />/g, / /g, /\'/g, /\"/g]
	const encode = ['&amp;', '&lt;', '&gt;', '&nbsp;', '&#39;', '&quot;']
	
	const exchanges = [
		{
			reg: /&/g,
			code: '&amp;'
		},
		{
			reg: /</g,
			code: '&lt;'
		},
		{
			reg: />/g,
			code: '&gt;'
		},
		{
			reg: / /g,
			code: '&nbsp;'
		},
		{
			reg: /\'/g,
			code: '&#39;'
		},
		{
			reg: /\"/g,
			code: '&quot;'
		}
	]
	
	exchanges.forEach(item => {
		str = str.replace(item.reg, item.code)
	})
	
	return str
}

/**
 * 按步长生成数组
 */
export function getArr(min, max, step) {
	let arr = new Array()
	for(let i=0; i< Math.floor((max  - min) / step) + 1; i++) {
		let val = min + step * i
		if(val !== 0) {
			arr.push({message: val})
		}
	}
	return arr
}


/**
 * 获取当前时间
 */
export function getCurrentDate() {

	 myDate.getFullYear(); //获取完整的年份(4位,1970-????)
	myDate.getMonth(); //获取当前月份(0-11,0代表1月)
	 myDate.getDate(); //获取当前日(1-31)

	 myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
	 myDate.getHours(); //获取当前小时数(0-23)
	 myDate.getMinutes(); //获取当前分钟数(0-59)
	 myDate.getSeconds(); //获取当前秒数(0-59)

   	 myDate.toLocaleDateString(); //获取当前日期
   	 var mytime=myDate.toLocaleTimeString(); //获取当前时间
   	 myDate.toLocaleString( ); //获取日期与时间
}

/**
 * 时间转时间戳  会有8小时误差,暂未处理误差
 */
export function timeToTimestamp(date) {
	return new Date(date.replace(/-/g,'/')).getTime()
}