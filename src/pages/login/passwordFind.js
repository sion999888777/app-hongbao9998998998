import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet, TextInput, Dimensions
} from 'react-native'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import NavigationBar from '../../components/NavigationBar'
import WidgetView from "../../common/headerLeft";
import { Icon } from '../../components/icon'

import { findPassword, getSmsCode } from '../../request/api/loginApi'
import SyncStorage from '../../util/syncStorage';

const height = Dimensions.get('window').height

// 如果点击发送了验证码 设置为true
let isSendMessage = false
const COUNT = 60

import { phoneReg, codeReg } from '../../configs/regular'


export default class PasswordFind extends Component {
	constructor(props) {
		super(props)
		
		this.state = {
			userInfo: null,
			code: '获取验证码',
			phoneNumber: '',
			codeNumber: '',
			showErrorTip: ''
		}
	}
	
	onBack() {
		this.props.navigation.goBack()
	}
	
	//获取验证码
	getCode() {
		// 如果已经发送了 正在倒计时 return
		if (isSendMessage) {
			return false
		}
		
		// 发送验证码
		let count = COUNT
		let timer = null
		
		let resolve = this._getSmsCode()
		if (!resolve) return false
		resolve
			.then((res) => {
				if (res.status !== "200") {
					setTimeout(() => this.setState({showErrorTip: res.msg}), 10)
					return
				}
				isSendMessage = true
				timer = setInterval(() => {
					count--
					
					if (count < 0) {
						clearInterval(timer)
						timer = null
						isSendMessage = false
						this.setState({code: '重新发送'})
						return false
					}
					
					this.setState({code: count + 's'})
				}, 1000)
			})
	}
	
	// 提交找回密码
	confirmResetPwd() {
		if (!phoneReg.test(String(this.state.phoneNumber).replace(/\s+/, ''))) {
			
			setTimeout(() => this.setState({showErrorTip: '手机号码格式不正确'}), 100)
			
		} else if (!codeReg.test(String(this.state.codeNumber))) {
			
			setTimeout(() => this.setState({showErrorTip: '验证码不正确'}), 100)
			
		} else {
			this.setState({showErrorTip: ''})
			
			// 发请求
			this._findPassword()
		}
	}
	
	// 找回密码, 短信验证成功,跳转到重置密码
	_findPassword() {
		let data = {
			phoneNum: this.state.phoneNumber,
			type: 2,
			vertifyCode: this.state.codeNumber
		}
		
		findPassword(data)
			.then(res => {
				if (res.status !== '200') {
					setTimeout(() => this.setState({showErrorTip: res.msg}), 10)
				} else {
					SyncStorage.setItem('token', res.data)
					SyncStorage.setItem('phone', this.state.phoneNumber)
					this.props.navigation.navigate('PasswordReset')
				}
			})
	}
	
	// 获取验证码
	_getSmsCode() {
		this.setState({showErrorTip: ''})
		let phoneNum = this.state.phoneNumber
		
		if (!phoneReg.test(String(phoneNum).replace(/\s+/, ''))) {
			setTimeout(() => this.setState({showErrorTip: '请输入正确的接收短信手机号!'}), 10)
			return false
		}
		
		let data = {
			phoneNum,
			isInternational: '1', // 0国际 1国内
			type: '2' // 1注册 2找回密码
		}
		
		return getSmsCode(data)
	}
	
	//
	
	render() {
		return (
			<SafeAreaViewPlus  
				topColor={'#fff'}
				bottomInset={false}>
				<NavigationBar
					style={{backgroundColor: '#fff',borderBottomWidth: 1, borderBottomColor: '#d7d7d7'}}
					title = "找回密码"
					titleStyle={{color: '#333'}}
					statusBar={{
						backgroundColor: '#fff'
					}}
					leftButton={WidgetView.getLeftButton(() => this.onBack(), '#333')}
				/>
				
				<View style={styles.container}>
					<View style={styles.formGroup}>
						<Icon name={'privateIcon|shouji'} size={18} color={'#909090'} />
						<TextInput
							placeholder="注册手机号"
							style={{marginLeft: 12}}
							onChangeText={(phoneNumber) => this.setState({phoneNumber})}/>
					</View>
					
					<View style={styles.getCode}>
						<View style={{flexDirection: 'row', alignItems:'center'}}>
							<Icon name={'privateIcon|mima'} size={9} color={'#909090'} />
							<TextInput
								placeholder="短信验证码"
								style={{marginLeft: 12}}
								onChangeText={(codeNumber) => this.setState({codeNumber})}/>
						</View>
						
						<TouchableOpacity style={styles.codeBtn} onPress={() => this.getCode()}>
							<Text style={{textAlign: 'center', fontSize: 10, lineHeight: 30}}>{this.state.code}</Text>
						</TouchableOpacity>
					</View>
					
					<Text style={styles.tip}>{this.state.showErrorTip}</Text>
					
					<TouchableOpacity
						style={styles.confirmBtn}
						onPress={() => this.confirmResetPwd()}>
						<Text style={{color: "#fff", textAlign: 'center', lineHeight: 40}}>确 认</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaViewPlus>
		)
	}
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 40,
		borderBottomColor: '#d7d7d7',
		borderBottomWidth: 1,
		paddingLeft: 10,
		paddingRight: 10,
	},
	container: {
		height,
		paddingTop: 30,
		paddingBottom: 30,
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: '#fff'
	},
	title: {
		flex: 1,
		fontSize: 16,
		textAlign: 'center',
		marginLeft: -40
	},
	back: {
		width: 40,
	},
	btn: {
		flex: 1,
		color: '#0ba818',
		padding: 10,
		width: 120,
	},
	
	formGroup: {
		borderBottomColor: '#d7d7d7',
		borderBottomWidth: 1,
		height: 40,
		marginBottom: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	getCode: {
		borderBottomColor: '#d7d7d7',
		borderBottomWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	
	codeBtn: {
		backgroundColor: "#d7d7d7",
		paddingLeft: 10,
		paddingRight: 10,
		height: 30,
		borderRadius: 5,
		marginTop: 5,
		color: "#333"
	},
	
	confirmBtn: {
		backgroundColor: "#0ba818",
		height: 40,
		lineHeight: 40,
		borderRadius: 5,
		marginTop: 30,
	},
	
	tip: {
		color: '#ff3d3d',
		height: 40,
		lineHeight: 40
	}
})