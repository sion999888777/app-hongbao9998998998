import React, { Component } from 'react'
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Dimensions,
	TouchableOpacity, AsyncStorage, DeviceEventEmitter
} from 'react-native'
import SafeAreaViewPlus from '../../common/ios-private/SafeAreaViewPlus'

import { register, getSmsCode } from '../../request/api/loginApi'
import SyncStorage from '../../util/syncStorage';
// 标记是否发送了短信
let isSendMessage = false

import NavigationBar from '../../components/NavigationBar'
import WidgetView from '../../common/headerLeft'
import Button from '../../components/Button/index'
import ws from '../../request/socket'
import { Icon } from '../../components/icon'

const height = Dimensions.get('window').height

import { phoneReg, pwdReg, codeReg } from '../../configs/regular'

const COUNT = 60 // 倒计时时间

export default class Register extends Component {
	constructor(props) {
		super(props)
		
		this.state = {
			phoneNumber: '',
			codeNumber: '',
			password: '',
			showPwd: false,
			code: '获取验证码',
			invitation: '', // 邀请码
			termsState: true,
			showErrorTip: false // 显示错误提示
		}

		this.count = COUNT
	}
	
	onBack() {
		this.props.navigation.goBack()
	}
	
	// 密码可见切换
	changePwdType() {
		let flag = this.state.showPwd
		
		this.setState({
			showPwd: !flag
		})
	}
	
	/*
	// 获取短信验证码
	getCode() {
		// 如果已经发送了 正在倒计时 return
		if (isSendMessage) {
			return false
		}
		
		this.setState({codeNumber: ''})
		
		// 发送间隔时间
		let count = 10
		
		// 发送验证码
		let resolve = this._getSmsCode()
		if (!resolve) return false
		resolve
			.then((res) => {
				if (res.status !== "200") {
					setTimeout(() => this.setState({showErrorTip: res.msg}), 10)
					return
				}
				
				// 发送短信成功 之后开始倒计时
				isSendMessage = true
				let timer = setInterval(() => {
					count--
					
					// 倒计时结束后才可以重新发送短信
					if (count < 0) {
						clearInterval(timer)
						timer = null
						isSendMessage = false
						this.setState({code: '重新发送'})
						return false
					}
					
					this.setState({code: count + 's 重发'})
				}, 1000)
			})
	}
	*/

	// 获取短信验证码
	getCode = () => {
		this.setState({showErrorTip: ''})

		if (!phoneReg.test(String(this.state.phoneNumber).replace(/\s+/, ''))) {
			setTimeout(() => this.setState({showErrorTip: '请输入正确的接收短信手机号!'}), 10)
			return false
		}

		// 如果已经发送了 正在倒计时 return
		if (this.count < COUNT && this.count > 0) {
			return false
		}
		
		this.setState({codeNumber: ''})

		this.count = COUNT - 1
		this.countTime()
		// 发送验证码
		this._getSmsCode()
	}

  // 获取短信倒计时 
	countTime() {
		let timer = setInterval(() => {
			this.count--
			
			// 倒计时结束后才可以重新发送短信
			if (this.count < 0) {
				clearInterval(timer)
				timer = null
				this.setState({code: '重新发送'})
				return false
			}
			
			this.setState({code: this.count + 's'})
		}, 1000)
	}

	
	// 确认提交注册
	confirm() {
		const phone = phoneReg.test(String(this.state.phoneNumber).replace(/\s+/, ''))
		const code = codeReg.test(this.state.codeNumber)
		const pwd = pwdReg.test(this.state.password)
		
		
		if (!phone) {
			setTimeout(() => this.setState({showErrorTip: '手机号码格式不正确'}), 10)
			return
		} else if (!code) {
			setTimeout(() => this.setState({showErrorTip: '短信验证码有误'}), 10)
			return
		} else if (!pwd) {
			setTimeout(() => this.setState({showErrorTip: '密码必须为6位以上数字加字母组合'}), 10)
			return
		}
		
		this.setState({showErrorTip: ''})
		// 提交注册信息
		this._register()
	}
	
	// 同意条款
	agreeTerms() {
		let termsState = !this.state.termsState
		this.setState({termsState})
	}
	
	// 获取验证码
	_getSmsCode() {
		let phoneNum = this.state.phoneNumber
		
		let data = {
			phoneNum,
			isInternational: '1', // 0国际 1国内
			type: '1' // 1注册 2找回密码
		}
		this.setState({codeNumber: ''})
		getSmsCode(data)
		.then(() => {})
		.catch(err => {
			this.setState({showErrorTip: err})
		})
	}
	
	// 注册
	_register() {
		let data = {
			"phone": this.state.phoneNumber,
			"password": this.state.password,
			"smsCode": this.state.codeNumber,
			"nickname": "",
			"invitation": this.state.invitation,
			"gender": ""
		}
		
		register(data)
			.then(async res => {
				if (res.status !== "200") {
					setTimeout(() => this.setState({showErrorTip: res.msg}), 10)
				} else {
					// 存储token 跳转到首页
					// 这是处理非首次登录情况
					await AsyncStorage.setItem('token', res.data)
					
//					ws.close()
//					ws.init()
					this.props.navigation.pop()
					DeviceEventEmitter.emit('login', '登录成功')
//					const { navigate } = this.props.navigation
//
//					setTimeout(() => navigate("IndexPage"), 100)
				}
			})
	}
	 
	render() {
		const { navigate } = this.props.navigation
		
		return (
			<SafeAreaViewPlus  
				topColor={'#fff'}
				bottomInset={false}>
				<View style={{backgroundColor: '#fff', height}}>
					<NavigationBar
						style={{backgroundColor: '#fff', borderBottomColor: '#d7d7d7', borderBottomWidth: 1}}
						title = "注册"
						titleStyle={{color: '#333'}}
						statusBar={{
							backgroundColor: '#fff'
						}}
						leftButton={WidgetView.getLeftButton(() => this.onBack(), '#000')}
					/>

					<View style={[styles.container, {marginTop: 30}]}>
						<View style={styles.formGroup}>
							<Icon name={'privateIcon|shouji'} size={18} color={'#909090'} />
							<TextInput
								style={styles.inputText}
								maxLength={16}
								placeholder="手机号"
								onChangeText={phoneNumber => this.setState({phoneNumber})}/>
						</View>
						
						<View style={[styles.getCode, {marginBottom: 10}]}>
							<View style={{flexDirection: 'row', alignItems:'center'}}>
								<Icon name={'privateIcon|duanxin'} size={14} color={'#909090'} />
								<TextInput
									style={styles.inputText}
									placeholder="短信验证码"
									onChangeText={codeNumber => this.setState({codeNumber})}/>
							</View>
							
							<TouchableOpacity style={styles.codeBtn} onPress={ () => this.getCode() }>
								<Text style={{textAlign: 'center', fontSize: 10, lineHeight: 30}}>{this.state.code}</Text>
							</TouchableOpacity>
						</View>
						
						<View style={[styles.formGroup, {flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10}]}>
							<View style={{flexDirection: 'row', alignItems:'center'}}>
								<Icon name={'privateIcon|suo'} size={16} color={'#909090'} />
								<TextInput
									style={styles.inputText}
									placeholder="密码"
									secureTextEntry={ !this.state.showPwd }
									onChangeText={(password) => this.setState({password})}/>
							</View>
							
							
							{
								this.state.showPwd ?
									<TouchableOpacity onPress={() => this.changePwdType()} >
										<Icon name={'privateIcon|mimakejian'} size={12} color={'#54a45a'} />
									</TouchableOpacity>
									:
									<TouchableOpacity onPress={() => this.changePwdType()} >
										<Icon name={'privateIcon|mimayincang'} size={12} />
									</TouchableOpacity>
							}
						</View>
						
						{/*邀请码*/}
						<View style={[styles.formGroup]}>
							<Icon name={'privateIcon|yaoqing'} size={18} color={'#909090'} />
							<TextInput
								style={styles.inputText}
								maxLength={12}
								placeholder="邀请码"
								onChangeText={invitation => { this.setState({invitation}) }}/>
						</View>
						
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<Text style={{fontFamily: 'iconfont', marginRight: 5}} onPress={() => this.agreeTerms()}>
								{
									this.state.termsState ?
									<Icon name={'privateIcon|yiqueren'} color={'#0ba818'} />
									: 
									<Icon name={'privateIcon|weiqueren'} color={'#0ba818'} />
								}
								&nbsp;&nbsp;已认真阅读并同意《
							</Text>
							<Text style={{color: '#0ba818'}} onPress={() => navigate('UserAgreement')}>用户服务协议</Text>
							<Text>》</Text>
						</View>
						
						<View style={{marginTop: 50}}>
							<Text style={styles.tip}>{this.state.showErrorTip}</Text>
						</View>
						
						<View>
							<Button color="#fff"
									buttonStyle={{
										backgroundColor: "#0ba818",
										height: 40,
										borderRadius: 5,
										marginTop: 5
									}}
									enable={this.state.termsState}
									onPress={() => this.confirm()}
									text="确认"/>
						</View>
					</View>
				</View>
			</SafeAreaViewPlus>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		paddingLeft: 35,
		paddingRight: 35
	},
	// 底部1px
	formGroup: {
		borderBottomColor: '#d7d7d7',
		borderBottomWidth: 1,
		flexDirection: 'row',
		height: 40,
		alignItems: 'center',
		marginBottom: 10
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
	tip: {
		color: '#ff3d3d',
		height: 40,
		lineHeight: 40
	},
	inputText: {
		marginLeft: 10,
		width: 200
	}
})